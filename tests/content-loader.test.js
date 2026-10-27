import test from "node:test"
import assert from "node:assert/strict"
import { indexLoaders, loadLocalizedBody, slugFromPath } from "../src/utils/contentLoader.js"
import { DEFAULT_LOCALE, normalizeLocale, readStoredLocale } from "../src/i18n/localeStorage.js"

test("language suffixes are removed while preserving the order prefix convention", () => {
  assert.equal(slugFromPath("../content/posts/01-example.zh.md"), "example")
  assert.equal(slugFromPath("../content/posts/example.md"), "example")
})

test("localized body loader prefers requested language and falls back to its pair", async () => {
  const loaders = indexLoaders({
    "../content/posts/01-example.zh.md": async () => "中文",
    "../content/posts/01-example.en.md": async () => "English",
  })
  assert.equal(await loadLocalizedBody(loaders, "example", "en"), "English")
  assert.equal(await loadLocalizedBody(loaders, "example", "zh"), "中文")
  assert.equal(await loadLocalizedBody(loaders, "missing", "zh"), null)
})

test("single-language legacy content remains loadable", async () => {
  const loaders = indexLoaders({ "../content/posts/01-legacy.md": async () => "legacy" })
  assert.equal(await loadLocalizedBody(loaders, "legacy", "en"), "legacy")
})

test("locale storage uses Zustand's key and rejects invalid values", () => {
  assert.equal(DEFAULT_LOCALE, "zh")
  assert.equal(normalizeLocale("en"), "en")
  assert.equal(normalizeLocale("fr"), "zh")
  assert.equal(readStoredLocale({ getItem: () => null }), "zh")
  assert.equal(readStoredLocale({ getItem: () => '{"state":{"locale":"en"}}' }), "en")
  assert.equal(readStoredLocale({ getItem: () => '{"state":{"locale":"fr"}}' }), "zh")
  assert.equal(readStoredLocale({ getItem: () => "broken" }), "zh")
})
