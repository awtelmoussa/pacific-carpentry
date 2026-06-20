'use client';

import { useState, useRef, useEffect } from 'react';

interface BeforeAfterSliderProps {
  beforeImage: string;
  afterImage: string;
  beforeLabel?: string;
  afterLabel?: string;
  aspectRatioClass?: string;
}

export default function BeforeAfterSlider({
  beforeImage,
  afterImage,
  beforeLabel = '3D CAD Design',
  afterLabel = 'Completed Piece',
  aspectRatioClass = 'aspect-[4/3] md:aspect-[16/10]',
}: BeforeAfterSliderProps) {
  const [sliderPosition, setSliderPosition] = useState(50);
  const [isDragging, setIsDragging] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleMove = (clientX: number) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = clientX - rect.left;
    let position = (x / rect.width) * 100;
    if (position < 0) position = 0;
    if (position > 100) position = 100;
    setSliderPosition(position);
  };

  const handleTouchMove = (e: TouchEvent) => {
    if (!isDragging) return;
    handleMove(e.touches[0].clientX);
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (!isDragging) return;
    handleMove(e.clientX);
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  useEffect(() => {
    if (isDragging) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
      window.addEventListener('touchmove', handleTouchMove);
      window.addEventListener('touchend', handleMouseUp);
    }
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('touchend', handleMouseUp);
    };
  }, [isDragging]);

  return (
    <div
      ref={containerRef}
      className={`relative w-full overflow-hidden select-none rounded-[3px] border border-cream/12 bg-bg2 cursor-ew-resize ${aspectRatioClass}`}
      onMouseDown={() => setIsDragging(true)}
      onTouchStart={() => setIsDragging(true)}
    >
      {/* After Image (Completed Photo) - Takes base background layer */}
      <img
        src={afterImage}
        alt="After"
        className="absolute inset-0 w-full h-full object-cover"
        draggable={false}
      />
      <div className="absolute top-4 right-4 bg-wood px-3 py-1.5 rounded-[2px] text-[10px] font-bold tracking-[0.1em] uppercase text-bg select-none z-20">
        {afterLabel}
      </div>

      {/* Before Image (CAD) - Clipped via CSS clipPath inset */}
      <img
        src={beforeImage}
        alt="Before"
        style={{ clipPath: `inset(0 ${100 - sliderPosition}% 0 0)` }}
        className="absolute inset-0 w-full h-full object-cover z-10"
        draggable={false}
      />
      <div className="absolute top-4 left-4 bg-bg/80 backdrop-blur-sm px-3 py-1.5 rounded-[2px] text-[10px] font-bold tracking-[0.1em] uppercase text-cream/70 select-none z-20 border border-cream/5">
        {beforeLabel}
      </div>

      {/* Vertical Divider line & handle */}
      <div
        style={{ left: `${sliderPosition}%` }}
        className="absolute inset-y-0 w-[2px] bg-wood z-20 -translate-x-1/2 pointer-events-none"
      >
        {/* Handle circle */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 rounded-full border border-wood bg-bg/95 flex items-center justify-center text-wood shadow-xl">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <path d="M8 5l-7 7 7 7M16 5l7 7-7 7" />
          </svg>
        </div>
      </div>
    </div>
  );
}
