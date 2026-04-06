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

// Maps desktop span to tablet/mobile spans
function getResponsiveSpans(span: number) {
  switch (span) {
    case 12:
      return { tabletSpan: 8, mobileSpan: 4 }
    case 6:
      return { tabletSpan: 4, mobileSpan: 4 }
    case 4:
      return { tabletSpan: 8, mobileSpan: 4 }
    default:
      return { tabletSpan: 8, mobileSpan: 4 }
  }
}

export function ProjectGalleryStaggered({ section }: ProjectGalleryStaggeredProps) {
  const rows = section.rows || []

  if (rows.length === 0) return null

  return (
    <section className="py-24">
      <div className="space-y-6 md:space-y-4 lg:space-y-6">
        {rows.map((row, rowIndex) => (
          <Grid key={rowIndex} className="gap-6 md:gap-4 lg:gap-6">
            {row.images.map((imageSrc, imgIndex) => {
              const span = row.spans[imgIndex] ?? 12
              const { tabletSpan, mobileSpan } = getResponsiveSpans(span)
              return (
                <GridItem
                  key={imgIndex}
                  span={span}
                  tabletSpan={tabletSpan}
                  mobileSpan={mobileSpan}
                >
                  <RevealImage src={imageSrc} alt="" />
                </GridItem>
              )
            })}
          </Grid>
        ))}
      </div>
    </section>
  )
}
