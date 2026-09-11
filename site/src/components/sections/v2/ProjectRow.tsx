'use client'

import Image from 'next/image'
import { Grid, GridItem } from '@/components/layout/Grid'

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
 * One project as a grid row: the image spans 8 columns, the metadata column the
 * remaining 4. Inside that column the text is held to 3 columns, so it wraps
 * early instead of running to the page edge — per the design.
 *
 * The card is purely visual; title, index and copy live outside it, unlike
 * `ProjectCard`, which keeps them inside and still backs the /projects index.
 *
 * Square corners, no entrance animation — deliberately bare while other
 * effects are being tried.
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
  return (
    <article>
      <Grid>
        {/* Image — 7 columns, offset to start at column 2 */}
        <GridItem mobileSpan={4} tabletSpan={8} span={7} start={2}>
          <a
            href={`/projects/${slug}`}
            className="relative block h-[280px] w-full overflow-hidden bg-bg-surface-primary md:h-[380px] lg:h-[502px]"
            aria-label={`View ${title} project`}
          >
            {cover && (
              <Image
                src={cover}
                alt=""
                fill
                sizes="(min-width: 1024px) 66vw, 100vw"
                className="object-cover"
              />
            )}
          </a>
        </GridItem>

        {/* Metadata — 4 columns from column 9, text held to 3 of them */}
        <GridItem
          mobileSpan={4}
          tabletSpan={8}
          span={4}
          start={9}
          className="grid grid-cols-4 gap-x-4 gap-y-6 self-start lg:gap-y-8"
        >
          <span className="col-span-4 font-mono text-[11px] font-medium uppercase tracking-[0.88px] text-text-tertiary lg:col-span-3">
            {['PRJ', year].filter(Boolean).join('_')} // {String(index).padStart(3, '0')}
          </span>

          <div className="col-span-4 flex flex-col gap-2 lg:col-span-3">
            <h3 className="text-2xl font-semibold text-text-primary">{title}</h3>
            <p className="text-lg leading-[1.6] text-text-secondary">{summary}</p>
          </div>

          {badge && (
            <div className="col-span-4 flex flex-col gap-2 lg:col-span-3">
              <span className="inline-flex self-start items-center justify-center border border-border-secondary px-2 py-1 text-2xl font-semibold text-text-primary">
                {badge}
              </span>
              {badgeLabel && (
                <p className="text-lg leading-[1.6] text-text-secondary">{badgeLabel}</p>
              )}
            </div>
          )}
        </GridItem>
      </Grid>
    </article>
  )
}
