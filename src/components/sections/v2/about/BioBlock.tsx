'use client'

import { useInView } from '@/hooks/useInView'
import { Grid, GridItem } from '@/components/layout/Grid'
import { SectionDivider } from './SectionDivider'
import content from '@/content/en.json'
import type { Content } from '@/content/types'

const typedContent = content as unknown as Content
const about = typedContent.about

/**
 * Editorial bio + Core Expertise content zone for /about page.
 * Renders the SectionDivider "1.1 / Bio" above a 6-6 grid:
 *   - Left column: Core Expertise list with thin dividers
 *   - Right column: bio paragraphs (split on \n\n) with -entrance -slide-up stagger
 *
 * The hero (video canvas, sticky overlay, scroll-driven transitions) is intentionally
 * NOT rendered here — it remains in AboutSection. Wave 3 will compose AboutSection
 * to render <Hero/> + <BioBlock/> + <SectionDivider/SkillsBlock/> + …
 */
export function BioBlock() {
  const contentRef = useInView({ threshold: 0.1, once: true })
  const paragraphs = about.bio.split('\n\n')

  return (
    <div>
      <SectionDivider code="1.1" label="Bio" />

      <div className="px-5 md:px-8 lg:px-16 py-16 md:py-24 lg:py-32">
        <Grid className="!px-0">
          {/* Left column: Core Expertise */}
          <GridItem
            span={6}
            tabletSpan={2}
            mobileSpan={4}
          >
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
          </GridItem>

          {/* Right column: bio paragraphs */}
          <GridItem
            span={6}
            tabletSpan={6}
            mobileSpan={4}
            ref={contentRef as React.RefObject<HTMLDivElement>}
          >
            {paragraphs.map((paragraph, i) => (
              <p
                key={i}
                className={`-entrance -slide-up -a-${i} text-[24px] font-semibold leading-[1.3] text-text-secondary mb-6`}
                style={{ fontFamily: 'var(--font-sans)' }}
              >
                {paragraph}
              </p>
            ))}
          </GridItem>
        </Grid>
      </div>
    </div>
  )
}
