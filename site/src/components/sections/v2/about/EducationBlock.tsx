'use client'

import { useContext, useMemo } from 'react'
import { motion } from 'motion/react'
import { Grid, GridItem } from '@/components/layout/Grid'
import {
  AnimatedDivider,
  RevealContext,
  RevealGroup,
  SplitText,
} from '@/components/motion/SplitText'
import content from '@/content/en.json'
import type { Content, EducationItem } from '@/content/types'

const typedContent = content as unknown as Content
const educationData = typedContent.education

/**
 * Extract latest year from year string. Adapted from V1 Education.tsx.
 * Examples: "2001 - 2005" -> 2005; "2009" -> 2009; "2026 (in progress)" -> 2026.
 */
function getSortYear(yearStr: string): number {
  const match = yearStr.match(/\b(19|20)\d{2}\b/g)
  if (!match || match.length === 0) return 0
  return Math.max(...match.map(Number))
}

/** Display year = the latest year only (D-22). */
function getDisplayYear(yearStr: string): string {
  const sortYear = getSortYear(yearStr)
  return sortYear > 0 ? String(sortYear) : yearStr
}

const FIDDLE_EASE = [0.16, 1, 0.3, 1] as const

/**
 * One row in the timeline. Reads `inView` from the parent `<RevealGroup>` so all
 * 5 entries fire as one orchestrated cascade — the whole timeline unfolds in a
 * single beat, in line with Core Expertise / kicker pattern. Each entry stages
 * via `index * 150ms` over the group's start delay; within an entry, year +
 * divider + h3 + degree + location + note offset by small steps.
 */
function EducationEntry({ edu, index }: { edu: EducationItem; index: number }) {
  const groupInView = useContext(RevealContext)
  const inView = groupInView ?? false
  const baseDelay = 200 + index * 150

  return (
    <div className="relative flex gap-5 md:gap-8 py-6 md:py-8">
      <AnimatedDivider inView={inView} delayMs={baseDelay} />
      <motion.span
        className="font-mono text-sm text-text-tertiary w-[100px] shrink-0"
        initial={{ opacity: 0 }}
        animate={inView ? { opacity: 1 } : { opacity: 0 }}
        transition={{ delay: (baseDelay + 50) / 1000, duration: 0.6, ease: FIDDLE_EASE }}
      >
        {getDisplayYear(edu.year)}
      </motion.span>

      <div className="flex flex-col gap-1 flex-1">
        <SplitText
          type="word"
          as="h3"
          text={edu.institution}
          className="text-lg md:text-xl text-text-primary"
          style={{ fontFamily: 'var(--font-sans)', fontWeight: 600 }}
          durationMs={700}
          baseDelayMs={baseDelay + 100}
          inView={inView}
        />
        <SplitText
          type="word"
          text={edu.degree}
          className="text-base text-text-secondary"
          style={{ fontFamily: 'var(--font-sans)' }}
          durationMs={700}
          baseDelayMs={baseDelay + 200}
          inView={inView}
        />
        <motion.p
          className="font-mono text-xs text-text-tertiary"
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : { opacity: 0 }}
          transition={{ delay: (baseDelay + 300) / 1000, duration: 0.6, ease: FIDDLE_EASE }}
        >
          {edu.location}
        </motion.p>
        {edu.note && (
          <motion.p
            className="text-sm text-text-secondary mt-2"
            style={{ fontFamily: 'var(--font-sans)' }}
            initial={{ opacity: 0 }}
            animate={inView ? { opacity: 1 } : { opacity: 0 }}
            transition={{ delay: (baseDelay + 400) / 1000, duration: 0.6, ease: FIDDLE_EASE }}
          >
            {edu.note}
          </motion.p>
        )}
      </div>
    </div>
  )
}

export function EducationBlock() {
  const allEducation: EducationItem[] = useMemo(() => {
    const formal = educationData.items
    const additional = educationData.additional || []
    return [...formal, ...additional].sort(
      (a, b) => getSortYear(b.year) - getSortYear(a.year)
    )
  }, [])

  return (
    <div>
      <div className="px-5 md:px-8 lg:px-16 py-16 md:py-24 lg:py-32">
        <Grid className="!px-0">
          {/* Spacer cols 1-4 — hosts the section label */}
          <GridItem span={4} tabletSpan={2} mobileSpan={4}>
            <SplitText
              type="line"
              as="span"
              text="1.4 / Education"
              className="inline-block font-mono text-xs uppercase tracking-[0.88px] text-text-tertiary"
              durationMs={700}
              baseDelayMs={100}
            />
          </GridItem>

          {/* Content cols 5-12 — RevealGroup so all entries fire on the same beat
              with cascading per-entry delays. Matches the Core Expertise pattern. */}
          <GridItem
            span={8}
            tabletSpan={6}
            mobileSpan={4}
            className="lg:col-start-5"
          >
            <RevealGroup as="div" className="flex flex-col">
              {allEducation.map((edu, index) => (
                <EducationEntry
                  key={`${edu.institution}-${edu.year}-${index}`}
                  edu={edu}
                  index={index}
                />
              ))}
            </RevealGroup>
          </GridItem>
        </Grid>
      </div>
    </div>
  )
}
