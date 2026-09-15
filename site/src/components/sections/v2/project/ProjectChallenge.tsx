'use client'

import { useInView } from '@/hooks/useInView'
import { useLanguage } from '@/components/providers/LanguageProvider'
import { Grid, GridItem } from '@/components/layout/Grid'
import type { ProjectItem, ProjectSection } from '@/content/types'
import { LABEL_TYPE } from '@/components/ui/label'

interface ProjectChallengeProps {
  section: ProjectSection
  project: ProjectItem
  projectIndex: number
  /** The project's impact stats, shown on the right half of this same row. */
  impact?: ProjectSection
}

export function ProjectChallenge({ section, project, projectIndex, impact }: ProjectChallengeProps) {
  const sectionRef = useInView()
  const t = useLanguage().content.ui.project

  return (
    <section
      ref={sectionRef as React.RefObject<HTMLElement>}
      className="py-16"
    >
      <Grid>
        {/* Data stamp */}
        <GridItem span={12} tabletSpan={8} mobileSpan={4}>
          <span className={`block ${LABEL_TYPE} mb-10 -entrance -fade -a-0`}>
            <span className="opacity-50">prj_{project.year} // {String(projectIndex + 1).padStart(3, '0')}</span>
          </span>
        </GridItem>

        {/* 3-3-3-3 on desktop: challenge on cols 1-3, solution on 4-6, and the
            impact stats fill 7-9 and 10-12. Tablet keeps 4 + 4 of its 8
            columns and the stats wrap underneath. */}
        {section.challenge && (
          <GridItem span={3} tabletSpan={4} mobileSpan={4}>
            <div className="-entrance -fade -a-1 flex flex-col gap-5">
              <h2
                className="type-display text-text-primary"
              >
                {section.heading || t.challenge}
              </h2>
              <p
                className="text-[18px] leading-[1.6] text-text-tertiary"
                style={{ fontFamily: 'var(--font-sans)' }}
              >
                {section.challenge}
              </p>
            </div>
          </GridItem>
        )}

        {section.solution && (
          <GridItem span={3} tabletSpan={4} mobileSpan={4}>
            <div className="-entrance -fade -a-2 flex flex-col gap-5">
              <h2
                className="type-display text-text-primary"
              >
                {section.solutionHeading || t.solution}
              </h2>
              <p
                className="text-[18px] leading-[1.6] text-text-tertiary"
                style={{ fontFamily: 'var(--font-sans)' }}
              >
                {section.solution}
              </p>
            </div>
          </GridItem>
        )}

        {/* Impact — one column on 7-9, the stats stacked in it, so however many
            there are they read as a single list beside the two text columns. */}
        {impact?.stats && impact.stats.length > 0 && (
          <GridItem
            span={3}
            start={7}
            tabletSpan={4}
            mobileSpan={4}
            className="flex flex-col gap-8 mt-12 lg:mt-0"
          >
            <span className={`block ${LABEL_TYPE} -entrance -fade -a-1`}>
              <span className="opacity-50">{t.results}</span>
            </span>
            {impact.stats.map((stat, i) => (
              <div key={i} className={`-entrance -slide-up -a-${i + 2} flex flex-col gap-2`}>
                <p className="type-display-lg text-text-primary">{stat.value}</p>
                <p
                  className="text-[14px] font-medium leading-[1.5] uppercase tracking-[1.12px] text-text-tertiary max-w-[224px]"
                  style={{ fontFamily: 'var(--font-sans)' }}
                >
                  {stat.label}
                </p>
              </div>
            ))}
          </GridItem>
        )}
      </Grid>
    </section>
  )
}
