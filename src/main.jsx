import { StrictMode } from "react"
import { createRoot } from "react-dom/client"
import { RouterProvider } from "react-router-dom"
// 字体：自托管 @fontsource 的 latin 子集，替代原先跨域到 Google Fonts 的 @import
import "@fontsource/space-grotesk/latin-300.css"
import "@fontsource/space-grotesk/latin-400.css"
import "@fontsource/space-grotesk/latin-700.css"
import "@fontsource/dancing-script/latin-700.css"
import "@fontsource-variable/azeret-mono/wght.css"
import "./index.css"
import "./styles/global.css"
import "./i18n"
import router from "./router"
import { AppProvider } from "./context/AppContext"

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <AppProvider>
      <RouterProvider router={router} />
    </AppProvider>
  </StrictMode>,
)
