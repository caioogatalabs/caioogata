'use client'

import { useInView } from '@/hooks/useInView'
import { Grid, GridItem } from '@/components/layout/Grid'
import { AnimatedDivider, RevealGroup, SplitText } from '@/components/motion/SplitText'
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
 *   indices 1..n-2 → middle paragraphs (rendered in cols 5-12 stack — word split via SplitText)
 *   last index    → final quote (rendered full-width below column area — line-mask via SplitText)
 *
 * Reveal: Motion's SplitText component handles entrance per element. CSS-based -entrance/-flow
 * has been removed from these text blocks to avoid double-animating.
 */
export function BioBlock() {
  // Section root inview ref — drives the numeral kickers (-mask-right) only.
  // Body text (paragraphs, items, quote) animates via Motion's per-element
  // useInView inside <SplitText>, independent of this ref.
  const sectionRef = useInView({ threshold: 0.1, once: true })
  const allParagraphs = about.bio.split('\n\n')
  // First paragraph lives in <AboutPinned/>. We work with the rest.
  const remaining = allParagraphs.slice(1)
  const middleParagraphs = remaining.length > 1 ? remaining.slice(0, -1) : []
  const finalQuote = remaining.length > 0 ? remaining[remaining.length - 1] : ''

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
              text="1.1 / Bio"
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
            {/* Core Expertise — kicker + list of items. RevealGroup syncs them so
                the whole list enters together when the block crosses the trigger. */}
            <RevealGroup as="div" className="flex flex-col w-full">
              <SplitText
                type="line"
                as="span"
                text="Core Expertise"
                className="inline-block text-sm font-medium uppercase tracking-[1.12px] text-text-tertiary py-3"
                style={{ fontFamily: 'var(--font-sans)' }}
                durationMs={700}
                baseDelayMs={100}
              />
              {about.expertise.map((item, i) => {
                const delay = 250 + i * 60
                return (
                  <div key={item} className="relative">
                    {/* Divider draws in sync with this item's reveal. RevealGroup context
                        provides inView to AnimatedDivider automatically. */}
                    <AnimatedDivider delayMs={delay} />
                    <SplitText
                      type="word"
                      text={item}
                      className="text-base text-text-primary py-3"
                      style={{ fontFamily: 'var(--font-sans)' }}
                      durationMs={700}
                      baseDelayMs={delay}
                    />
                  </div>
                )
              })}
            </RevealGroup>

            {/* 64px gap between Core Expertise and bio paragraph stack.
                Middle paragraphs use line-mask reveal — each line slides up from below
                a per-line mask, matching the hero/quote pattern. */}
            <div className="mt-16">
              <div className="flex flex-col gap-6">
                {middleParagraphs.map((paragraph, i) => (
                  <SplitText
                    key={i}
                    type="line"
                    text={paragraph}
                    className="text-[24px] font-semibold leading-[1.3] text-text-secondary"
                    style={{ fontFamily: 'var(--font-sans)' }}
                    staggerMs={70}
                    durationMs={800}
                    baseDelayMs={100}
                  />
                ))}
              </div>
            </div>
          </GridItem>
        </Grid>

        {/* Final quote — full 12 cols, below the column area. Line-mask reveal. */}
        {finalQuote && (
          <div className="mt-16 md:mt-20">
            <SplitText
              type="line"
              text={finalQuote}
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
