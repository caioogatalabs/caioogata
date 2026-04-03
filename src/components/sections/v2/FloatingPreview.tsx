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

/**
 * Inner reveal — mounts fresh on each imageSrc change (via key).
 * Starts at scale 0, animates to scale 1 after first paint.
 */
function RevealImage({ src, alt }: { src: string; alt: string }) {
  const [entered, setEntered] = useState(false)

  useEffect(() => {
    // Force the browser to paint scale:0 first, then animate to scale:1
    const raf = requestAnimationFrame(() => {
      setEntered(true)
    })
    return () => cancelAnimationFrame(raf)
  }, [])

  return (
    <div
      className="w-full h-full overflow-hidden"
      style={{
        borderRadius: 'var(--radius-component-md, 12px)',
        transformOrigin: 'top left',
        scale: entered ? '1' : '0',
        transition: `scale 0.35s ${EASING_ENTER}`,
      }}
    >
      <img
        src={src}
        alt={alt}
        className="w-full h-full object-cover"
        style={{
          willChange: 'transform',
          scale: entered ? '1.25' : '3',
          opacity: entered ? 1 : 0,
          transition: entered
            ? `scale 0.5s ${EASING_ENTER}, opacity 0.2s ${EASING_ENTER}`
            : 'none',
        }}
        loading="eager"
      />
    </div>
  )
}

export function FloatingPreview({
  imageSrc,
  alt,
  mouseX,
  mouseY,
}: FloatingPreviewProps) {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false)

  const lerpX = useRef(0)
  const lerpY = useRef(0)
  const prevLerpX = useRef(0)
  const prevLerpY = useRef(0)
  const velX = useRef(0)
  const velY = useRef(0)

  const rafRef = useRef<number>(0)
  const containerRef = useRef<HTMLDivElement>(null)

  const isVisible = imageSrc !== null
  const wasVisible = useRef(false)

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
    setPrefersReducedMotion(mq.matches)
    const handler = (e: MediaQueryListEvent) => setPrefersReducedMotion(e.matches)
    mq.addEventListener('change', handler)
    return () => mq.removeEventListener('change', handler)
  }, [])

  // Snap lerp to cursor on first show
  useEffect(() => {
    if (isVisible && !wasVisible.current) {
      lerpX.current = mouseX
      lerpY.current = mouseY
      prevLerpX.current = mouseX
      prevLerpY.current = mouseY
      velX.current = 0
      velY.current = 0
    }
    wasVisible.current = isVisible
  }, [isVisible, mouseX, mouseY])

  // rAF loop
  const animate = useCallback(() => {
    if (prefersReducedMotion) {
      lerpX.current = mouseX
      lerpY.current = mouseY
      velX.current = 0
      velY.current = 0
    } else {
      lerpX.current = lerp(lerpX.current, mouseX, LERP_FACTOR)
      lerpY.current = lerp(lerpY.current, mouseY, LERP_FACTOR)
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

      el.style.transform = `translate3d(${lerpX.current + offsetX}px, ${lerpY.current + offsetY}px, 0) skew(${skewX}deg, ${skewY}deg)`

      const img = el.querySelector('img') as HTMLImageElement | null
      if (img) {
        const imgParallaxX = Math.max(-32, Math.min(32, velX.current * -0.4))
        const imgParallaxY = Math.max(-32, Math.min(32, velY.current * -0.4))
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
      className="hidden lg:block pointer-events-none fixed z-[100]"
      style={{
        top: 0,
        left: 0,
        width: 500,
        height: 300,
        willChange: 'transform',
        opacity: isVisible ? 1 : 0,
        transition: isVisible ? 'none' : `opacity 0.15s ${EASING_EXIT}`,
      }}
    >
      {/* key={imageSrc} forces React to unmount/remount on each image change,
          guaranteeing a fresh scale 0→1 animation every time */}
      {imageSrc && <RevealImage key={imageSrc} src={imageSrc} alt={alt} />}
    </div>
  )
}
