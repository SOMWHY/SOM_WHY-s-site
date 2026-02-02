import React, { memo } from "react"
import { ArrowRight } from "lucide-react"
import contactImage from "../assets/屏幕截图 2026-01-29 214427.webp"
import { ImageCard } from "../components"
import { useTranslation } from "react-i18next"
import useLocaleStore from "../store/localeStore"

const Contact = memo(function Contact() {
  const { t } = useTranslation(["contact", "common"])
  const { locale } = useLocaleStore()
  const isChinese = locale === "zh"

  return (
    <div
      className={`w-full max-w-4xl px-6 md:px-12 flex flex-col ${isChinese ? "md:flex-row gap-8 md:gap-16" : "md:flex-row gap-12 md:gap-24"} items-center py-12 pb-32`}
    >
      <div
        className={`w-full ${isChinese ? "md:w-1/4" : "md:w-1/3"} space-y-4`}
      >
        <span className="font-mono text-[9px] tracking-[0.4em] text-zinc-500 font-bold">
          {t("email")}
        </span>
        <br />
        <h1
          className={`glitch-text font-mono ${isChinese ? "text-5xl md:text-7xl" : "text-4xl md:text-6xl"} uppercase no-select whitespace-nowrap`}
          data-text={t("title")}
        >
          {t("title")}
        </h1>
        <br />
        <p
          className={`font-mono ${isChinese ? "text-[11px] md:text-[13px]" : "text-[10px] md:text-[11px]"} text-zinc-400 uppercase tracking-widest leading-loose pt-4`}
        >
          {t("description")}
        </p>
      </div>

      <div className={`w-full ${isChinese ? "md:w-3/4" : "md:w-2/3"}`}>
        <ImageCard
          image={contactImage}
          alt="Contact Visual"
          aspectRatio="aspect-[4/3]"
          className="cursor-crosshair"
        >
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
          <div className="absolute bottom-0 left-0 p-6 w-full transform translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500">
            <p className="font-mono text-[8px] tracking-[0.3em] text-white/60 uppercase mb-2">
              {t("common.transmissionActive")}
            </p>
            <p className="font-mono text-[10px] text-white uppercase tracking-wider">
              {t("common.visualFrequency")}
            </p>
          </div>
        </ImageCard>
      </div>
    </div>
  )
})

Contact.displayName = "Contact"

export default Contact
