import React, { memo, useState, useEffect, useRef } from "react"
import { ArrowUpRight } from "lucide-react"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"

gsap.registerPlugin(ScrollTrigger)

const Works = memo(function Works() {
  const containerRef = useRef(null)
  const [songs, setSongs] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchSongs = async () => {
      try {
        console.log("Starting to fetch songs...")
        const response = await fetch(
          "http://localhost:3000/album?id=273210458",
          {
            mode: "cors",
            headers: {
              "Content-Type": "application/json",
            },
          },
        )
        console.log("Response received:", response)
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`)
        }
        const data = await response.json()
        console.log("Data received:", data)
        if (data.songs) {
          setSongs(data.songs)
        } else {
          console.error("No songs found in response")
        }
      } catch (error) {
        console.error("Failed to fetch songs:", error)
      } finally {
        console.log("Fetch completed, setting loading to false")
        setLoading(false)
      }
    }

    fetchSongs()
  }, [])

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    const items = container.querySelectorAll(".link-card")
    if (!items.length) return

    gsap.utils.toArray(items).forEach((item, index) => {
      gsap.set(item, { opacity: 1, y: 0 })

      gsap.from(item, {
        scrollTrigger: {
          trigger: item,
          start: "top 80%",
          toggleActions: "play none none none",
        },
        opacity: 0,
        y: 50,
        duration: 0.8,
        delay: index * 0.1,
        ease: "power2.out",
      })
    })
  }, [songs])

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    const linkCards = container.querySelectorAll(".link-card")
    if (!linkCards.length) return

    const timelines = new Map()
    const eventHandlers = new Map()

    linkCards.forEach((card) => {
      const ring = card.querySelector(".ring-border")
      if (!ring) return

      const totalLength = ring.getTotalLength()

      gsap.set(ring, {
        strokeDasharray: totalLength,
        strokeDashoffset: totalLength,
      })

      const timeline = gsap.timeline({ paused: true })

      timeline.to(ring, {
        strokeDashoffset: 0,
        duration: 0.6,
        ease: "power2.out",
        force3D: true,
      })

      timelines.set(card, timeline)

      const handleMouseEnter = () => {
        timeline.play(0)
      }

      const handleMouseLeave = () => {
        timeline.reverse()
      }

      eventHandlers.set(card, { handleMouseEnter, handleMouseLeave })

      card.addEventListener("mouseenter", handleMouseEnter)
      card.addEventListener("mouseleave", handleMouseLeave)
    })

    return () => {
      linkCards.forEach((card) => {
        const timeline = timelines.get(card)
        if (timeline) {
          timeline.kill()
        }
        const handlers = eventHandlers.get(card)
        if (handlers) {
          card.removeEventListener("mouseenter", handlers.handleMouseEnter)
          card.removeEventListener("mouseleave", handlers.handleMouseLeave)
        }
      })
    }
  }, [songs])

  return (
    <div className="w-full max-w-4xl px-6 md:px-0 relative z-10 py-12 pb-32">
      <div className="mb-16">
        <h2
          className="font-mono text-[10px] tracking-[0.6em] uppercase mb-4"
          style={{ color: "var(--muted)" }}
        >
          SELECTED PRODUCTIONS
        </h2>
        <h1
          className="text-4xl md:text-6xl font-mono text-transparent bg-clip-text bg-gradient-to-r uppercase"
          style={{
            backgroundImage:
              "linear-gradient(to right, var(--text), var(--muted))",
          }}
        >
          Audio Works
        </h1>
      </div>

      <div ref={containerRef} className="grid grid-cols-1 gap-4">
        {loading ? (
          <div className="col-span-full text-center py-12">
            <p
              className="font-mono text-[10px] tracking-[0.3em] uppercase"
              style={{ color: "var(--muted)" }}
            >
              Loading...
            </p>
          </div>
        ) : songs.length === 0 ? (
          <div className="col-span-full text-center py-12">
            <p
              className="font-mono text-[10px] tracking-[0.3em] uppercase"
              style={{ color: "var(--muted)" }}
            >
              No songs found
            </p>
          </div>
        ) : (
          songs.map((song, index) => {
            const epTitles = [
              "VOID FREQUENCY",
              "BOTANICAL SYNTH",
              "INDUSTRIAL ECHO",
              "SPRING-LIKE",
              "GROUNDED",
              "BLOOM",
            ]

            return (
              <a
                key={song.id}
                href={`https://music.163.com/song?id=${song.id}`}
                target="_blank"
                rel="noopener noreferrer"
                className="link-card relative flex items-center justify-between p-6 hover:bg-zinc-900/30 rounded-lg transition-all"
              >
                <svg
                  className="absolute inset-0 w-full h-full pointer-events-none"
                  style={{ borderRadius: "0.5rem" }}
                >
                  <rect
                    x="1"
                    y="1"
                    width="calc(100% - 2px)"
                    height="calc(100% - 2px)"
                    rx="7"
                    ry="7"
                    fill="none"
                    className="ring-border"
                    stroke="currentColor"
                    strokeWidth="2"
                    style={{
                      color: "var(--ring-border)",
                      transition: "color 0.3s ease",
                    }}
                  />
                </svg>
                <div className="relative z-10">
                  <p className="font-mono text-[9px] tracking-[0.3em] text-zinc-600 dark:text-zinc-400 mb-2">
                    EP. {String(index + 1).padStart(2, "0")} /{" "}
                    {song.al && song.al.name
                      ? song.al.name.toUpperCase()
                      : epTitles[index % epTitles.length]}
                  </p>
                  <h3 className="font-medium text-2xl text-zinc-800 dark:text-white hover:text-cyan-500 dark:hover:text-cyan-500 transition-colors">
                    {song.name}
                  </h3>
                </div>
                <ArrowUpRight className="relative z-10 text-zinc-400 dark:text-zinc-500 hover:text-cyan-500 transition-colors" />
              </a>
            )
          })
        )}
      </div>

      <div className="pb-24 md:pb-32"></div>
    </div>
  )
})

Works.displayName = "Works"

export default Works
