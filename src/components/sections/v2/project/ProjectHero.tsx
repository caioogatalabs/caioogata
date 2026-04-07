'use client'

import { useInView } from '@/hooks/useInView'
import { useScrollExpand } from '@/hooks/useScrollExpand'
import { Grid, GridItem } from '@/components/layout/Grid'
import type { ProjectItem, ProjectSection } from '@/content/types'
import dynamic from 'next/dynamic'

const NoiseGradientCanvas = dynamic(
  () => import('@/components/three/NoiseGradientCanvas').then(mod => ({ default: mod.NoiseGradientCanvas })),
  { ssr: false }
)

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
            <p
              className="text-[14px] font-medium leading-[1.5] uppercase tracking-[1.12px] text-text-tertiary -entrance -fade -a-1"
              style={{ fontFamily: 'var(--font-sans)' }}
            >
              {project.technologies}
            </p>
          )}
        </GridItem>
        <GridItem span={8} tabletSpan={8} mobileSpan={4}>
          {section.body && (
            <p
              className="text-[48px] leading-[1.15] tracking-[-0.96px] text-text-primary -entrance -fade -a-1"
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
  const imageRef = useInView()
  const { ref: expandRef, clipPath, opacity } = useScrollExpand()
  const heroImage = project.images[0]
  if (!heroImage) return null

  const hasGradient = !!project.colors

  return (
    <section ref={imageRef as React.RefObject<HTMLElement>} className="pb-16">
      <Grid>
        <GridItem span={12} tabletSpan={8} mobileSpan={4} className="-entrance -scale-in -a-2">
          {hasGradient ? (
            <div
              ref={expandRef as React.RefObject<HTMLDivElement>}
              className="relative overflow-hidden rounded-[var(--radius-component-md,12px)]"
            >
              {/* Noise gradient background — scroll-expand via clip-path */}
              <NoiseGradientCanvas
                colors={project.colors!}
                className="absolute inset-0 z-0"
                style={{ clipPath, opacity }}
              />
              {/* Hero image — 9/12 cols centered */}
              <div className="relative z-10 mx-auto w-[75%] py-[4%]">
                <div className="overflow-hidden rounded-[var(--radius-component-md,12px)]">
                  <img
                    src={heroImage.src}
                    alt={heroImage.title}
                    loading="eager"
                    className="w-full h-auto"
                  />
                </div>
              </div>
            </div>
          ) : (
            <div className="overflow-hidden rounded-[var(--radius-component-md,12px)]">
              <img
                src={heroImage.src}
                alt={heroImage.title}
                loading="eager"
                className="w-full h-auto"
              />
            </div>
          )}
        </GridItem>
      </Grid>
    </section>
  )
}
