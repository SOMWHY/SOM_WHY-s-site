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
      src: "src/assets/null-1b04beaeed90173e.webp",
      name: "Synthesis Phase I",
      width: 1024,
      height: 1024,
    },
    {
      src: "src/assets/null-2eafa050439c7635.webp",
      name: "Geometric Resonance",
      width: 1024,
      height: 1024,
    },
    {
      src: "src/assets/null-6b1b4065f588152f.webp",
      name: "Organic Distortion",
      width: 1024,
      height: 1024,
    },
    {
      src: "src/assets/null-6c0259fdb4e6a418.webp",
      name: "Spring Propagation",
      width: 1024,
      height: 1024,
    },
    {
      src: "src/assets/null-10eb6585e10f2207.webp",
      name: "Digital Bloom",
      width: 1024,
      height: 1024,
    },
    {
      src: "src/assets/null-26dec620bdbd4947.webp",
      name: "Frequency Mapping",
      width: 1024,
      height: 1024,
    },
    {
      src: "src/assets/null-33cb9df3bbc0c458.webp",
      name: "Deep Bass Structure",
      width: 1024,
      height: 1024,
    },
    {
      src: "src/assets/null-51e34fc69a518a71.webp",
      name: "Deep Bass Structure",
      width: 1024,
      height: 1024,
    },
    {
      src: "src/assets/null-f5a331fdbf5053e.webp",
      name: "Deep Bass Structure",
      width: 1024,
      height: 1024,
    },
    {
      src: "src/assets/null-2bb22a3bf55a40eb.webp",
      name: "Deep Bass Structure",
      width: 1024,
      height: 1024,
    },
    {
      src: "src/assets/null-2cfea00e747f76f.webp",
      name: "Deep Bass Structure",
      width: 1024,
      height: 1024,
    },
    {
      src: "src/assets/null-2f413a18423e2f56.webp",
      name: "Deep Bass Structure",
      width: 1024,
      height: 1024,
    },
    {
      src: "src/assets/null-2fcb6271cd5da46b.webp",
      name: "Deep Bass Structure",
      width: 1024,
      height: 1024,
    },
    {
      src: "src/assets/null-5c3f45981a94e52f.webp",
      name: "Deep Bass Structure",
      width: 1024,
      height: 1024,
    },
    {
      src: "src/assets/null-9bef06dffebdf12.webp",
      name: "Deep Bass Structure",
      width: 1024,
      height: 1024,
    },
    {
      src: "src/assets/null-36a0c8415048e93d.webp",
      name: "Deep Bass Structure",
      width: 1024,
      height: 1024,
    },
    {
      src: "src/assets/null-61ad2acbea908c1c.webp",
      name: "Deep Bass Structure",
      width: 1024,
      height: 1024,
    },
    {
      src: "src/assets/null-173dd80a2b528fe6.webp",
      name: "Deep Bass Structure",
      width: 1024,
      height: 1024,
    },
    {
      src: "src/assets/null-547b4855305b3b08.webp",
      name: "Deep Bass Structure",
      width: 1024,
      height: 1024,
    },
    {
      src: "src/assets/null-57534381b9ebe35a.webp",
      name: "Deep Bass Structure",
      width: 1024,
      height: 1024,
    },
    {
      src: "src/assets/null-795854498ad0dbf6.webp",
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
        <Masonry gutterInPx={16} customContainerClass={"w-full"}>
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
