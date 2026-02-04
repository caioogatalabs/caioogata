'use client'

import { useRef, useEffect, useCallback } from 'react'
import { AnimatePresence, motion } from 'motion/react'
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
  }
  onExit?: () => void
}

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
    setViewMode,
    bringToFront,
    closeWindow,
    openAllWindows,
    updatePosition,
    navigateCarousel,
    navigateWindows,
    navigateStack
  } = useWindowManager({
    images,
    baseCanvasWidth: BASE_CANVAS_WIDTH,
    baseCanvasHeight: BASE_CANVAS_HEIGHT
  })

  const openWindowsCount = windows.filter(w => w.isOpen).length

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (!canvasRef.current?.contains(document.activeElement) && document.activeElement !== canvasRef.current) {
      return
    }

    switch (e.key) {
      case 'ArrowUp':
        e.preventDefault()
        if (viewMode === 'carousel') {
          navigateCarousel('prev')
        } else if (viewMode === 'list') {
          navigateStack('prev')
        } else {
          navigateWindows('prev')
        }
        break
      case 'ArrowDown':
        e.preventDefault()
        if (viewMode === 'carousel') {
          navigateCarousel('next')
        } else if (viewMode === 'list') {
          navigateStack('next')
        } else {
          navigateWindows('next')
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
  }, [viewMode, navigateCarousel, navigateWindows, navigateStack, setViewMode, openAllWindows, onExit, setIsCanvasActive])

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
      if (viewMode === 'carousel') {
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
                <kbd className="text-primary">1-5</kbd> modes
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

        {/* Windows */}
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
      </motion.div>
    </div>
  )
}
