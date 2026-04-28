'use client'

import { useEffect, useRef, useState, useCallback } from 'react'

export interface SlideState {
  /** 0 = fully visible position, 100 = off-screen below */
  translateY: number
  /** 1 = full size, 0.95 = released/covered */
  scale: number
  /** 1 = fully visible, 0.6 = released/covered */
  opacity: number
}

/**
 * Scroll-linked slide-stack driver for sticky gallery.
 *
 * Subsequent images slide up from below (translateY 100%→0%) covering the previous one.
 * The current slide's release runs IN SYNC with the next slide's entry — as the next
 * slide rises, the current one shrinks (scale→0.95) and fades (opacity→0). This gives
 * the perception of the whole container "moving back" while the new one advances.
 *
 * Because previous slides fade to fully transparent (not 0.6), wrapper-level opacity
 * is safe — there's nothing visible underneath to leak through. A bg-bg sheet on the
 * sticky container catches anything beneath the lowest slide.
 *
 * Container ref must wrap the tall scroll-zone (slideCount * 100vh).
 */
export function useScrollStick(slideCount: number) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [slides, setSlides] = useState<SlideState[]>(() =>
    Array.from({ length: slideCount }, (_, i) => ({
      translateY: i === 0 ? 0 : 100,
      scale: 1,
      opacity: 1,
    }))
  )
  const tickingRef = useRef(false)

  const update = useCallback(() => {
    const el = containerRef.current
    if (!el) return

    const rect = el.getBoundingClientRect()
    const vh = window.innerHeight
    const totalScroll = rect.height - vh
    const scrolled = -rect.top
    const progress = Math.max(0, Math.min(1, scrolled / totalScroll))

    const newSlides = Array.from({ length: slideCount }, (_, i) => {
      // Each slide transition occupies an equal slice of scroll progress
      // Slide i begins entering at progress = i / slideCount
      // and is fully in place at progress = (i + 1) / slideCount
      const transitionStart = i / slideCount
      const transitionEnd = (i + 1) / slideCount
      const transitionRange = transitionEnd - transitionStart

      // --- translateY: how far from final position ---
      let translateY: number
      if (i === 0) {
        // First slide is always in place
        translateY = 0
      } else if (progress <= transitionStart) {
        // Haven't reached this slide yet — off-screen below
        translateY = 100
      } else if (progress >= transitionEnd) {
        // Past this slide's transition — fully in place
        translateY = 0
      } else {
        // Sliding in: 100% → 0% over the transition zone
        const t = (progress - transitionStart) / transitionRange
        translateY = 100 * (1 - t)
      }

      // --- scale + opacity: "release" effect, synced with next slide's entry ---
      // Slide i releases during slide i+1's slide-in window — so the user actually
      // SEES this slide receding (top of viewport) while the next one advances (bottom).
      const nextStart = (i + 1) / slideCount
      const nextEnd = (i + 2) / slideCount
      let scale = 1
      let opacity = 1

      if (i < slideCount - 1 && progress > nextStart) {
        const releaseProgress = Math.min(1, (progress - nextStart) / (nextEnd - nextStart))
        scale = 1 - 0.08 * releaseProgress     // 1 → 0.92
        opacity = 1 - releaseProgress           // 1 → 0
      }

      return { translateY, scale, opacity }
    })

    setSlides(newSlides)
    tickingRef.current = false
  }, [slideCount])

  useEffect(() => {
    const el = containerRef.current
    if (!el) return

    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (prefersReduced) {
      setSlides(Array.from({ length: slideCount }, () => ({
        translateY: 0,
        scale: 1,
        opacity: 1,
      })))
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
  }, [update, slideCount])

  return { containerRef, slides }
}
