import React, { memo, useState, useRef, useEffect, useMemo } from "react"
import { Link, useLocation } from "react-router-dom"
import { X, Sun, Moon } from "lucide-react"
import gsap from "gsap"
import { useApp } from "../../hooks/useApp"
import { useTranslation } from "react-i18next"
import LanguageSwitcher from "../ui/LanguageSwitcher"
import { containsChinese } from "../../utils/textUtils"

const Header = memo(function Header({ onNavigate }) {
  const { isDarkMode, toggleTheme } = useApp()
  const { t } = useTranslation("common")
  const [_IS_MENU_OPEN, setIsMenuOpen] = useState(false)
  const [isAnimating, setIsAnimating] = useState(false)
  const location = useLocation()
  const menuButtonRef = useRef(null)
  const overlayRef = useRef(null)
  const navLinksRef = useRef([])
  const logoRef = useRef(null)
  const logoCharsRef = useRef([])
  const navLinkRefs = useRef({})

  const navLinkClassName = useMemo(() => {
    const hasChinese = [
      t("nav.works"),
      t("nav.about"),
      t("nav.contact"),
      t("nav.links"),
      t("nav.photos"),
    ].some((text) => containsChinese(text))
    return hasChinese ? "font-mono-zh" : "font-mono"
  }, [t])

  const toggleMenu = () => {
    if (isAnimating) return
    setIsAnimating(true)

    // GSAP animation timeline for blinds flip effect
    gsap
      .timeline({
        onStart: () => {
          setIsMenuOpen(true)
          if (overlayRef.current) {
            overlayRef.current.style.pointerEvents = "auto"
          }
        },
        onComplete: () => {
          setIsAnimating(false)
        },
      })
      .to(overlayRef.current, {
        opacity: 1,
        duration: 0.3, // Reduced duration
        ease: "power2.out",
      })
      .fromTo(
        navLinksRef.current,
        {
          rotationX: -90, // Start from closed position (vertical)
          opacity: 0,
          y: 15, // Reduced y offset
          transformOrigin: "top center", // Flip from top
        },
        {
          rotationX: 0, // End at open position (horizontal)
          opacity: 1,
          y: 0,
          duration: 0.5, // Reduced duration
          ease: "back.out(1.2)", // Back ease for more realistic flip
          stagger: 0.05, // Reduced stagger delay
        },
        0.05, // Reduced delay
      )
  }

  const closeMenu = () => {
    if (isAnimating) return
    setIsAnimating(true)

    // GSAP animation timeline for reverse blinds flip effect
    gsap
      .timeline({
        onComplete: () => {
          setIsMenuOpen(false)
          setIsAnimating(false)
          if (overlayRef.current) {
            overlayRef.current.style.pointerEvents = "none"
          }
        },
      })
      .to(navLinksRef.current, {
        rotationX: -90, // Flip back to closed position
        opacity: 0,
        y: 15, // Reduced y offset
        duration: 0.4, // Reduced duration
        ease: "power2.in",
        stagger: {
          amount: 0.2, // Total stagger duration
          from: "end", // Start from last element (reverse order)
          each: 0.04, // Delay between each element
        },
        transformOrigin: "top center", // Ensure correct transform origin for close animation
      })
      .to(
        overlayRef.current,
        {
          opacity: 0,
          duration: 0.3, // Reduced duration
          ease: "power2.out",
        },
        0,
      )
  }

  // 处理导航点击
  const handleNavClick = (path, closeMenuAfter = false) => {
    if (onNavigate) {
      onNavigate(path)
    }
    if (closeMenuAfter) {
      closeMenu()
    }
  }

  // Add nav link to refs array
  const addNavLinkRef = (el) => {
    if (el && !navLinksRef.current.includes(el)) {
      navLinksRef.current.push(el)
    }
  }

  // Split logo text into characters and create animation
  useEffect(() => {
    const logoElement = logoRef.current
    if (!logoElement) return

    // Ensure we have the original text
    const originalText = "Somwhy"
    let isAnimating = false
    let currentAnimation = null

    // Clear existing characters
    logoCharsRef.current = []
    logoElement.textContent = ""

    // Split text into characters and wrap each in span
    for (let i = 0; i < originalText.length; i++) {
      const charSpan = document.createElement("span")
      charSpan.textContent = originalText[i]
      charSpan.style.display = "inline-block"
      charSpan.style.position = "relative"
      charSpan.style.overflow = "hidden"
      logoElement.appendChild(charSpan)
      logoCharsRef.current.push(charSpan)
    }

    // Add hover animation for logo
    const handleLogoMouseEnter = () => {
      if (logoCharsRef.current.length === 0) return
      if (isAnimating) return

      isAnimating = true

      // Kill any existing animation first
      if (currentAnimation) {
        currentAnimation.kill()
      }

      // Reset all characters to starting position
      gsap.set(logoCharsRef.current, { y: 0 })

      // Create new animation
      currentAnimation = gsap.to(logoCharsRef.current, {
        y: -100,
        duration: 0.3,
        ease: "power2.inOut",
        stagger: 0.03,
        repeat: 1,
        yoyo: true,
        onComplete: () => {
          isAnimating = false
          currentAnimation = null
        },
      })
    }

    logoElement.addEventListener("mouseenter", handleLogoMouseEnter)

    return () => {
      logoElement.removeEventListener("mouseenter", handleLogoMouseEnter)
      if (currentAnimation) {
        currentAnimation.kill()
      }
    }
  }, [])

  // Create gear-like animation for navigation links
  useEffect(() => {
    const links = navLinkRefs.current
    const cleanupFunctions = []

    const linkTexts = {
      works: t("nav.works"),
      about: t("nav.about"),
      contact: t("nav.contact"),
      links: t("nav.links"),
      photos: t("nav.photos"),
    }

    Object.keys(links).forEach((key) => {
      const linkElement = links[key]
      if (!linkElement) return

      // Get original text
      const originalText = linkTexts[key]

      // Clear link element completely
      while (linkElement.firstChild) {
        linkElement.removeChild(linkElement.firstChild)
      }

      // Create container for both text layers
      const container = document.createElement("div")
      container.style.position = "relative"
      container.style.overflow = "hidden"
      container.style.display = "inline-block"

      // Create original text span (light color)
      const originalSpan = document.createElement("span")
      originalSpan.textContent = originalText
      originalSpan.style.display = "block"
      originalSpan.style.color = "rgb(115, 115, 115)" // Light gray color

      // Create colored text span (current text color)
      const coloredSpan = document.createElement("span")
      coloredSpan.textContent = originalText
      coloredSpan.style.display = "block"
      coloredSpan.style.position = "absolute"
      coloredSpan.style.top = "0"
      coloredSpan.style.left = "0"
      coloredSpan.style.color = "var(--text)"
      coloredSpan.style.opacity = "0"
      coloredSpan.style.transform = "translateX(100%)"

      // Add spans to container
      container.appendChild(originalSpan)
      container.appendChild(coloredSpan)
      linkElement.appendChild(container)

      // Store animation instances
      let originalSpanAnimation = null
      let coloredSpanAnimation = null

      // Check if current link is active based on pathname
      const isActive =
        location.pathname === `/${key}` ||
        (key === "links" && location.pathname === "/links")

      // Set initial state for active link
      if (isActive) {
        gsap.set(originalSpan, { x: "-100%", opacity: 1 })
        gsap.set(coloredSpan, { x: "0%", opacity: 1 })
      } else {
        gsap.set(originalSpan, { x: "0%", opacity: 1 })
        gsap.set(coloredSpan, { x: "100%", opacity: 0 })
      }

      // Mouse enter animation
      const handleMouseEnter = () => {
        // Kill any existing animations
        if (originalSpanAnimation) originalSpanAnimation.kill()
        if (coloredSpanAnimation) coloredSpanAnimation.kill()

        // Force reset to starting positions
        if (!isActive) {
          gsap.set(originalSpan, { x: "0%", opacity: 1 })
          gsap.set(coloredSpan, { x: "100%", opacity: 0 })
        }

        // Create new animations
        originalSpanAnimation = gsap.to(originalSpan, {
          x: "-100%",
          duration: 0.15,
          ease: "power2.inOut",
        })
        coloredSpanAnimation = gsap.to(coloredSpan, {
          x: "0%",
          opacity: 1,
          duration: 0.15,
          ease: "power2.inOut",
          delay: 0.05,
        })
      }

      // Mouse leave animation
      const handleMouseLeave = () => {
        // Kill any existing animations
        if (originalSpanAnimation) originalSpanAnimation.kill()
        if (coloredSpanAnimation) coloredSpanAnimation.kill()

        // Only animate if not active
        if (!isActive) {
          // Force reset to starting positions
          gsap.set(coloredSpan, { x: "0%", opacity: 1 })
          gsap.set(originalSpan, { x: "-100%", opacity: 1 })

          // Create new animations
          coloredSpanAnimation = gsap.to(coloredSpan, {
            x: "100%",
            opacity: 0,
            duration: 0.15,
            ease: "power2.inOut",
          })
          originalSpanAnimation = gsap.to(originalSpan, {
            x: "0%",
            opacity: 1,
            duration: 0.15,
            ease: "power2.inOut",
            delay: 0.05,
          })
        }
      }

      // Add event listeners
      linkElement.addEventListener("mouseenter", handleMouseEnter)
      linkElement.addEventListener("mouseleave", handleMouseLeave)

      // Store cleanup function
      cleanupFunctions.push(() => {
        linkElement.removeEventListener("mouseenter", handleMouseEnter)
        linkElement.removeEventListener("mouseleave", handleMouseLeave)
        if (originalSpanAnimation) originalSpanAnimation.kill()
        if (coloredSpanAnimation) coloredSpanAnimation.kill()
      })
    })

    return () => {
      cleanupFunctions.forEach((cleanup) => cleanup())
    }
  }, [location.pathname, t])

  return (
    <>
      <header
        className="fixed top-0 left-0 right-0 z-[30] flex items-center px-6 py-6 md:px-12 backdrop-blur-md border-b border-white/10 transition-all duration-300"
        style={{
          viewTransitionName: "brand-header",
          backgroundColor: isDarkMode
            ? "rgba(9, 9, 11, 0.8)"
            : "rgba(250, 250, 250, 0.8)",
          boxShadow: isDarkMode
            ? "0 2px 20px rgba(0, 0, 0, 0.3)"
            : "0 2px 20px rgba(0, 0, 0, 0.05)",
          borderColor: isDarkMode
            ? "rgba(255, 255, 255, 0.1)"
            : "rgba(0, 0, 0, 0.1)",
        }}
      >
        <div
          ref={logoRef}
          onClick={() => handleNavClick("/")}
          className="font-logo text-xl md:text-2xl tracking-tight text-current no-select cursor-pointer"
        >
          Somwhy
        </div>

        {/* Spacer to center navigation */}
        <div className="flex-1"></div>

        {/* Desktop Navigation - Centered */}
        <nav className="hidden lg:flex items-center space-x-8 absolute left-1/2 transform -translate-x-1/2">
          <div
            ref={(el) => {
              navLinkRefs.current.works = el
            }}
            onClick={() => handleNavClick("/works")}
            className="font-mono text-[10px] tracking-[0.3em] uppercase transition-all text-zinc-500 hover:text-current dark:hover:text-current cursor-pointer"
          >
            Works
          </div>
          <div
            ref={(el) => {
              navLinkRefs.current.about = el
            }}
            onClick={() => handleNavClick("/about")}
            className="font-mono text-[10px] tracking-[0.3em] uppercase transition-all text-zinc-500 hover:text-current dark:hover:text-current cursor-pointer"
          >
            About
          </div>
          <div
            ref={(el) => {
              navLinkRefs.current.contact = el
            }}
            onClick={() => handleNavClick("/contact")}
            className="font-mono text-[10px] tracking-[0.3em] uppercase transition-all text-zinc-500 hover:text-current dark:hover:text-current cursor-pointer"
          >
            Contact
          </div>
          <div
            ref={(el) => {
              navLinkRefs.current.links = el
            }}
            onClick={() => handleNavClick("/links")}
            className="font-mono text-[10px] tracking-[0.3em] uppercase transition-all text-zinc-500 hover:text-current dark:hover:text-current cursor-pointer"
          >
            Links
          </div>
          <div
            ref={(el) => {
              navLinkRefs.current.photos = el
            }}
            onClick={() => handleNavClick("/photos")}
            className="font-mono text-[10px] tracking-[0.3em] uppercase transition-all text-zinc-500 hover:text-current dark:hover:text-current cursor-pointer"
          >
            Photos
          </div>
        </nav>

        {/* Spacer to balance layout */}
        <div className="flex-1 flex justify-end">
          {/* Controls */}
          <div className="hidden lg:flex items-center space-x-6">
            {/* Language Switcher */}
            <LanguageSwitcher />

            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-full transition-all hover:bg-black hover:text-white dark:hover:bg-gray-800 dark:hover:text-white animate-accelerated"
            >
              {isDarkMode ? (
                <Sun className="w-5 h-5 text-current transition-transform duration-300 rotate-0" />
              ) : (
                <Moon className="w-5 h-5 text-current transition-transform duration-300 rotate-0" />
              )}
            </button>

            {/* Menu Button */}
            <button
              ref={menuButtonRef}
              onClick={toggleMenu}
              className="group flex flex-col gap-1.5 p-2 focus:outline-none"
            >
              <span className="w-10 h-[1px] bg-current"></span>
              <span className="w-8 h-[1px] bg-current self-end transition-all group-hover:w-10"></span>
            </button>
          </div>
        </div>

        {/* Mobile Controls */}
        <div className="lg:hidden flex items-center space-x-4">
          {/* Language Switcher */}
          <LanguageSwitcher />

          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            className="p-2 rounded-full transition-all hover:bg-black hover:text-white dark:hover:bg-gray-800 dark:hover:text-white"
          >
            {isDarkMode ? (
              <Sun className="w-5 h-5 text-current" />
            ) : (
              <Moon className="w-5 h-5 text-current" />
            )}
          </button>

          {/* Menu Button */}
          <button
            ref={menuButtonRef}
            onClick={toggleMenu}
            className="group flex flex-col gap-1.5 p-2 focus:outline-none"
          >
            <span className="w-10 h-[1px] bg-current"></span>
            <span className="w-8 h-[1px] bg-current self-end transition-all group-hover:w-10"></span>
          </button>
        </div>
      </header>

      {/* Navigation Menu */}
      <div
        ref={overlayRef}
        className={`fixed inset-0 z-[10001] nav-overlay pointer-events-none`}
        style={{ opacity: 0, backgroundColor: "var(--bg)" }}
      >
        <div className="flex flex-col h-full justify-center px-12 md:px-24">
          <button
            onClick={closeMenu}
            className="absolute top-10 right-10 md:right-16 text-zinc-500 hover:text-current flex items-center gap-2 font-mono text-[10px] tracking-[0.4em] uppercase transition-all"
          >
            {t("nav.close")} <X className="text-xl" />
          </button>

          <nav className="flex flex-col space-y-4">
            <div
              ref={addNavLinkRef}
              onClick={() => handleNavClick("/works", true)}
              className={`nav-link text-4xl md:text-6xl lg:text-7xl ${navLinkClassName} tracking-tighter hover:bg-pink-300 dark:hover:bg-rose-800/70 transition-all no-select cursor-pointer ${location.pathname === "/works" ? "text-current opacity-100 ring-1 ring-black" : "hover:text-current"}`}
              style={{
                color:
                  location.pathname === "/works"
                    ? "var(--text)"
                    : "var(--muted)",
              }}
            >
              {t("nav.works")}
            </div>
            <div
              ref={addNavLinkRef}
              onClick={() => handleNavClick("/about", true)}
              className={`nav-link text-4xl md:text-6xl lg:text-7xl ${navLinkClassName} tracking-tighter hover:bg-pink-300 dark:hover:bg-rose-800/70 transition-all no-select cursor-pointer ${location.pathname === "/about" ? "text-current opacity-100 ring-1 ring-black" : "hover:text-current"}`}
              style={{
                color:
                  location.pathname === "/about"
                    ? "var(--text)"
                    : "var(--muted)",
              }}
            >
              {t("nav.about")}
            </div>
            <div
              ref={addNavLinkRef}
              onClick={() => handleNavClick("/contact", true)}
              className={`nav-link text-4xl md:text-6xl lg:text-7xl ${navLinkClassName} tracking-tighter hover:bg-pink-300 dark:hover:bg-rose-800/70 transition-all no-select cursor-pointer ${location.pathname === "/contact" ? "text-current opacity-100 ring-1 ring-black" : "hover:text-current"}`}
              style={{
                color:
                  location.pathname === "/contact"
                    ? "var(--text)"
                    : "var(--muted)",
              }}
            >
              {t("nav.contact")}
            </div>
            <div
              ref={addNavLinkRef}
              onClick={() => handleNavClick("/links", true)}
              className={`nav-link text-4xl md:text-6xl lg:text-7xl ${navLinkClassName} tracking-tighter hover:bg-pink-300 dark:hover:bg-rose-800/70 transition-all no-select cursor-pointer ${location.pathname === "/links" ? "text-current opacity-100 ring-1 ring-black" : "hover:text-current"}`}
              style={{
                color:
                  location.pathname === "/links"
                    ? "var(--text)"
                    : "var(--muted)",
              }}
            >
              {t("nav.links")}
            </div>
            <div
              ref={addNavLinkRef}
              onClick={() => handleNavClick("/photos", true)}
              className={`nav-link text-4xl md:text-6xl lg:text-7xl ${navLinkClassName} tracking-tighter hover:bg-pink-300 dark:hover:bg-rose-800/70 transition-all no-select cursor-pointer ${location.pathname === "/photos" ? "text-current opacity-100 ring-1 ring-black" : "hover:text-current"}`}
              style={{
                color:
                  location.pathname === "/photos"
                    ? "var(--text)"
                    : "var(--muted)",
              }}
            >
              {t("nav.photos")}
            </div>
          </nav>

          <div className="mt-12 flex flex-col md:flex-row gap-6 md:gap-12">
            <span
              className="font-mono text-[9px] tracking-[0.3em] no-select"
              style={{ color: "var(--muted)" }}
            >
              {t("common.established")} 2026
            </span>
            <span
              className="font-mono text-[9px] tracking-[0.3em] no-select"
              style={{ color: "var(--muted)" }}
            >
              ©2026 SOM_WHY. {t("common.rightsReserved")}
            </span>
          </div>
        </div>
      </div>
    </>
  )
})

Header.displayName = "Header"

export default Header
