// =====================================
// Optimized Neko Cat with Sprite Sheet
// Performance: 1 HTTP request instead of 32
// =====================================

// =====================================
// Configuration Constants
// =====================================
const ENABLE_ZZZ_ANIMATION = true

// Timing Constants
const TIMING = {
  RUN_FRAME_INTERVAL: 150,
  IDLE_TO_IDLING_DELAY: 1200,
  MOUSE_IDLE_DELAY: 500,
}

// Physics Constants
const PHYSICS = {
  DRAG_THRESHOLD: 5,
  JUMP_INITIAL_HEIGHT: -30,
  JUMP_GRAVITY: 2,
  SHAKE_INTENSITY: 10,
}

// Sleep Constants
const SLEEP = {
  CLICK_DISTANCE: 50,
  MATURE_TIME: 15000,
}

// ZZZ Animation Constants
const ZZZ = {
  FONT_SIZE_MIN: 12,
  FONT_SIZE_MAX: 20,
  OFFSET_X_RANGE: 20,
  OFFSET_Y_RANGE: 30,
  TRANSLATE_X: 10,
  TRANSLATE_Y: -50,
  ANIMATION_DURATION: 1000,
  ANIMATION_VARIANCE: 500,
  REMOVE_DELAY: 1000,
}

// Pet Constants
const MOOD_CHANGE_MIN = 60000
const MOOD_CHANGE_MAX = 120000
const CATCH_DISTANCE = 5
const PET_WIDTH = 42
const PET_HEIGHT = 42
const PET_SPEED = 0.8

// Direction Constants
const DIRECTION = {
  DOWN: 0,
  DOWN_LEFT: 1,
  LEFT: 2,
  UP_LEFT: 3,
  UP: 4,
  UP_RIGHT: 5,
  RIGHT: 6,
  DOWN_RIGHT: 7,
}

// State Constants
const STATE = {
  MOVING: 0,
  IDLE: 1,
  IDLING: 2,
  SLEEPING: 3,
}

// Mood Constants
const MOOD = {
  HAPPY: 0,
  CALM: 1,
}

// =====================================
// Sprite Sheet Configuration
// =====================================
const SPRITE_CONFIG = {
  frameWidth: 42,
  frameHeight: 42,
  columns: 34,
  rows: 1,
  spritePath: "/nekos.webp",
}

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

const animationFrames = {
  down: ["CUR_DOWN_FRAME01", "CUR_DOWN_FRAME02"],
  downLeft: ["CUR_DOWN_LEFT_FRAME01", "CUR_DOWN_LEFT_FRAME02"],
  downRight: ["CUR_DOWN_RIGHT_FRAME01", "CUR_DOWN_RIGHT_FRAME02"],
  left: ["CUR_LEFT_FRAME01", "CUR_LEFT_FRAME02"],
  right: ["CUR_RIGHT_FRAME01", "CUR_RIGHT_FRAME02"],
  up: ["CUR_UP_FRAME01", "CUR_UP_FRAME02"],
  upLeft: ["CUR_UP_LEFT_FRAME01", "CUR_UP_LEFT_FRAME02"],
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

const directionAnimations = {
  [DIRECTION.DOWN]: animationFrames.down,
  [DIRECTION.DOWN_LEFT]: animationFrames.downLeft,
  [DIRECTION.LEFT]: animationFrames.left,
  [DIRECTION.UP_LEFT]: animationFrames.upLeft,
  [DIRECTION.UP]: animationFrames.up,
  [DIRECTION.UP_RIGHT]: animationFrames.upRight,
  [DIRECTION.RIGHT]: animationFrames.right,
  [DIRECTION.DOWN_RIGHT]: animationFrames.downRight,
}

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

// =====================================
// Global Variables
// =====================================
let isZZZAnimationActive = false
let targetX = window.innerWidth / 2
let targetY = window.innerHeight / 2
let petX = targetX
let petY = targetY
let lastMouseX = 0
let lastMouseY = 0
let isDragging = false
let dragStartX = 0
let dragStartY = 0
let dragStartPetX = 0
let dragStartPetY = 0
let dragStartEvent = null

// =====================================
// DOM Elements
// =====================================
const zzzContainer = document.createElement("div")
zzzContainer.style.cssText = `
  position: fixed;
  top: 0;
  left: 0;
  pointer-events: none;
  z-index: 9998;
`
document.body.appendChild(zzzContainer)

const petElement = document.createElement("div")
petElement.id = "neko"
Object.assign(petElement.style, {
  position: "fixed",
  width: `${PET_WIDTH}px`,
  height: `${PET_HEIGHT}px`,
  pointerEvents: "none",
  zIndex: "9999",
  backgroundSize: `${SPRITE_CONFIG.columns * SPRITE_CONFIG.frameWidth}px ${SPRITE_CONFIG.rows * SPRITE_CONFIG.frameHeight}px`,
  backgroundRepeat: "no-repeat",
  backgroundPosition: "0px 0px",
  transformOrigin: "center",
  transition: "transform 0.1s ease",
  display: "none",
})
document.body.appendChild(petElement)

// =====================================
// Sprite Sheet Loader
// =====================================
const spriteSheet = new Image()
spriteSheet.onload = () => {
  petElement.style.backgroundImage = `url('${SPRITE_CONFIG.spritePath}')`

  // Initialize random position
  petX = Math.random() * (window.innerWidth - PET_WIDTH)
  petY = Math.random() * (window.innerHeight - PET_HEIGHT)
  targetX = petX
  targetY = petY

  // Set initial mood and state
  catState.mood = Math.random() < 0.5 ? MOOD.HAPPY : MOOD.CALM
  catState.transition(
    catState.mood === MOOD.CALM ? STATE.SLEEPING : STATE.MOVING,
  )

  petElement.style.display = "block"
  console.log("Sprite sheet loaded successfully")

  // Start animation loop
  catState.frameInterval = setInterval(
    () => catState.updateFrame(),
    TIMING.RUN_FRAME_INTERVAL,
  )
}
spriteSheet.onerror = () => {
  console.error("Failed to load sprite sheet")
}
spriteSheet.src = SPRITE_CONFIG.spritePath

// =====================================
// ZZZ Animation Functions
// =====================================
function createZZZElement() {
  const zzz = document.createElement("div")
  const zCount = 1 + Math.floor(Math.random() * 3)
  zzz.textContent = "z".repeat(zCount)

  const fontSize = ZZZ.FONT_SIZE_MIN + Math.random() * (ZZZ.FONT_SIZE_MAX - ZZZ.FONT_SIZE_MIN)

  zzz.style.cssText = `
    position: fixed;
    color: rgba(150, 150, 150, 0.7);
    font-family: Arial, sans-serif;
    font-weight: bold;
    font-size: ${fontSize}px;
    opacity: 0;
    transition: opacity 0.5s, transform 2s ease-out;
    pointer-events: none;
    user-select: none;
    white-space: nowrap;
  `

  return zzz
}

function animateZZZ() {
  if (!isZZZAnimationActive || !ENABLE_ZZZ_ANIMATION) {
    removeZZZ()
    return
  }

  const zzz = createZZZElement()

  const catHeadX = petX + PET_WIDTH / 2
  const catHeadY = petY + PET_HEIGHT * 0.2
  const offsetX = (Math.random() - 0.5) * ZZZ.OFFSET_X_RANGE
  const offsetY = -Math.random() * ZZZ.OFFSET_Y_RANGE

  zzz.style.left = `${catHeadX + offsetX}px`
  zzz.style.top = `${catHeadY + offsetY}px`
  zzz.style.opacity = "1"
  zzzContainer.appendChild(zzz)

  setTimeout(() => {
    zzz.style.opacity = "0"
    zzz.style.transform = `translateY(${ZZZ.TRANSLATE_Y}px) translateX(${ZZZ.TRANSLATE_X}px)`

    setTimeout(() => {
      if (zzz.parentNode === zzzContainer) {
        zzzContainer.removeChild(zzz)
      }
    }, ZZZ.REMOVE_DELAY)
  }, 100)

  setTimeout(
    animateZZZ,
    ZZZ.ANIMATION_DURATION + Math.random() * ZZZ.ANIMATION_VARIANCE,
  )
}

function removeZZZ() {
  isZZZAnimationActive = false
  zzzContainer.textContent = ""
}

// =====================================
// Cat State Machine
// =====================================
class CatStateMachine {
  constructor() {
    this.state = STATE.MOVING
    this.prevState = null
    this.mood = MOOD.HAPPY
    this.direction = DIRECTION.DOWN
    this.frame = 0
    this.idleTimer = null
    this.idlingTimer = null
    this.sleepTimer = null
    this.moodTimer = null
    this.sleepStartTime = null
    this.isMouseIdle = false
    this.isSurprised = false
    this.surprisedMode = 1
    this.idlingCount = 0
    this.jumpY = 0
    this.jumpV = 0
    this.isJumping = false
    this.frameInterval = null
  }

  transition(newState) {
    removeZZZ()

    this.clearTimers()

    this.isSurprised = false
    this.isJumping = false
    this.jumpY = 0
    this.jumpV = 0

    this.prevState = this.state
    this.state = newState
    this.frame = 0

    switch (newState) {
      case STATE.IDLE:
        this.idleTimer = setTimeout(() => {
          this.transition(STATE.IDLING)
        }, TIMING.IDLE_TO_IDLING_DELAY)
        break
      case STATE.IDLING:
        this.idlingCount = 0
        if (this.mood === MOOD.CALM) {
          this.setIdlingSleepTimer()
        }
        break
      case STATE.SLEEPING:
        this.sleepStartTime = Date.now()
        isZZZAnimationActive = true
        if (ENABLE_ZZZ_ANIMATION) {
          animateZZZ()
        }
        break
      case STATE.MOVING:
        this.isMouseIdle = false
        this.isSurprised = false
        this.isJumping = false
        break
    }

    updatePetAppearance()
  }

  clearTimers() {
    if (this.idleTimer) clearTimeout(this.idleTimer)
    if (this.idlingTimer) clearTimeout(this.idlingTimer)
    this.idleTimer = null
    this.idlingTimer = null
  }

  setIdlingSleepTimer() {
    this.idlingTimer = setTimeout(() => {
      this.transition(STATE.SLEEPING)
    }, 1500)
  }

  changeMood(newMood) {
    if (this.mood === newMood) return
    this.mood = newMood

    if (newMood === MOOD.HAPPY) {
      if (this.state === STATE.SLEEPING) {
        this.transition(STATE.IDLING)
      }
      this.clearTimers()
    } else if (newMood === MOOD.CALM) {
      if (this.state === STATE.MOVING) {
        this.transition(STATE.IDLE)
      } else if (this.state === STATE.IDLING) {
        this.setIdlingSleepTimer()
      }
    }
  }

  handleMouseMove(e) {
    lastMouseX = e.clientX
    lastMouseY = e.clientY

    if (this.mood === MOOD.CALM || isDragging) return

    targetX = e.clientX
    targetY = e.clientY
    this.isMouseIdle = false

    this.clearTimers()
    this.idleTimer = setTimeout(() => {
      this.isMouseIdle = true
    }, TIMING.MOUSE_IDLE_DELAY)

    if (this.state === STATE.SLEEPING) {
      this.transition(STATE.IDLING)
    } else if (this.state === STATE.IDLING) {
      this.transition(STATE.MOVING)
    } else if (this.state !== STATE.MOVING) {
      this.transition(STATE.MOVING)
    }
  }

  handleMouseClick(e) {
    if (this.state !== STATE.SLEEPING) return

    const catCenterX = petX + PET_WIDTH / 2
    const catCenterY = petY + PET_HEIGHT / 2
    const distance = calculateDistance(
      e.clientX,
      e.clientY,
      catCenterX,
      catCenterY,
    )

    if (distance <= SLEEP.CLICK_DISTANCE) {
      removeZZZ()
      const sleepDuration = this.sleepStartTime
        ? Date.now() - this.sleepStartTime
        : 0

      this.surprisedMode = sleepDuration >= SLEEP.MATURE_TIME ? 2 : 1
      this.isSurprised = true
      this.frame = 0

      if (this.surprisedMode === 2) {
        this.isJumping = true
        this.jumpY = PHYSICS.JUMP_INITIAL_HEIGHT
        this.jumpV = 0
      }

      updatePetAppearance()
      setTimeout(() => {
        this.transition(STATE.IDLE)
      }, 1000)
    }
  }

  updateFrame() {
    if (this.isSurprised) {
      this.handleSurprisedFrame()
    } else if (this.state !== STATE.MOVING) {
      this.frame = (this.frame + 1) % 2
    } else {
      this.frame = (this.frame + 1) % 2
    }

    updatePetAppearance()
  }

  handleSurprisedFrame() {
    if (this.surprisedMode === 1) {
      this.frame = (this.frame + 1) % 2
    } else if (this.surprisedMode === 2 && this.isJumping) {
      this.jumpV += PHYSICS.JUMP_GRAVITY
      this.jumpY += this.jumpV
      if (this.jumpY >= 0) {
        this.jumpY = 0
        this.isJumping = false
      }
    }
  }

  scheduleMoodChange() {
    if (this.moodTimer) clearTimeout(this.moodTimer)

    const nextInMs = MOOD_CHANGE_MIN + Math.random() * (MOOD_CHANGE_MAX - MOOD_CHANGE_MIN)

    this.moodTimer = setTimeout(() => {
      const newMood = Math.random() < 0.5 ? MOOD.HAPPY : MOOD.CALM
      this.changeMood(newMood)
      this.scheduleMoodChange()
    }, nextInMs)
  }
}

const catState = new CatStateMachine()

// =====================================
// Drag Handling Functions
// =====================================
function startDrag(e) {
  if (catState.state !== STATE.SLEEPING) return

  // Prevent default selection behavior
  e.preventDefault()

  // Add temporary style to disable selection
  const style = document.createElement("style")
  style.id = "no-select-style"
  style.textContent = "* { user-select: none !important; }"
  document.head.appendChild(style)

  isDragging = true
  dragStartX = e.clientX
  dragStartY = e.clientY
  dragStartPetX = petX
  dragStartPetY = petY
  dragStartEvent = e

  document.addEventListener("mousemove", drag)
  document.addEventListener("mouseup", endDrag)
  updateCursor()
}

function drag(e) {
  if (!isDragging) return

  // Prevent default selection behavior during drag
  e.preventDefault()

  const dx = e.clientX - dragStartX
  const dy = e.clientY - dragStartY

  if (
    Math.abs(dx) > PHYSICS.DRAG_THRESHOLD ||
    Math.abs(dy) > PHYSICS.DRAG_THRESHOLD
  ) {
    petX = dragStartPetX + dx
    petY = dragStartPetY + dy
    const pos = clampToScreen(petX, petY)
    petX = pos.x
    petY = pos.y
    targetX = petX
    targetY = petY
    updatePetAppearance()
  }

  updateCursor()
}

function endDrag() {
  if (!isDragging) return

  // Remove temporary no-select style
  const style = document.getElementById("no-select-style")
  if (style) {
    style.parentNode.removeChild(style)
  }

  isDragging = false
  document.removeEventListener("mousemove", drag)
  document.removeEventListener("mouseup", endDrag)

  if (dragStartEvent) {
    const dx = Math.abs(dragStartEvent.clientX - dragStartEvent.clientX)
    const dy = Math.abs(dragStartEvent.clientY - dragStartEvent.clientY)

    if (dx <= PHYSICS.DRAG_THRESHOLD && dy <= PHYSICS.DRAG_THRESHOLD) {
      catState.handleMouseClick(dragStartEvent)
    }

    dragStartEvent = null
  }

  updateCursor()
}

// =====================================
// Utility Functions
// =====================================
function calculateDistance(x1, y1, x2, y2) {
  const dx = x2 - x1
  const dy = y2 - y1
  return Math.sqrt(dx * dx + dy * dy)
}

function clampToScreen(x, y) {
  return {
    x: Math.max(0, Math.min(window.innerWidth - PET_WIDTH, x)),
    y: Math.max(0, Math.min(window.innerHeight - PET_HEIGHT, y)),
  }
}

function calculateDirection(dx, dy) {
  const angle = Math.atan2(dy, dx)
  const degree = angle * (180 / Math.PI)
  const normalizedDegree = (degree + 360) % 360

  if (normalizedDegree >= 337.5 || normalizedDegree < 22.5)
    return DIRECTION.RIGHT
  if (normalizedDegree >= 22.5 && normalizedDegree < 67.5)
    return DIRECTION.DOWN_RIGHT
  if (normalizedDegree >= 67.5 && normalizedDegree < 112.5)
    return DIRECTION.DOWN
  if (normalizedDegree >= 112.5 && normalizedDegree < 157.5)
    return DIRECTION.DOWN_LEFT
  if (normalizedDegree >= 157.5 && normalizedDegree < 202.5)
    return DIRECTION.LEFT
  if (normalizedDegree >= 202.5 && normalizedDegree < 247.5)
    return DIRECTION.UP_LEFT
  if (normalizedDegree >= 247.5 && normalizedDegree < 292.5) return DIRECTION.UP
  if (normalizedDegree >= 292.5 && normalizedDegree < 337.5)
    return DIRECTION.UP_RIGHT
  return DIRECTION.DOWN
}

function updateCursor() {
  if (catState.state === STATE.IDLE) {
    document.body.style.cursor = "none"
  } else if (isDragging) {
    document.body.style.cursor = "grabbing"
  } else if (catState.state === STATE.SLEEPING) {
    const isOverCat = lastMouseX >= petX && lastMouseX <= petX + PET_WIDTH && lastMouseY >= petY && lastMouseY <= petY + PET_HEIGHT
    document.body.style.cursor = isOverCat ? "grab" : "auto"
  } else {
    document.body.style.cursor = "auto"
  }
}

function updatePetAppearance() {
  let shakeX = 0,
    shakeY = 0,
    offsetY = 0
  let animation = null

  if (catState.state === STATE.MOVING) {
    if (petX <= 0 && catState.direction === DIRECTION.LEFT) {
      animation = animationFrames.scratchLeft
    } else if (petX >= window.innerWidth - PET_WIDTH && catState.direction === DIRECTION.RIGHT) {
      animation = animationFrames.scratchRight
    } else if (petY <= 0 && catState.direction === DIRECTION.UP) {
      animation = animationFrames.scratchUp
    } else if (petY >= window.innerHeight - PET_HEIGHT && catState.direction === DIRECTION.DOWN) {
      animation = animationFrames.scratchDown
    }
  }

  if (!animation) {
    if (catState.isSurprised) {
      animation = animationFrames.surprised
      if (catState.surprisedMode === 1) {
        shakeX = (Math.random() - 0.5) * PHYSICS.SHAKE_INTENSITY
        shakeY = (Math.random() - 0.5) * PHYSICS.SHAKE_INTENSITY
      } else if (catState.surprisedMode === 2) {
        offsetY = catState.jumpY
      }
    } else {
      switch (catState.state) {
        case STATE.SLEEPING:
          animation = animationFrames.sleeping
          break
        case STATE.IDLING:
          animation = animationFrames.idling
          break
        case STATE.IDLE:
          animation = animationFrames.idle
          break
        case STATE.MOVING:
          animation = directionAnimations[catState.direction]
          break
      }
    }
  }

  const currentFrame = animation[catState.frame % animation.length]
  const bgPosition = getBackgroundPosition(currentFrame)

  petElement.style.backgroundPosition = bgPosition

  const left = Math.round(petX + shakeX)
  const top = Math.round(petY + shakeY + offsetY)
  petElement.style.left = `${left}px`
  petElement.style.top = `${top}px`
  updateCursor()
}

// =====================================
// Position Update Logic
// =====================================
function updatePosition() {
  if (catState.mood === MOOD.CALM || isDragging) {
    requestAnimationFrame(updatePosition)
    return
  }

  const catCenterX = petX + PET_WIDTH / 2
  const catCenterY = petY + PET_HEIGHT / 2

  const dx = targetX - catCenterX
  const dy = targetY - catCenterY
  const distance = Math.sqrt(dx * dx + dy * dy)

  if (distance > CATCH_DISTANCE) {
    catState.direction = calculateDirection(dx, dy)

    const moveX = (dx / distance) * PET_SPEED
    const moveY = (dy / distance) * PET_SPEED

    petX += moveX
    petY += moveY

    const clamped = clampToScreen(petX, petY)
    petX = clamped.x
    petY = clamped.y

    updatePetAppearance()
  }

  if (distance < CATCH_DISTANCE && catState.isMouseIdle && catState.state === STATE.MOVING) {
    catState.transition(STATE.IDLE)
  }

  requestAnimationFrame(updatePosition)
}

// =====================================
// Event Listeners
// =====================================
document.addEventListener("mousemove", (e) => {
  catState.handleMouseMove(e)
})

document.addEventListener("mousedown", (e) => {
  const catCenterX = petX + PET_WIDTH / 2
  const catCenterY = petY + PET_HEIGHT / 2
  const distance = calculateDistance(e.clientX, e.clientY, catCenterX, catCenterY)

  if (catState.state === STATE.SLEEPING && distance <= SLEEP.CLICK_DISTANCE) {
    startDrag(e)
  } else {
    catState.handleMouseClick(e)
  }
})

// Window resize handler
window.addEventListener("resize", () => {
  const pos = clampToScreen(petX, petY)
  petX = pos.x
  petY = pos.y
  targetX = Math.min(window.innerWidth - PET_WIDTH, Math.max(0, targetX))
  targetY = Math.min(window.innerHeight - PET_HEIGHT, Math.max(0, targetY))
  updatePetAppearance()
})

// Window scroll handler - ensure neko stays within viewport
window.addEventListener("scroll", () => {
  const pos = clampToScreen(petX, petY)
  petX = pos.x
  petY = pos.y
  updatePetAppearance()
})

// =====================================
// Initialization
// =====================================
catState.scheduleMoodChange()
updatePosition()

// Preload sprite sheet
const preloadLink = document.createElement("link")
preloadLink.rel = "preload"
preloadLink.as = "image"
preloadLink.href = SPRITE_CONFIG.spritePath
document.head.appendChild(preloadLink)