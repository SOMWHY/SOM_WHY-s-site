import React, { memo, useEffect, useRef } from "react"
import ImageCard from "../components/ui/ImageCard"
import { Masonry } from "@somwhy/react-masonry-layout"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { useTranslation } from "react-i18next"

gsap.registerPlugin(ScrollTrigger)

// 构建期生成多分辨率 webp（vite-imagetools + sharp），产物带内容哈希，可被长缓存。
// 用 import.meta.glob 一次性取回后按文件名索引，这样展示顺序仍由下面的数组显式控制。
const photoSrcSets = import.meta.glob("../assets/photos/*.webp", {
  query: "?w=320;480;720;960&format=webp&quality=72&as=srcset",
  import: "default",
  eager: true,
})

const srcSetByFile = Object.fromEntries(
  Object.entries(photoSrcSets).map(([path, srcSet]) => [
    path.slice(path.lastIndexOf("/") + 1),
    srcSet,
  ]),
)

// Masonry 的 CSS 断点：<480px 1 列 / >=480px 2 列 / >=768px 3 列 / >=1024px 4 列 / >=1200px 5 列
const MASONRY_SIZES =
  "(max-width: 479px) 100vw, (max-width: 767px) 50vw, (max-width: 1023px) 33vw, (max-width: 1199px) 25vw, 20vw"

const Photos = memo(function Photos() {
  const { t } = useTranslation("photos")
  const containerRef = useRef(null)

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    // 动画是在 MutationObserver 回调里异步创建的，cleanup 时也得能拿到，故收集起来
    const tweens = []

    // 初始化动画
    const initAnimations = (items) => {
      // 创建滚动触发的动画
      gsap.utils.toArray(items).forEach((item, index) => {
        // 同样改用 fromTo 显式写出起止值：
        // from 会把「当前值」当终点，在 StrictMode 二次执行下会把中间态记成终点
        tweens.push(
          gsap.fromTo(
            item,
            { opacity: 0, y: 30 },
            {
              opacity: 1,
              y: 0,
              scrollTrigger: {
                trigger: item,
                start: "top 85%",
                toggleActions: "play none none none",
                once: true, // 只触发一次，减少性能消耗
              },
              duration: 0.6, // 减少动画时长
              delay: Math.min(index * 0.05, 0.5), // 限制最大延迟
              ease: "power2.out",
              overwrite: "auto",
              clearProps: "opacity,transform",
            },
          ),
        )
      })
    }

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

    return () => {
      observer.disconnect()
      tweens.forEach((tween) => {
        // ScrollTrigger 是挂在补间上的，要单独 kill，否则会残留滚动监听
        tween.scrollTrigger?.kill()
        tween.kill()
      })
      gsap.set(container.querySelectorAll(".mb-4"), {
        clearProps: "opacity,transform",
      })
    }
  }, [])

  // 顺序 = 展示顺序（保持迁移前的顺序不变）；file 指向 src/assets/photos 下的文件名
  const imagesArray = [
    {
      file: "null-1b04beaeed90173e.webp",
      date: "2026-01-29",
      key: "fl_chan",
      width: 1024,
      height: 768,
    },
    {
      file: "null-2eafa050439c7635.webp",
      date: "2026-01-29",
      key: "am_i_cute",
      width: 800,
      height: 1024,
    },
    {
      file: "null-6b1b4065f588152f.webp",
      date: "2026-01-29",
      key: "lying_on_the_grass",
      width: 1024,
      height: 1024,
    },
    {
      file: "null-6c0259fdb4e6a418.webp",
      date: "2025-11-21",
      key: "shining_leaves",
      width: 1200,
      height: 800,
    },
    {
      file: "null-10eb6585e10f2207.webp",
      date: "2026-01-29",
      key: "cat_or_orange",
      width: 900,
      height: 1200,
    },
    {
      file: "null-26dec620bdbd4947.webp",
      date: "2024-07-10",
      key: "golden_sunrise",
      width: 1024,
      height: 768,
    },
    {
      file: "null-33cb9df3bbc0c458.webp",
      date: "2025-01-29",
      key: "beneth_the_flowers",
      width: 800,
      height: 1024,
    },
    {
      file: "null-51e34fc69a518a71.webp",
      date: "2026-01-29",
      key: "bocchi_the_porter",
      width: 1024,
      height: 1024,
    },
    {
      file: "null-f5a331fdbf5053e.webp",
      date: "2025-01-29",
      key: "flourish",
      width: 1200,
      height: 800,
    },
    {
      file: "null2bb22a3bf55a40eb.webp",
      date: "2025-11-08",
      key: "nostalgia",
      width: 900,
      height: 1200,
    },
    {
      file: "null2cfea00e747f76f.webp",
      date: "2025-11-08",
      key: "sky_in_the_mirror",
      width: 1024,
      height: 768,
    },
    {
      file: "null2f413a18423e2f56.webp",
      date: "2025-07-17",
      key: "little_cat_and_big_chair",
      width: 800,
      height: 1024,
    },
    {
      file: "null2fcb6271cd5da46b.webp",
      date: "2025-10-07",
      key: "soft_cloud",
      width: 1024,
      height: 1024,
    },
    {
      file: "null5c3f45981a94e52f.webp",
      date: "2026-01-29",
      key: "walking_alone",
      width: 1200,
      height: 800,
    },
    {
      file: "null9bef06dffebdf12.webp",
      date: "2025-01-27",
      key: "carpeted_with_flowers",
      width: 900,
      height: 1200,
    },
    {
      file: "null36a0c8415048e93d.webp",
      date: "2025-01-29",
      key: "a_blaze_of_colour",
      width: 1024,
      height: 768,
    },
    {
      file: "null61ad2acbea908c1c.webp",
      date: "2025-02-13",
      key: "stare_into_the_distance",
      width: 800,
      height: 1024,
    },
    {
      file: "null173dd80a2b528fe6.webp",
      date: "2025-11-21",
      key: "playground_in_campus",
      width: 1024,
      height: 1024,
    },
    {
      file: "null547b4855305b3b08.webp",
      date: "2025-01-29",
      key: "splay_out",
      width: 1200,
      height: 800,
    },
    {
      file: "null57534381b9ebe35a.webp",
      date: "2025-01-29",
      key: "a_mass_of_blooms",
      width: 900,
      height: 1200,
    },
    {
      file: "null795854498ad0dbf6.webp",
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
            <div key={image.file} className="mb-4">
              <ImageCard
                srcSet={srcSetByFile[image.file]}
                sizes={MASONRY_SIZES}
                alt={t(image.key) || t("noName")}
                width={image.width}
                height={image.height}
                loading={index < 3 ? "eager" : "lazy"}
                fetchPriority={
                  index === 0 ? "high" : index < 3 ? "auto" : "low"
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
