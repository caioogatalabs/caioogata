'use client'

import { useInView } from '@/hooks/useInView'
import { Grid, GridItem } from '@/components/layout/Grid'
import { SectionDivider } from './SectionDivider'
import content from '@/content/en.json'
import type { Content } from '@/content/types'

const typedContent = content as unknown as Content
const skillsData = typedContent.skills

/**
 * Bar fill widths per skill level. Copied verbatim from the V2 file being deleted in Wave 3.
 * Duplicated locally (not imported) so the source file can be safely removed.
 */
const LEVEL_WIDTH: Record<string, string> = {
  Expert: '95%',
  Advanced: '75%',
  Proficient: '55%',
  Familiar: '35%',
}

/**
 * Simplified Skills block for /about (1.2 / Skills).
 * Renders 6 categories from content.skills.categories in a 6-6 layout:
 * left = category label, right = skills list (name + bar + level).
 *
 * No SVG bezier lines, no project relationship column, no bidirectional hover,
 * no project highlighting. Static, calm, editorial.
 */
export function SkillsBlock() {
  const blockRef = useInView({ threshold: 0.1, once: true })

  return (
    <div>
      <SectionDivider code="1.2" label="Skills" />

      <div
        ref={blockRef as React.RefObject<HTMLDivElement>}
        className="px-5 md:px-8 lg:px-16 py-16 md:py-24 lg:py-32"
      >
        <div className="flex flex-col">
          {skillsData.categories.map((category, catIndex) => {
            // Clamp stagger index at 19 (matches existing -a-N CSS classes 0..20).
            const staggerIndex = Math.min(catIndex, 19)

            return (
              <div
                key={category.title}
                className={`-entrance -slide-up -a-${staggerIndex} border-t border-border-secondary`}
              >
                <Grid className="!px-0 py-8 md:py-10">
                  {/* Left column: category label */}
                  <GridItem span={6} tabletSpan={8} mobileSpan={4}>
                    <h3
                      className="text-sm font-medium uppercase tracking-[1.12px] text-text-tertiary"
                      style={{ fontFamily: 'var(--font-sans)' }}
                    >
                      {category.title}
                    </h3>
                  </GridItem>

                  {/* Right column: skills list */}
                  <GridItem span={6} tabletSpan={8} mobileSpan={4}>
                    <div className="flex flex-col">
                      {category.skills.map((skill) => (
                        <div key={skill.name} className="py-3">
                          {/* Row 1: name */}
                          <span
                            className="block text-base text-text-primary mb-2"
                            style={{ fontFamily: 'var(--font-sans)', fontWeight: 400 }}
                          >
                            {skill.name}
                          </span>

                          {/* Row 2: bar (track + fill) */}
                          <div className="relative" aria-hidden="true">
                            <div className="h-px w-full bg-border-secondary" />
                            <div
                              className="absolute top-0 left-0 h-0.5 bg-text-primary"
                              style={{
                                width: LEVEL_WIDTH[skill.level] || '50%',
                                transform: 'translateY(-0.5px)',
                              }}
                            />
                          </div>

                          {/* Row 3: level label */}
                          <span className="font-mono text-xs text-text-tertiary mt-1 block">
                            {skill.level}
                          </span>
                        </div>
                      ))}
                    </div>
                  </GridItem>
                </Grid>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
