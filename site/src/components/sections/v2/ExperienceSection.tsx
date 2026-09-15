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

  // Every panel opens to the same height: the tallest one's. The rows carry
  // between one and three achievement columns and descriptions of very
  // different lengths, so each was expanding by a different amount and the
  // list jumped by a different distance on every row. Collapsed panels still
  // report their natural height through `scrollHeight`, so this can be read
  // once without opening anything.
  const [panelHeight, setPanelHeight] = useState(0)

  useEffect(() => {
    const container = containerRef.current
    if (!container) return
    const measure = () => {
      // Neutralise the height already applied before reading, or the measure
      // reads its own output back: `scrollHeight` includes the min-height, so
      // the value could only ever ratchet up and never shrink when a wider
      // viewport rewrapped the text shorter. Clearing and restoring happens in
      // one synchronous block, so nothing paints in between, and the previous
      // value is put back rather than dropped — React only re-applies the
      // style prop when the number actually changes.
      const grids = container.querySelectorAll<HTMLElement>('[data-experience-panel] > *')
      const previous: string[] = []
      grids.forEach((grid, i) => {
        previous[i] = grid.style.minHeight
        grid.style.minHeight = '0px'
      })

      let tallest = 0
      container.querySelectorAll<HTMLElement>('[data-experience-panel]').forEach((panel) => {
        tallest = Math.max(tallest, panel.scrollHeight)
      })

      grids.forEach((grid, i) => {
        grid.style.minHeight = previous[i]
      })
      setPanelHeight(tallest)
    }
    measure()
    // The text rewraps with the viewport, and web fonts land after first paint.
    window.addEventListener('resize', measure)
    document.fonts?.ready.then(measure)
    return () => window.removeEventListener('resize', measure)
  }, [])

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
              panelHeight={panelHeight}
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
  /** Shared open height, the tallest panel in the list. 0 until measured. */
  panelHeight: number
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
function ExperienceRow({ job, index, isOpen, reducedMotion, panelHeight }: ExperienceRowProps) {
  const staggerClass = `-a-${Math.min(index, 20)}`
  // At most 3, one per pair of columns across 7-12.
  const achievements = (job.achievements ?? []).slice(0, 3)

  return (
    <div
      data-experience-row
      role="listitem"
      className={`-entrance -slide-up ${staggerClass} border-t border-border-primary/10 last:border-b`}
    >
      {/* Header — date (1-2) company (4-6) title (7-10) indicator (11-12).
          Company and title sit on the same lanes the panel's text blocks use
          below — description on 4, achievements from 7 — so the row reads as
          one column of text whether it is open or closed. Column 3 stays empty
          in both, keeping the year in its own lane. */}
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
          start={4}
          className="text-text-primary"
          style={{ fontFamily: 'var(--font-sans)', fontWeight: 600 }}
        >
          {job.company}
        </GridItem>

        <GridItem
          mobileSpan={4}
          tabletSpan={2}
          span={4}
          start={7}
          className="order-3 text-text-secondary md:order-none"
          style={{ fontFamily: 'var(--font-sans)' }}
        >
          {job.title}
        </GridItem>

        <GridItem
          mobileSpan={1}
          tabletSpan={1}
          span={2}
          start={11}
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
        <div data-experience-panel className="overflow-hidden">
          {/* The panel starts one column right of the header's company and runs
              to the edge of the grid:
                location + description   4-6
                achievements             7-8, 9-10, 11-12
              Columns 1-3 stay empty, so the year keeps its own lane.

              `row-start` rather than source order: the location is a label on
              its own line, and without an explicit row the achievements would
              auto-place beside it instead of below. Every text block now begins
              on row 2, level with the description — the leftmost block sets the
              line. Below `lg` the blocks stack and the rows do not apply. */}
          {/* `content-start` and `items-start` together are what keep every row
              starting its text at the same height. The panel carries the
              tallest panel's height as a floor, and by default grid hands that
              slack to the rows themselves — which inflated the location row
              from 24px to 66px on the shorter entries and pushed their text
              down with it. Packed to the top instead, the slack falls to the
              bottom of the panel where it belongs, and the first line of every
              open row sits on the same line. */}
          <Grid
            className="!px-0 pb-6 content-start items-start"
            style={panelHeight ? { minHeight: panelHeight } : undefined}
          >
            {job.location && (
              <GridItem
                mobileSpan={4}
                tabletSpan={4}
                span={3}
                start={4}
                className="mb-2 font-mono text-xs text-text-tertiary md:col-start-3 lg:row-start-1"
              >
                {job.location}
              </GridItem>
            )}

            {job.description && (
              <GridItem
                mobileSpan={4}
                tabletSpan={4}
                span={3}
                start={4}
                className={`${BODY} md:col-start-3 lg:row-start-2`}
                style={{ fontFamily: 'var(--font-sans)' }}
              >
                {job.description}
              </GridItem>
            )}

            {achievements.map((a, i) => (
              <GridItem
                key={i}
                mobileSpan={4}
                tabletSpan={4}
                span={2}
                start={7 + i * 2}
                className={`${BODY} lg:row-start-2`}
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
