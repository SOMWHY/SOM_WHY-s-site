import { useRef, useEffect, useCallback } from "react"
import { gsap } from "gsap"

const PageTransition = ({
  isActive,
  onAnimationProgress,
  onAnimationComplete,
}) => {
  const canvasRef = useRef(null)
  const containerRef = useRef(null)
  const scanlinesRef = useRef(null)
  const animationRef = useRef(null)
  const noiseAnimationRef = useRef(null)

  // 生成噪点
  const generateNoise = useCallback(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    const width = canvas.width
    const height = canvas.height
    const imageData = ctx.createImageData(width, height)
    const data = imageData.data

    for (let i = 0; i < data.length; i += 4) {
      const noise = Math.random() * 255
      data[i] = noise // R
      data[i + 1] = noise // G
      data[i + 2] = noise // B
      data[i + 3] = Math.random() * 100 // A
    }

    ctx.putImageData(imageData, 0, 0)
  }, [])

  // 动画循环
  const animateNoise = useCallback(() => {
    const animate = () => {
      generateNoise()
      noiseAnimationRef.current = requestAnimationFrame(animate)
    }
    animate()
  }, [generateNoise])

  // 停止动画
  const stopNoiseAnimation = useCallback(() => {
    if (noiseAnimationRef.current) {
      cancelAnimationFrame(noiseAnimationRef.current)
      noiseAnimationRef.current = null
    }
  }, [])

  // 创建GSAP动画
  const createAnimation = useCallback(() => {
    if (animationRef.current) {
      animationRef.current.kill()
    }

    const timeline = gsap.timeline({
      onComplete: () => {
        stopNoiseAnimation()
        if (onAnimationComplete) {
          onAnimationComplete()
        }
      },
      onReverseComplete: () => {
        stopNoiseAnimation()
      },
    })

    // 淡入阶段
    timeline.fromTo(
      containerRef.current,
      {
        opacity: 0,
      },
      {
        opacity: 1,
        duration: 0.1,
      },
    )

    // 扫描线动画
    timeline.fromTo(
      scanlinesRef.current.children,
      {
        scaleY: 0,
        transformOrigin: "center",
      },
      {
        scaleY: 1,
        duration: 0.4,
        stagger: 0.05,
      },
      0,
    )

    // 在动画更早阶段触发路由切换
    timeline.add(() => {
      if (onAnimationProgress) {
        onAnimationProgress()
      }
    }, "+=0.1")

    // 淡出阶段
    timeline.to(
      containerRef.current,
      {
        opacity: 0,
        duration: 0.1,
      },
      "+=0.1",
    )

    animationRef.current = timeline
  }, [onAnimationProgress, onAnimationComplete, stopNoiseAnimation])

  // 初始化和清理
  useEffect(() => {
    if (isActive) {
      animateNoise()
      createAnimation()
    }

    return () => {
      stopNoiseAnimation()
      if (animationRef.current) {
        animationRef.current.kill()
      }
    }
  }, [isActive, animateNoise, createAnimation, stopNoiseAnimation])

  if (!isActive) return null

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 z-[9999] pointer-events-none"
      style={{ backgroundColor: "var(--bg)" }}
    >
      {/* 边框效果 */}
      <div className="absolute inset-0 bg-gradient-to-r from-current/10 via-transparent to-current/10"></div>
      <div className="absolute inset-0 bg-gradient-to-b from-current/10 via-transparent to-current/10"></div>

      {/* 噪点效果 */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full"
        width={window.innerWidth}
        height={window.innerHeight}
      ></canvas>

      {/* 扫描线 */}
      <div
        ref={scanlinesRef}
        className="absolute inset-0 flex flex-col items-center justify-center"
      >
        {[...Array(5)].map((_, index) => (
          <div key={index} className="w-full h-px bg-current/30 my-4"></div>
        ))}
      </div>
    </div>
  )
}

export default PageTransition
