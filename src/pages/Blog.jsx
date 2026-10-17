import React, { memo, useEffect, useMemo, useRef } from "react"
import gsap from "gsap"
import { useTranslation } from "react-i18next"
import { posts } from "../utils/content"
import useLocaleStore from "../store/localeStore"
import PostCard from "../components/blog/PostCard"

const Blog = memo(function Blog() {
  const { t } = useTranslation("blog")
  const { locale } = useLocaleStore()
  const containerRef = useRef(null)

  const titleText = t("title")

  const labels = useMemo(
    () => ({ writtenOn: t("writtenOn"), minutes: t("minutes") }),
    [t],
  )

  // 入场：逐张卡片上浮
  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    const items = gsap.utils.toArray(container.querySelectorAll(".link-card"))
    if (!items.length) return

    /**
     * 必须用 fromTo 而不是 from：
     * from 会把「元素当前值」当作动画终点，且 immediateRender 会立刻把它置成起点。
     * 在 StrictMode 下 effect 会执行两次，若没有 cleanup，第二条 from 就会把
     * 「动画跑到一半的半透明中间态」记录成终点，
     * 卡片最终停在偏移且半透明的位置（opacity 不影响命中测试，所以还能点进去）。
     * fromTo 把起止值写死，任何重挂载都不会漂移。
     */
    const tweens = items.map((item, index) =>
      gsap.fromTo(
        item,
        { opacity: 0, y: 50 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          delay: index * 0.1,
          ease: "power2.out",
          // 同一元素上有冲突补间时自动让位
          overwrite: "auto",
          // 动画结束后清掉内联样式，避免残留 transform 影响后续 hover 表现
          clearProps: "opacity,transform",
        },
      ),
    )

    return () => {
      tweens.forEach((tween) => tween.kill())
      gsap.set(items, { clearProps: "opacity,transform" })
    }
  }, [])

  // 悬停：描边环沿路径画一圈
  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    const linkCards = container.querySelectorAll(".link-card")
    if (!linkCards.length) return

    const timelines = new Map()
    const eventHandlers = new Map()

    linkCards.forEach((card) => {
      const ring = card.querySelector(".ring-border")
      if (!ring) return

      const totalLength = ring.getTotalLength()

      gsap.set(ring, {
        strokeDasharray: totalLength,
        strokeDashoffset: totalLength,
      })

      const timeline = gsap.timeline({ paused: true })
      timeline.to(ring, {
        strokeDashoffset: 0,
        duration: 0.6,
        ease: "power2.out",
        force3D: true,
      })

      timelines.set(card, timeline)

      const handleMouseEnter = () => timeline.play(0)
      const handleMouseLeave = () => timeline.reverse()

      eventHandlers.set(card, { handleMouseEnter, handleMouseLeave })

      card.addEventListener("mouseenter", handleMouseEnter)
      card.addEventListener("mouseleave", handleMouseLeave)
    })

    return () => {
      linkCards.forEach((card) => {
        timelines.get(card)?.kill()
        const handlers = eventHandlers.get(card)
        if (handlers) {
          card.removeEventListener("mouseenter", handlers.handleMouseEnter)
          card.removeEventListener("mouseleave", handlers.handleMouseLeave)
        }
      })
    }
  }, [])

  return (
    <div className="w-full max-w-4xl px-6 md:px-0 relative z-10 py-12 pb-32">
      <header className="mb-16">
        <h1
          className="glitch-text font-mono text-3xl md:text-5xl uppercase mb-4 no-select"
          data-text={titleText}
        >
          {titleText}
        </h1>
        <p className="font-mono text-[10px] tracking-[0.4em] text-zinc-500 uppercase font-light">
          {t("subtitle")}
        </p>
      </header>

      <div ref={containerRef} className="grid grid-cols-1 gap-4">
        {posts.length === 0 ? (
          <div className="col-span-full text-center py-12">
            <p
              className="font-mono text-[10px] tracking-[0.3em] uppercase"
              style={{ color: "var(--muted)" }}
            >
              {t("empty")}
            </p>
          </div>
        ) : (
          posts.map((post) => (
            <PostCard key={post.slug} post={post} locale={locale} labels={labels} />
          ))
        )}
      </div>

      <div className="pb-24 md:pb-32"></div>
    </div>
  )
})

Blog.displayName = "Blog"

export default Blog
