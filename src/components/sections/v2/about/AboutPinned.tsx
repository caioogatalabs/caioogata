'use client'

import { useEffect, useState } from 'react'
import { useScrollVideo } from '@/hooks/useScrollVideo'
import content from '@/content/en.json'
import type { Content } from '@/content/types'

// Scroll-progress milestones (0..1 across the 400vh container).
const ENTRY_END = 0.2 // image slide-up completes at 20% scroll progress
const PARA_FADE_START = 0.2 // paragraph begins fading in immediately after image lands
const PARA_FADE_END = 0.4 // paragraph fully visible by 40% scroll progress

const typedContent = content as unknown as Content

/**
 * AboutPinned — image-pin + paragraph-reveal section for /about.
 *
 * Layout: paragraph in cols 1-6, vertical image in cols 9-12.
 * Behaviour: image slides up from below during the first 20% of scroll,
 * pins inside the sticky viewport, scrubs 241 frames through the rest of
 * the 400vh zone. The first bio paragraph fades in between 20% and 40%
 * scroll progress.
 *
 * `prefers-reduced-motion`: image translateY locks at 0, paragraph opacity
 * locks at 1, frames freeze at the last frame (handled inside useScrollVideo).
 */
export function AboutPinned() {
  const { containerRef, canvasRef, progress } = useScrollVideo()
  const [reducedMotion, setReducedMotion] = useState(false)

  useEffect(() => {
    setReducedMotion(window.matchMedia('(prefers-reduced-motion: reduce)').matches)
  }, [])

  const firstParagraph = typedContent.about.bio.split('\n\n')[0]

  // Image entry: 0 → ENTRY_END maps translateY 100% → 0%. Reduced motion = always 0.
  const entryProgress = reducedMotion ? 1 : Math.min(progress / ENTRY_END, 1)
  const imageStyle: React.CSSProperties = {
    transform: `translateY(${(1 - entryProgress) * 100}%)`,
  }

  // Paragraph fade: 0.2 → 0.4 maps opacity 0 → 1. Reduced motion = visible immediately.
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
            {/* Paragraph — cols 1-6 desktop */}
            <div className="col-span-4 md:col-span-8 lg:col-span-6">
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

            {/* Image — cols 9-12 desktop, vertical aspect */}
            <div className="col-span-4 md:col-span-8 md:col-start-1 lg:col-span-4 lg:col-start-9">
              <div
                className="w-full aspect-[3/4] overflow-hidden bg-bg-surface-secondary"
                style={imageStyle}
              >
                <canvas
                  ref={canvasRef}
                  className="block w-full h-full"
                  style={{ objectFit: 'cover' }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
