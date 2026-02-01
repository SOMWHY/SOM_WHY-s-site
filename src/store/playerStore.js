import { create } from "zustand"
import { Howl } from "howler"

// 创建播放器状态管理
const usePlayerStore = create((set, get) => {
  // 清理 Howl 实例的辅助函数
  const cleanupHowl = () => {
    const { howl } = get()
    if (howl) {
      try {
        // 清理定时器
        if (howl._timeUpdateInterval) {
          cleanupTimeUpdateInterval(howl._timeUpdateInterval)
          howl._timeUpdateInterval = null
        }
        howl.stop()
        howl.unload()
      } catch (error) {
        console.error("Error cleaning up Howl instance:", error)
      }
    }
  }

  // 清理定时器的辅助函数
  const cleanupTimeUpdateInterval = (interval) => {
    if (interval) {
      clearInterval(interval)
    }
  }

  return {
    // 初始状态
    isPlaying: false,
    currentSong: null,
    currentTime: 0,
    volume: 0.7,
    isMuted: false,
    playlist: [],
    currentIndex: -1,
    position: { x: 20, y: 100 },
    howl: null,
    isLoading: false,

    // 播放控制方法
    play: (song) => {
      const state = get()

      // 防止快速连续操作
      if (state.isLoading) return

      // 清理之前的 Howl 实例和定时器
      cleanupHowl()
      cleanupTimeUpdateInterval()

      let targetSong = song
      let targetIndex = state.currentIndex

      // 如果没有指定歌曲，使用当前歌曲或播放列表的第一首
      if (!targetSong) {
        if (state.currentSong) {
          targetSong = state.currentSong
        } else if (state.playlist.length > 0) {
          targetSong = state.playlist[0]
          targetIndex = 0
        } else {
          return
        }
      } else {
        // 查找歌曲在播放列表中的索引
        targetIndex = state.playlist.findIndex((s) => s.id === targetSong.id)
      }

      // 检查歌曲是否有音频源
      if (!targetSong || !targetSong.audio) {
        console.error("Invalid song or missing audio source:", targetSong)
        return
      }

      // 设置加载状态
      set({ isLoading: true })

      try {
        // 创建新的 Howl 实例
        const howl = new Howl({
          src: [targetSong.audio],
          volume: state.isMuted ? 0 : state.volume,
          onplay: () => {
            set({ isPlaying: true, isLoading: false })
            // 为每个Howl实例创建独立的定时器
            const interval = setInterval(() => {
              if (howl.playing()) {
                try {
                  set({ currentTime: howl.seek() })
                } catch (error) {
                  console.error("Error updating current time:", error)
                  cleanupTimeUpdateInterval(interval)
                }
              } else {
                cleanupTimeUpdateInterval(interval)
              }
            }, 100)
            // 存储定时器引用到Howl实例上，以便后续清理
            howl._timeUpdateInterval = interval
          },
          onpause: () => {
            set({ isPlaying: false })
            if (howl._timeUpdateInterval) {
              cleanupTimeUpdateInterval(howl._timeUpdateInterval)
              howl._timeUpdateInterval = null
            }
          },
          onstop: () => {
            set({ isPlaying: false, currentTime: 0 })
            if (howl._timeUpdateInterval) {
              cleanupTimeUpdateInterval(howl._timeUpdateInterval)
              howl._timeUpdateInterval = null
            }
          },
          onend: () => {
            set({ isPlaying: false, currentTime: 0 })
            if (howl._timeUpdateInterval) {
              cleanupTimeUpdateInterval(howl._timeUpdateInterval)
              howl._timeUpdateInterval = null
            }
            // 播放下一首
            get().next()
          },
          onload: () => {
            // 歌曲加载完成后更新时长
            targetSong.duration = howl.duration()
          },
          onloaderror: (id, error) => {
            console.error("Error loading audio:", error)
            set({ isPlaying: false, isLoading: false })
            cleanupTimeUpdateInterval()
          },
          onplayerror: (id, error) => {
            console.error("Error playing audio:", error)
            set({ isPlaying: false, isLoading: false })
            cleanupTimeUpdateInterval()
          },
        })

        // 先更新基本状态，确保UI能立即响应
        set({
          currentSong: targetSong,
          currentIndex: targetIndex,
          currentTime: 0,
          howl,
        })

        // 播放歌曲
        howl.play()
      } catch (error) {
        console.error("Error creating or playing Howl instance:", error)
        set({ isPlaying: false, isLoading: false })
      }
    },

    pause: () => {
      const { howl } = get()
      if (howl && howl.playing()) {
        try {
          howl.pause()
          set({ isPlaying: false })
          cleanupTimeUpdateInterval()
        } catch (error) {
          console.error("Error pausing Howl instance:", error)
        }
      }
    },

    togglePlay: () => {
      const { isPlaying, play, pause, currentSong, howl } = get()
      if (isPlaying) {
        pause()
      } else {
        if (howl && currentSong) {
          // 继续使用现有Howl实例播放
          try {
            howl.play()
          } catch (error) {
            console.error("Error resuming Howl instance:", error)
            // 如果出错，重新创建Howl实例
            play(currentSong)
          }
        } else {
          // 没有Howl实例，创建新的
          play(currentSong)
        }
      }
    },

    seek: (time) => {
      const { howl } = get()
      if (howl) {
        try {
          howl.seek(time)
          set({ currentTime: time })
        } catch (error) {
          console.error("Error seeking Howl instance:", error)
        }
      }
    },

    setVolume: (volume) => {
      const { howl, isMuted } = get()
      const clampedVolume = Math.max(0, Math.min(1, volume))

      if (howl) {
        try {
          howl.volume(isMuted ? 0 : clampedVolume)
        } catch (error) {
          console.error("Error setting volume:", error)
        }
      }

      set({ volume: clampedVolume })
    },

    toggleMute: () => {
      const { howl, isMuted, volume } = get()
      const newMutedState = !isMuted

      if (howl) {
        try {
          howl.volume(newMutedState ? 0 : volume)
        } catch (error) {
          console.error("Error toggling mute:", error)
        }
      }

      set({ isMuted: newMutedState })
    },

    next: () => {
      const { playlist, currentIndex, isLoading } = get()
      if (playlist.length === 0 || isLoading) return

      const nextIndex = (currentIndex + 1) % playlist.length
      const nextSong = playlist[nextIndex]

      get().play(nextSong)
    },

    previous: () => {
      const { playlist, currentIndex, isLoading } = get()
      if (playlist.length === 0 || isLoading) return

      const prevIndex = (currentIndex - 1 + playlist.length) % playlist.length
      const prevSong = playlist[prevIndex]

      get().play(prevSong)
    },

    // 播放列表方法
    setPlaylist: (playlist) => {
      // 确保 playlist 是一个数组
      if (!Array.isArray(playlist)) {
        console.error("Invalid playlist: must be an array")
        return
      }
      set({ playlist })
    },

    addToPlaylist: (song) => {
      const { playlist } = get()
      // 检查歌曲是否有效
      if (!song || !song.id) {
        console.error("Invalid song: must have an id")
        return
      }
      // 检查歌曲是否已在播放列表中
      if (!playlist.some((s) => s.id === song.id)) {
        set({ playlist: [...playlist, song] })
      }
    },

    removeFromPlaylist: (songId) => {
      const { playlist, currentIndex, currentSong } = get()
      if (!songId) {
        console.error("Invalid songId: must be provided")
        return
      }

      const newPlaylist = playlist.filter((song) => song.id !== songId)

      // 如果删除的是当前播放的歌曲
      if (currentSong && currentSong.id === songId) {
        // 清理 Howl 实例和定时器
        cleanupHowl()
        cleanupTimeUpdateInterval()

        // 播放下一首或清空状态
        if (newPlaylist.length > 0) {
          const newIndex = Math.min(currentIndex, newPlaylist.length - 1)
          get().play(newPlaylist[newIndex])
          set({
            playlist: newPlaylist,
            currentIndex: newIndex,
          })
        } else {
          set({
            playlist: newPlaylist,
            currentIndex: -1,
            currentSong: null,
            isPlaying: false,
            currentTime: 0,
            howl: null,
          })
        }
      } else {
        // 调整当前索引
        let newIndex = currentIndex
        if (currentIndex > playlist.findIndex((song) => song.id === songId)) {
          newIndex--
        }

        set({
          playlist: newPlaylist,
          currentIndex: newIndex,
        })
      }
    },

    // 播放器位置方法
    setPosition: (position) => {
      // 确保 position 是一个有效的对象
      if (
        !position ||
        typeof position.x !== "number" ||
        typeof position.y !== "number"
      ) {
        console.error(
          "Invalid position: must be an object with x and y properties",
        )
        return
      }
      set({ position })
    },

    // 内部方法
    updateCurrentTime: (time) => {
      // 确保 time 是一个有效的数字
      if (typeof time !== "number" || isNaN(time)) {
        console.error("Invalid time: must be a number")
        return
      }
      set({ currentTime: time })
    },

    // 清理方法
    cleanup: () => {
      cleanupHowl()
      cleanupTimeUpdateInterval()
    },
  }
})

export default usePlayerStore
