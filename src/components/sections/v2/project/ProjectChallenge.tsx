'use client'

import { useInView } from '@/hooks/useInView'
import { Grid, GridItem } from '@/components/layout/Grid'
import type { ProjectSection } from '@/content/types'

interface ProjectChallengeProps {
  section: ProjectSection
}

export function ProjectChallenge({ section }: ProjectChallengeProps) {
  const sectionRef = useInView()

  return (
    <section
      ref={sectionRef as React.RefObject<HTMLElement>}
      className="py-16"
    >
      <Grid>
        {/* Challenge column (cols 1-4) */}
        {section.challenge && (
          <GridItem span={4} tabletSpan={4} mobileSpan={4}>
            <div className="-entrance -fade -a-0">
              <h2
                className="text-[2rem] font-bold leading-[1.2] text-text-primary mb-6"
                style={{ fontFamily: 'var(--font-sans)' }}
              >
                Challenge
              </h2>
              <p
                className="text-base text-text-secondary leading-relaxed"
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
            <div className="-entrance -fade -a-1">
              <h2
                className="text-[2rem] font-bold leading-[1.2] text-text-primary mb-6"
                style={{ fontFamily: 'var(--font-sans)' }}
              >
                Solution
              </h2>
              <p
                className="text-base text-text-secondary leading-relaxed"
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
