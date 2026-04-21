'use client'

import { useEffect, useState } from 'react'
import type { ProjectSection } from '@/content/types'
import { useScrollStick } from '@/hooks/useScrollStick'

interface ProjectGalleryStickProps {
  section: ProjectSection
}

export function ProjectGalleryStick({ section }: ProjectGalleryStickProps) {
  const rows = section.rows || []

  // Extract slide images: first image from each row
  const slides: string[] = rows.map(row => {
    const img = row.images[0]
    if (!img) return ''
    return typeof img === 'string' ? img : img.src
  }).filter(Boolean)

  const { containerRef, opacities } = useScrollStick(slides.length || 1)
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const mql = window.matchMedia('(max-width: 767px)')
    setIsMobile(mql.matches)
    const handler = (e: MediaQueryListEvent) => setIsMobile(e.matches)
    mql.addEventListener('change', handler)
    return () => mql.removeEventListener('change', handler)
  }, [])

  if (slides.length === 0) return null

  // Mobile fallback: vertical image stack (no sticky)
  if (isMobile) {
    return (
      <section className="py-24">
        <div className="flex flex-col gap-4">
          {slides.map((src, i) => (
            <img key={i} src={src} alt="" loading="lazy" className="w-full object-cover block" />
          ))}
        </div>
      </section>
    )
  }

  // Desktop/tablet: sticky gallery
  return (
    <section>
      <div
        ref={containerRef}
        className="relative"
        style={{ height: `${slides.length * 100}vh` }}
      >
        <div className="sticky top-0 h-screen overflow-hidden">
          {slides.map((src, i) => (
            <img
              key={i}
              src={src}
              alt=""
              loading={i === 0 ? 'eager' : 'lazy'}
              className="absolute inset-0 w-full h-full object-cover block"
              style={{ opacity: opacities[i] ?? 0 }}
            />
          ))}
        </div>
      </div>
    </section>
  )
}
