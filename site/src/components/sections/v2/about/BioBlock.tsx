'use client'

import { useInView } from '@/hooks/useInView'
import { Grid, GridItem } from '@/components/layout/Grid'
import { AnimatedDivider, RevealGroup, SplitText } from '@/components/motion/SplitText'
import { useLanguage } from '@/components/providers/LanguageProvider'
import { LABEL } from '@/components/ui/label'


/**
 * 1.1 / Bio block. Layout per Figma 701:303:
 *   - Spacer GridItem in cols 1-4 (empty)
 *   - Content GridItem in cols 5-12: bio paragraphs, then a 64px gap, then the Core Expertise list
 *   - Below the column area: full-width final quote (Epilogue 48px text-text-secondary)
 *
 * Source paragraphs come from `about.bio.split('\n\n')`:
 *   index 0       → first paragraph (rendered inside <AboutPinned/>, NOT here)
 *   indices 1..n-2 → middle paragraphs (open the cols 5-12 stack — word split via SplitText)
 *   last index    → final quote (rendered full-width below column area — line-mask via SplitText)
 *
 * Reveal: Motion's SplitText component handles entrance per element. CSS-based -entrance/-flow
 * has been removed from these text blocks to avoid double-animating.
 */
export function BioBlock() {
  const { content } = useLanguage()
  const { about, ui } = content
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
        // Tighter on top than the other blocks: this one joins the pinned
        // headline, and the section rhythm below it stays as it was.
        className="px-5 pt-8 pb-16 md:px-8 md:pt-12 md:pb-24 lg:px-8 lg:pt-16 lg:pb-32"
      >
        <Grid className="!px-0">
          {/* Spacer cols 1-4 (mobile collapses) — hosts the section label */}
          <GridItem span={4} tabletSpan={2} mobileSpan={4}>
            <SplitText
              type="line"
              as="span"
              text={ui.about.bioKicker}
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
            {/* Bio paragraphs open the column — the reader meets the writing
                before the list of what he does.
                Whole-block fade (no per-line splitting) so the
                paragraph reads as continuous body — line-mask rendered each line as a
                separate `display: block` span, which created visible discontinuity at
                wrap points (e.g., "entire user-facing" / "engineering layer"). Plain
                fade keeps natural text flow. */}
            <div>
              <div className="flex flex-col gap-6">
                {middleParagraphs.map((paragraph, i) => (
                  <SplitText
                    key={i}
                    type="word"
                    text={paragraph}
                    className="text-[14px] leading-[1.6] font-normal md:text-[20px] md:leading-[1.3] lg:text-[24px] text-text-secondary"
                    style={{ fontFamily: 'var(--font-sans)' }}
                    durationMs={800}
                    baseDelayMs={100}
                  />
                ))}
              </div>
            </div>
            <div className="mt-16">
            {/* Core Expertise — kicker + list of items. RevealGroup syncs them so
                the whole list enters together when the block crosses the trigger. */}
            <RevealGroup as="div" className="flex flex-col w-full">
              <SplitText
                type="line"
                as="span"
                text={ui.about.coreExpertise}
                className={`inline-block ${LABEL} py-3`}
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
            </div>

          </GridItem>
        </Grid>

        {/* Final quote — full 12 cols, below the column area. Line-mask reveal.
            First line on column 4, the same derived indent as the page's hero
            (see AboutPinned for the arithmetic). */}
        {finalQuote && (
          <div className="mt-16 md:mt-20 [--line1-indent:calc(25%_+_4px)] md:[--line1-indent:calc(37.5%_+_7.5px)] lg:[--line1-indent:calc(25%_+_5px)]">
            <SplitText
              type="line"
              text={finalQuote}
              className="type-display text-text-secondary"
              style={{ textIndent: 'var(--line1-indent)' }}
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
