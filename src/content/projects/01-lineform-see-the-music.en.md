---
title: Lineform
title_zh: Lineform 音乐可视化
summary: "An immersive 3D music visualizer: pick a track in the sidebar and the canvas reacts to the audio in real time."
summary_zh: "沉浸式 3D 音乐可视化站点：在侧边栏选一首歌，画布随音频实时变化。"
role: Solo developer
period: "2025.09"
stack:
  - JavaScript
  - React
  - Three.js
  - React Three Fiber
  - react-three-drei
  - WaveSurfer.js
  - Zustand
  - Leva
repo: https://github.com/SOMWHY/Lineform-See-the-music
demo: https://lineform-see-the-music.netlify.app/
cover: null
---

<!-- 事实核查：summary 取自仓库 description（「3d音频可视化 /3D audio visualizer」）与 README；
     stack 取自仓库 topics 与 README；demo 取自仓库 homepage；period 取自 created_at（2025-09-12）。
     以上均为可核实字段，未添加推断性指标。 -->

Lineform renders music as three-dimensional geometry rather than the flat waveform readouts most players ship. The repository describes itself in one line: `3d音频可视化 / 3D audio visualizer`.

## Three regions

According to the project README, the site is divided into:

- **Canvas** — the 3D view, itself split into a *background* layer that ignores the audio and a *visualizer* layer that reacts to it in real time.
- **Sidebar** — collapsible; controls playback, shows technical detail such as sample rate, renders a 2D waveform, and carries external links.
- **Leva console** — exposes the 3D rendering parameters for live adjustment.

## Stack

JavaScript throughout. React draws the scene with Three.js via React Three Fiber and `react-three-drei`, WaveSurfer.js handles audio analysis, Zustand holds state, and Leva drives the parameter panel. The repository's topics corroborate this; it is published under the MIT license.

## Origin

The README is explicit that this began as a fan-side project whose visual language is strongly influenced by Porter Robinson's work, developed independently and **not** an official product of the artist or his team. Contributions — code, art direction, ideas — are openly invited.

## Links

- Source: <https://github.com/SOMWHY/Lineform-See-the-music>
- Live: <https://lineform-see-the-music.netlify.app/>
- An English README lives at `docs/en/README.en.md`

## Timeline

- **2025.09** — repository created on GitHub (2025-09-12).
