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

  /**
   * 两个回调必须由 ref 持有，绝不能直接放进 createAnimation 的依赖数组。
   *
   * onAnimationProgress 会在时间线 0.7s 处触发路由导航，而它自身的依赖
   * （Layout 里的 nextPath / shouldNavigate）会因为这次 setState 而变化，
   * 于是回调引用一变 → createAnimation 引用跟着变 → 主 useEffect 重新执行：
   * 先 kill 掉正在跑的时间线，再新建一条；而新时间线的首段是
   * fromTo(container, { opacity: 0 }, ...)，immediateRender 会立刻把遮罩
   * 置为透明 —— 页面就在动画中途被漏出来，闪一下。
   *
   * 用 ref 持有即可切断「父组件重渲染 → 引用变化 → 重建时间线」这条链，
   * 时间线得以从淡入连续播到淡出，全程以 opacity 1 盖住路由切换。
   */
  const progressRef = useRef(onAnimationProgress)
  const completeRef = useRef(onAnimationComplete)

  // 刻意不写依赖数组：每次渲染后同步最新引用（避免在 render 阶段直接写 ref）
  useEffect(() => {
    progressRef.current = onAnimationProgress
    completeRef.current = onAnimationComplete
  })

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
  // 依赖数组只保留 stopNoiseAnimation（引用稳定），回调一律走 ref
  const createAnimation = useCallback(() => {
    if (animationRef.current) {
      animationRef.current.kill()
    }

    const timeline = gsap.timeline({
      onComplete: () => {
        stopNoiseAnimation()
        completeRef.current?.()
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

    // 在动画更早阶段触发路由切换（此时遮罩仍是 opacity 1，全覆盖）
    timeline.add(() => {
      progressRef.current?.()
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
  }, [stopNoiseAnimation])

  // 初始化和清理
  // 除 isActive 外，这里的依赖（animateNoise / createAnimation / stopNoiseAnimation）
  // 引用都保持稳定，因此本 effect 只在 isActive 由 false→true 时执行一次，
  // 时间线不会被父组件的重渲染打断重建。
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
