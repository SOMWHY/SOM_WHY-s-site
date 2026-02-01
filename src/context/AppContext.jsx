import React, { createContext, useEffect } from "react"
import { useLocalStorage } from "../hooks"

// 创建Context
const AppContext = createContext()

// Provider组件
export const AppProvider = ({ children }) => {
  // 主题状态 - 默认深色模式
  const [isDarkMode, setIsDarkMode] = useLocalStorage("isDarkMode", true)

  // 切换主题
  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode)
  }

  // 监听主题变化，更新document的dark类
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add("dark")
    } else {
      document.documentElement.classList.remove("dark")
    }
  }, [isDarkMode])

  // Context值
  const contextValue = {
    isDarkMode,
    toggleTheme,
  }

  return (
    <AppContext.Provider value={contextValue}>{children}</AppContext.Provider>
  )
}

export default AppContext
