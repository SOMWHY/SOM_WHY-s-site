---
title: SOM_WHY's Site
title_zh: 索姆歪的小站
summary: A bilingual personal site for photography, music and writing — rebuilt around an offline-first asset pipeline so it loads fast on a bad connection.
summary_zh: 一个承载摄影、音乐与写作的双语个人站点，围绕「离线优先」的资源管线重建，弱网下也能快速打开。
role: Solo developer & designer
period: "2026.02 — 2026.10"
stack:
  - Vite
  - React 19
  - Tailwind CSS 3
  - GSAP
  - Framer Motion
  - i18next
  - Howler
  - Zustand
repo: https://github.com/SOMWHY/SOM_WHY-s-site
demo: null
---

<!-- TODO: 上线前请核对周期、指标等事实；仓库地址取自站点既有链接 -->

A single place for the three things I make: photographs, music, and writing. It is bilingual (Chinese / English), dark and light, and has a cat that follows your cursor around.

## Background

I had a site that looked the way I wanted and performed terribly once it left my laptop. Photos, fonts, and audio were all pulled in at full fidelity with no caching strategy, and the deploy weighed 19 MB. Rebuilding it meant keeping the aesthetic exactly as it was and replacing everything underneath.

## The problem

Three constraints pulled against each other:

- The visual identity depends on large photography, so I could not simply shrink everything.
- The site is bilingual, which normally means shipping a full Chinese webfont — roughly 10 MB per weight.
- There are five full-length audio tracks, and a player that obviously hangs is worse than no player.

On top of that, anything that requires compiling native binaries is a non-starter on my Windows machine. An earlier attempt at a build-time image compressor failed during `npm install` because it tried to run `./configure`.

## Approach

**Fonts are generated, not downloaded.** A build script scans the source and locale files for the characters actually used, strips comments so they do not pollute the set, and cuts a WOFF2 subset per weight. About 55 KB each, self-hosted, no third-party request in the critical path.

**Images are generated at build time.** Photos live in `src/assets` and are turned into multi-width WebP variants by a Vite plugin. Each page declares the real slot width with `sizes`, matching the masonry breakpoints, so a phone downloads a phone-sized image.

**Audio streams.** Switched from Web Audio to HTML5 audio so playback starts as soon as enough is buffered, and re-encoded the tracks to 96 kbps.

**Chunks are split by module path.** React, the router, i18n, GSAP and Howler each get their own long-cached chunk. The player itself is lazily loaded, which also keeps its animation library out of the critical path.

## Outcome

- Deploy size: 19 MB → 11.8 MB
- Chinese font: ~10 MB → ~55 KB per weight (5 weights)
- Audio directory: 14.0 MB → 7.0 MB
- First sound on play: after full download → immediate

The part I am most pleased with is that none of it is visible. The site looks exactly as it did before; it just stopped making people wait.
