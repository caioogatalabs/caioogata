'use client'

import { useInView } from '@/hooks/useInView'
import { ProjectCard } from '@/components/sections/v2/ProjectCard'
import content from '@/content/en.json'

const yearMap: Record<string, string> = {
  'azion-website': '2022',
  'azion-console-kit': '2023',
  'azion-design-system': '2022',
  'azion-brand-system': '2021',
  'huia': '2020',
}

const projects = content.projects.items.filter((p) => !p.disabled)

/**
 * /projects index list — same `ProjectCard` and 2-up row layout as the
 * home `ProjectsGrid`, but renders ALL active projects (no slice). Rows
 * are emitted in pairs; a final solo row stretches to half-width on
 * desktop so the card keeps the same aspect as a paired card.
 */
export function ProjectsList() {
  const sectionRef = useInView({ threshold: 0.1 })

  // Chunk into rows of 2 (matches home ProjectsGrid rhythm).
  const rows: typeof projects[] = []
  for (let i = 0; i < projects.length; i += 2) {
    rows.push(projects.slice(i, i + 2))
  }

  return (
    <section
      ref={sectionRef as React.RefObject<HTMLElement>}
      aria-label="All projects"
      data-section-id="projects-list"
      className="flex flex-col gap-5 px-5 py-8 md:px-8 md:py-12 lg:px-16 lg:py-16"
    >
      {rows.map((row, rowIndex) => (
        <div key={rowIndex} className="flex flex-col md:flex-row gap-5">
          {row.map((project, i) => (
            <ProjectCard
              key={project.slug}
              title={project.title}
              slug={project.slug}
              year={yearMap[project.slug] || '2024'}
              index={rowIndex * 2 + i + 1}
              className="flex-1"
            />
          ))}
          {/* Pad solo trailing row so the card keeps half-width on desktop */}
          {row.length === 1 && <div className="hidden md:block flex-1" aria-hidden />}
        </div>
      ))}
    </section>
  )
}
