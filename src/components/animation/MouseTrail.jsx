import React, { useEffect, useRef, memo } from "react"
import gsap from "gsap"

const MouseTrail = memo(() => {
  const containerRef = useRef(null)
  const particlesRef = useRef([])
  const maxParticles = 20
  const lastCreateTimeRef = useRef(0)
  const createInterval = 50 // 限制粒子创建频率，每50ms最多创建一个粒子

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    // 创建粒子池，预分配粒子元素
    const createParticlePool = () => {
      for (let i = 0; i < maxParticles; i++) {
        const particle = document.createElement("div")
        particle.className = "absolute pointer-events-none"
        particle.innerHTML = "🌸"
        particle.style.fontSize = "12px"
        particle.style.opacity = "0"
        particle.style.position = "fixed"
        // 使用will-change优化动画性能
        particle.style.willChange = "transform, opacity"
        container.appendChild(particle)
        particlesRef.current.push({ element: particle, inUse: false })
      }
    }

    // 从粒子池中获取可用粒子
    const getAvailableParticle = () => {
      // 优先使用未使用的粒子
      const availableParticle = particlesRef.current.find((p) => !p.inUse)
      if (availableParticle) {
        return availableParticle
      }

      // 如果没有可用粒子，使用最早创建的粒子
      return particlesRef.current[0]
    }

    const createParticle = (x, y) => {
      const particleObj = getAvailableParticle()
      const particle = particleObj.element

      // 重置粒子状态
      gsap.killTweensOf(particle)
      particleObj.inUse = true

      // 使用transform代替top/left，提高性能
      gsap.set(particle, {
        x: x,
        y: y,
        opacity: 0,
        scale: 0.8,
        rotation: 0,
      })

      gsap
        .timeline()
        .fromTo(
          particle,
          { opacity: 0.8, x: x, y: y, rotation: 0, scale: 0.8 },
          {
            opacity: 0,
            x: x + gsap.utils.random(-30, 30),
            y: y + gsap.utils.random(-40, -20),
            rotation: gsap.utils.random(-360, 360),
            scale: 1.2,
            duration: 0.8,
            ease: "power2.out",
          },
        )
        .to(
          particle,
          {
            duration: 0.8,
            onComplete: () => {
              particleObj.inUse = false
            },
          },
          0.8,
        )
    }

    // 添加节流处理，减少鼠标移动时的粒子创建频率
    const handleMouseMove = (e) => {
      const now = performance.now()
      if (now - lastCreateTimeRef.current < createInterval) {
        return
      }

      lastCreateTimeRef.current = now
      const { clientX, clientY } = e
      createParticle(clientX, clientY)
    }

    // 初始化粒子池
    createParticlePool()

    window.addEventListener("mousemove", handleMouseMove)

    return () => {
      window.removeEventListener("mousemove", handleMouseMove)
      particlesRef.current.forEach(({ element }) => {
        gsap.killTweensOf(element)
        if (container.contains(element)) {
          container.removeChild(element)
        }
      })
      particlesRef.current = []
    }
  }, [])

  return (
    <div
      ref={containerRef}
      className="fixed top-0 left-0 w-full h-full pointer-events-none z-50"
    />
  )
})

MouseTrail.displayName = "MouseTrail"

export default MouseTrail
