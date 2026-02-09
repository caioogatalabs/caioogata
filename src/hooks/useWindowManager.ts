'use client'

import { useState, useCallback, useMemo } from 'react'
import type { ProjectImage } from '@/content/types'

export type ViewMode = 'free' | 'grid' | 'list' | 'carousel' | 'cascade' | 'showcase'

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
  stackIndex: number
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
  navigateWindows: (direction: 'prev' | 'next') => void
  navigateStack: (direction: 'prev' | 'next') => void
  navigateShowcase: (direction: 'prev' | 'next') => void
  setShowcasePaused: (paused: boolean) => void
}

const WINDOW_WIDTH = 320
const WINDOW_HEADER_HEIGHT = 32
const GAP = 16

// Reserved height for the top controls area (ViewModeControls + nav hints)
export const CONTROLS_RESERVED_HEIGHT = 60

// Actual maximum rendered window dimensions (must match ImageWindow.tsx)
// ImageWindow scales images up to 450px height + 28px header
const MAX_IMAGE_HEIGHT = 450
const ACTUAL_HEADER_HEIGHT = 28
const MAX_WINDOW_TOTAL_HEIGHT = MAX_IMAGE_HEIGHT + ACTUAL_HEADER_HEIGHT // 478

// Minimized window dimensions for grid mode
const MIN_WINDOW_WIDTH = 180
const MIN_WINDOW_HEIGHT = 120

function generateInitialPositions(
  count: number,
  canvasWidth: number,
  canvasHeight: number
): { x: number; y: number }[] {
  const positions: { x: number; y: number }[] = []
  const maxX = canvasWidth - WINDOW_WIDTH - 20
  const maxY = canvasHeight - MAX_WINDOW_TOTAL_HEIGHT - 20

  for (let i = 0; i < count; i++) {
    const offsetX = (i % 4) * 60 + 20
    const offsetY = Math.floor(i / 4) * 50 + CONTROLS_RESERVED_HEIGHT
    positions.push({
      x: Math.min(offsetX + (i * 30) % 200, maxX),
      y: Math.min(offsetY + (i * 25) % 150, Math.max(CONTROLS_RESERVED_HEIGHT, maxY))
    })
  }

  return positions
}

function calculateGridPositions(
  count: number,
  canvasWidth: number
): { x: number; y: number }[] {
  const positions: { x: number; y: number }[] = []
  // Use minimized window size for grid layout
  const cellWidth = MIN_WINDOW_WIDTH + GAP
  const cellHeight = MIN_WINDOW_HEIGHT + WINDOW_HEADER_HEIGHT + GAP
  const columns = Math.max(1, Math.floor((canvasWidth - GAP) / cellWidth))

  for (let i = 0; i < count; i++) {
    const col = i % columns
    const row = Math.floor(i / columns)
    positions.push({
      x: col * cellWidth + GAP,
      y: row * cellHeight + GAP + 60 // +60 for controls
    })
  }

  return positions
}

// Stack mode: 3D perspective carousel (rotateX) with visible headers
const STACK_HEADER_OFFSET = 36 // Height to show each header

function calculateStackRotateX(positionInStack: number): number {
  // Front image (position 0) is flat
  if (positionInStack === 0) return 0
  // Images behind have increasing negative rotateX (tilted back)
  // Diminishing returns for depth effect
  return -15 - (positionInStack - 1) * 5 // -15°, -20°, -25°, etc.
}

function calculateListPositions(
  count: number,
  canvasWidth: number,
  _canvasHeight: number,
  stackIndex: number = 0
): { x: number; y: number }[] {
  const positions: { x: number; y: number }[] = []
  const centerX = Math.max(GAP, (canvasWidth - WINDOW_WIDTH) / 2)
  const baseY = 80 // Start position for the front card

  for (let i = 0; i < count; i++) {
    // Calculate position in stack relative to current front
    const positionInStack = (i - stackIndex + count) % count

    positions.push({
      x: centerX,
      // Front card at baseY, cards behind stack upward showing headers
      y: baseY + positionInStack * STACK_HEADER_OFFSET
    })
  }

  return positions
}

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
  const controlsHeight = 60
  // Use minimized dimensions for grid
  const gridCellWidth = MIN_WINDOW_WIDTH + GAP
  const gridCellHeight = MIN_WINDOW_HEIGHT + WINDOW_HEADER_HEIGHT + GAP

  switch (mode) {
    case 'free': {
      // Free positions are constrained to maxY = baseHeight - MAX_WINDOW_TOTAL_HEIGHT - 20
      // Canvas needs: maxY + MAX_WINDOW_TOTAL_HEIGHT + padding
      const freeHeight = MAX_WINDOW_TOTAL_HEIGHT + controlsHeight + GAP * 2
      return { width: baseWidth, height: Math.max(baseHeight, freeHeight) }
    }

    case 'grid': {
      // Grid with minimized windows - fixed width, expand height only
      const columns = Math.max(1, Math.floor((baseWidth - GAP) / gridCellWidth))
      const rows = Math.ceil(count / columns)
      const height = Math.max(baseHeight, rows * gridCellHeight + controlsHeight + GAP)
      return { width: baseWidth, height }
    }

    case 'list': {
      // Stack mode: height for one full window + headers for others
      const stackHeight = MAX_WINDOW_TOTAL_HEIGHT + (count - 1) * STACK_HEADER_OFFSET + controlsHeight + GAP * 2
      return { width: baseWidth, height: Math.max(baseHeight, stackHeight) }
    }

    case 'carousel': {
      // Centered window needs enough height
      const carouselHeight = MAX_WINDOW_TOTAL_HEIGHT + controlsHeight + GAP * 2
      return { width: baseWidth, height: Math.max(baseHeight, carouselHeight) }
    }

    case 'cascade': {
      // Last window at y = 60 + (count-1)*CASCADE_OFFSET, plus full window height
      const cascadeHeight = MAX_WINDOW_TOTAL_HEIGHT + (count - 1) * CASCADE_OFFSET + controlsHeight + GAP
      return {
        width: baseWidth,
        height: Math.max(baseHeight, cascadeHeight)
      }
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
  const [viewMode, setViewModeState] = useState<ViewMode>('cascade')
  const [maxZIndex, setMaxZIndex] = useState(images.length)
  const [activeWindowId, setActiveWindow] = useState<string | null>(null)
  const [carouselIndex, setCarouselIndex] = useState(0)
  const [stackIndex, setStackIndex] = useState(0)
  const [showcaseIndex, setShowcaseIndex] = useState(0)
  const [showcasePaused, setShowcasePaused] = useState(false)

  const canvasDimensions = useMemo(
    () => calculateCanvasDimensions(viewMode, images.length, baseCanvasWidth, baseCanvasHeight),
    [viewMode, images.length, baseCanvasWidth, baseCanvasHeight]
  )

  const initialPositions = useMemo(
    () => generateInitialPositions(images.length, baseCanvasWidth, baseCanvasHeight),
    [images.length, baseCanvasWidth, baseCanvasHeight]
  )

  // Initial positions use cascade since that's the default viewMode
  const cascadeInitialPositions = useMemo(
    () => calculateCascadePositions(images.length),
    [images.length]
  )

  const [windows, setWindows] = useState<WindowState[]>(() =>
    images.map((image, index) => ({
      id: `window-${index}`,
      image,
      x: cascadeInitialPositions[index]?.x ?? 0,
      y: cascadeInitialPositions[index]?.y ?? 0,
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

  const openAllWindows = useCallback(() => {
    setWindows(prev =>
      prev.map((w, index) => ({
        ...w,
        isOpen: true,
        x: initialPositions[index]?.x ?? 0,
        y: initialPositions[index]?.y ?? 0,
        zIndex: index + 1,
        rotation: 0
      }))
    )
    setMaxZIndex(images.length)
    setViewModeState('free')
  }, [initialPositions, images.length])

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
      case 'free':
        newPositions = initialPositions
        break
      case 'grid':
        newPositions = calculateGridPositions(images.length, dims.width)
        break
      case 'list':
        newPositions = calculateListPositions(images.length, dims.width, dims.height, 0)
        break
      case 'carousel':
        newPositions = calculateCarouselPositions(images.length, dims.width, dims.height)
        break
      case 'cascade':
        newPositions = calculateCascadePositions(images.length)
        break
      case 'showcase':
        // Showcase doesn't use window positions — rendered separately
        newPositions = calculateCarouselPositions(images.length, dims.width, dims.height)
        break
      default:
        newPositions = initialPositions
    }

    // Reset indices when entering specific modes
    if (mode === 'list') {
      setStackIndex(0)
    }
    if (mode === 'showcase') {
      setShowcaseIndex(0)
      setShowcasePaused(false)
    }

    setWindows(prev => {
      const count = prev.length
      return prev.map((w, index) => {
        // For list mode (stack), set z-indexes and rotations
        if (mode === 'list') {
          const positionInStack = index
          return {
            ...w,
            x: newPositions[index]?.x ?? 0,
            y: newPositions[index]?.y ?? 0,
            isOpen: true,
            zIndex: count - positionInStack, // First window on top
            rotation: calculateStackRotateX(positionInStack)
          }
        }
        // For other modes, reset rotation and z-index to original order
        return {
          ...w,
          x: newPositions[index]?.x ?? 0,
          y: newPositions[index]?.y ?? 0,
          isOpen: true,
          zIndex: index + 1,
          rotation: 0
        }
      })
    })
    setMaxZIndex(prev => Math.max(prev, images.length))
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

  // Stack navigation: rotate through images like a 3D carousel
  const navigateStack = useCallback((direction: 'prev' | 'next') => {
    const openWindows = windows.filter(w => w.isOpen)
    if (openWindows.length === 0) return

    const openCount = openWindows.length
    const newStackIndex = direction === 'next'
      ? (stackIndex + 1) % openCount
      : (stackIndex - 1 + openCount) % openCount

    setStackIndex(newStackIndex)

    // Recalculate positions for new stack order
    const newPositions = calculateListPositions(
      windows.length,
      canvasDimensions.width,
      canvasDimensions.height,
      newStackIndex
    )

    // Update positions, z-indexes and rotations based on new stack order
    setWindows(prev => {
      return prev.map((w, originalIndex) => {
        if (!w.isOpen) return w

        // Calculate position in stack relative to the new front
        const positionInStack = (originalIndex - newStackIndex + prev.length) % prev.length

        return {
          ...w,
          x: newPositions[originalIndex]?.x ?? w.x,
          y: newPositions[originalIndex]?.y ?? w.y,
          zIndex: openCount - positionInStack, // Front has highest z-index
          rotation: calculateStackRotateX(positionInStack)
        }
      })
    })
  }, [windows, stackIndex, canvasDimensions])

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
    stackIndex,
    canvasDimensions,
    setViewMode: handleViewModeChange,
    bringToFront,
    closeWindow,
    openAllWindows,
    updatePosition,
    setActiveWindow,
    navigateCarousel,
    setCarouselIndex,
    navigateWindows,
    navigateStack,
    showcaseIndex,
    showcasePaused,
    navigateShowcase,
    setShowcasePaused
  }
}
