import React, { memo } from 'react';

const PhotoCard = memo(function PhotoCard({ image, alt, refCode, title }) {
  return (
    <div className="photo-card aspect-[4/5] bg-zinc-900 overflow-hidden border border-white/5 relative group cursor-pointer">
      <img
        src={image}
        alt={alt}
        className="w-full h-full object-cover grayscale opacity-60 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-700 no-select"
      />
      <div className="absolute bottom-0 left-0 p-4 opacity-0 group-hover:opacity-100 transition-opacity bg-gradient-to-t from-black/80 to-transparent w-full">
        <p className="font-mono text-[8px] tracking-[0.2em] text-white/60">
          REF. {refCode}
        </p>
        <p className="font-mono text-[10px] text-white uppercase">
          {title}
        </p>
      </div>
    </div>
  )
});

PhotoCard.displayName = 'PhotoCard';

export default PhotoCard;
