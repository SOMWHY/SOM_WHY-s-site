import { create } from "zustand"
import { persist } from "zustand/middleware"

const useLocaleStore = create(
  persist(
    (set, get) => ({
      locale: "zh",
      setLocale: (locale) => set({ locale }),
      toggleLocale: () => {
        const { locale } = get()
        set({ locale: locale === "zh" ? "en" : "zh" })
      },
    }),
    {
      name: "locale-storage",
    },
  ),
)

export default useLocaleStore
