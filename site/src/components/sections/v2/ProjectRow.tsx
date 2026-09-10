'use client'

import Image from 'next/image'
import { useScrollReveal } from '@/hooks/useScrollReveal'

interface ProjectRowProps {
  title: string
  slug: string
  year?: string
  index: number
  description: string
  /** Headline number for the badge. Placeholder content for now — see impact copy. */
  badge?: string
  /** Sits under the badge. The outcome, where the description is the what. */
  impact?: string
  cover?: string
}

/**
 * One project as a full-width row: a left gutter, a large image card, and a
 * metadata column on the right. Replaces the 2-up card grid on the home page.
 *
 * The card is purely visual — title, index and copy live outside it, unlike
 * `ProjectCard`, which keeps them inside and still serves the /projects index.
 *
 * Below `lg` the gutter collapses and the column stacks under the card.
 */
export function ProjectRow({
  title,
  slug,
  year,
  index,
  description,
  badge,
  impact,
  cover,
}: ProjectRowProps) {
  const { ref, clipPath } = useScrollReveal()

  return (
    <article className="flex flex-col lg:flex-row gap-5 lg:gap-4 w-full">
      {/* Gutter — empty by design, holds the row off the left edge */}
      <div className="hidden lg:block shrink-0 w-[100px]" aria-hidden />

      {/* Image card */}
      <a
        href={`/projects/${slug}`}
        ref={ref as React.RefObject<HTMLAnchorElement>}
        className="relative block flex-1 h-[280px] md:h-[380px] lg:h-[502px] bg-bg-surface-primary rounded-[var(--radius-component-sm)] overflow-hidden"
        style={{ clipPath }}
        aria-label={`View ${title} project`}
      >
        {cover && (
          <Image
            src={cover}
            alt=""
            fill
            sizes="(min-width: 1024px) 60vw, 100vw"
            className="object-cover"
          />
        )}
      </a>

      {/* Metadata column */}
      <div className="flex flex-col gap-6 lg:gap-8 shrink-0 w-full lg:w-[335px]">
        <span className="font-mono text-[11px] font-medium uppercase tracking-[0.88px] text-text-tertiary">
          {['PRJ', year].filter(Boolean).join('_')} // {String(index).padStart(3, '0')}
        </span>

        <div className="flex flex-col gap-2">
          <h3 className="text-2xl font-semibold text-text-primary">{title}</h3>
          <p className="text-lg leading-[1.6] text-text-secondary">{description}</p>
        </div>

        {badge && (
          <div className="flex flex-col gap-2">
            <span className="inline-flex self-start items-center justify-center border border-border-secondary px-2 py-1 text-2xl font-semibold text-text-primary">
              {badge}
            </span>
            {impact && (
              <p className="text-lg leading-[1.6] text-text-secondary">{impact}</p>
            )}
          </div>
        )}
      </div>
    </article>
  )
}
