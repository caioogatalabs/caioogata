'use client'

import { useInView } from '@/hooks/useInView'
import { ProjectCard } from '@/components/sections/v2/ProjectCard'
import content from '@/content/en.json'

const yearMap: Record<string, string> = {
  'azion-website': '2022',
  'azion-console-kit': '2023',
  'azion-design-system': '2022',
  'azion-brand-system': '2021',
}

const projects = content.projects.items.filter((p) => !p.disabled).slice(0, 4)

export function ProjectsGrid() {
  const sectionRef = useInView({ threshold: 0.1 })

  return (
    <section
      ref={sectionRef as React.RefObject<HTMLElement>}
      aria-label="Projects"
      data-section-id="projects"
      className="flex flex-col gap-5 px-5 py-8 md:px-8 md:py-12 lg:px-16 lg:py-16"
    >
      {/* Row 1 */}
      <div className="flex flex-col md:flex-row gap-5">
        {projects.slice(0, 2).map((project, i) => (
          <ProjectCard
            key={project.slug}
            title={project.title}
            slug={project.slug}
            year={yearMap[project.slug] || '2024'}
            index={i + 1}
            className="flex-1"
          />
        ))}
      </div>
      {/* Row 2 */}
      <div className="flex flex-col md:flex-row gap-5">
        {projects.slice(2, 4).map((project, i) => (
          <ProjectCard
            key={project.slug}
            title={project.title}
            slug={project.slug}
            year={yearMap[project.slug] || '2024'}
            index={i + 3}
            className="flex-1"
          />
        ))}
      </div>
    </section>
  )
}
