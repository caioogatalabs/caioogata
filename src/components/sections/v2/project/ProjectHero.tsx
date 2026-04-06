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
  const heroImages = project.images.slice(0, 2)
  const hasTwoImages = heroImages.length >= 2

  return (
    <section
      ref={sectionRef as React.RefObject<HTMLElement>}
      className="pt-20 pb-16"
    >
      {/* Title + metadata */}
      <Grid className="mb-8">
        <GridItem span={12} tabletSpan={8} mobileSpan={4}>
          <span className="block font-mono text-xs uppercase tracking-[0.88px] text-text-tertiary mb-4 -entrance -fade -a-0">
            PRJ_{project.year} // {String(index + 1).padStart(3, '0')}
          </span>
          <h1
            className="text-[3.5rem] font-bold leading-[1.15] text-text-primary -entrance -slide-up -a-0"
            style={{ fontFamily: 'var(--font-sans)' }}
          >
            {project.title}
          </h1>
          {project.role && (
            <p className="text-base text-text-secondary mt-3 -entrance -fade -a-1"
              style={{ fontFamily: 'var(--font-sans)' }}
            >
              {project.role}
            </p>
          )}
          {project.technologies && (
            <p className="font-mono text-xs text-text-tertiary uppercase tracking-wider mt-2 -entrance -fade -a-1">
              {project.technologies}
            </p>
          )}
          {section.body && (
            <p className="text-base text-text-secondary leading-relaxed mt-4 -entrance -fade -a-1"
              style={{ fontFamily: 'var(--font-sans)' }}
            >
              {section.body}
            </p>
          )}
        </GridItem>
      </Grid>

      {/* Hero image(s) */}
      {heroImages.length > 0 && (
        <Grid>
          {hasTwoImages ? (
            <>
              <GridItem span={6} tabletSpan={4} mobileSpan={4} className="-entrance -scale-in -a-2">
                <div className="overflow-hidden rounded-[var(--radius-component-md,12px)]">
                  <img
                    src={heroImages[0].src}
                    alt={heroImages[0].title}
                    loading="eager"
                    className="w-full h-auto"
                  />
                </div>
              </GridItem>
              <GridItem span={6} tabletSpan={4} mobileSpan={4} className="-entrance -scale-in -a-3">
                <div className="overflow-hidden rounded-[var(--radius-component-md,12px)]">
                  <img
                    src={heroImages[1].src}
                    alt={heroImages[1].title}
                    loading="eager"
                    className="w-full h-auto"
                  />
                </div>
              </GridItem>
            </>
          ) : (
            <GridItem span={12} tabletSpan={8} mobileSpan={4} className="-entrance -scale-in -a-2">
              <div className="overflow-hidden rounded-[var(--radius-component-md,12px)]">
                <img
                  src={heroImages[0].src}
                  alt={heroImages[0].title}
                  loading="eager"
                  className="w-full h-auto"
                />
              </div>
            </GridItem>
          )}
        </Grid>
      )}
    </section>
  )
}
