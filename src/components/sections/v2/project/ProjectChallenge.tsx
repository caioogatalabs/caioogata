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
      {/* Challenge */}
      {section.challenge && (
        <Grid className="mb-12">
          <GridItem span={4} tabletSpan={8} mobileSpan={4}>
            <h2
              className="text-[1.875rem] font-bold leading-[1.2] text-text-primary -entrance -slide-up -a-0"
              style={{ fontFamily: 'var(--font-sans)' }}
            >
              Challenge
            </h2>
          </GridItem>
          <GridItem span={8} tabletSpan={8} mobileSpan={4}>
            <p className="text-base text-text-secondary leading-relaxed -entrance -fade -a-1"
              style={{ fontFamily: 'var(--font-sans)' }}
            >
              {section.challenge}
            </p>
          </GridItem>
        </Grid>
      )}

      {/* Solution */}
      {section.solution && (
        <Grid>
          <GridItem span={4} tabletSpan={8} mobileSpan={4}>
            <h2
              className="text-[1.875rem] font-bold leading-[1.2] text-text-primary -entrance -slide-up -a-0"
              style={{ fontFamily: 'var(--font-sans)' }}
            >
              Solution
            </h2>
          </GridItem>
          <GridItem span={8} tabletSpan={8} mobileSpan={4}>
            <p className="text-base text-text-secondary leading-relaxed -entrance -fade -a-1"
              style={{ fontFamily: 'var(--font-sans)' }}
            >
              {section.solution}
            </p>
          </GridItem>
        </Grid>
      )}
    </section>
  )
}
