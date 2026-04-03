'use client'

import { useInView } from '@/hooks/useInView'
import { StickyHeader } from './StickyHeader'
import content from '@/content/en.json'

export function IntroSection() {
  const sectionRef = useInView({ threshold: 0.1, once: true })

  return (
    <>
      <StickyHeader />
      <section
        ref={sectionRef as React.RefObject<HTMLElement>}
        aria-label="Introduction"
        data-section-id="intro"
        className="relative flex flex-col justify-between h-[600px] bg-bg-surface-secondary px-5 py-8 md:px-8 md:py-10 lg:px-16 lg:py-12 overflow-hidden"
      >
        {/* Top bar */}
        <div className="-entrance -fade -a-0 flex items-center justify-between w-full">
          {/* Logo */}
          <span
            className="text-3xl font-bold text-text-primary tracking-tight"
            style={{ fontFamily: 'var(--font-sans)' }}
          >
            CO
          </span>

          {/* Center + Right: version + tagline */}
          <div className="flex items-center gap-5">
            <span
              className="text-sm font-medium uppercase tracking-[1.12px] text-text-secondary opacity-50"
              style={{ fontFamily: 'var(--font-sans)' }}
            >
              V2.0.01
            </span>
            <span
              className="hidden md:inline text-lg text-text-secondary opacity-50"
              style={{ fontFamily: 'var(--font-sans)' }}
            >
              Built for human and AI assistance
            </span>
          </div>
        </div>

        {/* CTA — bottom right area */}
        <div className="-entrance -fade -a-1 flex items-center justify-end gap-0.5">
          <a
            href="/llms.txt"
            className="inline-flex items-center justify-center h-12 rounded-full bg-bg-fill-primary text-text-on-primary px-8 text-base font-medium transition-colors duration-300 hover:bg-bg-fill-primary-hover"
            style={{ fontFamily: 'var(--font-sans)', borderRadius: '999px' }}
          >
            ask about
          </a>
          <button
            type="button"
            className="flex items-center justify-center size-12 rounded-[12px] bg-bg-fill-primary text-text-on-primary text-lg transition-colors duration-300 hover:bg-bg-fill-primary-hover"
            aria-label="Close"
          >
            ×
          </button>
        </div>

        {/* Bottom: overline + headline */}
        <div className="-entrance -slide-up -a-2 flex flex-col gap-2 w-full">
          <p
            className="text-sm font-medium uppercase tracking-[1.12px] text-text-secondary opacity-50"
            style={{ fontFamily: 'var(--font-sans)' }}
          >
            DESIGN ENGINEERING &nbsp;/&nbsp; DESIGN SYSTEMS &nbsp;/&nbsp; PRODUCT DESIGN
          </p>
          <h1
            className="text-text-primary w-full"
            style={{
              fontFamily: 'var(--font-sans)',
              fontSize: 'clamp(2.25rem, 5vw, 4.5rem)',
              fontWeight: 400,
              lineHeight: 1.15,
              letterSpacing: '-0.02em',
            }}
          >
            {content.hero.tagline2}
          </h1>
        </div>
      </section>
    </>
  )
}
