---
name: neko-non-intrusive-fix
overview: 修复 public/page_neko_optimized.js 中妨碍鼠标操作的 4 处问题（光标被隐藏、mousedown 被 preventDefault、全局 user-select 注入、每帧写 body 内联光标），并顺带修正拖拽判定的自比较 bug；猫的跟随、惊醒、拖拽、ZZZ、心情切换、边界抓挠等行为与遮挡现状全部保持不变。
todos:
  - id: neko-cursor-fix
    content: 重写 updateCursor 去掉 cursor none 并新增 setBodyCursor 写入去重
    status: completed
  - id: neko-mousedown-fix
    content: 删除 startDrag 的 preventDefault 并改用 body 级 userSelect 取代全局注入
    status: completed
  - id: neko-drag-judge
    content: 修正 endDrag 自比较判定使拖动不再被误判为点击
    status: completed
    dependencies:
      - neko-mousedown-fix
  - id: neko-verify
    content: 用 [subagent:code-explorer] 复核改动，并执行 node --check、lint 与 build
    status: completed
    dependencies:
      - neko-cursor-fix
      - neko-drag-judge
---

## 产品概述
`public/page_neko_optimized.js` 的跟随猫在妨碍鼠标操作。需要在保留猫全部原有行为的前提下，消除对正常操作的干扰。

## 核心问题（均已实际读取确认）
猫并未拦截点击：`petElement` 设了 `pointerEvents: "none"`，`zzzContainer` 也是 `pointer-events: none`。干扰来自以下四处：

1. **光标消失（主因）**：`updateCursor()` 在 `STATE.IDLE` 时写入 `document.body.style.cursor = "none"`。而 IDLE 的进入条件是「猫追上静止的光标」，即用户停下鼠标准备点击时，整个页面的光标消失。
2. **mousedown 被吞**：`startDrag()` 开头 `e.preventDefault()`。在睡着的猫 50px 内按下鼠标会阻止聚焦输入框、阻止开始选中文本。
3. **全局禁用选中**：`startDrag()` 向 head 注入 `* { user-select: none !important; }`，全局 `!important`，且 mouseup 丢失时会泄漏。
4. **每帧写 body 内联样式**：`updateCursor()` 被 rAF 循环与 150ms 帧循环反复调用，每帧写 `document.body.style.cursor`，既覆盖页面自身的 `cursor-pointer` / `cursor-text`，又每帧触发全文档样式重算。

## 附带 bug（顺带修）
`endDrag()` 中 `dx`/`dy` 用 `dragStartEvent.clientX - dragStartEvent.clientX` 自比较，恒为 0，导致任何拖拽松手都会走进「视为点击」分支去唤醒猫——「可以拖走睡着的猫」这个行为当前根本不生效。

## 边界（用户已确认）
- 只修上述真干扰项，**不动遮挡**：不加半透明淡出、不加光标固定偏移，猫仍会盖在光标上
- 保留惊醒、拖拽、ZZZ、心情切换、边界抓挠等**全部行为**
- 不改 `pointer-events`、不改 z-index（9999 / 9998）、不改任何行为参数、不增删全局监听


## 技术栈
无新增依赖。目标文件 `public/page_neko_optimized.js` 是纯原生 JS（791 行），由 `index.html:20` 以 `<script defer>` 引入。位于 `public/`，Vite 原样拷贝不参与构建，改动在 dev server 上即时生效。

## 修改清单（文件：`public/page_neko_optimized.js`）

### 1. 重写 `updateCursor()`（第 634-645 行）
- 删除 `cursor: "none"` 分支，永不隐藏光标
- 保留 `grab`（悬停睡着的猫）与 `grabbing`（拖拽中），这是拖拽的正确 affordance
- 其余情况写入空字符串 `""` 而非 `"auto"`——空串会移除内联样式，把光标交还给页面自身 CSS，不再覆盖 Tailwind 的 `cursor-pointer` / `cursor-text`
- 把第 640 行的内联命中判断抽成命名函数 `isPointerOverCat()`

### 2. 新增 `setBodyCursor(value)` 写入去重
模块级 `let appliedCursor`，值未变则直接 return。彻底消除每帧对 body 的样式写入（干扰 4 的性能面）。

### 3. 删除 `startDrag()` 中的 `e.preventDefault()`（第 522 行）
不再阻断聚焦与选区起始（干扰 2）。

### 4. 用 body 级 `userSelect` 取代全局 `!important` 样式注入
`startDrag` 里 `document.body.style.userSelect = "none"`，`endDrag` 里恢复为 `""`。`user-select` 可继承，效果等价于原意，且不会泄漏、不污染 head（干扰 3）。

### 5. 修正拖拽判定（第 581-590 行）
`endDrag(e)` 改为与 `dragStartX / dragStartY` 比较（`PHYSICS.DRAG_THRESHOLD = 5`），使「拖动不唤醒、点击才唤醒」如设计般生效。`endDrag` 本就注册为 `document.addEventListener("mouseup", endDrag)`，可直接拿到 mouseup 事件。

## 性能与风险控制
- 写入去重消除了每帧全文档样式重算，这是本轮最大的性能收益
- 删除 `preventDefault` 后不再有阻断输入聚焦的副作用
- `userSelect` 用 body 内联属性而非 `!important` 通配选择器，作用域更窄且必然随 `endDrag` 恢复
- 爆炸半径仅限该文件，不触碰 `src/`，不影响构建产物与既有性能成果

## 明确不做
- 不做半透明淡出、不做光标固定偏移
- 不改 `pointer-events`、不改 z-index、不改跟随速度 / 心情切换 / ZZZ / 抓挠等任何行为参数
- 不注册或移除任何全局监听（mousemove / mousedown / resize / scroll 保持原样）
- 不动 `src/utils/spriteConfig.js`（全仓无引用，疑似遗留死代码，仅报告）

## 验证
- `node --check public/page_neko_optimized.js` 语法通过
- `npm run lint` 确认 eslint（若覆盖 public/）不报错
- `npm run build` 确认构建不受影响
- 静态复核：全文不再出现 cursor 赋 `"none"`、startDrag 中无 `preventDefault`、无 `user-select` 样式注入、`updateCursor` 具备去重
- 说明：这是浏览器运行时行为，无法在本环境做真实鼠标验证，需用户在 dev server 上确认两点：① 鼠标静止后光标不再消失；② 点击睡着的猫仍会惊醒，拖动松手不会再被误判为点击

## 目录结构
```
public/
└── page_neko_optimized.js   # [MODIFY] 唯一改动文件。重写 updateCursor() 并新增 setBodyCursor() 去重；
                             #          删除 startDrag() 的 e.preventDefault()；改用 body 级 userSelect
                             #          取代全局 !important 注入；修正 endDrag() 的自比较判定
```


## Agent Extensions
### SubAgent
- **code-explorer**
  - Purpose：改动完成后做静态复核，确认 `public/page_neko_optimized.js` 中已无 `cursor = "none"`、startDrag 已无 `preventDefault`、已无 `user-select` 样式注入、`updateCursor` 具备去重；并确认猫的行为分支（STATE 机、ZZZ、抓挠、心情切换、拖拽）未被误删
  - Expected outcome：输出带行号的核对报告，指出任何遗漏或误伤
