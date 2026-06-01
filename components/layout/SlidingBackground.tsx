'use client'

import { useState, useEffect } from 'react'

interface SlidingBackgroundProps {
  images?: string[]
}

export default function SlidingBackground({ images = ['/bg1.jpg', '/bg2.jpg', '/bg3.jpg'] }: SlidingBackgroundProps) {
  const [currentIndex, setCurrentIndex] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length)
    }, 8000) // Change background image every 8 seconds

    return () => clearInterval(interval)
  }, [images.length])

  return (
    <div className="fixed inset-0 -z-50 overflow-hidden w-full h-full">
      {/* Animated SaaS Aurora Glow Blobs (Visible immediately as a stunning fallback and background tint) */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-60">
        <div className="absolute -top-[20%] -left-[10%] w-[60%] h-[60%] rounded-full bg-emerald-200/40 blur-[120px] animate-pulse duration-[8000ms]" />
        <div className="absolute -bottom-[20%] -right-[10%] w-[70%] h-[70%] rounded-full bg-teal-100/40 blur-[150px] animate-pulse duration-[12000ms]" />
        <div className="absolute top-[25%] right-[15%] w-[45%] h-[45%] rounded-full bg-sky-100/30 blur-[100px] animate-pulse duration-[10000ms]" />
      </div>

      {/* Dynamic Background Image Layers with Ken Burns Ken Animation */}
      {images.map((src, index) => {
        const isActive = index === currentIndex
        return (
          <div
            key={src}
            style={{
              backgroundImage: `url(${src})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
            }}
            className={`absolute inset-0 transition-opacity duration-[2500ms] ease-in-out ${
              isActive 
                ? 'opacity-80 scale-105 animate-[zoom_25s_infinite_alternate]' 
                : 'opacity-0 scale-100'
            }`}
          />
        )
      })}

      {/* Premium Glassmorphic Vignette Overlay (Ensures perfect text readability) */}
      <div className="absolute inset-0 bg-gradient-to-b from-white/70 via-white/55 to-white/70 backdrop-blur-[1px] pointer-events-none" />

      {/* Subtle SaaS Dot Grid on top of the blurred sliding images */}
      <div 
        className="absolute inset-0 pointer-events-none" 
        style={{
          backgroundImage: 'radial-gradient(oklch(0.58 0.16 150 / 8%) 1.2px, transparent 1.2px)',
          backgroundSize: '24px 24px',
        }}
      />
    </div>
  )
}
