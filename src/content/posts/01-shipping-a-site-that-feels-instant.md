---
title: Shipping a Personal Site That Feels Instant
title_zh: 让个人站点「秒开」的那些坑
date: 2026-10-05
author: SOM_WHY
summary: My site was fast on localhost and unusable the moment it hit the internet. Four bottlenecks, four fixes, and a 19 MB deploy cut down to under 12 MB.
summary_zh: 本地飞快、上线即卡。四个瓶颈、四处改动，把 19 MB 的部署产物压到 12 MB 以内。
---

Everything was fine until I deployed it.

On `localhost` the photo wall popped in immediately and the music player started on the first click. On the real internet, the first paint sat there for seconds, and tapping play on a track produced nothing at all for a good half minute. Same code, same bundle. The only thing that changed was the network.

Here is what was actually wrong, and what fixed it.

## 1. The font chain was serial, and it went to another continent

My global stylesheet opened with a Google Fonts `@import`. That single line is worse than it looks:

```css
@import url("https://fonts.googleapis.com/css2?family=Space+Grotesk&family=Noto+Sans+SC&display=swap");
```

An `@import` inside a stylesheet cannot be discovered until that stylesheet has been downloaded *and parsed*. So the real request sequence is:

1. HTML
2. CSS
3. the `@import`ed CSS from Google
4. the font files themselves

Four round trips, strictly one after another, three of them to a third-party origin. The Chinese faces (`Noto Sans SC`) are the nasty part: Google splits them into dozens of `unicode-range` slices, and every slice is another request.

`localhost` never pays this cost. That is the entire explanation for "fast locally, slow online."

The fix was to self-host and subset. I now generate a WOFF2 containing only the characters my site actually uses — scanned from the source and the locale files, comments stripped out. A 10 MB font becomes roughly 55 KB per weight.

```js
const subset = await subsetFont(original, text, { targetFormat: "woff2" })
```

## 2. Twenty-one photos, all at full resolution

The photos page listed twenty-one images by hard-coded path. Every one of them was the original file: up to 407 KB each, about 3 MB for the page, with no `srcset` and no width hints. A phone in a two-column layout downloaded the same bytes as a 4K desktop in a five-column layout.

I moved the images under `src/assets` and let the build generate the variants:

```js
const photoSrcSets = import.meta.glob("../assets/photos/*.webp", {
  query: "?w=320;480;720;960&format=webp&quality=72&as=srcset",
  import: "default",
  eager: true,
})
```

Then I told the browser how wide each slot actually is, matching the masonry breakpoints:

```jsx
sizes="(max-width: 479px) 100vw, (max-width: 767px) 50vw, (max-width: 1023px) 33vw, (max-width: 1199px) 25vw, 20vw"
```

That second half matters more than the first. Generating five variants does nothing if the browser has no idea which one to pick.

While I was in there I found a genuinely silent bug:

```jsx
<ImageCard fetchpriority={index === 0 ? "high" : "low"} />
```

The prop is camelCase in React, not lowercase. The component destructured `fetchPriority` and ignored the rest, so every priority hint was being dropped. No error, no warning, just a slower page.

## 3. The music player downloaded the whole track before making a sound

This was the one that hurt most, because it looks like a hang rather than slowness.

Howler defaults to Web Audio. That means it fetches the file with XHR, waits for *all* of it, and then runs `decodeAudioData`. Only then can playback start. For a 4.8 MP3 MB on a bad connection, that is a long, silent wait.

```js
const howl = new Howl({
  src: [targetSong.audio],
  html5: true,        // stream through <audio> instead of decoding up front
  preload: "metadata", // only fetch metadata until the user actually hits play
})
```

With `html5: true` the browser uses HTTP range requests and starts playing as soon as it has buffered enough. I also re-encoded the tracks from 192 kbps down to 96 kbps, which halved the audio directory from 14 MB to about 7 MB.

## 4. One 511 KB chunk

The bundle was a single file with no `manualChunks`, no `assetsInlineLimit`, nothing. Worse, the layout imported a barrel file that re-exported everything, so the audio player and its animation library were in the critical path for every route.

Splitting by module path rather than by package name was the part I got wrong first:

```js
manualChunks(id) {
  if (!id.includes("node_modules")) return undefined
  if (/node_modules[\\/](react|react-dom|scheduler)[\\/]/.test(id)) return "react"
  // ...
}
```

Listing `["react", "react-dom"]` produced a genuinely empty chunk, because the entry point imports `react/jsx-runtime`, not `react`. The name list never matched.

## What it added up to

| | before | after |
|---|---|---|
| deploy size | 19 MB | 11.8 MB |
| Chinese font, per weight | ~10 MB | ~55 KB |
| audio directory | 14.0 MB | 7.0 MB |
| time to first sound | full download | immediate |

None of these were exotic. They were all things that are invisible on a local network and obvious on a real one. The lesson I keep relearning: `localhost` is not a test environment, it is a very convincing lie.
