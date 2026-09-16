'use client'

import { useContext, useEffect, useState } from 'react'
import { Grid, GridItem } from '@/components/layout/Grid'
import {
  AnimatedDivider,
  RevealContext,
  RevealGroup,
  SplitText,
} from '@/components/motion/SplitText'
import { useLanguage } from '@/components/providers/LanguageProvider'
import type { SkillCategory } from '@/content/types'
import { LABEL } from '@/components/ui/label'


/**
 * 1.2 / Skills — exclusive accordion. Per Figma 701:303:
 *   - Spacer cols 1-4 (empty), content cols 5-12.
 *   - Each category is a track-line + header (label + count + +/− indicator).
 *   - Hover/focus expands a category and collapses any other.
 *   - Click on the header toggles (open ↔ close so the user can return to all-collapsed).
 *   - Mouse leaving the whole skills container also collapses everything.
 *   - The expanded panel renders a list of skills, name left and level right.
 *     Row hover is a plain opacity lift, matching the header menu.
 */
export function SkillsBlock() {
  const { content } = useLanguage()
  const skillsData = content.skills
  const [expandedCategoryTitle, setExpandedCategoryTitle] = useState<string | null>(null)
  const [reducedMotion, setReducedMotion] = useState(false)

  useEffect(() => {
    setReducedMotion(window.matchMedia('(prefers-reduced-motion: reduce)').matches)
  }, [])

  return (
    <div>
      <div
        className="px-5 md:px-8 lg:px-8 py-16 md:py-24 lg:py-32"
        onMouseLeave={() => setExpandedCategoryTitle(null)}
      >
        <Grid className="!px-0">
          {/* Spacer cols 1-4 — hosts the section label */}
          <GridItem span={4} tabletSpan={2} mobileSpan={4}>
            <SplitText
              type="line"
              as="span"
              text={content.ui.about.skillsKicker}
              className={`inline-block ${LABEL}`}
              durationMs={700}
              baseDelayMs={100}
            />
          </GridItem>

          {/* Content cols 5-12 */}
          <GridItem
            span={8}
            tabletSpan={6}
            mobileSpan={4}
            className="lg:col-start-5"
          >
            {/* RevealGroup so all 6 categories fire on the same beat with cascading
                per-row delays. Matches Core Expertise / Education pattern. */}
            <RevealGroup as="div" className="flex flex-col">
              {skillsData.categories.map((category, index) => (
                <SkillsRow
                  key={category.title}
                  category={category}
                  index={index}
                  isOpen={expandedCategoryTitle === category.title}
                  reducedMotion={reducedMotion}
                  onOpen={() => setExpandedCategoryTitle(category.title)}
                  onToggle={() =>
                    setExpandedCategoryTitle((current) =>
                      current === category.title ? null : category.title
                    )
                  }
                />
              ))}
            </RevealGroup>
          </GridItem>
        </Grid>
      </div>
    </div>
  )
}

interface SkillsRowProps {
  category: SkillCategory
  index: number
  isOpen: boolean
  reducedMotion: boolean
  onOpen: () => void
  onToggle: () => void
}

/**
 * One accordion row. Reads `inView` from the parent `<RevealGroup>` so all 6
 * categories fire on the same beat with cascading delays. `index * 120ms` shifts
 * each row's reveal across the cascade; within a row the divider draws first,
 * then the title fades in 50ms later.
 */
function SkillsRow({
  category,
  index,
  isOpen,
  reducedMotion,
  onOpen,
  onToggle,
}: SkillsRowProps) {
  const groupInView = useContext(RevealContext)
  const inView = groupInView ?? false
  const baseDelay = 200 + index * 120

  return (
    <div className="relative" onMouseEnter={onOpen}>
      <AnimatedDivider inView={inView} delayMs={baseDelay} />
      {/* Header row — focusable button. Click toggles, hover/focus opens. */}
      <button
        type="button"
        onClick={onToggle}
        onFocus={onOpen}
        aria-expanded={isOpen}
        className="group flex items-center justify-between w-full py-5 text-left"
      >
        <SplitText
          type="word"
          as="span"
          text={category.title}
          className={`font-mono text-[14px] font-semibold leading-[1.4] tracking-[-0.04em] transition-colors duration-300 ${
            isOpen
              ? 'text-text-primary'
              : 'text-text-tertiary group-hover:text-text-primary'
          }`}
          durationMs={700}
          baseDelayMs={baseDelay + 50}
          inView={inView}
        />
        <span className="flex items-center gap-3">
          <span className={LABEL}>
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
            {category.skills.map((skill) => (
              <div
                key={skill.name}
                className="flex items-baseline justify-between gap-4 py-2 opacity-70 transition-opacity duration-300 hover:opacity-100"
              >
                <span
                  className="truncate text-base text-text-primary"
                  style={{ fontFamily: 'var(--font-sans)' }}
                >
                  {skill.name}
                </span>
                <span className={`shrink-0 ${LABEL}`}>
                  {skill.level}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
