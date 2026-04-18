'use client'

import { useInView } from '@/hooks/useInView'
import { Grid, GridItem } from '@/components/layout/Grid'
import content from '@/content/en.json'

const PULL_QUOTE_AFTER_PARAGRAPH = 0 // Insert pull quote after the first paragraph

const PULL_QUOTES = [
  'My work bridges brand strategy, product craft, and technical implementation — designing and building at the intersection of design systems, developer experience, and product engineering.',
  'Engineering rigor and design craft aren\u2019t opposites. The products I\u2019m proudest of happened when both disciplines were solving the same problem.',
]

export function AboutSection() {
  const leftRef = useInView({ threshold: 0.1, once: true })
  const rightRef = useInView({ threshold: 0.1, once: true })

  const paragraphs = content.about.bio.split('\n\n')

  return (
    <section
      id="about"
      aria-label="About"
      className="py-20 md:py-28 lg:py-36"
    >
      <Grid>
        {/* ── Left column: heading + expertise ── */}
        <GridItem
          span={4}
          tabletSpan={4}
          mobileSpan={4}
          ref={leftRef as React.RefObject<HTMLDivElement>}
        >
          <h2
            className="-entrance -slide-up -a-0 text-lg font-semibold uppercase tracking-[1.2px] text-text-primary mb-8"
            style={{ fontFamily: 'var(--font-sans)' }}
          >
            {content.about.heading}
          </h2>

          <ul className="space-y-3">
            {content.about.expertise.map((item, i) => (
              <li
                key={item}
                className={`-entrance -fade -a-${i} text-xs uppercase tracking-[1px] text-text-secondary font-medium`}
              >
                {item}
              </li>
            ))}
          </ul>
        </GridItem>

        {/* ── Right column: bio + pull quotes ── */}
        <GridItem
          span={8}
          tabletSpan={4}
          mobileSpan={4}
          ref={rightRef as React.RefObject<HTMLDivElement>}
        >
          {paragraphs.map((paragraph, i) => (
            <div key={i}>
              <p
                className="-entrance -slide-up -a-1 text-base leading-relaxed text-text-secondary mb-6"
                style={{ fontFamily: 'var(--font-sans)', fontWeight: 300 }}
              >
                {paragraph}
              </p>

              {i === PULL_QUOTE_AFTER_PARAGRAPH && (
                <blockquote
                  className="-entrance -scale-in -a-2 bg-bg-surface-secondary rounded-[12px] p-6 md:p-8 my-8"
                >
                  <p
                    className="text-xl md:text-2xl font-light leading-snug text-text-primary"
                    style={{ fontFamily: 'var(--font-sans)', fontWeight: 300 }}
                  >
                    {PULL_QUOTES[0]}
                  </p>
                </blockquote>
              )}

              {i === paragraphs.length - 2 && PULL_QUOTES[1] && (
                <blockquote
                  className="-entrance -scale-in -a-3 bg-bg-surface-secondary rounded-[12px] p-6 md:p-8 my-8"
                >
                  <p
                    className="text-xl md:text-2xl font-light leading-snug text-text-primary"
                    style={{ fontFamily: 'var(--font-sans)', fontWeight: 300 }}
                  >
                    {PULL_QUOTES[1]}
                  </p>
                </blockquote>
              )}
            </div>
          ))}
        </GridItem>
      </Grid>
    </section>
  )
}
