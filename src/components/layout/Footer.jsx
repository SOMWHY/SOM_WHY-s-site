import React, { memo } from "react"
import { Github, Music, Monitor, Coffee } from "lucide-react"
import { useApp } from "../../hooks/useApp"

const Footer = memo(function Footer() {
  const { isDarkMode } = useApp()
  return (
    <footer
      className="fixed bottom-0 left-0 right-0 z-[20] px-6 py-6 md:px-12 flex items-center justify-between backdrop-blur-md border-t border-white/10 transition-all duration-300"
      style={{
        viewTransitionName: "global-footer",
        backgroundColor: isDarkMode
          ? "rgba(9, 9, 11, 0.8)"
          : "rgba(250, 250, 250, 0.8)",
        boxShadow: isDarkMode
          ? "0 -2px 20px rgba(0, 0, 0, 0.3)"
          : "0 -2px 20px rgba(0, 0, 0, 0.05)",
        borderColor: isDarkMode
          ? "rgba(255, 255, 255, 0.1)"
          : "rgba(0, 0, 0, 0.1)",
      }}
    >
      <div className="flex items-center gap-8">
        <a
          href="https://github.com"
          target="_blank"
          rel="noopener noreferrer"
          className="text-zinc-400 hover:text-current transition-all"
        >
          <Github className="w-5 h-5" />
        </a>
        <a
          href="https://music.163.com/#/artist?id=35889036"
          target="_blank"
          rel="noopener noreferrer"
          className="text-zinc-400 hover:text-current transition-all"
        >
          <Music className="w-5 h-5" />
        </a>
        <a href="https://space.bilibili.com/394014714?spm_id_from=333.1007.0.0" target="_blank"  className="text-zinc-400 hover:text-current transition-all">
          <Monitor className="w-5 h-5" />
        </a>
        <a href="https://somwhy.loopspace.club" target="_blank"  className="text-zinc-400 hover:text-current transition-all">
          <Coffee className="w-5 h-5" />
        </a>
      </div>
    </footer>
  )
})

Footer.displayName = "Footer"

export default Footer
