'use client'

import { useState, useCallback, useRef, useEffect } from 'react'
import { StickyLogoBar } from '@/components/sections/v2/StickyLogoBar'
import { PageNavigation } from '@/components/sections/v2/PageNavigation'
import { ExperienceHero } from '@/components/sections/v2/experience/ExperienceHero'
import { MAIN_NAVIGATION } from '@/content/main-navigation'
import { useExperienceNavigation } from '@/hooks/useExperienceNavigation'
import { useInView } from '@/hooks/useInView'
import content from '@/content/en.json'
import type { Content } from '@/content/types'

const typedContent = content as unknown as Content
const jobs = typedContent.experience.jobs

export function ExperienceSection() {
  const rowsRef = useInView({ threshold: 0.05, once: true })
  const containerRef = useRef<HTMLDivElement>(null)

  const [expandedIndex, setExpandedIndex] = useState<number | null>(null)
  const [reducedMotion, setReducedMotion] = useState(false)

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
    setReducedMotion(mq.matches)
    const handler = (e: MediaQueryListEvent) => setReducedMotion(e.matches)
    mq.addEventListener('change', handler)
    return () => mq.removeEventListener('change', handler)
  }, [])

  const toggle = useCallback((index: number) => {
    setExpandedIndex((prev) => (prev === index ? null : index))
  }, [])

  const handleExpand = useCallback((index: number) => {
    setExpandedIndex(index)
  }, [])

  const handleCollapse = useCallback((index: number) => {
    if (index === -1) {
      setExpandedIndex(null)
    } else {
      setExpandedIndex((prev) => (prev === index ? null : prev))
    }
  }, [])

  const {
    activeIndex,
    hoveredIndex,
    highlightedIndex,
    setHoveredIndex,
    isDimmed,
  } = useExperienceNavigation({
    itemCount: jobs.length,
    onExpand: handleExpand,
    onCollapse: handleCollapse,
    containerRef,
  })

  const instantStyle = reducedMotion
    ? { transitionDuration: '0s' }
    : undefined

  return (
    <div className="min-h-screen bg-bg">
      {/* Hero band — short bg-bg-surface-secondary container around the
          StickyLogoBar. Matches /about exactly: same pt/pb values, same
          single-child shape. The short container is what releases the
          sticky logo: when its bottom scrolls into the viewport top, the
          PageNavigation (further down) takes over as the top-stuck element
          and visually pushes the logo off-screen. */}
      <div className="bg-bg-surface-secondary pt-8 md:pt-10 lg:pt-12 pb-16 md:pb-24 lg:pb-32">
        <StickyLogoBar />
      </div>

      {/* Hero — 400vh pinned converging-cards section. Mirrors
          <AboutPinned/> rhythm: bg-bg on the inner sticky, headline pinned
          centred with the same fontSize/textIndent values. */}
      <ExperienceHero
        headline={typedContent.experience.hero.headline}
        stats={typedContent.experience.hero.stats}
      />

      {/* Unified page navigation — top sticky. Same set of commands as the
          bottom navbar (back / categories / up-down / enter), so keyboard
          users can read all the controls in either position. */}
      <PageNavigation
        lateral={{ items: MAIN_NAVIGATION, currentIndex: 2, scope: 'categories' }}
        items={{ label: 'to navigate', enterLabel: 'to expand' }}
      />

      {/* Experience rows */}
      <div
        ref={rowsRef as React.RefObject<HTMLDivElement>}
        className="px-5 md:px-8 lg:px-16 py-8 md:py-12"
        onMouseLeave={() => setHoveredIndex(-1)}
        role="list"
        aria-label="Experience roles"
      >
        <div ref={containerRef}>
          {jobs.map((job, index) => {
            const isHighlighted = highlightedIndex === index
            const isExpanded = expandedIndex === index
            const dimmed = isDimmed(index)
            const isKeyboardFocused =
              activeIndex === index && hoveredIndex < 0
            const staggerClass = `-a-${Math.min(index, 20)}`
            // Yellow bar visibility: only on hover/focus (highlighted) of
            // a NON-expanded row. When expanded, the bar disappears so
            // the row sits on the neutral page surface (spec).
            const showYellowBar = isHighlighted && !isExpanded
            // Larger highlighted typography: shows on highlight OR expand
            // (both states get the bigger JetBrains Mono via .type-overlay-hover variant).
            const showLargeText = isHighlighted || isExpanded
            // Top-divider only above the very first row; subsequent rows
            // use their predecessor's bottom divider.
            const showTopDivider = index === 0
            // Achievement slice — render at most 3 in cols 7-8/9-10/11-12.
            const achievements = (job.achievements ?? []).slice(0, 3)

            return (
              <div
                key={index}
                data-experience-row
                role="listitem"
                className={`-entrance -slide-up ${staggerClass}`}
              >
                {/* Top divider (only above index 0) */}
                {showTopDivider && (
                  <div
                    className="h-px w-full bg-border-primary"
                    style={{
                      opacity: showYellowBar || isExpanded ? 0 : 0.1,
                      transition: 'opacity 0.3s',
                      ...instantStyle,
                    }}
                  />
                )}

                {/* Row button */}
                <div
                  className="relative cursor-pointer"
                  style={{
                    zIndex: showYellowBar ? 10 : 1,
                  }}
                  onClick={() => toggle(index)}
                  onMouseEnter={() => setHoveredIndex(index)}
                  tabIndex={0}
                  role="button"
                  aria-expanded={isExpanded}
                  aria-label={`${job.company} — ${job.title}, ${job.dateRange}`}
                >
                  {/* Yellow background bar — hover/focus only (hidden on expand) */}
                  <div
                    className="absolute bg-bg-fill-primary pointer-events-none"
                    style={{
                      left: '-12px',
                      right: '-12px',
                      top: '-5px',
                      bottom: '-5px',
                      transform: showYellowBar
                        ? 'scaleX(1) scaleY(1)'
                        : 'scaleX(0.92) scaleY(0.6)',
                      opacity: showYellowBar ? 1 : 0,
                      transition: showYellowBar
                        ? 'transform 0.6s cubic-bezier(0.22,0.31,0,1) 0.04s, opacity 0.2s cubic-bezier(0.22,0.31,0,1) 0.04s'
                        : 'transform 0.5s cubic-bezier(0.22,0.31,0,1) 0.06s, opacity 0.3s cubic-bezier(0.22,0.31,0,1) 0.06s',
                      transformOrigin: 'left center',
                      borderRadius: '12px',
                      ...instantStyle,
                    }}
                  />

                  {/* Row content — strict 12-col grid: arrow(1) date(2-3) company(4-6) title(7-12) */}
                  <div className="relative z-10 grid grid-cols-12 items-center px-3 py-3 gap-x-4">
                    {/* Arrow — col 1.
                        Uses the SAME masked vertical text-swap as the company/title overlays
                        (mono 1.5rem via .type-overlay-hover, cubic-bezier(0.16,1,0.3,1)). Outer
                        span animates `width` (column shift) + `overflow-hidden`; inner span
                        translateY(100%→0) when showLargeText fires. Color flips between
                        on-primary (hover) and text-primary (expanded, no bar) — transparent when
                        neither, so the row collapses cleanly at rest. */}
                    <div className="col-span-12 md:col-span-1 flex items-center">
                      <span
                        className="shrink-0 overflow-hidden block"
                        style={{
                          width: showLargeText ? '2rem' : '0px',
                          height: '2.8rem',
                          transition: showLargeText
                            ? 'width 1s cubic-bezier(0.16,1,0.3,1) 0.04s'
                            : 'width 1s cubic-bezier(0.16,1,0.3,1) 0.06s',
                          ...instantStyle,
                        }}
                        aria-hidden="true"
                      >
                        <span
                          className="block flex items-center type-overlay-hover"
                          style={{
                            color: showYellowBar
                              ? 'var(--color-text-on-primary)'
                              : isExpanded
                                ? 'var(--color-text-primary)'
                                : 'transparent',
                            height: '2.8rem',
                            transform: showLargeText ? 'translateY(0)' : 'translateY(100%)',
                            transition: showLargeText
                              ? 'transform 1s cubic-bezier(0.16,1,0.3,1) 0.04s, color 0.3s cubic-bezier(0.22,0.31,0,1)'
                              : 'transform 1s cubic-bezier(0.16,1,0.3,1) 0.06s, color 0.3s cubic-bezier(0.22,0.31,0,1)',
                            ...instantStyle,
                          }}
                        >
                          →
                        </span>
                      </span>
                    </div>

                    {/* Date — col 2-3 */}
                    <div className="hidden md:flex md:col-span-2 items-center">
                      <span
                        className="font-mono text-sm"
                        style={{
                          color: showYellowBar
                            ? 'var(--color-text-on-primary)'
                            : isExpanded
                              ? 'var(--color-text-secondary)'
                              : dimmed
                                ? 'var(--color-text-tertiary)'
                                : 'var(--color-text-secondary)',
                          opacity: dimmed && !isExpanded ? 0.3 : 1,
                          transition: 'color 0.3s, opacity 0.3s',
                          ...instantStyle,
                        }}
                      >
                        {job.dateRange}
                      </span>
                    </div>

                    {/* Company — col 4-6 — masked text swap */}
                    <div className="col-span-8 md:col-span-3">
                      <span
                        className="relative block overflow-hidden"
                        style={{
                          height: '2.8rem',
                          marginTop: '-0.4rem',
                          marginBottom: '-0.4rem',
                        }}
                      >
                        {/* Default text */}
                        <span
                          className="absolute inset-0 flex items-center"
                          style={{
                            transform: showLargeText
                              ? 'translateY(-100%)'
                              : 'translateY(0)',
                            color: dimmed
                              ? 'var(--color-text-tertiary)'
                              : showYellowBar
                                ? 'var(--color-text-on-primary)'
                                : 'var(--color-text-primary)',
                            fontFamily: 'var(--font-sans)',
                            fontWeight: 600,
                            transition: showLargeText
                              ? 'transform 1s cubic-bezier(0.16,1,0.3,1) 0.04s, color 0.3s cubic-bezier(0.22,0.31,0,1)'
                              : 'transform 1s cubic-bezier(0.16,1,0.3,1) 0.06s, color 0.3s cubic-bezier(0.22,0.31,0,1)',
                            opacity: dimmed ? 0.3 : 1,
                            ...instantStyle,
                          }}
                        >
                          <span className="block truncate">{job.company}</span>
                        </span>
                        {/* Hover text */}
                        <span
                          className="absolute inset-0 flex items-center type-overlay-hover"
                          style={{
                            transform: showLargeText
                              ? 'translateY(0)'
                              : 'translateY(100%)',
                            transition: showLargeText
                              ? 'transform 1s cubic-bezier(0.16,1,0.3,1) 0.04s'
                              : 'transform 1s cubic-bezier(0.16,1,0.3,1) 0.06s',
                            color: showYellowBar
                              ? 'var(--color-text-on-primary)'
                              : 'var(--color-text-primary)',
                            // Override .type-overlay-hover default weight (400) → 700 for company name emphasis
                            fontWeight: 700,
                            ...instantStyle,
                          }}
                        >
                          <span className="block truncate">{job.company}</span>
                        </span>
                      </span>
                    </div>

                    {/* Title — col 7-12 — masked text swap */}
                    <div className="col-span-4 md:col-span-6 hidden md:block">
                      <span
                        className="relative block overflow-hidden"
                        style={{
                          height: '2.8rem',
                          marginTop: '-0.4rem',
                          marginBottom: '-0.4rem',
                        }}
                      >
                        {/* Default text */}
                        <span
                          className="absolute inset-0 flex items-center"
                          style={{
                            transform: showLargeText
                              ? 'translateY(-100%)'
                              : 'translateY(0)',
                            color: dimmed
                              ? 'var(--color-text-tertiary)'
                              : showYellowBar
                                ? 'var(--color-text-on-primary)'
                                : 'var(--color-text-secondary)',
                            fontFamily: 'var(--font-sans)',
                            transition: showLargeText
                              ? 'transform 1s cubic-bezier(0.16,1,0.3,1) 0.04s, color 0.3s cubic-bezier(0.22,0.31,0,1)'
                              : 'transform 1s cubic-bezier(0.16,1,0.3,1) 0.06s, color 0.3s cubic-bezier(0.22,0.31,0,1)',
                            opacity: dimmed ? 0.3 : 1,
                            ...instantStyle,
                          }}
                        >
                          <span className="block truncate">{job.title}</span>
                        </span>
                        {/* Hover text */}
                        <span
                          className="absolute inset-0 flex items-center type-overlay-hover"
                          style={{
                            transform: showLargeText
                              ? 'translateY(0)'
                              : 'translateY(100%)',
                            transition: showLargeText
                              ? 'transform 1s cubic-bezier(0.16,1,0.3,1) 0.04s'
                              : 'transform 1s cubic-bezier(0.16,1,0.3,1) 0.06s',
                            color: showYellowBar
                              ? 'var(--color-text-on-primary)'
                              : 'var(--color-text-primary)',
                            // Override .type-overlay-hover default weight (400) → 700 for title emphasis
                            fontWeight: 700,
                            ...instantStyle,
                          }}
                        >
                          <span className="block truncate">{job.title}</span>
                        </span>
                      </span>
                    </div>

                    {/* Mobile: title + date stacked below company */}
                    <div className="col-span-12 md:hidden mt-0.5">
                      <span
                        className="text-sm"
                        style={{
                          fontFamily: 'var(--font-sans)',
                          color: showYellowBar
                            ? 'var(--color-text-on-primary)'
                            : isExpanded
                              ? 'var(--color-text-secondary)'
                              : 'var(--color-text-secondary)',
                          opacity: dimmed && !isExpanded ? 0.3 : 1,
                          transition: 'color 0.3s, opacity 0.3s',
                          ...instantStyle,
                        }}
                      >
                        {job.title}
                      </span>
                      <span
                        className="font-mono text-xs mt-1 block"
                        style={{
                          color: showYellowBar
                            ? 'var(--color-text-on-primary)'
                            : isExpanded
                              ? 'var(--color-text-tertiary)'
                              : 'var(--color-text-tertiary)',
                          opacity: dimmed && !isExpanded ? 0.3 : 1,
                          transition: 'color 0.3s, opacity 0.3s',
                          ...instantStyle,
                        }}
                      >
                        {job.dateRange}
                      </span>
                    </div>

                    {/* Keyboard focus indicator */}
                    {isKeyboardFocused && (
                      <div
                        className="absolute inset-0 rounded-[12px] pointer-events-none"
                        style={{
                          outline: '2px solid var(--color-text-primary)',
                          outlineOffset: '2px',
                        }}
                      />
                    )}
                  </div>
                </div>

                {/* Accordion expand — neutral background, 12-col grid bottom */}
                <div
                  style={{
                    display: 'grid',
                    gridTemplateRows: isExpanded ? '1fr' : '0fr',
                    transition: reducedMotion
                      ? 'none'
                      : 'grid-template-rows 0.4s var(--ease-smooth)',
                    position: 'relative',
                    zIndex: isExpanded ? 10 : 1,
                  }}
                >
                  <div className="overflow-hidden min-h-0">
                    <div className="px-3 py-3 md:py-4">
                      {/* Strict 12-col grid:
                            description (col 1-4) | spacer (col 5-6)
                            achievement 1 (col 7-8) | achievement 2 (col 9-10) | achievement 3 (col 11-12) */}
                      <div className="grid grid-cols-12 gap-x-4 gap-y-4">
                        {/* Description block — col 1-4 */}
                        <div className="col-span-12 md:col-span-4">
                          {job.location && (
                            <p
                              className="text-xs font-mono mb-2"
                              style={{
                                color: 'var(--color-text-secondary)',
                              }}
                            >
                              {job.location}
                            </p>
                          )}
                          {job.description && (
                            <p
                              className="text-base leading-relaxed text-text-primary"
                              style={{
                                fontFamily: 'var(--font-sans)',
                              }}
                            >
                              {job.description}
                            </p>
                          )}
                        </div>

                        {/* Spacer — col 5-6 (desktop only) */}
                        <div className="hidden md:block md:col-span-2" />

                        {/* Achievement slots — each col 7-8 / 9-10 / 11-12 (col-span-2 each) */}
                        {achievements.map((a, i) => (
                          <div
                            key={i}
                            className="col-span-12 md:col-span-2"
                          >
                            <p
                              className="text-base leading-relaxed text-text-primary"
                              style={{
                                fontFamily: 'var(--font-sans)',
                              }}
                            >
                              {a.text}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Bottom divider — hidden when row is highlighted or expanded */}
                <div
                  className="h-px w-full bg-border-primary"
                  style={{
                    opacity: showYellowBar || isExpanded ? 0 : 0.1,
                    transition: 'opacity 0.3s',
                    ...instantStyle,
                  }}
                />
              </div>
            )
          })}
        </div>

      </div>

      {/* Bottom navigation — mirrors the sticky top navbar (same commands).
          Non-sticky inline placement after the rows. Keeps the keyboard
          legend reachable without scrolling back to the top. */}
      <PageNavigation
        sticky={false}
        lateral={{ items: MAIN_NAVIGATION, currentIndex: 2, scope: 'categories' }}
        items={{ label: 'to navigate', enterLabel: 'to expand' }}
      />
    </div>
  )
}
