'use client'

import { useRef, useEffect, useCallback } from 'react'
import { AnimatePresence } from 'motion/react'
import { useWindowManager } from '@/hooks/useWindowManager'
import { useInteractionMode } from '@/hooks/useInteractionMode'
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
  }
}

const CANVAS_WIDTH = 1400
const CANVAS_HEIGHT = 700

export default function ProjectCanvas({ images, viewModeLabels }: ProjectCanvasProps) {
  const canvasRef = useRef<HTMLDivElement>(null)
  const { mode } = useInteractionMode()

  const {
    windows,
    viewMode,
    activeWindowId,
    carouselIndex,
    setViewMode,
    bringToFront,
    closeWindow,
    openAllWindows,
    updatePosition,
    setActiveWindow,
    navigateCarousel,
    navigateWindows
  } = useWindowManager({
    images,
    canvasWidth: CANVAS_WIDTH,
    canvasHeight: CANVAS_HEIGHT
  })

  const openWindowsCount = windows.filter(w => w.isOpen).length

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (!canvasRef.current?.contains(document.activeElement) && document.activeElement !== canvasRef.current) {
      return
    }

    switch (e.key) {
      case 'ArrowLeft':
        e.preventDefault()
        if (viewMode === 'carousel') {
          navigateCarousel('prev')
        } else {
          navigateWindows('prev')
        }
        break
      case 'ArrowRight':
        e.preventDefault()
        if (viewMode === 'carousel') {
          navigateCarousel('next')
        } else {
          navigateWindows('next')
        }
        break
      case 'ArrowUp':
        e.preventDefault()
        navigateWindows('prev')
        break
      case 'ArrowDown':
        e.preventDefault()
        navigateWindows('next')
        break
      case '1':
        setViewMode('free')
        break
      case '2':
        setViewMode('grid')
        break
      case '3':
        setViewMode('list')
        break
      case '4':
        setViewMode('carousel')
        break
      case 'r':
      case 'R':
        openAllWindows()
        break
      case 'Escape':
        if (activeWindowId) {
          closeWindow(activeWindowId)
        }
        break
    }
  }, [viewMode, navigateCarousel, navigateWindows, setViewMode, openAllWindows, activeWindowId, closeWindow])

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [handleKeyDown])

  // Touch/swipe handling for carousel
  const touchStartX = useRef<number | null>(null)

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0]?.clientX ?? null
  }

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null) return

    const touchEndX = e.changedTouches[0]?.clientX ?? 0
    const diff = touchStartX.current - touchEndX

    if (Math.abs(diff) > 50) {
      if (viewMode === 'carousel') {
        navigateCarousel(diff > 0 ? 'next' : 'prev')
      }
    }

    touchStartX.current = null
  }

  return (
    <div className="relative w-full">
      {/* Canvas container - aligned left, overflows right */}
      <div
        ref={canvasRef}
        className="relative overflow-hidden"
        style={{
          width: CANVAS_WIDTH,
          height: CANVAS_HEIGHT,
          maxWidth: 'none'
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

        {/* Controls - positioned at top left */}
        <div className="absolute top-4 left-4 z-50">
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
                <kbd className="text-primary">1-4</kbd> modes
                <span className="mx-2">·</span>
                <kbd className="text-primary">←→</kbd> navigate
                <span className="mx-2">·</span>
                <kbd className="text-primary">R</kbd> reset
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

        {/* Windows */}
        <AnimatePresence>
          {windows.map((window) => (
            <ImageWindow
              key={window.id}
              id={window.id}
              image={window.image}
              x={window.x}
              y={window.y}
              zIndex={window.zIndex}
              isActive={activeWindowId === window.id}
              isOpen={window.isOpen}
              viewMode={viewMode}
              canvasWidth={CANVAS_WIDTH}
              canvasHeight={CANVAS_HEIGHT}
              onClose={() => closeWindow(window.id)}
              onFocus={() => bringToFront(window.id)}
              onDragEnd={(x, y) => updatePosition(window.id, x, y)}
              dragConstraints={canvasRef}
            />
          ))}
        </AnimatePresence>

        {/* Empty state */}
        {openWindowsCount === 0 && (
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
      </div>
    </div>
  )
}
