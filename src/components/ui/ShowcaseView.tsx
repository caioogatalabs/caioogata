'use client'

import { useRef, useState, useEffect, useCallback } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import Image from 'next/image'
import VideoEmbed from './VideoEmbed'
import type { ProjectImage } from '@/content/types'

interface ShowcaseViewProps {
  images: ProjectImage[]
  currentIndex: number
  isPaused: boolean
  onNavigate: (direction: 'prev' | 'next') => void
  onSetIndex: (index: number) => void
  onSetPaused: (paused: boolean) => void
}

export default function ShowcaseView({
  images,
  currentIndex,
  isPaused,
  onNavigate,
  onSetIndex,
  onSetPaused
}: ShowcaseViewProps) {
  const touchStartX = useRef<number | null>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const currentImage = images[currentIndex]

  // Track natural dimensions of current image
  const [naturalSize, setNaturalSize] = useState<{ w: number; h: number } | null>(null)
  const [containerSize, setContainerSize] = useState<{ w: number; h: number }>({ w: 800, h: 800 })

  const isVideo = currentImage?.type === 'video'

  // Load natural dimensions when image changes
  useEffect(() => {
    if (!currentImage) return
    if (currentImage.type === 'video') {
      setNaturalSize({ w: 1920, h: 1080 })
      return
    }
    setNaturalSize(null)
    const img = new window.Image()
    img.onload = () => setNaturalSize({ w: img.width, h: img.height })
    img.src = decodeURIComponent(currentImage.src)
  }, [currentImage])

  // Measure container for fitting
  useEffect(() => {
    if (!containerRef.current) return
    const update = () => {
      if (containerRef.current) {
        setContainerSize({ w: containerRef.current.clientWidth, h: containerRef.current.clientHeight })
      }
    }
    update()
    const observer = new ResizeObserver(update)
    observer.observe(containerRef.current)
    return () => observer.disconnect()
  }, [])

  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    touchStartX.current = e.touches[0]?.clientX ?? null
  }, [])

  const handleTouchEnd = useCallback((e: React.TouchEvent) => {
    if (touchStartX.current === null) return
    const endX = e.changedTouches[0]?.clientX ?? 0
    const diff = touchStartX.current - endX
    if (Math.abs(diff) > 50) {
      onNavigate(diff > 0 ? 'next' : 'prev')
    }
    touchStartX.current = null
  }, [onNavigate])

  if (!currentImage) return null

  // Calculate display size: fit within container, never exceed natural size
  let displayW = 0
  let displayH = 0
  if (naturalSize) {
    const maxW = Math.min(naturalSize.w, containerSize.w - 32) // 16px padding each side
    const maxH = Math.min(naturalSize.h, containerSize.h - 32)
    const scale = Math.min(maxW / naturalSize.w, maxH / naturalSize.h)
    displayW = Math.round(naturalSize.w * scale)
    displayH = Math.round(naturalSize.h * scale)
  }

  return (
    <motion.div
      className="relative w-full bg-black flex flex-col"
      style={{ minHeight: 900 }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      {/* Main image area */}
      <div
        ref={containerRef}
        className="flex-1 relative flex items-center justify-center overflow-hidden"
        style={{ minHeight: 800 }}
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={currentIndex}
            className="flex items-center justify-center"
            initial={{ opacity: 0, x: 60 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -60 }}
            transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
          >
            {naturalSize ? (
              isVideo && currentImage.platform && currentImage.videoId ? (
                <div style={{ width: displayW, height: displayH }}>
                  <VideoEmbed platform={currentImage.platform} videoId={currentImage.videoId} />
                </div>
              ) : (
                <Image
                  src={currentImage.src}
                  alt={currentImage.title}
                  width={displayW}
                  height={displayH}
                  className="block"
                  sizes={`${displayW}px`}
                  priority
                />
              )
            ) : (
              <div className="text-white/20 font-mono text-sm">Loading...</div>
            )}
          </motion.div>
        </AnimatePresence>

        {/* Click areas for prev/next */}
        <button
          className="absolute left-0 top-0 w-1/4 h-full z-20 cursor-w-resize opacity-0 hover:opacity-100 transition-opacity"
          onClick={() => onNavigate('prev')}
          aria-label="Previous image"
        >
          <div className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40 text-2xl font-mono">&#8249;</div>
        </button>
        <button
          className="absolute right-0 top-0 w-1/4 h-full z-20 cursor-e-resize opacity-0 hover:opacity-100 transition-opacity"
          onClick={() => onNavigate('next')}
          aria-label="Next image"
        >
          <div className="absolute right-4 top-1/2 -translate-y-1/2 text-white/40 text-2xl font-mono">&#8250;</div>
        </button>
      </div>

      {/* Bottom bar: counter + dots */}
      {images.length > 1 && (
        <div className="relative z-20 py-4 flex flex-col items-center gap-3">
          <span className="text-xs text-white/50 font-mono">
            {currentIndex + 1} / {images.length}
            {isPaused && ' \u2014 paused'}
          </span>
          <div className="flex items-center gap-1.5">
            {images.map((_, i) => (
              <button
                key={i}
                onClick={() => onSetIndex(i)}
                className={`
                  h-1 rounded-full transition-all duration-300
                  ${i === currentIndex ? 'w-6 bg-primary' : 'w-1.5 bg-white/30 hover:bg-white/50'}
                `}
                aria-label={`Go to image ${i + 1}`}
              />
            ))}
          </div>
        </div>
      )}
    </motion.div>
  )
}
