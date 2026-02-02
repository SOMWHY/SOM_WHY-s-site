import React, { memo, useRef, useEffect, useMemo } from "react"
import { ArrowUpRight } from "lucide-react"
import gsap from "gsap"

const Links = memo(function Links() {
  const containerRef = useRef(null)
  const imagePreviewRef = useRef(null)
  const linkRefs = useRef([])

  // 为每个链接定义预览图像
  const linkImages = useMemo(
    () => ({
      github:
        "https://images.unsplash.com/photo-1618401471353-b98afee0b2eb?w=400&auto=format&fit=crop&q=80",
      neteasecloudmusic:
        "https://images.unsplash.com/photo-1652626627230-d7ddb64bf9e9?w=400&auto=format&fit=crop&q=80",
      bilibili:
        "https://plus.unsplash.com/premium_photo-1664392122271-a1aedb05a7c6?w=400&auto=format&fit=crop&q=80",
      loopspace:
        "https://images.unsplash.com/photo-1578357078586-491adf1aa5ba?w=400&auto=format&fit=crop&q=80",
      youtube:
        "https://images.unsplash.com/photo-1540655037529-dec987208707?w=400&auto=format&fit=crop&q=80",
    }),
    [],
  )

  useEffect(() => {
    if (!containerRef.current || !imagePreviewRef.current) return

    const imagePreview = imagePreviewRef.current

    // 初始化图像预览元素
    gsap.set(imagePreview, {
      opacity: 0,
      scale: 0.8,
      pointerEvents: "none",
      zIndex: 1000,
    })

    // 存储所有事件监听器，以便在清理时移除
    const eventListeners = []

    // 为每个链接添加事件监听器
    linkRefs.current.forEach((link, index) => {
      if (!link) return

      const linkId = Object.keys(linkImages)[index]
      const imageUrl = linkImages[linkId]

      // 鼠标进入事件
      const handleMouseEnter = () => {
        // 设置图像源
        imagePreview.style.backgroundImage = `url(${imageUrl})`

        // 淡入图像预览
        gsap.to(imagePreview, {
          opacity: 1,
          scale: 1,
          duration: 0.3,
          ease: "power2.out",
        })
      }

      // 鼠标移动事件
      const handleMouseMove = (e) => {
        // 跟踪鼠标位置，调整偏移量使图像预览出现在鼠标左上方
        const x = e.clientX - 250
        const y = e.clientY - 200

        // 平滑移动图像预览
        gsap.to(imagePreview, {
          x: x,
          y: y,
          duration: 0.15,
          ease: "power2.out",
        })
      }

      // 鼠标离开事件
      const handleMouseLeave = () => {
        // 淡出图像预览
        gsap.to(imagePreview, {
          opacity: 0,
          scale: 0.8,
          duration: 0.2,
          ease: "power2.in",
        })
      }

      // 添加事件监听器
      link.addEventListener("mouseenter", handleMouseEnter)
      link.addEventListener("mousemove", handleMouseMove)
      link.addEventListener("mouseleave", handleMouseLeave)

      // 存储事件监听器，以便在清理时移除
      eventListeners.push({
        link,
        handleMouseEnter,
        handleMouseMove,
        handleMouseLeave,
      })
    })

    // 清理函数
    return () => {
      // 移除所有事件监听器
      eventListeners.forEach(
        ({ link, handleMouseEnter, handleMouseMove, handleMouseLeave }) => {
          link.removeEventListener("mouseenter", handleMouseEnter)
          link.removeEventListener("mousemove", handleMouseMove)
          link.removeEventListener("mouseleave", handleMouseLeave)
        },
      )
    }
  }, [linkImages])

  return (
    <div
      className="w-full max-w-4xl px-6 md:px-0 relative z-10 py-12 pb-32"
      ref={containerRef}
    >
      {/* 图像预览元素 */}
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
          data-text="CONNECTION"
        >
          CONNECTION
        </h1>
        <p className="font-mono text-[10px] tracking-[0.4em] text-zinc-500 uppercase font-light">
          Digital Frequency Access
        </p>
      </header>

      <div className="grid grid-cols-1 gap-4">
        <a
          href="https://github.com/SOMWHY/SOM_WHY-s-site"
          target="_blank"
          className="link-card flex items-center justify-between p-6 hover:bg-zinc-900/50 rounded-lg transition-all"
          ref={(el) => (linkRefs.current[0] = el)}
        >
          <div className="flex items-center gap-6">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="text-2xl text-zinc-400"
            >
              <path d="M12 2a10 10 0 0 0-7.72 16.32"></path>
              <path d="M12 2a10 10 0 0 1 7.72 16.32"></path>
              <path d="M12 6v6l4 2"></path>
            </svg>
            <span className="font-mono text-sm tracking-[0.2em] uppercase">
              GitHub
            </span>
          </div>
          <ArrowUpRight className="text-zinc-600" />
        </a>

        <a
          href="https://music.163.com/#/artist?id=35889036"
          target="_blank"
          className="link-card flex items-center justify-between p-6 hover:bg-zinc-900/50 rounded-lg transition-all"
          ref={(el) => (linkRefs.current[1] = el)}
        >
          <div className="flex items-center gap-6">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="text-2xl text-zinc-400"
            >
              <path d="M12 19h9"></path>
              <path d="M19 19V5a2 2 0 0 0-2-2H3a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h9"></path>
              <path d="m7 10 3 3-3 3"></path>
            </svg>
            <span className="font-mono text-sm tracking-[0.2em] uppercase">
              NetEase Cloud Music
            </span>
          </div>
          <ArrowUpRight className="text-zinc-600" />
        </a>

        <a
          href="https://space.bilibili.com/394014714?spm_id_from=333.1007.0.0"
          target="_blank"
          className="link-card flex items-center justify-between p-6 hover:bg-zinc-900/50 rounded-lg transition-all"
          ref={(el) => (linkRefs.current[2] = el)}
        >
          <div className="flex items-center gap-6">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="text-2xl text-zinc-400"
            >
              <rect width="20" height="20" x="2" y="2" rx="5" ry="5"></rect>
              <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
              <line x1="17.5" x2="17.51" y1="6.5" y2="6.5"></line>
            </svg>
            <span className="font-mono text-sm tracking-[0.2em] uppercase">
              Bilibili
            </span>
          </div>
          <ArrowUpRight className="text-zinc-600" />
        </a>

        <a
          href="https://somwhy.loopspace.club"
          target="_blank"
          className="link-card flex items-center justify-between p-6 hover:bg-zinc-900/50 rounded-lg transition-all"
          ref={(el) => (linkRefs.current[3] = el)}
        >
          <div className="flex items-center gap-6">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="text-xl text-zinc-400"
            >
              <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"></path>
            </svg>
            <span className="font-mono text-sm tracking-[0.2em] uppercase">
              Loopspace
            </span>
          </div>
          <ArrowUpRight className="text-zinc-600" />
        </a>

        <a
          href="https://www.youtube.com/@%E7%B4%A2%E5%A7%86%E6%AD%AA"
          target="_blank"
          className="link-card flex items-center justify-between p-6 hover:bg-zinc-900/50 rounded-lg transition-all"
          ref={(el) => (linkRefs.current[4] = el)}
        >
          <div className="flex items-center gap-6">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="text-2xl text-zinc-400"
            >
              <path d="M2.5 17a24.12 24.12 0 0 1 0-10 2 2 0 0 1 1.4-1.4 49.56 49.56 0 0 1 16.2 0A2 2 0 0 1 21.5 7a24.12 24.12 0 0 1 0 10 2 2 0 0 1-1.4 1.4 49.55 49.55 0 0 1-16.2 0A2 2 0 0 1 2.5 17"></path>
              <path d="m10 15 5-3-5-3z"></path>
            </svg>
            <span className="font-mono text-sm tracking-[0.2em] uppercase">
              YouTube
            </span>
          </div>
          <ArrowUpRight className="text-zinc-600" />
        </a>
      </div>
    </div>
  )
})

Links.displayName = "Links"

export default Links
