'use client'

import type { ProjectSection } from '@/content/types'
import { useScrollReveal } from '@/hooks/useScrollReveal'

interface ProjectGalleryStaggeredProps {
  section: ProjectSection
}

function RevealImage({ src, alt }: { src: string; alt: string }) {
  const { ref, clipPath } = useScrollReveal()
  return (
    <div
      ref={ref as React.RefObject<HTMLDivElement>}
      className="overflow-hidden rounded-[var(--radius-component-md,12px)] h-full"
      style={{ clipPath }}
    >
      <img
        src={src}
        alt={alt}
        loading="lazy"
        className="w-full h-full object-cover block"
      />
    </div>
  )
}

/**
 * Stagger positions within a 12-col grid (3 slots of 4 cols each).
 * Each image occupies one slot; the other two are empty.
 * Pattern: center → right → center → center (matches Figma reference).
 * col-start values: slot-left=1, slot-center=5, slot-right=9
 */
const STAGGER_COLS = [5, 9, 5, 1] as const

export function ProjectGalleryStaggered({ section }: ProjectGalleryStaggeredProps) {
  // Flatten all images from all rows into a single staggered list
  const allImages = (section.rows || []).flatMap(row => row.images)

  if (allImages.length === 0) return null

  return (
    <section className="py-24">
      <div className="flex flex-col gap-6">
        {allImages.map((imageSrc, i) => {
          const colStart = STAGGER_COLS[i % STAGGER_COLS.length]
          return (
            <div
              key={i}
              className="grid grid-cols-12 gap-5 px-5 md:px-8 lg:px-16"
            >
              <div
                className="col-span-4 h-[340px]"
                style={{ gridColumnStart: colStart }}
              >
                <RevealImage src={imageSrc} alt="" />
              </div>
            </div>
          )
        })}
      </div>
    </section>
  )
}
