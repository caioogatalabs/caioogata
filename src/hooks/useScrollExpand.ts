'use client'

import { useEffect, useRef, useState, useCallback } from 'react'

export function useScrollExpand({
  startFraction = 0.85,
  endFraction = 0.3,
} = {}) {
  const ref = useRef<HTMLElement>(null)
  const [clipPath, setClipPath] = useState('polygon(50% 100%, 50% 100%, 50% 100%, 50% 100%)')
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

    const tl = `${50 - 50 * p}% ${100 - 100 * p}%`
    const tr = `${50 + 50 * p}% ${100 - 100 * p}%`
    const br = `${50 + 50 * p}% 100%`
    const bl = `${50 - 50 * p}% 100%`

    setClipPath(`polygon(${tl}, ${tr}, ${br}, ${bl})`)
    setOpacity(p)
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
