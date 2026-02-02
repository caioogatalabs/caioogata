'use client'

import { useRef, useState, useEffect } from 'react'
import { motion, useDragControls } from 'motion/react'
import Image from 'next/image'
import type { ProjectImage } from '@/content/types'
import type { ViewMode } from '@/hooks/useWindowManager'

type WindowSizeState = 'normal' | 'maximized' | 'minimized'

interface ImageWindowProps {
  id: string
  image: ProjectImage
  x: number
  y: number
  zIndex: number
  isActive: boolean
  isOpen: boolean
  viewMode: ViewMode
  canvasWidth: number
  canvasHeight: number
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
  image,
  x,
  y,
  zIndex,
  isActive,
  isOpen,
  viewMode,
  canvasWidth,
  canvasHeight,
  onClose,
  onFocus,
  onDragEnd,
  dragConstraints
}: ImageWindowProps) {
  const dragControls = useDragControls()
  const windowRef = useRef<HTMLDivElement>(null)
  const [imageError, setImageError] = useState(false)
  const [sizeState, setSizeState] = useState<WindowSizeState>('normal')
  const [imageDimensions, setImageDimensions] = useState({ width: MIN_WIDTH, height: MIN_HEIGHT })
  const [previousPosition, setPreviousPosition] = useState({ x, y })

  // Load image dimensions
  useEffect(() => {
    const img = new window.Image()
    img.onload = () => {
      // Scale down if image is too large, maintain aspect ratio
      const maxWidth = Math.min(600, canvasWidth - 40)
      const maxHeight = Math.min(450, canvasHeight - HEADER_HEIGHT - 40)

      let width = img.width
      let height = img.height

      if (width > maxWidth) {
        height = (maxWidth / width) * height
        width = maxWidth
      }
      if (height > maxHeight) {
        width = (maxHeight / height) * width
        height = maxHeight
      }

      // Ensure minimum size
      width = Math.max(MIN_WIDTH, width)
      height = Math.max(MIN_HEIGHT, height)

      setImageDimensions({ width, height })
    }
    img.onerror = () => setImageError(true)
    img.src = decodeURIComponent(image.src)
  }, [image.src, canvasWidth, canvasHeight])

  if (!isOpen) return null

  const isDraggable = viewMode === 'free' && sizeState !== 'maximized'

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

  // Calculate dimensions based on state
  const getWindowDimensions = () => {
    if (sizeState === 'maximized') {
      return { width: canvasWidth - 20, height: canvasHeight - 20 }
    }
    if (sizeState === 'minimized') {
      return { width: MIN_WIDTH, height: MIN_HEIGHT }
    }
    return imageDimensions
  }

  const getWindowPosition = () => {
    if (sizeState === 'maximized') {
      return { x: 10, y: 10 }
    }
    return { x, y }
  }

  const dimensions = getWindowDimensions()
  const position = getWindowPosition()

  return (
    <motion.div
      ref={windowRef}
      data-window-id={id}
      className={`absolute select-none ${isActive ? 'ring-1 ring-primary' : ''}`}
      style={{ zIndex }}
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{
        opacity: 1,
        scale: 1,
        x: position.x,
        y: position.y,
        width: dimensions.width,
        height: dimensions.height + HEADER_HEIGHT
      }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{
        type: 'spring',
        stiffness: 400,
        damping: 30
      }}
      drag={isDraggable}
      dragControls={dragControls}
      dragMomentum={false}
      dragConstraints={dragConstraints}
      dragElastic={0}
      onDragEnd={(_, info) => {
        if (isDraggable) {
          onDragEnd(position.x + info.offset.x, position.y + info.offset.y)
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
      <div className="h-full flex flex-col bg-neutral-100 border border-neutral-400 shadow-[2px_2px_0px_0px_rgba(0,0,0,0.3)]">
        {/* Windows-style Header */}
        <div
          className="h-7 bg-gradient-to-r from-neutral-700 to-neutral-500 flex items-center justify-between px-1 cursor-move shrink-0"
          onPointerDown={(e) => {
            if (isDraggable) {
              dragControls.start(e)
            }
          }}
          onDoubleClick={handleMaximize}
        >
          {/* Title */}
          <div className="flex-1 flex items-center justify-center">
            <span className="text-xs text-white font-mono truncate px-2">
              {image.title}
            </span>
          </div>

          {/* Window Controls - Windows style (right side) */}
          <div className="flex items-center gap-px shrink-0">
            {/* Minimize */}
            <button
              onClick={(e) => {
                e.stopPropagation()
                handleMinimize()
              }}
              className="w-5 h-5 bg-neutral-300 border border-neutral-400 border-t-white border-l-white flex items-center justify-center hover:bg-neutral-200 active:border-neutral-400 active:border-t-neutral-400 active:border-l-neutral-400"
              aria-label="Minimize window"
            >
              <span className="text-black text-xs font-bold leading-none mb-1">_</span>
            </button>

            {/* Maximize */}
            <button
              onClick={(e) => {
                e.stopPropagation()
                handleMaximize()
              }}
              className="w-5 h-5 bg-neutral-300 border border-neutral-400 border-t-white border-l-white flex items-center justify-center hover:bg-neutral-200 active:border-neutral-400 active:border-t-neutral-400 active:border-l-neutral-400"
              aria-label={sizeState === 'maximized' ? 'Restore window' : 'Maximize window'}
            >
              {sizeState === 'maximized' ? (
                <span className="text-black text-[10px] font-bold leading-none">❐</span>
              ) : (
                <span className="text-black text-[10px] font-bold leading-none border border-black w-2.5 h-2.5" />
              )}
            </button>

            {/* Close */}
            <button
              onClick={(e) => {
                e.stopPropagation()
                onClose()
              }}
              className="w-5 h-5 bg-neutral-300 border border-neutral-400 border-t-white border-l-white flex items-center justify-center hover:bg-red-400 active:border-neutral-400 active:border-t-neutral-400 active:border-l-neutral-400"
              aria-label="Close window"
            >
              <span className="text-black text-xs font-bold leading-none">×</span>
            </button>
          </div>
        </div>

        {/* Window Content */}
        <div className="flex-1 relative bg-neutral-900 overflow-hidden">
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
            <div className="absolute inset-0 flex items-center justify-center bg-neutral-800">
              <div className="text-center">
                <div className="text-primary/40 text-4xl mb-2">[ ]</div>
                <span className="text-neutral-500 font-mono text-xs">
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
