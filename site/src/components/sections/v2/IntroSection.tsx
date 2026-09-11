'use client'

import Image from 'next/image'
import { useInView } from '@/hooks/useInView'
import { Grid, GridItem } from '@/components/layout/Grid'
import { HeaderBar } from '@/components/layout/HeaderBar'
import { AskAiBar } from '@/components/sections/v2/AskAiBar'

const BIO =
  'Caio Ogata is a Creative Designer who learned to build. Twenty years in advertising, fifteen in interfaces, and a self-taught path into code. Based in Porto Alegre, he works across brand, interface and the code underneath — and takes it from idea to production.'

/**
 * Spacing between the hero's blocks. Below `lg` it is a plain step. From `lg`
 * up it breathes with viewport height, topping out at the Figma's 64px —
 * `--hero-gap` is set on the frame below. A fixed 64px rhythm cannot yield, so
 * on a short viewport it ate the whole budget and left the photo at a few
 * pixels. The header's `pt-12` and the labels' `bottom-12` deliberately do NOT
 * breathe: that margin is the frame.
 */
const BLOCK_GAP = 'mt-8 md:mt-12 lg:mt-[var(--hero-gap)]'

/** Clearance under the flow content: the pinned labels row (40px) + one gap. */
const LABELS_CLEARANCE = 'lg:pb-[calc(2.5rem+var(--hero-gap))]'

/**
 * IntroSection — the home hero, per Figma `Home — V2 (DS)` (node 1126:4557).
 *
 * Five stacked blocks on the 12-column grid: header labels, headline, photo,
 * bio, footer labels.
 *
 * Fixed and transparent from `lg` up, so the project list scrolls behind it;
 * `pointer-events-none` lets clicks reach the cards underneath, with the menu
 * and the AI bar re-enabling them on themselves. Below `lg` it is a normal
 * block in the flow — the five blocks stack taller than a phone viewport, and
 * a fixed box would sit on top of the list instead of scrolling away.
 *
 * From `lg` up the height is exact (`h-[100svh]`), not a minimum: the frame IS
 * the viewport, and the header and the footer labels are pinned to opposite
 * edges of it on the same 48px margin — `pt-12` on `HeaderBar`, `bottom-12` on
 * the labels row.
 *
 * An exact frame means the stack between them has a fixed budget, so it has to
 * be able to yield. Two terms do the yielding, in order:
 *
 *  1. The photo. Sized off the grid it would grow with viewport WIDTH while its
 *     budget comes from viewport HEIGHT — a wide, short screen ran it straight
 *     through the labels. Here it takes the slack instead, deriving its width
 *     from the aspect ratio, capped at the Figma's 216x281 and floored at 120px.
 *  2. `--hero-gap`, the rhythm between blocks, which breathes with viewport
 *     height and tops out at the Figma's 64px.
 *
 * At 1440x900 both sit at their caps and the frame matches the Figma exactly.
 */
export function IntroSection() {
  const welcomeRef = useInView({ threshold: 0.1, once: true })
  const headlineRef = useInView({ threshold: 0.1, once: true })
  const bottomRef = useInView({ threshold: 0.1, once: true })
  const labelsRef = useInView({ threshold: 0.1, once: true })

  return (
    <div
      className="pointer-events-none relative z-20 flex min-h-[100svh] flex-col pb-8 md:pb-10 lg:fixed lg:inset-x-0 lg:top-0 lg:h-[100svh] lg:pb-12"
      style={{ '--hero-gap': 'clamp(1.5rem, 7.2svh, 4rem)' } as React.CSSProperties}
    >
      <HeaderBar
        ref={welcomeRef as React.RefObject<HTMLDivElement>}
        className="-entrance -fade -a-0"
      />

      {/* ── Headline — 8 columns, top of the hero ── */}
      <Grid
        ref={headlineRef as React.RefObject<HTMLDivElement>}
        className={`-entrance -slide-up -a-2 ${BLOCK_GAP}`}
      >
        <GridItem mobileSpan={4} tabletSpan={8} span={8}>
          <h1
            className="text-[36px] leading-[1.15] tracking-[-0.02em] text-text-primary md:text-[48px]"
            style={{ fontFamily: 'var(--font-sans)', fontWeight: 400 }}
          >
            <span className="block">Creative Designer</span>
            <span className="block">who learned to build.</span>
          </h1>
        </GridItem>
      </Grid>

      {/* ── Flexible spacer — absorbs everything above 100svh ──
           Below `lg` only. From `lg` up the photo block below is the slack
           instead, so the frame has one flexible term, not two. */}
      <div className="min-h-8 flex-1 md:min-h-12 lg:hidden" aria-hidden />

      {/* The clearance keeps the bio off the labels once the row leaves the flow.
          `justify-end` anchors the bio just above that clearance; the photo
          takes whatever is left over it. */}
      <div
        ref={bottomRef as React.RefObject<HTMLDivElement>}
        className={`-entrance -fade -a-3 lg:flex lg:min-h-0 lg:flex-1 lg:flex-col lg:justify-end ${LABELS_CLEARANCE}`}
      >
        {/* ── Photo — columns 11-12, right edge ──
             From `lg` up the height drives the box, not the column width: it
             takes the slack between the headline and the pinned labels and
             derives its width from the aspect ratio, capped at the Figma's
             216x281. A photo sized purely off the grid grows with viewport
             WIDTH while its budget comes from viewport HEIGHT — on a wide,
             short screen it ran past the labels and pushed the bio off the
             fold. This shrinks instead. */}
        <Grid className="lg:min-h-0 lg:flex-1">
          <GridItem
            mobileSpan={2}
            tabletSpan={2}
            span={2}
            start={11}
            // `items-end` sits the box at the BOTTOM of the slack once the cap
            // bites, so photo, bio and labels stay one cluster and the void
            // opens under the headline — where the Figma puts it. Without it
            // the capped box sticks to the top and the void lands between the
            // photo and the bio.
            className="col-start-3 md:col-start-7 lg:flex lg:min-h-0 lg:items-end lg:justify-end"
          >
            <div className="relative aspect-[216/281] w-full overflow-hidden bg-bg-surface-primary lg:h-full lg:max-h-[281px] lg:min-h-[120px] lg:w-auto">
              <Image
                src="/caio-ogata-profile.webp"
                alt="Caio Ogata"
                fill
                sizes="(min-width: 1024px) 220px, (min-width: 768px) 25vw, 45vw"
                className="object-cover"
                priority
              />
            </div>
          </GridItem>
        </Grid>

        {/* ── Bio — columns 7-12, aligned to the menu above ── */}
        <Grid className={BLOCK_GAP}>
          <GridItem mobileSpan={4} tabletSpan={6} span={6} start={7} className="md:col-start-3">
            <p
              className="text-[14px] leading-[1.5] text-text-secondary"
              style={{ fontFamily: 'var(--font-sans)' }}
            >
              {BIO}
            </p>
          </GridItem>
        </Grid>
      </div>

      {/* ── Footer labels — closes the first view ──
           Pinned to the bottom of the frame from `lg` up, on the header's own
           margin: `bottom-12` mirrors `HeaderBar`'s `pt-12`, and the `Grid`
           keeps the same `px-8` gutter and 12 columns, so the row lines up
           with the header above it. Below `lg` it stays in the flow and
           scrolls away with the rest of the hero.
           Its own observer: `-inview` reaches descendants, not siblings, so
           leaving the flow block would have cost it the entrance. */}
      <Grid
        ref={labelsRef as React.RefObject<HTMLDivElement>}
        className={`-entrance -fade -a-3 items-center ${BLOCK_GAP} lg:absolute lg:inset-x-0 lg:bottom-12 lg:mt-0`}
      >
        <GridItem
          mobileSpan={4}
          tabletSpan={2}
          span={2}
          className="font-mono text-[12px] font-semibold leading-[1.2] tracking-[1.2px] text-text-secondary opacity-50"
        >
          Ask AI about Caio
        </GridItem>

        <GridItem mobileSpan={4} tabletSpan={3} span={2}>
          <AskAiBar className="pointer-events-auto" />
        </GridItem>

        <GridItem
          mobileSpan={4}
          tabletSpan={3}
          span={8}
          className="font-mono text-[12px] font-semibold leading-[1.2] tracking-[1.2px] text-text-secondary opacity-50 text-right"
        >
          scroll down
        </GridItem>
      </Grid>
    </div>
  )
}
