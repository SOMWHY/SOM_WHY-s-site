import React, { memo, useRef, useEffect, useMemo } from "react"
import { ArrowUpRight, Github, Music2, Tv, Radio, Youtube, Mail } from "lucide-react"
import gsap from "gsap"
import { useTranslation } from "react-i18next"

// 原先独立成页、现已合并进本页的联系方式
const EMAIL_ADDRESS = "1928135011@qq.com"

const Links = memo(function Links() {
  const { t } = useTranslation("links")
  const containerRef = useRef(null)
  const imagePreviewRef = useRef(null)
  const linkRefs = useRef({})

  /**
   * 改成数据驱动：原先预览图是按数组下标从对象里取的
   * （Object.keys(linkImages)[index]），一旦条目数多于图片数就会取到 undefined。
   * 现在每条自带 image，没有预览图的条目（邮箱）直接不挂 hover 逻辑。
   */
  const linkItems = useMemo(
    () => [
      {
        id: "github",
        href: "https://github.com/SOMWHY/SOM_WHY-s-site",
        Icon: Github,
        image: "https://images.unsplash.com/photo-1618401471353-b98afee0b2eb?w=400&auto=format&fit=crop&q=80",
      },
      {
        id: "netease",
        href: "https://music.163.com/#/artist?id=35889036",
        Icon: Music2,
        image: "https://images.unsplash.com/photo-1652626627230-d7ddb64bf9e9?w=400&auto=format&fit=crop&q=80",
      },
      {
        id: "bilibili",
        href: "https://space.bilibili.com/394014714?spm_id_from=333.1007.0.0",
        Icon: Tv,
        image: "https://plus.unsplash.com/premium_photo-1664392122271-a1aedb05a7c6?w=400&auto=format&fit=crop&q=80",
      },
      {
        id: "loopspace",
        href: "https://somwhy.loopspace.club",
        Icon: Radio,
        image: "https://images.unsplash.com/photo-1578357078586-491adf1aa5ba?w=400&auto=format&fit=crop&q=80",
      },
      {
        id: "youtube",
        href: "https://www.youtube.com/@%E7%B4%A2%E5%A7%86%E6%AD%AA",
        Icon: Youtube,
        image: "https://images.unsplash.com/photo-1540655037529-dec987208707?w=400&auto=format&fit=crop&q=80",
      },
      {
        id: "email",
        href: `mailto:${EMAIL_ADDRESS}`,
        Icon: Mail,
        image: null,
        note: EMAIL_ADDRESS,
        external: false,
      },
    ],
    [],
  )

  useEffect(() => {
    if (!containerRef.current || !imagePreviewRef.current) return

    const imagePreview = imagePreviewRef.current

    gsap.set(imagePreview, {
      opacity: 0,
      scale: 0.8,
      pointerEvents: "none",
      zIndex: 1000,
    })

    const eventListeners = []

    for (const item of linkItems) {
      if (!item.image) continue

      const link = linkRefs.current[item.id]
      if (!link) continue

      const handleMouseEnter = () => {
        imagePreview.style.backgroundImage = `url(${item.image})`
        gsap.to(imagePreview, { opacity: 1, scale: 1, duration: 0.3, ease: "power2.out" })
      }

      const handleMouseMove = (e) => {
        gsap.to(imagePreview, {
          x: e.clientX - 250,
          y: e.clientY - 200,
          duration: 0.15,
          ease: "power2.out",
        })
      }

      const handleMouseLeave = () => {
        gsap.to(imagePreview, { opacity: 0, scale: 0.8, duration: 0.2, ease: "power2.in" })
      }

      link.addEventListener("mouseenter", handleMouseEnter)
      link.addEventListener("mousemove", handleMouseMove)
      link.addEventListener("mouseleave", handleMouseLeave)

      eventListeners.push({ link, handleMouseEnter, handleMouseMove, handleMouseLeave })
    }

    return () => {
      eventListeners.forEach(({ link, handleMouseEnter, handleMouseMove, handleMouseLeave }) => {
        link.removeEventListener("mouseenter", handleMouseEnter)
        link.removeEventListener("mousemove", handleMouseMove)
        link.removeEventListener("mouseleave", handleMouseLeave)
      })
    }
  }, [linkItems])

  return (
    <div
      className="w-full max-w-4xl px-6 md:px-0 relative z-10 py-12 pb-32"
      ref={containerRef}
    >
      {/* 悬停预览元素 */}
      <div
        ref={imagePreviewRef}
        className="fixed w-64 h-48 bg-cover bg-center rounded-lg shadow-xl"
        style={{
          willChange: "transform, opacity",
          backfaceVisibility: "hidden",
          transformStyle: "preserve-3d",
          zIndex: 1000,
          position: "fixed",
        }}
      />

      <header className="mb-16 text-center">
        <h1
          className="glitch-text font-mono text-3xl md:text-5xl uppercase mb-4 no-select"
          data-text={t("title")}
        >
          {t("title")}
        </h1>
        <p className="font-mono text-[10px] tracking-[0.4em] text-zinc-500 uppercase font-light">
          {t("subtitle")}
        </p>
      </header>

      <div className="grid grid-cols-1 gap-4">
        {linkItems.map((item) => {
          const { id, href, Icon, note, external = true } = item

          return (
            <a
              key={id}
              href={href}
              target={external ? "_blank" : undefined}
              rel={external ? "noopener noreferrer" : undefined}
              className="link-card flex items-center justify-between p-6 hover:bg-zinc-900/50 rounded-lg transition-all"
              ref={(el) => {
                linkRefs.current[id] = el
              }}
            >
              <div className="flex items-center gap-6">
                <Icon className="text-2xl text-zinc-400" />
                <span className="font-mono text-sm tracking-[0.2em] uppercase">
                  {t(id)}
                </span>
              </div>

              {note ? (
                <span className="flex items-center gap-4">
                  <span className="font-mono text-[10px] tracking-[0.15em] lowercase text-zinc-500">
                    {note}
                  </span>
                  <ArrowUpRight className="text-zinc-600" />
                </span>
              ) : (
                <ArrowUpRight className="text-zinc-600" />
              )}
            </a>
          )
        })}
      </div>
    </div>
  )
})

Links.displayName = "Links"

export default Links
