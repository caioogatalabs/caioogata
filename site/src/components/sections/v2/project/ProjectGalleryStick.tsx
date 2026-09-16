'use client'

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

  if (slidesSrc.length === 0) return null

  // One behaviour at every width: the slides pin and stack. There used to be a
  // plain vertical list below a breakpoint, which turned the gallery into an
  // ordinary column of images on the screens most people read the site on.
  return (
    <section>
      <div
        ref={containerRef}
        className="relative"
        style={{ height: `${slidesSrc.length * 100}vh` }}
      >
        {/* The gutter is the page's own — px-5 / px-8, the same values the
            Grid uses — so a pinned slide lines up with every other block
            instead of bleeding to the screen edge. */}
        <div className="sticky top-0 h-screen flex items-center justify-center px-5 md:px-8 lg:px-8">
          <div className="relative w-full h-[min(800px,80vh)] overflow-hidden">
            {/* Static bg sheet — catches any gap behind released slides */}
            <div className="absolute inset-0 bg-bg" aria-hidden />
            {slidesSrc.map((src, i) => {
              const state = slides[i]
              if (!state) return null

              return (
                <div
                  key={i}
                  className="absolute inset-0 bg-bg flex items-center justify-center"
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
                    className="max-w-full max-h-full object-contain block"
                  />
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </section>
  )
}
