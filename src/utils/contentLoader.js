export function slugFromPath(path) {
  const fileName = path.slice(path.lastIndexOf("/") + 1).replace(/\.md$/, "")
  return fileName.replace(/^\d+-/, "").replace(/\.(zh|en)$/, "")
}

export function indexLoaders(modules) {
  const loaders = {}
  for (const [path, load] of Object.entries(modules)) {
    const slug = slugFromPath(path)
    const localeMatch = path.match(/\.(zh|en)\.md$/)
    loaders[slug] ??= {}
    loaders[slug][localeMatch?.[1] ?? "default"] = load
  }
  return loaders
}

export async function loadLocalizedBody(loaders, slug, locale) {
  const entry = loaders[slug]
  if (!entry) return null
  const load = entry[locale] ?? entry[locale === "zh" ? "en" : "zh"] ?? entry.default
  return load ? await load() : null
}
