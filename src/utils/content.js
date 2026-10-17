/**
 * 内容层统一入口
 *
 * 文章与项目正文以 Markdown 存放在 src/content，构建期由 scripts/build-content.mjs
 * 产出轻量索引（src/data/*.json）。列表页只读索引，详情页才按 slug 动态取正文，
 * 因此正文不会进首屏 chunk，也不会因为文章变多而拖慢列表页。
 */

import postsIndex from "../data/posts.json"
import projectsIndex from "../data/projects.json"

// 必须是非 eager：eager 会把全部正文打进引入方所在的 chunk，违背按篇懒加载
const postBodies = import.meta.glob("../content/posts/*.md", {
  query: "?raw",
  import: "default",
})
const projectBodies = import.meta.glob("../content/projects/*.md", {
  query: "?raw",
  import: "default",
})

export const posts = postsIndex
export const projects = projectsIndex

/** frontmatter 块，正文渲染前需要剥掉，否则会被当成 Markdown 内容显示出来 */
const FRONTMATTER_PATTERN = /^\s*---\r?\n[\s\S]*?\r?\n---\r?\n?/

/** glob 的 key 形如 "../content/posts/01-hello.md"，去掉排序前缀后即 slug */
function slugFromPath(path) {
  const fileName = path.slice(path.lastIndexOf("/") + 1).replace(/\.md$/, "")
  return fileName.replace(/^\d+-/, "")
}

/** 建立 slug -> 动态加载函数 的映射 */
function indexLoaders(modules) {
  const loaders = {}
  for (const [path, load] of Object.entries(modules)) {
    loaders[slugFromPath(path)] = load
  }
  return loaders
}

const postLoaders = indexLoaders(postBodies)
const projectLoaders = indexLoaders(projectBodies)

export function stripFrontmatter(raw) {
  return raw.replace(FRONTMATTER_PATTERN, "")
}

export function getPost(slug) {
  return posts.find((post) => post.slug === slug) ?? null
}

export function getProject(slug) {
  return projects.find((project) => project.slug === slug) ?? null
}

/** 正文按需加载；找不到对应 slug 时返回 null，由调用方决定如何提示 */
export async function loadPostBody(slug) {
  const load = postLoaders[slug]
  if (!load) return null
  return stripFrontmatter(await load())
}

export async function loadProjectBody(slug) {
  const load = projectLoaders[slug]
  if (!load) return null
  return stripFrontmatter(await load())
}

/**
 * 本地化回退：作者可只写原文，也可额外提供 title_zh / title_en 之类的覆盖字段。
 * 有覆盖字段就用它（满足「标题翻译为目标语言」），没有就回退原文（满足「正文显示原文」）。
 */
export function localized(meta, field, locale) {
  return meta[`${field}_${locale}`] ?? meta[field]
}
