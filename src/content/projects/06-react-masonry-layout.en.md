---
title: react-masonry-layout
title_zh: react-masonry-layout
summary: "A flexible masonry layout component for React, with built-in image loading states and layouts that adapt to the container rather than the viewport."
summary_zh: "一个灵活的 React 瀑布流布局组件：内置图片加载与错误处理，布局随容器尺寸自适应。"
role: Solo developer
period: "2025.09"
stack:
  - TypeScript
  - React
repo: https://github.com/SOMWHY/react-masonry-layout
demo: null
cover: null
---

<!-- 事实核查：summary 与功能列表取自仓库 README；demo 留 null（仓库 homepage 为空）；
     period 取自 created_at（2025-09-27）。GitHub API 的 language 字段为 TypeScript。 -->

The repository holds the source of the `react-masonry-layout` npm library — a masonry component aimed at Pinterest-style galleries and card grids.

## Features

From the README:

- **Flexible layout** — positioning driven by the actual images rather than a fixed column count
- **Image optimised** — built-in loading and error handling
- **Fully customisable** — custom styles, classes and CSS variables
- **Responsive** — adapts to container size rather than breakpoint guesses
- **Accessible** — ARIA labels and keyboard navigation
- **TypeScript** — shipped fully typed
- **Zero dependencies**

Installation is `npm install react-masonry-layout`.

## Where it is used

This site's photo wall renders through the `Masonry` component exported by `@somwhy/react-masonry-layout`, currently with a 16 px gutter, and the image `sizes` attribute is written to match the component's breakpoints so each viewport downloads images at the width it actually displays them.

## Links

- Source: <https://github.com/SOMWHY/react-masonry-layout>
- npm: `react-masonry-layout`

## Timeline

- **2025.09** — repository created on GitHub (2025-09-27).
