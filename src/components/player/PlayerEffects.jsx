import React, { memo } from "react"
import LightOrbs from "../animation/LightOrbs"
import usePlayerStore from "../../store/playerStore"

/**
 * 光球特效的门闩组件。
 *
 * 原先 Layout 需要订阅 usePlayerStore 才能决定要不要渲染 LightOrbs，
 * 而 playerStore 顶层 import 了 howler，于是 Howler 被打进了首屏包。
 * 把这个判断下沉到懒加载组件后，Layout 不再依赖 playerStore，Howler 随之移出关键路径。
 * 组件在 Layout 中的位置保持不变，因此渲染结果与原来一致。
 */
const PlayerEffects = memo(function PlayerEffects() {
  const isPlaying = usePlayerStore((state) => state.isPlaying)
  const currentSong = usePlayerStore((state) => state.currentSong)

  if (!isPlaying || currentSong === null) return null

  return <LightOrbs />
})

PlayerEffects.displayName = "PlayerEffects"

export default PlayerEffects
