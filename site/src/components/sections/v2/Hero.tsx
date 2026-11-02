'use client'

import { useInView } from '@/hooks/useInView'
import { Grid, GridItem } from '@/components/layout/Grid'
import { LABEL_TYPE } from '@/components/ui/label'

interface HeroProps {
  kicker: string
  headline: string
}

/**
 * Text-only hero of an open project (/projects/*).
 *
 * Kicker on columns 1-4, headline on 5-12, on one row with their cap heights
 * level — the label/value pairing ProjectImpact uses, `text-box` trimmed at
 * the start so the two tops meet at the letters rather than at their line
 * boxes. Below `lg` the kicker stacks over the headline.
 *
 * The technologies used to sit under the kicker; they are in the credits at
 * the foot of the case, and saying them twice made the hero a list.
 *
 * Entrance: one-shot CSS via `-entrance -fade -a-N` triggered by the section
 * receiving the `-inview` class via its own IntersectionObserver. The class
 * propagates to descendants — no consumer wiring required.
 */
export function Hero({ kicker, headline }: HeroProps) {
  const sectionRef = useInView()
  return (
    <section
      ref={sectionRef as React.RefObject<HTMLElement>}
      className="flex flex-col justify-end min-h-[var(--height-hero)] pb-8 md:pb-10 lg:pb-12"
    >
      <Grid className="items-start">
        <GridItem span={4} tabletSpan={8} mobileSpan={4}>
          <span className={`block ${LABEL_TYPE} [text-box:trim-start_cap_alphabetic] mb-6 lg:mb-0 -entrance -fade -a-0`}>
            <span className="opacity-50">{kicker}</span>
          </span>
        </GridItem>

        <GridItem span={8} start={5} tabletSpan={8} mobileSpan={4}>
          <p
            className="type-display [text-box:trim-start_cap_alphabetic] text-text-primary -entrance -fade -a-1"
          >
            {headline}
          </p>
        </GridItem>
      </Grid>
    </section>
  )
}
