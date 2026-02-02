import i18n from "i18next"
import { initReactI18next } from "react-i18next"
import LanguageDetector from "i18next-browser-languagedetector"
import zhCommon from "../locales/zh/common.json"
import zhHome from "../locales/zh/home.json"
import zhAbout from "../locales/zh/about.json"
import zhWorks from "../locales/zh/works.json"
import zhPhotos from "../locales/zh/photos.json"
import zhContact from "../locales/zh/contact.json"
import zhLinks from "../locales/zh/links.json"
import enCommon from "../locales/en/common.json"
import enHome from "../locales/en/home.json"
import enAbout from "../locales/en/about.json"
import enWorks from "../locales/en/works.json"
import enPhotos from "../locales/en/photos.json"
import enContact from "../locales/en/contact.json"
import enLinks from "../locales/en/links.json"

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: {
      zh: {
        common: zhCommon,
        home: zhHome,
        about: zhAbout,
        works: zhWorks,
        photos: zhPhotos,
        contact: zhContact,
        links: zhLinks,
      },
      en: {
        common: enCommon,
        home: enHome,
        about: enAbout,
        works: enWorks,
        photos: enPhotos,
        contact: enContact,
        links: enLinks,
      },
    },
    fallbackLng: "zh",
    lng: "zh",
    debug: false,
    ns: ["common", "home", "about", "works", "photos", "contact", "links"],
    defaultNS: "common",
    interpolation: {
      escapeValue: false,
    },
    detection: {
      order: ["localStorage", "navigator"],
      caches: ["localStorage"],
    },
  })

export default i18n
