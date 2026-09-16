'use client'

import { Grid, GridItem } from '@/components/layout/Grid'
import { SplitText } from '@/components/motion/SplitText'
import type { ProjectSection } from '@/content/types'

interface ProjectStatementProps {
  section: ProjectSection
}

/**
 * A display-size line of copy between the numbers and the detail below, on the
 * template's usual eight columns with the first four left empty. It reads as a
 * door into the breakdown that follows, not as a section of its own.
 */
export function ProjectStatement({ section }: ProjectStatementProps) {
  if (!section.body) return null

  return (
    <section className="py-8">
      <Grid>
        <GridItem span={8} start={5} tabletSpan={8} mobileSpan={4}>
          <SplitText
            type="line"
            text={section.body}
            className="type-display text-text-primary"
            staggerMs={120}
            durationMs={1100}
            baseDelayMs={100}
          />
        </GridItem>
      </Grid>
    </section>
  )
}
