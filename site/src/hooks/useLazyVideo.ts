'use client'

import { useEffect, useRef, useState } from 'react'

/**
 * Defers a looping background video's network cost until it's about to be
 * useful, then keeps play/pause in sync with actual visibility.
 *
 * Two separate observers, because "worth downloading" and "worth decoding
 * right now" are different questions:
 * - Loading is a one-way gate keyed to `rootMargin: '100% 0px'` — about one
 *   viewport of lead time before the element arrives on screen. Once it
 *   fires, `src` is set and stays set; the element never reverts to
 *   unloaded, so a quick scroll past and back doesn't re-trigger a fetch.
 * - Play/pause tracks plain visibility (no margin) for as long as the
 *   component is mounted, so a loop stops decoding frames off-screen and
 *   resumes when it's back, without touching the network again.
 *
 * `poster` carries the element's appearance (and its layout box, for callers
 * sized by the video's own intrinsic size) until `src` is attached.
 */
export function useLazyVideo<T extends HTMLVideoElement>(src: string) {
  const ref = useRef<T>(null)
  const [videoSrc, setVideoSrc] = useState<string | undefined>(undefined)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    const loadObserver = new IntersectionObserver(
      entries => {
        if (entries.some(entry => entry.isIntersecting)) {
          setVideoSrc(src)
          loadObserver.disconnect()
        }
      },
      { rootMargin: '100% 0px' }
    )
    loadObserver.observe(el)
    return () => loadObserver.disconnect()
  }, [src])

  useEffect(() => {
    const el = ref.current
    if (!el || !videoSrc) return

    const playObserver = new IntersectionObserver(entries => {
      if (entries.some(entry => entry.isIntersecting)) {
        el.play().catch(() => {})
      } else {
        el.pause()
      }
    })
    playObserver.observe(el)
    return () => playObserver.disconnect()
  }, [videoSrc])

  return { ref, videoSrc, preload: (videoSrc ? 'metadata' : 'none') as 'metadata' | 'none' }
}
