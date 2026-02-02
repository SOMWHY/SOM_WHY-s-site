import React, { memo, useRef, useEffect, useMemo } from "react"
import gsap from "gsap"
import { TextPlugin } from "gsap/TextPlugin"
import { useTranslation } from "react-i18next"
import { getGlitchTextClassName, containsChinese } from "../utils/textUtils"

gsap.registerPlugin(TextPlugin)

const Home = memo(function Home() {
  const { t } = useTranslation("home")
  const reconstructionTextRef = useRef(null)

  const titleText = t("title")
  const subtitleText = t("subtitle")
  const epText = t("ep")
  const descriptionText = t("description")

  const titleClassName = useMemo(
    () => getGlitchTextClassName(titleText),
    [titleText],
  )
  const subtitleClassName = useMemo(
    () => (containsChinese(subtitleText) ? "font-mono-zh" : "font-mono"),
    [subtitleText],
  )
  const epClassName = useMemo(
    () => (containsChinese(epText) ? "font-mono-zh" : "font-mono"),
    [epText],
  )
  const descriptionClassName = useMemo(
    () => (containsChinese(descriptionText) ? "font-mono-zh" : "font-mono"),
    [descriptionText],
  )

  useEffect(() => {
    if (reconstructionTextRef.current) {
      const targetText = subtitleText

      reconstructionTextRef.current.textContent =
        "[ " +
        Array.from({ length: 26 }, () =>
          String.fromCharCode(33 + Math.floor(Math.random() * 94)),
        ).join("") +
        " ]"

      gsap.to(reconstructionTextRef.current, {
        duration: 6,
        text: {
          value: targetText,
          scramble: "chars,random",
          speed: 2,
          delimiter: "",
          chars: "abcdefghijklmnopqrstuvwxyz0123456789[]-",
        },
        ease: "power1.inOut",
      })
    }
  }, [subtitleText])

  return (
    <div className="w-full max-w-4xl flex flex-col items-center px-6 md:px-12">
      <div className="w-full max-w-2xl relative">
        <div className="relative group">
          {/* Interactive Left Vertical Line */}
          <div
            className="fixed top-0 bottom-0 left-[4%] md:left-[calc(50vw-350px)] w-[1px] z-[100] pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-[600ms]"
            style={{ backgroundColor: "var(--text)", opacity: 0.6 }}
          ></div>

          {/* Interactive Bottom Wavy Lines */}
          <svg
            className="fixed bottom-[105px] left-0 w-full h-[120px] z-[40] pointer-events-none hidden md:block opacity-0 group-hover:opacity-100 transition-opacity duration-[600ms] delay-0 group-hover:delay-[1000ms]"
            viewBox="0 0 1440 120"
            preserveAspectRatio="none"
          >
            <defs>
              <style>
                {`.wavy-path { fill: none; stroke: black; vector-effect: non-scaling-stroke; }
                .dark .wavy-path { stroke: white; }
                .wave-anim { animation: wave-osc 12s infinite ease-in-out; }
                @keyframes wave-osc {
                  0%, 100% { transform: translateY(0) scaleY(1); }
                  50% { transform: translateY(8px) scaleY(0.95); }
                }`}
              </style>
            </defs>
            <path
              className="wavy-path wave-anim"
              d="M0 10 Q 180 0, 360 10 T 720 10 T 1080 10 T 1440 10"
              strokeOpacity="0.6"
              strokeWidth="1.2"
              style={{ animationDuration: "10s" }}
            />
            <path
              className="wavy-path wave-anim"
              d="M0 26 Q 240 40, 480 26 T 960 26 T 1440 26"
              strokeOpacity="0.4"
              strokeWidth="1.5"
              style={{ animationDuration: "14s", animationDelay: "-2s" }}
            />
            <path
              className="wavy-path wave-anim"
              d="M0 42 Q 120 30, 240 42 T 480 42 T 720 42 T 960 42 T 1200 42 T 1440 42"
              strokeOpacity="0.5"
              strokeWidth="1"
              style={{ animationDuration: "12s", animationDelay: "-5s" }}
            />
            <path
              className="wavy-path wave-anim"
              d="M0 58 Q 360 70, 720 58 T 1440 58"
              strokeOpacity="0.6"
              strokeWidth="1.2"
              style={{ animationDuration: "18s", animationDelay: "-7s" }}
            />
            <path
              className="wavy-path wave-anim"
              d="M0 74 Q 200 60, 400 74 T 800 74 T 1200 74 T 1440 74"
              strokeOpacity="0.45"
              strokeWidth="1"
              style={{ animationDuration: "15s", animationDelay: "-3s" }}
            />
            <path
              className="wavy-path wave-anim"
              d="M0 90 Q 150 100, 300 90 T 600 90 T 900 90 T 1200 90 T 1440 90"
              strokeOpacity="0.55"
              strokeWidth="1.5"
              style={{ animationDuration: "11s", animationDelay: "-9s" }}
            />
            <path
              className="wavy-path wave-anim"
              d="M0 106 Q 280 95, 560 106 T 1120 106 T 1440 106"
              strokeOpacity="0.4"
              strokeWidth="1"
              style={{ animationDuration: "20s", animationDelay: "-4s" }}
            />
          </svg>

          {/* Fixed Center Text Overlay */}
          <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 flex flex-col items-center justify-start text-center p-4 z-[50] pointer-events-none">
            <h1
              className={`${titleClassName} font-mono text-2xl sm:text-4xl md:text-6xl lg:text-7xl mb-4 whitespace-nowrap uppercase no-select`}
              data-text={t("title")}
              style={{
                color: "white",
                WebkitTextStroke: "1px black",
                textStroke: "1px black",
              }}
            >
              {t("title")}
            </h1>
            <p
              ref={reconstructionTextRef}
              className={`${subtitleClassName} text-[9px] md:text-[11px] tracking-[0.4em] text-white/80 uppercase font-extralight mt-2`}
            >
              {t("subtitle")}
            </p>
          </div>

          <div className="aspect-square relative  border border-white/10 shadow-2xl bg-zinc-900">
            <img
              src="https://vgbujcuwptvheqijyjbe.supabase.co/storage/v1/object/public/hmac-uploads/uploads/8353c3f7-250e-4525-bb55-dc8b4f3e09e7/1769698809845-62572e03/_____2026-01-29_214255.png"
              alt="Spring Like Artwork"
              width="1024"
              height="1024"
              loading="eager"
              fetchpriority="high"
              className="w-full h-full object-cover grayscale opacity-70 group-hover:grayscale-0 group-hover:opacity-100 group-hover:brightness-110 group-hover:saturate-150 transition-vivid no-select"
            />
          </div>

          {/* Water Shimmer Effect */}
          <div className="ripple-lines">
            <div
              className="ripple-line"
              style={{ top: "10px", animationDelay: "0s", opacity: "0.1" }}
            ></div>
            <div
              className="ripple-line"
              style={{ top: "25px", animationDelay: "-2s", opacity: "0.2" }}
            ></div>
            <div
              className="ripple-line"
              style={{ top: "45px", animationDelay: "-5s", opacity: "0.15" }}
            ></div>
            <div
              className="ripple-line"
              style={{ top: "70px", animationDelay: "-1s", opacity: "0.05" }}
            ></div>
          </div>

          {/* Reflection */}
          <div className="hidden md:block absolute top-full left-0 w-full h-32 opacity-20 water-reflection pointer-events-none scale-y-[-1] mt-1">
            <img
              src="https://vgbujcuwptvheqijyjbe.supabase.co/storage/v1/object/public/hmac-uploads/uploads/8353c3f7-250e-4525-bb55-dc8b4f3e09e7/1769698809845-62572e03/_____2026-01-29_214255.png"
              alt="Reflection"
              width="1024"
              height="1024"
              loading="lazy"
              fetchpriority="low"
              className="w-full h-full object-cover grayscale"
            />
          </div>

          {/* Bottom Context */}
          <div className="mt-8 flex flex-col md:flex-row justify-between items-start gap-4">
            <div
              className={`${epClassName} text-[9px] md:text-[11px] font-light text-zinc-500 uppercase tracking-widest`}
            >
              {t("ep")}
            </div>
            <div
              className={`${descriptionClassName} text-[9px] md:text-[11px] font-light text-zinc-600 leading-relaxed uppercase tracking-widest max-w-xs text-right hidden md:block`}
            >
              {t("description")}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
})

Home.displayName = "Home"

export default Home
