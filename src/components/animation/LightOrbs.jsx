import React, { useEffect, useRef, memo } from "react"
import gsap from "gsap"

const LightOrbs = memo(() => {
  const containerRef = useRef(null)
  const orbsRef = useRef([])
  const maxOrbs = 15

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    let animationId = null
    let lastCreateTime = 0
    const createInterval = 1000 // 1 second interval
    let currentOrbIndex = 0

    // Pre-create all orbs
    const createOrbs = () => {
      for (let i = 0; i < maxOrbs; i++) {
        const orb = document.createElement("div")
        orb.className = "absolute pointer-events-none"
        orb.style.width = "8px"
        orb.style.height = "8px"
        orb.style.borderRadius = "50%"
        orb.style.backgroundColor = "rgba(255, 255, 255, 0.8)"
        orb.style.boxShadow =
          "0 0 10px rgba(255, 255, 255, 0.8), 0 0 20px rgba(255, 255, 255, 0.5)"
        orb.style.opacity = "0"
        orb.style.pointerEvents = "none"
        // 使用will-change优化动画性能
        orb.style.willChange = "transform, opacity"
        // 使用fixed定位确保动画流畅
        orb.style.position = "fixed"

        container.appendChild(orb)
        orbsRef.current.push(orb)
      }
    }

    // Animate a single orb
    const animateOrb = (orb) => {
      // 计算随机起始位置
      const startX = Math.random() * window.innerWidth
      const startY = window.innerHeight

      // Reset orb position and opacity using transform
      gsap.set(orb, {
        x: startX,
        y: startY,
        opacity: 0,
        scale: 0.5,
      })

      // Animate the orb
      gsap
        .timeline()
        .fromTo(
          orb,
          { opacity: 0, scale: 0.5 },
          {
            opacity: 0.8,
            y: -50, // 移动到视口顶部上方
            scale: 1.2,
            duration: gsap.utils.random(8, 12),
            ease: "power1.in",
            x: startX + gsap.utils.random(-100, 100),
          },
        )
        .to(
          orb,
          {
            opacity: 0,
            duration: 2,
            ease: "power2.out",
          },
          "-=2",
        )
    }

    // Create all orbs upfront
    createOrbs()

    // 初始启动所有orb的动画，错开时间
    orbsRef.current.forEach((orb, index) => {
      setTimeout(
        () => {
          animateOrb(orb)
        },
        index * (createInterval / 2),
      )
    })

    // Main animation loop - 只负责触发新的动画
    const animate = (timestamp) => {
      if (timestamp - lastCreateTime > createInterval) {
        // Use the next orb in the array (cycle through)
        const orb = orbsRef.current[currentOrbIndex]
        animateOrb(orb)

        // Move to next orb index
        currentOrbIndex = (currentOrbIndex + 1) % maxOrbs
        lastCreateTime = timestamp
      }
      animationId = requestAnimationFrame(animate)
    }

    // Start animation
    animate(0)

    // Store orbs reference for cleanup
    const orbs = orbsRef.current

    return () => {
      if (animationId) {
        cancelAnimationFrame(animationId)
      }
      // Kill all tweens
      orbs.forEach((orb) => {
        gsap.killTweensOf(orb)
      })
    }
  }, [])

  return (
    <div
      ref={containerRef}
      className="fixed top-0 left-0 w-full h-full pointer-events-none z-5"
    />
  )
})

LightOrbs.displayName = "LightOrbs"

export default LightOrbs
