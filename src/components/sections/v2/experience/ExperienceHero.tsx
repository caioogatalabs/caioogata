'use client'

import { useEffect, useState } from 'react'
import { useExperienceHero } from '@/hooks/useExperienceHero'
import { useInView } from '@/hooks/useInView'
import { StatsCards } from './StatsCards'

interface ExperienceHeroProps {
  headline: string
  stats: { value: string; label: string }[]
}

const HOLD_END = 0.85
const EXIT_END = 1.0

// Reduced-motion resolution: the spec says "progress locked at 1 (final
// state — cards aligned, content faded)" but the verification checklist
// says "cards at final aligned state on load, no scroll-driven motion,
// no entrance animation" — implying VISIBLE. Resolve in favor of the
// checklist by remapping progress to the hold-phase value (0.75) when
// reduced motion is on, so cards land aligned AND fully visible.
const REDUCED_MOTION_PROGRESS = 0.75

/**
 * /experience hero — 400vh outer + sticky 100vh inner pin.
 *
 * Composition:
 *   - 400vh outer container measures scroll progress via `useExperienceHero`.
 *   - Inner sticky pin (100vh) holds the content centred while the outer
 *     scrolls.
 *   - Inside the pin, a 12-col grid hosts the headline (z-20, full row)
 *     and the StatsCards trio (z-10) — cards visually pass behind the
 *     headline on the way up, then sit above it after convergence.
 *
 * Mobile (<768px): pin is disabled by `useExperienceHero`. We additionally
 * detect mobile here once on mount to switch StatsCards to stacked mode
 * (full-width cards with normal `-entrance -slide-up` stagger).
 *
 * `prefers-reduced-motion`: hook reports `reducedMotion=true`. We override
 * progress to 0.75 (hold phase — cards aligned, fully visible, no fade).
 */
export function ExperienceHero({ headline, stats }: ExperienceHeroProps) {
  const { outerRef, progress: rawProgress, reducedMotion } = useExperienceHero()
  const [isMobile, setIsMobile] = useState(false)
  // Mobile container ref — drives the `-inview` propagation so that the
  // mobile StatsCards trio (which uses `-entrance -slide-up` classes)
  // receives the visibility cue. The hook short-circuits on first sight.
  const mobileInViewRef = useInView({ threshold: 0.1, once: true })

  useEffect(() => {
    setIsMobile(window.innerWidth < 768)
  }, [])

  // Resolve progress for layout — reduced motion uses hold-phase value
  // so cards remain visible at the aligned position.
  const progress = reducedMotion ? REDUCED_MOTION_PROGRESS : rawProgress

  // Headline opacity: full opacity through 0.85, linear fade to 0 by 1.0.
  // On mobile and reduced motion, no exit fade — headline stays visible.
  let headlineOpacity = 1
  if (!reducedMotion && !isMobile && progress > HOLD_END) {
    const t = (progress - HOLD_END) / (EXIT_END - HOLD_END)
    headlineOpacity = Math.max(0, 1 - t)
  }

  return (
    <div
      ref={outerRef}
      style={{ height: isMobile ? 'auto' : '400vh' }}
      className="relative bg-bg-surface-secondary"
    >
      <div
        ref={mobileInViewRef as React.RefObject<HTMLDivElement>}
        className={
          isMobile
            ? 'py-12'
            : 'sticky top-0 h-screen overflow-hidden flex items-center'
        }
      >
        <div className="w-full px-5 md:px-8 lg:px-16">
          <div className="grid grid-cols-4 md:grid-cols-8 lg:grid-cols-12 gap-4 md:gap-5">
            {/* Headline — full row, z-20 */}
            <h1
              className="relative col-start-1 col-span-4 md:col-start-1 md:col-span-8 lg:col-start-1 lg:col-span-12 lg:row-start-1 z-20 text-text-primary"
              style={{
                fontFamily: 'var(--font-sans)',
                fontSize: 'clamp(2rem, 5vw, 3rem)',
                lineHeight: 1.15,
                letterSpacing: '-0.96px',
                fontWeight: 400,
                textIndent: isMobile ? '0' : '8em',
                opacity: headlineOpacity,
                transition: reducedMotion ? 'none' : 'opacity 60ms linear',
              }}
            >
              {headline}
            </h1>

            {/* StatsCards — z-10. On desktop, cards share row-start-1 with
                the headline so they translateY through it. On mobile,
                they stack below as normal grid items. */}
            <StatsCards
              progress={progress}
              stats={stats}
              isMobile={isMobile}
            />
          </div>
        </div>
      </div>
    </div>
  )
}
