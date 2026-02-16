'use client'

import { useRef, useState, useEffect, useMemo } from 'react'
import { motion, useDragControls } from 'motion/react'
import Image from 'next/image'
import VideoEmbed from './VideoEmbed'
import type { ProjectImage } from '@/content/types'

type WindowSizeState = 'normal' | 'maximized' | 'minimized'

interface ImageWindowProps {
  id: string
  index: number
  image: ProjectImage
  // Position props (used in free mode)
  x?: number
  y?: number
  zIndex?: number
  isActive?: boolean
  isOpen?: boolean
  // Layout mode
  mode: 'grid' | 'free'
  // Canvas bounds (for maximize and drag constraints)
  canvasWidth?: number
  canvasHeight?: number
  // Callbacks
  onClose?: () => void
  onFocus?: () => void
  onDragEnd?: (x: number, y: number) => void
  onSizeStateChange?: (state: WindowSizeState) => void
  dragConstraints?: React.RefObject<HTMLDivElement | null>
}

const HEADER_HEIGHT = 28
const MIN_WIDTH = 280
const MIN_HEIGHT = 200

export default function ImageWindow({
  id,
  index,
  image,
  x = 0,
  y = 0,
  zIndex = 1,
  isActive = false,
  isOpen = true,
  mode,
  canvasWidth = 800,
  canvasHeight = 600,
  onClose,
  onFocus,
  onDragEnd,
  onSizeStateChange,
  dragConstraints
}: ImageWindowProps) {
  const dragControls = useDragControls()
  const windowRef = useRef<HTMLDivElement>(null)
  const [imageError, setImageError] = useState(false)
  const [sizeState, setSizeState] = useState<WindowSizeState>('normal')
  const [naturalDimensions, setNaturalDimensions] = useState<{ width: number; height: number } | null>(null)

  const isVideo = image.type === 'video'

  useEffect(() => {
    if (isVideo) {
      setNaturalDimensions({ width: 560, height: 315 })
      return
    }
    const img = new window.Image()
    img.onload = () => setNaturalDimensions({ width: img.width, height: img.height })
    img.onerror = () => setImageError(true)
    img.src = decodeURIComponent(image.src)
  }, [image.src, isVideo])

  const imageDimensions = useMemo(() => {
    if (!naturalDimensions) return { width: MIN_WIDTH, height: MIN_HEIGHT }
    const maxW = 600
    const maxH = 450
    let w = naturalDimensions.width
    let h = naturalDimensions.height
    if (w > maxW) { h = (maxW / w) * h; w = maxW }
    if (h > maxH) { w = (maxH / h) * w; h = maxH }
    return { width: Math.max(MIN_WIDTH, w), height: Math.max(MIN_HEIGHT, h) }
  }, [naturalDimensions])

  if (!isOpen) return null

  const isGrid = mode === 'grid'
  const isDraggable = mode === 'free' && sizeState !== 'maximized'

  const handleMaximize = () => {
    const next: WindowSizeState = sizeState === 'maximized' ? 'normal' : 'maximized'
    setSizeState(next)
    onSizeStateChange?.(next)
  }

  const handleMinimize = () => {
    const next: WindowSizeState = sizeState === 'minimized' ? 'normal' : 'minimized'
    setSizeState(next)
    onSizeStateChange?.(next)
  }

  // Grid mode: rendered inline, fills its grid cell
  if (isGrid) {
    return (
      <motion.div
        layoutId={id}
        className="flex flex-col bg-neutral-100 border border-neutral-400 shadow-[2px_2px_0px_0px_rgba(0,0,0,0.15)] overflow-hidden"
        style={{ height: '100%', minHeight: 240 }}
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ type: 'spring', stiffness: 400, damping: 30, delay: index * 0.04 }}
        onPointerDown={onFocus}
      >
        <WindowHeader
          title={image.title}
          sizeState={sizeState}
          isDraggable={false}
          onMinimize={handleMinimize}
          onMaximize={handleMaximize}
          onClose={onClose}
        />
        <div className="flex-1 relative bg-neutral overflow-hidden">
          <WindowContent image={image} imageError={imageError} onError={() => setImageError(true)} />
        </div>
      </motion.div>
    )
  }

  // Free mode: absolute positioned, draggable
  const getDimensions = () => {
    if (sizeState === 'maximized') return { width: canvasWidth - 20, height: canvasHeight - 20 }
    if (sizeState === 'minimized') return { width: MIN_WIDTH, height: MIN_HEIGHT }
    return { width: imageDimensions.width, height: imageDimensions.height + HEADER_HEIGHT }
  }

  const getPosition = () => {
    if (sizeState === 'maximized') return { x: 10, y: 10 }
    return { x, y }
  }

  const dims = getDimensions()
  const pos = getPosition()

  return (
    <motion.div
      ref={windowRef}
      layoutId={id}
      data-window-id={id}
      className={`absolute select-none ${isActive ? 'ring-1 ring-neutral-700' : ''}`}
      style={{ zIndex, transformStyle: 'preserve-3d' }}
      initial={{ opacity: 0, scale: 0.9, y: y - 20 }}
      animate={{
        opacity: 1,
        scale: 1,
        ...pos,
        width: dims.width,
        height: dims.height
      }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{
        type: 'spring',
        stiffness: 500,
        damping: 30,
        delay: index * 0.03
      }}
      drag={isDraggable}
      dragControls={dragControls}
      dragMomentum={false}
      dragConstraints={dragConstraints}
      dragElastic={0}
      onDragEnd={() => {
        if (isDraggable && windowRef.current && dragConstraints?.current) {
          const canvasRect = dragConstraints.current.getBoundingClientRect()
          const windowRect = windowRef.current.getBoundingClientRect()
          onDragEnd?.(
            windowRect.left - canvasRect.left,
            windowRect.top - canvasRect.top
          )
        }
      }}
      onPointerDown={onFocus}
      tabIndex={0}
      onFocus={onFocus}
      onKeyDown={(e) => {
        if (e.key === 'Escape' || e.key === 'q') onClose?.()
      }}
      role="dialog"
      aria-label={image.title}
    >
      <div className="h-full flex flex-col bg-neutral-100 border border-neutral-400 shadow-[2px_2px_0px_0px_rgba(0,0,0,0.15)]">
        <WindowHeader
          title={image.title}
          sizeState={sizeState}
          isDraggable={isDraggable}
          dragControls={dragControls}
          onMinimize={handleMinimize}
          onMaximize={handleMaximize}
          onClose={onClose}
        />
        <div className="flex-1 relative bg-neutral overflow-hidden">
          <WindowContent image={image} imageError={imageError} onError={() => setImageError(true)} />
        </div>
      </div>
    </motion.div>
  )
}

// --- Sub-components ---

function WindowHeader({
  title,
  sizeState,
  isDraggable,
  dragControls,
  onMinimize,
  onMaximize,
  onClose
}: {
  title: string
  sizeState: WindowSizeState
  isDraggable: boolean
  dragControls?: ReturnType<typeof useDragControls>
  onMinimize?: () => void
  onMaximize?: () => void
  onClose?: () => void
}) {
  return (
    <div
      className={`h-7 bg-neutral-700 relative flex items-center px-1 shrink-0 border-b border-neutral-400 ${isDraggable ? 'cursor-move' : ''}`}
      onPointerDown={(e) => {
        if (isDraggable && dragControls) dragControls.start(e)
      }}
      onDoubleClick={onMaximize}
    >
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none pr-14">
        <span className="text-xs text-neutral-100 font-mono truncate max-w-[calc(100%-3.5rem)] text-center">
          {title}
        </span>
      </div>
      <div className="relative z-10 flex items-center gap-0.5 shrink-0 ml-auto">
        <button
          onClick={(e) => { e.stopPropagation(); onMinimize?.() }}
          className="inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-sm border border-neutral-400 bg-neutral-800 text-neutral-100 font-mono text-xs hover:bg-neutral-600 hover:border-neutral-500 transition-colors duration-200 focus:outline-none focus-visible:border-primary focus-visible:text-primary"
          aria-label="Minimize window"
        >
          <span className="leading-none">_</span>
        </button>
        <button
          onClick={(e) => { e.stopPropagation(); onMaximize?.() }}
          className="inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-sm border border-neutral-400 bg-neutral-800 text-neutral-100 font-mono hover:bg-neutral-600 hover:border-neutral-500 transition-colors duration-200 focus:outline-none focus-visible:border-primary focus-visible:text-primary"
          aria-label={sizeState === 'maximized' ? 'Restore window' : 'Maximize window'}
        >
          {sizeState === 'maximized' ? (
            <span className="text-[10px] leading-none">&#10064;</span>
          ) : (
            <span className="text-[10px] leading-none border border-current w-2.5 h-2.5" />
          )}
        </button>
        <button
          onClick={(e) => { e.stopPropagation(); onClose?.() }}
          className="inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-sm border border-neutral-400 bg-neutral-800 text-neutral-100 font-mono text-xs hover:bg-neutral-600 hover:border-neutral-500 transition-colors duration-200 focus:outline-none focus-visible:border-primary focus-visible:text-primary"
          aria-label="Close window"
        >
          <span className="leading-none">&times;</span>
        </button>
      </div>
    </div>
  )
}

function WindowContent({
  image,
  imageError,
  onError
}: {
  image: ProjectImage
  imageError: boolean
  onError: () => void
}) {
  if (image.type === 'video' && image.platform && image.videoId) {
    return (
      <div className="absolute inset-0">
        <VideoEmbed platform={image.platform} videoId={image.videoId} />
      </div>
    )
  }

  if (imageError) {
    return (
      <div className="absolute inset-0 flex items-center justify-center bg-neutral">
        <div className="text-center">
          <div className="text-neutral-400 text-4xl mb-2 font-mono">[ ]</div>
          <span className="text-neutral-400 font-mono text-sm">{image.title}</span>
        </div>
      </div>
    )
  }

  return (
    <Image
      src={image.src}
      alt={image.title}
      fill
      className="object-contain"
      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
      priority={false}
      onError={onError}
    />
  )
}
