'use client'

import { useState, useEffect } from 'react'
import { Canvas } from '@react-three/fiber'
import { NoiseGradient } from './NoiseGradient'

interface NoiseGradientCanvasProps {
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
    <div className={className} style={style}>
      <Canvas
        dpr={1}
        frameloop={reducedMotion ? 'demand' : 'always'}
        orthographic
        camera={{ zoom: 80, position: [0, 0, 5] }}
        gl={{ antialias: false, alpha: false }}
        style={{ width: '100%', height: '100%' }}
      >
        <NoiseGradient colors={colors} speed={speed} paused={reducedMotion} />
      </Canvas>
    </div>
  )
}
