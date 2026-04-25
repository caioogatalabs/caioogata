'use client'

import { useEffect, useState } from 'react'
import { useScrollVideo } from '@/hooks/useScrollVideo'
import content from '@/content/en.json'
import type { Content } from '@/content/types'

// Scroll-progress milestones (0..1 across the 400vh container).
const IMAGE_ENTRY_END = 0.10 // image slides up + fades in over the first 10% of pin scroll
const IMAGE_TRANSLATE_START = 80 // start translateY (% of own height, below anchor)
const IMAGE_MAX_OPACITY = 0.7 // image stays slightly muted so the text overlay reads cleanly
const PARA_FADE_START = 0.10 // paragraph fade begins when image lands (~frame 47 of scrub)
const PARA_FADE_END = 0.20 // paragraph fully visible by 20% scroll progress (~frame 69)

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
 * 0→1 progress range. The first bio paragraph fades in between 0% and
 * 15% scroll progress.
 *
 * `prefers-reduced-motion`: paragraph opacity locks at 1, frames freeze
 * at the last frame (handled inside useScrollVideo).
 */
export function AboutPinned() {
  const { containerRef, canvasRef, progress } = useScrollVideo()
  const [reducedMotion, setReducedMotion] = useState(false)

  useEffect(() => {
    setReducedMotion(window.matchMedia('(prefers-reduced-motion: reduce)').matches)
  }, [])

  const firstParagraph = typedContent.about.bio.split('\n\n')[0]

  // Image entry progress: 0 → IMAGE_ENTRY_END drives both translateY and opacity.
  const imageEntryProgress = reducedMotion ? 1 : Math.min(progress / IMAGE_ENTRY_END, 1)
  const imageTranslateY = (1 - imageEntryProgress) * IMAGE_TRANSLATE_START
  const imageOpacity = imageEntryProgress * IMAGE_MAX_OPACITY

  // Paragraph fade: 0.10 → 0.20 maps opacity 0 → 1. Reduced motion = visible immediately.
  const paragraphOpacity = reducedMotion
    ? 1
    : Math.max(
        0,
        Math.min(1, (progress - PARA_FADE_START) / (PARA_FADE_END - PARA_FADE_START))
      )

  return (
    <div ref={containerRef} style={{ height: '400vh' }} className="relative">
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

            {/* Paragraph — full 12 cols (testing). z-20 so it sits above the image overlap. */}
            <div className="col-span-4 md:col-span-8 md:col-start-1 lg:col-span-12 lg:col-start-1 lg:row-start-1 z-20">
              <p
                className="text-text-primary"
                style={{
                  fontFamily: 'var(--font-sans)',
                  fontSize: 'clamp(1.75rem, 3.2vw, 2.5rem)',
                  lineHeight: 1.4,
                  fontWeight: 500,
                  opacity: paragraphOpacity,
                  transition: reducedMotion ? 'none' : 'opacity 60ms linear',
                }}
              >
                {firstParagraph}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
