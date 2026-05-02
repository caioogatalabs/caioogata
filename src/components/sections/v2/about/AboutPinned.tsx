'use client'

import { useEffect, useState } from 'react'
import { useScrollVideo } from '@/hooks/useScrollVideo'
import { StickyLogoBar } from '@/components/sections/v2/StickyLogoBar'
import { SplitText } from '@/components/motion/SplitText'
import content from '@/content/en.json'
import type { Content } from '@/content/types'

// Scroll-progress milestones (0..1 across the 400vh container).
const IMAGE_ENTRY_END = 0.10 // image slides up + fades in over the first 10% of pin scroll
const IMAGE_TRANSLATE_START = 60 // start translateY (% of own height, below anchor) — softer entry behind the text
const IMAGE_MAX_OPACITY = 0.7 // image stays slightly muted so the text overlay reads cleanly
// Exit phase — image rises out, text holds then fades by the time BioBlock reaches viewport.
const EXIT_START = 0.85 // image starts rising up + paragraph starts fading
const EXIT_END = 1.0 // image fully off-top, paragraph invisible exactly when pin releases
const IMAGE_TRANSLATE_EXIT = -110 // end translateY at exit (% of own height, above anchor)

const typedContent = content as unknown as Content

/**
 * AboutPinned — image-pin + paragraph-reveal section for /about.
 *
 * Layout: vertical image centered in cols 5-8 (z-10), paragraph in cols 1-6
 * overlapping the image's left edge (z-20). Image is visible from the
 * moment the pin engages — no slide-up entry, so there's no empty viewport
 * between the Hero and the pinned image.
 *
 * Behaviour: 400vh outer scroll → sticky inner pins at top:0. The image
 * holds steady while useScrollVideo scrubs 241 frames across the full
 * 0→1 progress range. The text is mounted on page load (opacity 1 from
 * progress 0); the image fades in in-place behind it over the first 10%
 * of scroll. Both fade out at exit.
 *
 * `prefers-reduced-motion`: paragraph opacity locks at 1, frames freeze
 * at the last frame (handled inside useScrollVideo).
 */
export function AboutPinned() {
  // scrubEnd matches EXIT_START so the video reaches its last frame just before the exit phase begins.
  const { containerRef, canvasRef, progress } = useScrollVideo({ scrubEnd: EXIT_START })
  const [reducedMotion, setReducedMotion] = useState(false)

  useEffect(() => {
    setReducedMotion(window.matchMedia('(prefers-reduced-motion: reduce)').matches)
  }, [])

  const firstParagraph = typedContent.about.bio.split('\n\n')[0]

  // Image translateY: enters from below behind the text, holds at 0, exits upward.
  // Entry: progress 0 → IMAGE_ENTRY_END maps IMAGE_TRANSLATE_START → 0.
  // Hold: IMAGE_ENTRY_END → EXIT_START stays at 0.
  // Exit: EXIT_START → EXIT_END maps 0 → IMAGE_TRANSLATE_EXIT.
  let imageTranslateY = 0
  if (!reducedMotion) {
    if (progress < IMAGE_ENTRY_END) {
      imageTranslateY = (1 - progress / IMAGE_ENTRY_END) * IMAGE_TRANSLATE_START
    } else if (progress > EXIT_START) {
      const exitT = (progress - EXIT_START) / (EXIT_END - EXIT_START)
      imageTranslateY = exitT * IMAGE_TRANSLATE_EXIT
    }
  }

  // Image opacity: ramps in over entry, holds at max for the pin, no fade-out
  // (the upward motion is the exit cue — user wants the image to "rise out").
  const imageOpacity = reducedMotion
    ? IMAGE_MAX_OPACITY
    : Math.min(progress / IMAGE_ENTRY_END, 1) * IMAGE_MAX_OPACITY

  // Paragraph opacity: mounted at full opacity from page load (no fade-in).
  // Only the exit fade survives — text fades out as the pin releases so it's
  // invisible by the time BioBlock reaches the viewport.
  let paragraphOpacity = 1
  if (!reducedMotion && progress > EXIT_START) {
    const exitT = (progress - EXIT_START) / (EXIT_END - EXIT_START)
    paragraphOpacity = Math.max(0, 1 - exitT)
  }

  return (
    <div ref={containerRef} style={{ height: '400vh' }} className="relative">
      <StickyLogoBar />
      <div className="sticky top-0 h-screen overflow-hidden bg-bg flex items-center">
        <div className="w-full px-5 md:px-8 lg:px-16">
          <div className="grid grid-cols-4 md:grid-cols-8 lg:grid-cols-12 gap-4 md:gap-5 items-center">
            {/* Image — cols 5-8 desktop (4 cols centered). z-10 so paragraph layers on top. */}
            <div className="col-span-4 md:col-span-8 md:col-start-1 lg:col-span-4 lg:col-start-5 lg:row-start-1 z-10">
              <div
                className="w-full aspect-[3/4] overflow-hidden bg-bg-surface-secondary"
                style={{
                  opacity: imageOpacity,
                  transform: `translateY(${imageTranslateY}%)`,
                  transition: reducedMotion ? 'none' : 'opacity 60ms linear, transform 60ms linear',
                }}
              >
                <canvas
                  ref={canvasRef}
                  className="block w-full h-full"
                  style={{ objectFit: 'cover' }}
                />
              </div>
            </div>

            {/* Paragraph — full 12 cols. z-20 so it sits above the image overlap.
                Line-mask reveal via Motion: each line translates up from below a per-line mask
                when the pin engages. Exit fade still tied to scroll progress (paragraphOpacity). */}
            <div
              className="col-span-4 md:col-span-8 md:col-start-1 lg:col-span-12 lg:col-start-1 lg:row-start-1 z-20"
              style={{
                opacity: paragraphOpacity,
                transition: reducedMotion ? 'none' : 'opacity 60ms linear',
              }}
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
                  textIndent: '8em',
                }}
                durationMs={800}
                baseDelayMs={150}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
