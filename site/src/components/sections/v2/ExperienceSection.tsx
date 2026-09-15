'use client'

import { useCallback, useRef, useEffect, useState } from 'react'
import { Grid, GridItem } from '@/components/layout/Grid'
import { ExperienceHero } from '@/components/sections/v2/experience/ExperienceHero'
import { useExperienceNavigation } from '@/hooks/useExperienceNavigation'
import { useInView } from '@/hooks/useInView'
import content from '@/content/en.json'
import type { Content } from '@/content/types'

const typedContent = content as unknown as Content
const jobs = typedContent.experience.jobs

/**
 * Body copy inside an expanded row. Same scale as the home hero's short bio —
 * 14px / 1.5 / secondary — so descriptive text reads identically across pages.
 */
const BODY = 'text-[14px] leading-[1.5] text-text-secondary'

/** The open row reads at full strength, the rest sit back. */
const HOVER = 'transition-opacity duration-300'

export function ExperienceSection() {
  const rowsRef = useInView({ threshold: 0.05, once: true })
  const containerRef = useRef<HTMLDivElement>(null)
  const [reducedMotion, setReducedMotion] = useState(false)

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
    setReducedMotion(mq.matches)
    const handler = (e: MediaQueryListEvent) => setReducedMotion(e.matches)
    mq.addEventListener('change', handler)
    return () => mq.removeEventListener('change', handler)
  }, [])

  const noop = useCallback(() => {}, [])
  const { activeIndex } = useExperienceNavigation({
    itemCount: jobs.length,
    onExpand: noop,
    onCollapse: noop,
    containerRef,
  })

  // Scroll opens the rows, one at a time. `scrollIndex` is the last row whose
  // top has crossed a line at 45% of the viewport, so the stack releases one
  // row per row on the way down and closes them again on the way up.
  //
  // This is stable without any damping, and for a structural reason: a row
  // expands BELOW its own header, so opening row i never moves row i's top. It
  // only pushes rows after it further down, away from the line. The measure
  // cannot oscillate against its own effect.
  //
  // Hover no longer opens anything. With the pointer resting anywhere over the
  // list it would win on every frame and the scroll sequence would never be
  // seen. Arrow keys still override, which keeps the list reachable without a
  // mouse.
  const [scrollIndex, setScrollIndex] = useState(-1)

  useEffect(() => {
    const container = containerRef.current
    if (!container) return
    let frame = 0
    const measure = () => {
      frame = 0
      const line = window.innerHeight * 0.45
      let next = -1
      container.querySelectorAll<HTMLElement>('[data-experience-row]').forEach((row, i) => {
        if (row.getBoundingClientRect().top <= line) next = i
      })
      setScrollIndex(next)
    }
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(measure)
    }
    measure()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
      if (frame) cancelAnimationFrame(frame)
    }
  }, [])

  const openIndex = activeIndex >= 0 ? activeIndex : scrollIndex

  return (
    <div className="min-h-screen bg-bg">
      <ExperienceHero headline={typedContent.experience.hero.headline} />

      {/* Experience rows */}
      <div
        ref={rowsRef as React.RefObject<HTMLDivElement>}
        className="px-5 py-8 md:px-8 md:py-12 lg:px-8"
        role="list"
        aria-label="Experience roles"
      >
        <div ref={containerRef}>
          {jobs.map((job, index) => (
            <ExperienceRow
              key={index}
              job={job}
              index={index}
              isOpen={openIndex === index}
              reducedMotion={reducedMotion}
            />
          ))}
        </div>
      </div>

    </div>
  )
}

interface ExperienceRowProps {
  job: (typeof jobs)[number]
  index: number
  isOpen: boolean
  reducedMotion: boolean
}

/**
 * One experience row: a header, a `+` / `−` indicator, and a panel that grows
 * via `grid-template-rows: 0fr → 1fr` on the skills accordion's curve and
 * duration. Scroll decides which one is open — see `ExperienceSection`.
 *
 * Everything sits on the shared `<Grid>`, so the columns and gutters are the
 * home's — the row used a raw `grid-cols-12` with a 16px gap inside its own
 * padding, which put it off the 12-col track at every breakpoint.
 */
function ExperienceRow({ job, index, isOpen, reducedMotion }: ExperienceRowProps) {
  const staggerClass = `-a-${Math.min(index, 20)}`
  // At most 3, one per pair of columns from the title axis (6-7, 8-9, 10-11).
  const achievements = (job.achievements ?? []).slice(0, 3)

  return (
    <div
      data-experience-row
      role="listitem"
      className={`-entrance -slide-up ${staggerClass} border-t border-border-primary/10 last:border-b`}
    >
      {/* Header — date (1-2) company (3-5) title (6-10) indicator (11-12) */}
      <Grid
        role="button"
        tabIndex={0}
        aria-expanded={isOpen}
        aria-label={`${job.company} — ${job.title}, ${job.dateRange}`}
        className={`!px-0 items-center py-5 ${HOVER} ${isOpen ? 'opacity-100' : 'opacity-70'}`}
      >
        <GridItem
          mobileSpan={4}
          tabletSpan={2}
          span={2}
          className="order-2 font-mono text-sm text-text-secondary md:order-none"
        >
          {job.dateRange}
        </GridItem>

        <GridItem
          mobileSpan={3}
          tabletSpan={3}
          span={3}
          className="text-text-primary"
          style={{ fontFamily: 'var(--font-sans)', fontWeight: 600 }}
        >
          {job.company}
        </GridItem>

        <GridItem
          mobileSpan={4}
          tabletSpan={2}
          span={5}
          className="order-3 text-text-secondary md:order-none"
          style={{ fontFamily: 'var(--font-sans)' }}
        >
          {job.title}
        </GridItem>

        <GridItem
          mobileSpan={1}
          tabletSpan={1}
          span={2}
          className="text-right font-mono text-base text-text-tertiary"
          aria-hidden="true"
        >
          {isOpen ? '−' : '+'}
        </GridItem>
      </Grid>

      {/* Panel — same mechanism, curve and duration as the skills accordion. */}
      <div
        className={`grid ${isOpen ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'} ${
          reducedMotion
            ? ''
            : 'transition-[grid-template-rows] duration-500 ease-[cubic-bezier(0.5,0,0.3,1)]'
        }`}
      >
        <div className="overflow-hidden">
          {/* The panel hangs off the header's own columns:
                description   3-5   — the company column, exactly
                achievements  6-7, 8-9, 10-11 — from the title's axis
              The summary is held to the company's three columns so it stops
              before column 6, where the title starts; the achievements then
              pick up on that same axis. Columns 1-2 stay empty as the panel's
              left gutter, the way the home's project rows leave column 1. */}
          <Grid className="!px-0 pb-6">
            <GridItem mobileSpan={4} tabletSpan={4} span={3} start={3} className="md:col-start-3">
              {job.location && (
                <p className="mb-2 font-mono text-xs text-text-tertiary">{job.location}</p>
              )}
              {job.description && (
                <p className={BODY} style={{ fontFamily: 'var(--font-sans)' }}>
                  {job.description}
                </p>
              )}
            </GridItem>

            {achievements.map((a, i) => (
              <GridItem
                key={i}
                mobileSpan={4}
                tabletSpan={4}
                span={2}
                start={6 + i * 2}
                className={BODY}
                style={{ fontFamily: 'var(--font-sans)' }}
              >
                {a.text}
              </GridItem>
            ))}
          </Grid>
        </div>
      </div>
    </div>
  )
}
