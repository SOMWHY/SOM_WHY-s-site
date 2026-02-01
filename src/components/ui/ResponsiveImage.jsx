import React, { memo } from "react"

const ResponsiveImage = memo(function ResponsiveImage({
  src,
  alt,
  width,
  height,
  loading = "lazy",
  fetchpriority = "low",
  className = "",
  aspectRatio = "aspect-[4/5]",
  breakpoints = [320, 640, 1024, 1920],
}) {
  // Generate responsive srcset
  const generateSrcSet = (baseSrc) => {
    const baseUrl = baseSrc.replace(/\.[^/.]+$/, "")
    return breakpoints
      .map((size) => `${baseUrl}_${size}w.webp ${size}w`)
      .join(", ")
  }

  // Generate sizes attribute
  const generateSizes = () => {
    return "(max-width: 640px) 320px, (max-width: 1024px) 640px, (max-width: 1920px) 1024px, 1920px"
  }

  return (
    <div
      className={`${aspectRatio} bg-zinc-900 overflow-hidden border border-white/10 relative group ${className}`}
    >
      <picture>
        {/* WebP format */}
        <source
          type="image/webp"
          srcSet={generateSrcSet(src)}
          sizes={generateSizes()}
        />
        {/* Fallback to original format */}
        <img
          src={src}
          alt={alt}
          width={width}
          height={height}
          loading={loading}
          fetchpriority={fetchpriority}
          className="w-full h-full object-cover grayscale opacity-60 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-700 no-select group-hover:scale-105 group-hover:rotate-x-2 group-hover:rotate-y-2"
        />
      </picture>
    </div>
  )
})

ResponsiveImage.displayName = "ResponsiveImage"

export default ResponsiveImage
