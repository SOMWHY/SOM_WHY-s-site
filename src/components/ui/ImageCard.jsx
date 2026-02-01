import React, { memo } from "react"

const ImageCard = memo(function ImageCard({
  image,
  alt,
  children,
  className = "",
  aspectRatio = "aspect-[4/5]",
  width,
  height,
  loading = "lazy",
  fetchpriority = "low",
}) {
  return (
    <div
      className={`${aspectRatio} bg-zinc-900 overflow-hidden border border-white/10 relative group ${className}`}
    >
      <img
        src={image}
        alt={alt}
        width={width}
        height={height}
        loading={loading}
        fetchpriority={fetchpriority}
        className="w-full h-full object-cover grayscale opacity-60 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-700 no-select group-hover:scale-105 group-hover:rotate-x-2 group-hover:rotate-y-2"
      />
      {children && (
        <div className="absolute bottom-0 left-0 p-6 w-full">{children}</div>
      )}
    </div>
  )
})

ImageCard.displayName = "ImageCard"

export default ImageCard
