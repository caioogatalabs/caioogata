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

  // Lerped position
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
  const prevSrc = useRef<string | null>(null)

  // Track image reveal state: 'entering' triggers the scale-in animation
  const [imgState, setImgState] = useState<'hidden' | 'entering' | 'visible'>('hidden')

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
    setPrefersReducedMotion(mq.matches)
    const handler = (e: MediaQueryListEvent) => setPrefersReducedMotion(e.matches)
    mq.addEventListener('change', handler)
    return () => mq.removeEventListener('change', handler)
  }, [])

  // Handle visibility and image changes
  useEffect(() => {
    if (isVisible && !wasVisible.current) {
      // First show — snap position to cursor
      lerpX.current = mouseX
      lerpY.current = mouseY
      prevLerpX.current = mouseX
      prevLerpY.current = mouseY
      velX.current = 0
      velY.current = 0
      // Two-frame trick: set hidden, let browser paint, then enter
      setImgState('hidden')
      requestAnimationFrame(() => {
        requestAnimationFrame(() => setImgState('entering'))
      })
    } else if (isVisible && prevSrc.current !== imageSrc) {
      // Switching image — reset to hidden, then re-enter after paint
      setImgState('hidden')
      requestAnimationFrame(() => {
        requestAnimationFrame(() => setImgState('entering'))
      })
    } else if (!isVisible && wasVisible.current) {
      setImgState('hidden')
    }

    wasVisible.current = isVisible
    prevSrc.current = imageSrc
  }, [isVisible, imageSrc, mouseX, mouseY])

  // rAF loop — lerp position + skew + parallax
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

      // Inner image parallax
      const imgParallaxX = Math.max(-32, Math.min(32, velX.current * -0.4))
      const imgParallaxY = Math.max(-32, Math.min(32, velY.current * -0.4))
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

  const isRevealed = imgState === 'entering'

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
        // Container is always "present" when visible — no scale on container
        opacity: isVisible ? 1 : 0,
        transition: isVisible ? 'none' : `opacity 0.2s ${EASING_EXIT}`,
      }}
    >
      {/* Reveal wrapper — entire preview scales 0→1 on each show/switch */}
      <div
        className="w-full h-full overflow-hidden"
        style={{
          borderRadius: 'var(--radius-component-md, 12px)',
          transformOrigin: 'top left',
          scale: isRevealed ? '1' : '0',
          transition: isRevealed
            ? `scale 0.4s ${EASING_ENTER}`
            : `scale 0.25s ${EASING_EXIT}`,
        }}
      >
        {imageSrc && (
          <img
            src={imageSrc}
            alt={alt}
            className="w-full h-full object-cover"
            style={{
              willChange: 'transform',
              scale: isRevealed ? '1.25' : '3',
              opacity: isRevealed ? 1 : 0,
              transition: isRevealed
                ? `scale 0.5s ${EASING_ENTER}, opacity 0.15s ${EASING_ENTER}`
                : `scale 0.2s ${EASING_EXIT}, opacity 0.1s ${EASING_EXIT}`,
            }}
            loading="eager"
          />
        )}
      </div>
    </div>
  )
}
