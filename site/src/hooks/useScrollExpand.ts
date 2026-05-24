'use client'

import { useEffect, useRef, useState, useCallback } from 'react'

function ease(t: number, power: number): number {
  return Math.pow(t, power)
}

/**
 * Scroll-linked polygon clip-path expand with distorted corners.
 * Each polygon vertex moves at a different rate for organic expansion.
 * Bottom Y is always 100% to avoid bottom clipping.
 */
export function useScrollExpand({
  startFraction = 0.95,
  endFraction = 0.1,
} = {}) {
  const ref = useRef<HTMLElement>(null)
  const [clipPath, setClipPath] = useState('polygon(40% 60%, 60% 60%, 60% 100%, 40% 100%)')
  const [opacity, setOpacity] = useState(0)
  const tickingRef = useRef(false)

  const update = useCallback(() => {
    const el = ref.current
    if (!el) return

    const rect = el.getBoundingClientRect()
    const vh = window.innerHeight

    const start = vh * startFraction
    const end = vh * endFraction
    const progress = 1 - (rect.top - end) / (start - end)
    const p = Math.max(0, Math.min(1, progress))

    // Start: 40%,60% → 60%,100% (small rect hidden behind 75% image)
    // End: 0%,0% → 100%,100% (full rect)
    // Each corner has different easing for organic distortion

    // Top-left: 40,60 → 0,0 — slowest (arrives last)
    const tlX = 40 - 40 * ease(p, 1.6)
    const tlY = 60 - 60 * ease(p, 1.8)

    // Top-right: 60,60 → 100,0 — medium
    const trX = 60 + 40 * ease(p, 1.2)
    const trY = 60 - 60 * ease(p, 1.4)

    // Bottom-right: 60,100 → 100,100 — fast (arrives first)
    const brX = 60 + 40 * ease(p, 0.8)

    // Bottom-left: 40,100 → 0,100 — fast but trails BR
    const blX = 40 - 40 * ease(p, 1.0)

    setClipPath(
      `polygon(${tlX}% ${tlY}%, ${trX}% ${trY}%, ${brX}% 100%, ${blX}% 100%)`
    )
    setOpacity(Math.min(1, p * 2))
    tickingRef.current = false
  }, [startFraction, endFraction])

  useEffect(() => {
    const el = ref.current
    if (!el) return

    const prefersReduced = window.matchMedia(
      '(prefers-reduced-motion: reduce)'
    ).matches

    if (prefersReduced) {
      setClipPath('polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)')
      setOpacity(1)
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
    update()

    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
    }
  }, [update])

  return { ref, clipPath, opacity }
}
