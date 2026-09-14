'use client'

import { useEffect, useRef, useState, useCallback } from 'react'

/**
 * Scroll progress, 0 to 1, for retiring a pinned element.
 *
 * The counterpart to `useScrollReveal`, which reveals an element as it enters.
 * This one drives an element that never moves: the hero is `sticky top-0`, so
 * its `getBoundingClientRect().top` is pinned at 0 and carries no scroll
 * signal. Progress therefore comes from `scrollY` measured in viewport heights,
 * which is also why — unlike the rest of the family — this hook takes no ref.
 *
 * It returns the raw number rather than a finished `clip-path`: the hero's
 * blocks leave on staggered windows and with different transforms, so each
 * derives its own value from this one reading.
 *
 * Returns 0 below `lg` and under reduced motion. Below `lg` the hero is a
 * normal block that scrolls away on its own, and an exit driven by page scroll
 * would eat it while it is still the only thing on screen.
 */
export function useScrollExitProgress({
  startFraction = 0.05,
  endFraction = 0.8,
  minWidth = 1024,
} = {}) {
  const [progress, setProgress] = useState(0)
  const [enabled, setEnabled] = useState(false)
  const tickingRef = useRef(false)

  const update = useCallback(() => {
    tickingRef.current = false

    const vh = window.innerHeight
    const start = vh * startFraction
    const end = vh * endFraction
    const raw = (window.scrollY - start) / (end - start)

    setProgress(Math.max(0, Math.min(1, raw)))
  }, [startFraction, endFraction])

  useEffect(() => {
    const wide = window.matchMedia(`(min-width: ${minWidth}px)`)
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)')

    let attached = false

    const onScroll = () => {
      if (!tickingRef.current) {
        tickingRef.current = true
        requestAnimationFrame(update)
      }
    }

    const apply = () => {
      const on = wide.matches && !reduced.matches
      setEnabled(on)

      if (on && !attached) {
        window.addEventListener('scroll', onScroll, { passive: true })
        window.addEventListener('resize', onScroll, { passive: true })
        attached = true
        update()
      } else if (!on && attached) {
        window.removeEventListener('scroll', onScroll)
        window.removeEventListener('resize', onScroll)
        attached = false
        setProgress(0)
      } else if (!on) {
        setProgress(0)
      }
    }

    apply()
    wide.addEventListener('change', apply)
    reduced.addEventListener('change', apply)

    return () => {
      if (attached) {
        window.removeEventListener('scroll', onScroll)
        window.removeEventListener('resize', onScroll)
      }
      wide.removeEventListener('change', apply)
      reduced.removeEventListener('change', apply)
    }
  }, [update, minWidth])

  return { progress, enabled }
}

/**
 * Slice of `progress` between two marks, renormalised to 0-1. Lets each block
 * own a window of the same scroll reading instead of every block leaving at once.
 */
export function slice(progress: number, from: number, to: number) {
  if (to <= from) return progress >= to ? 1 : 0
  return Math.max(0, Math.min(1, (progress - from) / (to - from)))
}
