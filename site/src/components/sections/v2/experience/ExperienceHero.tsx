'use client'

import { SplitText } from '@/components/motion/SplitText'

interface ExperienceHeroProps {
  headline: string
}

/**
 * /experience hero — headline only.
 *
 * Was a 400vh pin with a scrubbed trio of stat cards converging on the
 * headline. Both are gone: the numbers counted employers rather than work, and
 * the scrub cost four viewports of scroll before the record itself began. The
 * page now opens the way /projects and /philosophy do — one screen, one
 * sentence, then the list.
 *
 * The first line starts on column 4, with the same derived indent as the /about
 * hero (see AboutPinned for the arithmetic). The
 * indent rides a CSS variable rather than a JS breakpoint check, because
 * `SplitText` reads `text-indent` off the computed style and applies it to the
 * first line only. A flat `8em` would be 384px at this size, which on a phone
 * pushes the paragraph off screen.
 */
export function ExperienceHero({ headline }: ExperienceHeroProps) {
  return (
    <div className="relative bg-bg">
      <div className="flex min-h-[60vh] items-center px-5 py-16 md:px-8 md:py-20 lg:px-8 lg:py-24">
        <div className="grid w-full grid-cols-4 gap-4 md:grid-cols-8 md:gap-5 lg:grid-cols-12">
          <div className="col-span-4 md:col-span-8 lg:col-span-12 [--line1-indent:0px] md:[--line1-indent:calc(37.5%_+_7.5px)] lg:[--line1-indent:calc(25%_+_5px)]">
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
