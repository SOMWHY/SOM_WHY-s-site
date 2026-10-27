import { create } from "zustand"
import { persist } from "zustand/middleware"
import { DEFAULT_LOCALE, normalizeLocale } from "../i18n/localeStorage"

const useLocaleStore = create(
  persist(
    (set, get) => ({
      locale: DEFAULT_LOCALE,
      setLocale: (locale) => set({ locale: normalizeLocale(locale) }),
      toggleLocale: () => {
        const { locale } = get()
        set({ locale: locale === "zh" ? "en" : "zh" })
      },
    }),
    {
      name: "locale-storage",
      merge: (persistedState, currentState) => ({
        ...currentState,
        ...persistedState,
        locale: normalizeLocale(persistedState?.locale),
      }),
    },
  ),
)

export default useLocaleStore
