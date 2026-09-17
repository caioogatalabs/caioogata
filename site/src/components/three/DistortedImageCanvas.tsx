'use client'

import { useState, useEffect } from 'react'
import { Canvas } from '@react-three/fiber'
import * as THREE from 'three'
import { useInteractionMode } from '@/hooks/useInteractionMode'
import { DistortedImage, type DistortedImageProps } from './DistortedImage'

export interface DistortedImageCanvasProps
  extends Omit<DistortedImageProps, 'texture'> {
  /**
   * Same path the underlying <Image> uses. Served raw — next/image is
   * unoptimized here. Ignored when `video` is given.
   */
  src?: string
  /**
   * The <video> already playing underneath, used as the texture instead of a
   * still. The caller owns the element — this only reads frames off it, so
   * there is one decode, not two, and the same element remains the fallback
   * wherever the canvas does not mount.
   */
  video?: HTMLVideoElement | null
  className?: string
}

/**
 * Overlays a WebGL distortion on top of an image or video that is already in
 * the DOM.
 *
 * The caller keeps its own <img>/<Image>/<video> underneath: this canvas paints
 * over it once the texture is ready, and simply never mounts when the effect is
 * unwanted. That way the media stays the LCP element and the page degrades to
 * exactly its current state on touch, on reduced motion, or if WebGL fails.
 */
export function DistortedImageCanvas({ src, video, className, ...props }: DistortedImageCanvasProps) {
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

  // Whether the video is still producing new frames. A clip that plays once
  // and rests would otherwise hold the render loop open for the life of the
  // page, redrawing a frozen frame. The delay on the way down is so the last
  // frame is certainly on screen before the loop goes back to on-demand.
  const [videoActive, setVideoActive] = useState(false)

  useEffect(() => {
    if (!video) return
    let timer: ReturnType<typeof setTimeout>

    const wake = () => {
      clearTimeout(timer)
      setVideoActive(true)
    }
    const rest = () => {
      clearTimeout(timer)
      timer = setTimeout(() => setVideoActive(false), 300)
    }

    if (!video.paused && !video.ended) wake()
    video.addEventListener('playing', wake)
    video.addEventListener('seeking', wake)
    video.addEventListener('pause', rest)
    video.addEventListener('ended', rest)

    return () => {
      clearTimeout(timer)
      video.removeEventListener('playing', wake)
      video.removeEventListener('seeking', wake)
      video.removeEventListener('pause', rest)
      video.removeEventListener('ended', rest)
    }
  }, [video])

  // A video source: wrap the element the caller already has. No loading to
  // wait on beyond metadata — the shader needs the intrinsic size to do its
  // cover fit, and before `loadedmetadata` the element reports 0x0.
  useEffect(() => {
    if (!enabled || !video) return
    let cancelled = false

    let made: THREE.VideoTexture | null = null

    const make = () => {
      if (cancelled) return
      const t = new THREE.VideoTexture(video)
      // Not sRGB: `NoColorSpace` tells three to hand the samples over exactly
      // as the browser decoded the video, and the shader then skips its output
      // encode. The canvas covers the <video> it reads from, so anything other
      // than a passthrough shows up as the image changing colour the moment
      // the canvas mounts.
      t.colorSpace = THREE.NoColorSpace
      t.minFilter = THREE.LinearFilter
      t.magFilter = THREE.LinearFilter
      made = t
      setTexture(t)
    }

    if (video.readyState >= HTMLMediaElement.HAVE_METADATA) make()
    else video.addEventListener('loadedmetadata', make, { once: true })

    return () => {
      cancelled = true
      video.removeEventListener('loadedmetadata', make)
      made?.dispose()
      setTexture(null)
    }
  }, [video, enabled])

  useEffect(() => {
    if (!enabled || video || !src) return
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
  }, [src, video, enabled])

  if (!enabled || !texture) return null

  return (
    // The Canvas measures its own root element, so it gets a plain 100%/100%
    // box to sit in. Making the Canvas itself the absolutely-positioned layer
    // leaves it measuring at 300x150 until the first window resize.
    <div className={className} style={{ position: 'absolute', inset: 0 }}>
      <Canvas
        dpr={[1, 1.5]}
        // A still only needs a frame when the trail moves. A playing video needs
        // one per video frame, so the loop runs while it plays and goes back to
        // on-demand when it rests. `DistortedImage` skips the compute pass
        // while the trail is still, so what runs every frame is the draw, not
        // the simulation.
        frameloop={videoActive ? 'always' : 'demand'}
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
