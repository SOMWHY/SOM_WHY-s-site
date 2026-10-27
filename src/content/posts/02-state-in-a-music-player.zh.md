---
title: 播放器状态该放在哪一层
date: 2026-09-18
author: SOM_WHY
summary: 音乐播放器看起来是局部 UI 状态，直到你发现音频必须跨路由存活。关于播放、进度与 DOM 节点各该放在哪一层的笔记。
---

播放器的第一个版本把所有东西都放在组件状态里。它只正常工作了一天，也就是我切换到另一个页面、发现音乐还在播放但界面已经忘记它的时候。

问题在于，播放器是两种截然不同的状态穿着同一件外套。

## 两个部分

**播放状态**：正在播放什么、是否暂停、音量多大、曲目播放到哪里。这些状态的生命周期比任何单个组件都长。用户可以导航、打开菜单或切换语言，音频都不应该受影响。

**进度状态**：当前时间戳。它每秒变化好几次，只对绘制进度条的部分有意义。

把它们混在一起，就会导致整棵路由组件树每秒重渲染四次。

## 各自应该放在哪里

我把播放状态放在 Zustand store 中，把进度放在 ref 里，直接写入 DOM。

```js
const howl = get().howl
if (!howl) return

state._timeUpdateInterval = setInterval(() => {
  const seek = howl.seek()
  if (typeof seek === "number") set({ currentTime: seek })
}, 200)
```

关键就在这里。除非用户拖动滑块，进度根本不需要成为 React state；拖动时它短暂成为 state，之后又回到定时更新的数字。

## 容易忘记的清理工作

Store 的生命周期长于组件，因此它创建的资源都必须手动清理。我遇到过两个问题：

1. 换曲目时没有卸载旧的 `Howl`，两个音频节点争用同一输出。
2. 发起更新的组件已经离开，`setInterval` 却仍在运行。

这两种情况在开发时都不明显，却会表现为「播放器用久了就变奇怪」。

```js
const cleanupHowl = () => {
  const { howl, _timeUpdateInterval } = get()
  if (_timeUpdateInterval) {
    clearInterval(_timeUpdateInterval)
    set({ _timeUpdateInterval: null })
  }
  if (howl) {
    howl.unload()
    set({ howl: null })
  }
}
```

## 时长不会在需要时立刻可用

元数据加载前，`howl.duration()` 会返回 `0`。切换到 HTML5 音频后它能更早出现，但仍不是同步值，所以我在 `onload` 和 `onplay` 中都读取时长，取最先到达的有效值。

```js
const syncDuration = () => {
  const duration = howl.duration()
  if (duration && duration > 0) targetSong.duration = duration
}
```

有些防御性代码不太优雅，但这是唯一一种不会把 `0:00` 显示给用户的写法。

## 如果重做一次

播放状态确实应该留在 store 中，但我让 store 知道了太多事情：加载标记、错误文本和播放列表。更清晰的拆分方式，是由一个小型音频服务持有 `Howl` 实例，而 store 只反映它的状态。下次再做。
