'use client'

import { useInView } from '@/hooks/useInView'
import type { ProjectItem } from '@/content/types'

interface ProjectCreditsProps {
  project: ProjectItem
}

export function ProjectCredits({ project }: ProjectCreditsProps) {
  const sectionRef = useInView()

  if (!project.credits || project.credits.length === 0) return null

  return (
    <section
      ref={sectionRef as React.RefObject<HTMLElement>}
      className="pt-12 pb-16 px-5 md:px-8 lg:px-16"
    >
      <h2
        className="text-[1.875rem] font-bold leading-[1.2] text-text-primary mb-6 -entrance -fade -a-0"
        style={{ fontFamily: 'var(--font-sans)' }}
      >
        Credits
      </h2>

      <div className="space-y-2">
        {project.credits.map((credit, i) => (
          <p key={i} className={`text-base -entrance -fade -a-${i + 1}`} style={{ fontFamily: 'var(--font-sans)' }}>
            {credit.url ? (
              <a
                href={credit.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-text-secondary hover:text-text-primary hover:underline transition-colors"
              >
                {credit.name}
              </a>
            ) : (
              <span className="text-text-secondary">{credit.name}</span>
            )}
            {credit.role && (
              <span className="text-text-tertiary"> {'\u2014'} {credit.role}</span>
            )}
          </p>
        ))}
      </div>
    </section>
  )
}
