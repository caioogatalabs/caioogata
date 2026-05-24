'use client'

import { useEffect, useRef, useState } from 'react'

/**
 * Scroll-progress hook for the /experience pinned hero.
 *
 * Returns a `progress` value in [0, 1] mapping the position of `outerRef`
 * within the viewport — 0 when the container's top reaches viewport top,
 * 1 when its bottom reaches the viewport bottom (the moment the inner
 * sticky pin releases).
 *
 * Design follows the rAF + ticking-flag pattern from `useScrollVideo`
 * minus the canvas/frame logic.
 *
 * Bypass conditions (set progress = 1, skip rAF loop entirely):
 *   1. `prefers-reduced-motion: reduce` — visual motion suppressed.
 *   2. Mobile (`window.innerWidth < 768`) — pin disabled by spec; cards
 *      stack vertically with normal entrance stagger instead.
 *
 * Mobile bypass is evaluated on mount only (no resize re-eval). This is
 * an acceptable trade-off given that page reload is the typical UX when
 * crossing the breakpoint.
 *
 * `reducedMotion` is surfaced separately so the consumer can resolve the
 * spec ambiguity around the final visible state (cards aligned but NOT
 * faded — see ExperienceHero for the mapping that overrides progress to
 * the hold-phase value 0.75 when reduced motion is on).
 */
export function useExperienceHero(): {
  outerRef: React.RefObject<HTMLDivElement | null>
  progress: number
  reducedMotion: boolean
} {
  const outerRef = useRef<HTMLDivElement>(null)
  const tickingRef = useRef(false)
  const [progress, setProgress] = useState(0)
  const [reducedMotion, setReducedMotion] = useState(false)

  useEffect(() => {
    const prefersReduced = window.matchMedia(
      '(prefers-reduced-motion: reduce)'
    ).matches
    const isMobile = window.innerWidth < 768

    if (prefersReduced) {
      setReducedMotion(true)
      // Final-state progress; the consumer (ExperienceHero) will remap
      // this to the hold phase (0.75) so cards remain visible.
      setProgress(1)
      return
    }

    if (isMobile) {
      // Mobile bypass — cards stack vertically with normal entrance
      // stagger; progress=1 keeps the math safe but the consumer
      // ignores progress entirely on mobile.
      setProgress(1)
      return
    }

    const update = () => {
      const container = outerRef.current
      if (!container) {
        tickingRef.current = false
        return
      }

      const rect = container.getBoundingClientRect()
      const vh = window.innerHeight
      const scrollable = rect.height - vh
      const scrolled = -rect.top
      const p =
        scrollable > 0
          ? Math.max(0, Math.min(1, scrolled / scrollable))
          : 0

      setProgress(p)
      tickingRef.current = false
    }

    const onScroll = () => {
      if (!tickingRef.current) {
        tickingRef.current = true
        requestAnimationFrame(update)
      }
    }

    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll, { passive: true })

    // Initial measurement
    update()

    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
    }
  }, [])

  return { outerRef, progress, reducedMotion }
}
