'use client'

import { useEffect, useRef, useState, useCallback } from 'react'

/**
 * Scroll-linked opacity driver for sticky gallery.
 * Maps scroll position to an array of opacities, one per slide.
 * Container ref must wrap the tall scroll-zone container (slideCount * 100vh).
 */
export function useScrollStick(slideCount: number) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [opacities, setOpacities] = useState<number[]>(() =>
    Array.from({ length: slideCount }, (_, i) => (i === 0 ? 1 : 0))
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

    const crossfadeZone = 0.2 / slideCount

    const newOpacities = Array.from({ length: slideCount }, (_, i) => {
      const slideStart = i / slideCount
      const slideEnd = (i + 1) / slideCount

      // Fully visible in the core zone
      if (progress >= slideStart + crossfadeZone && progress <= slideEnd - crossfadeZone) return 1

      // Fade in zone (entering from previous slide)
      if (progress >= slideStart - crossfadeZone && progress < slideStart + crossfadeZone) {
        if (i === 0 && progress <= slideStart) return 1 // first slide starts visible
        return Math.max(0, Math.min(1, (progress - (slideStart - crossfadeZone)) / (crossfadeZone * 2)))
      }

      // Fade out zone (leaving to next slide)
      if (progress > slideEnd - crossfadeZone && progress <= slideEnd + crossfadeZone) {
        if (i === slideCount - 1 && progress >= slideEnd) return 1 // last slide stays visible
        return Math.max(0, Math.min(1, 1 - (progress - (slideEnd - crossfadeZone)) / (crossfadeZone * 2)))
      }

      // Outside range
      if (progress < slideStart - crossfadeZone) return i === 0 ? 1 : 0
      if (progress > slideEnd + crossfadeZone) return i === slideCount - 1 ? 1 : 0

      return 0
    })

    setOpacities(newOpacities)
    tickingRef.current = false
  }, [slideCount])

  useEffect(() => {
    const el = containerRef.current
    if (!el) return

    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (prefersReduced) {
      // All slides visible stacked — no crossfade
      setOpacities(Array.from({ length: slideCount }, () => 1))
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

  return { containerRef, opacities }
}
