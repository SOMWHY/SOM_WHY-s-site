import i18n from "i18next"
import { initReactI18next } from "react-i18next"
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

const getStoredLocale = () => {
  try {
    const stored = localStorage.getItem("persist:locale-storage")
    if (stored) {
      const parsed = JSON.parse(stored)
      return parsed.state?.locale || "en"
    }
  } catch (error) {
    console.error("Error reading locale from localStorage:", error)
  }
  return "en"
}

i18n.use(initReactI18next).init({
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
  fallbackLng: "en",
  lng: getStoredLocale(),
  debug: false,
  ns: ["common", "home", "about", "works", "photos", "contact", "links"],
  defaultNS: "common",
  interpolation: {
    escapeValue: false,
  },
})

export default i18n
