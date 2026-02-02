'use client'

import { useState, useCallback, useMemo } from 'react'
import type { ProjectImage } from '@/content/types'

export type ViewMode = 'free' | 'grid' | 'list' | 'carousel'

export interface WindowState {
  id: string
  image: ProjectImage
  x: number
  y: number
  zIndex: number
  isOpen: boolean
}

interface UseWindowManagerProps {
  images: ProjectImage[]
  canvasWidth: number
  canvasHeight: number
}

interface UseWindowManagerReturn {
  windows: WindowState[]
  viewMode: ViewMode
  activeWindowId: string | null
  carouselIndex: number
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
  canvasWidth: number,
  canvasHeight: number
): { x: number; y: number }[] {
  const positions: { x: number; y: number }[] = []
  const gap = 16
  const columns = Math.floor(canvasWidth / (WINDOW_WIDTH + gap))

  for (let i = 0; i < count; i++) {
    const col = i % columns
    const row = Math.floor(i / columns)
    positions.push({
      x: col * (WINDOW_WIDTH + gap) + gap,
      y: row * (WINDOW_HEIGHT + WINDOW_HEADER_HEIGHT + gap) + gap
    })
  }

  return positions
}

function calculateListPositions(
  count: number,
  canvasWidth: number
): { x: number; y: number }[] {
  const positions: { x: number; y: number }[] = []
  const gap = 12
  const centerX = (canvasWidth - WINDOW_WIDTH) / 2

  for (let i = 0; i < count; i++) {
    positions.push({
      x: centerX,
      y: i * (WINDOW_HEIGHT + WINDOW_HEADER_HEIGHT + gap) + gap
    })
  }

  return positions
}

function calculateCarouselPositions(
  count: number,
  activeIndex: number,
  canvasWidth: number,
  canvasHeight: number
): { x: number; y: number }[] {
  const positions: { x: number; y: number }[] = []
  const centerX = (canvasWidth - WINDOW_WIDTH) / 2
  const centerY = (canvasHeight - WINDOW_HEIGHT - WINDOW_HEADER_HEIGHT) / 2
  const spacing = WINDOW_WIDTH + 40

  for (let i = 0; i < count; i++) {
    const offset = i - activeIndex
    positions.push({
      x: centerX + offset * spacing,
      y: centerY
    })
  }

  return positions
}

export function useWindowManager({
  images,
  canvasWidth,
  canvasHeight
}: UseWindowManagerProps): UseWindowManagerReturn {
  const [viewMode, setViewMode] = useState<ViewMode>('free')
  const [maxZIndex, setMaxZIndex] = useState(images.length)
  const [activeWindowId, setActiveWindow] = useState<string | null>(null)
  const [carouselIndex, setCarouselIndex] = useState(0)

  const initialPositions = useMemo(
    () => generateInitialPositions(images.length, canvasWidth, canvasHeight),
    [images.length, canvasWidth, canvasHeight]
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
    setViewMode(mode)

    let newPositions: { x: number; y: number }[]

    switch (mode) {
      case 'free':
        newPositions = initialPositions
        break
      case 'grid':
        newPositions = calculateGridPositions(images.length, canvasWidth, canvasHeight)
        break
      case 'list':
        newPositions = calculateListPositions(images.length, canvasWidth)
        break
      case 'carousel':
        newPositions = calculateCarouselPositions(images.length, carouselIndex, canvasWidth, canvasHeight)
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
  }, [images.length, canvasWidth, canvasHeight, initialPositions, carouselIndex])

  const navigateCarousel = useCallback((direction: 'prev' | 'next') => {
    const openWindows = windows.filter(w => w.isOpen)
    if (openWindows.length === 0) return

    setCarouselIndex(prev => {
      const newIndex = direction === 'next'
        ? (prev + 1) % openWindows.length
        : (prev - 1 + openWindows.length) % openWindows.length

      if (viewMode === 'carousel') {
        const newPositions = calculateCarouselPositions(
          openWindows.length,
          newIndex,
          canvasWidth,
          canvasHeight
        )
        setWindows(prevWindows =>
          prevWindows.map((w, index) => ({
            ...w,
            x: newPositions[index]?.x ?? 0,
            y: newPositions[index]?.y ?? 0
          }))
        )
      }

      return newIndex
    })
  }, [windows, viewMode, canvasWidth, canvasHeight])

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
