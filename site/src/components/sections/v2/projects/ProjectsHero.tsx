'use client'

import { StickyLogoBar } from '@/components/sections/v2/StickyLogoBar'
import { SplitText } from '@/components/motion/SplitText'

interface ProjectsHeroProps {
  headline: string
  kicker?: string
}

/**
 * /projects index hero — sticky logo bar + headline.
 *
 * Mirrors the About/Experience intro shape (StickyLogoBar at top of a
 * full-bleed `bg-bg` block + large display headline) without the 400vh
 * scroll pin: the projects index has no secondary layered content
 * (image / stats cards) to scrub against, so a static hero reads cleaner.
 *
 * Headline uses `SplitText type="line"` for the line-mask reveal pattern
 * shared by editorial copy on /about. Kicker uses `type="line" as="span"`.
 */
export function ProjectsHero({ headline, kicker }: ProjectsHeroProps) {
  return (
    <div className="relative bg-bg">
      <StickyLogoBar />
      <div className="min-h-[60vh] flex items-center px-5 md:px-8 lg:px-16 py-16 md:py-20 lg:py-24">
        <div className="grid grid-cols-4 md:grid-cols-8 lg:grid-cols-12 gap-4 md:gap-5 w-full">
          <div className="col-span-4 md:col-span-8 lg:col-span-12">
            {kicker && (
              <SplitText
                type="line"
                as="span"
                text={kicker}
                className="block font-mono text-text-secondary mb-6"
                style={{
                  fontSize: '12px',
                  fontWeight: 600,
                  letterSpacing: '1.2px',
                  textTransform: 'uppercase',
                }}
                baseDelayMs={100}
              />
            )}
            <SplitText
              type="line"
              text={headline}
              className="text-text-primary"
              style={{
                fontFamily: 'var(--font-sans)',
                fontSize: 'clamp(2rem, 5vw, 3rem)',
                lineHeight: 1.15,
                letterSpacing: '-0.96px',
                fontWeight: 400,
                textIndent: '8em',
              }}
              staggerMs={120}
              durationMs={1100}
              baseDelayMs={200}
            />
          </div>
        </div>
      </div>
    </div>
  )
}
