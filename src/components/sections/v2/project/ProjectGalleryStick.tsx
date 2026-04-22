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
  const slidesSrc: string[] = rows.map(row => {
    const img = row.images[0]
    if (!img) return ''
    return typeof img === 'string' ? img : img.src
  }).filter(Boolean)

  const { containerRef, slides } = useScrollStick(slidesSrc.length || 1)
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const mql = window.matchMedia('(max-width: 767px)')
    setIsMobile(mql.matches)
    const handler = (e: MediaQueryListEvent) => setIsMobile(e.matches)
    mql.addEventListener('change', handler)
    return () => mql.removeEventListener('change', handler)
  }, [])

  if (slidesSrc.length === 0) return null

  // Mobile fallback: vertical image stack (no sticky)
  if (isMobile) {
    return (
      <section className="py-24">
        <div className="flex flex-col gap-4">
          {slidesSrc.map((src, i) => (
            <img key={i} src={src} alt="" loading="lazy" className="w-full block" />
          ))}
        </div>
      </section>
    )
  }

  // Desktop/tablet: sticky slide-stack gallery
  return (
    <section>
      <div
        ref={containerRef}
        className="relative"
        style={{ height: `${slidesSrc.length * 100}vh` }}
      >
        <div className="sticky top-0 h-screen overflow-hidden">
          {slidesSrc.map((src, i) => {
            const state = slides[i]
            if (!state) return null

            return (
              <div
                key={i}
                className="absolute inset-0 flex items-center justify-center"
                style={{
                  transform: `translateY(${state.translateY}%) scale(${state.scale})`,
                  opacity: state.opacity,
                  zIndex: i,
                  willChange: 'transform, opacity',
                }}
              >
                <img
                  src={src}
                  alt=""
                  loading={i === 0 ? 'eager' : 'lazy'}
                  className="max-w-full max-h-[85vh] object-contain block"
                />
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
