'use client'

import { useInView } from '@/hooks/useInView'
import { Grid, GridItem } from '@/components/layout/Grid'
import content from '@/content/en.json'
import type { Content } from '@/content/types'

const typedContent = content as unknown as Content
const about = typedContent.about

/**
 * 1.1 / Bio block. Layout per Figma 701:303:
 *   - Spacer GridItem in cols 1-4 (empty)
 *   - Content GridItem in cols 5-12: Core Expertise list, then a 64px gap, then bio paragraphs
 *   - Below the column area: full-width final quote (Epilogue 48px text-text-secondary)
 *
 * Source paragraphs come from `about.bio.split('\n\n')`:
 *   index 0       → first paragraph (rendered inside <AboutPinned/>, NOT here)
 *   indices 1..n-2 → middle paragraphs (rendered in cols 5-12 stack)
 *   last index    → final quote (rendered full-width below column area)
 *
 * If there are fewer than 3 paragraphs total, the final-quote slot reuses the last
 * available middle paragraph (defensive — copy may shrink).
 */
export function BioBlock() {
  const contentRef = useInView({ threshold: 0.1, once: true })
  const allParagraphs = about.bio.split('\n\n')
  // First paragraph lives in <AboutPinned/>. We work with the rest.
  const remaining = allParagraphs.slice(1)
  const middleParagraphs = remaining.length > 1 ? remaining.slice(0, -1) : []
  const finalQuote = remaining.length > 0 ? remaining[remaining.length - 1] : ''

  return (
    <div>
      <div
        ref={contentRef as React.RefObject<HTMLDivElement>}
        className="px-5 md:px-8 lg:px-16 py-16 md:py-24 lg:py-32"
      >
        <Grid className="!px-0">
          {/* Spacer cols 1-4 (mobile collapses) — hosts the section label */}
          <GridItem span={4} tabletSpan={2} mobileSpan={4}>
            <span className="font-mono text-xs uppercase tracking-[0.88px] text-text-tertiary">
              1.1 / Bio
            </span>
          </GridItem>

          {/* Content cols 5-12 */}
          <GridItem
            span={8}
            tabletSpan={6}
            mobileSpan={4}
            className="lg:col-start-5"
          >
            {/* Core Expertise — same internal markup as today */}
            <div className="flex flex-col w-full">
              <span
                className="text-sm font-medium uppercase tracking-[1.12px] text-text-tertiary py-3"
                style={{ fontFamily: 'var(--font-sans)' }}
              >
                Core Expertise
              </span>
              {about.expertise.map((item) => (
                <p
                  key={item}
                  className="text-base text-text-primary py-3 border-t border-border-secondary"
                  style={{ fontFamily: 'var(--font-sans)' }}
                >
                  {item}
                </p>
              ))}
            </div>

            {/* 64px gap between Core Expertise and bio paragraph stack */}
            <div className="mt-16">
              <div className="flex flex-col gap-6">
                {middleParagraphs.map((paragraph, i) => (
                  <p
                    key={i}
                    className={`-entrance -slide-up -a-${Math.min(i, 19)} text-[24px] font-semibold leading-[1.3] text-text-secondary`}
                    style={{ fontFamily: 'var(--font-sans)' }}
                  >
                    {paragraph}
                  </p>
                ))}
              </div>
            </div>
          </GridItem>
        </Grid>

        {/* Final quote — full 12 cols, below the column area */}
        {finalQuote && (
          <p
            className={`-entrance -slide-up -a-${Math.min(middleParagraphs.length, 19)} mt-16 md:mt-20 text-text-secondary`}
            style={{
              fontFamily: 'var(--font-sans)',
              fontSize: '3rem',
              lineHeight: 1.15,
              letterSpacing: '-0.96px',
              fontWeight: 400,
              textIndent: '8em',
            }}
          >
            {finalQuote}
          </p>
        )}
      </div>
    </div>
  )
}
