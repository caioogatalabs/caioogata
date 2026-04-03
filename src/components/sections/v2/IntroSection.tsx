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
      className="relative min-h-screen flex flex-col bg-bg-surface-secondary"
    >
      {/* Top bar */}
      <div className="-entrance -fade -a-0 flex items-center justify-between px-5 py-6 md:px-8 lg:px-16">
        {/* Logo */}
        <span
          className="text-xl font-bold text-text-primary"
          style={{ fontFamily: 'var(--font-sans)' }}
        >
          CO
        </span>

        {/* Right side: version + tagline */}
        <div className="flex items-center gap-3">
          <span className="text-sm font-medium uppercase tracking-[0.08em] text-text-secondary font-mono">
            V2.0.01
          </span>
          <span className="hidden md:inline text-sm font-medium text-text-secondary">
            Built for human and AI assistance
          </span>
        </div>
      </div>

      {/* Hero content */}
      <div className="flex flex-1 flex-col items-center justify-center px-5 md:px-8 lg:px-16">
        {/* Overline */}
        <p className="-entrance -slide-up -a-1 text-sm font-medium uppercase tracking-[0.08em] text-text-secondary mb-2 text-center">
          {content.hero.tagline}
        </p>

        {/* Display headline — Fabio XM only */}
        <h1
          className="-entrance -slide-up -a-2 text-text-primary text-center max-w-4xl text-balance"
          style={{
            fontFamily: 'var(--font-sans)',
            fontSize: 'clamp(2.25rem, 5vw, 4.5rem)',
            fontWeight: 400,
            lineHeight: 1.0,
            letterSpacing: '-0.02em',
          }}
        >
          {content.hero.tagline2}
        </h1>

        {/* Ask about CTA */}
        <a
          href="/llms.txt"
          className="-entrance -slide-up -a-3 mt-8 inline-flex items-center justify-center rounded-full bg-bg-fill-primary text-text-on-primary px-6 py-2 text-sm font-medium transition-colors duration-300 hover:bg-bg-fill-primary-hover w-full md:w-auto"
          style={{ borderRadius: '999px' }}
        >
          Ask about
        </a>
      </div>
    </section>
    </>
  )
}
