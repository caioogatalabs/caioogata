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
}

export function ProjectChallenge({ section, project, projectIndex }: ProjectChallengeProps) {
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

        {/* Challenge column (cols 1-4) */}
        {section.challenge && (
          <GridItem span={4} tabletSpan={4} mobileSpan={4}>
            <div className="-entrance -fade -a-1 flex flex-col gap-5">
              <h2
                className="text-[48px] leading-[1.15] tracking-[-0.96px] text-text-primary"
                style={{ fontFamily: 'var(--font-sans)' }}
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

        {/* Solution column (cols 5-8) */}
        {section.solution && (
          <GridItem span={4} tabletSpan={4} mobileSpan={4}>
            <div className="-entrance -fade -a-2 flex flex-col gap-5">
              <h2
                className="text-[48px] leading-[1.15] tracking-[-0.96px] text-text-primary"
                style={{ fontFamily: 'var(--font-sans)' }}
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
        {/* cols 9-12 intentionally empty */}
      </Grid>
    </section>
  )
}
