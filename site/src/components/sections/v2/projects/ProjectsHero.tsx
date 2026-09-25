'use client'

import { SplitText } from '@/components/motion/SplitText'
import { LABEL } from '@/components/ui/label'

interface ProjectsHeroProps {
  headline: string
  kicker?: string
}

/**
 * /projects index hero — sticky header bar + headline.
 *
 * Mirrors the About/Experience intro shape (HeaderBar at top of a
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
      <div className="min-h-[60vh] flex items-center px-5 md:px-8 lg:px-8 py-16 md:py-20 lg:py-24">
        <div className="grid grid-cols-4 md:grid-cols-8 lg:grid-cols-12 gap-4 md:gap-5 w-full">
          <div className="col-span-4 md:col-span-8 lg:col-span-12 [--line1-indent:calc(25%_+_4px)] md:[--line1-indent:8em] lg:[--line1-indent:calc(33.3333%_+_6.667px)]">
            {kicker && (
              <SplitText
                type="line"
                as="span"
                text={kicker}
                className={`block ${LABEL} mb-6`}
                baseDelayMs={100}
              />
            )}
            <SplitText
              type="line"
              text={headline}
              className="type-display text-text-primary"
              style={{ textIndent: 'var(--line1-indent)' }}
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
