import React, { memo, useMemo } from "react"
import { useTranslation } from "react-i18next"
import { useNavigate } from "react-router-dom"
import { getGlitchTextClassName, containsChinese } from "../utils/textUtils"

const NotFound = memo(function NotFound() {
  const { t } = useTranslation("common")
  const navigate = useNavigate()

  const titleText = t("404.title")
  const subtitleText = t("404.subtitle")
  const descriptionText = t("404.description")
  const backToHomeText = t("404.back_to_home")

  const titleClassName = useMemo(
    () => getGlitchTextClassName(titleText),
    [titleText],
  )
  const subtitleClassName = useMemo(
    () => (containsChinese(subtitleText) ? "font-mono-zh" : "font-mono"),
    [subtitleText],
  )
  const descriptionClassName = useMemo(
    () => (containsChinese(descriptionText) ? "font-mono-zh" : "font-mono"),
    [descriptionText],
  )
  const backToHomeClassName = useMemo(
    () => (containsChinese(backToHomeText) ? "font-mono-zh" : "font-mono"),
    [backToHomeText],
  )

  const handleBackToHome = () => {
    navigate("/")
  }

  return (
    <div className="w-full max-w-4xl flex flex-col items-center justify-center min-h-[80vh] px-6 md:px-12">
      <div className="w-full max-w-2xl relative flex flex-col items-center text-center">
        {/* 404 Title with Glitch Effect */}
        <h1
          className={`${titleClassName} font-mono text-6xl sm:text-8xl md:text-9xl lg:text-[10rem] mb-8 whitespace-nowrap uppercase no-select`}
          data-text={titleText}
          style={{
            color: "white",
            WebkitTextStroke: "1px black",
            textStroke: "1px black",
          }}
        >
          {titleText}
        </h1>

        {/* Subtitle */}
        <p
          className={`${subtitleClassName} text-lg sm:text-xl md:text-2xl mb-6 tracking-widest uppercase text-zinc-800 dark:text-zinc-200`}
        >
          {subtitleText}
        </p>

        {/* Description */}
        <p
          className={`${descriptionClassName} text-sm md:text-base mb-12 leading-relaxed tracking-wide text-zinc-600 dark:text-zinc-400 max-w-md`}
        >
          {descriptionText}
        </p>

        {/* Back to Home Button */}
        <button
          onClick={handleBackToHome}
          className={`${backToHomeClassName} px-8 py-3 border border-black dark:border-white text-black dark:text-white hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black transition-colors duration-300 uppercase tracking-wider text-sm`}
        >
          {backToHomeText}
        </button>

        {/* Decorative Elements */}
        <div className="mt-16 flex space-x-4 opacity-60">
          <div className="w-1 h-1 bg-black dark:bg-white rounded-full animate-pulse"></div>
          <div className="w-1 h-1 bg-black dark:bg-white rounded-full animate-pulse" style={{ animationDelay: "0.2s" }}></div>
          <div className="w-1 h-1 bg-black dark:bg-white rounded-full animate-pulse" style={{ animationDelay: "0.4s" }}></div>
        </div>
      </div>
    </div>
  )
})

NotFound.displayName = "NotFound"

export default NotFound