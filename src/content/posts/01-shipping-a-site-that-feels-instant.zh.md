---
title: 让个人站点「秒开」的那些坑
date: 2026-10-05
author: SOM_WHY
summary: 本地飞快、上线即卡。四个瓶颈、四处改动，把 19 MB 的部署产物压到 12 MB 以内。
---

一切正常，直到我把它部署出去。

在 `localhost` 上，照片墙马上出现，音乐播放器第一次点击就能播放。到了真实网络环境，首屏要等上几秒，点击播放后甚至要过半分钟才有反应。同一份代码、同一个 bundle，唯一改变的是网络。

下面是实际的问题，以及解决它们的方法。

## 1. 字体链路是串行的，而且要跨越一片大陆

全局样式表开头有一个 Google Fonts 的 `@import`。这一行比看起来更糟：

```css
@import url("https://fonts.googleapis.com/css2?family=Space+Grotesk&family=Noto+Sans+SC&display=swap");
```

样式表下载并解析前，浏览器无法发现其中的 `@import`。真实请求顺序是：HTML、CSS、Google 的 CSS，以及字体文件。四次请求严格串行，其中三次还要访问第三方域名。中文字体更麻烦：Google 会按 `unicode-range` 切成几十个片段，每个片段都要再请求一次。

`localhost` 从来不用付这笔成本，这就是「本地快、线上慢」的全部解释。

解决办法是自托管并做子集化。我现在只从源码和语言文件中扫描网站真正用到的字符，生成 WOFF2：

```js
const subset = await subsetFont(original, text, { targetFormat: "woff2" })
```

## 2. 二十一张照片全部是原尺寸

照片页硬编码列出了二十一张图片，每张都是原文件，既没有 `srcset` 也没有宽度提示。手机在两列布局里下载的字节数，和 4K 桌面五列布局完全一样。

我把图片移到 `src/assets`，让构建生成不同宽度的变体：

```js
const photoSrcSets = import.meta.glob("../assets/photos/*.webp", {
  query: "?w=320;480;720;960&format=webp&quality=72&as=srcset",
  import: "default",
  eager: true,
})
```

然后用 `sizes` 告诉浏览器每个槽位真正的宽度。生成多个变体只有在浏览器知道该选哪个时才有意义。

## 3. 音乐播放器必须下载完整曲目后才发声

Howler 默认使用 Web Audio，会通过 XHR 等待整个文件，再执行 `decodeAudioData`。在糟糕的网络下，这段等待看起来就像播放器挂了。

```js
const howl = new Howl({
  src: [targetSong.audio],
  html5: true,
  preload: "metadata",
})
```

`html5: true` 让浏览器通过 `<audio>` 流式播放，并使用 HTTP range 请求。重新编码后，音频目录也从 14 MB 降到了 7 MB。

## 4. 一个 511 KB 的 chunk

原来的 bundle 是单文件，也没有 `manualChunks`。更糟的是 layout 引入了一个重新导出所有内容的 barrel file，音频播放器和动画库因此都进入了每条路由的关键路径。

现在按模块路径拆分 React、路由、i18n、GSAP 和 Howler，播放器本身也延迟加载。

## 结果

| | 之前 | 之后 |
|---|---|---|
| 部署大小 | 19 MB | 11.8 MB |
| 中文字体，每个 weight | 约 10 MB | 约 55 KB |
| 音频目录 | 14.0 MB | 7.0 MB |
| 点击后的第一声 | 下载完成后 | 几乎立即 |

这些问题没有一个特别神秘。它们只是本地网络里看不见，而在线上非常明显。`localhost` 不是测试环境，只是一个很有说服力的假象。
