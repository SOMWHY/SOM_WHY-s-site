import React, { memo, useRef, useEffect } from "react"
import gsap from "gsap"
import { TextPlugin } from "gsap/TextPlugin"
import { ImageCard } from "../components"

gsap.registerPlugin(TextPlugin)

const About = memo(function About() {
  const typewriterTextRef = useRef(null)
  const cursorRef = useRef(null)

  useEffect(() => {
    if (typewriterTextRef.current) {
      const targetText =
        "I'm SOM_WHY, crafting warm, quiet worlds from sound—where organic textures meet clinical precision, exploring biological growth versus synthetic decay."

      // Start with empty string
      typewriterTextRef.current.textContent = ""

      // Animate to target text with typewriter effect
      // Adjust duration for moderate typing speed
      gsap.to(typewriterTextRef.current, {
        duration: 2.5,
        text: targetText,
        ease: "none",
      })
    }

    // Add cursor blinking animation
    if (cursorRef.current) {
      gsap.to(cursorRef.current, {
        opacity: 0,
        duration: 0.8,
        repeat: -1,
        yoyo: true,
      })
    }
  }, [])

  return (
    <div className="w-full max-w-6xl flex flex-col px-6 md:px-12 py-12 pb-32">
      <div className="group relative w-full">
        <div
          className="fixed top-0 bottom-0 left-[4%] md:left-[10%] lg:left-[15%] w-[1px] z-[100] pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-[600ms]"
          style={{ backgroundColor: "var(--text)", opacity: 0.4 }}
        ></div>

        <svg
          className="fixed bottom-[105px] left-0 w-full h-[100px] z-[40] pointer-events-none hidden md:block opacity-0 group-hover:opacity-100 transition-opacity duration-[600ms] delay-0 group-hover:delay-[500ms]"
          viewBox="0 0 1440 100"
          preserveAspectRatio="none"
        >
          <defs>
            <style>
              {`.wavy-path { fill: none; stroke: black; vector-effect: non-scaling-stroke; }
              .dark .wavy-path { stroke: white; }
              .wave-anim { animation: wave-osc 10s infinite ease-in-out; }
              @keyframes wave-osc { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(10px); } }`}
            </style>
          </defs>
          <path
            className="wavy-path wave-anim"
            d="M0 20 Q 360 0, 720 20 T 1440 20"
            strokeOpacity="0.5"
            strokeWidth="1"
          />
          <path
            className="wavy-path wave-anim"
            d="M0 50 Q 360 70, 720 50 T 1440 50"
            strokeOpacity="0.3"
            strokeWidth="1.5"
            style={{ animationDelay: "-2s" }}
          />
        </svg>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-24 items-center">
          <div className="relative aspect-[4/5] overflow-hidden group/img">
            <img
              src="https://vgbujcuwptvheqijyjbe.supabase.co/storage/v1/object/public/hmac-uploads/uploads/8353c3f7-250e-4525-bb55-dc8b4f3e09e7/1769698810147-8f7bb194/_____2026-01-29_214427.png"
              alt="Artist Portrait"
              width="1024"
              height="1280"
              loading="eager"
              fetchpriority="high"
              className="w-full h-full object-cover grayscale opacity-80 group-hover/img:grayscale-0 group-hover/img:opacity-100 transition-vivid no-select"
            />
            <div className="absolute bottom-8 right-8 text-right">
              <span className="font-mono text-[10px] tracking-[0.4em] text-white/50 block mb-2">
                SERIAL NO.
              </span>
              <span className="font-mono text-xl md:text-2xl text-white">
                BTNC_772
              </span>
            </div>
          </div>

          <div className="flex flex-col space-y-12">
            <div className="space-y-4">
              <h2
                className="font-mono text-[10px] tracking-[0.5em] uppercase"
                style={{ color: "var(--muted)" }}
              >
                The Profile
              </h2>
              <h1 className="text-4xl md:text-6xl lg:text-7xl font-light tracking-tighter">
                ABOUT
              </h1>
              <div
                className="font-mono text-sm md:text-base leading-relaxed max-w-lg h-20"
                style={{ color: "var(--muted)" }}
              >
                <span ref={typewriterTextRef}>
                  I'm SOM_WHY, crafting warm, quiet worlds from sound—where
                  organic textures meet clinical precision, exploring biological
                  growth versus synthetic decay.
                </span>
                <span ref={cursorRef} className="ml-1 inline-block">
                  |
                </span>
              </div>
            </div>

            <div className="space-y-6">
              <h3
                className="font-mono text-[9px] tracking-[0.4em] uppercase border-b border-white/10 pb-2"
                style={{ color: "var(--muted)" }}
              >
                Creative Manifesto
              </h3>
              <p className="text-xl md:text-2xl font-light leading-snug italic">
                "I find music in the gaps between silence. Every frequency is a
                sprout, every distortion is a storm. We don't compose; we
                cultivate soundscapes until they breathe on their own."
              </p>
            </div>

            <div className="grid grid-cols-2 gap-8">
              <div className="space-y-4">
                <h4
                  className="font-mono text-[9px] tracking-[0.4em] uppercase"
                  style={{ color: "var(--muted)" }}
                >
                  Disciplines
                </h4>
                <div className="flex flex-wrap gap-2">
                  <span className="skill-tag px-3 py-1 font-mono text-[10px] uppercase tracking-wider">
                    Sound Design
                  </span>
                  <span className="skill-tag px-3 py-1 font-mono text-[10px] uppercase tracking-wider">
                    Granular Synthesis
                  </span>
                  <span className="skill-tag px-3 py-1 font-mono text-[10px] uppercase tracking-wider">
                    Field Recording
                  </span>
                  <span className="skill-tag px-3 py-1 font-mono text-[10px] uppercase tracking-wider">
                    Mixing
                  </span>
                </div>
              </div>
              <div className="space-y-4">
                <h4
                  className="font-mono text-[9px] tracking-[0.4em] uppercase"
                  style={{ color: "var(--muted)" }}
                >
                  Audio DNA
                </h4>
                <p
                  className="font-mono text-[11px] leading-relaxed uppercase"
                  style={{ color: "var(--muted)" }}
                >
                  House / Ambient / Botanica / Post Rock
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
})

About.displayName = "About"

export default About
