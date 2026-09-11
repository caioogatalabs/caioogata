'use client'

import { useInView } from '@/hooks/useInView'
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
 */
export function FooterSection() {
  const sectionRef = useInView({ threshold: 0.1 })

  return (
    <footer
      ref={sectionRef as React.RefObject<HTMLElement>}
      id="contact"
      aria-label="Footer"
      data-section-id="footer"
      data-theme="inverse"
      // z-30 puts the panel above the fixed hero (z-20), so it slides over it
      // on the way down — the same layering the Figma frame has, where the
      // yellow block covers the sticky intro.
      // Opens on the header's own margin — `pt-12` here mirrors HeaderBar's
      // `pt-12`, so the first line of the footer sits as far off the yellow as
      // the hero's first label sits off the top of the page.
      className="-entrance -fade -a-0 relative z-30 overflow-hidden bg-bg pt-8 md:pt-10 lg:pt-12"
    >
      {/* ── Link columns ── */}
      <Grid>
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
      <Grid className="mt-20 md:mt-24 lg:mt-28">
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
      <Grid className="mt-4">
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
        }}
      >
        caioogata
      </p>
    </footer>
  )
}
