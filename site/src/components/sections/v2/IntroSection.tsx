'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import { useInView } from '@/hooks/useInView'
import { useScrollExitProgress, slice } from '@/hooks/useScrollExitProgress'
import { Grid, GridItem } from '@/components/layout/Grid'
import { HeaderBar } from '@/components/layout/HeaderBar'
import { AskAiBar } from '@/components/sections/v2/AskAiBar'
import type { DistortedImageCanvasProps } from '@/components/three/DistortedImageCanvas'

/**
 * Lazy-loaded client-only wrapper for DistortedImageCanvas — same shape as
 * ProjectHero's ClientNoiseGradient. three/ is ~100 kB and this is the home
 * page, so it must not block the photo, which is the LCP element.
 */
function ClientDistortedImage(props: DistortedImageCanvasProps) {
  const [Component, setComponent] = useState<React.ComponentType<DistortedImageCanvasProps> | null>(null)

  useEffect(() => {
    import('@/components/three/DistortedImageCanvas').then(mod => {
      setComponent(() => mod.DistortedImageCanvas)
    })
  }, [])

  if (!Component) return null
  return <Component {...props} />
}

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
 * Exit for a block that rises out of frame while a mask closes under it.
 *
 * `rise` is the block's own travel in px at full progress — giving each block a
 * different distance over the same scroll is what separates their speeds, which
 * is the whole point of the gesture. The clip closes from the bottom so the
 * block reads as sliding up behind an edge rather than simply fading.
 */
function exitRising(p: number, rise: number): React.CSSProperties {
  if (p <= 0) return {}
  return {
    transform: `translateY(${-p * rise}px)`,
    clipPath: `inset(0 0 ${p * 100}% 0)`,
  }
}

/** Exit for a block that just closes in place, no travel. */
function exitClosing(p: number): React.CSSProperties {
  return p <= 0 ? {} : { clipPath: `inset(0 0 ${p * 100}% 0)` }
}

/**
 * IntroSection — the home hero, per Figma `Home — V2 (DS)` (node 1126:4557).
 *
 * Five stacked blocks on the 12-column grid: header labels, headline, photo,
 * bio, footer labels.
 *
 * Sticky and transparent from `lg` up, so the project list scrolls behind it
 * and the hero lets go at the end of the list rather than staying pinned for
 * the life of the page;
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

  // Retires the hero as the project list rises behind it. Without this the hero
  // stays pinned and opaque over the first rows.
  const { progress } = useScrollExitProgress()

  // The footer labels sit at the bottom edge of the frame and are the first
  // thing the rising list would collide with, so they go early and alone.
  const outLabels = slice(progress, 0.0, 0.25)

  // Headline, photo and bio all leave on one window, starting and finishing
  // together. Staggering them read as the hero coming apart piece by piece.
  // They still separate, but by distance rather than by timing: the headline
  // drops a full line height while the photo travels 70px and the bio 38px, so
  // the same scroll moves each of them at its own speed.
  const outHero = slice(progress, 0.05, 0.42)

  // A boolean, not the raw progress: passing progress straight through would
  // tear down and rebuild the glitch interval on every scroll frame.
  const heroOnScreen = progress < 0.5

  return (
    <div
      className="pointer-events-none relative z-20 flex min-h-[100svh] flex-col pb-8 md:pb-10 lg:sticky lg:top-0 lg:h-[100svh] lg:pb-12"
      style={{ '--hero-gap': 'clamp(1.5rem, 7.2svh, 4rem)' } as React.CSSProperties}
    >
      {/* No mask on the container any more: one clip here would retire every
          block on the same schedule, in whatever order their geometry happened
          to give. Each block carries its own below.

          The header is the exception — it carries none. It stays for the whole
          page, matching every internal route, which already passes `sticky`.
          The home was the only one that did not. */}
      <HeaderBar
        sticky
        ref={welcomeRef as React.RefObject<HTMLDivElement>}
        className="-entrance -fade -a-0"
      />

      {/* ── Headline — 8 columns, top of the hero ── */}
      {/* The observer sits on the Grid and the entrance on the GridItem inside
          it, never both on one element. `-mask-down` starts at
          `clip-path: inset(0 0 100% 0)`, and IntersectionObserver applies the
          target's own clip when it measures the intersection — a self-hidden
          element reports ratio 0 and never crosses `threshold: 0.1`, so it
          would wait forever for the class that reveals it. Every other
          `-mask-down` in the codebase is a descendant of its observer for the
          same reason; this one is not special. */}
      <Grid
        ref={headlineRef as React.RefObject<HTMLDivElement>}
        className={BLOCK_GAP}
      >
        <GridItem mobileSpan={4} tabletSpan={8} span={8} className="-entrance -mask-down -a-4">
          <h1
            className="text-[36px] leading-[1.15] tracking-[-0.02em] text-text-primary md:text-[48px]"
            style={{ fontFamily: 'var(--font-sans)', fontWeight: 400 }}
          >
            {/* Each line is its own window: `overflow-hidden` on the outer
                span, travel on the inner one, so the text leaves by sliding
                down behind a fixed edge instead of moving the layout. This is
                the same primitive `SplitText type="line"` uses for entrances —
                reversed, and scrubbed by scroll rather than fired once. The
                lines are already explicit spans, so none of SplitText's line
                detection is needed. Both travel on one window, so the sentence
                leaves whole instead of coming apart. */}
            <span className="block overflow-hidden">
              <span
                className="block will-change-transform"
                style={{ transform: `translateY(${outHero * 110}%)` }}
              >
                Creative Designer
              </span>
            </span>
            <span className="block overflow-hidden">
              <span
                className="block will-change-transform"
                style={{ transform: `translateY(${outHero * 110}%)` }}
              >
                who learned to build.
              </span>
            </span>
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
        // No entrance of its own any more: the photo and the bio enter on
        // separate beats, so each carries its own. The observer stays here —
        // `-inview` propagates to descendants.
        className={`lg:flex lg:min-h-0 lg:flex-1 lg:flex-col lg:justify-end ${LABELS_CLEARANCE}`}
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
            {/* `pointer-events-auto` because the whole section is
                `pointer-events-none` (see the section element) — the distortion
                is driven by pointermove and gets no events without it. */}
            {/* `-mask-down` is the box opening — the same entrance the headline
                uses, so the two read as one gesture. The exit travels further
                than the bio's (70px against 38px): same scroll, different
                distance, which is what reads as different speeds. */}
            <div
              style={exitRising(outHero, 70)}
              className="-entrance -mask-down -a-6 pointer-events-auto relative aspect-[216/281] w-full overflow-hidden bg-bg-surface-primary lg:h-full lg:max-h-[281px] lg:min-h-[120px] lg:w-auto"
            >
              <Image
                src="/caio-ogata-profile.webp"
                alt="Caio Ogata"
                fill
                sizes="(min-width: 1024px) 220px, (min-width: 768px) 25vw, 45vw"
                className="object-cover"
                priority
              />
              {/* Paints over the image above once its texture decodes; never
                  mounts on touch or reduced motion, so the photo stands alone.
                  The sweep is timed to `-a-6` (570ms) and `-mask-down` (900ms)
                  so the distortion runs while the box is still opening. */}
              <ClientDistortedImage
                src="/caio-ogata-profile.webp"
                revealOnMount
                revealDelayMs={570}
                revealDurationMs={900}
                idleGlitchMs={heroOnScreen ? 5000 : 0}
              />
            </div>
          </GridItem>
        </Grid>

        {/* ── Bio — columns 7-12, aligned to the menu above ── */}
        <Grid className={BLOCK_GAP}>
          <GridItem mobileSpan={4} tabletSpan={6} span={6} start={7} className="md:col-start-3">
            <p
              className="-entrance -fade -a-7 text-[14px] leading-[1.5] text-text-secondary"
              style={{ fontFamily: 'var(--font-sans)', ...exitRising(outHero, 38) }}
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
        style={exitClosing(outLabels)}
        className={`-entrance -fade -a-8 items-center ${BLOCK_GAP} lg:absolute lg:inset-x-0 lg:bottom-12 lg:mt-0`}
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
