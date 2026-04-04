'use client'

import { useScrollReveal } from '@/hooks/useScrollReveal'

interface ProjectCardProps {
  title: string
  slug: string
  year: string
  index: number
  className?: string
}

export function ProjectCard({ title, slug, year, index, className = '' }: ProjectCardProps) {
  const { ref, clipPath } = useScrollReveal()

  return (
    <article
      ref={ref as React.RefObject<HTMLElement>}
      className={`relative flex flex-col h-[280px] md:h-[320px] lg:h-[420px] p-6 bg-bg-surface-primary rounded-[var(--radius-component-md,12px)] overflow-hidden ${className}`.trim()}
      style={{ clipPath }}
    >
      {/* Top: title + data-stamp */}
      <div className="flex items-center justify-between w-full whitespace-nowrap">
        <h3 className="text-xl font-semibold text-text-primary font-mono">
          {title}
        </h3>
        <span className="shrink-0 font-mono text-[11px] font-medium uppercase tracking-[0.88px] text-text-tertiary">
          PRJ_{year} // {String(index).padStart(3, '0')}
        </span>
      </div>

      {/* Spacer */}
      <div className="flex-1" />

      {/* Bottom: arrow button */}
      <div className="flex items-center justify-end w-full">
        <a
          href={`/projects/${slug}`}
          className="flex items-center justify-center size-12 rounded-full bg-bg-fill-primary text-text-on-primary text-2xl font-bold font-mono transition-colors duration-300 hover:bg-bg-fill-primary-hover"
          aria-label={`View ${title} project`}
          style={{ borderRadius: '999px' }}
        >
          →
        </a>
      </div>
    </article>
  )
}
