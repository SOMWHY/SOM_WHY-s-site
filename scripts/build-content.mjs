/**
 * 内容索引生成脚本
 *
 * 背景：文章与项目正文以 Markdown 存放在 src/content 下（写作体验好），
 * 但列表页需要在「不加载正文」的前提下渲染卡片元数据（标题/作者/日期/阅读时长）。
 * 若用 eager 的 ?raw glob 会把全部正文打进 chunk，违背「按篇懒加载」。
 * 因此这里在构建期解析 frontmatter 并产出轻量索引 JSON，正文仍按篇动态 import。
 *
 * 与项目既有约定一致（fonts:build / audio:encode）：脚本产出提交进仓库，线上构建无需执行。
 *
 * 用法：npm run content:build（已挂到 prebuild / predev，通常无需手动执行）
 */

import { readFileSync, writeFileSync, mkdirSync, readdirSync } from "node:fs"
import { dirname, join, relative, resolve } from "node:path"
import { fileURLToPath } from "node:url"
import matter from "gray-matter"

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..")
const CONTENT_DIR = join(ROOT, "src", "content")
const POSTS_DIR = join(CONTENT_DIR, "posts")
const PROJECTS_DIR = join(CONTENT_DIR, "projects")
const DATA_DIR = join(ROOT, "src", "data")

/** 文件名可能带 `01-` 这类排序前缀，前缀只用于排序，不进 slug */
const ORDER_PREFIX = /^(\d+)-(.+)\.md$/
const PLAIN_NAME = /^(.+)\.md$/
const LOCALE_SUFFIX = /\.(zh|en)$/

/** CJK 与日文假名，用于中英混排的阅读时长估算 */
const CJK_PATTERN = /[㐀-䶿一-鿿぀-ヿ]/g
const LATIN_WORD_PATTERN = /[A-Za-z0-9'’-]+/g
const FENCED_CODE_PATTERN = /```[\s\S]*?```/g
const INLINE_CODE_PATTERN = /`[^`]*`/g

function listMarkdown(dir) {
  try {
    return readdirSync(dir).filter((name) => name.endsWith(".md")).sort()
  } catch {
    return []
  }
}

function parseFileName(name, dir) {
  const localizedName = name.replace(/\.md$/, "")
  const localeMatch = LOCALE_SUFFIX.exec(localizedName)
  const baseName = localeMatch ? localizedName.slice(0, localeMatch.index) : localizedName
  const ordered = ORDER_PREFIX.exec(`${baseName}.md`)
  if (ordered) {
    return { order: Number(ordered[1]), slug: ordered[2], locale: localeMatch?.[1] ?? null }
  }
  const plain = PLAIN_NAME.exec(`${baseName}.md`)
  if (plain) {
    return { order: Number.MAX_SAFE_INTEGER, slug: plain[1], locale: localeMatch?.[1] ?? null }
  }
  throw new Error(`无法从文件名派生 slug：${join(dir, name)}`)
}

/**
 * 阅读时长估算：中英混排场景下单看词数会严重低估中文。
 * 中文按 350 字/分钟，拉丁按 200 词/分钟，向上取整，最少 1 分钟。
 */
function estimateReadingMinutes(body) {
  const withoutCode = body.replace(FENCED_CODE_PATTERN, " ").replace(INLINE_CODE_PATTERN, " ")
  const cjkMatches = withoutCode.match(CJK_PATTERN)
  const cjkCount = cjkMatches ? cjkMatches.length : 0
  const latinMatches = withoutCode.replace(CJK_PATTERN, " ").match(LATIN_WORD_PATTERN)
  const latinCount = latinMatches ? latinMatches.length : 0

  return Math.max(1, Math.ceil(cjkCount / 350 + latinCount / 200))
}

/**
 * gray-matter 要求 frontmatter 的 `---` 出现在文件最开头。
 * 若作者在前面写了 HTML 注释（很常见），会静默解析不出任何字段，
 * 后续只会报一个莫名其妙的「缺少 title」。这里先剥掉开头的注释与空行。
 */
function stripLeadingComments(raw) {
  return raw.replace(/^(\s*<!--[\s\S]*?-->\s*)+/, "")
}

/** 缺失必填字段时给出可直接定位的错误，避免只报 "undefined" */
function requireField(data, field, filePath) {
  const value = data[field]
  if (value === undefined || value === null || value === "") {
    throw new Error(`缺少必填字段 "${field}"：${filePath}`)
  }
  return value
}

function groupFiles(dir) {
  const groups = new Map()
  for (const name of listMarkdown(dir)) {
    const parsed = parseFileName(name, dir)
    const group = groups.get(parsed.slug) ?? { ...parsed, files: {} }
    group.files[parsed.locale ?? "default"] = name
    groups.set(parsed.slug, group)
  }
  return [...groups.values()]
}

function readLocalizedFiles(group, dir) {
  return Object.fromEntries(Object.entries(group.files).map(([locale, name]) => {
    const filePath = join(dir, name)
    const parsed = matter(stripLeadingComments(readFileSync(filePath, "utf8")))
    return [locale, { ...parsed, filePath }]
  }))
}

function metadata(localized, field) {
  return localized.default?.data[field]
    ?? localized.en?.data[field]
    ?? localized.zh?.data[field]
    ?? localized.en?.data[`${field}_en`]
    ?? localized.zh?.data[`${field}_zh`]
    ?? null
}

function buildPosts() {
  const posts = groupFiles(POSTS_DIR).map((group) => {
    const localized = readLocalizedFiles(group, POSTS_DIR)
    const source = localized.default ?? localized.en ?? localized.zh
    const { data, content, filePath } = source
    const title = requireField({ title: metadata(localized, "title") }, "title", filePath)
    const date = requireField({ date: metadata(localized, "date") }, "date", filePath)
    const author = requireField({ author: metadata(localized, "author") }, "author", filePath)
    const summary = requireField({ summary: metadata(localized, "summary") }, "summary", filePath)
    const parsedDate = new Date(date)
    if (Number.isNaN(parsedDate.getTime())) throw new Error(`date 字段不是合法日期：${filePath}（当前值：${date}）`)
    return {
      slug: group.slug, order: group.order, title, date: parsedDate.toISOString().slice(0, 10), author, summary,
      cover: data.cover ?? null,
      title_zh: localized.zh?.data.title ?? data.title_zh ?? null,
      title_en: localized.en?.data.title ?? data.title_en ?? null,
      summary_zh: localized.zh?.data.summary ?? data.summary_zh ?? null,
      summary_en: localized.en?.data.summary ?? data.summary_en ?? null,
      readingMinutes: estimateReadingMinutes((localized.zh ?? source).content),
    }
  })

  // 日期倒序；同日按文件名排序前缀稳定兜底
  posts.sort((a, b) => {
    if (a.date !== b.date) return a.date < b.date ? 1 : -1
    return a.order - b.order
  })

  return posts.map(({ order, ...post }) => post)
}

function buildProjects() {
  const projects = groupFiles(PROJECTS_DIR).map((group) => {
    const localized = readLocalizedFiles(group, PROJECTS_DIR)
    const source = localized.default ?? localized.en ?? localized.zh
    const { data, content, filePath } = source
    const title = requireField({ title: metadata(localized, "title") }, "title", filePath)
    const summary = requireField({ summary: metadata(localized, "summary") }, "summary", filePath)
    const role = requireField({ role: metadata(localized, "role") }, "role", filePath)
    const period = requireField({ period: metadata(localized, "period") }, "period", filePath)
    const stack = data.stack
    if (!Array.isArray(stack) || stack.length === 0) throw new Error(`stack 必须是非空数组：${filePath}`)
    return {
      slug: group.slug, order: group.order, title, summary, role, period, stack,
      repo: data.repo ?? null, demo: data.demo ?? null, cover: data.cover ?? null,
      title_zh: localized.zh?.data.title ?? data.title_zh ?? null,
      title_en: localized.en?.data.title ?? data.title_en ?? null,
      summary_zh: localized.zh?.data.summary ?? data.summary_zh ?? null,
      summary_en: localized.en?.data.summary ?? data.summary_en ?? null,
      readingMinutes: estimateReadingMinutes((localized.zh ?? source).content),
    }
  })

  projects.sort((a, b) => a.order - b.order)

  return projects.map(({ order, ...project }) => project)
}

function writeIndex(file, payload) {
  mkdirSync(DATA_DIR, { recursive: true })
  const target = join(DATA_DIR, file)
  // 固定缩进 + 末尾换行，保证每次产出 diff 稳定
  writeFileSync(target, `${JSON.stringify(payload, null, 2)}\n`)
  return relative(ROOT, target).replace(/\\/g, "/")
}

function main() {
  const posts = buildPosts()
  const projects = buildProjects()

  const postsPath = writeIndex("posts.json", posts)
  const projectsPath = writeIndex("projects.json", projects)

  console.log(`[content] 文章 ${posts.length} 篇 -> ${postsPath}`)
  for (const post of posts) {
    console.log(`[content]   ${post.date}  ${post.readingMinutes} mins  ${post.slug}`)
  }
  console.log(`[content] 项目 ${projects.length} 个 -> ${projectsPath}`)
  for (const project of projects) {
    console.log(`[content]   ${project.period}  ${project.slug}`)
  }
}

main()
