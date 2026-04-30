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
            <span className="-entrance -mask-right -a-0 inline-block font-mono text-xs uppercase tracking-[0.88px] text-text-tertiary">
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
                        {/* pt-[3px] reserves space for the first skill row's −3px V bleed; without
                            it the bleed lands above the accordion's overflow-hidden clip and the
                            top of the yellow bar appears cut on the first row. */}
                        <div className="flex flex-col pt-[3px] pb-5">
                          {category.skills.map((skill) => {
                            const isHovered = hoveredSkill === skill.name
                            return (
                              <div
                                key={skill.name}
                                className="relative p-2 cursor-default"
                                onMouseEnter={() => setHoveredSkill(skill.name)}
                                onMouseLeave={() => setHoveredSkill(null)}
                              >
                                {/* Bar (z-0) — 12px radius + -3px V bleed.
                                    Width carries the level semantic (Expert 95%, Familiar 35%) and replaces
                                    Experience's scaleX while keeping the same ease-out timing tokens. */}
                                <span
                                  aria-hidden="true"
                                  className="absolute left-0 bg-bg-fill-primary pointer-events-none"
                                  style={{
                                    top: '-3px',
                                    bottom: '-3px',
                                    width: isHovered ? LEVEL_WIDTH[skill.level] : '0%',
                                    opacity: isHovered ? 1 : 0,
                                    borderRadius: '12px',
                                    transformOrigin: 'left center',
                                    transition: reducedMotion
                                      ? 'none'
                                      : isHovered
                                        ? 'width 0.6s cubic-bezier(0.22,0.31,0,1) 0.04s, opacity 0.2s cubic-bezier(0.22,0.31,0,1) 0.04s'
                                        : 'width 0.5s cubic-bezier(0.22,0.31,0,1) 0.06s, opacity 0.3s cubic-bezier(0.22,0.31,0,1) 0.06s',
                                  }}
                                />
                                {/* Skill name (z-10) — masked vertical sans → mono 1.25rem swap (mirrors Experience) */}
                                <div className="relative z-10">
                                  <span
                                    className="relative block overflow-hidden"
                                    style={{
                                      height: '2rem',
                                      marginTop: '-0.25rem',
                                      marginBottom: '-0.25rem',
                                    }}
                                  >
                                    {/* Default text — sans, text-base */}
                                    <span
                                      className="absolute inset-0 flex items-center"
                                      style={{
                                        transform: isHovered ? 'translateY(-100%)' : 'translateY(0)',
                                        color: 'var(--color-text-primary)',
                                        fontFamily: 'var(--font-sans)',
                                        fontSize: '1rem',
                                        fontWeight: 400,
                                        transition: reducedMotion
                                          ? 'none'
                                          : isHovered
                                            ? 'transform 1s cubic-bezier(0.16,1,0.3,1) 0.04s, color 0.3s cubic-bezier(0.22,0.31,0,1)'
                                            : 'transform 1s cubic-bezier(0.16,1,0.3,1) 0.06s, color 0.3s cubic-bezier(0.22,0.31,0,1)',
                                      }}
                                    >
                                      <span className="block truncate">{skill.name}</span>
                                    </span>
                                    {/* Hover text — mono via .type-overlay-hover, 1.25rem override (denser row) */}
                                    <span
                                      className="absolute inset-0 flex items-center type-overlay-hover"
                                      style={{
                                        transform: isHovered ? 'translateY(0)' : 'translateY(100%)',
                                        color: 'var(--color-text-on-primary)',
                                        fontSize: '1.25rem',
                                        transition: reducedMotion
                                          ? 'none'
                                          : isHovered
                                            ? 'transform 1s cubic-bezier(0.16,1,0.3,1) 0.04s'
                                            : 'transform 1s cubic-bezier(0.16,1,0.3,1) 0.06s',
                                      }}
                                    >
                                      <span className="block truncate">{skill.name}</span>
                                    </span>
                                  </span>
                                </div>

                                {/* Level label — hidden by default, swap-in on hover at the RIGHT END OF THE
                                    YELLOW BAR (not the row). `right: calc(100% - LEVEL_WIDTH)` anchors the
                                    label's right edge to the bar's right edge, so it always sits inside the
                                    yellow regardless of level (Expert 95% → near row edge, Familiar 35% → mid-row).
                                    Outer is `overflow-hidden` and inner is `absolute inset-0` — required so
                                    `translateY(100%)` translates by the OUTER's height (full row), fully clipping
                                    the text when not hovered. Inner-only translate would move by text height only
                                    and leak the top half through.
                                    Timing: entry delay 0.45s ensures the label only reveals AFTER the bar has
                                    filled to cover its position (bar takes 0.6s); exit has zero delay + short
                                    duration so the label is gone before the bar contracts past its anchor (else
                                    the label would briefly appear on the dark background — what the user called out).
                                    aria-hidden because level is decorative-on-hover; skill name carries semantics. */}
                                <span
                                  className="absolute z-10 overflow-hidden pointer-events-none"
                                  style={{
                                    top: 0,
                                    bottom: 0,
                                    left: 0,
                                    right: `calc(100% - ${LEVEL_WIDTH[skill.level]})`,
                                  }}
                                  aria-hidden="true"
                                >
                                  <span
                                    className="absolute inset-0 flex items-center justify-end type-overlay-hover whitespace-nowrap"
                                    style={{
                                      paddingRight: '0.75rem',
                                      transform: isHovered ? 'translateY(0)' : 'translateY(100%)',
                                      color: 'var(--color-text-on-primary)',
                                      fontSize: '1.25rem',
                                      transition: reducedMotion
                                        ? 'none'
                                        : isHovered
                                          ? 'transform 0.4s cubic-bezier(0.16,1,0.3,1) 0.45s'
                                          : 'transform 0.2s cubic-bezier(0.5,0,0.75,0) 0s',
                                    }}
                                  >
                                    {skill.level}
                                  </span>
                                </span>
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
