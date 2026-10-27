---
title: pi-dsh-pet
title_zh: pi-dsh-pet 桌宠
summary: "A desktop pet for the pi coding agent: one command installs it, and a transparent animated fish floats on screen reacting to what the agent is doing — thinking, writing code, or idle."
summary_zh: "给 pi 编程助手的桌面宠物：一行命令装好，一只透明的动画大肥鱼浮在屏幕上，随 agent 状态（思考 / 写代码 / 空闲）切换动作。"
role: Fork maintainer & pi integration
period: "2026.08"
stack:
  - JavaScript
  - Electron
  - Node.js
  - WebSocket
repo: https://github.com/SOMWHY/pi-dsh-pet
demo: null
cover: null
---

<!-- 事实核查：summary 取自仓库 description 与 README；行为、命令、尺寸取自 README；
     fork 归属取自 GitHub API 的 parent 字段（PC2005-cloud/dsh-pet），未标记为原创；
     demo 留 null（仓库 homepage 为空）；period 取自 created_at（2026-08-22）。 -->

A big fat fish that lives inside the **pi** terminal coding assistant. It breathes while idle, breaks into random actions including dozing off, occasionally turns around, roams the screen, reacts to clicks, and can be dragged.

## Origin

This is a fork of [`dsh-pet`](https://github.com/PC2005-cloud/dsh-pet) (also published on npm), reworked specifically for the pi platform. The README is explicit about the split: existing `dsh-pet` users should stay on the upstream npm package. What this fork adds is the pi integration — the pet responds to the pi agent's work state and is rendered through a full-screen Electron transparent overlay, driven by a pi extension that speaks HTTP and WebSocket.

## Reacting to the agent

| pi agent state | Pet animation |
|---|---|
| Starts thinking | Deep-thinking muttering |
| Calls a tool (`bash` / `edit` / `write`) | Writing code |
| Idle | Returns to the random animation chain |

Clicking the pet while it is thinking or writing plays a tsundere "annoyed" reaction first, then returns to whatever the current state animation is.

## Usage

```sh
npm install -g pi-dsh-pet
```

Inside pi:

- `/pet` — normal (400 px)
- `/pet small` — small (260 px)
- `/pet large` — large (540 px)
- `/pet-stop` — close every pet window

The first run downloads Electron (~100 MB); launches after that are quick. The pet appears in the bottom-right corner.

## Sizing

Widths live in a `SIZE_MAP` object in `pi/assets/pet.js`, with height derived as width × 9/16. Adding a tier there also makes a matching `/pet <tier>` command available without any other change.

## Assets and licensing

The repository ships 91 animations as 640×360 transparent WebM, with preview GIFs alongside. The license is split: **code is MIT**, while the assets — animations, prompts and source videos — are allowed for open-source use but **prohibit commercial use**.

## Links

- Source: <https://github.com/SOMWHY/pi-dsh-pet>
- Upstream: <https://github.com/PC2005-cloud/dsh-pet>
- No public demo — it runs as a desktop overlay

## Timeline

- **2026.08** — repository created on GitHub (2026-08-22).
