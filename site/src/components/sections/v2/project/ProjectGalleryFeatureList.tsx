'use client'

import type { ProjectSection, ProjectImage } from '@/content/types'
import { Grid, GridItem } from '@/components/layout/Grid'
import { LABEL, LABEL_TYPE } from '@/components/ui/label'
import { useScrollReveal } from '@/hooks/useScrollReveal'
import { useScrollParallax } from '@/hooks/useScrollParallax'
import VideoEmbed from '@/components/ui/VideoEmbed'
import { LoopVideo } from '@/components/ui/LoopVideo'

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

function LocalVideo({ src, poster, title }: { src: string; poster?: string; title: string }) {
  const { ref: revealRef, clipPath } = useScrollReveal()

  return (
    <div
      ref={revealRef as React.RefObject<HTMLDivElement>}
      className="overflow-hidden"
      style={{ clipPath }}
    >
      <LoopVideo src={src} poster={poster} title={title} />
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
    <section className="py-8">
      <div className="space-y-16">
        {features.map((feature, index) => {
          // On a tablet held upright the desktop 6/2 row does not fit, so each
          // feature stacks on the first six of eight columns — name, media,
          // description — and every feature starts on the same edge.
          return (
            <Grid key={index}>
              <GridItem span={4} tabletSpan={6} tabletStart={1} mobileSpan={4}>
                <p className={LABEL}>{feature.name}</p>
              </GridItem>
              <GridItem span={6} start={5} tabletSpan={6} tabletStart={1} mobileSpan={4}>
                <FeatureMedia image={feature.image} />
              </GridItem>
              <GridItem span={2} start={11} tabletSpan={5} tabletStart={1} mobileSpan={4}>
                <p className={LABEL_TYPE}>{feature.description}</p>
              </GridItem>
            </Grid>
          )
        })}
      </div>
    </section>
  )
}
