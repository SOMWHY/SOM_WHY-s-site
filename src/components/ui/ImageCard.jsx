import React, { memo, useState } from "react"

/**
 * 从 srcset 串里取出最后一个候选作为 src 兜底。
 * srcset 条目形如 "/assets/x-abc.webp 640w"，最后一个通常是最大/最优的那张。
 */
function pickFallbackSrc(srcSet) {
  if (!srcSet) return undefined
  const last = srcSet.split(",").pop()?.trim()
  return last ? last.split(/\s+/)[0] : undefined
}

const ImageCard = memo(function ImageCard({
  image,
  srcSet,
  sizes,
  alt,
  children,
  className = "",
  aspectRatio,
  width,
  height,
  loading = "lazy",
  fetchPriority = "low",
}) {
  // Determine aspect ratio class with priority: aspectRatio prop > calculated from width/height > default
  const aspectRatioClass = aspectRatio
    ? aspectRatio
    : width && height
      ? `aspect-[${width}/${height}]`
      : "aspect-[4/5]"

  const [isLoaded, setIsLoaded] = useState(false)

  return (
    <div
      className={`${aspectRatioClass} bg-zinc-900 overflow-hidden border border-white/10 relative group ${className}`}
    >
      {/* 占位符 */}
      <div
        className={`absolute inset-0 bg-gradient-to-br from-zinc-800 to-zinc-900 animate-pulse transition-opacity duration-300 ${isLoaded ? "opacity-0" : "opacity-100"}`}
      />

      {/* 加载指示器 */}
      {!isLoaded && (
        <div className="absolute inset-0 flex items-center justify-center opacity-50">
          <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin" />
        </div>
      )}

      <img
        src={image ?? pickFallbackSrc(srcSet)}
        srcSet={srcSet}
        sizes={sizes}
        alt={alt}
        width={width}
        height={height}
        loading={loading}
        fetchPriority={fetchPriority}
        decoding="async"
        onLoad={() => setIsLoaded(true)}
        className={`w-full h-full object-cover grayscale group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-700 no-select group-hover:scale-105 group-hover:rotate-x-2 group-hover:rotate-y-2 ${isLoaded ? "opacity-60" : "opacity-0"}`}
      />
      {children && (
        <div className="absolute bottom-0 left-0 p-6 w-full">{children}</div>
      )}
    </div>
  )
})

ImageCard.displayName = "ImageCard"

export default ImageCard
