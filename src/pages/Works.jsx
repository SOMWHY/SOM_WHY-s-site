import React, { memo, useEffect, useRef } from "react"
import { ImageCard } from "../components"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"

gsap.registerPlugin(ScrollTrigger)

const Works = memo(function Works() {
  const containerRef = useRef(null)

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    const items = container.querySelectorAll(".group")
    if (!items.length) return

    gsap.utils.toArray(items).forEach((item, index) => {
      // 确保元素初始状态是可见的
      gsap.set(item, { opacity: 1, y: 0 })

      gsap.from(item, {
        scrollTrigger: {
          trigger: item,
          start: "top 80%",
          toggleActions: "play none none none",
        },
        opacity: 0,
        y: 50,
        duration: 0.8,
        delay: index * 0.1,
        ease: "power2.out",
      })
    })
  }, [])

  return (
    <div className="max-w-7xl mx-auto px-6 md:px-12">
      <div className="mb-16">
        <h2
          className="font-mono text-[10px] tracking-[0.6em] uppercase mb-4"
          style={{ color: "var(--muted)" }}
        >
          SELECTED PRODUCTIONS
        </h2>
        <h1
          className="text-4xl md:text-6xl font-mono text-transparent bg-clip-text bg-gradient-to-r uppercase"
          style={{
            backgroundImage:
              "linear-gradient(to right, var(--text), var(--muted))",
          }}
        >
          Audio Works
        </h1>
      </div>

      <div
        ref={containerRef}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-12 lg:gap-16"
      >
        <div className="group cursor-pointer">
          <ImageCard
            image="https://vgbujcuwptvheqijyjbe.supabase.co/storage/v1/object/public/hmac-uploads/uploads/8353c3f7-250e-4525-bb55-dc8b4f3e09e7/1769698811973-912f7d4c/_____2026-01-29_214737.png"
            alt="Void Frequency"
          >
            <div className="absolute bottom-0 left-0 p-6 w-full">
              <p className="font-mono text-[9px] tracking-[0.3em] text-white/50 mb-2">
                EP. 01 / VOID FREQUENCY
              </p>
              <h3 className="font-light text-2xl text-white group-hover:text-cyan-400 transition-colors">
                Ghost In The Signal
              </h3>
            </div>
          </ImageCard>
          <p
            className="font-mono text-[10px] leading-relaxed uppercase tracking-widest"
            style={{ color: "var(--muted)" }}
          >
            Deep frequency analysis exploring the gaps between analog noise.
          </p>
        </div>

        <div className="group cursor-pointer">
          <ImageCard
            image="https://vgbujcuwptvheqijyjbe.supabase.co/storage/v1/object/public/hmac-uploads/uploads/8353c3f7-250e-4525-bb55-dc8b4f3e09e7/1769698809239-20c1f692/_____2026-01-29_213557.png"
            alt="Spring Like"
          >
            <div className="absolute bottom-0 left-0 p-6 w-full">
              <p className="font-mono text-[9px] tracking-[0.3em] text-white/50 mb-2">
                EP. 02 / BOTANICAL SYNTH
              </p>
              <h3 className="font-light text-2xl text-white group-hover:text-cyan-400 transition-colors">
                Organic Growth
              </h3>
            </div>
          </ImageCard>
          <p
            className="font-mono text-[10px] leading-relaxed uppercase tracking-widest"
            style={{ color: "var(--muted)" }}
          >
            Synthesis of plant neuro-signals recorded in the Amazon Basin.
          </p>
        </div>

        <div className="group cursor-pointer">
          <ImageCard
            image="https://vgbujcuwptvheqijyjbe.supabase.co/storage/v1/object/public/hmac-uploads/uploads/8353c3f7-250e-4525-bb55-dc8b4f3e09e7/1769698809584-8018261f/_____2026-01-29_214148.png"
            alt="Metallic Pulse"
          >
            <div className="absolute bottom-0 left-0 p-6 w-full">
              <p className="font-mono text-[9px] tracking-[0.3em] text-white/50 mb-2">
                EP. 03 / INDUSTRIAL ECHO
              </p>
              <h3 className="font-light text-2xl text-white group-hover:text-cyan-400 transition-colors">
                Steel Rain
              </h3>
            </div>
          </ImageCard>
          <p
            className="font-mono text-[10px] leading-relaxed uppercase tracking-widest"
            style={{ color: "var(--muted)" }}
          >
            Cold textures meet rhythmic distortion. A study in isolation.
          </p>
        </div>

        <div className="group cursor-pointer">
          <ImageCard
            image="https://vgbujcuwptvheqijyjbe.supabase.co/storage/v1/object/public/hmac-uploads/uploads/8353c3f7-250e-4525-bb55-dc8b4f3e09e7/1769698809845-62572e03/_____2026-01-29_214255.png"
            alt="Spring-Like"
          >
            <div className="absolute bottom-0 left-0 p-6 w-full">
              <p className="font-mono text-[9px] tracking-[0.3em] text-white/50 mb-2">
                EP. 04 / SPRING-LIKE
              </p>
              <h3 className="font-light text-2xl text-white group-hover:text-cyan-400 transition-colors">
                Botanical Distortion
              </h3>
            </div>
          </ImageCard>
          <p
            className="font-mono text-[10px] leading-relaxed uppercase tracking-widest"
            style={{ color: "var(--muted)" }}
          >
            The flagship reconstruction of organic audio signatures.
          </p>
        </div>

        <div className="group cursor-pointer">
          <ImageCard
            image="https://vgbujcuwptvheqijyjbe.supabase.co/storage/v1/object/public/hmac-uploads/uploads/8353c3f7-250e-4525-bb55-dc8b4f3e09e7/1769698810147-8f7bb194/_____2026-01-29_214427.png"
            alt="Deep Root"
          >
            <div className="absolute bottom-0 left-0 p-6 w-full">
              <p className="font-mono text-[9px] tracking-[0.3em] text-white/50 mb-2">
                EP. 05 / GROUNDED
              </p>
              <h3 className="font-light text-2xl text-white group-hover:text-cyan-400 transition-colors">
                Root System
              </h3>
            </div>
          </ImageCard>
          <p className="font-mono text-[10px] text-zinc-500 leading-relaxed uppercase tracking-widest">
            Sub-bass exploration of tectonic movement and soil vibration.
          </p>
        </div>

        <div className="group cursor-pointer">
          <ImageCard
            image="https://vgbujcuwptvheqijyjbe.supabase.co/storage/v1/object/public/hmac-uploads/uploads/8353c3f7-250e-4525-bb55-dc8b4f3e09e7/1769698810455-2e0698b4/_____2026-01-29_214626.png"
            alt="Glitch Bloom"
          >
            <div className="absolute bottom-0 left-0 p-6 w-full">
              <p className="font-mono text-[9px] tracking-[0.3em] text-white/50 mb-2">
                EP. 06 / BLOOM
              </p>
              <h3 className="font-light text-2xl text-white group-hover:text-cyan-400 transition-colors">
                Fluorescent Flora
              </h3>
            </div>
          </ImageCard>
          <p
            className="font-mono text-[10px] leading-relaxed uppercase tracking-widest"
            style={{ color: "var(--muted)" }}
          >
            Visual-audio mapping of bioluminescent plant species.
          </p>
        </div>
      </div>

      <div className="pb-24 md:pb-32"></div>
    </div>
  )
})

Works.displayName = "Works"

export default Works
