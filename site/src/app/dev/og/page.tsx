import type { Metadata } from 'next'
import Image from 'next/image'
import { Grid, GridItem } from '@/components/layout/Grid'
import { LABEL_TYPE } from '@/components/ui/label'
import content from '@/content/en.json'

/**
 * The board the OG image is shot from — 1200x630, saved over `public/og-img.png`
 * (PROJECTS-GUIDE.md › Open Graph). Never indexed: `/dev/` is disallowed.
 *
 * It is the intro's own frame, not a card assembled from its parts: a mono
 * label row where the header sits, the headline on the left eight columns, the
 * portrait on the right four. Same `Grid`, same gutters, same twelve columns as
 * the page — the board is 1200 wide and the grid is responsive to the viewport,
 * so shoot it in a window at least 1024 wide or the columns collapse to the
 * tablet layout.
 *
 * Headline and portrait share one grid row rather than stacking. At four
 * columns the portrait is 365 wide, and at the Figma's 216x281 that is 475
 * tall — three quarters of the card. Stacked under the headline it would not
 * fit; beside it, it does, and the frame reads the way the hero does: the
 * sentence at the top left, him at the right, the picture carrying the weight.
 *
 * Two things it deliberately does not carry. The bio, because a share card is
 * read in a feed at a third of its size and body copy at that scale is grey
 * noise — the description meta tag already says it in real text that the
 * platform renders itself. And the availability line, whose slot the email
 * takes: away from the site, the card's job is to be answerable.
 */
export const metadata: Metadata = {
  title: 'OG board — dev',
  robots: { index: false, follow: false },
}

const { hero, contact, ui } = content

/** The card's own label size — four points over the page's 12px. */
const OG_LABEL = `${LABEL_TYPE} text-[17px] opacity-50`

export default function OgBoardPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-black p-6">
      {/* The root layout mounts the header and the footer on every route, and
          the header is sticky — it lands on top of the board and an element
          screenshot picks it up. `nextjs-portal` is the dev overlay badge,
          which sits in the bottom-left corner and got shot into the card too.
          A style tag rather than a layout because a root layout always applies
          in the App Router; there is no opting out of it from a leaf route. */}
      <style>{`
        [role="banner"], footer, nextjs-portal { display: none !important; }
      `}</style>

      <div
        id="og-board"
        className="relative flex flex-col overflow-hidden bg-bg"
        style={{ width: 1200, height: 630, paddingTop: 44, paddingBottom: 44 }}
      >
        {/* ── Top labels — where the header sits on the page ──
             The domain takes the slot the welcome line holds there: a share
             card is seen away from the site and has to name it. */}
        <Grid className="items-start">
          <GridItem span={4} className={OG_LABEL}>
            caioogata.com
          </GridItem>
          <GridItem span={4} className={OG_LABEL}>
            {hero.location}
          </GridItem>
          <GridItem span={4} className={`${OG_LABEL} text-right`}>
            {contact.email}
          </GridItem>
        </Grid>

        {/* ── Headline on 1-8, portrait on 9-12 — one row ── */}
        <Grid className="mt-8 flex-1 items-start">
          <GridItem span={8}>
            <h1
              className="type-display text-text-primary"
              style={{ fontSize: 58, lineHeight: 1.08, letterSpacing: '-0.02em' }}
            >
              {ui.intro.headlineLine1}
              <br />
              {ui.intro.headlineLine2}
            </h1>
          </GridItem>

          <GridItem span={4} start={9}>
            <div className="relative aspect-[216/281] w-full overflow-hidden bg-bg-surface-primary">
              <Image
                src="/caio-ogata-profile.webp"
                alt=""
                fill
                sizes="400px"
                className="object-cover"
                priority
              />
            </div>
          </GridItem>
        </Grid>
      </div>
    </div>
  )
}
