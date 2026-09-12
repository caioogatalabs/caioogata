'use client'

import { useEffect, useRef, useState, useCallback } from 'react'


/**
 * Scroll-linked clip-path wipe that hides a pinned element from the bottom up.
 *
 * The counterpart to `useScrollReveal`, which reveals an element as it enters.
 * This one retires an element that never moves: the hero is `sticky top-0`, so
 * its `getBoundingClientRect().top` is pinned at 0 and carries no scroll signal.
 * Progress therefore comes from `scrollY` measured in viewport heights.
 *
 * Only applies from `lg` up. Below that the hero is a normal block that scrolls
 * away on its own, and a mask driven by page scroll would eat it while it is
 * still the only thing on screen.
 */
export function useScrollMaskOut({
  startFraction = 0.05,
  endFraction = 0.8,
  minWidth = 1024,
} = {}) {
  const [clipPath, setClipPath] = useState<string | undefined>(undefined)
  const [progress, setProgress] = useState(0)
  const tickingRef = useRef(false)

  const update = useCallback(() => {
    tickingRef.current = false

    const vh = window.innerHeight
    const start = vh * startFraction
    const end = vh * endFraction
    const raw = (window.scrollY - start) / (end - start)
    const clamped = Math.max(0, Math.min(1, raw))

    setProgress(clamped)
    // inset(top right bottom left) — growing the BOTTOM inset retires the
    // element upwards, so the labels go first and the headline last.
    setClipPath(`inset(0 0 ${clamped * 100}% 0)`)
  }, [startFraction, endFraction])

  useEffect(() => {
    const wide = window.matchMedia(`(min-width: ${minWidth}px)`)
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)')

    const apply = () => {
      if (!wide.matches || reduced.matches) {
        // No mask at all: leave the element to the normal flow.
        setClipPath(undefined)
        setProgress(0)
        return false
      }
      update()
      return true
    }

    if (!apply()) {
      wide.addEventListener('change', apply)
      reduced.addEventListener('change', apply)
      return () => {
        wide.removeEventListener('change', apply)
        reduced.removeEventListener('change', apply)
      }
    }

    const onScroll = () => {
      if (!tickingRef.current) {
        tickingRef.current = true
        requestAnimationFrame(update)
      }
    }

    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll, { passive: true })
    wide.addEventListener('change', apply)
    reduced.addEventListener('change', apply)

    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
      wide.removeEventListener('change', apply)
      reduced.removeEventListener('change', apply)
    }
  }, [update, minWidth])

  // No ref, unlike the rest of the scroll-linked family: the hero is pinned, so
  // there is nothing useful to measure on the element. Page scroll is the input.
  return { clipPath, progress }
}
