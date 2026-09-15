'use client'

import { SplitText } from '@/components/motion/SplitText'
import { LABEL } from '@/components/ui/label'

interface PhilosophyHeroProps {
  title: string
  headline: string
}

/**
 * /philosophy hero — sticky header bar + kicker title + display headline.
 *
 * Mirrors the /about and /projects intro shape (HeaderBar + display
 * headline with line-mask reveal). The mono `title` ("Fall, learn, evolve")
 * sits above the headline as a kicker — same role as `1.1 / Bio` in
 * BioBlock or `2.0 / Selected Work` in ProjectsHero.
 */
export function PhilosophyHero({ title, headline }: PhilosophyHeroProps) {
  return (
    <div className="relative bg-bg">
      <div className="min-h-[60vh] flex items-center px-5 md:px-8 lg:px-8 py-16 md:py-20 lg:py-24">
        <div className="grid grid-cols-4 md:grid-cols-8 lg:grid-cols-12 gap-4 md:gap-5 w-full">
          <div className="col-span-4 md:col-span-8 lg:col-span-12">
            <SplitText
              type="line"
              as="span"
              text={`3.0 / ${title}`}
              className={`block ${LABEL} mb-6`}
              baseDelayMs={100}
            />
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
