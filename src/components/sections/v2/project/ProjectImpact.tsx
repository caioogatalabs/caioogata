'use client'

import { useInView } from '@/hooks/useInView'
import { Grid, GridItem } from '@/components/layout/Grid'
import type { ProjectSection } from '@/content/types'

interface ProjectImpactProps {
  section: ProjectSection
}

function getSpanForCount(count: number): number {
  if (count === 2) return 6
  if (count === 3) return 4
  if (count === 4) return 3
  // fallback: divide 12 evenly
  return Math.floor(12 / count)
}

export function ProjectImpact({ section }: ProjectImpactProps) {
  const sectionRef = useInView()
  const stats = section.stats

  if (!stats || stats.length === 0) return null

  const spanPerStat = getSpanForCount(stats.length)

  return (
    <section
      ref={sectionRef as React.RefObject<HTMLElement>}
      className="py-16"
    >
      <Grid>
        {stats.map((stat, i) => (
          <GridItem
            key={i}
            span={spanPerStat}
            tabletSpan={4}
            mobileSpan={4}
            className={`-entrance -slide-up -a-${i}`}
          >
            <p
              className="text-[3.5rem] font-bold leading-[1.15] text-text-brand"
              style={{ fontFamily: 'var(--font-sans)' }}
            >
              {stat.value}
            </p>
            <p className="font-mono text-base text-text-secondary mt-2">
              {stat.label}
            </p>
          </GridItem>
        ))}
      </Grid>
    </section>
  )
}
