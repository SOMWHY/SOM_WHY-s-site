import { useState, useEffect, useRef, useCallback } from "react"
import { AnimatePresence } from "framer-motion"
import gsap from "gsap"

import usePlayerStore from "../../store/playerStore"

function Player() {
  const {
    isPlaying,
    currentSong,
    currentTime,
    volume,
    isMuted,
    togglePlay,
    seek,
    setVolume,
    toggleMute,
    next,
    previous,
    position,
    setPosition,
  } = usePlayerStore()

  const [isExpanded, setIsExpanded] = useState(false)
  const [isDragging, setIsDragging] = useState(false)
  const [isSeeking, setIsSeeking] = useState(false)
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 })
  const [tempTime, setTempTime] = useState(0)
  const playerRef = useRef(null)
  const controlsRef = useRef(null)

  useEffect(() => {
    import("../../data/songs.json")
      .then(({ default: songs }) => {
        const playerStore = usePlayerStore.getState()
        playerStore.setPlaylist(songs)
        // 加载播放列表后，直接设置第一首歌作为 currentSong，不触发播放
        if (songs.length > 0 && !playerStore.currentSong) {
          // 使用 Zustand 的 set 方法更新状态
          usePlayerStore.setState({
            currentSong: songs[0],
            currentIndex: 0,
          })
        }
      })
      .catch((err) => console.error("Failed to load songs:", err))
  }, [])

  useEffect(() => {
    const setInitialPosition = () => {
      const footer = document.querySelector("footer")
      if (footer) {
        const footerRect = footer.getBoundingClientRect()
        const playerWidth = 80
        const playerHeight = 80
        const margin = 60

        const x = window.innerWidth - playerWidth - margin
        const y = footerRect.top - playerHeight - margin

        setPosition({ x, y })
      }
    }

    setInitialPosition()
    window.addEventListener("resize", setInitialPosition)
    return () => window.removeEventListener("resize", setInitialPosition)
  }, [setPosition])

  useEffect(() => {
    if (controlsRef.current) {
      if (isExpanded) {
        // 展开动画
        const controlsElement = controlsRef.current

        // 先设置为 auto 以获取真实高度，然后再动画
        controlsElement.style.height = "auto"
        const height = controlsElement.offsetHeight
        controlsElement.style.height = "0"
        controlsElement.style.opacity = "0"

        // 使用 GSAP 动画
        gsap.to(controlsElement, {
          height: height,
          opacity: 1,
          duration: 0.3,
          ease: "power2.inOut",
          onComplete: () => {
            // 动画完成后设置为 auto，以适应内容变化
            controlsElement.style.height = "auto"
          },
        })

        // 子元素动画
        const children = controlsElement.querySelectorAll("div")
        children.forEach((child, index) => {
          gsap.fromTo(
            child,
            { opacity: 0, y: 10 },
            {
              opacity: 1,
              y: 0,
              duration: 0.3,
              delay: 0.1 * (index + 1),
              ease: "power2.out",
            },
          )
        })
      } else {
        // 收起动画
        const controlsElement = controlsRef.current

        // 使用 GSAP 动画
        gsap.to(controlsElement, {
          height: 0,
          opacity: 0,
          duration: 0.3,
          ease: "power2.inOut",
        })
      }
    }
  }, [isExpanded])

  const handleMouseDown = (e) => {
    if (
      e.target instanceof HTMLButtonElement ||
      e.target instanceof HTMLInputElement
    )
      return
    setIsDragging(true)
    setDragOffset({
      x: e.clientX - position.x,
      y: e.clientY - position.y,
    })
  }

  const handleTouchStart = (e) => {
    if (
      e.target instanceof HTMLButtonElement ||
      e.target instanceof HTMLInputElement
    )
      return
    const touch = e.touches[0]
    setIsDragging(true)
    setDragOffset({
      x: touch.clientX - position.x,
      y: touch.clientY - position.y,
    })
  }

  const handleMouseMove = useCallback(
    (e) => {
      if (!isDragging) return
      setPosition({
        x: e.clientX - dragOffset.x,
        y: e.clientY - dragOffset.y,
      })
    },
    [isDragging, dragOffset, setPosition],
  )

  const handleTouchMove = useCallback(
    (e) => {
      if (!isDragging) return
      e.preventDefault()
      const touch = e.touches[0]
      setPosition({
        x: touch.clientX - dragOffset.x,
        y: touch.clientY - dragOffset.y,
      })
    },
    [isDragging, dragOffset, setPosition],
  )

  const handleMouseUp = () => {
    setIsDragging(false)
  }

  const handleTouchEnd = () => {
    setIsDragging(false)
  }

  useEffect(() => {
    if (isDragging) {
      window.addEventListener("mousemove", handleMouseMove)
      window.addEventListener("mouseup", handleMouseUp)
      window.addEventListener("touchmove", handleTouchMove, { passive: false })
      window.addEventListener("touchend", handleTouchEnd)
      return () => {
        window.removeEventListener("mousemove", handleMouseMove)
        window.removeEventListener("mouseup", handleMouseUp)
        window.removeEventListener("touchmove", handleTouchMove)
        window.removeEventListener("touchend", handleTouchEnd)
      }
    }
  }, [isDragging, handleMouseMove, handleTouchMove])

  const handleProgressChange = (e) => {
    const time = parseFloat(e.target.value)
    setTempTime(time)
  }

  const handleSeekStart = () => {
    setIsSeeking(true)
    setTempTime(currentTime)
  }

  const handleSeekEnd = () => {
    setIsSeeking(false)
    seek(tempTime)
  }

  const handleVolumeChange = (e) => {
    const vol = parseFloat(e.target.value)
    setVolume(vol)
  }

  const formatTime = (time) => {
    if (!time) return "0:00"
    const minutes = Math.floor(time / 60)
    const seconds = Math.floor(time % 60)
    return `${minutes}:${seconds.toString().padStart(2, "0")}`
  }

  const playerStyle = {
    position: "fixed",
    zIndex: 9999,
    left: `${position.x}px`,
    top: `${position.y}px`,
    width: isExpanded ? "320px" : "80px",
    minHeight: "80px",
    backgroundColor: "var(--bg)",
    border: "1px solid var(--text)",
    borderRadius: "8px",
    display: "flex",
    flexDirection: "column",
    cursor: isDragging ? "grabbing" : "grab",
    userSelect: "none",
    overflow: "hidden",
    boxShadow: "0 4px 12px rgba(0, 0, 0, 0.3)",
    transition: "width 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
  }

  const headerStyle = {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: isExpanded ? "12px" : "8px",
    borderBottom: isExpanded ? "1px solid var(--muted)" : "none",
    minHeight: "80px",
    position: "relative",
  }

  const controlsStyle = {
    padding: "12px",
    display: "flex",
    flexDirection: "column",
    gap: "12px",
  }

  const progressContainerStyle = {
    display: "flex",
    alignItems: "center",
    gap: "8px",
  }

  const progressStyle = {
    flex: 1,
    height: "4px",
    WebkitAppearance: "none",
    appearance: "none",
    background: "var(--muted)",
    borderRadius: "2px",
    cursor: "pointer",
  }

  const volumeContainerStyle = {
    display: "flex",
    alignItems: "center",
    gap: "8px",
  }

  const buttonStyle = {
    background: "none",
    border: "none",
    color: "var(--text)",
    cursor: "pointer",
    padding: "4px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: "4px",
    transition: "background 0.2s",
  }

  const expandButtonWrapperStyle = {
    position: "absolute",
    right: "12px",
    top: "50%",
    transform: "translateY(-50%)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    width: "24px",
    height: "24px",
  }

  const expandButtonInnerStyle = {
    background: "none",
    border: "none",
    color: "var(--text)",
    cursor: "pointer",
    padding: "4px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: "4px",
    transition: "background 0.2s",
    width: "24px",
    height: "24px",
  }

  const collapsedExpandButtonWrapperStyle = {
    position: "absolute",
    right: "-12px",
    top: "50%",
    transform: "translateY(-50%)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    width: "24px",
    height: "24px",
    zIndex: 1,
  }

  const collapsedExpandButtonInnerStyle = {
    background: "var(--muted)",
    border: "1px solid var(--text)",
    color: "var(--text)",
    cursor: "pointer",
    padding: "0",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: "50%",
    transition: "background 0.2s",
    width: "24px",
    height: "24px",
  }

  return (
    <div
      ref={playerRef}
      style={playerStyle}
      onMouseDown={handleMouseDown}
      onTouchStart={handleTouchStart}
    >
      <div style={headerStyle}>
        {isExpanded ? (
          <>
            {currentSong && currentSong.cover && (
              <img
                src={currentSong.cover}
                alt="cover"
                style={{
                  width: "48px",
                  height: "48px",
                  borderRadius: "4px",
                  objectFit: "cover",
                  marginRight: "12px",
                }}
              />
            )}

            <div style={{ flex: 1, overflow: "hidden" }}>
              <div
                style={{
                  color: "var(--text)",
                  fontSize: "14px",
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  marginBottom: "2px",
                }}
              >
                {currentSong?.title}
              </div>
              <div
                style={{
                  color: "var(--muted)",
                  fontSize: "12px",
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                }}
              >
                {currentSong?.artist}
              </div>
            </div>

            <div style={expandButtonWrapperStyle}>
              <button
                style={expandButtonInnerStyle}
                onClick={() => setIsExpanded(!isExpanded)}
              >
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M18.4 10.6C16.55 9 14.15 8 11.5 8c-4.65 0-8.58 3.03-9.96 7.22L3.9 16c1.05-3.19 4.05-5.5 7.6-5.5 1.95 0 3.73.72 5.12 1.88L13 16h9V7l-3.6 3.6z" />
                </svg>
              </button>
            </div>
          </>
        ) : (
          <>
            <div
              style={{
                width: "100%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <button style={buttonStyle} onClick={togglePlay}>
                {isPlaying && currentSong ? (
                  <svg
                    width="32"
                    height="32"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                  >
                    <rect x="6" y="4" width="4" height="16" />
                    <rect x="14" y="4" width="4" height="16" />
                  </svg>
                ) : (
                  <svg
                    width="32"
                    height="32"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                  >
                    <path d="M8 5v14l11-7z" />
                  </svg>
                )}
              </button>
            </div>

            <div style={collapsedExpandButtonWrapperStyle}>
              <button
                style={collapsedExpandButtonInnerStyle}
                onClick={() => setIsExpanded(!isExpanded)}
              ></button>
            </div>
          </>
        )}
      </div>

      <AnimatePresence>
        {isExpanded && (
          <div ref={controlsRef} style={controlsStyle}>
            {currentSong && (
              <>
                <div style={progressContainerStyle}>
                  <span
                    style={{
                      color: "var(--muted)",
                      fontSize: "12px",
                      minWidth: "40px",
                    }}
                  >
                    {formatTime(isSeeking ? tempTime : currentTime)}
                  </span>
                  <input
                    type="range"
                    min="0"
                    max={currentSong.duration || 100}
                    value={isSeeking ? tempTime : currentTime}
                    onChange={handleProgressChange}
                    onMouseDown={handleSeekStart}
                    onMouseUp={handleSeekEnd}
                    onTouchStart={handleSeekStart}
                    onTouchEnd={handleSeekEnd}
                    style={progressStyle}
                  />
                  <span
                    style={{
                      color: "var(--muted)",
                      fontSize: "12px",
                      minWidth: "40px",
                    }}
                  >
                    {formatTime(currentSong.duration || 0)}
                  </span>
                </div>

                <div
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    gap: "16px",
                  }}
                >
                  <button style={buttonStyle} onClick={previous}>
                    <svg
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                    >
                      <path d="M6 6h2v12H6zm3.5 6l8.5 6V6z" />
                    </svg>
                  </button>

                  <button style={buttonStyle} onClick={togglePlay}>
                    {isPlaying && currentSong ? (
                      <svg
                        width="32"
                        height="32"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                      >
                        <rect x="6" y="4" width="4" height="16" />
                        <rect x="14" y="4" width="4" height="16" />
                      </svg>
                    ) : (
                      <svg
                        width="32"
                        height="32"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                      >
                        <path d="M8 5v14l11-7z" />
                      </svg>
                    )}
                  </button>

                  <button style={buttonStyle} onClick={next}>
                    <svg
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                    >
                      <path d="M6 18l8.5-6L6 6v12zM16 6v12h2V6h-2z" />
                    </svg>
                  </button>
                </div>

                <div style={volumeContainerStyle}>
                  <button style={buttonStyle} onClick={toggleMute}>
                    {isMuted ? (
                      <svg
                        width="20"
                        height="20"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                      >
                        <path d="M16.5 12c0-1.77-1.02-3.29-2.5-4.03v2.21l2.45 2.45c.03-.2.05-.41.05-.63zm2.5 0c0 .94-.2 1.82-.54 2.64l1.51 1.51C20.63 14.91 21 13.5 21 12c0-4.28-2.99-7.86-7-8.77v2.06c2.89.86 5 3.54 5 6.71zM4.27 3L3 4.27 7.73 9H3v6h4l5 5v-6.73l4.25 4.25c-.67.52-1.42.93-2.25 1.18v2.06c1.38-.31 2.63-.95 3.69-1.81L19.73 21 21 19.73l-9-9L4.27 3zM12 4L9.91 6.09 12 8.18V4z" />
                      </svg>
                    ) : (
                      <svg
                        width="20"
                        height="20"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                      >
                        <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z" />
                      </svg>
                    )}
                  </button>
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.01"
                    value={isMuted ? 0 : volume}
                    onChange={handleVolumeChange}
                    style={progressStyle}
                  />
                  <span
                    style={{
                      color: "var(--muted)",
                      fontSize: "12px",
                      minWidth: "30px",
                    }}
                  >
                    {Math.round((isMuted ? 0 : volume) * 100)}%
                  </span>
                </div>
              </>
            )}
          </div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default Player
