import React, { memo, useEffect, useMemo, useRef } from "react"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { useTranslation } from "react-i18next"
import { containsChinese } from "../utils/textUtils"
import useLocaleStore from "../store/localeStore"
import { projects } from "../utils/content"
import ProjectCard from "../components/works/ProjectCard"

gsap.registerPlugin(ScrollTrigger)

const Works = memo(function Works() {
  const { t } = useTranslation("works")
  const { locale } = useLocaleStore()
  const containerRef = useRef(null)

  const sectionText = t("section")
  const titleText = t("title")

  const sectionClassName = useMemo(
    () => (containsChinese(sectionText) ? "font-mono-zh" : "font-mono"),
    [sectionText],
  )
  const titleClassName = useMemo(
    () => (containsChinese(titleText) ? "font-mono-zh" : ""),
    [titleText],
  )

  // 卡片外链按钮的 aria-label，随语言切换
  const labels = useMemo(
    () => ({
      role: t("role"),
      readCase: t("readCase"),
      viewRepo: t("viewRepo"),
      liveDemo: t("liveDemo"),
    }),
    [t],
  )

  // 入场：逐张卡片上浮
  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    const items = gsap.utils.toArray(container.querySelectorAll(".link-card"))
    if (!items.length) return

    /**
     * 与 Blog.jsx 保持一致：用 fromTo 显式写出起止值。
     * from 会把「元素当前值」当作终点，而 StrictMode 下 effect 会执行两次，
     * 若没有 cleanup，第二条补间就会把「动画跑到一半的中间态」记录成终点，
     * 卡片最终停在偏移且半透明的位置（opacity 不影响命中测试，所以还能点）。
     */
    const tweens = items.map((item, index) =>
      gsap.fromTo(
        item,
        { opacity: 0, y: 50 },
        {
          opacity: 1,
          y: 0,
          scrollTrigger: {
            trigger: item,
            start: "top 80%",
            toggleActions: "play none none none",
          },
          duration: 0.8,
          delay: index * 0.1,
          ease: "power2.out",
          overwrite: "auto",
          clearProps: "opacity,transform",
        },
      ),
    )

    return () => {
      tweens.forEach((tween) => {
        // ScrollTrigger 是挂在补间上的，要单独 kill，否则会残留滚动监听
        tween.scrollTrigger?.kill()
        tween.kill()
      })
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
      <div className="mb-16">
        <h2
          className={`${sectionClassName} text-[10px] tracking-[0.6em] uppercase mb-4`}
          style={{ color: "var(--muted)" }}
        >
          {sectionText}
        </h2>
        <h1
          className={`${titleClassName} text-4xl md:text-6xl font-mono text-transparent bg-clip-text bg-gradient-to-r uppercase`}
          style={{
            backgroundImage: "linear-gradient(to right, var(--text), var(--muted))",
          }}
        >
          {titleText}
        </h1>
      </div>

      <div ref={containerRef} className="grid grid-cols-1 gap-4">
        {projects.length === 0 ? (
          <div className="col-span-full text-center py-12">
            <p
              className="font-mono text-[10px] tracking-[0.3em] uppercase"
              style={{ color: "var(--muted)" }}
            >
              {t("empty")}
            </p>
          </div>
        ) : (
          projects.map((project, index) => (
            <ProjectCard
              key={project.slug}
              project={project}
              index={index}
              locale={locale}
              labels={labels}
            />
          ))
        )}
      </div>

      <div className="pb-24 md:pb-32"></div>
    </div>
  )
})

Works.displayName = "Works"

export default Works
