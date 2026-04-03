'use client'

interface ProjectCardProps {
  title: string
  slug: string
  year: string
  index: number
  className?: string
}

export function ProjectCard({ title, slug, year, index, className = '' }: ProjectCardProps) {
  return (
    <article
      className={`relative flex flex-col justify-between h-[280px] md:h-[320px] lg:h-[420px] p-6 bg-bg-surface-primary rounded-[12px] ${className}`.trim()}
    >
      <div className="flex justify-between items-start gap-4">
        <h3 className="text-xl font-medium tracking-tight text-text-primary">
          {title}
        </h3>
        <span className="shrink-0 font-mono text-sm uppercase tracking-widest text-text-secondary">
          PRJ_{year} // {String(index).padStart(3, '0')}
        </span>
      </div>
      <div className="flex justify-end">
        <a
          href={`/projects/${slug}`}
          className="flex items-center justify-center w-11 h-11 rounded-full bg-bg-surface-secondary-hover text-icon-primary transition-colors duration-300 hover:bg-bg-fill-primary hover:text-text-on-primary"
          aria-label={`View ${title} project`}
        >
          <svg
            width="20"
            height="20"
            viewBox="0 0 20 20"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
          >
            <path d="M4 10h12M12 5l5 5-5 5" />
          </svg>
        </a>
      </div>
    </article>
  )
}
