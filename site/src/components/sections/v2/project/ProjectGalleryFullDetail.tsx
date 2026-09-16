'use client'

import type { ProjectSection } from '@/content/types'
import { Grid, GridItem } from '@/components/layout/Grid'
import { useScrollReveal } from '@/hooks/useScrollReveal'
import { useInView } from '@/hooks/useInView'
import { LABEL, LABEL_TYPE } from '@/components/ui/label'

interface ProjectGalleryFullDetailProps {
  section: ProjectSection
}

function RevealImage({ src, alt }: { src: string; alt: string }) {
  const { ref, clipPath } = useScrollReveal()
  return (
    <div
      ref={ref as React.RefObject<HTMLDivElement>}
      className="overflow-hidden min-h-screen"
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

  const textBlock = (
    <GridItem span={2} start={11} tabletSpan={8} mobileSpan={4} className="flex flex-col gap-3">
      {section.heading && (
        <h3 className={`${LABEL} -entrance -slide-up`}>{section.heading}</h3>
      )}
      {section.description && (
        <p className={`${LABEL_TYPE} -entrance -slide-up -a-1`}>{section.description}</p>
      )}
    </GridItem>
  )

  const imageBlock = (
    <GridItem span={6} start={5} tabletSpan={8} mobileSpan={4}>
      <RevealImage
        src={section.image.src}
        alt={section.image.title}
      />
    </GridItem>
  )

  return (
    <section ref={inViewRef} className="py-8 -entrance -slide-up">
      <Grid>
        {imageBlock}
        {textBlock}
      </Grid>
    </section>
  )
}
