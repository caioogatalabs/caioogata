import type { Metadata } from 'next'
import Image from 'next/image'
import { LABEL, LABEL_TYPE } from '@/components/ui/label'
import content from '@/content/en.json'

/**
 * The board the OG image is shot from — 1200x630, the hero's own composition:
 * headline on the left, portrait on the right, mono labels top and bottom.
 * Screenshot it at this size and save over `public/og-img.png`
 * (PROJECTS-GUIDE.md › Open Graph). Never indexed: `/dev/` is disallowed.
 */
export const metadata: Metadata = {
  title: 'OG board — dev',
  robots: { index: false, follow: false },
}

export default function OgBoardPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-black p-6">
      <div
        id="og-board"
        className="relative flex flex-col justify-between overflow-hidden bg-bg"
        style={{ width: 1200, height: 630, padding: 64 }}
      >
        <div className="flex items-start justify-between">
          <span className={LABEL_TYPE}>caioogata.com</span>
          <span className={LABEL}>{content.hero.location}</span>
        </div>

        <div className="flex items-end justify-between gap-16">
          <div className="flex flex-col gap-6" style={{ maxWidth: 740 }}>
            <h1
              className="text-text-primary"
              style={{
                fontFamily: 'var(--font-sans)',
                fontSize: 60,
                lineHeight: 1.06,
                fontWeight: 300,
                letterSpacing: '-0.02em',
              }}
            >
              Creative Designer
              <br />
              who learned to build.
            </h1>
            <p
              className="text-text-secondary"
              style={{ fontFamily: 'var(--font-sans)', fontSize: 18, lineHeight: 1.5, maxWidth: 520 }}
            >
              {content.hero.tagline2}
            </p>
          </div>

          <div
            className="relative shrink-0 overflow-hidden bg-bg-surface-primary"
            style={{ width: 264, height: 343 }}
          >
            <Image src="/caio-ogata-profile.webp" alt="" fill sizes="264px" className="object-cover" priority />
          </div>
        </div>

        <div className="flex items-end justify-end">
          <span className={LABEL}>{content.ui.header.available}</span>
        </div>
      </div>
    </div>
  )
}
