'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import { useSectionExitProgress, slice } from '@/hooks/useScrollExitProgress'
import { SplitText } from '@/components/motion/SplitText'
import content from '@/content/en.json'
import type { Content } from '@/content/types'
import type { DistortedImageCanvasProps } from '@/components/three/DistortedImageCanvas'

/** Lazy-loaded client-only wrapper — same shape as the home's. */
function ClientDistortedImage(props: DistortedImageCanvasProps) {
  const [Component, setComponent] = useState<React.ComponentType<DistortedImageCanvasProps> | null>(null)

  useEffect(() => {
    import('@/components/three/DistortedImageCanvas').then(mod => {
      setComponent(() => mod.DistortedImageCanvas)
    })
  }, [])

  if (!Component) return null
  return <Component {...props} />
}

/** The image is muted so the paragraph laid over it stays readable. */
const IMAGE_OPACITY = 0.7

const typedContent = content as unknown as Content

/**
 * AboutPinned — the opening block of /about: one portrait with the first
 * paragraph of the bio laid across it.
 *
 * No longer pinned, despite the name. It used to be a 400vh container whose
 * sticky inner scrubbed 241 preloaded JPEGs — 9.8MB in `public/about-frames/`
 * — as you scrolled. The frames and `useScrollVideo` are still on disk in case
 * that comes back, but nothing loads them now: the block is normal height and
 * carries the same photo the home hero uses, with the same distortion on
 * hover.
 *
 * On the way out the image leaves before the text, so the portrait clears and
 * the paragraph is left alone for a moment before it goes.
 */
export function AboutPinned() {
  // The whole traverse, from the block's top entering at the bottom edge to it
  // leaving through the top — not just the exit. The portrait has to outrun the
  // paragraph from the first pixel of scroll, and a window that only opens near
  // the end would leave them locked together until then.
  const { ref, progress } = useSectionExitProgress({ startFraction: 1, endFraction: -0.85 })

  // Opposite directions rather than merely different distances: the portrait
  // climbs while the paragraph drifts down against the scroll, so the gap they
  // open is the sum of both. That is what buys the separation without pinning
  // anything — pinning would be needed only to hold the sentence still, and it
  // is not still, it is just slower. The reference on alphamark.design runs its
  // three images the same way, one down and two up.
  const imageRise = progress * 320
  const textDrift = progress * 40

  // The fades stay staggered: the portrait clears first and leaves the
  // paragraph alone for a moment before it goes too.
  const outImage = slice(progress, 0.55, 0.85)
  const outText = slice(progress, 0.75, 1)

  const firstParagraph = typedContent.about.bio.split('\n\n')[0]

  return (
    <div ref={ref} className="relative py-24 md:py-32 lg:py-40">
      <div className="w-full px-5 md:px-8 lg:px-8">
        <div className="grid grid-cols-4 md:grid-cols-8 lg:grid-cols-12 gap-4 md:gap-5 items-center">
          {/* Image — the four right-hand columns, 9-12. z-10 so the paragraph
              layers on top. Being tried here; it sat on 5-8 before. */}
          <div className="col-span-4 md:col-span-8 md:col-start-1 lg:col-span-4 lg:col-start-9 lg:row-start-1 z-10">
            <div
              className="relative w-full aspect-[3/4] overflow-hidden bg-bg-surface-secondary"
              style={{
                opacity: IMAGE_OPACITY * (1 - outImage),
                transform: `translateY(${-imageRise}px)`,
              }}
            >
              <Image
                src="/caio-ogata-profile.webp"
                alt="Caio Ogata"
                fill
                sizes="(min-width: 1024px) 33vw, 100vw"
                className="object-cover"
                priority
              />
              <ClientDistortedImage
                src="/caio-ogata-profile.webp"
                revealOnMount
                revealDelayMs={200}
                idleGlitchMs={progress < 0.5 ? 5000 : 0}
              />
            </div>
          </div>

          {/* Paragraph — full 12 cols, z-20, so it reads over the portrait.
              `pointer-events-none` because it covers the image completely: the
              distortion is driven by pointermove, and without this the text
              layer would swallow every one of them. It is plain copy with no
              links, so nothing is lost. */}
          {/* The first line starts on column 4 of whichever grid is in force,
              derived rather than eyeballed. For a track of width W with gap g,
              column 4 begins at 3 columns + 3 gaps, which reduces to W/4 + g/4
              on the 12-col grid and 3W/8 + 3g/8 on the 8-col one. It was a flat
              `8em` before — 384px at this size, which on a 350px phone pushed
              the whole paragraph off screen. Mobile gets none: its grid is four
              columns wide, so a fourth-column indent would leave one column of
              text. SplitText reads this off the parent and moves it onto the
              first line only. */}
          <div
            className="pointer-events-none col-span-4 md:col-span-8 md:col-start-1 lg:col-span-12 lg:col-start-1 lg:row-start-1 z-20 [--line1-indent:0px] md:[--line1-indent:calc(37.5%_+_7.5px)] lg:[--line1-indent:calc(25%_+_5px)]"
            style={{ opacity: 1 - outText, transform: `translateY(${textDrift}px)` }}
          >
            <SplitText
              type="line"
              text={firstParagraph}
              className="text-text-primary"
              style={{
                fontFamily: 'var(--font-sans)',
                fontSize: '3rem',
                lineHeight: 1.15,
                letterSpacing: '-0.96px',
                fontWeight: 400,
                textIndent: 'var(--line1-indent)',
              }}
              staggerMs={120}
              durationMs={1100}
              baseDelayMs={150}
            />
          </div>
        </div>
      </div>
    </div>
  )
}
