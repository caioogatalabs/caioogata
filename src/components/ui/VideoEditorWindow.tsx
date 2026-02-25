'use client'

import { useRef, useState, useEffect, useCallback } from 'react'
import { motion, useDragControls } from 'motion/react'
import { useVideoEditor } from '@/hooks/useVideoEditor'
import { EDITOR_PRESETS, DEFAULT_FILTERS } from '@/lib/editor-presets'
import type { FilterState } from '@/lib/editor-presets'

interface VideoEditorWindowProps {
  videoSrc: string
  title: string
  onClose: () => void
  dragConstraints: React.RefObject<HTMLElement | null>
}

const CANVAS_MAX_WIDTH = 360

function FilterOverlay({ filters }: { filters: FilterState }) {
  const lines = (Object.keys(DEFAULT_FILTERS) as (keyof FilterState)[]).map((key) => {
    const val = filters[key]
    const def = DEFAULT_FILTERS[key]
    const changed = val !== def
    return { key, val, changed }
  })

  return (
    <div className="absolute inset-0 pointer-events-none flex items-end p-2">
      <pre className="text-[10px] leading-tight font-mono text-neutral-400 px-2 py-1.5 max-w-full overflow-hidden">
        <span>{'{\n'}</span>
        {lines.map(({ key, val, changed }) => (
          <span key={key}>
            {'  '}
            <span className={changed ? 'text-neutral-300' : ''}>
              {key}
            </span>
            <span>: </span>
            <span className={changed ? 'text-neutral-300' : ''}>
              {val}
            </span>
            <span>,</span>
            {'\n'}
          </span>
        ))}
        <span>{'}'}</span>
      </pre>
    </div>
  )
}

export default function VideoEditorWindow({
  videoSrc,
  title,
  onClose,
  dragConstraints,
}: VideoEditorWindowProps) {
  const dragControls = useDragControls()
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const videoRef = useRef<HTMLVideoElement>(null)
  const [canvasSize, setCanvasSize] = useState({ width: CANVAS_MAX_WIDTH, height: 300 })
  const [isMobile, setIsMobile] = useState(false)

  const { filters, applyPreset, reset, isDefault, activePresetName } =
    useVideoEditor(canvasRef, videoRef)

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768)
    check()
    window.addEventListener('resize', check)
    return () => window.removeEventListener('resize', check)
  }, [])

  useEffect(() => {
    const video = videoRef.current
    if (!video) return

    function onLoadedMetadata() {
      if (!video) return
      const dpr = window.devicePixelRatio || 1
      const aspectRatio = video.videoHeight / video.videoWidth

      const maxDisplayWidth = isMobile
        ? Math.min(window.innerWidth - 32, CANVAS_MAX_WIDTH)
        : CANVAS_MAX_WIDTH

      const maxDisplayHeight = isMobile
        ? Math.max(200, window.innerHeight - 180)
        : Number.POSITIVE_INFINITY

      let displayWidth = maxDisplayWidth
      let displayHeight = Math.round(displayWidth * aspectRatio)

      if (displayHeight > maxDisplayHeight) {
        displayHeight = Math.round(maxDisplayHeight)
        displayWidth = Math.round(displayHeight / aspectRatio)
      }

      setCanvasSize({ width: displayWidth, height: displayHeight })

      if (canvasRef.current) {
        canvasRef.current.width = displayWidth * dpr
        canvasRef.current.height = displayHeight * dpr
        canvasRef.current.style.width = `${displayWidth}px`
        canvasRef.current.style.height = `${displayHeight}px`

        const ctx = canvasRef.current.getContext('2d')
        if (ctx) ctx.scale(dpr, dpr)
      }

      video.play().catch(() => {})
    }

    video.addEventListener('loadedmetadata', onLoadedMetadata)
    if (video.readyState >= 1) onLoadedMetadata()

    return () => {
      video.removeEventListener('loadedmetadata', onLoadedMetadata)
      video.pause()
    }
  }, [isMobile])

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    },
    [onClose]
  )

  const windowWidth = canvasSize.width + 2

  const presetButtons = (
    <div className="flex items-center gap-1 p-1.5 bg-neutral-800 border-t border-neutral-600">
      {EDITOR_PRESETS.map((preset) => (
        <button
          key={preset.name}
          onClick={() => applyPreset(preset.name)}
          className={`px-2 py-1 rounded-sm text-xs font-mono transition-colors border ${
            activePresetName === preset.name
              ? 'bg-primary/20 text-primary border-primary/30'
              : 'text-neutral-300 hover:text-primary hover:bg-neutral-700 border-neutral-600'
          }`}
          aria-pressed={activePresetName === preset.name}
        >
          {preset.name}
        </button>
      ))}

      <div className="w-px h-5 bg-neutral-600 mx-0.5" />

      <button
        onClick={reset}
        disabled={isDefault}
        className={`px-2 py-1 rounded-sm text-xs font-mono transition-colors border ${
          isDefault
            ? 'text-neutral-500 border-neutral-700 cursor-not-allowed'
            : 'text-neutral-300 hover:text-primary hover:bg-neutral-700 border-neutral-600'
        }`}
      >
        Reset
      </button>
    </div>
  )

  const hiddenVideo = (
    <video
      ref={videoRef}
      src={videoSrc}
      muted
      loop
      playsInline
      preload="auto"
      className="hidden"
    />
  )

  if (isMobile) {
    return (
      <motion.div
        className="fixed inset-0 z-50 flex flex-col bg-neutral-500/95 backdrop-blur-sm"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.2 }}
        onKeyDown={handleKeyDown}
        tabIndex={0}
        role="dialog"
        aria-label={`Video editor - ${title}`}
        aria-modal="true"
      >
        {hiddenVideo}

        <div className="h-7 bg-neutral-700 flex items-center px-1 shrink-0 border-b border-neutral-400">
          <div className="flex-1 flex items-center justify-center pointer-events-none">
            <span className="text-xs text-neutral-100 font-mono truncate">{title}</span>
          </div>
          <button
            onClick={onClose}
            className="inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-sm border border-neutral-400 bg-neutral-800 text-neutral-100 font-mono text-xs hover:bg-neutral-600 hover:border-neutral-500 transition-colors duration-200 focus:outline-none focus-visible:border-primary focus-visible:text-primary"
            aria-label="Close editor"
          >
            <span className="leading-none">&times;</span>
          </button>
        </div>

        <div className="flex-1 flex flex-col">
          <div className="flex-1 flex justify-center items-center p-4 relative">
            <canvas ref={canvasRef} />
            {!isDefault && <FilterOverlay filters={filters} />}
          </div>
          {presetButtons}
        </div>
      </motion.div>
    )
  }

  return (
    <motion.div
      className="absolute top-0 left-0 z-40 select-none"
      style={{ width: windowWidth }}
      initial={{ opacity: 0, scale: 0.9, y: -20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ type: 'spring', stiffness: 500, damping: 30 }}
      drag
      dragControls={dragControls}
      dragMomentum={false}
      dragConstraints={dragConstraints}
      dragElastic={0}
      onKeyDown={handleKeyDown}
      tabIndex={0}
      role="dialog"
      aria-label={`Video editor - ${title}`}
    >
      {hiddenVideo}

      <div className="flex flex-col bg-neutral-100 border border-neutral-400 shadow-[2px_2px_0px_0px_rgba(0,0,0,0.15)]">
        <div
          className="h-7 bg-neutral-700 relative flex items-center px-1 cursor-move shrink-0 border-b border-neutral-400"
          onPointerDown={(e) => {
            e.preventDefault()
            dragControls.start(e)
          }}
        >
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none pr-8">
            <span className="text-xs text-neutral-100 font-mono truncate max-w-[calc(100%-2rem)] text-center">
              {title}
            </span>
          </div>

          <div className="relative z-10 flex items-center gap-0.5 shrink-0 ml-auto">
            <button
              onClick={(e) => {
                e.stopPropagation()
                onClose()
              }}
              className="inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-sm border border-neutral-400 bg-neutral-800 text-neutral-100 font-mono text-xs hover:bg-neutral-600 hover:border-neutral-500 transition-colors duration-200 focus:outline-none focus-visible:border-primary focus-visible:text-primary"
              aria-label="Close editor"
            >
              <span className="leading-none">&times;</span>
            </button>
          </div>
        </div>

        <div className="relative">
          <canvas ref={canvasRef} className="block" />
          {!isDefault && <FilterOverlay filters={filters} />}
        </div>

        {presetButtons}
      </div>
    </motion.div>
  )
}
