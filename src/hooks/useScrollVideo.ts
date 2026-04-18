'use client'

import { useEffect, useRef, useState, useCallback } from 'react'

/**
 * Scroll-linked canvas frame sequencer.
 * Maps scroll position within a tall container to video frames drawn on a canvas.
 * Preloads all frames as Image objects on mount for smooth scrubbing.
 */
export function useScrollVideo({
  frameCount = 241,
  framePath = '/about-frames/frame-',
  frameExtension = '.jpg',
  scrollHeight = 400, // vh units — total scroll zone height (applied via style)
} = {}): {
  containerRef: React.RefObject<HTMLDivElement | null>
  canvasRef: React.RefObject<HTMLCanvasElement | null>
  progress: number
} {
  const containerRef = useRef<HTMLDivElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const imagesRef = useRef<HTMLImageElement[]>([])
  const tickingRef = useRef(false)
  const [progress, setProgress] = useState(0)

  // Preload all frame images
  useEffect(() => {
    const images: HTMLImageElement[] = []
    for (let i = 1; i <= frameCount; i++) {
      const img = new Image()
      const padded = String(i).padStart(3, '0')
      img.src = `${framePath}${padded}${frameExtension}`
      images.push(img)
    }
    imagesRef.current = images
  }, [frameCount, framePath, frameExtension])

  const drawFrame = useCallback((index: number) => {
    const canvas = canvasRef.current
    const img = imagesRef.current[index]
    if (!canvas || !img || !img.complete || !img.naturalWidth) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    // Size canvas to image natural dimensions (only once or on change)
    if (canvas.width !== img.naturalWidth || canvas.height !== img.naturalHeight) {
      canvas.width = img.naturalWidth
      canvas.height = img.naturalHeight
    }

    ctx.drawImage(img, 0, 0)
  }, [])

  const update = useCallback(() => {
    const container = containerRef.current
    if (!container) {
      tickingRef.current = false
      return
    }

    const rect = container.getBoundingClientRect()
    const vh = window.innerHeight
    // progress: 0 when container top reaches viewport top, 1 when container bottom reaches viewport bottom
    const scrollable = rect.height - vh
    const scrolled = -rect.top
    const p = Math.max(0, Math.min(1, scrolled / scrollable))

    setProgress(p)

    const frameIndex = Math.min(
      Math.floor(p * (imagesRef.current.length - 1)),
      imagesRef.current.length - 1
    )
    drawFrame(frameIndex)
    tickingRef.current = false
  }, [drawFrame])

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    const prefersReduced = window.matchMedia(
      '(prefers-reduced-motion: reduce)'
    ).matches

    if (prefersReduced) {
      // Show last frame statically
      const lastIndex = imagesRef.current.length - 1
      const tryDraw = () => {
        const img = imagesRef.current[lastIndex]
        if (img && img.complete && img.naturalWidth) {
          drawFrame(lastIndex)
        } else if (img) {
          img.onload = () => drawFrame(lastIndex)
        }
      }
      // Wait a tick for images to start loading
      requestAnimationFrame(tryDraw)
      setProgress(1)
      return
    }

    const onScroll = () => {
      if (!tickingRef.current) {
        tickingRef.current = true
        requestAnimationFrame(update)
      }
    }

    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll, { passive: true })

    // Initial draw when first frame loads
    const firstImg = imagesRef.current[0]
    if (firstImg) {
      if (firstImg.complete && firstImg.naturalWidth) {
        update()
      } else {
        firstImg.onload = () => update()
      }
    }

    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
    }
  }, [update, drawFrame])

  return { containerRef, canvasRef, progress }
}
