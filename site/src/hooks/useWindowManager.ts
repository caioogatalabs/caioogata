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

// Generate stacked positions for free mode — all centered horizontally, cascaded vertically
function calculateFreePositions(
  count: number,
  canvasWidth: number,
  _canvasHeight: number
): { x: number; y: number }[] {
  const positions: { x: number; y: number }[] = []
  const windowW = 560 // 16:9 video width
  const usableTop = CONTROLS_HEIGHT + PADDING
  const cascadeStepY = 40 // vertical offset between each stacked window

  // All windows share the same centered X
  const centerX = Math.max(PADDING, (canvasWidth - windowW) / 2)

  for (let i = 0; i < count; i++) {
    const y = usableTop + i * cascadeStepY
    positions.push({ x: centerX, y })
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
      // Auto-pause if first item is a video so it can play through
      setShowcasePaused(images[0]?.type === 'video')
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
