---
title: react-masonry-layout
summary: 一个灵活的 React 瀑布流布局组件：内置图片加载与错误处理，布局随容器尺寸自适应。
---

这个仓库包含 `react-masonry-layout` npm 库的源码。它是一个面向 Pinterest 风格画廊和卡片网格的瀑布流组件。

## 特性

根据 README：

- **灵活布局**：根据实际图片而不是固定列数进行定位
- **图片优化**：内置加载和错误处理
- **高度可定制**：支持自定义样式、类名和 CSS 变量
- **响应式**：根据容器尺寸而不是猜测断点进行适配
- **无障碍**：提供 ARIA 标签和键盘导航
- **TypeScript**：完整提供类型
- **零依赖**

安装命令是 `npm install react-masonry-layout`。

## 使用位置

本站照片墙通过 `@somwhy/react-masonry-layout` 导出的 `Masonry` 组件渲染，间距为 16 px。图片的 `sizes` 属性与组件断点保持一致，因此每个视口都会下载与实际显示宽度匹配的图片。

## 链接

- 源码：<https://github.com/SOMWHY/react-masonry-layout>
- npm：`react-masonry-layout`

## 时间线

- **2025.09**：仓库于 2025-09-27 创建。
