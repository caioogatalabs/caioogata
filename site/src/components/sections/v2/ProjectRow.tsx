'use client'

import { Grid, GridItem } from '@/components/layout/Grid'
import { ProjectCover } from '@/components/sections/v2/ProjectCover'
import { useInView } from '@/hooks/useInView'
import { LABEL } from '@/components/ui/label'

interface ProjectRowProps {
  title: string
  slug: string
  year?: string
  index: number
  /** Two-line summary of the project. Not the full description — that is 300+ chars. */
  summary: string
  /** One number that marks the project. Omitted when there is nothing to claim. */
  badge?: string
  /** Sits under the badge and says what the number counts. */
  badgeLabel?: string
  cover?: string
}

/**
 * One project as a grid row: the image sits on columns 3-8, the metadata on
 * 9-12. Inside that column the text is held to 3 columns, so it wraps early
 * instead of running to the page edge — per the design.
 *
 * The card is purely visual; title, index and copy live outside it, unlike
 * `ProjectCard`, which keeps them inside and still backs the /projects index.
 *
 * Square corners. The two halves enter on separate beats: the image as the row
 * touches the viewport, the copy once the row reaches the middle of the screen.
 */
export function ProjectRow({
  title,
  slug,
  year,
  index,
  summary,
  badge,
  badgeLabel,
  cover,
}: ProjectRowProps) {
  // The image announces the row as soon as it touches the viewport.
  const imageRef = useInView({ threshold: 0.1, once: true })

  // The copy waits until the row reaches the middle of the screen. Shrinking the
  // observation box to a thin band turns "is it visible" into "has it reached
  // this line", with no extra hook and no scroll listener. The band's BOTTOM
  // edge is what the column's top crosses, so `-50%` at the bottom puts the
  // trigger exactly on the vertical centre rather than just below it.
  const textRef = useInView({ threshold: 0, rootMargin: '-45% 0px -50% 0px', once: true })

  return (
    <article>
      <Grid>
        {/* Image — 6 columns, from column 3 to column 8. Pulled in one column
            from the left; the right edge stays put.
            The observer goes on the GridItem and the entrance on the <a>
            inside: `-mask-down` hides its own element with `clip-path`, and
            IntersectionObserver measures the target through that clip, so an
            observed element wearing it reports ratio 0 and never fires. */}
        <GridItem
          mobileSpan={4}
          tabletSpan={8}
          span={6}
          start={3}
          ref={imageRef as React.RefObject<HTMLDivElement>}
        >
          <a
            href={`/projects/${slug}`}
            className="-entrance -mask-down block w-full"
            aria-label={`View ${title} project`}
          >
            <ProjectCover src={cover} />
          </a>
        </GridItem>

        {/* Metadata — 4 columns from column 9, text held to 3 of them */}
        <GridItem
          mobileSpan={4}
          tabletSpan={8}
          span={4}
          start={9}
          ref={textRef as React.RefObject<HTMLDivElement>}
          className="grid grid-cols-4 gap-x-4 gap-y-6 self-start lg:gap-y-8"
        >
          <span className={`-entrance -mask-down -a-0 col-span-4 ${LABEL} lg:col-span-3`}>
            {['prj', year].filter(Boolean).join('_')} // {String(index).padStart(3, '0')}
          </span>

          <div className="-entrance -mask-down -a-1 col-span-4 flex flex-col gap-2 lg:col-span-3">
            <h3 className="text-2xl font-semibold text-text-primary">{title}</h3>
            <p className="text-[14px] leading-[1.5] text-text-secondary">{summary}</p>
          </div>

          {badge && (
            <div className="-entrance -mask-down -a-2 col-span-4 flex flex-col gap-2 lg:col-span-3">
              {/* Numerals are all cap height, so trimming the line box to cap
                  height and baseline centres them in the outline exactly —
                  Epilogue's ascender and descender space otherwise sits
                  unevenly above and below. `leading-none` is the fallback
                  where `text-box` is unsupported. */}
              <span className="inline-flex self-start items-center justify-center border border-border-secondary px-2 py-2 text-2xl leading-none font-semibold text-text-primary [text-box:trim-both_cap_alphabetic]">
                {badge}
              </span>
              {badgeLabel && (
                <p className="text-[14px] leading-[1.5] text-text-secondary">{badgeLabel}</p>
              )}
            </div>
          )}
        </GridItem>
      </Grid>
    </article>
  )
}
