'use client'

import { useRef, useEffect, useCallback, useState } from 'react'
import { AnimatePresence } from 'motion/react'
import { useWindowManager } from '@/hooks/useWindowManager'
import { useInteractionMode } from '@/hooks/useInteractionMode'
import { useNavigation } from '@/components/providers/NavigationProvider'
import ViewModeControls from './ViewModeControls'
import GridView from './GridView'
import FreeView from './FreeView'
import ShowcaseView from './ShowcaseView'
import type { ProjectImage } from '@/content/types'

interface ProjectCanvasProps {
  images: ProjectImage[]
  viewModeLabels: {
    grid: string
    free: string
    showcase: string
  }
  onExit?: () => void
}

const SHOWCASE_INTERVAL = 5000

export default function ProjectCanvas({ images, viewModeLabels, onExit }: ProjectCanvasProps) {
  const canvasRef = useRef<HTMLDivElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const { mode } = useInteractionMode()
  const { setIsCanvasActive } = useNavigation()

  const [containerWidth, setContainerWidth] = useState<number>(800)

  // Measure container width
  useEffect(() => {
    if (!containerRef.current) return
    let timer: ReturnType<typeof setTimeout>
    const update = () => {
      if (containerRef.current) setContainerWidth(containerRef.current.clientWidth)
    }
    const debounced = () => { clearTimeout(timer); timer = setTimeout(update, 150) }
    update()
    const observer = new ResizeObserver(debounced)
    observer.observe(containerRef.current)
    return () => { clearTimeout(timer); observer.disconnect() }
  }, [])

  const baseHeight = typeof window !== 'undefined' && window.innerWidth < 640 ? 400 : 600

  const {
    windows,
    viewMode,
    activeWindowId,
    canvasDimensions,
    showcaseIndex,
    showcasePaused,
    setViewMode,
    bringToFront,
    closeWindow,
    openAllWindows,
    updatePosition,
    navigateShowcase,
    setShowcaseIndex,
    setShowcasePaused
  } = useWindowManager({
    images,
    containerWidth,
    containerHeight: baseHeight
  })

  // Showcase auto-play (skips videos — they pause the slideshow automatically)
  useEffect(() => {
    if (viewMode !== 'showcase' || showcasePaused || images.length <= 1) return
    // If the current item is a video, pause so the video can play through
    if (images[showcaseIndex]?.type === 'video') {
      setShowcasePaused(true)
      return
    }
    const timer = setInterval(() => {
      navigateShowcase('next')
    }, SHOWCASE_INTERVAL)
    return () => clearInterval(timer)
  }, [viewMode, showcasePaused, showcaseIndex, images, navigateShowcase, setShowcasePaused])

  // Keyboard handling
  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (!canvasRef.current?.contains(document.activeElement) && document.activeElement !== canvasRef.current) return

    switch (e.key) {
      case 'ArrowLeft':
      case 'ArrowUp':
        e.preventDefault()
        if (viewMode === 'showcase') navigateShowcase('prev')
        break
      case 'ArrowRight':
      case 'ArrowDown':
        e.preventDefault()
        if (viewMode === 'showcase') navigateShowcase('next')
        break
      case ' ':
        if (viewMode === 'showcase') {
          e.preventDefault()
          setShowcasePaused(!showcasePaused)
        }
        break
      case '1': setViewMode('grid'); break
      case '2': setViewMode('free'); break
      case '3': setViewMode('showcase'); break
      case 'r':
      case 'R': openAllWindows(); break
      case 'Enter':
      case 'Escape':
        setIsCanvasActive(false)
        onExit?.()
        break
    }
  }, [viewMode, navigateShowcase, showcasePaused, setShowcasePaused, setViewMode, openAllWindows, onExit, setIsCanvasActive])

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [handleKeyDown])

  // Auto-focus and canvas active state
  useEffect(() => {
    canvasRef.current?.focus()
    setIsCanvasActive(true)
    return () => setIsCanvasActive(false)
  }, [setIsCanvasActive])

  const openWindowsCount = windows.filter(w => w.isOpen).length

  return (
    <div ref={containerRef} className="relative w-full">
      <div
        ref={canvasRef}
        className="relative w-full"
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

        {/* Controls */}
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
          <div className="text-xs text-secondary/50 font-mono bg-black/60 px-2 py-1 rounded-sm border border-white/10 whitespace-nowrap">
            {mode === 'keyboard' && (
              <span className="hidden sm:inline">
                <kbd className="text-primary">1-3</kbd> modes
                <span className="mx-2">&middot;</span>
                <kbd className="text-primary">&larr;&rarr;</kbd> navigate
                <span className="mx-2">&middot;</span>
                <kbd className="text-primary">R</kbd> reset
                <span className="mx-2">&middot;</span>
                <kbd className="text-primary">Esc</kbd> exit
              </span>
            )}
            {mode === 'mouse' && (
              <span className="hidden sm:inline">Double-click to maximize</span>
            )}
            {mode === 'touch' && (
              <span>Swipe &middot; Tap</span>
            )}
          </div>
        </div>

        {/* View modes */}
        <AnimatePresence mode="wait">
          {viewMode === 'grid' && (
            <GridView
              key="grid"
              windows={windows}
              activeWindowId={activeWindowId}
              onFocus={bringToFront}
              onClose={closeWindow}
            />
          )}

          {viewMode === 'free' && (
            <FreeView
              key="free"
              windows={windows}
              activeWindowId={activeWindowId}
              canvasWidth={canvasDimensions.width}
              canvasHeight={canvasDimensions.height}
              onFocus={bringToFront}
              onClose={closeWindow}
              onDragEnd={(id, x, y) => updatePosition(id, x, y)}
            />
          )}

          {viewMode === 'showcase' && (
            <ShowcaseView
              key="showcase"
              images={images}
              currentIndex={showcaseIndex}
              isPaused={showcasePaused}
              onNavigate={navigateShowcase}
              onSetIndex={setShowcaseIndex}
              onSetPaused={setShowcasePaused}
            />
          )}
        </AnimatePresence>

        {/* Empty state (grid/free only) */}
        {viewMode !== 'showcase' && openWindowsCount === 0 && (
          <div className="absolute inset-0 flex items-center justify-center px-4 z-40">
            <button
              onClick={openAllWindows}
              className="text-secondary/60 hover:text-primary transition-colors font-mono text-sm bg-black/40 px-4 py-2 rounded border border-white/10 text-center"
            >
              All windows closed. <span className="hidden sm:inline">Press <kbd className="text-primary">R</kbd> or click</span><span className="sm:hidden">Tap</span> to reset.
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
