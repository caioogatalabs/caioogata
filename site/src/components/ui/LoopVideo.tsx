'use client'

import { useEffect, useState } from 'react'

/**
 * A local screen recording (e.g. a menu in use): muted, looping, inline, so it
 * autoplays like an image would sit. Under reduced motion it never starts and
 * the poster stands in for it.
 */
export function LoopVideo({ src, poster, title }: { src: string; poster?: string; title: string }) {
  const [reduced, setReduced] = useState(false)

  useEffect(() => {
    setReduced(window.matchMedia('(prefers-reduced-motion: reduce)').matches)
  }, [])

  if (reduced && poster) {
    return <img src={poster} alt={title} loading="lazy" className="w-full h-auto block" />
  }

  return (
    <video
      src={src}
      poster={poster}
      aria-label={title}
      autoPlay={!reduced}
      muted
      loop
      playsInline
      preload="metadata"
      className="w-full h-auto block"
    />
  )
}
