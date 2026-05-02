'use client'

import { useMemo } from 'react'
import { useInView } from '@/hooks/useInView'
import { Grid, GridItem } from '@/components/layout/Grid'
import { SplitText } from '@/components/motion/SplitText'
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

export function EducationBlock() {
  const blockRef = useInView({ threshold: 0.1, once: true })

  const allEducation: EducationItem[] = useMemo(() => {
    const formal = educationData.items
    const additional = educationData.additional || []
    return [...formal, ...additional].sort(
      (a, b) => getSortYear(b.year) - getSortYear(a.year)
    )
  }, [])

  return (
    <div>
      <div
        ref={blockRef as React.RefObject<HTMLDivElement>}
        className="px-5 md:px-8 lg:px-16 py-16 md:py-24 lg:py-32"
      >
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

          {/* Content cols 5-12 */}
          <GridItem
            span={8}
            tabletSpan={6}
            mobileSpan={4}
            className="lg:col-start-5"
          >
            <div className="flex flex-col">
              {allEducation.map((edu, index) => {
                return (
                  <div
                    key={`${edu.institution}-${edu.year}-${index}`}
                    className="flex gap-5 md:gap-8 border-t border-border-secondary py-6 md:py-8"
                  >
                    {/* Year stamp — fixed width */}
                    <span className="font-mono text-sm text-text-tertiary w-[100px] shrink-0">
                      {getDisplayYear(edu.year)}
                    </span>

                    {/* Info stack — flex-1 */}
                    <div className="flex flex-col gap-1 flex-1">
                      <SplitText
                        type="word"
                        as="h3"
                        text={edu.institution}
                        className="text-lg md:text-xl text-text-primary"
                        style={{ fontFamily: 'var(--font-sans)', fontWeight: 600 }}
                        staggerMs={30}
                        durationMs={800}
                        baseDelayMs={80}
                      />
                      <SplitText
                        type="word"
                        text={edu.degree}
                        className="text-base text-text-secondary"
                        style={{ fontFamily: 'var(--font-sans)' }}
                        staggerMs={20}
                        durationMs={700}
                        baseDelayMs={200}
                      />
                      <p className="font-mono text-xs text-text-tertiary">
                        {edu.location}
                      </p>
                      {edu.note && (
                        <p
                          className="text-sm text-text-secondary mt-2"
                          style={{ fontFamily: 'var(--font-sans)' }}
                        >
                          {edu.note}
                        </p>
                      )}
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
