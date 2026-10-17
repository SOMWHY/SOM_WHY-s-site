/**
 * 汉字子集化脚本
 *
 * 作用：把 Google Fonts 的 `@import` 换成本地自托管时，若直接使用完整中文字体（单权重约 10 MB），
 * 体积无法接受。本脚本按"站内真实用到的字符"精确裁切，产物通常在几十 KB 量级。
 *
 * 依赖：subset-font（harfbuzzjs WASM，纯 WASM 无原生编译）+ @expo-google-fonts/noto-sans-sc（全量 TTF 源）
 * 用法：npm run fonts:build，或 node scripts/subset-fonts.mjs 100 300 400 500 700
 */

import { readFileSync, writeFileSync, mkdirSync, readdirSync, statSync } from "node:fs"
import { createRequire } from "node:module"
import { dirname, join, relative, resolve } from "node:path"
import { fileURLToPath } from "node:url"

const require = createRequire(import.meta.url)
const subsetFont = require("subset-font")

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..")
const OUT_DIR = join(ROOT, "src", "assets", "fonts")
const SOURCE_FONT_DIR = join(
  ROOT,
  "node_modules",
  "@expo-google-fonts",
  "noto-sans-sc",
)

/** 字重 -> 源字体文件名（@expo-google-fonts/noto-sans-sc 的目录命名约定） */
const WEIGHT_FILES = {
  100: "100Thin/NotoSansSC_100Thin.ttf",
  200: "200ExtraLight/NotoSansSC_200ExtraLight.ttf",
  300: "300Light/NotoSansSC_300Light.ttf",
  400: "400Regular/NotoSansSC_400Regular.ttf",
  500: "500Medium/NotoSansSC_500Medium.ttf",
  600: "600SemiBold/NotoSansSC_600SemiBold.ttf",
  700: "700Bold/NotoSansSC_700Bold.ttf",
}

/**
 * 参与字符集扫描的文件后缀。
 * .md 必须包含在内：文章与项目正文是页面真实内容，漏扫会导致汉字掉回系统字体。
 * 而产物目录 src/assets/fonts 里没有这些后缀，不会自引用。
 */
const SCAN_EXTENSIONS = new Set([".js", ".jsx", ".json", ".css", ".html", ".md"])

/** 无论是否出现在源码里都要保留的字符：ASCII 可见字符 + 常用排版符号 */
const BASE_CHARS = (() => {
  const chars = []
  for (let code = 0x20; code <= 0x7e; code += 1) chars.push(String.fromCodePoint(code))
  // 通用标点（含破折号、省略号、引号等），CJK 文本中高频出现
  for (let code = 0x2010; code <= 0x203b; code += 1) chars.push(String.fromCodePoint(code))
  return [...new Set(chars)]
})()

/** 需要从源码中提取的非 ASCII 范围 */
const CJK_RANGES = [
  [0x00a0, 0x00ff], // Latin-1 补充
  [0x2000, 0x206f], // 通用标点
  [0x20a0, 0x20bf], // 货币符号
  [0x2100, 0x214f], // 字母式符号
  [0x2190, 0x21ff], // 箭头
  [0x2460, 0x24ff], // 带圈数字
  [0x2500, 0x257f], // 制表符
  [0x25a0, 0x25ff], // 几何图形
  [0x2600, 0x27bf], // 杂项符号 / 装饰符号
  [0x2e80, 0x2eff], // CJK 部首补充
  [0x3000, 0x303f], // CJK 标点符号（含「」【】等全角标点）
  [0x3040, 0x30ff], // 日文平假名 / 片假名
  [0x3400, 0x4dbf], // CJK 扩展 A
  [0x4e00, 0x9fff], // CJK 基本区（汉字的主体）
  [0xf900, 0xfaff], // CJK 兼容表意文字
  [0xfe30, 0xfe4f], // CJK 兼容形式
  [0xff00, 0xffef], // 全角 / 半角形式
]

/**
 * 去掉注释后再取字符。
 * 注释里的汉字不会出现在页面上，混进字符集会让子集白白变大。
 * 行注释的 // 要求前面不是 :，避免误伤 "https://" 这样的 URL。
 */
function stripComments(source) {
  return source
    .replace(/\/\*[\s\S]*?\*\//g, "")
    .replace(/<!--[\s\S]*?-->/g, "")
    .replace(/(^|[^:])\/\/[^\n]*/g, "$1")
}

function walk(dir, out = []) {
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const full = join(dir, entry.name)
    if (entry.isDirectory()) {
      // 跳过已生成的字体产物，避免自引用
      if (full === OUT_DIR) continue
      walk(full, out)
    } else if (SCAN_EXTENSIONS.has(entry.name.slice(entry.name.lastIndexOf(".")))) {
      out.push(full)
    }
  }
  return out
}

function collectChars() {
  const files = [join(ROOT, "index.html"), ...walk(join(ROOT, "src"))]
  const found = new Set(BASE_CHARS)

  for (const file of files) {
    let content
    try {
      content = readFileSync(file, "utf8")
    } catch {
      continue
    }
    // Markdown 是纯内容，不需要剥注释：正文里的 // 可能出现在链接或行内代码中，
    // 按 JS 注释规则剥离反而会误伤真实字符。只有源码文件才走 stripComments。
    const source = file.endsWith(".md") ? content : stripComments(content)

    for (const char of source) {
      const code = char.codePointAt(0)
      if (CJK_RANGES.some(([lo, hi]) => code >= lo && code <= hi)) found.add(char)
    }
  }
  return [...found].sort()
}

function formatKB(bytes) {
  return `${(bytes / 1024).toFixed(1)} KB`
}

async function main() {
  const weights = process.argv.slice(2).length
    ? process.argv.slice(2).map(Number)
    : [100, 300, 400, 500, 700]

  const chars = collectChars()
  const text = chars.join("")
  console.log(`[fonts] 字符集共 ${chars.length} 个码位`)
  console.log(`[fonts] 参与扫描目录：index.html, src/${relative(ROOT, join(ROOT, "src")).replace(/\\/g, "/")}`)
  console.log(`[fonts] 待生成字重：${weights.join(", ")}`)

  mkdirSync(OUT_DIR, { recursive: true })

  const results = []
  for (const weight of weights) {
    const source = join(SOURCE_FONT_DIR, WEIGHT_FILES[weight] ?? "")
    if (!WEIGHT_FILES[weight] || !statSync(source, { throwIfNoEntry: false })) {
      throw new Error(
        `缺少 ${weight} 字重的源字体：${source}\n` +
          `请确认依赖 @expo-google-fonts/noto-sans-sc 已安装（npm i -D @expo-google-fonts/noto-sans-sc）`,
      )
    }

    const original = readFileSync(source)
    const subset = await subsetFont(original, text, { targetFormat: "woff2" })
    const target = join(OUT_DIR, `NotoSansSC-subset-${weight}.woff2`)
    writeFileSync(target, subset)

    results.push({ weight, before: original.length, after: subset.length })
    const saving = 100 - Number(((subset.length / original.length) * 100).toFixed(2))
    console.log(
      `[fonts] ${weight}\t${formatKB(original.length)} -> ${formatKB(subset.length)}\t(-${saving.toFixed(1)}%)\t${relative(ROOT, target).replace(/\\/g, "/")}`,
    )
  }

  const totalAfter = results.reduce((sum, r) => sum + r.after, 0)
  console.log(
    `[fonts] 完成：${results.length} 个文件，线上总裸体积 ${formatKB(totalAfter)}（未计 gzip/brotli）`,
  )
}

main().catch((error) => {
  console.error("[fonts] 失败：", error)
  process.exit(1)
})
