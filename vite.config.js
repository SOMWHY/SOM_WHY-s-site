import { defineConfig } from "vite"
import react from "@vitejs/plugin-react"
import { imagetools } from "vite-imagetools"

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), imagetools()],
  build: {
    // 小图标等极小资源内联，减少请求数；大于该值的一律走带哈希的外链
    assetsInlineLimit: 2048,
    chunkSizeWarningLimit: 600,
    rollupOptions: {
      output: {
        // 把稳定不常变的第三方依赖单独成 chunk：
        // 业务代码更新时这部分可以命中长缓存，不会跟着一起失效。
        // 这里按模块路径分组而不是按包名——比如入口实际引用的是 react/jsx-runtime
        // 而非 react，用包名列举会命中不到，导致分组失效。
        manualChunks(id) {
          if (!id.includes("node_modules")) return undefined

          if (id.includes("framer-motion")) return "motion"
          if (id.includes("howler")) return "audio"
          if (id.includes("i18next") || id.includes("react-i18next")) return "i18n"
          if (id.includes("react-router")) return "router"
          if (id.includes("gsap")) return "gsap"
          if (/node_modules[\\/](react|react-dom|scheduler)[\\/]/.test(id)) {
            return "react"
          }
          return undefined
        },
      },
    },
  },
})
