'use client'

import { useState, useEffect, useRef, useCallback } from 'react'

interface FloatingPreviewProps {
  imageSrc: string | null
  alt: string
  mouseX: number
  mouseY: number
  velocityX: number
}

const LERP_FACTOR = 0.12
const EASING_ENTER = 'cubic-bezier(0.22, 0.31, 0, 1)'
const EASING_EXIT = 'cubic-bezier(0.69, 0, 0, 1)'

function lerp(current: number, target: number, factor: number) {
  return current + (target - current) * factor
}

export function FloatingPreview({
  imageSrc,
  alt,
  mouseX,
  mouseY,
}: FloatingPreviewProps) {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false)

  // Lerped position — creates the elastic/lagging follow
  const lerpX = useRef(0)
  const lerpY = useRef(0)
  // Lerped velocity for skew (delta of lerped position)
  const prevLerpX = useRef(0)
  const prevLerpY = useRef(0)
  const velX = useRef(0)
  const velY = useRef(0)

  const rafRef = useRef<number>(0)
  const containerRef = useRef<HTMLDivElement>(null)

  const isVisible = imageSrc !== null
  // Track previous visibility to detect enter/exit
  const wasVisible = useRef(false)
  // Capture mouse position at the moment of reveal for transform-origin
  const revealOriginRef = useRef({ x: 0, y: 0 })

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
    setPrefersReducedMotion(mq.matches)
    const handler = (e: MediaQueryListEvent) => setPrefersReducedMotion(e.matches)
    mq.addEventListener('change', handler)
    return () => mq.removeEventListener('change', handler)
  }, [])

  // Snap lerp position to mouse on first show (avoid flying in from 0,0)
  // Capture reveal origin so scale expands from cursor position
  useEffect(() => {
    if (isVisible && !wasVisible.current) {
      lerpX.current = mouseX
      lerpY.current = mouseY
      prevLerpX.current = mouseX
      prevLerpY.current = mouseY
      velX.current = 0
      velY.current = 0
      // Origin relative to container: mouse is at container center (due to offset)
      // so we compute where the cursor sits inside the 500x300 box
      const offsetX = 16
      const offsetY = 24
      revealOriginRef.current = {
        x: -offsetX,   // cursor is offsetX to the left of the container's left edge
        y: -offsetY,   // cursor is offsetY above the container's top edge
      }
    }
    wasVisible.current = isVisible
  }, [isVisible, mouseX, mouseY])

  // Animation loop — lerp position toward mouse, compute velocity for skew
  const animate = useCallback(() => {
    if (prefersReducedMotion) {
      lerpX.current = mouseX
      lerpY.current = mouseY
      velX.current = 0
      velY.current = 0
    } else {
      lerpX.current = lerp(lerpX.current, mouseX, LERP_FACTOR)
      lerpY.current = lerp(lerpY.current, mouseY, LERP_FACTOR)

      // Velocity = delta of lerped position (smoothed velocity, not raw)
      velX.current = lerpX.current - prevLerpX.current
      velY.current = lerpY.current - prevLerpY.current
      prevLerpX.current = lerpX.current
      prevLerpY.current = lerpY.current
    }

    const el = containerRef.current
    if (el) {
      const offsetX = 16
      const offsetY = 24
      const skewX = Math.max(-30, Math.min(30, -velX.current * 1.2))
      const skewY = Math.max(-30, Math.min(30, -velY.current * 1.2))

      // Inner image parallax (inverse of velocity)
      const imgParallaxX = Math.max(-32, Math.min(32, velX.current * -0.4))
      const imgParallaxY = Math.max(-32, Math.min(32, velY.current * -0.4))

      el.style.transform = `translate3d(${lerpX.current + offsetX}px, ${lerpY.current + offsetY}px, 0) skew(${skewX}deg, ${skewY}deg)`

      // Parallax only via transform — CSS `scale` property handles the zoom reveal separately
      const img = el.querySelector('img') as HTMLImageElement | null
      if (img) {
        img.style.transform = `translate3d(${imgParallaxX}px, ${imgParallaxY}px, 0)`
      }
    }

    rafRef.current = requestAnimationFrame(animate)
  }, [mouseX, mouseY, prefersReducedMotion])

  useEffect(() => {
    rafRef.current = requestAnimationFrame(animate)
    return () => cancelAnimationFrame(rafRef.current)
  }, [animate])

  return (
    <div
      ref={containerRef}
      className="hidden lg:block pointer-events-none fixed z-[100] overflow-hidden"
      style={{
        top: 0,
        left: 0,
        width: 500,
        height: 300,
        borderRadius: 'var(--radius-component-md, 12px)',
        willChange: 'transform',
        // Scale entry/exit — separate from position (handled by rAF)
        scale: isVisible ? '1' : '0',
        opacity: isVisible ? 1 : 0,
        transition: isVisible
          ? `scale 0.3s ${EASING_ENTER}, opacity 0.3s ${EASING_ENTER}`
          : `scale 0.3s ${EASING_EXIT}, opacity 0.3s ${EASING_EXIT}`,
        transformOrigin: 'top left',
      }}
    >
      {imageSrc ? (
        <img
          src={imageSrc}
          alt={alt}
          className="w-full h-full object-cover"
          style={{
            willChange: 'transform',
            // rAF handles parallax transform — CSS handles the zoom reveal
            scale: isVisible ? '1.25' : '4',
            transition: isVisible
              ? `scale 0.5s ${EASING_ENTER}`
              : `scale 0.3s ${EASING_EXIT}`,
          }}
          loading="eager"
        />
      ) : (
        <div
          className="w-full h-full"
          style={{ backgroundColor: 'var(--color-bg-surface-primary)' }}
        />
      )}
    </div>
  )
}
