'use client'

import type { ProjectSection } from '@/content/types'
import { Grid, GridItem } from '@/components/layout/Grid'
import { useScrollReveal } from '@/hooks/useScrollReveal'

interface ProjectGalleryStaggeredProps {
  section: ProjectSection
}

function RevealImage({ src, alt }: { src: string; alt: string }) {
  const { ref, clipPath } = useScrollReveal()
  return (
    <div
      ref={ref as React.RefObject<HTMLDivElement>}
      className="overflow-hidden rounded-[var(--radius-component-md,12px)]"
      style={{ clipPath }}
    >
      <img
        src={src}
        alt={alt}
        loading="lazy"
        className="w-full h-auto block"
      />
    </div>
  )
}

// Staggered column offsets: cycles through left(1), center(5), right(9)
const STAGGER_OFFSETS = [
  'lg:col-start-2',   // left-ish
  'lg:col-start-5',   // center
  'lg:col-start-9',   // right
  'lg:col-start-5',   // center
]

export function ProjectGalleryStaggered({ section }: ProjectGalleryStaggeredProps) {
  // Flatten all images from rows into a single list
  const allImages = (section.rows || []).flatMap(row => row.images)

  if (allImages.length === 0) return null

  return (
    <section className="py-24">
      <div className="space-y-6">
        {allImages.map((imageSrc, i) => (
          <Grid key={i}>
            <GridItem
              span={4}
              tabletSpan={4}
              mobileSpan={4}
              className={STAGGER_OFFSETS[i % STAGGER_OFFSETS.length]}
            >
              <RevealImage src={imageSrc} alt="" />
            </GridItem>
          </Grid>
        ))}
      </div>
    </section>
  )
}
