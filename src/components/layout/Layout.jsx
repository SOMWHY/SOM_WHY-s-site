import React, { memo, useState, useCallback, useEffect } from "react"
import { Outlet, useLocation, useNavigate } from "react-router-dom"
import {
  Header,
  Footer,
  NoiseOverlay,
  PlayerPortal,
  MouseTrail,
  LightOrbs,
  PageTransition,
} from "../index"
import usePlayerStore from "../../store/playerStore"

// 预加载组件映射
const preloadComponents = {
  "/": () => import("../../pages/Home"),
  "/works": () => import("../../pages/Works"),
  "/about": () => import("../../pages/About"),
  "/contact": () => import("../../pages/Contact"),
  "/links": () => import("../../pages/Links"),
  "/photos": () => import("../../pages/Photos"),
}

const Layout = memo(function Layout() {
  const { isPlaying, currentSong } = usePlayerStore()
  const location = useLocation()
  const navigate = useNavigate()
  const [isAnimating, setIsAnimating] = useState(false)
  const [nextPath, setNextPath] = useState(null)
  const [shouldNavigate, setShouldNavigate] = useState(false)

  // 根据路由动态改变页面标题
  useEffect(() => {
    const pathToTitle = {
      "/": "SOM_WHY | 索姆歪的小站",
      "/works": "SOM_WHY | WORKS",
      "/about": "SOM_WHY | ABOUT",
      "/contact": "SOM_WHY | CONTACT",
      "/links": "SOM_WHY | CONNECTION",
      "/photos": "SOM_WHY | PHOTOS",
    }
    document.title = pathToTitle[location.pathname] || "SOM_WHY | 索姆歪的小站"
  }, [location.pathname])

  // 预加载组件
  const preloadComponent = useCallback((path) => {
    if (preloadComponents[path]) {
      preloadComponents[path]()
    }
  }, [])

  // 处理导航
  const handleNavigate = useCallback(
    (path) => {
      if (path !== location.pathname) {
        // 预加载目标组件
        preloadComponent(path)
        setNextPath(path)
        setIsAnimating(true)
        setShouldNavigate(false)
      }
    },
    [location.pathname, preloadComponent],
  )

  // 动画进行中导航
  const handleAnimationProgress = useCallback(() => {
    if (nextPath && !shouldNavigate) {
      setShouldNavigate(true)
      navigate(nextPath)
    }
  }, [nextPath, shouldNavigate, navigate])

  // 动画完成后清理
  const handleAnimationComplete = useCallback(() => {
    setIsAnimating(false)
    setNextPath(null)
    setShouldNavigate(false)
  }, [])

  // 传递导航函数给子组件
  useEffect(() => {
    // 全局导航函数
    window.navigateWithAnimation = handleNavigate
  }, [handleNavigate])

  return (
    <div className="relative min-h-screen bg-background-light dark:bg-background-dark overflow-hidden flex flex-col">
      <NoiseOverlay />
      <div className="fixed bottom-24 left-0 right-0 h-px thin-line z-[5]"></div>
      <Header onNavigate={handleNavigate} />
      <main
        className="flex-grow flex flex-col items-center justify-center relative pt-24"
        style={{ viewTransitionName: "main-content" }}
      >
        <Outlet />
      </main>
      <Footer onNavigate={handleNavigate} />
      <PlayerPortal />
      <MouseTrail />
      {isPlaying && currentSong !== null ? <LightOrbs /> : null}
      <PageTransition
        isActive={isAnimating}
        onAnimationProgress={handleAnimationProgress}
        onAnimationComplete={handleAnimationComplete}
      />
    </div>
  )
})

Layout.displayName = "Layout"

export default Layout
