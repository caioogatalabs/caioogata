'use client'

import { useState, useCallback, useMemo } from 'react'
import type { ProjectImage } from '@/content/types'

export type ViewMode = 'carousel' | 'showcase'

export interface WindowState {
  id: string
  image: ProjectImage
  x: number
  y: number
  zIndex: number
  isOpen: boolean
  rotation: number
}

export interface CanvasDimensions {
  width: number
  height: number
}

interface UseWindowManagerProps {
  images: ProjectImage[]
  baseCanvasWidth: number
  baseCanvasHeight: number
}

interface UseWindowManagerReturn {
  windows: WindowState[]
  viewMode: ViewMode
  activeWindowId: string | null
  carouselIndex: number
  showcaseIndex: number
  showcasePaused: boolean
  canvasDimensions: CanvasDimensions
  setViewMode: (mode: ViewMode) => void
  bringToFront: (id: string) => void
  closeWindow: (id: string) => void
  openAllWindows: () => void
  updatePosition: (id: string, x: number, y: number) => void
  setActiveWindow: (id: string | null) => void
  navigateCarousel: (direction: 'prev' | 'next') => void
  setCarouselIndex: (index: number) => void
  navigateShowcase: (direction: 'prev' | 'next') => void
  setShowcasePaused: (paused: boolean) => void
}

const WINDOW_WIDTH = 320
const GAP = 16

// Reserved height for the top controls area (ViewModeControls + nav hints)
export const CONTROLS_RESERVED_HEIGHT = 60

// Actual maximum rendered window dimensions (must match ImageWindow.tsx)
// ImageWindow scales images up to 450px height + 28px header
const MAX_IMAGE_HEIGHT = 450
const ACTUAL_HEADER_HEIGHT = 28
const MAX_WINDOW_TOTAL_HEIGHT = MAX_IMAGE_HEIGHT + ACTUAL_HEADER_HEIGHT // 478

function calculateCarouselPositions(
  count: number,
  canvasWidth: number,
  canvasHeight: number
): { x: number; y: number }[] {
  const positions: { x: number; y: number }[] = []
  // Center all images using actual rendered height
  const centerX = Math.max(GAP, (canvasWidth - WINDOW_WIDTH) / 2)
  const centerY = Math.max(60, (canvasHeight - MAX_WINDOW_TOTAL_HEIGHT) / 2)

  for (let i = 0; i < count; i++) {
    positions.push({
      x: centerX,
      y: centerY
    })
  }

  return positions
}

function calculateCanvasDimensions(
  mode: ViewMode,
  _count: number,
  baseWidth: number,
  baseHeight: number
): CanvasDimensions {
  const controlsHeight = 60

  switch (mode) {
    case 'carousel': {
      // Centered window needs enough height
      const carouselHeight = MAX_WINDOW_TOTAL_HEIGHT + controlsHeight + GAP * 2
      return { width: baseWidth, height: Math.max(baseHeight, carouselHeight) }
    }

    case 'showcase':
      return { width: baseWidth, height: baseHeight }

    default:
      return { width: baseWidth, height: baseHeight }
  }
}

export function useWindowManager({
  images,
  baseCanvasWidth,
  baseCanvasHeight
}: UseWindowManagerProps): UseWindowManagerReturn {
  const [viewMode, setViewModeState] = useState<ViewMode>('carousel')
  const [maxZIndex, setMaxZIndex] = useState(images.length)
  const [activeWindowId, setActiveWindow] = useState<string | null>(null)
  const [carouselIndex, setCarouselIndex] = useState(0)
  const [showcaseIndex, setShowcaseIndex] = useState(0)
  const [showcasePaused, setShowcasePaused] = useState(false)

  const canvasDimensions = useMemo(
    () => calculateCanvasDimensions(viewMode, images.length, baseCanvasWidth, baseCanvasHeight),
    [viewMode, images.length, baseCanvasWidth, baseCanvasHeight]
  )

  // Initial positions use carousel since that's the default viewMode
  const carouselInitialPositions = useMemo(
    () => calculateCarouselPositions(images.length, baseCanvasWidth, baseCanvasHeight),
    [images.length, baseCanvasWidth, baseCanvasHeight]
  )

  const [windows, setWindows] = useState<WindowState[]>(() =>
    images.map((image, index) => ({
      id: `window-${index}`,
      image,
      x: carouselInitialPositions[index]?.x ?? 0,
      y: carouselInitialPositions[index]?.y ?? 0,
      zIndex: index + 1,
      isOpen: true,
      rotation: 0
    }))
  )

  const bringToFront = useCallback((id: string) => {
    setMaxZIndex(prev => prev + 1)
    setWindows(prev =>
      prev.map(w =>
        w.id === id ? { ...w, zIndex: maxZIndex + 1 } : w
      )
    )
    setActiveWindow(id)
  }, [maxZIndex])

  const closeWindow = useCallback((id: string) => {
    setWindows(prev =>
      prev.map(w =>
        w.id === id ? { ...w, isOpen: false } : w
      )
    )
    if (activeWindowId === id) {
      setActiveWindow(null)
    }
  }, [activeWindowId])

  const updatePosition = useCallback((id: string, x: number, y: number) => {
    const clampedY = Math.max(CONTROLS_RESERVED_HEIGHT, y)
    setWindows(prev =>
      prev.map(w =>
        w.id === id ? { ...w, x, y: clampedY } : w
      )
    )
  }, [])

  const handleViewModeChange = useCallback((mode: ViewMode) => {
    setViewModeState(mode)

    const dims = calculateCanvasDimensions(mode, images.length, baseCanvasWidth, baseCanvasHeight)
    let newPositions: { x: number; y: number }[]

    switch (mode) {
      case 'carousel':
        newPositions = calculateCarouselPositions(images.length, dims.width, dims.height)
        break
      case 'showcase':
        // Showcase doesn't use window positions — rendered separately
        newPositions = calculateCarouselPositions(images.length, dims.width, dims.height)
        break
      default:
        newPositions = calculateCarouselPositions(images.length, dims.width, dims.height)
    }

    if (mode === 'showcase') {
      setShowcaseIndex(0)
      setShowcasePaused(false)
    }

    setWindows(prev => {
      return prev.map((w, index) => ({
        ...w,
        x: newPositions[index]?.x ?? 0,
        y: newPositions[index]?.y ?? 0,
        isOpen: true,
        zIndex: index + 1,
        rotation: 0
      }))
    })
    setMaxZIndex(prev => Math.max(prev, images.length))
  }, [images.length, baseCanvasWidth, baseCanvasHeight])

  const openAllWindows = useCallback(() => {
    handleViewModeChange(viewMode)
  }, [viewMode, handleViewModeChange])

  const navigateCarousel = useCallback((direction: 'prev' | 'next') => {
    const openWindows = windows.filter(w => w.isOpen)
    if (openWindows.length === 0) return

    setCarouselIndex(prev => {
      const newIndex = direction === 'next'
        ? (prev + 1) % openWindows.length
        : (prev - 1 + openWindows.length) % openWindows.length
      return newIndex
    })
  }, [windows])

  const navigateShowcase = useCallback((direction: 'prev' | 'next') => {
    if (images.length === 0) return
    setShowcasePaused(true)
    setShowcaseIndex(prev => {
      return direction === 'next'
        ? (prev + 1) % images.length
        : (prev - 1 + images.length) % images.length
    })
  }, [images.length])

  return {
    windows,
    viewMode,
    activeWindowId,
    carouselIndex,
    canvasDimensions,
    setViewMode: handleViewModeChange,
    bringToFront,
    closeWindow,
    openAllWindows,
    updatePosition,
    setActiveWindow,
    navigateCarousel,
    setCarouselIndex,
    showcaseIndex,
    showcasePaused,
    navigateShowcase,
    setShowcasePaused
  }
}
