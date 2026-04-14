'use client'

import { useState, useEffect } from 'react'
import { useInView } from '@/hooks/useInView'
import { useScrollExpand } from '@/hooks/useScrollExpand'
import { Grid, GridItem } from '@/components/layout/Grid'
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
      <div className="overflow-hidden rounded-[var(--radius-component-md,12px)]">
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
      <div className="overflow-hidden rounded-[var(--radius-component-md,12px)]">
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
    <div className="overflow-hidden rounded-[var(--radius-component-md,12px)]">
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
  const sectionRef = useInView()
  const imageRef = useInView()
  const { ref: expandRef, clipPath, opacity } = useScrollExpand()
  const heroImage = project.images[0]
  const gradientColors = project.colors ?? DEFAULT_GRADIENT_COLORS

  return (
    <>
      {/* Hero text */}
      <section
        ref={sectionRef as React.RefObject<HTMLElement>}
        className="pt-8 pb-8"
      >
        <h1 className="sr-only">{project.title}</h1>

        <Grid>
          <GridItem span={12} tabletSpan={8} mobileSpan={4}>
            <span className="block font-mono text-xs uppercase tracking-[0.88px] text-text-tertiary mb-6 -entrance -fade -a-0">
              PRJ_{project.year} // {String(index + 1).padStart(3, '0')}
            </span>
          </GridItem>

          {/* Technologies left (4-col) + description right (8-col) */}
          <GridItem span={4} tabletSpan={8} mobileSpan={4}>
            {project.technologies && (
              <p
                className="text-[14px] font-medium leading-[1.5] uppercase tracking-[1.12px] text-text-tertiary -entrance -fade -a-1"
                style={{ fontFamily: 'var(--font-sans)' }}
              >
                {project.technologies}
              </p>
            )}
          </GridItem>
          <GridItem span={8} tabletSpan={8} mobileSpan={4}>
            {section.body && (
              <p
                className="text-[48px] leading-[1.15] tracking-[-0.96px] text-text-primary -entrance -fade -a-1"
                style={{ fontFamily: 'var(--font-sans)' }}
              >
                {section.body}
              </p>
            )}
          </GridItem>
        </Grid>
      </section>

      {/* Hero media — unified wrapper: 75% width centered with animated noise gradient background */}
      {heroImage && (
        <section ref={imageRef as React.RefObject<HTMLElement>} className="pt-24 pb-16">
          <Grid>
            <GridItem span={12} tabletSpan={8} mobileSpan={4} className="-entrance -scale-in -a-2">
              <div
                ref={expandRef as React.RefObject<HTMLDivElement>}
                className="relative"
              >
                {/* Noise gradient background — scroll-reveal via clip-path */}
                <div
                  className="absolute inset-0 z-0"
                  style={{ clipPath, opacity }}
                >
                  <ClientNoiseGradient
                    colors={gradientColors}
                    className="z-0"
                  />
                </div>
                {/* Media — 75% centered, always visible above the gradient */}
                <div className="relative z-10 mx-auto w-[75%] py-[12%]">
                  <HeroMedia media={heroImage} />
                </div>
              </div>
            </GridItem>
          </Grid>
        </section>
      )}
    </>
  )
}
