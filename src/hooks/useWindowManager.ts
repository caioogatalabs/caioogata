'use client'

import { useState, useCallback, useMemo } from 'react'
import type { ProjectImage } from '@/content/types'

export type ViewMode = 'free' | 'grid' | 'list' | 'carousel' | 'cascade'

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
  baseCanvasWidth: number
  baseCanvasHeight: number
}

interface UseWindowManagerReturn {
  windows: WindowState[]
  viewMode: ViewMode
  activeWindowId: string | null
  carouselIndex: number
  canvasDimensions: CanvasDimensions
  setViewMode: (mode: ViewMode) => void
  bringToFront: (id: string) => void
  closeWindow: (id: string) => void
  openAllWindows: () => void
  updatePosition: (id: string, x: number, y: number) => void
  setActiveWindow: (id: string | null) => void
  navigateCarousel: (direction: 'prev' | 'next') => void
  setCarouselIndex: (index: number) => void
  navigateWindows: (direction: 'prev' | 'next') => void
}

const WINDOW_WIDTH = 320
const WINDOW_HEIGHT = 240
const WINDOW_HEADER_HEIGHT = 32
const GAP = 16

function generateInitialPositions(
  count: number,
  canvasWidth: number,
  canvasHeight: number
): { x: number; y: number }[] {
  const positions: { x: number; y: number }[] = []
  const maxX = canvasWidth - WINDOW_WIDTH - 20
  const maxY = canvasHeight - WINDOW_HEIGHT - WINDOW_HEADER_HEIGHT - 20

  for (let i = 0; i < count; i++) {
    const offsetX = (i % 4) * 60 + 20
    const offsetY = Math.floor(i / 4) * 50 + 20
    positions.push({
      x: Math.min(offsetX + (i * 30) % 200, maxX),
      y: Math.min(offsetY + (i * 25) % 150, maxY)
    })
  }

  return positions
}

function calculateGridPositions(
  count: number,
  canvasWidth: number
): { x: number; y: number }[] {
  const positions: { x: number; y: number }[] = []
  const columns = Math.max(1, Math.floor(canvasWidth / (WINDOW_WIDTH + GAP)))

  for (let i = 0; i < count; i++) {
    const col = i % columns
    const row = Math.floor(i / columns)
    positions.push({
      x: col * (WINDOW_WIDTH + GAP) + GAP,
      y: row * (WINDOW_HEIGHT + WINDOW_HEADER_HEIGHT + GAP) + GAP + 60 // +60 for controls
    })
  }

  return positions
}

function calculateListPositions(
  count: number,
  canvasWidth: number
): { x: number; y: number }[] {
  const positions: { x: number; y: number }[] = []
  const centerX = Math.max(GAP, (canvasWidth - WINDOW_WIDTH) / 2)

  for (let i = 0; i < count; i++) {
    positions.push({
      x: centerX,
      y: i * (WINDOW_HEIGHT + WINDOW_HEADER_HEIGHT + GAP) + GAP + 60 // +60 for controls
    })
  }

  return positions
}

function calculateCarouselPositions(
  count: number,
  canvasHeight: number
): { x: number; y: number }[] {
  const positions: { x: number; y: number }[] = []
  const centerY = Math.max(60, (canvasHeight - WINDOW_HEIGHT - WINDOW_HEADER_HEIGHT) / 2)
  const spacing = WINDOW_WIDTH + GAP

  for (let i = 0; i < count; i++) {
    positions.push({
      x: GAP + i * spacing,
      y: centerY
    })
  }

  return positions
}

const CASCADE_OFFSET = 28 // Just enough to show the header

function calculateCascadePositions(
  count: number
): { x: number; y: number }[] {
  const positions: { x: number; y: number }[] = []
  const startX = GAP
  const startY = 60 // Below controls

  for (let i = 0; i < count; i++) {
    positions.push({
      x: startX + i * CASCADE_OFFSET,
      y: startY + i * CASCADE_OFFSET
    })
  }

  return positions
}

function calculateCanvasDimensions(
  mode: ViewMode,
  count: number,
  baseWidth: number,
  baseHeight: number
): CanvasDimensions {
  const windowTotalHeight = WINDOW_HEIGHT + WINDOW_HEADER_HEIGHT + GAP
  const windowTotalWidth = WINDOW_WIDTH + GAP
  const controlsHeight = 60

  switch (mode) {
    case 'free':
      return { width: baseWidth, height: baseHeight }

    case 'grid': {
      const columns = Math.max(1, Math.floor(baseWidth / windowTotalWidth))
      const rows = Math.ceil(count / columns)
      const height = Math.max(baseHeight, rows * windowTotalHeight + controlsHeight + GAP)
      return { width: baseWidth, height }
    }

    case 'list': {
      const height = Math.max(baseHeight, count * windowTotalHeight + controlsHeight + GAP)
      return { width: baseWidth, height }
    }

    case 'carousel': {
      const width = Math.max(baseWidth, count * windowTotalWidth + GAP * 2)
      return { width, height: baseHeight }
    }

    case 'cascade': {
      // Cascade expands diagonally, need space for all windows stacked
      const cascadeWidth = WINDOW_WIDTH + (count - 1) * CASCADE_OFFSET + GAP * 2
      const cascadeHeight = WINDOW_HEIGHT + WINDOW_HEADER_HEIGHT + (count - 1) * CASCADE_OFFSET + controlsHeight + GAP
      return {
        width: Math.max(baseWidth, cascadeWidth),
        height: Math.max(baseHeight, cascadeHeight)
      }
    }

    default:
      return { width: baseWidth, height: baseHeight }
  }
}

export function useWindowManager({
  images,
  baseCanvasWidth,
  baseCanvasHeight
}: UseWindowManagerProps): UseWindowManagerReturn {
  const [viewMode, setViewModeState] = useState<ViewMode>('free')
  const [maxZIndex, setMaxZIndex] = useState(images.length)
  const [activeWindowId, setActiveWindow] = useState<string | null>(null)
  const [carouselIndex, setCarouselIndex] = useState(0)

  const canvasDimensions = useMemo(
    () => calculateCanvasDimensions(viewMode, images.length, baseCanvasWidth, baseCanvasHeight),
    [viewMode, images.length, baseCanvasWidth, baseCanvasHeight]
  )

  const initialPositions = useMemo(
    () => generateInitialPositions(images.length, baseCanvasWidth, baseCanvasHeight),
    [images.length, baseCanvasWidth, baseCanvasHeight]
  )

  const [windows, setWindows] = useState<WindowState[]>(() =>
    images.map((image, index) => ({
      id: `window-${index}`,
      image,
      x: initialPositions[index]?.x ?? 0,
      y: initialPositions[index]?.y ?? 0,
      zIndex: index + 1,
      isOpen: true
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

  const openAllWindows = useCallback(() => {
    setWindows(prev =>
      prev.map((w, index) => ({
        ...w,
        isOpen: true,
        x: initialPositions[index]?.x ?? 0,
        y: initialPositions[index]?.y ?? 0,
        zIndex: index + 1
      }))
    )
    setMaxZIndex(images.length)
    setViewModeState('free')
  }, [initialPositions, images.length])

  const updatePosition = useCallback((id: string, x: number, y: number) => {
    if (viewMode !== 'free') return
    setWindows(prev =>
      prev.map(w =>
        w.id === id ? { ...w, x, y } : w
      )
    )
  }, [viewMode])

  const handleViewModeChange = useCallback((mode: ViewMode) => {
    setViewModeState(mode)

    const dims = calculateCanvasDimensions(mode, images.length, baseCanvasWidth, baseCanvasHeight)
    let newPositions: { x: number; y: number }[]

    switch (mode) {
      case 'free':
        newPositions = initialPositions
        break
      case 'grid':
        newPositions = calculateGridPositions(images.length, dims.width)
        break
      case 'list':
        newPositions = calculateListPositions(images.length, dims.width)
        break
      case 'carousel':
        newPositions = calculateCarouselPositions(images.length, dims.height)
        break
      case 'cascade':
        newPositions = calculateCascadePositions(images.length)
        break
      default:
        newPositions = initialPositions
    }

    setWindows(prev =>
      prev.map((w, index) => ({
        ...w,
        x: newPositions[index]?.x ?? 0,
        y: newPositions[index]?.y ?? 0,
        isOpen: true
      }))
    )
  }, [images.length, baseCanvasWidth, baseCanvasHeight, initialPositions])

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

  const navigateWindows = useCallback((direction: 'prev' | 'next') => {
    const openWindows = windows.filter(w => w.isOpen)
    if (openWindows.length === 0) return

    const currentIndex = activeWindowId
      ? openWindows.findIndex(w => w.id === activeWindowId)
      : -1

    let newIndex: number
    if (direction === 'next') {
      newIndex = currentIndex < openWindows.length - 1 ? currentIndex + 1 : 0
    } else {
      newIndex = currentIndex > 0 ? currentIndex - 1 : openWindows.length - 1
    }

    const newActiveId = openWindows[newIndex]?.id
    if (newActiveId) {
      bringToFront(newActiveId)
    }
  }, [windows, activeWindowId, bringToFront])

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
    navigateWindows
  }
}
