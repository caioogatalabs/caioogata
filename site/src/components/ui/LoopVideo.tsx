'use client'

import { useEffect, useState } from 'react'
import { useLazyVideo } from '@/hooks/useLazyVideo'

/**
 * A local screen recording (e.g. a menu in use): muted, looping, inline, so it
 * plays like an image would sit. Under reduced motion it never starts and the
 * poster stands in for it. Otherwise loading and playback are gated by
 * `useLazyVideo` — no network cost until the element is about to scroll into
 * view (see that hook for the two-observer rationale).
 */
export function LoopVideo({ src, poster, title }: { src: string; poster?: string; title: string }) {
  const [reduced, setReduced] = useState(false)
  const { ref, videoSrc, preload } = useLazyVideo<HTMLVideoElement>(src)

  useEffect(() => {
    setReduced(window.matchMedia('(prefers-reduced-motion: reduce)').matches)
  }, [])

  if (reduced && poster) {
    return <img src={poster} alt={title} loading="lazy" className="w-full h-auto block" />
  }

  return (
    <video
      ref={ref}
      src={videoSrc}
      poster={poster}
      aria-label={title}
      muted
      loop
      playsInline
      preload={preload}
      className="w-full h-auto block"
    />
  )
}
