import React, { memo, useEffect } from "react"
import { useTranslation } from "react-i18next"
import useLocaleStore from "../../store/localeStore"

const LanguageSwitcher = memo(function LanguageSwitcher() {
  const { i18n } = useTranslation()
  const { locale, toggleLocale } = useLocaleStore()

  useEffect(() => {
    document.documentElement.lang = locale
  }, [locale])

  const handleLanguageChange = () => {
    const newLocale = locale === "zh" ? "en" : "zh"
    toggleLocale()
    i18n.changeLanguage(newLocale)
  }

  return (
    <button
      onClick={handleLanguageChange}
      className="font-mono text-[10px] tracking-[0.2em] uppercase transition-all hover:text-current cursor-pointer px-2 py-1 rounded hover:bg-black hover:text-white dark:hover:bg-gray-800 dark:hover:text-white"
    >
      {locale === "zh" ? "EN" : "中"}
    </button>
  )
})

LanguageSwitcher.displayName = "LanguageSwitcher"

export default LanguageSwitcher
