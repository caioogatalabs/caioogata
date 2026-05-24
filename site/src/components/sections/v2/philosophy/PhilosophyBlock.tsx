'use client'

import { useInView } from '@/hooks/useInView'
import { Grid, GridItem } from '@/components/layout/Grid'
import { SplitText } from '@/components/motion/SplitText'

interface PhilosophyBlockProps {
  paragraphs: string[]
  closingQuote?: string
}

/**
 * 3.1 / Practice block — supporting paragraphs + final quote.
 *
 * Layout mirrors `BioBlock`:
 *   - Cols 1-4 host the section kicker (`3.1 / Practice`)
 *   - Cols 5-12 host the body paragraph stack (word-fade reveal per Motion)
 *   - Below the column area: optional closing quote in cols 1-12 with
 *     line-mask reveal — same treatment as the BioBlock final quote.
 */
export function PhilosophyBlock({ paragraphs, closingQuote }: PhilosophyBlockProps) {
  const sectionRef = useInView({ threshold: 0.1, once: true })

  return (
    <div>
      <div
        ref={sectionRef as React.RefObject<HTMLDivElement>}
        className="px-5 md:px-8 lg:px-16 py-16 md:py-24 lg:py-32"
      >
        <Grid className="!px-0">
          {/* Spacer cols 1-4 (mobile collapses) — hosts the section label */}
          <GridItem span={4} tabletSpan={2} mobileSpan={4}>
            <SplitText
              type="line"
              as="span"
              text="3.1 / Practice"
              className="inline-block font-mono text-xs uppercase tracking-[0.88px] text-text-tertiary"
              durationMs={700}
              baseDelayMs={100}
            />
          </GridItem>

          {/* Content cols 5-12 — paragraph stack */}
          <GridItem
            span={8}
            tabletSpan={6}
            mobileSpan={4}
            className="lg:col-start-5"
          >
            <div className="flex flex-col gap-6">
              {paragraphs.map((paragraph, i) => (
                <SplitText
                  key={i}
                  type="word"
                  text={paragraph}
                  className="text-[24px] font-normal leading-[1.3] text-text-secondary"
                  style={{ fontFamily: 'var(--font-sans)' }}
                  durationMs={800}
                  baseDelayMs={100 + i * 80}
                />
              ))}
            </div>
          </GridItem>
        </Grid>

        {closingQuote && (
          <div className="mt-16 md:mt-20">
            <SplitText
              type="line"
              text={closingQuote}
              className="text-text-secondary"
              style={{
                fontFamily: 'var(--font-sans)',
                fontSize: '3rem',
                lineHeight: 1.15,
                letterSpacing: '-0.96px',
                fontWeight: 400,
                textIndent: '8em',
              }}
              staggerMs={120}
              durationMs={1100}
              baseDelayMs={150}
            />
          </div>
        )}
      </div>
    </div>
  )
}
