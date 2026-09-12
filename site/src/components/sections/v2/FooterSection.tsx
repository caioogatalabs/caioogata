'use client'

import { useEffect, useRef, useState } from 'react'
import { Grid, GridItem } from '@/components/layout/Grid'
import { AskAiBar } from '@/components/sections/v2/AskAiBar'
import { COMMIT_COUNT } from '@/lib/build-info'

const SOCIAL = [
  { label: 'Linkedin', href: 'https://www.linkedin.com/in/caioogata/' },
  { label: 'GitHub', href: 'https://github.com/caioogatalabs' },
  { label: 'Instagram', href: 'https://www.instagram.com/caioogata.labs' },
  { label: 'Youtube', href: 'https://www.youtube.com/@caioogatalabs' },
] as const

const EMAIL = 'contato@caioogata.com'

/**
 * V1's last build stamp, frozen: the `v1` branch ends at 91 commits on package
 * version 1.1, the same `{version}.{commitCount}` scheme V2 stamps with. It
 * renders as plain text until V2 replaces V1 in production, at which point this
 * becomes the link to the archived V1.
 */
const V1_VERSION = 'V1.1.91'

const LABEL =
  'font-mono text-[12px] font-semibold leading-[1.2] tracking-[1.2px] text-text-secondary opacity-50'

/**
 * FooterSection — the brand-yellow closing panel, per Figma `Home — V2 (DS)`
 * (node 1140:4723).
 *
 * Three bands: link columns (social / contact), a label row mirroring the
 * hero's header bar, and the oversized `caioogata` wordmark that bleeds off the
 * bottom edge. The whole panel runs on `data-theme="inverse"`, so every
 * semantic token remaps to the brand palette — no hardcoded yellows.
 *
 * The wordmark is sized in `vw` so it always spans the viewport, and the
 * overflow clip on the footer is what cuts its descenders.
 *
 * The panel is fixed to the bottom of the viewport on the page's lowest layer,
 * and the page content above it is opaque (`relative z-10 bg-bg`, set in
 * app/layout). So the footer does not scroll up into view — the black content
 * scrolls off it, uncovering it. The spacer rendered alongside is what gives
 * the document the scroll room that reveal needs; without it the content ends
 * flush and there is nothing left to scroll.
 *
 * `reveal` is how much of the panel is uncovered, 0 → 1. It drives two things:
 * the wordmark scales 0.8 → 1 as it emerges, and once the panel is meaningfully
 * out (12%) the root takes `-inview`, firing the site's standard `-entrance`
 * cascade on the bands with the hero's own easing and stagger. A `useInView`
 * observer could not do that job here: the panel is fixed, so it is technically
 * on screen from the first paint and would have fired at load.
 */
export function FooterSection() {
  const spacerRef = useRef<HTMLDivElement>(null)
  const panelRef = useRef<HTMLElement>(null)
  const [height, setHeight] = useState(0)
  const [reveal, setReveal] = useState(0)
  const [reducedMotion, setReducedMotion] = useState(false)

  useEffect(() => {
    setReducedMotion(window.matchMedia('(prefers-reduced-motion: reduce)').matches)
  }, [])

  // The spacer mirrors the panel's height, which moves with the viewport — the
  // wordmark is sized in `vw`, so a resize changes how much room the reveal
  // needs.
  useEffect(() => {
    const panel = panelRef.current
    if (!panel) return
    // Border box, not `contentRect` — the panel's own top padding is part of
    // the room the reveal needs, and the content box leaves it out.
    const observer = new ResizeObserver(() => {
      setHeight(panel.getBoundingClientRect().height)
    })
    observer.observe(panel)
    return () => observer.disconnect()
  }, [])

  // Reveal = how far the content's bottom edge has risen past the panel's top.
  // rAF-throttled, matching useScrollReveal / useScrollExpand.
  useEffect(() => {
    if (!height) return
    let frame = 0
    const measure = () => {
      frame = 0
      const spacer = spacerRef.current
      if (!spacer) return
      const uncovered = window.innerHeight - spacer.getBoundingClientRect().top
      setReveal(Math.min(Math.max(uncovered / height, 0), 1))
    }
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(measure)
    }
    measure()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
      if (frame) cancelAnimationFrame(frame)
    }
  }, [height])

  return (
    <>
      {/* The scroll room the reveal needs. It also carries `id="contact"`: the
          header menu's link has to land on something in the flow — scrolling
          to a fixed element moves nothing, since it never leaves the viewport. */}
      <div
        ref={spacerRef}
        id="contact"
        aria-hidden="true"
        // At least a viewport tall, even when the panel is shorter. The home's
        // hero is sticky inside a container that ends here, so it unpins
        // against this edge — with a spacer the size of the panel alone, the
        // hero's last 190px stayed parked above the footer at full scroll,
        // repeating the ask-ai row the footer already carries. A viewport of
        // room pushes the container fully past the top instead.
        style={{ height: height ? `max(${height}px, 100svh)` : undefined }}
      />

      <footer
        ref={panelRef}
        aria-label="Footer"
        data-section-id="footer"
        data-theme="inverse"
        className={`fixed inset-x-0 bottom-0 z-0 overflow-hidden bg-bg pt-8 md:pt-10 lg:pt-12 ${
          reveal > 0.12 ? '-inview' : ''
        }`}
      >
      {/* ── Link columns ── */}
      <Grid className="-entrance -slide-up -a-0">
        <GridItem mobileSpan={4} tabletSpan={4} span={3} start={2}>
          <p className={LABEL}>Social</p>
          <ul className="mt-2 flex flex-col gap-2">
            {SOCIAL.map(({ label, href }) => (
              <li key={label}>
                <a
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-[18px] leading-[1.6] text-text-primary transition-opacity duration-300 hover:opacity-60"
                  style={{ fontFamily: 'var(--font-sans)' }}
                >
                  {label}
                  <span aria-hidden className="text-[16px]">
                    ↗
                  </span>
                </a>
              </li>
            ))}
          </ul>
        </GridItem>

        <GridItem mobileSpan={4} tabletSpan={4} span={3} start={9} className="mt-10 md:mt-0">
          <p className={LABEL}>Contact</p>
          <a
            href={`mailto:${EMAIL}`}
            className="mt-2 inline-block text-[18px] leading-[1.6] text-text-primary transition-opacity duration-300 hover:opacity-60"
            style={{ fontFamily: 'var(--font-sans)' }}
          >
            {EMAIL}
          </a>
        </GridItem>
      </Grid>

      {/* ── Label row — mirrors the hero's header bar ── */}
      <Grid className="-entrance -slide-up -a-2 mt-20 md:mt-24 lg:mt-28">
        <GridItem mobileSpan={4} tabletSpan={3} span={3} className={`${LABEL} whitespace-nowrap`}>
          © 2026 All Rights Reserved
        </GridItem>

        {/* The version stack. V1's stamp is frozen at its last build — the
            `v1` branch stopped at 91 commits on package version 1.1 — and this
            is the slot the link to the live V1 goes in once V2 replaces it. */}
        <GridItem mobileSpan={2} tabletSpan={1} span={1} className={`${LABEL} whitespace-nowrap`}>
          <p>V2.0.{COMMIT_COUNT}</p>
          <p>{V1_VERSION}</p>
        </GridItem>

        {/* Column 9 — the contact column above, so the two line up */}
        <GridItem mobileSpan={2} tabletSpan={2} span={2} start={9} className={LABEL}>
          ask ai about caio
        </GridItem>

        <GridItem
          mobileSpan={4}
          tabletSpan={2}
          span={2}
          className={`${LABEL} text-right`}
        >
          <button
            type="button"
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="transition-opacity duration-300 hover:opacity-100"
          >
            scroll up
          </button>
        </GridItem>
      </Grid>

      {/* The bar follows its label onto column 9. */}
      <Grid className="-entrance -slide-up -a-3 mt-4">
        <GridItem mobileSpan={4} tabletSpan={3} span={3} start={9}>
          <AskAiBar />
        </GridItem>
      </Grid>

      {/* ── Wordmark — bleeds off the bottom, clipped by the footer ── */}
      <p
        aria-hidden
        className="mt-6 -mb-[0.12em] select-none whitespace-nowrap px-5 text-center leading-[1.15] text-text-primary md:px-8"
        style={{
          fontFamily: 'var(--font-sans)',
          fontWeight: 400,
          fontSize: '19.4vw',
          letterSpacing: '-0.02em',
          // Grows into its full size as the panel emerges — 0.8 → 1. Anchored
          // at the bottom centre so the baseline stays put and the bleed off
          // the bottom edge holds steady while it expands.
          transform: reducedMotion ? undefined : `scale(${0.8 + 0.2 * reveal})`,
          transformOrigin: 'bottom center',
        }}
      >
        caioogata
      </p>
      </footer>
    </>
  )
}
