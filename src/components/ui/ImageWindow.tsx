'use client'

import { useRef, useState, useEffect, useMemo } from 'react'
import { motion, useDragControls } from 'motion/react'
import Image from 'next/image'
import type { ProjectImage } from '@/content/types'
import { CONTROLS_RESERVED_HEIGHT, type ViewMode } from '@/hooks/useWindowManager'

type WindowSizeState = 'normal' | 'maximized' | 'minimized'

interface ImageWindowProps {
  id: string
  index: number
  image: ProjectImage
  x: number
  y: number
  zIndex: number
  rotation: number
  isActive: boolean
  isOpen: boolean
  viewMode: ViewMode
  canvasWidth: number
  canvasHeight: number
  isInline?: boolean
  onClose: () => void
  onFocus: () => void
  onDragEnd: (x: number, y: number) => void
  dragConstraints: React.RefObject<HTMLDivElement | null>
}

const HEADER_HEIGHT = 28
const MIN_WIDTH = 280
const MIN_HEIGHT = 200


export default function ImageWindow({
  id,
  index,
  image,
  x,
  y,
  zIndex,
  rotation,
  isActive,
  isOpen,
  viewMode,
  canvasWidth,
  canvasHeight,
  isInline = false,
  onClose,
  onFocus,
  onDragEnd,
  dragConstraints
}: ImageWindowProps) {
  const dragControls = useDragControls()
  const windowRef = useRef<HTMLDivElement>(null)
  const [imageError, setImageError] = useState(false)
  const [sizeState, setSizeState] = useState<WindowSizeState>('normal')
  const [naturalDimensions, setNaturalDimensions] = useState<{ width: number; height: number } | null>(null)
  const [previousPosition, setPreviousPosition] = useState({ x, y })

  // Load natural image dimensions once per image src
  useEffect(() => {
    const img = new window.Image()
    img.onload = () => {
      setNaturalDimensions({ width: img.width, height: img.height })
    }
    img.onerror = () => setImageError(true)
    img.src = decodeURIComponent(image.src)
  }, [image.src])

  // Compute constrained dimensions from natural size only (stable across resize)
  const imageDimensions = useMemo(() => {
    if (!naturalDimensions) return { width: MIN_WIDTH, height: MIN_HEIGHT }

    const maxWidth = 600
    const maxHeight = 450

    let width = naturalDimensions.width
    let height = naturalDimensions.height

    if (width > maxWidth) {
      height = (maxWidth / width) * height
      width = maxWidth
    }
    if (height > maxHeight) {
      width = (maxHeight / height) * width
      height = maxHeight
    }

    return {
      width: Math.max(MIN_WIDTH, width),
      height: Math.max(MIN_HEIGHT, height)
    }
  }, [naturalDimensions])

  if (!isOpen) return null

  const isDraggable = sizeState !== 'maximized' && !isInline

  const handleMaximize = () => {
    if (sizeState === 'maximized') {
      setSizeState('normal')
    } else {
      setPreviousPosition({ x, y })
      setSizeState('maximized')
    }
  }

  const handleMinimize = () => {
    if (sizeState === 'minimized') {
      setSizeState('normal')
    } else {
      setSizeState('minimized')
    }
  }

  // Calculate dimensions based on state and view mode
  const getWindowDimensions = () => {
    if (sizeState === 'maximized') {
      return { width: canvasWidth - 20, height: canvasHeight - CONTROLS_RESERVED_HEIGHT - 10 }
    }
    if (sizeState === 'minimized') {
      return { width: MIN_WIDTH, height: MIN_HEIGHT }
    }
    return imageDimensions
  }

  const getWindowPosition = () => {
    if (sizeState === 'maximized') {
      return { x: 10, y: CONTROLS_RESERVED_HEIGHT }
    }
    return { x, y }
  }

  const dimensions = getWindowDimensions()
  const position = getWindowPosition()

  return (
    <motion.div
      ref={windowRef}
      data-window-id={id}
      className={`${isInline ? 'relative shrink-0' : 'absolute'} select-none ${isActive ? 'ring-1 ring-neutral-700' : ''}`}
      style={{
        zIndex: isInline ? undefined : zIndex,
        transformStyle: 'preserve-3d',
        transformOrigin: 'center top'
      }}
      initial={{ opacity: 0, scale: 0.9, ...(isInline ? {} : { y: position.y - 20 }), rotateX: 0 }}
      animate={{
        opacity: 1,
        scale: 1,
        ...(isInline ? {} : { x: position.x, y: position.y }),
        width: dimensions.width,
        height: dimensions.height + HEADER_HEIGHT,
        rotateX: rotation
      }}
      exit={{ opacity: 0, scale: 0.95, rotateX: 0 }}
      transition={{
        type: 'spring',
        stiffness: 500,
        damping: 30,
        delay: index * 0.03,
        // x/y: no delay so drag-end doesn't snap
        x: { type: 'spring', stiffness: 500, damping: 30 },
        y: { type: 'spring', stiffness: 500, damping: 30 }
      }}
      drag={isDraggable}
      dragControls={dragControls}
      dragMomentum={false}
      dragConstraints={dragConstraints}
      dragElastic={0}
      onDragEnd={() => {
        if (isDraggable && windowRef.current && dragConstraints.current) {
          const canvasRect = dragConstraints.current.getBoundingClientRect()
          const windowRect = windowRef.current.getBoundingClientRect()
          const scrollTop = dragConstraints.current.scrollTop || 0
          const scrollLeft = dragConstraints.current.scrollLeft || 0
          onDragEnd(
            windowRect.left - canvasRect.left + scrollLeft,
            windowRect.top - canvasRect.top + scrollTop
          )
        }
      }}
      onPointerDown={onFocus}
      tabIndex={0}
      onFocus={onFocus}
      onKeyDown={(e) => {
        if (e.key === 'Escape' || e.key === 'q') {
          onClose()
        }
      }}
      role="dialog"
      aria-label={image.title}
    >
      <div className="h-full flex flex-col bg-neutral-100 border border-neutral-400 shadow-[2px_2px_0px_0px_rgba(0,0,0,0.15)]">
        {/* Header — neutral bar */}
        <div
          className="h-7 bg-neutral-700 relative flex items-center px-1 cursor-move shrink-0 border-b border-neutral-400"
          onPointerDown={(e) => {
            if (isDraggable) {
              dragControls.start(e)
            }
          }}
          onDoubleClick={handleMaximize}
        >
          {/* Title — centered over full header width */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none pr-14">
            <span className="text-xs text-neutral-100 font-mono truncate max-w-[calc(100%-3.5rem)] text-center">
              {image.title}
            </span>
          </div>

          {/* Window Controls — dark, same icon style as Contact (rounded-sm box, symbol contrast) */}
          <div className="relative z-10 flex items-center gap-0.5 shrink-0 ml-auto">
            {/* Minimize */}
            <button
              onClick={(e) => {
                e.stopPropagation()
                handleMinimize()
              }}
              className="inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-sm border border-neutral-400 bg-neutral-800 text-neutral-100 font-mono text-xs hover:bg-neutral-600 hover:border-neutral-500 transition-colors duration-200 focus:outline-none focus-visible:border-primary focus-visible:text-primary"
              aria-label="Minimize window"
            >
              <span className="leading-none">_</span>
            </button>

            {/* Maximize */}
            <button
              onClick={(e) => {
                e.stopPropagation()
                handleMaximize()
              }}
              className="inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-sm border border-neutral-400 bg-neutral-800 text-neutral-100 font-mono hover:bg-neutral-600 hover:border-neutral-500 transition-colors duration-200 focus:outline-none focus-visible:border-primary focus-visible:text-primary"
              aria-label={sizeState === 'maximized' ? 'Restore window' : 'Maximize window'}
            >
              {sizeState === 'maximized' ? (
                <span className="text-[10px] leading-none">❐</span>
              ) : (
                <span className="text-[10px] leading-none border border-current w-2.5 h-2.5" />
              )}
            </button>

            {/* Close */}
            <button
              onClick={(e) => {
                e.stopPropagation()
                onClose()
              }}
              className="inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-sm border border-neutral-400 bg-neutral-800 text-neutral-100 font-mono text-xs hover:bg-neutral-600 hover:border-neutral-500 transition-colors duration-200 focus:outline-none focus-visible:border-primary focus-visible:text-primary"
              aria-label="Close window"
            >
              <span className="leading-none">×</span>
            </button>
          </div>
        </div>

        {/* Window Content */}
        <div className="flex-1 relative bg-neutral overflow-hidden">
          {!imageError ? (
            <Image
              src={image.src}
              alt={image.title}
              fill
              className="object-contain"
              sizes={`${dimensions.width}px`}
              priority={false}
              onError={() => setImageError(true)}
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center bg-neutral">
              <div className="text-center">
                <div className="text-neutral-400 text-4xl mb-2 font-mono">[ ]</div>
                <span className="text-neutral-400 font-mono text-sm">
                  {image.title}
                </span>
              </div>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  )
}
