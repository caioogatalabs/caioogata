'use client'

import { useRef, useEffect, useCallback, useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import Image from 'next/image'
import { useWindowManager } from '@/hooks/useWindowManager'
import { useInteractionMode } from '@/hooks/useInteractionMode'
import { useNavigation } from '@/components/providers/NavigationProvider'
import ImageWindow from './ImageWindow'
import ViewModeControls from './ViewModeControls'
import type { ProjectImage } from '@/content/types'

interface ProjectCanvasProps {
  images: ProjectImage[]
  viewModeLabels: {
    free: string
    grid: string
    list: string
    carousel: string
    cascade: string
    showcase: string
  }
  onExit?: () => void
}

const SHOWCASE_INTERVAL = 5000 // 5 seconds per image

const BASE_CANVAS_WIDTH = 1400
const BASE_CANVAS_HEIGHT = 600

export default function ProjectCanvas({ images, viewModeLabels, onExit }: ProjectCanvasProps) {
  const canvasRef = useRef<HTMLDivElement>(null)
  const { mode } = useInteractionMode()
  const { setIsCanvasActive } = useNavigation()

  const {
    windows,
    viewMode,
    activeWindowId,
    carouselIndex,
    canvasDimensions,
    showcaseIndex,
    showcasePaused,
    setViewMode,
    bringToFront,
    closeWindow,
    openAllWindows,
    updatePosition,
    navigateCarousel,
    navigateWindows,
    navigateStack,
    navigateShowcase,
    setShowcasePaused
  } = useWindowManager({
    images,
    baseCanvasWidth: BASE_CANVAS_WIDTH,
    baseCanvasHeight: BASE_CANVAS_HEIGHT
  })

  const openWindowsCount = windows.filter(w => w.isOpen).length

  // Showcase: track natural image dimensions for pan detection
  const [showcaseImageNatural, setShowcaseImageNatural] = useState<{ width: number; height: number } | null>(null)

  // Load natural dimensions of the current showcase image
  useEffect(() => {
    if (viewMode !== 'showcase') return
    const currentImage = images[showcaseIndex]
    if (!currentImage) return

    setShowcaseImageNatural(null)
    const img = new window.Image()
    img.onload = () => {
      setShowcaseImageNatural({ width: img.width, height: img.height })
    }
    img.src = decodeURIComponent(currentImage.src)
  }, [viewMode, showcaseIndex, images])

  // Showcase auto-play timer
  useEffect(() => {
    if (viewMode !== 'showcase' || showcasePaused || images.length <= 1) return

    const timer = setInterval(() => {
      navigateShowcase('next')
      // navigateShowcase pauses, so resume after auto-advance
      setShowcasePaused(false)
    }, SHOWCASE_INTERVAL)

    return () => clearInterval(timer)
  }, [viewMode, showcasePaused, images.length, navigateShowcase, setShowcasePaused])

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (!canvasRef.current?.contains(document.activeElement) && document.activeElement !== canvasRef.current) {
      return
    }

    switch (e.key) {
      case 'ArrowUp':
      case 'ArrowLeft':
        e.preventDefault()
        if (viewMode === 'showcase') {
          navigateShowcase('prev')
        } else if (viewMode === 'carousel') {
          navigateCarousel('prev')
        } else if (viewMode === 'list') {
          navigateStack('prev')
        } else {
          navigateWindows('prev')
        }
        break
      case 'ArrowDown':
      case 'ArrowRight':
        e.preventDefault()
        if (viewMode === 'showcase') {
          navigateShowcase('next')
        } else if (viewMode === 'carousel') {
          navigateCarousel('next')
        } else if (viewMode === 'list') {
          navigateStack('next')
        } else {
          navigateWindows('next')
        }
        break
      case ' ':
        if (viewMode === 'showcase') {
          e.preventDefault()
          setShowcasePaused(!showcasePaused)
        }
        break
      case '1':
        setViewMode('cascade')
        break
      case '2':
        setViewMode('grid')
        break
      case '3':
        setViewMode('free')
        break
      case '4':
        setViewMode('list')
        break
      case '5':
        setViewMode('carousel')
        break
      case '6':
        setViewMode('showcase')
        break
      case 'r':
      case 'R':
        openAllWindows()
        break
      case 'Enter':
      case 'Escape':
        setIsCanvasActive(false)
        onExit?.()
        break
    }
  }, [viewMode, navigateCarousel, navigateWindows, navigateStack, navigateShowcase, showcasePaused, setShowcasePaused, setViewMode, openAllWindows, onExit, setIsCanvasActive])

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [handleKeyDown])

  // Auto-focus canvas when mounted (when project expands)
  useEffect(() => {
    canvasRef.current?.focus()
    setIsCanvasActive(true)

    // Cleanup: deactivate canvas mode when unmounted
    return () => {
      setIsCanvasActive(false)
    }
  }, [setIsCanvasActive])

  // Touch/swipe handling
  const touchStartX = useRef<number | null>(null)

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0]?.clientX ?? null
  }

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null) return

    const touchEndX = e.changedTouches[0]?.clientX ?? 0
    const diffX = touchStartX.current - touchEndX

    if (Math.abs(diffX) > 50) {
      if (viewMode === 'showcase') {
        navigateShowcase(diffX > 0 ? 'next' : 'prev')
      } else if (viewMode === 'carousel') {
        navigateCarousel(diffX > 0 ? 'next' : 'prev')
      } else if (viewMode === 'list') {
        navigateStack(diffX > 0 ? 'next' : 'prev')
      }
    }

    touchStartX.current = null
  }

  return (
    <div className="relative">
      {/* Canvas with dynamic dimensions - no internal scroll */}
      <motion.div
        ref={canvasRef}
        className="relative"
        style={{
          perspective: viewMode === 'list' ? '1000px' : 'none',
          perspectiveOrigin: 'center top'
        }}
        animate={{
          width: canvasDimensions.width,
          height: canvasDimensions.height
        }}
        transition={{
          type: 'spring',
          stiffness: 300,
          damping: 30
        }}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
        tabIndex={0}
        role="region"
        aria-label="Project images canvas"
      >
        {/* Background grid pattern */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            backgroundColor: '#0a0a0a',
            backgroundImage: `
              linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px),
              linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)
            `,
            backgroundSize: '32px 32px'
          }}
        />

        {/* Controls - fixed position within canvas */}
        <div className="absolute top-4 left-4 z-50 flex items-start gap-4">
          <ViewModeControls
            currentMode={viewMode}
            onModeChange={setViewMode}
            onResetWindows={openAllWindows}
            labels={viewModeLabels}
          />
        </div>

        {/* Navigation hints */}
        <div className="absolute top-4 right-4 z-50">
          <div className="text-xs text-secondary/50 font-mono bg-black/60 px-2 py-1 rounded-sm border border-white/10">
            {mode === 'keyboard' && (
              <span>
                <kbd className="text-primary">1-6</kbd> modes
                <span className="mx-2">·</span>
                <kbd className="text-primary">↑↓</kbd> navigate
                <span className="mx-2">·</span>
                <kbd className="text-primary">R</kbd> reset
                <span className="mx-2">·</span>
                <kbd className="text-primary">Esc</kbd> exit
              </span>
            )}
            {mode === 'mouse' && (
              <span>Drag to move · Double-click to maximize</span>
            )}
            {mode === 'touch' && (
              <span>Swipe to navigate · Tap to focus</span>
            )}
          </div>
        </div>

        {/* Windows — hidden in showcase mode */}
        {viewMode !== 'showcase' && (
          <AnimatePresence>
            {windows.map((window, index) => (
              <ImageWindow
                key={window.id}
                id={window.id}
                index={index}
                image={window.image}
                x={window.x}
                y={window.y}
                zIndex={window.zIndex}
                rotation={window.rotation}
                isActive={activeWindowId === window.id}
                isOpen={window.isOpen}
                viewMode={viewMode}
                canvasWidth={canvasDimensions.width}
                canvasHeight={canvasDimensions.height}
                onClose={() => closeWindow(window.id)}
                onFocus={() => bringToFront(window.id)}
                onDragEnd={(x, y) => updatePosition(window.id, x, y)}
                dragConstraints={canvasRef}
              />
            ))}
          </AnimatePresence>
        )}

        {/* Showcase mode */}
        {viewMode === 'showcase' && images.length > 0 && (
          <div className="absolute inset-0 z-10 bg-black flex items-center justify-center overflow-hidden">
            <AnimatePresence mode="wait">
              <motion.div
                key={showcaseIndex}
                className="relative w-full h-full flex items-center justify-center"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.6, ease: 'easeInOut' }}
              >
                {(() => {
                  const currentImage = images[showcaseIndex]
                  if (!currentImage) return null

                  const nat = showcaseImageNatural
                  const cw = canvasDimensions.width
                  const ch = canvasDimensions.height

                  // Determine if image is larger than canvas in either direction
                  const overflowsX = nat ? nat.width > cw : false
                  const overflowsY = nat ? nat.height > ch : false
                  const needsPan = overflowsX || overflowsY

                  if (needsPan && nat) {
                    // Calculate the pan distances
                    // Show image at its natural size (or scaled to fit the larger dimension)
                    // and pan across the overflow
                    const scale = Math.max(cw / nat.width, ch / nat.height)
                    const displayW = nat.width * scale
                    const displayH = nat.height * scale
                    const panX = overflowsX ? (displayW - cw) / 2 : 0
                    const panY = overflowsY ? (displayH - ch) / 2 : 0

                    return (
                      <motion.div
                        className="relative"
                        style={{ width: displayW, height: displayH }}
                        animate={{
                          x: [panX, -panX],
                          y: [panY, -panY]
                        }}
                        transition={{
                          duration: SHOWCASE_INTERVAL / 1000 * 1.2,
                          ease: 'easeInOut',
                          repeat: Infinity,
                          repeatType: 'reverse'
                        }}
                      >
                        <Image
                          src={currentImage.src}
                          alt={currentImage.title}
                          fill
                          className="object-cover"
                          sizes={`${Math.max(cw, displayW)}px`}
                          priority
                        />
                      </motion.div>
                    )
                  }

                  // Image fits — center it on dark background
                  return (
                    <Image
                      src={currentImage.src}
                      alt={currentImage.title}
                      fill
                      className="object-contain"
                      sizes={`${cw}px`}
                      priority
                    />
                  )
                })()}
              </motion.div>
            </AnimatePresence>

            {/* Showcase progress bar */}
            {images.length > 1 && (
              <div className="absolute bottom-0 left-0 right-0 z-20">
                {/* Image counter */}
                <div className="flex justify-center mb-3">
                  <span className="text-xs text-white/50 font-mono bg-black/60 px-2 py-0.5 rounded-sm">
                    {showcaseIndex + 1} / {images.length}
                    {showcasePaused && ' — paused'}
                  </span>
                </div>
                {/* Progress dots */}
                <div className="flex justify-center gap-1.5 mb-4">
                  {images.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => {
                        navigateShowcase(index > showcaseIndex ? 'next' : 'prev')
                        // Navigate to exact index
                        const diff = index - showcaseIndex
                        if (Math.abs(diff) > 1) {
                          for (let i = 1; i < Math.abs(diff); i++) {
                            navigateShowcase(diff > 0 ? 'next' : 'prev')
                          }
                        }
                      }}
                      className={`
                        h-1 rounded-full transition-all duration-300
                        ${index === showcaseIndex ? 'w-6 bg-primary' : 'w-1.5 bg-white/30 hover:bg-white/50'}
                      `}
                      aria-label={`Go to image ${index + 1}`}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Click areas for prev/next */}
            <button
              className="absolute left-0 top-0 w-1/4 h-full z-20 cursor-w-resize opacity-0 hover:opacity-100 transition-opacity"
              onClick={() => navigateShowcase('prev')}
              aria-label="Previous image"
            >
              <div className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40 text-2xl font-mono">‹</div>
            </button>
            <button
              className="absolute right-0 top-0 w-1/4 h-full z-20 cursor-e-resize opacity-0 hover:opacity-100 transition-opacity"
              onClick={() => navigateShowcase('next')}
              aria-label="Next image"
            >
              <div className="absolute right-4 top-1/2 -translate-y-1/2 text-white/40 text-2xl font-mono">›</div>
            </button>
          </div>
        )}

        {/* Empty state */}
        {viewMode !== 'showcase' && openWindowsCount === 0 && (
          <div className="absolute inset-0 flex items-center justify-center">
            <button
              onClick={openAllWindows}
              className="text-secondary/60 hover:text-primary transition-colors font-mono text-sm bg-black/40 px-4 py-2 rounded border border-white/10"
            >
              All windows closed. Press <kbd className="text-primary">R</kbd> or click to reset.
            </button>
          </div>
        )}

        {/* Carousel indicators */}
        {viewMode === 'carousel' && openWindowsCount > 1 && (
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-2 z-50">
            {windows.filter(w => w.isOpen).map((_, index) => (
              <button
                key={index}
                onClick={() => {
                  const diff = index - carouselIndex
                  if (diff !== 0) {
                    for (let i = 0; i < Math.abs(diff); i++) {
                      navigateCarousel(diff > 0 ? 'next' : 'prev')
                    }
                  }
                }}
                className={`
                  w-2 h-2 rounded-full transition-colors
                  ${index === carouselIndex ? 'bg-primary' : 'bg-primary/30 hover:bg-primary/50'}
                `}
                aria-label={`Go to image ${index + 1}`}
              />
            ))}
          </div>
        )}
      </motion.div>
    </div>
  )
}
