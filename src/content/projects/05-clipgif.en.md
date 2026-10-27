---
title: clipGIF
title_zh: clipGIF
summary: "Turn video segments into GIFs with a visual timeline. Self-hosted, FastAPI + yt-dlp + ffmpeg, pluggable for more platforms."
summary_zh: "把视频片段转成 GIF，带可视化时间轴。本地自部署，FastAPI + yt-dlp + ffmpeg，可扩展支持更多平台。"
role: Solo developer
period: "2026.10"
stack:
  - Python
  - FastAPI
  - yt-dlp
  - FFmpeg
repo: https://github.com/SOMWHY/clipGIF
demo: null
cover: null
---

<!-- 事实核查：summary 取自仓库 description 原文；功能与限制取自 README；
     demo 留 null（仓库 homepage 为空）；period 取自 created_at（2026-10-12）。 -->

A video clipper that runs on your own machine. The browser handles preview and editing; a local Python service does the downloading, trimming and GIF transcoding. Video never gets uploaded to a server.

## Current support

Per the README:

- **Platforms** — Bilibili via BV number, `bilibili.com` links and `b23.tv` short links. YouTube, Vimeo and X/Twitter are marked as welcome contributions
- **Operating systems** — Windows 10/11 fully supported; macOS and Linux get experimental placeholder scripts; no Docker support yet
- **GIF export** — cropping, custom dimensions, speed and quality controls. Filmstrip thumbnails on the timeline are not implemented yet
- **Interface** — adapts to narrow screens and honours `prefers-reduced-motion`

## Export options

- Width 320 / 480 / 640 px or a custom value between 64 and 1280; height derived proportionally when omitted. Mismatched aspect ratios letterbox rather than stretch
- Speed 0.5× / 1× / 1.5× / 2× — changes playback length only, not the selected range
- FPS 5 / 10 / 15 / 20, palette of 64 / 128 / 256 colours, dither via Bayer or Sierra 2-4A
- Defaults: no crop, width capped at 480 px (never upscaling), 12 FPS, 1×, 128 colours, Sierra 2-4A

Two hard limits are worth knowing before you try it: a selection cannot exceed 60 seconds, and an exported GIF cannot exceed 50 MB.

## Notes

Login-only videos are supported by supplying your own Netscape-format `cookies.txt`; the README is emphatic that cookies are credentials and should never be shared or committed. Source downloads, previews and GIFs land in `work/`, `previews/` and `outputs/` respectively and are not cleaned up automatically.

## Links

- Source: <https://github.com/SOMWHY/clipGIF>
- No public deployment — the project is designed to run locally

## Timeline

- **2026.10** — repository created on GitHub (2026-10-12).
