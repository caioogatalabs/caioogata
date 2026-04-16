'use client'

import type { ProjectSection, ProjectImage } from '@/content/types'
import { Grid, GridItem } from '@/components/layout/Grid'
import { useScrollReveal } from '@/hooks/useScrollReveal'
import { useScrollParallax } from '@/hooks/useScrollParallax'
import VideoEmbed from '@/components/ui/VideoEmbed'

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

function FeatureMedia({ image }: { image: ProjectImage }) {
  if (image.type === 'video' && image.videoId && image.platform) {
    return (
      <div className="overflow-hidden rounded-[var(--radius-component-md,12px)]">
        <div className="relative w-full" style={{ paddingBottom: '56.25%' }}>
          <div className="absolute inset-0">
            <VideoEmbed platform={image.platform} videoId={image.videoId} centeredButton />
          </div>
        </div>
      </div>
    )
  }

  if (image.type === 'figma' && image.figmaEmbedUrl) {
    return (
      <div className="overflow-hidden rounded-[var(--radius-component-md,12px)]">
        <iframe
          src={image.figmaEmbedUrl}
          title={image.title}
          className="w-full border-0"
          style={{ height: '450px' }}
          loading="lazy"
          allowFullScreen
        />
      </div>
    )
  }

  return <ParallaxRevealImage src={image.src} alt={image.title} />
}

export function ProjectGalleryFeatureList({ section }: ProjectGalleryFeatureListProps) {
  const features = section.features || []

  if (features.length === 0) return null

  return (
    <section className="py-24">
      <div className="space-y-16">
        {features.map((feature, index) => (
          <Grid key={index}>
            <GridItem span={4} tabletSpan={8} mobileSpan={4}>
              <div className="flex flex-col justify-between h-[410px]">
                <p className="font-mono text-xs uppercase tracking-[0.6px] text-text-tertiary">
                  {feature.name}
                </p>
                <p
                  className="text-[48px] leading-[1.15] tracking-[-0.96px] text-text-tertiary"
                  style={{ fontFamily: 'var(--font-sans)' }}
                >
                  {feature.name}
                </p>
                <div className="h-4" />
              </div>
            </GridItem>
            <GridItem span={5} tabletSpan={8} mobileSpan={4}>
              <FeatureMedia image={feature.image} />
            </GridItem>
            <GridItem span={3} tabletSpan={8} mobileSpan={4}>
              <div className="flex items-start h-full">
                <p
                  className="text-[18px] leading-[1.6] text-text-secondary"
                  style={{ fontFamily: 'var(--font-sans)' }}
                >
                  {feature.description}
                </p>
              </div>
            </GridItem>
          </Grid>
        ))}
      </div>
    </section>
  )
}
