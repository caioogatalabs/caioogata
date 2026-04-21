'use client'

import type { ProjectSection, ProjectImage } from '@/content/types'
import { useScrollReveal } from '@/hooks/useScrollReveal'
import VideoEmbed from '@/components/ui/VideoEmbed'

interface ProjectGalleryStaggeredProps {
  section: ProjectSection
}

// Desktop: render spans as declared
const DESKTOP_SPAN: Record<number, string> = {
  1: 'lg:col-span-1', 2: 'lg:col-span-2', 3: 'lg:col-span-3', 4: 'lg:col-span-4',
  5: 'lg:col-span-5', 6: 'lg:col-span-6', 7: 'lg:col-span-7', 8: 'lg:col-span-8',
  9: 'lg:col-span-9', 10: 'lg:col-span-10', 11: 'lg:col-span-11', 12: 'lg:col-span-12',
}

// Tablet: minimum 6-col per image
const TABLET_SPAN: Record<number, string> = {
  1: 'md:col-span-6', 2: 'md:col-span-6', 3: 'md:col-span-6', 4: 'md:col-span-6',
  5: 'md:col-span-6', 6: 'md:col-span-6', 7: 'md:col-span-8', 8: 'md:col-span-8',
  9: 'md:col-span-8', 10: 'md:col-span-8', 11: 'md:col-span-8', 12: 'md:col-span-12',
}

// Mobile: all images stack to full width
const MOBILE_SPAN: Record<number, string> = {
  1: 'col-span-12', 2: 'col-span-12', 3: 'col-span-12', 4: 'col-span-12',
  5: 'col-span-12', 6: 'col-span-12', 7: 'col-span-12', 8: 'col-span-12',
  9: 'col-span-12', 10: 'col-span-12', 11: 'col-span-12', 12: 'col-span-12',
}

function RevealImage({ src, alt, staggerIndex = 0 }: { src: string; alt: string; staggerIndex?: number }) {
  const { ref, clipPath } = useScrollReveal({
    startFraction: 0.85 + staggerIndex * 0.03,
  })
  return (
    <div
      ref={ref as React.RefObject<HTMLDivElement>}
      className="overflow-hidden"
      style={{ clipPath }}
    >
      <img
        src={src}
        alt={alt}
        loading="lazy"
        className="w-full max-h-[500px] min-h-[200px] object-cover block"
      />
    </div>
  )
}

function RevealVideo({ media, staggerIndex = 0 }: { media: ProjectImage; staggerIndex?: number }) {
  const { ref, clipPath } = useScrollReveal({
    startFraction: 0.85 + staggerIndex * 0.03,
  })
  if (!media.platform || !media.videoId) return null

  return (
    <div
      ref={ref as React.RefObject<HTMLDivElement>}
      className="overflow-hidden"
      style={{ clipPath }}
    >
      <VideoEmbed platform={media.platform} videoId={media.videoId} centeredButton />
    </div>
  )
}

function RevealFigma({ media, staggerIndex = 0 }: { media: ProjectImage; staggerIndex?: number }) {
  const { ref, clipPath } = useScrollReveal({
    startFraction: 0.85 + staggerIndex * 0.03,
  })
  return (
    <div
      ref={ref as React.RefObject<HTMLDivElement>}
      className="overflow-hidden"
      style={{ clipPath }}
    >
      <iframe
        src={media.figmaEmbedUrl}
        title={media.title}
        className="w-full border-0"
        style={{ minHeight: '340px' }}
        loading="lazy"
        allowFullScreen
      />
    </div>
  )
}

/** Renders the appropriate media element based on type */
function StaggeredMedia({ item, staggerIndex = 0 }: { item: string | ProjectImage; staggerIndex?: number }) {
  // Plain string -> image path (backward compatible)
  if (typeof item === 'string') {
    return <RevealImage src={item} alt="" staggerIndex={staggerIndex} />
  }

  if (item.type === 'video' && item.videoId) {
    return <RevealVideo media={item} staggerIndex={staggerIndex} />
  }

  if (item.type === 'figma' && item.figmaEmbedUrl) {
    return <RevealFigma media={item} staggerIndex={staggerIndex} />
  }

  // Default: image object
  return <RevealImage src={item.src} alt={item.title} staggerIndex={staggerIndex} />
}

export function ProjectGalleryStaggered({ section }: ProjectGalleryStaggeredProps) {
  const rows = section.rows || []
  if (rows.length === 0) return null

  return (
    <section className="py-24 px-5 md:px-8 lg:px-16">
      <div className="flex flex-col gap-y-[8px]">
        {rows.map((row, rowIdx) => {
          // Defensive: warn if spans and images count mismatch
          if (process.env.NODE_ENV === 'development' && row.spans.length !== row.images.length) {
            console.warn(`[Gallery] Row ${rowIdx}: spans.length (${row.spans.length}) !== images.length (${row.images.length})`)
          }

          return (
            <div key={rowIdx} className="grid grid-cols-12 gap-x-[4px]">
              {row.images.map((item, imgIdx) => {
                const span = row.spans[imgIdx] ?? Math.floor(12 / row.images.length)
                const spanClasses = [
                  MOBILE_SPAN[span] || 'col-span-12',
                  TABLET_SPAN[span] || 'md:col-span-6',
                  DESKTOP_SPAN[span] || 'lg:col-span-12',
                ].join(' ')

                return (
                  <div key={imgIdx} className={spanClasses}>
                    <StaggeredMedia item={item} staggerIndex={imgIdx} />
                  </div>
                )
              })}
            </div>
          )
        })}
      </div>
    </section>
  )
}
