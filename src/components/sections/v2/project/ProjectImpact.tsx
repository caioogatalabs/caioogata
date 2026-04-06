'use client'

import { useInView } from '@/hooks/useInView'
import { Grid, GridItem } from '@/components/layout/Grid'
import type { ProjectSection } from '@/content/types'

interface ProjectImpactProps {
  section: ProjectSection
}

/** After a 3-col left spacer, distribute 9 remaining cols among stats */
function getStatSpan(count: number): number {
  if (count <= 2) return 4
  if (count === 3) return 3
  return Math.floor(9 / count)
}

export function ProjectImpact({ section }: ProjectImpactProps) {
  const sectionRef = useInView()
  const stats = section.stats

  if (!stats || stats.length === 0) return null

  const spanPerStat = getStatSpan(stats.length)

  return (
    <section
      ref={sectionRef as React.RefObject<HTMLElement>}
      className="py-16"
    >
      <Grid>
        {/* Results label — full row */}
        <GridItem span={12} tabletSpan={8} mobileSpan={4}>
          <span className="block font-mono text-xs uppercase tracking-[0.88px] text-text-tertiary mb-4 -entrance -fade -a-0">
            Results
          </span>
        </GridItem>

        {/* Left spacer (3 cols) */}
        <GridItem span={3} tabletSpan={0} mobileSpan={0} className="hidden lg:block" />

        {/* Stats */}
        {stats.map((stat, i) => (
          <GridItem
            key={i}
            span={spanPerStat}
            tabletSpan={4}
            mobileSpan={4}
            className={`-entrance -slide-up -a-${i + 1}`}
          >
            <div className="flex flex-wrap items-start gap-5">
              <p
                className="text-[72px] leading-[1.15] tracking-[-1.44px] text-text-primary"
                style={{ fontFamily: 'var(--font-sans)' }}
              >
                {stat.value}
              </p>
              <p
                className="text-[14px] font-medium leading-[1.5] uppercase tracking-[1.12px] text-text-tertiary pt-2 max-w-[224px]"
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
