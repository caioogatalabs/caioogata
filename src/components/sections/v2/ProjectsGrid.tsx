'use client'

import { useInView } from '@/hooks/useInView'
import { Grid, GridItem } from '@/components/layout/Grid'
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
      className="py-16 lg:py-24"
    >
      <Grid>
        <GridItem span={12} tabletSpan={8} mobileSpan={4}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {projects.map((project, i) => (
              <ProjectCard
                key={project.slug}
                title={project.title}
                slug={project.slug}
                year={yearMap[project.slug] || '2024'}
                index={i + 1}
                className={`-entrance -slide-up -a-${i}`}
              />
            ))}
          </div>
        </GridItem>
      </Grid>
    </section>
  )
}
