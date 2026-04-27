'use client'

import { useEffect, useState } from 'react'
import { useInView } from '@/hooks/useInView'
import { Grid, GridItem } from '@/components/layout/Grid'
import content from '@/content/en.json'
import type { Content, Skill } from '@/content/types'

const typedContent = content as unknown as Content
const skillsData = typedContent.skills

/** Hover-revealed bar width per skill level. Applied via inline style for reliability. */
const LEVEL_WIDTH: Record<Skill['level'], string> = {
  Expert: '95%',
  Advanced: '75%',
  Proficient: '55%',
  Familiar: '35%',
}

/**
 * 1.2 / Skills — exclusive accordion. Per Figma 701:303:
 *   - Spacer cols 1-4 (empty), content cols 5-12.
 *   - Each category is a track-line + header (label + count + +/− indicator).
 *   - Hover/focus expands a category and collapses any other.
 *   - Click on the header toggles (open ↔ close so the user can return to all-collapsed).
 *   - Mouse leaving the whole skills container also collapses everything.
 *   - The expanded panel renders a list of skills; each skill row reveals
 *     a level-mapped yellow bar on row hover (text turns inverse).
 */
export function SkillsBlock() {
  const blockRef = useInView({ threshold: 0.1, once: true })
  const [expandedCategoryTitle, setExpandedCategoryTitle] = useState<string | null>(null)
  const [hoveredSkill, setHoveredSkill] = useState<string | null>(null)
  const [reducedMotion, setReducedMotion] = useState(false)

  useEffect(() => {
    setReducedMotion(window.matchMedia('(prefers-reduced-motion: reduce)').matches)
  }, [])

  return (
    <div>
      <div
        ref={blockRef as React.RefObject<HTMLDivElement>}
        className="px-5 md:px-8 lg:px-16 py-16 md:py-24 lg:py-32"
        onMouseLeave={() => {
          setExpandedCategoryTitle(null)
          setHoveredSkill(null)
        }}
      >
        <Grid className="!px-0">
          {/* Spacer cols 1-4 — hosts the section label */}
          <GridItem span={4} tabletSpan={2} mobileSpan={4}>
            <span className="font-mono text-xs uppercase tracking-[0.88px] text-text-tertiary">
              1.2 / Skills
            </span>
          </GridItem>

          {/* Content cols 5-12 */}
          <GridItem
            span={8}
            tabletSpan={6}
            mobileSpan={4}
            className="lg:col-start-5"
          >
            <div className="flex flex-col">
              {skillsData.categories.map((category, catIndex) => {
                const isOpen = expandedCategoryTitle === category.title
                const stagger = Math.min(catIndex, 19)
                const open = () => setExpandedCategoryTitle(category.title)
                const toggle = () =>
                  setExpandedCategoryTitle((current) =>
                    current === category.title ? null : category.title
                  )

                return (
                  <div
                    key={category.title}
                    className={`-entrance -slide-up -a-${stagger} border-t border-border-secondary`}
                    onMouseEnter={open}
                  >
                    {/* Header row — focusable button. Click toggles, hover/focus opens. */}
                    <button
                      type="button"
                      onClick={toggle}
                      onFocus={open}
                      aria-expanded={isOpen}
                      className="group flex items-center justify-between w-full py-5 text-left"
                    >
                      <span
                        className={`text-sm font-medium uppercase tracking-[1.12px] transition-colors duration-300 ${
                          isOpen
                            ? 'text-text-primary'
                            : 'text-text-tertiary group-hover:text-text-primary'
                        }`}
                        style={{ fontFamily: 'var(--font-sans)' }}
                      >
                        {category.title}
                      </span>
                      <span className="flex items-center gap-3">
                        <span className="font-mono text-xs text-text-tertiary">
                          {String(category.skills.length).padStart(2, '0')}
                        </span>
                        <span
                          className="font-mono text-base text-text-tertiary w-4 text-center"
                          aria-hidden="true"
                        >
                          {isOpen ? '−' : '+'}
                        </span>
                      </span>
                    </button>

                    {/* Panel — expand/collapse via grid-template-rows trick (no JS height math). */}
                    <div
                      className={`grid ${isOpen ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'} ${
                        reducedMotion ? '' : 'transition-[grid-template-rows] duration-500 ease-[cubic-bezier(0.5,0,0.3,1)]'
                      }`}
                    >
                      <div className="overflow-hidden">
                        <div className="flex flex-col pb-5">
                          {category.skills.map((skill) => {
                            const isHovered = hoveredSkill === skill.name
                            return (
                              <div
                                key={skill.name}
                                className="relative overflow-hidden p-2 cursor-default"
                                onMouseEnter={() => setHoveredSkill(skill.name)}
                                onMouseLeave={() => setHoveredSkill(null)}
                              >
                                {/* Bar (z-0) — width driven by inline style for reliability across Tailwind builds */}
                                <span
                                  aria-hidden="true"
                                  className={`absolute inset-y-0 left-0 bg-bg-fill-primary ${
                                    reducedMotion
                                      ? ''
                                      : 'transition-all duration-500 ease-[cubic-bezier(0.5,0,0.3,1)]'
                                  }`}
                                  style={{
                                    width: isHovered ? LEVEL_WIDTH[skill.level] : '0%',
                                  }}
                                />
                                {/* Text row (z-10) */}
                                <div className="relative z-10 flex items-center justify-between">
                                  <span
                                    className={`text-base ${
                                      isHovered ? 'text-text-inverse' : 'text-text-primary'
                                    } ${reducedMotion ? '' : 'transition-colors duration-300'}`}
                                    style={{ fontFamily: 'var(--font-sans)', fontWeight: 400 }}
                                  >
                                    {skill.name}
                                  </span>
                                  <span
                                    className={`font-mono text-xs ${
                                      isHovered ? 'text-text-inverse' : 'text-text-tertiary'
                                    } ${reducedMotion ? '' : 'transition-colors duration-300'}`}
                                  >
                                    {skill.level}
                                  </span>
                                </div>
                              </div>
                            )
                          })}
                        </div>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </GridItem>
        </Grid>
      </div>
    </div>
  )
}
