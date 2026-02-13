'use client'

import { useState, useCallback, useMemo } from 'react'
import type { ProjectImage } from '@/content/types'

export type ViewMode = 'grid' | 'free' | 'showcase'

export interface WindowState {
  id: string
  image: ProjectImage
  x: number
  y: number
  zIndex: number
  isOpen: boolean
}

export interface CanvasDimensions {
  width: number
  height: number
}

interface UseWindowManagerProps {
  images: ProjectImage[]
  containerWidth: number
  containerHeight: number
}

interface UseWindowManagerReturn {
  windows: WindowState[]
  viewMode: ViewMode
  activeWindowId: string | null
  showcaseIndex: number
  showcasePaused: boolean
  canvasDimensions: CanvasDimensions
  setViewMode: (mode: ViewMode) => void
  bringToFront: (id: string) => void
  closeWindow: (id: string) => void
  openAllWindows: () => void
  updatePosition: (id: string, x: number, y: number) => void
  setActiveWindow: (id: string | null) => void
  navigateShowcase: (direction: 'prev' | 'next') => void
  setShowcaseIndex: (index: number) => void
  setShowcasePaused: (paused: boolean) => void
}

const CONTROLS_HEIGHT = 56
const PADDING = 16

// Generate scattered positions for free mode, centered horizontally, scattered vertically
function calculateFreePositions(
  count: number,
  canvasWidth: number,
  canvasHeight: number
): { x: number; y: number }[] {
  const positions: { x: number; y: number }[] = []
  const windowW = 320
  const windowH = 280
  // Center horizontally
  const centerX = (canvasWidth - windowW) / 2
  // Vertical scatter range
  const usableTop = CONTROLS_HEIGHT + PADDING
  const usableBottom = canvasHeight - windowH - PADDING
  const spreadY = Math.max(0, usableBottom - usableTop)

  for (let i = 0; i < count; i++) {
    // Small horizontal offset for visual variety, but stays centered
    const seedX = ((i * 7 + 3) % 11) / 11 - 0.5 // range [-0.5, 0.5]
    const offsetX = seedX * Math.min(60, canvasWidth * 0.05) // max ~60px drift from center
    const x = Math.max(PADDING, Math.min(canvasWidth - windowW - PADDING, centerX + offsetX))

    // Vertical scatter across usable area
    const seedY = ((i * 13 + 5) % 11) / 11
    const y = usableTop + seedY * spreadY
    positions.push({ x, y })
  }

  return positions
}

function calculateCanvasHeight(
  mode: ViewMode,
  imageCount: number,
  containerWidth: number,
  baseHeight: number
): number {
  switch (mode) {
    case 'grid': {
      // Grid auto-sizes based on content, but we set a reasonable minimum
      const cols = containerWidth >= 1024 ? 3 : containerWidth >= 640 ? 2 : 1
      const rows = Math.ceil(imageCount / cols)
      const cellHeight = containerWidth >= 640 ? 300 : 250
      return Math.max(baseHeight, rows * cellHeight + CONTROLS_HEIGHT + PADDING * 3)
    }
    case 'free': {
      const minFreeHeight = 900
      return Math.max(baseHeight, minFreeHeight)
    }
    case 'showcase':
      return Math.max(baseHeight, 900)
    default:
      return baseHeight
  }
}

export function useWindowManager({
  images,
  containerWidth,
  containerHeight
}: UseWindowManagerProps): UseWindowManagerReturn {
  const [viewMode, setViewModeState] = useState<ViewMode>('grid')
  const [maxZIndex, setMaxZIndex] = useState(images.length)
  const [activeWindowId, setActiveWindow] = useState<string | null>(null)
  const [showcaseIndex, setShowcaseIndex] = useState(0)
  const [showcasePaused, setShowcasePaused] = useState(false)

  const canvasDimensions = useMemo<CanvasDimensions>(() => ({
    width: containerWidth,
    height: calculateCanvasHeight(viewMode, images.length, containerWidth, containerHeight)
  }), [viewMode, images.length, containerWidth, containerHeight])

  const freePositions = useMemo(
    () => calculateFreePositions(images.length, containerWidth, canvasDimensions.height),
    [images.length, containerWidth, canvasDimensions.height]
  )

  const [windows, setWindows] = useState<WindowState[]>(() =>
    images.map((image, index) => ({
      id: `window-${index}`,
      image,
      x: freePositions[index]?.x ?? 0,
      y: freePositions[index]?.y ?? 0,
      zIndex: index + 1,
      isOpen: true
    }))
  )

  const bringToFront = useCallback((id: string) => {
    setMaxZIndex(prev => {
      const next = prev + 1
      setWindows(ws => ws.map(w => w.id === id ? { ...w, zIndex: next } : w))
      return next
    })
    setActiveWindow(id)
  }, [])

  const closeWindow = useCallback((id: string) => {
    setWindows(prev => prev.map(w => w.id === id ? { ...w, isOpen: false } : w))
    setActiveWindow(prev => prev === id ? null : prev)
  }, [])

  const updatePosition = useCallback((id: string, x: number, y: number) => {
    setWindows(prev => prev.map(w => w.id === id ? { ...w, x, y } : w))
  }, [])

  const openAllWindows = useCallback(() => {
    const positions = calculateFreePositions(images.length, containerWidth, canvasDimensions.height)
    setWindows(prev => prev.map((w, i) => ({
      ...w,
      x: positions[i]?.x ?? 0,
      y: positions[i]?.y ?? 0,
      isOpen: true,
      zIndex: i + 1
    })))
    setMaxZIndex(images.length)
  }, [images.length, containerWidth, canvasDimensions.height])

  const handleViewModeChange = useCallback((mode: ViewMode) => {
    setViewModeState(mode)
    if (mode === 'showcase') {
      setShowcaseIndex(0)
      setShowcasePaused(false)
    }
    if (mode === 'free') {
      const h = calculateCanvasHeight(mode, images.length, containerWidth, containerHeight)
      const positions = calculateFreePositions(images.length, containerWidth, h)
      setWindows(prev => prev.map((w, i) => ({
        ...w,
        x: positions[i]?.x ?? 0,
        y: positions[i]?.y ?? 0,
        isOpen: true,
        zIndex: i + 1
      })))
      setMaxZIndex(images.length)
    }
    // Grid and showcase don't need positional state - they use CSS layout
    if (mode === 'grid') {
      setWindows(prev => prev.map((w, i) => ({ ...w, isOpen: true, zIndex: i + 1 })))
    }
  }, [images.length, containerWidth, containerHeight])

  const navigateShowcase = useCallback((direction: 'prev' | 'next') => {
    if (images.length === 0) return
    setShowcasePaused(true)
    setShowcaseIndex(prev =>
      direction === 'next'
        ? (prev + 1) % images.length
        : (prev - 1 + images.length) % images.length
    )
  }, [images.length])

  return {
    windows,
    viewMode,
    activeWindowId,
    canvasDimensions,
    showcaseIndex,
    showcasePaused,
    setViewMode: handleViewModeChange,
    bringToFront,
    closeWindow,
    openAllWindows,
    updatePosition,
    setActiveWindow,
    navigateShowcase,
    setShowcaseIndex,
    setShowcasePaused
  }
}
