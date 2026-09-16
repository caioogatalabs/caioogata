'use client'

import { useInView } from '@/hooks/useInView'
import { useLanguage } from '@/components/providers/LanguageProvider'
import { Grid, GridItem } from '@/components/layout/Grid'
import type { ProjectSection } from '@/content/types'
import { LABEL_TYPE, LABEL_LG } from '@/components/ui/label'
import { AnimatedDivider, RevealGroup } from '@/components/motion/SplitText'

interface ProjectImpactProps {
  section: ProjectSection
}

/**
 * The numbers sit on the middle third of the page: the first four columns stay
 * empty, and the next four split 2-2 into two stacked blocks. The left block
 * fills first, so three stats read two and one — the same shape as the Figma.
 * Each stat is a rule with the number under it and its caption alongside,
 * aligned to the same top. The rule is the site's `AnimatedDivider`, drawn on
 * the same 4px step the rest of the page uses: 16px above the number and 24px
 * below it, 24 and 32 from `md` up.
 */
function splitIntoColumns<T>(stats: T[]): [T[], T[]] {
  const left = Math.ceil(stats.length / 2)
  return [stats.slice(0, left), stats.slice(left)]
}

/**
 * On a phone the block is the page's own four columns — same gap as the Grid —
 * with the caption on the left two and the number on the right two, both on
 * the rule's top. From `md` up it is a row again, number first.
 *
 * Both texts are trimmed to cap height and baseline, so the caption's first
 * line starts at the number's cap top rather than at the top of its own line
 * box — the two line boxes differ by ~20px of leading and ascender at 72px.
 */
function StatBlock({ value, label }: { value: string; label: string }) {
  return (
    <div className="relative grid grid-cols-4 items-start gap-4 pt-4 pb-6 md:flex md:gap-3 md:pt-6 md:pb-8">
      <AnimatedDivider />
      <p className="type-display-lg [text-box:trim-both_cap_alphabetic] col-span-2 col-start-3 row-start-1 whitespace-nowrap text-text-primary md:shrink-0">{value}</p>
      <p className={`${LABEL_LG} [text-box:trim-both_cap_alphabetic] col-span-2 col-start-1 row-start-1 md:flex-1`}>{label}</p>
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
      className="py-8"
    >
      <Grid>
        {/* The label reads from the empty first columns, level with the first
            number — the page's labels sit beside their content, never on a
            line above it. The offset matches the stat's own top padding. */}
        <GridItem span={4} tabletSpan={8} mobileSpan={4} className="pt-4 md:pt-6">
          <span className={`block ${LABEL_TYPE} -entrance -fade -a-0`}>
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
            >
              {/* One group per column: its rules draw together, the way an
                  Education or Skills row does. */}
              <RevealGroup className="flex flex-col">
                {column.map((stat, i) => (
                  <StatBlock key={i} value={stat.value} label={stat.label} />
                ))}
              </RevealGroup>
            </GridItem>
          )
        )}
      </Grid>
    </section>
  )
}
