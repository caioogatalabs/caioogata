'use client'

import { useState, useCallback } from 'react'
import { motion } from 'motion/react'
import ImageWindow from './ImageWindow'
import type { WindowState } from '@/hooks/useWindowManager'

interface GridViewProps {
  windows: WindowState[]
  activeWindowId: string | null
  onFocus: (id: string) => void
  onClose: (id: string) => void
}

// Indices that get a larger span (2 cols) by default
const HIGHLIGHT_INDICES = new Set([0, 3, 7])

type SizeState = 'normal' | 'maximized' | 'minimized'

export default function GridView({ windows, activeWindowId, onFocus, onClose }: GridViewProps) {
  const openWindows = windows.filter(w => w.isOpen)
  const [sizeStates, setSizeStates] = useState<Record<string, SizeState>>({})

  const handleSizeChange = useCallback((id: string, state: SizeState) => {
    setSizeStates(prev => ({ ...prev, [id]: state }))
  }, [])

  const getColSpan = (windowId: string, index: number): string => {
    const state = sizeStates[windowId] ?? 'normal'
    if (state === 'maximized') return 'col-span-1 sm:col-span-2 lg:col-span-4'
    if (state === 'minimized') return 'col-span-1'
    if (HIGHLIGHT_INDICES.has(index)) return 'col-span-1 sm:col-span-2'
    return 'col-span-1'
  }

  const getRowSpan = (windowId: string, index: number): string => {
    const state = sizeStates[windowId] ?? 'normal'
    if (state === 'maximized') return 'row-span-2'
    if (state === 'minimized') return 'row-span-1'
    if (HIGHLIGHT_INDICES.has(index)) return 'sm:row-span-2'
    return 'row-span-1'
  }

  return (
    <motion.div
      className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 p-4 pt-16 w-full"
      style={{ gridAutoRows: 'minmax(240px, auto)' }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
    >
      {openWindows.map((window, index) => (
        <motion.div
          key={window.id}
          layout
          className={`${getColSpan(window.id, index)} ${getRowSpan(window.id, index)}`}
          transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        >
          <ImageWindow
            id={window.id}
            index={index}
            image={window.image}
            mode="grid"
            isActive={activeWindowId === window.id}
            onFocus={() => onFocus(window.id)}
            onClose={() => onClose(window.id)}
            onSizeStateChange={(state) => handleSizeChange(window.id, state)}
          />
        </motion.div>
      ))}
    </motion.div>
  )
}
