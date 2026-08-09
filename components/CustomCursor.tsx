'use client';

import React, { useEffect, useRef, useState } from 'react';

export default function CustomCursor() {
  const cursorRef = useRef<HTMLDivElement>(null);
  const hammerRef = useRef<HTMLDivElement>(null);
  const [mounted, setMounted] = useState(false);
  const [isHovering, setIsHovering] = useState(false);
  const [isStriking, setIsStriking] = useState(false);
  const [sparkKey, setSparkKey] = useState(0); // Used to re-trigger spark animations on subsequent clicks

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;

    const cursor = cursorRef.current;
    if (!cursor) return;

    // Check if the device is touch-based or has a coarse pointer
    const isTouchDevice = window.matchMedia('(pointer: coarse)').matches;
    if (isTouchDevice) {
      return;
    }

    // Add class to html/body to hide the default browser cursor safely
    document.documentElement.classList.add('has-custom-cursor');

    let mouseX = 0;
    let mouseY = 0;
    let cursorX = 0;
    let cursorY = 0;
    let isVisible = false;

    // Mouse coordinates tracking
    const onMouseMove = (e: MouseEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      
      if (!isVisible) {
        isVisible = true;
        if (cursor) cursor.style.opacity = '1';
      }
    };

    const onMouseLeave = () => {
      isVisible = false;
      if (cursor) cursor.style.opacity = '0';
    };

    // Strike states on click
    const onMouseDown = () => {
      setIsStriking(true);
      setSparkKey(prev => prev + 1); // increment key to force re-render sparks and trigger animation
    };

    const onMouseUp = () => {
      setIsStriking(false);
    };

    // Handle interactive hover states using event delegation
    const onMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement | null;
      if (!target) return;
      
      const interactive = target.closest('a, button, [role="button"], input[type="submit"], input[type="button"], select, .clickable');
      if (interactive) {
        setIsHovering(true);
      }
    };

    const onMouseOut = (e: MouseEvent) => {
      const target = e.target as HTMLElement | null;
      if (!target) return;
      
      const interactive = target.closest('a, button, [role="button"], input[type="submit"], input[type="button"], select, .clickable');
      if (interactive) {
        setIsHovering(false);
      }
    };

    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mousedown', onMouseDown);
    window.addEventListener('mouseup', onMouseUp);
    document.addEventListener('mouseleave', onMouseLeave);
    window.addEventListener('mouseover', onMouseOver);
    window.addEventListener('mouseout', onMouseOut);

    // Smooth cursor follow using lerp & requestAnimationFrame
    const speed = 0.22; // Lerp speed (0.1 is very loose/smooth, 1.0 is instant)
    let animationFrameId: number;

    const updateCursor = () => {
      cursorX += (mouseX - cursorX) * speed;
      cursorY += (mouseY - cursorY) * speed;
      
      if (cursor) {
        cursor.style.transform = `translate3d(${cursorX}px, ${cursorY}px, 0)`;
      }
      
      animationFrameId = requestAnimationFrame(updateCursor);
    };

    animationFrameId = requestAnimationFrame(updateCursor);

    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mousedown', onMouseDown);
      window.removeEventListener('mouseup', onMouseUp);
      document.removeEventListener('mouseleave', onMouseLeave);
      window.removeEventListener('mouseover', onMouseOver);
      window.removeEventListener('mouseout', onMouseOut);
      cancelAnimationFrame(animationFrameId);
      document.documentElement.classList.remove('has-custom-cursor');
    };
  }, [mounted]);

  if (!mounted) return null;

  // Determine dynamic hammer rotation angle
  let rotation = '-40deg'; // Idle position
  if (isStriking) {
    rotation = '-12deg'; // Swing impact position
  } else if (isHovering) {
    rotation = '-55deg'; // Raised position, ready to strike
  }

  return (
    <>
      {/* Self-contained styling for custom cursor */}
      <style dangerouslySetInnerHTML={{ __html: `
        /* Hide native cursor globally if custom cursor is active */
        .has-custom-cursor,
        .has-custom-cursor * {
          cursor: none !important;
        }

        /* Spark/ripple animations */
        .strike-ripple {
          width: 6px;
          height: 6px;
          border-radius: 50%;
          border: 1.5px solid #C2965B;
          position: absolute;
          animation: ripple-out 0.25s cubic-bezier(0.1, 0.8, 0.3, 1) forwards;
        }

        .strike-spark {
          position: absolute;
          width: 3px;
          height: 3px;
          border-radius: 50%;
          background-color: #E5C185;
          animation-duration: 0.25s;
          animation-timing-function: cubic-bezier(0.1, 0.8, 0.2, 1);
          animation-fill-mode: forwards;
        }

        .spark-1 { animation-name: spark-out-1; }
        .spark-2 { animation-name: spark-out-2; }
        .spark-3 { animation-name: spark-out-3; }

        @keyframes ripple-out {
          0% {
            transform: scale(0.5);
            opacity: 0.9;
          }
          100% {
            transform: scale(3.5);
            opacity: 0;
          }
        }

        @keyframes spark-out-1 {
          0% { transform: translate(0, 0) scale(1); opacity: 1; }
          100% { transform: translate(-14px, -6px) scale(0.2); opacity: 0; }
        }
        @keyframes spark-out-2 {
          0% { transform: translate(0, 0) scale(1); opacity: 1; }
          100% { transform: translate(-6px, -14px) scale(0.2); opacity: 0; }
        }
        @keyframes spark-out-3 {
          0% { transform: translate(0, 0) scale(1); opacity: 1; }
          100% { transform: translate(8px, -10px) scale(0.2); opacity: 0; }
        }
      `}} />

      <div
        ref={cursorRef}
        className="fixed top-0 left-0 pointer-events-none z-[99999] hidden md:block opacity-0"
        style={{
          width: '32px',
          height: '32px',
          willChange: 'transform',
          transition: 'opacity 0.2s ease',
          // Offset so the striking face (x=4, y=8) is the hotspot
          marginLeft: '-4px',
          marginTop: '-8px',
        }}
      >
        {/* The Hammer SVG container */}
        <div
          ref={hammerRef}
          style={{
            width: '32px',
            height: '32px',
            transform: `rotate(${rotation})`,
            transformOrigin: '16px 29px',
            transition: isStriking ? 'transform 0.05s cubic-bezier(0.1, 0.9, 0.2, 1)' : 'transform 0.15s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
          }}
        >
          <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
            {/* Handle */}
            <path d="M14 12 L18 12 L18 28 C18 29.1 17.1 30 16 30 C14.9 30 14 29.1 14 28 Z" fill="url(#cursorHandleGrad)" />
            {/* Handle Grip */}
            <path d="M14 21 L18 21 L18 28 C18 29.1 17.1 30 16 30 C14.9 30 14 29.1 14 28 Z" fill="#2A1E17" opacity="0.9" />
            {/* Steel Head */}
            <path d="M6 6 C6 5.45 6.45 5 7 5 H25 C25.55 5 26 5.45 26 6 V10 C26 10.55 25.55 11 25 11 H7 C6.45 11 6 10.55 6 6 Z" fill="url(#cursorMetalGrad)" />
            {/* Left Striking Face */}
            <path d="M4 5 C4 4.45 4.45 4 5 4 H7 V12 H5 C4.45 12 4 11.55 4 11 V5 Z" fill="url(#cursorStrikingGrad)" />
            {/* Right Claw Curve */}
            <path d="M25 5 C25 5 28 6 30 9 C31 10.5 30 11 28 11 C26 11 25 10 25 10 V5 Z" fill="url(#cursorMetalGrad)" />
            {/* Wedge Detail */}
            <circle cx="16" cy="8" r="1.5" fill="#1A1412" />
            
            <defs>
              {/* Handle wood gradient */}
              <linearGradient id="cursorHandleGrad" x1="14" y1="12" x2="18" y2="12" gradientUnits="userSpaceOnUse">
                <stop offset="0%" stop-color="#C2965B" />
                <stop offset="50%" stop-color="#E5C185" />
                <stop offset="100%" stop-color="#A0743B" />
              </linearGradient>
              {/* Metal gradient */}
              <linearGradient id="cursorMetalGrad" x1="6" y1="5" x2="6" y2="11" gradientUnits="userSpaceOnUse">
                <stop offset="0%" stop-color="#8E8E93" />
                <stop offset="50%" stop-color="#48484A" />
                <stop offset="100%" stop-color="#1C1C1E" />
              </linearGradient>
              {/* Striking face metal gradient */}
              <linearGradient id="cursorStrikingGrad" x1="4" y1="4" x2="7" y2="12" gradientUnits="userSpaceOnUse">
                <stop offset="0%" stop-color="#AEAEB2" />
                <stop offset="100%" stop-color="#636366" />
              </linearGradient>
            </defs>
          </svg>
        </div>

        {/* Dynamic Sparks / Ripple Strike Effects */}
        {isStriking && (
          <div 
            key={sparkKey}
            className="absolute left-[4px] top-[8px] pointer-events-none"
          >
            <div className="strike-ripple" />
            <div className="strike-spark spark-1" />
            <div className="strike-spark spark-2" />
            <div className="strike-spark spark-3" />
          </div>
        )}
      </div>
    </>
  );
}
