export const DEFAULT_LOCALE = "zh"
export const LOCALE_STORAGE_KEY = "locale-storage"

export function normalizeLocale(locale) {
  return locale === "zh" || locale === "en" ? locale : DEFAULT_LOCALE
}

export function readStoredLocale(storage) {
  try {
    const parsed = JSON.parse(storage?.getItem(LOCALE_STORAGE_KEY) ?? "null")
    return normalizeLocale(parsed?.state?.locale)
  } catch {
    return DEFAULT_LOCALE
  }
}
