---
title: Where Should Player State Live?
title_zh: 播放器状态该放在哪一层
date: 2026-09-18
author: SOM_WHY
summary: A music player looks like local UI state until you notice the audio has to survive route changes. Notes on keeping playback, progress and the DOM node in the right places.
summary_zh: 音乐播放器看起来是局部 UI 状态，直到你发现音频必须跨路由存活。关于播放、进度与 DOM 节点各该放在哪一层的笔记。
---

The first version of my player kept everything in component state. It worked for about a day, which is how long it took me to navigate to another page and wonder why the music kept playing but the UI forgot about it.

The problem is that a player is two very different kinds of state wearing one coat.

## The two halves

**Playback state** — what is playing, is it paused, how loud, where in the track. This outlives any single component. The user can navigate, open the nav overlay, or switch language and the audio should not care.

**Progress state** — the current timestamp. This changes several times a second and only matters to whatever is drawing the progress bar.

Mixing them is how you end up re-rendering the entire route tree at 4 Hz.

## Where each one goes

I keep playback in a Zustand store, and progress in a ref that writes to the DOM directly.

```js
const howl = get().howl
if (!howl) return

// 每 200ms 直接写 DOM，不触发 React 重渲染
state._timeUpdateInterval = setInterval(() => {
  const seek = howl.seek()
  if (typeof seek === "number") set({ currentTime: seek })
}, 200)
```

That comment is the whole trick. Progress does not need to be React state at all until the user drags the slider, at which point it briefly becomes React state and then goes back to being a number on a timer.

## The cleanup that is easy to forget

The store outlives components, so anything it creates has to be torn down by hand. There are two failure modes I hit:

1. Swapping tracks without unloading the previous `Howl`, so two audio nodes fight over the same output.
2. Leaving a `setInterval` running after the component that asked for it is gone.

Both are invisible in development and both show up as "the player gets weird after a while."

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

## Duration is not available when you want it

`howl.duration()` returns `0` until metadata arrives. In Web Audio mode that meant waiting for the whole file. After switching to HTML5 audio it is available much earlier, but still not synchronously — so I read it in both `onload` and `onplay` and take whichever lands first.

```js
const syncDuration = () => {
  const duration = howl.duration()
  if (duration && duration > 0) targetSong.duration = duration
}
```

Defensive, slightly ugly, and the only version that has never shown `0:00` to a user.

## The part I would do differently

The store is the right home for playback, but I let it know about too much else: loading flags, error strings, the playlist. A cleaner split would be a small audio service that owns the `Howl` instance and a store that only reflects its state. Next time.
