'use client'

import { useEffect, useRef, useState, useCallback } from 'react'

/**
 * Scroll-linked vertical clip-path reveal (top → bottom).
 * The reveal starts when the element's top edge is `startOffset` px
 * below the viewport bottom, and completes when it reaches `endFraction`
 * of the viewport height from the top.
 */
export function useScrollReveal({
  startFraction = 0.85,
  endFraction = 0.3,
} = {}) {
  const ref = useRef<HTMLElement>(null)
  const [clipPath, setClipPath] = useState('inset(0 0 100% 0 round 12px)')
  const tickingRef = useRef(false)

  const update = useCallback(() => {
    const el = ref.current
    if (!el) return

    const rect = el.getBoundingClientRect()
    const vh = window.innerHeight

    // Start: element top reaches middle of viewport (startFraction)
    // End: element top reaches endFraction of viewport from top
    const start = vh * startFraction
    const end = vh * endFraction
    const progress = 1 - (rect.top - end) / (start - end)
    const clamped = Math.max(0, Math.min(1, progress))
    // inset(top right bottom left round radius)
    // bottom clips from 100% (hidden) to 0% (fully revealed)
    const bottom = (1 - clamped) * 100

    setClipPath(`inset(0 0 ${bottom}% 0 round 12px)`)
    tickingRef.current = false
  }, [startFraction, endFraction])

  useEffect(() => {
    const el = ref.current
    if (!el) return

    const prefersReduced = window.matchMedia(
      '(prefers-reduced-motion: reduce)'
    ).matches

    if (prefersReduced) {
      setClipPath('inset(0 0 0 0 round 12px)')
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

  return { ref, clipPath }
}
