'use client'

import type { ProjectSection } from '@/content/types'
import { Grid, GridItem } from '@/components/layout/Grid'
import { useScrollReveal } from '@/hooks/useScrollReveal'
import { useInView } from '@/hooks/useInView'

interface ProjectGalleryFullDetailProps {
  section: ProjectSection
}

function RevealImage({ src, alt }: { src: string; alt: string }) {
  const { ref, clipPath } = useScrollReveal()
  return (
    <div
      ref={ref as React.RefObject<HTMLDivElement>}
      className="overflow-hidden rounded-[var(--radius-component-md,12px)] min-h-screen"
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

export function ProjectGalleryFullDetail({ section }: ProjectGalleryFullDetailProps) {
  const inViewRef = useInView({ threshold: 0.1 })

  if (!section.image) return null

  const layout = section.layout || '4-8'
  const textSpan = layout === '4-8' ? 4 : 4
  const imageSpan = layout === '4-8' ? 8 : 8

  const textBlock = (
    <GridItem
      span={textSpan}
      tabletSpan={8}
      mobileSpan={4}
      className="flex flex-col justify-center"
    >
      {section.heading && (
        <h3
          className="text-[1.875rem] font-bold text-text-primary leading-[1.2] mb-4 -entrance -slide-up"
          style={{ fontFamily: 'var(--font-sans)' }}
        >
          {section.heading}
        </h3>
      )}
      {section.description && (
        <p className="text-base text-text-secondary leading-[1.5] -entrance -slide-up -a-1">
          {section.description}
        </p>
      )}
    </GridItem>
  )

  const imageBlock = (
    <GridItem span={imageSpan} tabletSpan={8} mobileSpan={4}>
      <RevealImage
        src={section.image.src}
        alt={section.image.title}
      />
    </GridItem>
  )

  return (
    <section ref={inViewRef} className="py-24 -entrance -slide-up">
      <Grid>
        {layout === '4-8' ? (
          <>
            {textBlock}
            {imageBlock}
          </>
        ) : (
          <>
            {imageBlock}
            {textBlock}
          </>
        )}
      </Grid>
    </section>
  )
}
