import React, { memo, useEffect, useRef } from "react"
import { ImageCard } from "../components"
import { Masonry } from "@somwhy/react-masonry-layout"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { useTranslation } from "react-i18next"

gsap.registerPlugin(ScrollTrigger)

const Photos = memo(function Photos() {
  const { t } = useTranslation("photos")
  const containerRef = useRef(null)

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    // 使用MutationObserver监听Masonry组件渲染完成
    const observer = new MutationObserver(() => {
      const items = container.querySelectorAll(".mb-4")
      if (items.length > 0) {
        observer.disconnect()
        initAnimations(items)
      }
    })

    observer.observe(container, {
      childList: true,
      subtree: true,
    })

    // 初始化动画
    const initAnimations = (items) => {
      // 批量设置初始状态，减少重绘
      gsap.set(items, { opacity: 1, y: 0 })

      // 创建滚动触发的动画
      gsap.utils.toArray(items).forEach((item, index) => {
        gsap.from(item, {
          scrollTrigger: {
            trigger: item,
            start: "top 85%",
            toggleActions: "play none none none",
            once: true, // 只触发一次，减少性能消耗
          },
          opacity: 0,
          y: 30, // 减少动画距离，提升性能
          duration: 0.6, // 减少动画时长
          delay: Math.min(index * 0.05, 0.5), // 限制最大延迟
          ease: "power2.out",
        })
      })
    }

    return () => observer.disconnect()
  }, [])

  const imagesArray = [
    {
      src: "/assets/null-1b04beaeed90173e.webp",
      date: "2026-01-29",
      key: "fl_chan",
      width: 1024,
      height: 768,
    },
    {
      src: "/assets/null-2eafa050439c7635.webp",
      date: "2026-01-29",
      key: "am_i_cute",
      width: 800,
      height: 1024,
    },
    {
      src: "/assets/null-6b1b4065f588152f.webp",
      date: "2026-01-29",
      key: "lying_on_the_grass",
      width: 1024,
      height: 1024,
    },
    {
      src: "/assets/null-6c0259fdb4e6a418.webp",
      date: "2025-11-21",
      key: "shining_leaves",
      width: 1200,
      height: 800,
    },
    {
      src: "/assets/null-10eb6585e10f2207.webp",
      date: "2026-01-29",
      key: "cat_or_orange",
      width: 900,
      height: 1200,
    },
    {
      src: "/assets/null-26dec620bdbd4947.webp",
      date: "2024-07-10",
      key: "golden_sunrise",
      width: 1024,
      height: 768,
    },
    {
      src: "/assets/null-33cb9df3bbc0c458.webp",
      date: "2025-01-29",
      key: "beneth_the_flowers",
      width: 800,
      height: 1024,
    },
    {
      src: "/assets/null-51e34fc69a518a71.webp",
      date: "2026-01-29",
      key: "bocchi_the_porter",
      width: 1024,
      height: 1024,
    },
    {
      src: "/assets/null-f5a331fdbf5053e.webp",
      date: "2025-01-29",
      key: "flourish",
      width: 1200,
      height: 800,
    },
    {
      src: "/assets/null2bb22a3bf55a40eb.webp",
      date: "2025-11-08",
      key: "nostalgia",
      width: 900,
      height: 1200,
    },
    {
      src: "/assets/null2cfea00e747f76f.webp",
      date: "2025-11-08",
      key: "sky_in_the_mirror",
      width: 1024,
      height: 768,
    },
    {
      src: "/assets/null2f413a18423e2f56.webp",
      date: "2025-07-17",
      key: "little_cat_and_big_chair",
      width: 800,
      height: 1024,
    },
    {
      src: "/assets/null2fcb6271cd5da46b.webp",
      date: "2025-10-07",
      key: "soft_cloud",
      width: 1024,
      height: 1024,
    },
    {
      src: "/assets/null5c3f45981a94e52f.webp",
      date: "2026-01-29",
      key: "walking_alone",
      width: 1200,
      height: 800,
    },
    {
      src: "/assets/null9bef06dffebdf12.webp",
      date: "2025-01-27",
      key: "carpeted_with_flowers",
      width: 900,
      height: 1200,
    },
    {
      src: "/assets/null36a0c8415048e93d.webp",
      date: "2025-01-29",
      key: "a_blaze_of_colour",
      width: 1024,
      height: 768,
    },
    {
      src: "/assets/null61ad2acbea908c1c.webp",
      date: "2025-02-13",
      key: "stare_into_the_distance",
      width: 800,
      height: 1024,
    },
    {
      src: "/assets/null173dd80a2b528fe6.webp",
      date: "2025-11-21",
      key: "playground_in_campus",
      width: 1024,
      height: 1024,
    },
    {
      src: "/assets/null547b4855305b3b08.webp",
      date: "2025-01-29",
      key: "splay_out",
      width: 1200,
      height: 800,
    },
    {
      src: "/assets/null57534381b9ebe35a.webp",
      date: "2025-01-29",
      key: "a_mass_of_blooms",
      width: 900,
      height: 1200,
    },
    {
      src: "/assets/null795854498ad0dbf6.webp",
      date: "2026-01-29",
      key: "its_spring_here",
      width: 1024,
      height: 768,
    },
  ]

  return (
    <div className="px-6 md:px-12">
      <div className="mb-16">
        <h2 className="font-mono text-[10px] tracking-[0.6em] text-zinc-500 uppercase mb-4">
          {t("section")}
        </h2>
        <h1 className="text-4xl md:text-6xl font-light tracking-tighter">
          {t("title")}
        </h1>
      </div>

      <div ref={containerRef}>
        <Masonry gutterInPx={16} customContainerClass={"w-full"}>
          {imagesArray.map((image, index) => (
            <div key={index} className="mb-4">
              <ImageCard
                image={image.src}
                alt={t(image.key) || t("noName")}
                width={image.width}
                height={image.height}
                loading={index < 3 ? "eager" : "lazy"}
                fetchpriority={
                  index === 0 ? "high" : index < 3 ? "medium" : "low"
                }
              >
                <div className="opacity-0 group-hover:opacity-100 transition-opacity bg-gradient-to-t from-black to-transparent">
                  <p className=" font-mono text-[8px] tracking-[0.2em] text-white">
                    {t("ref")} {image.date || "2026-01-29"}
                  </p>
                  <p className="font-mono text-[10px] text-white uppercase">
                    {t(image.key)}
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
