'use client'

import { useState, useEffect } from 'react'
import { Canvas } from '@react-three/fiber'
import * as THREE from 'three'
import { useInteractionMode } from '@/hooks/useInteractionMode'
import { DistortedImage, type DistortedImageProps } from './DistortedImage'

export interface DistortedImageCanvasProps
  extends Omit<DistortedImageProps, 'texture'> {
  /** Same path the underlying <Image> uses. Served raw — next/image is unoptimized here. */
  src: string
  className?: string
}

/**
 * Overlays a WebGL distortion on top of an image that is already in the DOM.
 *
 * The caller keeps its own <img>/<Image> underneath: this canvas paints over it
 * once the texture has decoded, and simply never mounts when the effect is
 * unwanted. That way the image stays the LCP element and the page degrades to
 * exactly its current state on touch, on reduced motion, or if WebGL fails.
 */
export function DistortedImageCanvas({ src, className, ...props }: DistortedImageCanvasProps) {
  const [texture, setTexture] = useState<THREE.Texture | null>(null)
  const [reducedMotion, setReducedMotion] = useState(true)
  const { isTouchDevice } = useInteractionMode()

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
    setReducedMotion(mq.matches)
    const handler = (e: MediaQueryListEvent) => setReducedMotion(e.matches)
    mq.addEventListener('change', handler)
    return () => mq.removeEventListener('change', handler)
  }, [])

  const enabled = !reducedMotion && !isTouchDevice

  useEffect(() => {
    if (!enabled) return
    let cancelled = false
    let loaded: THREE.Texture | null = null

    new THREE.TextureLoader().load(src, (t) => {
      if (cancelled) {
        t.dispose()
        return
      }
      t.colorSpace = THREE.SRGBColorSpace
      t.minFilter = THREE.LinearFilter
      t.magFilter = THREE.LinearFilter
      loaded = t
      setTexture(t)
    })

    return () => {
      cancelled = true
      loaded?.dispose()
      setTexture(null)
    }
  }, [src, enabled])

  if (!enabled || !texture) return null

  return (
    // The Canvas measures its own root element, so it gets a plain 100%/100%
    // box to sit in. Making the Canvas itself the absolutely-positioned layer
    // leaves it measuring at 300x150 until the first window resize.
    <div className={className} style={{ position: 'absolute', inset: 0 }}>
      <Canvas
        dpr={[1, 1.5]}
        frameloop="demand"
        orthographic
        camera={{ zoom: 1, near: 0.1, far: 100, position: [0, 0, 5] }}
        gl={{ alpha: true, antialias: false, powerPreference: 'low-power', depth: false, stencil: false }}
        resize={{ scroll: false, debounce: { scroll: 0, resize: 0 } }}
      >
        <DistortedImage texture={texture} {...props} />
      </Canvas>
    </div>
  )
}
