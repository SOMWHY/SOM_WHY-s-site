---
title: Lineform 音乐可视化
summary: 沉浸式 3D 音乐可视化站点：在侧边栏选一首歌，画布随音频实时变化。
---

Lineform 将音乐表现为三维几何图形，而不是大多数播放器提供的扁平波形。仓库用一句话介绍自己：`3d音频可视化 / 3D audio visualizer`。

## 三个区域

根据项目 README，网站分为：

- **画布**：3D 视图，包含不受音频影响的背景层，以及实时响应音频的可视化层。
- **侧边栏**：可以折叠；控制播放、显示采样率等技术信息、绘制二维波形，并提供外部链接。
- **Leva 控制台**：可以实时调整 3D 渲染参数。

## 技术栈

项目使用 JavaScript。React 通过 Three.js 和 React Three Fiber 绘制场景，`react-three-drei` 提供辅助组件，WaveSurfer.js 负责音频分析，Zustand 保存状态，Leva 驱动参数面板。仓库 topics 也印证了这些信息；项目以 MIT 协议发布。

## 起源

README 明确说明，这是一个独立开发的粉丝项目，视觉语言深受 Porter Robinson 作品影响，并非艺术家或其团队的官方产品。项目欢迎代码、美术指导和创意方面的贡献。

## 链接

- 源码：<https://github.com/SOMWHY/Lineform-See-the-music>
- 在线体验：<https://lineform-see-the-music.netlify.app/>
- 英文 README 位于 `docs/en/README.en.md`

## 时间线

- **2025.09**：仓库于 2025-09-12 创建。
