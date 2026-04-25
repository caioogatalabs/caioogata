'use client'

import { useInView } from '@/hooks/useInView'
import { Grid, GridItem } from '@/components/layout/Grid'

interface HeroProps {
  kicker: string
  technologies?: string
  headline: string
}

/**
 * Shared text-only hero primitive used by /projects/* and /about.
 *
 * Behaviour:
 *  - With `technologies`: renders kicker (12-col) + technologies (4-col) + headline (8-col).
 *  - Without `technologies`: renders kicker (12-col) + full-width headline (12-col).
 *
 * Entrance: one-shot CSS via `-entrance -fade -a-N` triggered by the section
 * receiving the `-inview` class via its own IntersectionObserver. The class
 * propagates to descendants — no consumer wiring required.
 */
export function Hero({ kicker, technologies, headline }: HeroProps) {
  const sectionRef = useInView()
  return (
    <section
      ref={sectionRef as React.RefObject<HTMLElement>}
      className="flex flex-col justify-end min-h-[var(--height-hero)] pb-8 md:pb-10 lg:pb-12"
    >
      <Grid>
        <GridItem span={12} tabletSpan={8} mobileSpan={4}>
          <span className="block font-mono text-xs uppercase tracking-[0.88px] text-text-tertiary mb-6 -entrance -fade -a-0">
            {kicker}
          </span>
        </GridItem>

        {technologies ? (
          <>
            <GridItem span={4} tabletSpan={8} mobileSpan={4}>
              <p
                className="text-[14px] font-medium leading-[1.5] uppercase tracking-[1.12px] text-text-tertiary -entrance -fade -a-1"
                style={{ fontFamily: 'var(--font-sans)' }}
              >
                {technologies}
              </p>
            </GridItem>
            <GridItem span={8} tabletSpan={8} mobileSpan={4}>
              <p
                className="text-[48px] leading-[1.15] tracking-[-0.96px] text-text-primary -entrance -fade -a-1"
                style={{ fontFamily: 'var(--font-sans)' }}
              >
                {headline}
              </p>
            </GridItem>
          </>
        ) : (
          <GridItem span={12} tabletSpan={8} mobileSpan={4}>
            <p
              className="text-[48px] leading-[1.15] tracking-[-0.96px] text-text-primary -entrance -fade -a-1"
              style={{ fontFamily: 'var(--font-sans)' }}
            >
              {headline}
            </p>
          </GridItem>
        )}
      </Grid>
    </section>
  )
}
