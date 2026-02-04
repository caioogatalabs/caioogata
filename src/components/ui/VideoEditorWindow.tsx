'use client'

import { useRef, useState, useEffect, useCallback } from 'react'
import { motion, useDragControls } from 'motion/react'
import { useVideoEditor } from '@/hooks/useVideoEditor'
import { EDITOR_PRESETS, DEFAULT_FILTERS } from '@/lib/editor-presets'
import EditorSlider from '@/components/ui/EditorSlider'
import type { FilterState } from '@/lib/editor-presets'

interface VideoEditorWindowProps {
  videoSrc: string
  title: string
  onClose: () => void
  dragConstraints: React.RefObject<HTMLElement | null>
}

const CANVAS_MAX_WIDTH = 360

const SLIDER_CONFIG: {
  key: keyof FilterState
  label: string
  min: number
  max: number
  step?: number
}[] = [
  { key: 'brightness', label: 'Brightness', min: 0, max: 200 },
  { key: 'contrast', label: 'Contrast', min: 0, max: 200 },
  { key: 'saturation', label: 'Saturation', min: 0, max: 200 },
  { key: 'blur', label: 'Blur', min: 0, max: 20 },
  { key: 'grayscale', label: 'Grayscale', min: 0, max: 100 },
  { key: 'hueRotate', label: 'Hue Rotate', min: 0, max: 360 },
  { key: 'invert', label: 'Invert', min: 0, max: 100 },
  { key: 'posterize', label: 'Posterize', min: 2, max: 32 },
  { key: 'pixelate', label: 'Pixelate', min: 1, max: 32 },
  { key: 'noise', label: 'Noise', min: 0, max: 100 },
  { key: 'dithering', label: 'Dithering', min: 0, max: 100 },
]

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
  const [videoReady, setVideoReady] = useState(false)

  const { filters, setFilter, applyPreset, reset, isDefault } = useVideoEditor(canvasRef, videoRef)

  // Detect mobile
  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768)
    check()
    window.addEventListener('resize', check)
    return () => window.removeEventListener('resize', check)
  }, [])

  // Setup video and canvas when video metadata loads
  useEffect(() => {
    const video = videoRef.current
    if (!video) return

    function onLoadedMetadata() {
      if (!video) return
      const dpr = window.devicePixelRatio || 1
      const displayWidth = isMobile
        ? Math.min(window.innerWidth - 32, CANVAS_MAX_WIDTH)
        : CANVAS_MAX_WIDTH
      const aspectRatio = video.videoHeight / video.videoWidth
      const displayHeight = Math.round(displayWidth * aspectRatio)

      setCanvasSize({ width: displayWidth, height: displayHeight })

      if (canvasRef.current) {
        canvasRef.current.width = displayWidth * dpr
        canvasRef.current.height = displayHeight * dpr
        canvasRef.current.style.width = `${displayWidth}px`
        canvasRef.current.style.height = `${displayHeight}px`

        const ctx = canvasRef.current.getContext('2d')
        if (ctx) {
          ctx.scale(dpr, dpr)
        }
      }

      setVideoReady(true)
      video.play().catch(() => {
        // Autoplay may be blocked; video will still render on user interaction
      })
    }

    video.addEventListener('loadedmetadata', onLoadedMetadata)
    // If already loaded
    if (video.readyState >= 1) {
      onLoadedMetadata()
    }

    return () => {
      video.removeEventListener('loadedmetadata', onLoadedMetadata)
      video.pause()
    }
  }, [isMobile])

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose()
      }
    },
    [onClose]
  )

  const activePreset = EDITOR_PRESETS.find((preset) => {
    const merged = { ...DEFAULT_FILTERS, ...preset.filters }
    return (Object.keys(merged) as (keyof FilterState)[]).every(
      (key) => filters[key] === merged[key]
    )
  })

  const windowWidth = canvasSize.width + 2

  // Shared sliders + presets panel
  const slidersPanel = (
    <div
      className="bg-neutral-800 border-t border-neutral-600 max-h-[280px] overflow-y-auto"
      onPointerDown={(e) => e.stopPropagation()}
    >
      {SLIDER_CONFIG.map(({ key, label, min, max, step }) => (
        <EditorSlider
          key={key}
          label={label}
          value={filters[key]}
          min={min}
          max={max}
          step={step}
          defaultValue={DEFAULT_FILTERS[key]}
          onChange={(val) => setFilter(key, val)}
        />
      ))}

      <div className="flex flex-wrap gap-1 p-2 border-t border-neutral-600">
        {EDITOR_PRESETS.map((preset) => (
          <button
            key={preset.name}
            onClick={() => applyPreset(preset.name)}
            className={`px-2 py-1 rounded-sm text-xs font-mono transition-colors border ${
              activePreset?.name === preset.name
                ? 'bg-primary/20 text-primary border-primary/30'
                : 'text-neutral-300 hover:text-primary hover:bg-neutral-700 border-neutral-600'
            }`}
            aria-pressed={activePreset?.name === preset.name}
          >
            {preset.name}
          </button>
        ))}

        <div className="w-px h-6 bg-neutral-600 mx-1 self-center" />

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
    </div>
  )

  // Hidden video element (source for canvas)
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

        <div className="flex-1 overflow-y-auto">
          <div className="flex justify-center p-4 bg-neutral-100">
            <canvas ref={canvasRef} />
          </div>
          {slidersPanel}
        </div>
      </motion.div>
    )
  }

  return (
    <motion.div
      className="absolute z-40 select-none"
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

        <div className="flex justify-center bg-neutral-100 p-1">
          <canvas ref={canvasRef} />
        </div>

        {slidersPanel}
      </div>
    </motion.div>
  )
}
