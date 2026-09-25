'use client'

import { useEffect, useRef, useState } from 'react'
import { Grid, GridItem } from '@/components/layout/Grid'
import { ProjectRow } from '@/components/sections/v2/ProjectRow'
import { useLanguage } from '@/components/providers/LanguageProvider'
import { LABEL } from '@/components/ui/label'
import type { ProjectItem } from '@/content/types'

type Project = ProjectItem

/**
 * The authored `cover` when there is one; otherwise the first image with a real
 * src — some entries lead with a video, one has none.
 */
function coverOf(project: Project): string | undefined {
  return project.cover || project.images?.find((i) => i.src)?.src || undefined
}

/**
 * PLACEHOLDER — the column wants a two-line summary and `description` runs
 * 345–554 characters. There is no summary field in the content yet, so this
 * takes the first sentence. Replace with an authored `summary` per project.
 */
function summaryOf(project: Project): string {
  const first = project.description.split(/(?<=\.)\s/)[0] ?? project.description
  return first
}

/**
 * The copy of the active project, revealed on the site's own entrance system.
 *
 * `-inview` is what fires `-entrance`, and it only means anything if the
 * element was mounted without it first — so the class is withheld for two
 * frames after `token` changes: one for the browser to paint the hidden state,
 * one to flip it. Without the double frame the class is already there on the
 * first paint and the reveal is skipped.
 *
 * There is no exit. The outgoing text is unmounted by the `key` above and is
 * simply gone; it never travels with the image.
 */
function Reveal({
  token,
  className = '',
  children,
}: {
  token: string
  className?: string
  children: React.ReactNode
}) {
  const [shown, setShown] = useState(false)

  useEffect(() => {
    setShown(false)
    let second = 0
    const first = requestAnimationFrame(() => {
      second = requestAnimationFrame(() => setShown(true))
    })
    return () => {
      cancelAnimationFrame(first)
      cancelAnimationFrame(second)
    }
  }, [token])

  return <div className={`${className} ${shown ? '-inview' : ''}`.trim()}>{children}</div>
}

export function ProjectsGrid() {
  const { content } = useLanguage()
  const projects = content.projects.items.filter((p) => !p.disabled)

  // Which project owns the copy right now. The list shows one text at a time,
  // so the covers are watched against a zero-height band at the middle of the
  // screen: shrinking the root by 50% top and bottom leaves a line. A cover
  // rising from below first touches that line with its own top edge, which is
  // exactly the moment the copy is supposed to appear. No scroll listener.
  // -1 until the first cover gets there, so the columns start empty, and -1
  // again once the last cover has gone by, so the copy leaves without travelling.
  const [activeIndex, setActiveIndex] = useState(-1)
  const rowsRef = useRef<(HTMLElement | null)[]>([])

  useEffect(() => {
    const rows = rowsRef.current.filter(Boolean) as HTMLElement[]
    if (rows.length === 0) return

    // The observer only says "something crossed"; the decision is taken from the
    // covers themselves, which is six reads on a crossing and nothing in
    // between. Whoever holds the centre line owns the copy. When nobody does,
    // the copy stays put if the line is resting in a gap between two covers,
    // and is dropped once the line has left the list at either end — that is
    // what makes the last text disappear in place instead of riding the list up.
    const resolve = () => {
      const centre = window.innerHeight / 2
      const rects = rows.map((row) => row.getBoundingClientRect())
      const crossing = rects.findIndex((r) => r.top <= centre && r.bottom >= centre)

      if (crossing >= 0) {
        setActiveIndex(crossing)
        return
      }

      const before = rects[0].top > centre
      const after = rects[rects.length - 1].bottom < centre
      if (before || after) setActiveIndex(-1)
    }

    const observer = new IntersectionObserver(resolve, {
      rootMargin: '-50% 0px -50% 0px',
      threshold: 0,
    })

    rows.forEach((row) => observer.observe(row))
    return () => observer.disconnect()
  }, [projects.length])

  const current = activeIndex >= 0 ? projects[activeIndex] : undefined
  // Deliberately no observer on the section. `-inview` propagates to every
  // descendant, so one here fires every row's entrance the moment the list
  // edges into view — which defeats the per-row staging in ProjectRow, where
  // the image and the copy are supposed to arrive at different moments.
  // Each row owns its own observers now.
  return (
    <section
      // The header's `work` link targets this list — `/#projects`. The scroll
      // lands clear of the sticky bar via `scroll-padding-top` in globals.css.
      id="projects"
      aria-label={content.ui.projects.gridLabel}
      data-section-id="projects"
      // Horizontal padding comes from the <Grid> below; doubling it here would
      // push the columns off the 12-col track.
      // The hero is sticky now, so it holds its own viewport in the flow and
      // the list no longer reserves one — it just needs its own top spacing.
      // z-10 keeps it under the hero, which stays readable over the rows.
      className="relative z-10 pt-16 pb-8 md:pb-12 lg:pb-16"
    >
      {/* The copy of the project on the centre line, on a layer of its own
          fixed to the viewport. It is not sticky: a sticky column only pins
          once its own position reaches the offset, so before that — which is
          exactly when the first cover crosses the centre — it still travels
          with the list, and it travels again at the end of the list. Fixed
          means the copy is at the middle of the screen from the frame it
          appears to the frame it goes.
          The layer only exists while a cover holds the line, so it never
          overlaps the sections above or below. `pointer-events-none` because
          nothing in it is clickable, and `aria-hidden` because the same words
          are in the row itself, tied to their project for assistive tech. */}
      {current && (
        <div
          aria-hidden
          className="pointer-events-none fixed inset-x-0 top-1/2 z-20 hidden -translate-y-1/2 lg:block"
        >
          <Grid>
            {/* `text-balance` on both blocks: they are short enough for the
                browser to even the lines, which is also what stops a title or a
                summary from ending on a single word. Measured over the six
                projects, no line is left with one word. Line breaking stays
                with the browser — nothing here hard-wraps. */}
            {/* Two columns wide, not three: the block is held to columns 1-2,
                so the title sets against the page edge and wraps early instead
                of running the full width of its field. */}
            <GridItem span={2} start={1}>
              <Reveal key={current.slug} token={current.slug} className="flex flex-col gap-2">
                <span className={`-entrance -mask-down -a-0 ${LABEL}`}>
                  {['prj', current.year].filter(Boolean).join('_')} //{' '}
                  {String(activeIndex + 1).padStart(3, '0')}
                </span>
                <h3 className="-entrance -mask-down -a-1 text-balance text-2xl font-semibold text-text-primary">
                  {current.title}
                </h3>
              </Reveal>
            </GridItem>

            {/* The mirror of the left block: two columns, 11-12, so the block
                sets against the page edge. The text inside it is ranged left,
                like the title on the other side. */}
            <GridItem span={2} start={11}>
              <Reveal key={current.slug} token={current.slug}>
                <p className="-entrance -mask-down -a-1 text-balance text-body-md leading-[1.5] text-text-secondary">
                  {summaryOf(current)}
                </p>
              </Reveal>
            </GridItem>
          </Grid>
        </div>
      )}

      <Grid>
        {/* The covers — six columns, the width they have always had, moved one
            column right so the list reads 3-3-3-3. gap-16 (64px) between them,
            the same beat as the hero's --hero-gap cap and the BLOCK_GAP the
            rest of the home is spaced on. */}
        <GridItem
          mobileSpan={4}
          tabletSpan={8}
          span={6}
          start={4}
          className="flex flex-col gap-16"
        >
          {projects.map((project, i) => (
            <ProjectRow
              key={project.slug}
              title={project.title}
              slug={project.slug}
              year={project.year}
              index={i + 1}
              summary={summaryOf(project)}
              cover={coverOf(project)}
              rowRef={(el) => {
                rowsRef.current[i] = el
              }}
            />
          ))}
        </GridItem>

      </Grid>
    </section>
  )
}
