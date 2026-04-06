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
        {/* Results label in first 3 cols */}
        <GridItem span={3} tabletSpan={8} mobileSpan={4}>
          <span className="font-mono text-xs uppercase tracking-wider text-text-tertiary -entrance -fade -a-0">
            Results
          </span>
        </GridItem>

        {/* Stats — 3 cols each, starting from col 4 */}
        {stats.map((stat, i) => (
          <GridItem
            key={i}
            span={3}
            tabletSpan={4}
            mobileSpan={4}
            className={`-entrance -slide-up -a-${i + 1}`}
          >
            <div className="flex items-baseline gap-4">
              <p
                className="text-[3.5rem] font-bold leading-none text-text-secondary shrink-0"
                style={{ fontFamily: 'var(--font-sans)' }}
              >
                {stat.value}
              </p>
              <p
                className="text-sm text-text-tertiary uppercase tracking-wider"
                style={{ fontFamily: 'var(--font-sans)' }}
              >
                {stat.label}
              </p>
            </div>
          </GridItem>
        ))}
      </Grid>
    </section>
  )
}
