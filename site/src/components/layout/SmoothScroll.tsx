'use client'

import { useEffect } from 'react'
import Lenis from 'lenis'

let instance: Lenis | null = null

/**
 * The live Lenis instance, or null when smooth scroll is off (reduced motion,
 * or before mount). Anything that needs to lock the page — a full-screen menu,
 * a modal — has to go through Lenis: it drives scroll itself, so `overflow:
 * hidden` on the body does not stop it.
 */
export function getLenis() {
  return instance
}

export function SmoothScroll() {
  useEffect(() => {
    if (typeof window === 'undefined') return

    // A reload lands where the page begins, not where the reader left off.
    // The browser restores the old offset before the scroll-driven transforms
    // have measured anything, and its scroll anchoring then adds to that as
    // fonts and media settle: reloading /about walked the portrait and the
    // paragraph further up every time (400 → 537 → 721px of scroll). A hash
    // target is left alone — only a bare load is reset.
    if ('scrollRestoration' in history) history.scrollRestoration = 'manual'
    if (!window.location.hash) window.scrollTo(0, 0)

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    // `anchors` is what makes `#projects` / `#contact` work at all: Lenis owns
    // the scroll position, so the browser's own jump to a hash is written back
    // on the next frame and the page never moves. Its scrollTo reads the root's
    // `scroll-padding-top`, which globals.css ties to `--header-h` — so the
    // target lands clear of the sticky bar without a second offset here.
    const lenis = new Lenis({ lerp: 0.1, smoothWheel: true, anchors: true })
    instance = lenis
    let rafId = 0
    const raf = (time: number) => {
      lenis.raf(time)
      rafId = requestAnimationFrame(raf)
    }
    rafId = requestAnimationFrame(raf)

    return () => {
      cancelAnimationFrame(rafId)
      lenis.destroy()
      instance = null
    }
  }, [])

  return null
}
