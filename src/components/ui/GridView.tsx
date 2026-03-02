'use client'

import { useState, useCallback } from 'react'
import { motion } from 'motion/react'
import ImageWindow from './ImageWindow'
import type { WindowState } from '@/hooks/useWindowManager'

interface GridViewProps {
  windows: WindowState[]
  onFocus: (id: string) => void
  onClose: (id: string) => void
}

// Indices that get a wider col-span for visual variety
const HIGHLIGHT_INDICES = new Set([0, 3, 7])

type SizeState = 'normal' | 'maximized' | 'minimized'

export default function GridView({ windows, onFocus, onClose }: GridViewProps) {
  const openWindows = windows.filter(w => w.isOpen)
  const [sizeStates, setSizeStates] = useState<Record<string, SizeState>>({})
  const [aspectRatios, setAspectRatios] = useState<Record<string, number>>({})

  // Single video: full-width + aspect-video class (no gridAutoRows)
  const isSingleVideo = openWindows.length === 1 && openWindows[0]?.image.type === 'video'
  // Mixed: video first — video gets full width, images use their own aspect-ratio
  const isFirstVideo = !isSingleVideo && openWindows.length > 1 && openWindows[0]?.image.type === 'video'

  const handleSizeChange = useCallback((id: string, state: SizeState) => {
    setSizeStates(prev => ({ ...prev, [id]: state }))
  }, [])

  const handleAspectRatioChange = useCallback((id: string, ratio: number) => {
    setAspectRatios(prev => ({ ...prev, [id]: ratio }))
  }, [])

  const getColSpan = (windowId: string, index: number): string => {
    const state = sizeStates[windowId] ?? 'normal'
    if (state === 'maximized') return 'col-span-1 sm:col-span-2 lg:col-span-4'
    if (state === 'minimized') return 'col-span-1'
    if (openWindows.length === 1) return 'col-span-1 sm:col-span-2 lg:col-span-4'
    if (isFirstVideo && index === 0) return 'col-span-1 sm:col-span-2 lg:col-span-4'
    if (isFirstVideo) return 'col-span-1 sm:col-span-2'
    if (HIGHLIGHT_INDICES.has(index)) return 'col-span-1 sm:col-span-2'
    return 'col-span-1'
  }

  return (
    <motion.div
      className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 p-4 pt-16 w-full"
      style={isSingleVideo ? undefined : { gridAutoRows: 'auto' }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
    >
      {openWindows.map((window, index) => {
        const isVideoCell = window.image.type === 'video'
        const useAspectVideo = isSingleVideo || (isFirstVideo && index === 0)
        const ratio = aspectRatios[window.id]

        // Image cells: aspect-ratio from image dimensions (minHeight while loading)
        // Video cells (non-first): 16:9 aspect-ratio + minHeight floor for narrow columns
        const cellStyle = useAspectVideo
          ? undefined
          : isVideoCell
            ? { aspectRatio: '16 / 9', minHeight: '280px' }
            : { aspectRatio: ratio ? String(ratio) : undefined, minHeight: '200px' }

        return (
          <motion.div
            key={window.id}
            layout
            className={`${getColSpan(window.id, index)}${useAspectVideo ? ' aspect-video' : ''}`}
            style={cellStyle}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          >
            <ImageWindow
              id={window.id}
              index={index}
              image={window.image}
              mode="grid"
              onFocus={() => onFocus(window.id)}
              onClose={() => onClose(window.id)}
              onSizeStateChange={(state) => handleSizeChange(window.id, state)}
              onAspectRatioChange={!isVideoCell ? (r) => handleAspectRatioChange(window.id, r) : undefined}
            />
          </motion.div>
        )
      })}
    </motion.div>
  )
}
