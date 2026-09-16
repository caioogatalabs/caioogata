'use client'

import { useEffect, useState } from 'react'
import type { ProjectSection, ProjectImage } from '@/content/types'
import { Grid, GridItem } from '@/components/layout/Grid'
import { LABEL } from '@/components/ui/label'
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
      className="overflow-hidden"
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

/**
 * A local screen recording (e.g. a menu in use): muted, looping, inline, so it
 * autoplays like an image would sit. Under reduced motion it never starts and
 * the poster stands in for it.
 */
function LocalVideo({ src, poster, title }: { src: string; poster?: string; title: string }) {
  const { ref: revealRef, clipPath } = useScrollReveal()
  const [reduced, setReduced] = useState(false)

  useEffect(() => {
    setReduced(window.matchMedia('(prefers-reduced-motion: reduce)').matches)
  }, [])

  return (
    <div
      ref={revealRef as React.RefObject<HTMLDivElement>}
      className="overflow-hidden"
      style={{ clipPath }}
    >
      {reduced && poster ? (
        <img src={poster} alt={title} loading="lazy" className="w-full h-auto block" />
      ) : (
        <video
          src={src}
          poster={poster}
          aria-label={title}
          autoPlay={!reduced}
          muted
          loop
          playsInline
          preload="metadata"
          className="w-full h-auto block"
        />
      )}
    </div>
  )
}

function FeatureMedia({ image }: { image: ProjectImage }) {
  if (image.type === 'video' && !image.platform && image.src) {
    return <LocalVideo src={image.src} poster={image.poster} title={image.title} />
  }

  if (image.type === 'video' && image.videoId && image.platform) {
    return (
      <div className="overflow-hidden">
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
      <div className="overflow-hidden">
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
        {features.map((feature, index) => {
          // On a tablet held upright the desktop 4/5/3 row does not fit, and
          // three blocks at full width read as one undifferentiated column.
          // Instead the whole feature takes a side — media six of eight, name
          // and description on the same edge — and the next one takes the
          // other, so the list zigzags the way the staggered gallery does.
          const tabletStart = index % 2 === 0 ? 1 : 3
          return (
            <Grid key={index}>
              <GridItem span={4} tabletSpan={6} tabletStart={tabletStart} mobileSpan={4}>
                <p className={LABEL}>
                  {feature.name}
                </p>
              </GridItem>
              <GridItem span={5} tabletSpan={6} tabletStart={tabletStart} mobileSpan={4}>
                <FeatureMedia image={feature.image} />
              </GridItem>
              <GridItem span={3} tabletSpan={5} tabletStart={tabletStart} mobileSpan={4}>
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
          )
        })}
      </div>
    </section>
  )
}
