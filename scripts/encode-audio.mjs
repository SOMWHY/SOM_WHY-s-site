/**
 * 音频重编码脚本
 *
 * 背景：源音频是 192kbps CBR（合计约 14 MB），且放在 public/ 下没有内容哈希，无法做长缓存。
 * 本脚本把 src/assets/audio 的源文件重编码到更低码率，输出到 public/assets/audio 并带上内容哈希，
 * 同时回写 src/data/songs.json 的 audio 字段。
 *
 * 用法：
 *   npm run audio:encode                 # 默认 96kbps
 *   npm run audio:encode -- --bitrate=128
 *
 * 产物会被提交进仓库，因此线上构建无需 ffmpeg；脚本仅供后续需要重新压制时执行。
 */

import { spawnSync } from "node:child_process"
import { createHash } from "node:crypto"
import { createRequire } from "node:module"
import {
  existsSync,
  mkdirSync,
  readFileSync,
  readdirSync,
  renameSync,
  rmSync,
  statSync,
  writeFileSync,
} from "node:fs"
import { dirname, extname, join, relative, resolve } from "node:path"
import { fileURLToPath } from "node:url"

const require = createRequire(import.meta.url)
const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..")
const SOURCE_DIR = join(ROOT, "src", "assets", "audio")
const OUT_DIR = join(ROOT, "public", "assets", "audio")
const SONGS_JSON = join(ROOT, "src", "data", "songs.json")

/** public 下的资源在运行时以 /assets/... 访问 */
const PUBLIC_PREFIX = "/assets/audio/"

function parseArgs(argv) {
  const args = { bitrate: "96k" }
  for (const arg of argv) {
    if (arg.startsWith("--bitrate=")) args.bitrate = arg.slice("--bitrate=".length)
  }
  return args
}

function resolveFfmpeg() {
  try {
    const { path } = require("@ffmpeg-installer/ffmpeg")
    if (path && existsSync(path)) return path
  } catch {
    /* fall through */
  }
  throw new Error(
    "未找到 ffmpeg。请先安装依赖：npm i -D @ffmpeg-installer/ffmpeg",
  )
}

/** 用产物内容做短哈希，保证内容变化时 URL 一定变 */
function contentHash(file) {
  return createHash("sha256").update(readFileSync(file)).digest("hex").slice(0, 8)
}

function formatKB(bytes) {
  return `${(bytes / 1024).toFixed(1)} KB`
}

function main() {
  const args = parseArgs(process.argv.slice(2))
  const ffmpeg = resolveFfmpeg()

  mkdirSync(OUT_DIR, { recursive: true })

  const sources = readdirSync(SOURCE_DIR).filter((f) => extname(f) === ".mp3")
  if (sources.length === 0) {
    throw new Error(`源目录没有 mp3：${SOURCE_DIR}`)
  }

  console.log(`[audio] 目标码率 ${args.bitrate}，共 ${sources.length} 个源文件`)
  const produced = []

  for (const source of sources) {
    const base = source.slice(0, -extname(source).length)
    const srcPath = join(SOURCE_DIR, source)
    const tmpPath = join(OUT_DIR, `${base}.tmp${Date.now()}.mp3`)

    const result = spawnSync(
      ffmpeg,
      [
        "-hide_banner",
        "-loglevel", "error",
        "-y",
        "-i", srcPath,
        "-map_metadata", "0",
        "-codec:a", "libmp3lame",
        "-b:a", args.bitrate,
        "-ar", "44100",
        "-ac", "2",
        tmpPath,
      ],
      { encoding: "utf8" },
    )

    if (result.status !== 0 || !existsSync(tmpPath)) {
      rmSync(tmpPath, { force: true })
      throw new Error(`编码失败：${source}\n${result.stderr ?? ""}`.trim())
    }

    const hash = contentHash(tmpPath)
    const finalName = `${base}.${hash}.mp3`
    const finalPath = join(OUT_DIR, finalName)
    renameSync(tmpPath, finalPath)

    // 清理同一 base 的历史产物，避免旧音频在 dist 里堆积
    for (const existing of readdirSync(OUT_DIR)) {
      if (existing === finalName) continue
      if (existing === source || (existing.startsWith(`${base}.`) && existing.endsWith(".mp3"))) {
        rmSync(join(OUT_DIR, existing), { force: true })
      }
    }

    produced.push({ source, base, finalName })
    const before = statSync(srcPath).size
    const after = statSync(finalPath).size
    console.log(
      `[audio] ${source}\t${formatKB(before)} -> ${formatKB(after)}\t(-${(100 - (after / before) * 100).toFixed(1)}%)\t${finalName}`,
    )
  }

  // 回写 songs.json
  const raw = readFileSync(SONGS_JSON, "utf8")
  let updated = raw
  let replaced = 0

  for (const { source, finalName } of produced) {
    const before = `${PUBLIC_PREFIX}${source}`
    const after = `${PUBLIC_PREFIX}${finalName}`
    if (updated.includes(before)) {
      updated = updated.split(before).join(after)
      replaced += 1
    }
    // 已经是带哈希的旧产物时，同样需要指向新文件
    const pattern = new RegExp(`/assets/audio/${source.slice(0, -4)}\\.[0-9a-f]{8}\\.mp3`, "g")
    updated = updated.replace(pattern, after)
  }

  if (updated !== raw) {
    writeFileSync(SONGS_JSON, updated)
  }

  const totalBefore = produced.reduce((s, p) => s + statSync(join(SOURCE_DIR, p.source)).size, 0)
  const totalAfter = produced.reduce((s, p) => s + statSync(join(OUT_DIR, p.finalName)).size, 0)
  console.log(
    `[audio] 完成。总裸体积 ${formatKB(totalBefore)} -> ${formatKB(totalAfter)}（-${(100 - (totalAfter / totalBefore) * 100).toFixed(1)}%）`,
  )
  console.log(`[audio] songs.json 已更新 ${replaced} 条 audio 引用（${relative(ROOT, SONGS_JSON).replace(/\\/g, "/")}）`)
}

main()
