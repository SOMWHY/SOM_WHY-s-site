---
name: works-title-blog-anim-photos-locale-fix
overview: 三处修复：Works 页标题改为 PORTFOLIO / 作品集，且中文下小字保留 SELECTED PIECES 不翻译；修复 Blog 页卡片「下滑淡出」的入场动画；补齐 en/photos.json 缺失的 21 个图片名，消除英文模式下显示 key 字符串的既有缺陷。
todos:
  - id: works-title-locale
    content: 修改 en/zh works.json 的 title 为 PORTFOLIO/作品集，并把 zh section 改回 SELECTED PIECES
    status: completed
  - id: blog-entrance-fix
    content: 将 Blog.jsx 入场动画改为 gsap.fromTo 显式起止值并补上 cleanup 与 overwrite/clearProps
    status: completed
  - id: photos-en-keys
    content: 为 en/photos.json 补齐 21 个图片名键，与 zh 侧及 Photos.jsx 的 key 对齐
    status: completed
  - id: verify-lint-build
    content: 用 [subagent:code-explorer] 复核键集合一致性，并执行 lint 与 build 核对产物未退化
    status: completed
    dependencies:
      - works-title-locale
      - blog-entrance-fix
      - photos-en-keys
---

## 用户需求

1. **Works 页标题改为 Portfolio**：当前英文标题是 `FRONTEND WORKS`、中文是「前端作品集」，不够地道，应改为 `PORTFOLIO` /「作品集」。并且**中文模式下上方小字必须保留 `SELECTED PIECES` 不翻译**（当前 zh 侧被译成了「精选作品」），与其他页面做法保持一致。
2. **Blog 页入场动画异常**：一进入页面，文章卡片就慢慢向下位移且不透明度逐渐降低，但卡片仍可点击跳转，怀疑是动画问题，需修复。
3. **修复既有缺陷**：`src/locales/en/photos.json` 只有 4 个键，而 zh 版有 21 个图片名键，英文模式下照片卡 hover 标题直接显示 `fl_chan` 这类 key 字符串。用户表示必要时可自行补译。

## 产品概述
对刚完成改版的个人站点做三处定点修正：作品集页标题文案与双语约定、博客页卡片入场动画、照片页英文文案缺失。均为缺陷修复，不新增页面与功能。

## 核心功能
- Works 页小字恒定显示 `SELECTED PIECES`，英文大标题 `PORTFOLIO`、中文大标题「作品集」
- Blog 卡片入场为「从下往上淡入」，动画结束后卡片停在正常位置与不透明度，且卸载/重挂载后无残留
- Photos 页英文模式下 21 张照片显示真实英文标题，不再显示 key 字符串

## 边界
- 不改动 Home / About / Photos 的视觉与布局，不改动路由与内容管线
- 不重命名 zh 侧拼写有误的键 `beneth_the_flowers`（会牵连 `Photos.jsx` 数据源），仅告知用户
- 不得让上轮性能成果退化：dist 12.07 MB、首屏 index chunk 33.57 KB / gzip 12.66 KB


## 技术栈
沿用现有栈：Vite 7 + React 19 + Tailwind 3 + GSAP（ScrollTrigger）+ i18next/react-i18next。本次不新增任何依赖。

## 实现方案

### 一、Works 标题与双语约定（纯文案改动）
- `src/locales/en/works.json`：`title` 由 `FRONTEND WORKS` 改为 `PORTFOLIO`
- `src/locales/zh/works.json`：`section` 由「精选作品」改回 `SELECTED PIECES`，`title` 由「前端作品集」改为「作品集」
- 依据已核实的既有约定：小字 section 在 zh 侧同样保留英文（`zh/about.json` section = `The Profile`、`zh/photos.json` section = `Frames`、`zh/links.json` subtitle = `Digital Frequency Access`），只有大标题翻译
- `src/pages/Works.jsx:17-27` 用 `containsChinese()` 判断字体类，改动后 section 在两种语言下均为英文 → 走 `font-mono`；zh 大标题含中文 → 走 `font-mono-zh`。**无需改代码**

### 二、Blog 入场动画修复（核心）

**根因**：`src/pages/Blog.jsx:20-39` 用了 `gsap.from()` 且 effect **没有 return cleanup**。
- `gsap.from()` 把「元素当前值」当作**终点**，`immediateRender` 默认为 true，创建瞬间就把元素置成起点（opacity 0 / y 50）
- 项目 `src/main.jsx:17-21` 启用了 `<StrictMode>`，开发环境 effect 会双调用；由于无 cleanup，第一条补间不会被 kill，第二条 `from` 便把「动画进行到一半的中间态」记录成终点 → 卡片最终停在偏移且半透明的位置
- 这正好解释用户观察到的现象：卡片缓缓下滑、逐渐变淡、但仍可点击（opacity 不影响命中测试）

**修法（确定性优先，不依赖「当前值」）**：
```jsx
useEffect(() => {
  const container = containerRef.current
  if (!container) return
  const items = gsap.utils.toArray(container.querySelectorAll(".link-card"))
  if (!items.length) return

  // fromTo 显式写出起止值，不再把「当前值」当终点，避免补间叠加导致终点漂移
  const tweens = items.map((item, index) =>
    gsap.fromTo(
      item,
      { opacity: 0, y: 50 },
      {
        opacity: 1,
        y: 0,
        duration: 0.8,
        delay: index * 0.1,
        ease: "power2.out",
        overwrite: "auto",   // 同一元素上冲突补间自动让位
        clearProps: "opacity,transform", // 动画结束清掉内联样式，不留残值
      },
    ),
  )

  return () => {
    tweens.forEach((tween) => tween.kill())
    gsap.set(items, { clearProps: "opacity,transform" })
  }
}, [])
```
- **刻意不引入 ScrollTrigger**：若测量时机不对卡片会停在不可见状态，比现 bug 更糟；当前仅 2 篇文章，直接 stagger 入场即可
- 同一文件悬停描边环 effect（42-100 行）已有完整 cleanup，保持不变
- `Works.jsx:45-67` 与 `Photos.jsx:58` 存在同款 `gsap.from` + 缺 cleanup 隐患，但前者带 ScrollTrigger 且用户未反馈异常；本轮按「最小爆炸半径」原则**不强改**，仅在报告中提示

### 三、en/photos.json 补齐 21 个键
按 zh 侧 21 个键逐一补英文译名（助手给出，请用户复核）：
`fl_chan`→Fruit Girl、`am_i_cute`→Am I Cute?、`lying_on_the_grass`→Bed of Grass、`shining_leaves`→Glowing Leaves、`cat_or_orange`→Cat or Orange?、`golden_sunrise`→Golden Sunrise、`beneth_the_flowers`→Beneath the Flowers、`bocchi_the_porter`→Bocchi the Porter、`flourish`→Flourish、`nostalgia`→Nostalgia、`sky_in_the_mirror`→Sky in the Mirror、`little_cat_and_big_chair`→Little Cat, Big Chair、`soft_cloud`→Marshmallow Cloud、`walking_alone`→Walking Alone、`carpeted_with_flowers`→Carpet of Flowers、`a_blaze_of_colour`→A Blaze of Colour、`stare_into_the_distance`→Staring into the Distance、`playground_in_campus`→Campus Playground、`splay_out`→Splaying Out、`a_mass_of_blooms`→A Mass of Blooms、`its_spring_here`→It's Spring Here
- 保留原有 4 个键（`section` / `title` / `ref` / `noName`）不变
- 缺陷链路：`src/pages/Photos.jsx:259` 把 `t(image.key)` 直接渲染成可见 hover 标题；i18next 缺键时返回 key 本身（truthy），故 `:246` 的 `|| t("noName")` 兜底不会生效
- 本轮新增内容为纯 ASCII，不增加汉字字符集，**理论上无需重跑** `npm run fonts:build`；执行时跑一次确认字符集未变化即可

## 实现要点
- 严格按既有项目风格：等宽字体、大写字距、描边环微动效动效不变
- 所有 locale 改动必须保证 en/zh 同 namespace 键集合一一对应
- 禁止 `Remove-Item`（曾多次被安全删除守卫拦截），用编辑工具改文件

## 验证
- `npm run lint` 无报错
- `npm run build` 成功，dist 与首屏 index chunk 体积相对 12.07 MB / 33.57 KB 无退化
- 用 [subagent:code-explorer] 复核：`works.json` / `photos.json` 中英键集合一致、`Blog.jsx` 入场 effect 已具备 cleanup 且使用 `fromTo`


## Agent Extensions
### SubAgent
- **code-explorer**
  - Purpose：改动完成后做跨文件复核 —— 确认 `en/works.json` 与 `zh/works.json` 键集合一致且 section/title 取值正确；确认 `en/photos.json` 21 个图片名键与 `zh/photos.json` 及 `Photos.jsx` imagesArray 的 key 完全对齐；确认 `Blog.jsx` 入场 effect 已改为 `fromTo` 并带 cleanup，且未引入 ScrollTrigger
  - Expected outcome：输出带文件行号的核对报告；若有遗漏或键名不一致给出具体位置清单
