// =====================================
// Sprite Sheet Configuration for Neko Cat
// =====================================
// Sprite sheet: nekos.webp
// Each frame: 42x42px
// Total frames: 34 (1 row x 34 columns)

const SPRITE_CONFIG = {
  frameWidth: 42,
  frameHeight: 42,
  columns: 34,
  rows: 1,
  spritePath: "/nekos.webp",
}

// Frame positions in sprite sheet (0-indexed)
// All frames in a single row, left to right
const framePositions = {
  CUR_DOWN_FRAME01: { row: 0, col: 0 },
  CUR_DOWN_FRAME02: { row: 0, col: 1 },
  CUR_DOWN_LEFT_FRAME01: { row: 0, col: 2 },
  CUR_DOWN_LEFT_FRAME02: { row: 0, col: 3 },
  CUR_DOWN_RIGHT_FRAME01: { row: 0, col: 4 },
  CUR_DOWN_RIGHT_FRAME02: { row: 0, col: 5 },
  CUR_IDLE_FRAME01: { row: 0, col: 6 },
  CUR_IDLE_FRAME02: { row: 0, col: 7 },
  CUR_IDLING_FRAME01: { row: 0, col: 8 },
  CUR_IDLING_FRAME02: { row: 0, col: 9 },
  CUR_LEFT_FRAME01: { row: 0, col: 10 },
  CUR_LEFT_FRAME02: { row: 0, col: 11 },
  CUR_RIGHT_FRAME01: { row: 0, col: 12 },
  CUR_RIGHT_FRAME02: { row: 0, col: 13 },
  CUR_SCRATCH_DOWN_FRAME01: { row: 0, col: 14 },
  CUR_SCRATCH_DOWN_FRAME02: { row: 0, col: 15 },
  CUR_SCRATCH_LEFT_FRAME01: { row: 0, col: 16 },
  CUR_SCRATCH_LEFT_FRAME02: { row: 0, col: 17 },
  CUR_SCRATCH_RIGHT_FRAME01: { row: 0, col: 18 },
  CUR_SCRATCH_RIGHT_FRAME02: { row: 0, col: 19 },
  CUR_SCRATCH_UP_FRAME01: { row: 0, col: 20 },
  CUR_SCRATCH_UP_FRAME02: { row: 0, col: 21 },
  CUR_SLEEP_FRAME01: { row: 0, col: 22 },
  CUR_SLEEP_FRAME02: { row: 0, col: 23 },
  CUR_SLEEPSTART_FRAME01: { row: 0, col: 24 },
  CUR_SLEEPSTART_FRAME02: { row: 0, col: 25 },
  CUR_SURPRISE_FRAME01: { row: 0, col: 26 },
  CUR_SURPRISE_FRAME02: { row: 0, col: 27 },
  CUR_UP_FRAME01: { row: 0, col: 28 },
  CUR_UP_FRAME02: { row: 0, col: 29 },
  CUR_UP_LEFT_FRAME01: { row: 0, col: 30 },
  CUR_UP_LEFT_FRAME02: { row: 0, col: 31 },
  CUR_UP_RIGHT_FRAME01: { row: 0, col: 32 },
  CUR_UP_RIGHT_FRAME02: { row: 0, col: 33 },
}

// Animation frame arrays using sprite positions
const animationFrames = {
  down: ["CUR_DOWN_FRAME01", "CUR_DOWN_FRAME02"],
  downLeft: ["CUR_DOWN_LEFT_FRAME01", "CUR_DOWN_LEFT_FRAME02"],
  downRight: ["CUR_DOWN_RIGHT_FRAME01", "CUR_DOWN_RIGHT_FRAME02"],
  left: ["CUR_LEFT_FRAME01", "CUR_LEFT_FRAME02"],
  right: ["CUR_RIGHT_FRAME01", "CUR_RIGHT_FRAME02"],
  up: ["CUR_UP_FRAME01", "CUR_UP_FRAME02"],
  upLeft: ["CUR_UP_LEFT_FRAME01", "CUR_UP_RIGHT_FRAME01"],
  upRight: ["CUR_UP_RIGHT_FRAME01", "CUR_UP_RIGHT_FRAME02"],
  surprised: ["CUR_SURPRISE_FRAME01", "CUR_SURPRISE_FRAME02"],
  idle: ["CUR_IDLE_FRAME01", "CUR_IDLE_FRAME02"],
  idling: ["CUR_IDLING_FRAME01", "CUR_IDLING_FRAME02"],
  sleepStart: ["CUR_SLEEPSTART_FRAME01", "CUR_SLEEPSTART_FRAME02"],
  sleeping: ["CUR_SLEEP_FRAME01", "CUR_SLEEP_FRAME02"],
  scratchDown: ["CUR_SCRATCH_DOWN_FRAME01", "CUR_SCRATCH_DOWN_FRAME02"],
  scratchLeft: ["CUR_SCRATCH_LEFT_FRAME01", "CUR_SCRATCH_LEFT_FRAME02"],
  scratchRight: ["CUR_SCRATCH_RIGHT_FRAME01", "CUR_SCRATCH_RIGHT_FRAME02"],
  scratchUp: ["CUR_SCRATCH_UP_FRAME01", "CUR_SCRATCH_UP_FRAME02"],
}

// Get background position for a frame
function getBackgroundPosition(frameName) {
  const pos = framePositions[frameName]
  if (!pos) {
    console.error(`Frame not found: ${frameName}`)
    return "0px 0px"
  }

  const x = pos.col * SPRITE_CONFIG.frameWidth
  const y = pos.row * SPRITE_CONFIG.frameHeight

  return `${-x}px ${-y}px`
}

export { SPRITE_CONFIG, framePositions, animationFrames, getBackgroundPosition }
