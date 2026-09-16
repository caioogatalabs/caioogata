'use client'

import { useInView } from '@/hooks/useInView'
import { useLanguage } from '@/components/providers/LanguageProvider'
import { Grid, GridItem } from '@/components/layout/Grid'
import type { ProjectSection } from '@/content/types'
import { LABEL_TYPE, LABEL_LG } from '@/components/ui/label'

interface ProjectImpactProps {
  section: ProjectSection
}

/**
 * The numbers sit on the middle third of the page: the first four columns stay
 * empty, and the next four split 2-2 into two stacked blocks. The left block
 * fills first, so three stats read two and one — the same shape as the Figma.
 */
function splitIntoColumns<T>(stats: T[]): [T[], T[]] {
  const left = Math.ceil(stats.length / 2)
  return [stats.slice(0, left), stats.slice(left)]
}

function StatBlock({ value, label }: { value: string; label: string }) {
  return (
    <div className="flex flex-col gap-2">
      <p className="type-display-lg text-text-primary">{value}</p>
      <p className={`${LABEL_LG} max-w-[224px]`}>{label}</p>
    </div>
  )
}

export function ProjectImpact({ section }: ProjectImpactProps) {
  const sectionRef = useInView()
  const t = useLanguage().content.ui.project
  const stats = section.stats

  if (!stats || stats.length === 0) return null

  const columns = splitIntoColumns(stats)

  return (
    <section
      ref={sectionRef as React.RefObject<HTMLElement>}
      className="py-16"
    >
      <Grid>
        <GridItem span={4} start={5} tabletSpan={8} mobileSpan={4}>
          <span className={`block ${LABEL_TYPE} mb-4 -entrance -fade -a-0`}>
            <span className="opacity-50">{t.results}</span>
          </span>
        </GridItem>

        {columns.map((column, columnIdx) =>
          column.length === 0 ? null : (
            <GridItem
              key={columnIdx}
              span={2}
              start={columnIdx === 0 ? 5 : 7}
              tabletSpan={4}
              mobileSpan={4}
              className="flex flex-col gap-10"
            >
              {column.map((stat, i) => (
                <div
                  key={i}
                  className={`-entrance -slide-up -a-${columnIdx * 2 + i + 1}`}
                >
                  <StatBlock value={stat.value} label={stat.label} />
                </div>
              ))}
            </GridItem>
          )
        )}
      </Grid>
    </section>
  )
}
