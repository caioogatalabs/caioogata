'use client'

import type { ProjectSection } from '@/content/types'
import { Grid, GridItem } from '@/components/layout/Grid'
import { useScrollReveal } from '@/hooks/useScrollReveal'
import { useScrollParallax } from '@/hooks/useScrollParallax'

interface ProjectGalleryFeatureListProps {
  section: ProjectSection
}

function ParallaxRevealImage({ src, alt }: { src: string; alt: string }) {
  const { ref: revealRef, clipPath } = useScrollReveal()
  const { ref: parallaxRef, transform } = useScrollParallax({ factor: 0.1 })

  return (
    <div
      ref={revealRef as React.RefObject<HTMLDivElement>}
      className="overflow-hidden rounded-[var(--radius-component-md,12px)]"
      style={{ clipPath }}
    >
      <div ref={parallaxRef as React.RefObject<HTMLDivElement>}>
        <img
          src={src}
          alt={alt}
          loading="lazy"
          className="w-full h-auto block"
          style={{ transform }}
        />
      </div>
    </div>
  )
}

export function ProjectGalleryFeatureList({ section }: ProjectGalleryFeatureListProps) {
  const features = section.features || []

  if (features.length === 0) return null

  return (
    <section className="py-24">
      <div className="space-y-24">
        {features.map((feature, index) => (
          <Grid key={index}>
            <GridItem span={3} tabletSpan={8} mobileSpan={4}>
              <p className="font-mono text-xs uppercase tracking-wider text-text-tertiary">
                {feature.name}
              </p>
            </GridItem>
            <GridItem span={6} tabletSpan={8} mobileSpan={4}>
              <ParallaxRevealImage
                src={feature.image.src}
                alt={feature.image.title}
              />
            </GridItem>
            <GridItem span={3} tabletSpan={8} mobileSpan={4}>
              <p className="text-sm text-text-secondary">
                {feature.description}
              </p>
            </GridItem>
          </Grid>
        ))}
      </div>
    </section>
  )
}
