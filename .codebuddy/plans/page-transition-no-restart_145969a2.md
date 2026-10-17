---
name: page-transition-no-restart
overview: 修复路由过渡动画中途重启导致的「闪一下」：把 PageTransition 的两个回调改为 ref 持有，使建动画的 effect 只在 isActive 变化时执行，从而保证时间线从淡入到淡出连续播放、遮罩全程不透明地盖住路由切换。
todos:
  - id: pt-callback-refs
    content: 用 ref 持有 progress/complete 回调并收窄 createAnimation 依赖，消除时间线中途重建
    status: completed
  - id: pt-verify
    content: 用 [subagent:code-explorer] 复核改动，执行 lint 与 build 核对体积未退化
    status: completed
    dependencies:
      - pt-callback-refs
---

## 用户需求

路由切换时的过渡动画（噪点 + 扫描线的老电视效果）在播放过程中会短暂露出底下的页面：观感顺序是「噪点 → 闪一下切换前的页面 → 噪点 → 新页面」。用户希望去掉中间这一下闪烁，因为对眼睛不好，其余观感与节奏保持不变。

## 产品概述

对现有路由过渡动画做定点修复，消除遮罩中途变透明导致的页面闪现。属于缺陷修复，不新增视觉效果、不改动画节奏。

## 核心功能

- 切换路由时，全屏噪点遮罩从淡入到淡出连续播放一次，中途不再变透明
- 路由切换发生在遮罩完全不透明的时段内，用户看不到旧页面与新页面交替的瞬间
- 保留原有的噪点、扫描线、0.9 秒整体节奏与老电视观感

## 边界

- 不改时间线时长与节奏（淡入 0.1s、扫描线 0.4s + stagger 0.05、0.7s 触发导航、0.8–0.9s 淡出）
- 不改 `Layout` 的状态机（nextPath / shouldNavigate / isAnimating）与 `preloadComponent` 预加载逻辑
- 不动 `NoiseOverlay`、`MouseTrail`
- 不引入任何新依赖
- 不得让既有性能成果退化：dist 12.07 MB、首屏 index chunk 34.41 KB


## 技术栈

沿用现有栈：Vite 7 + React 19 + react-router-dom 7 + GSAP 3。本轮不新增任何依赖，改动仅限 `src/components/animation/PageTransition.jsx` 一个文件。

## 现有实现链路（已实际读取）

1. `Header.jsx:116-123` `handleNavClick(path)` → 调用 Layout 传入的 `onNavigate`
2. `Layout.jsx:57-68` `handleNavigate`：预加载目标 chunk → `setNextPath(path)` → `setIsAnimating(true)` → `setShouldNavigate(false)`
3. `Layout.jsx:108-112` 渲染 `PageTransition`，传入 `isActive` / `onAnimationProgress` / `onAnimationComplete`
4. `PageTransition` 时间线在 0.7s 处回调 → `Layout.jsx:71-76` `setShouldNavigate(true)` + `navigate(nextPath)`
5. 时间线结束回调 → `Layout.jsx:79-83` `setIsAnimating(false)` 等收尾

时间线节奏（GSAP position 参数 `"+=0.1"` 相对时间线末尾）：
- 0 → 0.1s 遮罩淡入 opacity 0→1
- 0 → 0.6s 扫描线（0.4s + 4×0.05s stagger）
- 0.7s 触发导航（此时遮罩 opacity 仍为 1，全覆盖）
- 0.8 → 0.9s 遮罩淡出

## 根因分析

`handleAnimationProgress` 的 `useCallback` 依赖为 `[nextPath, shouldNavigate, navigate]`（`Layout.jsx:76`），而该函数自身在 0.7s 执行 `setShouldNavigate(true)`，导致**回调引用发生变化**。引用变化沿依赖链传导：

`onAnimationProgress` 变化 → `createAnimation`（依赖数组包含它）变化 → 主 `useEffect`（依赖数组包含 `createAnimation`）重新执行

重新执行的后果：
1. cleanup 先 `animationRef.current.kill()`，时间线在 0.7s 被杀，此时遮罩 opacity = 1 尚未开始淡出
2. effect 再次执行 `createAnimation()`，新时间线首段是 `fromTo(container, {opacity: 0}, {opacity: 1, duration: 0.1})`，GSAP 的 `immediateRender` 立即把遮罩设为 **opacity 0**

于是遮罩在 0.7s 附近瞬间透明露出页面，再用 0.1s 重新淡入遮住，形成用户看到的「噪点 → 闪一下 → 噪点」。第二轮时间线里 `shouldNavigate` 已为 true，故不会重复导航，最终由 `onComplete` 收尾。

## 实现方案

用 ref 持有两个回调，切断「父组件重渲染 → 回调引用变化 → 重建动画」这条传导链：

1. 新增 ref 并在每次渲染后同步（不在 render 阶段写 ref）：

```js
const progressRef = useRef(onAnimationProgress)
const completeRef = useRef(onAnimationComplete)

useEffect(() => {
  progressRef.current = onAnimationProgress
  completeRef.current = onAnimationComplete
})
```

2. `createAnimation` 内部改用 `progressRef.current?.()` 与 `completeRef.current?.()`，依赖数组收窄为 `[stopNoiseAnimation]`（该 hook 本身为 `useCallback(..., [])`，引用稳定）

3. 主 effect 依赖数组保持不变写法，但除 `isActive` 外均已成为稳定引用，因此 **effect 只在 isActive 由 false→true 时执行一次**，时间线连续播完，遮罩全程以 opacity 1 盖住路由切换

4. 在 ref 定义处与 `createAnimation` 上方补充注释：说明 `fromTo` 的 `immediateRender` 会把遮罩重置为 opacity 0，任何中途重建都会漏出页面，防止后续维护者再把回调加回依赖数组

## 实现要点

- 这是纯引用稳定性修复，不改任何数值参数，视觉节奏完全不变
- 修复后仍只有一条时间线，导航准确地落在遮罩不透明的时段内
- 爆炸半径仅限 `PageTransition.jsx`，不触碰 `Layout`、`Header`、路由表与懒加载配置

## 已知风险（仅报告，本轮不修）

`src/components/ui/LazyWrapper.jsx` 为 `<Suspense fallback={null}>`，懒加载未就绪时渲染空白。修复后导航在 0.7s 发生、遮罩 0.8–0.9s 淡出；正常情况 `handleNavigate` 已提前 `preloadComponent(path)`，本地与常规网络下 chunk 早已就绪。但在慢网络首次访问某路由时，淡出后可能短暂看到空白（不是旧页面）。这与本次「闪旧页面」是不同问题，若后续遇到再单独处理。

## 目录结构

```
src/
└── components/
    └── animation/
        └── PageTransition.jsx   # [MODIFY] 唯一改动文件。新增 progressRef / completeRef 持有回调；
                                 #          createAnimation 依赖数组收窄为 [stopNoiseAnimation]；
                                 #          内部改用 ref 调用回调；补充防回归注释
```

## 验证

- `npm run lint` 无报错
- `npm run build` 成功，dist 与 index chunk 体积相对 12.07 MB / 34.41 KB 无退化
- 静态复核：`createAnimation` 依赖数组不再包含 `onAnimationProgress` / `onAnimationComplete`；`timeline.add` 与 `onComplete` 仍分别调用到两个回调；主 effect 依赖除 `isActive` 外均为稳定引用
- 说明：这是浏览器运行时视觉效果，本环境无法做真实视觉验证，需用户在 dev server 上确认切换路由时遮罩连续不透明、中间不再露出页面


## Agent Extensions

### SubAgent

- **code-explorer**
  - Purpose：改动完成后做静态复核，确认 `src/components/animation/PageTransition.jsx` 中 `createAnimation` 的依赖数组已不再包含两个回调、`timeline.add` 与 `onComplete` 仍正确调用 progress / complete，且时间线参数（duration、stagger、position）未被误改；同时确认 `Layout.jsx` 未被误动
  - Expected outcome：输出带文件行号的核对报告，指出任何遗漏或误伤
