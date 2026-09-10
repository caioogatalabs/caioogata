'use client'

import { useInView } from '@/hooks/useInView'
import { ProjectRow } from '@/components/sections/v2/ProjectRow'
import content from '@/content/en.json'

const projects = content.projects.items.filter((p) => !p.disabled)

/** First image with a real src — some entries lead with a video, one has none. */
function coverOf(project: (typeof projects)[number]): string | undefined {
  return project.images?.find((i) => i.src)?.src || undefined
}

export function ProjectsGrid() {
  const sectionRef = useInView({ threshold: 0.1 })

  return (
    <section
      ref={sectionRef as React.RefObject<HTMLElement>}
      aria-label="Projects"
      data-section-id="projects"
      className="flex flex-col gap-5 px-5 py-8 md:px-8 md:py-12 lg:px-16 lg:py-16"
    >
      {projects.map((project, i) => (
        <ProjectRow
          key={project.slug}
          title={project.title}
          slug={project.slug}
          year={project.year}
          index={i + 1}
          description={project.description}
          impact={project.impact}
          cover={coverOf(project)}
        />
      ))}
    </section>
  )
}
