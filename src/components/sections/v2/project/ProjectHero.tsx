'use client'

import { useInView } from '@/hooks/useInView'
import { Grid, GridItem } from '@/components/layout/Grid'
import type { ProjectItem, ProjectSection } from '@/content/types'

interface ProjectHeroProps {
  project: ProjectItem
  section: ProjectSection
  index: number
}

export function ProjectHero({ project, section, index }: ProjectHeroProps) {
  const sectionRef = useInView()

  return (
    <section
      ref={sectionRef as React.RefObject<HTMLElement>}
      className="pt-20 pb-8"
    >
      <h1 className="sr-only">{project.title}</h1>

      <Grid>
        <GridItem span={12} tabletSpan={8} mobileSpan={4}>
          <span className="block font-mono text-xs uppercase tracking-[0.88px] text-text-tertiary mb-6 -entrance -fade -a-0">
            PRJ_{project.year} // {String(index + 1).padStart(3, '0')}
          </span>
        </GridItem>

        {/* Technologies left (4-col) + description right (8-col) */}
        <GridItem span={4} tabletSpan={8} mobileSpan={4}>
          {project.technologies && (
            <p className="font-mono text-xs text-text-tertiary uppercase tracking-wider -entrance -fade -a-1">
              {project.technologies}
            </p>
          )}
        </GridItem>
        <GridItem span={8} tabletSpan={8} mobileSpan={4}>
          {section.body && (
            <p
              className="text-[1.5rem] leading-[1.4] text-text-secondary -entrance -fade -a-1"
              style={{ fontFamily: 'var(--font-sans)' }}
            >
              {section.body}
            </p>
          )}
        </GridItem>
      </Grid>
    </section>
  )
}

/** Hero image rendered separately — shell places navbar between text and image */
export function ProjectHeroImage({ project }: { project: ProjectItem }) {
  const heroImage = project.images[0]
  if (!heroImage) return null

  return (
    <section className="pb-16">
      <Grid>
        <GridItem span={12} tabletSpan={8} mobileSpan={4} className="-entrance -scale-in -a-2">
          <div className="overflow-hidden rounded-[var(--radius-component-md,12px)]">
            <img
              src={heroImage.src}
              alt={heroImage.title}
              loading="eager"
              className="w-full h-auto"
            />
          </div>
        </GridItem>
      </Grid>
    </section>
  )
}
