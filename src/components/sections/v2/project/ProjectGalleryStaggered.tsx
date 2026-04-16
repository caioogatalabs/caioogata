'use client'

import type { ProjectSection, ProjectImage } from '@/content/types'
import { useScrollReveal } from '@/hooks/useScrollReveal'
import VideoEmbed from '@/components/ui/VideoEmbed'

interface ProjectGalleryStaggeredProps {
  section: ProjectSection
}

function RevealImage({ src, alt }: { src: string; alt: string }) {
  const { ref, clipPath } = useScrollReveal()
  return (
    <div
      ref={ref as React.RefObject<HTMLDivElement>}
      className="overflow-hidden rounded-[var(--radius-component-md,12px)] h-full"
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

function RevealVideo({ media }: { media: ProjectImage }) {
  const { ref, clipPath } = useScrollReveal()
  if (!media.platform || !media.videoId) return null

  return (
    <div
      ref={ref as React.RefObject<HTMLDivElement>}
      className="overflow-hidden rounded-[var(--radius-component-md,12px)] h-full"
      style={{ clipPath }}
    >
      <VideoEmbed platform={media.platform} videoId={media.videoId} centeredButton />
    </div>
  )
}

function RevealFigma({ media }: { media: ProjectImage }) {
  const { ref, clipPath } = useScrollReveal()
  return (
    <div
      ref={ref as React.RefObject<HTMLDivElement>}
      className="overflow-hidden rounded-[var(--radius-component-md,12px)] h-full"
      style={{ clipPath }}
    >
      <iframe
        src={media.figmaEmbedUrl}
        title={media.title}
        className="w-full border-0 h-full"
        style={{ minHeight: '340px' }}
        loading="lazy"
        allowFullScreen
      />
    </div>
  )
}

/** Renders the appropriate media element based on type */
function StaggeredMedia({ item }: { item: string | ProjectImage }) {
  // Plain string → image path (backward compatible)
  if (typeof item === 'string') {
    return <RevealImage src={item} alt="" />
  }

  if (item.type === 'video' && item.videoId) {
    return <RevealVideo media={item} />
  }

  if (item.type === 'figma' && item.figmaEmbedUrl) {
    return <RevealFigma media={item} />
  }

  // Default: image object
  return <RevealImage src={item.src} alt={item.title} />
}

/**
 * Stagger positions within a 12-col grid (3 slots of 4 cols each).
 * Each image occupies one slot; the other two are empty.
 * Pattern: center → right → center → center (matches Figma reference).
 * col-start values: slot-left=1, slot-center=5, slot-right=9
 */
const STAGGER_COLS = [5, 9, 5, 1] as const

export function ProjectGalleryStaggered({ section }: ProjectGalleryStaggeredProps) {
  // Flatten all items from all rows into a single staggered list
  const allItems = (section.rows || []).flatMap(row => row.images)

  if (allItems.length === 0) return null

  return (
    <section className="py-24">
      <div className="flex flex-col gap-6">
        {allItems.map((item, i) => {
          const colStart = STAGGER_COLS[i % STAGGER_COLS.length]
          return (
            <div
              key={i}
              className="grid grid-cols-12 gap-5 px-5 md:px-8 lg:px-16"
            >
              <div
                className="col-span-4 h-[340px]"
                style={{ gridColumnStart: colStart }}
              >
                <StaggeredMedia item={item} />
              </div>
            </div>
          )
        })}
      </div>
    </section>
  )
}
