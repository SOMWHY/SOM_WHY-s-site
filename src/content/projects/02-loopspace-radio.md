---
title: Loopspace Radio
title_zh: Loopspace 电台
summary: An always-on ambient radio for my own releases — a continuous stream with a schedule, built to stay in sync across tabs and survive a dropped connection.
summary_zh: 一个常驻的环境音乐电台，按节目单连续播放，跨标签页保持同步，断线后能自行恢复。
role: Frontend & interaction design
period: 2026.03 — 2026.08
stack:
  - React
  - Web Audio API
  - Zustand
  - Service Worker
  - Vite
repo: null
demo: https://somwhy.loopspace.club
---

<!-- TODO: 示例项目，指标为占位数据；demo 地址取自站点既有链接，请替换为真实内容 -->

A small radio that plays my own tracks back to back, with a schedule that changes through the day. It is meant to be left open in a tab and forgotten about.

## Background

Streaming platforms are good at discovery and bad at "just keep playing this specific thing." I wanted a page that behaves like a radio: you arrive, something is already playing, and it does not ask you anything.

## The problem

Three things made this harder than a plain `<audio>` tag:

1. **It must survive a dropped connection.** A radio that stops because Wi-Fi hiccuped is a radio you close.
2. **Two tabs must not play over each other.** Opening the page again should hand off, not double up.
3. **The schedule has to advance on its own** without me deploying anything.

## Approach

**Cross-tab coordination through storage.** The first tab claims playback by writing a heartbeat to `localStorage`; later tabs see a recent heartbeat and stay silent. If the owning tab closes, its heartbeat goes stale and another tab picks up. No server, no shared worker.

**Reconnection with a bounded retry.** On error, wait, try again, and back off — but cap the wait so a laptop waking from sleep recovers in a couple of seconds rather than a couple of minutes.

**Schedule as data, not code.** The day is described by a JSON file with time ranges, so changing the programming is a content edit rather than a deploy.

## Outcome

- Plays continuously across connection drops without user intervention
- Opening a second tab no longer produces overlapping audio
- Programming changes ship as a data change

The lesson: the hard part of a player is rarely decoding audio. It is all the state around it that nobody writes down.
