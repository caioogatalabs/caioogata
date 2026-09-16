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

// Tablet: half the eight-column track, so a row reads as 4-4. A declared span
// of 12 is the one exception — a full-bleed row stays full-bleed.
const TABLET_SPAN: Record<number, string> = {
  1: 'md:col-span-4', 2: 'md:col-span-4', 3: 'md:col-span-4', 4: 'md:col-span-4',
  5: 'md:col-span-4', 6: 'md:col-span-4', 7: 'md:col-span-4', 8: 'md:col-span-4',
  9: 'md:col-span-4', 10: 'md:col-span-4', 11: 'md:col-span-4', 12: 'md:col-span-8',
}

// Tablet: the two halves a lone image alternates between.
const TABLET_START_LEFT = 'md:col-start-1'
const TABLET_START_RIGHT = 'md:col-start-5'

// Mobile: all images stack to full width
const MOBILE_SPAN: Record<number, string> = {
  1: 'col-span-4', 2: 'col-span-4', 3: 'col-span-4', 4: 'col-span-4',
  5: 'col-span-4', 6: 'col-span-4', 7: 'col-span-4', 8: 'col-span-4',
  9: 'col-span-4', 10: 'col-span-4', 11: 'col-span-4', 12: 'col-span-4',
}

// Column start offset (desktop only — mobile always starts at 1)
const COL_START: Record<number, string> = {
  1: 'lg:col-start-1', 2: 'lg:col-start-2', 3: 'lg:col-start-3', 4: 'lg:col-start-4',
  5: 'lg:col-start-5', 6: 'lg:col-start-6', 7: 'lg:col-start-7', 8: 'lg:col-start-8',
  9: 'lg:col-start-9', 10: 'lg:col-start-10', 11: 'lg:col-start-11', 12: 'lg:col-start-12',
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
      <div className="relative w-full" style={{ paddingBottom: '56.25%' }}>
        <div className="absolute inset-0">
          <VideoEmbed platform={media.platform} videoId={media.videoId} centeredButton />
        </div>
      </div>
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
    <section className="py-8 px-5 md:px-8 lg:px-8">
      <div className="flex flex-col gap-y-[8px]">
        {rows.map((row, rowIdx) => {
          // Defensive: warn if spans and images count mismatch
          if (process.env.NODE_ENV === 'development' && row.spans.length !== row.images.length) {
            console.warn(`[Gallery] Row ${rowIdx}: spans.length (${row.spans.length}) !== images.length (${row.images.length})`)
          }

          return (
            <div key={rowIdx} className="grid grid-cols-4 gap-x-[4px] md:grid-cols-8 lg:grid-cols-12">
              {row.images.map((item, imgIdx) => {
                const span = row.spans[imgIdx] ?? Math.floor(12 / row.images.length)
                // A row carrying one image alternates halves down the gallery.
                // The desktop `colStart` cannot drive this: it names three zones
                // out of twelve columns and the tablet has two out of eight, and
                // a run like 9, 5, 9 would land on the same side twice. Row
                // parity keeps the zigzag regardless of the authored zones. A
                // row with more than one image is already a 4-4 pair.
                const alone = row.images.length === 1 && span !== 12
                const tabletStart = alone
                  ? rowIdx % 2 === 0
                    ? TABLET_START_LEFT
                    : TABLET_START_RIGHT
                  : ''
                // Desktop keeps the first four columns empty: a lone image is
                // four columns wide and sits in the second zone (5-8), with
                // every third one stepping out to the third (9-12) to break the
                // stack. The last image always comes back to the middle, so the
                // gallery closes on the same columns the numbers below use. Row
                // position, not the authored `colStart`, drives this — a row
                // with more than one image declares its own spans.
                const steppedOut = rowIdx % 3 === 2 && rowIdx !== rows.length - 1
                const desktopStart = alone
                  ? steppedOut
                    ? 'lg:col-start-9'
                    : 'lg:col-start-5'
                  : imgIdx === 0 && row.colStart
                    ? COL_START[row.colStart] || ''
                    : ''
                const spanClasses = [
                  MOBILE_SPAN[span] || 'col-span-4',
                  TABLET_SPAN[span] || 'md:col-span-4',
                  tabletStart,
                  alone ? 'lg:col-span-4' : DESKTOP_SPAN[span] || 'lg:col-span-12',
                  desktopStart,
                ].filter(Boolean).join(' ')

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
