'use client'

import { useState, useEffect } from 'react'

interface FloatingPreviewProps {
  imageSrc: string | null
  alt: string
  mouseX: number
  mouseY: number
  velocityX: number
}

export function FloatingPreview({
  imageSrc,
  alt,
  mouseX,
  mouseY,
  velocityX,
}: FloatingPreviewProps) {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false)

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
    setPrefersReducedMotion(mq.matches)
    const handler = (e: MediaQueryListEvent) => setPrefersReducedMotion(e.matches)
    mq.addEventListener('change', handler)
    return () => mq.removeEventListener('change', handler)
  }, [])

  const isVisible = imageSrc !== null
  const clampedSkew = prefersReducedMotion
    ? 0
    : Math.max(-30, Math.min(30, velocityX * 0.1))

  const offsetX = 20
  const offsetY = -20

  const transitionValue = prefersReducedMotion
    ? 'opacity 0.1s linear'
    : 'opacity 0.2s var(--ease-smooth), transform 0.3s var(--ease-out)'

  return (
    <div
      className="hidden lg:block pointer-events-none fixed z-[100] overflow-hidden"
      style={{
        width: 500,
        height: 300,
        borderRadius: 'var(--radius-component-md, 12px)',
        willChange: 'transform',
        transform: `translate3d(${mouseX + offsetX}px, ${mouseY + offsetY}px, 0) skewX(${clampedSkew}deg) scale(${isVisible ? 1 : 0.8})`,
        opacity: isVisible ? 1 : 0,
        transition: transitionValue,
      }}
    >
      {imageSrc ? (
        <img
          src={imageSrc}
          alt={alt}
          className="w-full h-full object-cover"
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
