'use client'

import { useState, useEffect } from 'react'
import { useInView } from '@/hooks/useInView'
import { useScrollExpand } from '@/hooks/useScrollExpand'
import { Grid, GridItem } from '@/components/layout/Grid'
import { Hero } from '@/components/sections/v2/Hero'
import VideoEmbed from '@/components/ui/VideoEmbed'
import type { ProjectItem, ProjectSection, ProjectImage } from '@/content/types'
import type { NoiseGradientCanvasProps } from '@/components/three/NoiseGradientCanvas'

/** Fallback colors for projects without their own palette — neutral warm tones */
const DEFAULT_GRADIENT_COLORS: [string, string, string] = ['#3a3a3a', '#1a1a1a', '#5a5a5a']

interface ProjectHeroProps {
  project: ProjectItem
  section: ProjectSection
  index: number
}

/** Lazy-loaded client-only wrapper for NoiseGradientCanvas */
function ClientNoiseGradient(props: NoiseGradientCanvasProps) {
  const [Component, setComponent] = useState<React.ComponentType<NoiseGradientCanvasProps> | null>(null)

  useEffect(() => {
    import('@/components/three/NoiseGradientCanvas').then(mod => {
      setComponent(() => mod.NoiseGradientCanvas)
    })
  }, [])

  if (!Component) return null
  return <Component {...props} />
}

/** Renders the appropriate media element for the hero: image, video embed, or figma embed */
function HeroMedia({ media }: { media: ProjectImage }) {
  if (media.type === 'video' && media.videoId && media.platform) {
    return (
      <div className="overflow-hidden">
        <div className="relative w-full" style={{ paddingBottom: '56.25%' }}>
          <div className="absolute inset-0">
            <VideoEmbed platform={media.platform} videoId={media.videoId} centeredButton />
          </div>
        </div>
      </div>
    )
  }

  if (media.type === 'figma' && media.figmaEmbedUrl) {
    return (
      <div className="overflow-hidden">
        <iframe
          src={media.figmaEmbedUrl}
          title={media.title}
          className="w-full border-0"
          style={{ height: '600px' }}
          loading="eager"
          allowFullScreen
        />
      </div>
    )
  }

  // Default: image
  return (
    <div className="overflow-hidden">
      <img
        src={media.src}
        alt={media.title}
        loading="eager"
        className="w-full h-auto"
      />
    </div>
  )
}

export function ProjectHero({ project, section, index }: ProjectHeroProps) {
  const imageRef = useInView()
  const { ref: expandRef, clipPath, opacity } = useScrollExpand()
  const heroImage = project.images[0]
  const gradientColors = project.colors ?? DEFAULT_GRADIENT_COLORS

  return (
    <>
      {/* Hero text */}
      <h1 className="sr-only">{project.title}</h1>
      <Hero
        kicker={`prj_${project.year} // ${String(index + 1).padStart(3, '0')}`}
        technologies={project.technologies}
        headline={section.body ?? ''}
      />

      {/* Hero media — noise gradient fills entire section, image centered */}
      {heroImage && (
        <section
          ref={imageRef as React.RefObject<HTMLElement>}
          className="relative pt-24 pb-16 bg-bg"
        >
          {/* Noise gradient background — full bleed, scroll-reveal via clip-path */}
          <div
            ref={expandRef as React.RefObject<HTMLDivElement>}
            className="absolute inset-0 z-0"
            style={{ clipPath, opacity }}
          >
            <ClientNoiseGradient
              colors={gradientColors}
              className="z-0"
            />
          </div>
          {/* Media — 75% centered, above gradient */}
          <Grid className="relative z-10">
            <GridItem span={12} tabletSpan={8} mobileSpan={4} className="-entrance -scale-in -a-2">
              {/* Full width on a phone — the four columns the grid already
                  gives this item, with the page gutter as its only margin.
                  At 75% the image came out around 250px wide and read as a
                  thumbnail. From `md` up the inset returns, where there is
                  width to spare and the gradient needs room around the
                  image. */}
              <div className="mx-auto w-full py-[12%] md:w-[75%]">
                <HeroMedia media={heroImage} />
              </div>
            </GridItem>
          </Grid>
        </section>
      )}
    </>
  )
}
