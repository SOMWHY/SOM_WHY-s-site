import React, { memo } from "react"
import Portal from "../ui/Portal"
import Player from "./Player"

const PlayerPortal = memo(function PlayerPortal() {
  return (
    <Portal>
      <Player />
    </Portal>
  )
})

PlayerPortal.displayName = "PlayerPortal"

export default PlayerPortal
