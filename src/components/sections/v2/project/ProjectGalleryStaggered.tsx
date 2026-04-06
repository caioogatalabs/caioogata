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

export function ProjectGalleryStaggered({ section }: ProjectGalleryStaggeredProps) {
  // Flatten all images from rows into a single list
  const allImages = (section.rows || []).flatMap(row => row.images)

  if (allImages.length === 0) return null

  return (
    <section className="py-24">
      <Grid className="gap-5">
        {allImages.map((imageSrc, i) => (
          <GridItem
            key={i}
            span={4}
            tabletSpan={4}
            mobileSpan={4}
          >
            <RevealImage src={imageSrc} alt="" />
          </GridItem>
        ))}
      </Grid>
    </section>
  )
}
