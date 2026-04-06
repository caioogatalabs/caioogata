'use client'

import { useEffect, useRef, useState, useCallback } from 'react'

/**
 * Scroll-driven parallax translateY hook.
 * Image drifts opposite to scroll direction, clamped to +/-20px.
 * Disabled when prefers-reduced-motion is active.
 */
export function useScrollParallax({ factor = 0.1 } = {}) {
  const ref = useRef<HTMLElement>(null)
  const [transform, setTransform] = useState('translateY(0px)')
  const tickingRef = useRef(false)

  const update = useCallback(() => {
    const el = ref.current
    if (!el) return
    const rect = el.getBoundingClientRect()
    const vh = window.innerHeight
    // Center of element relative to viewport center
    const center = rect.top + rect.height / 2 - vh / 2
    // Invert so image drifts opposite to scroll direction
    const offset = Math.round(center * factor * -1)
    // Clamp to +/-20px per UI-SPEC
    const clamped = Math.max(-20, Math.min(20, offset))
    setTransform(`translateY(${clamped}px)`)
    tickingRef.current = false
  }, [factor])

  useEffect(() => {
    const el = ref.current
    if (!el) return

    const prefersReduced = window.matchMedia(
      '(prefers-reduced-motion: reduce)'
    ).matches

    if (prefersReduced) {
      setTransform('translateY(0px)')
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

  return { ref, transform }
}
