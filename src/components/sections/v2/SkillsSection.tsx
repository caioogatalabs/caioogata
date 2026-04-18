'use client'

import { useInView } from '@/hooks/useInView'
import { Grid, GridItem } from '@/components/layout/Grid'
import content from '@/content/en.json'

const LEVEL_MAP: Record<string, number> = {
  Expert: 4,
  Advanced: 3,
  Proficient: 2,
  Familiar: 1,
}

function DotIndicator({ level }: { level: string }) {
  const filled = LEVEL_MAP[level] ?? 0
  const total = 4
  return (
    <span className="flex gap-1 shrink-0" aria-label={level}>
      {Array.from({ length: total }, (_, i) => (
        <span
          key={i}
          className="w-2 h-2 rounded-full"
          style={{
            backgroundColor: i < filled
              ? 'var(--color-text-primary)'
              : 'var(--color-text-tertiary)',
          }}
        />
      ))}
    </span>
  )
}

export function SkillsSection() {
  const headingRef = useInView({ threshold: 0.1, once: true })
  const gridRef = useInView({ threshold: 0.1, once: true })

  const categories = content.skills.categories

  return (
    <section
      id="skills"
      aria-label="Skills"
      className="py-20 md:py-28 lg:py-36"
    >
      {/* ── Section heading ── */}
      <div
        ref={headingRef as React.RefObject<HTMLDivElement>}
        className="px-5 md:px-8 lg:px-16 mb-12 md:mb-16"
      >
        <h2
          className="-entrance -slide-up -a-0 text-lg font-semibold uppercase tracking-[1.2px] text-text-primary"
          style={{ fontFamily: 'var(--font-sans)' }}
        >
          Skills
        </h2>
      </div>

      {/* ── Category grid (4-4-4 = 3 per row) ── */}
      <Grid
        ref={gridRef as React.RefObject<HTMLDivElement>}
        className="gap-y-8 lg:gap-y-12"
      >
        {categories.map((category, index) => (
          <GridItem
            key={category.title}
            span={4}
            tabletSpan={4}
            mobileSpan={4}
            className={`-entrance -scale-in -a-${index}`}
          >
            <div className="mb-8 lg:mb-0">
              <h3
                className="text-sm font-semibold uppercase tracking-[1.2px] text-text-primary mb-4 md:mb-6"
                style={{ fontFamily: 'var(--font-sans)' }}
              >
                {category.title}
              </h3>
              <ul className="space-y-3">
                {category.skills.map((skill) => (
                  <li
                    key={skill.name}
                    className="-entrance -fade flex items-center justify-between gap-2"
                  >
                    <span
                      className="text-sm text-text-secondary"
                      style={{ fontFamily: 'var(--font-sans)', fontWeight: 300 }}
                    >
                      {skill.name}
                    </span>
                    <DotIndicator level={skill.level} />
                  </li>
                ))}
              </ul>
            </div>
          </GridItem>
        ))}
      </Grid>
    </section>
  )
}
