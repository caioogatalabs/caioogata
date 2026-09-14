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
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    const lenis = new Lenis({ lerp: 0.1, smoothWheel: true })
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
