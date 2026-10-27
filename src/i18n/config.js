import i18n from "i18next"
import { initReactI18next } from "react-i18next"
import { DEFAULT_LOCALE, readStoredLocale } from "./localeStorage"
import zhCommon from "../locales/zh/common.json"
import zhHome from "../locales/zh/home.json"
import zhAbout from "../locales/zh/about.json"
import zhWorks from "../locales/zh/works.json"
import zhPhotos from "../locales/zh/photos.json"
import zhBlog from "../locales/zh/blog.json"
import zhLinks from "../locales/zh/links.json"
import enCommon from "../locales/en/common.json"
import enHome from "../locales/en/home.json"
import enAbout from "../locales/en/about.json"
import enWorks from "../locales/en/works.json"
import enPhotos from "../locales/en/photos.json"
import enBlog from "../locales/en/blog.json"
import enLinks from "../locales/en/links.json"

i18n.use(initReactI18next).init({
  resources: {
    zh: {
      common: zhCommon,
      home: zhHome,
      about: zhAbout,
      works: zhWorks,
      photos: zhPhotos,
      blog: zhBlog,
      links: zhLinks,
    },
    en: {
      common: enCommon,
      home: enHome,
      about: enAbout,
      works: enWorks,
      photos: enPhotos,
      blog: enBlog,
      links: enLinks,
    },
  },
  fallbackLng: DEFAULT_LOCALE,
  lng: readStoredLocale(typeof localStorage === "undefined" ? null : localStorage),
  debug: false,
  ns: ["common", "home", "about", "works", "photos", "blog", "links"],
  defaultNS: "common",
  interpolation: {
    escapeValue: false,
  },
})

export default i18n
