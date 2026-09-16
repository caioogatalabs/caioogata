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

        {/* 4-4-4 on desktop with the first four columns left empty: challenge
            on 5-8, solution on 9-12. The impact stats are their own row below,
            on the same grid. Tablet keeps 4 + 4 of its eight columns. */}
        {section.challenge && (
          <GridItem span={4} start={5} tabletSpan={4} mobileSpan={4}>
            <div className="-entrance -fade -a-1 flex flex-col gap-5">
              <h2
                className="type-display text-text-primary"
              >
                {section.heading || t.challenge}
              </h2>
              {/* Three of the block's four columns: for a 4-col item of width
                  4c + 3g, three columns are 3c + 2g = 75% - g/4, and the
                  desktop gap is 20px. */}
              <p
                className="text-[14px] leading-[1.6] md:text-[18px] lg:max-w-[calc(75%-5px)] text-text-tertiary"
                style={{ fontFamily: 'var(--font-sans)' }}
              >
                {section.challenge}
              </p>
            </div>
          </GridItem>
        )}

        {section.solution && (
          <GridItem span={4} start={9} tabletSpan={4} mobileSpan={4}>
            <div className="-entrance -fade -a-2 flex flex-col gap-5">
              <h2
                className="type-display text-text-primary"
              >
                {section.solutionHeading || t.solution}
              </h2>
              {/* Three of the block's four columns: for a 4-col item of width
                  4c + 3g, three columns are 3c + 2g = 75% - g/4, and the
                  desktop gap is 20px. */}
              <p
                className="text-[14px] leading-[1.6] md:text-[18px] lg:max-w-[calc(75%-5px)] text-text-tertiary"
                style={{ fontFamily: 'var(--font-sans)' }}
              >
                {section.solution}
              </p>
            </div>
          </GridItem>
        )}

      </Grid>
    </section>
  )
}
