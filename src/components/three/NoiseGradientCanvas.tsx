'use client'

import { useState, useEffect } from 'react'
import { Canvas } from '@react-three/fiber'
import { NoiseGradient } from './NoiseGradient'

export interface NoiseGradientCanvasProps {
  colors: [string, string, string]
  speed?: number
  className?: string
  style?: React.CSSProperties
}

export function NoiseGradientCanvas({ colors, speed, className, style }: NoiseGradientCanvasProps) {
  const [reducedMotion, setReducedMotion] = useState(false)

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
    setReducedMotion(mq.matches)
    const handler = (e: MediaQueryListEvent) => setReducedMotion(e.matches)
    mq.addEventListener('change', handler)
    return () => mq.removeEventListener('change', handler)
  }, [])

  return (
    <div className={className} style={{ ...style, position: 'absolute', inset: 0 }}>
      <Canvas
        dpr={1}
        frameloop={reducedMotion ? 'demand' : 'always'}
        orthographic
        camera={{ zoom: 1, near: 0.1, far: 100, position: [0, 0, 5] }}
        gl={{ antialias: false, alpha: false }}
        resize={{ scroll: false, debounce: { scroll: 0, resize: 0 } }}
      >
        <NoiseGradient colors={colors} speed={speed} paused={reducedMotion} />
      </Canvas>
    </div>
  )
}
