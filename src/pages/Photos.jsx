import React, { memo, useEffect, useRef } from "react"
import { ImageCard } from "../components"
import { Masonry } from "@somwhy/react-masonry-layout"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"

gsap.registerPlugin(ScrollTrigger)

const Photos = memo(function Photos() {
  const containerRef = useRef(null)

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    // 延迟一下，确保Masonry组件已经渲染完成
    const timer = setTimeout(() => {
      const items = container.querySelectorAll(".mb-4")
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
    }, 100)

    return () => clearTimeout(timer)
  }, [])

  const imagesArray = [
    {
      src: "https://vgbujcuwptvheqijyjbe.supabase.co/storage/v1/object/public/hmac-uploads/uploads/8353c3f7-250e-4525-bb55-dc8b4f3e09e7/1769698810147-8f7bb194/_____2026-01-29_214427.png",
      name: "Synthesis Phase I",
      width: 1024,
      height: 1024,
    },
    {
      src: "https://vgbujcuwptvheqijyjbe.supabase.co/storage/v1/object/public/hmac-uploads/uploads/8353c3f7-250e-4525-bb55-dc8b4f3e09e7/1769698809584-8018261f/_____2026-01-29_214148.png",
      name: "Geometric Resonance",
      width: 1024,
      height: 1024,
    },
    {
      src: "https://vgbujcuwptvheqijyjbe.supabase.co/storage/v1/object/public/hmac-uploads/uploads/8353c3f7-250e-4525-bb55-dc8b4f3e09e7/1769698813626-7c12c354/_____2026-01-29_214901.png",
      name: "Organic Distortion",
      width: 1024,
      height: 1024,
    },
    {
      src: "https://vgbujcuwptvheqijyjbe.supabase.co/storage/v1/object/public/hmac-uploads/uploads/8353c3f7-250e-4525-bb55-dc8b4f3e09e7/1769698809845-62572e03/_____2026-01-29_214255.png",
      name: "Spring Propagation",
      width: 1024,
      height: 1024,
    },
    {
      src: "https://vgbujcuwptvheqijyjbe.supabase.co/storage/v1/object/public/hmac-uploads/uploads/8353c3f7-250e-4525-bb55-dc8b4f3e09e7/1769698810455-2e0698b4/_____2026-01-29_214626.png",
      name: "Digital Bloom",
      width: 1024,
      height: 1024,
    },
    {
      src: "https://vgbujcuwptvheqijyjbe.supabase.co/storage/v1/object/public/hmac-uploads/uploads/8353c3f7-250e-4525-bb55-dc8b4f3e09e7/1769698809239-20c1f692/_____2026-01-29_213557.png",
      name: "Frequency Mapping",
      width: 1024,
      height: 1024,
    },
    {
      src: "https://vgbujcuwptvheqijyjbe.supabase.co/storage/v1/object/public/hmac-uploads/uploads/8353c3f7-250e-4525-bb55-dc8b4f3e09e7/1769698811973-912f7d4c/_____2026-01-29_214737.png",
      name: "Deep Bass Structure",
      width: 1024,
      height: 1024,
    },
  ]

  return (
    <div className="px-6 md:px-12">
      <div className="mb-16">
        <h2 className="font-mono text-[10px] tracking-[0.6em] text-zinc-500 uppercase mb-4">
          Visual Archives
        </h2>
        <h1 className="text-4xl md:text-6xl font-light tracking-tighter">
          PHOTOS.
        </h1>
      </div>

      <div ref={containerRef}>
        <Masonry columns={4} gutterInPx={16} customContainerClass={"w-full"}>
          {imagesArray.map((image, index) => (
            <div key={index} className="mb-4">
              <ImageCard
                image={image.src}
                alt={image.name || "No name"}
                width={image.width}
                height={image.height}
                loading={index === 0 ? "eager" : "lazy"}
                fetchpriority={index === 0 ? "high" : "low"}
              >
                <div className="opacity-0 group-hover:opacity-100 transition-opacity bg-gradient-to-t from-black/80 to-transparent">
                  <p className="font-mono text-[8px] tracking-[0.2em] text-white/60">
                    REF. 2026-01-29
                  </p>
                  <p className="font-mono text-[10px] text-white uppercase">
                    {image.name}
                  </p>
                </div>
              </ImageCard>
            </div>
          ))}
        </Masonry>
      </div>

      <div className="pb-24 md:pb-32"></div>
    </div>
  )
})

Photos.displayName = "Photos"

export default Photos
