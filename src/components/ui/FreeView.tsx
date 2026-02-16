'use client'

import { useRef } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import ImageWindow from './ImageWindow'
import type { WindowState } from '@/hooks/useWindowManager'

interface FreeViewProps {
  windows: WindowState[]
  activeWindowId: string | null
  canvasWidth: number
  canvasHeight: number
  onFocus: (id: string) => void
  onClose: (id: string) => void
  onDragEnd: (id: string, x: number, y: number) => void
}

export default function FreeView({
  windows,
  activeWindowId,
  canvasWidth,
  canvasHeight,
  onFocus,
  onClose,
  onDragEnd
}: FreeViewProps) {
  const containerRef = useRef<HTMLDivElement>(null)

  return (
    <motion.div
      ref={containerRef}
      className="relative w-full"
      style={{ height: canvasHeight }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
    >
      <AnimatePresence>
        {windows.map((window, index) => !window.isOpen ? null : (
          <ImageWindow
            key={window.id}
            id={window.id}
            index={index}
            image={window.image}
            mode="free"
            x={window.x}
            y={window.y}
            zIndex={window.zIndex}
            isActive={activeWindowId === window.id}
            isOpen={window.isOpen}
            canvasWidth={canvasWidth}
            canvasHeight={canvasHeight}
            onFocus={() => onFocus(window.id)}
            onClose={() => onClose(window.id)}
            onDragEnd={(nx, ny) => onDragEnd(window.id, nx, ny)}
            dragConstraints={containerRef}
          />
        ))}
      </AnimatePresence>
    </motion.div>
  )
}
