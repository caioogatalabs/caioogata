'use client'

import { useInView } from '@/hooks/useInView'
import { COMMIT_COUNT } from '@/lib/build-info'
import { StickyLogoBar } from './StickyLogoBar'

export function IntroSection() {
  const welcomeRef = useInView({ threshold: 0.1, once: true })
  const headlineRef = useInView({ threshold: 0.1, once: true })

  return (
    <div className="bg-bg-surface-secondary flex flex-col min-h-[var(--height-hero)]">
      {/* ── Welcome bar ── */}
      <section
        ref={welcomeRef as React.RefObject<HTMLElement>}
        aria-label="Introduction"
        data-section-id="intro"
        className="relative px-5 pt-8 md:px-8 md:pt-10 lg:px-16 lg:pt-12"
      >
        <div
          className="-entrance -fade -a-0 font-mono flex items-start justify-between w-full text-text-primary opacity-50 tracking-[1.2px]"
          style={{
            fontSize: '12px',
            fontWeight: 600,
            lineHeight: 1.2,
          }}
        >
          <p className="hidden md:block whitespace-nowrap">
            Welcome to caioogata portfolio
          </p>
          <span className="text-right whitespace-nowrap">V2.0.{COMMIT_COUNT}</span>
          <p className="hidden lg:block whitespace-nowrap text-right">
            Built for human and AI assistance
          </p>
        </div>
      </section>

      {/* ── Variable spacer — absorbs hero min-height ── */}
      <div className="flex-1" aria-hidden />

      {/* ── Logo + CTA — sticky bar ── */}
      <StickyLogoBar />

      {/* ── Headline ── */}
      <div ref={headlineRef as React.RefObject<HTMLDivElement>} className="-entrance -slide-up -a-2 px-5 pb-8 md:px-8 md:pb-10 lg:px-16 lg:pb-12">
        <h1
          className="text-text-primary w-full max-w-[16ch]"
          style={{
            fontFamily: 'var(--font-sans)',
            fontSize: 'clamp(2.25rem, 5vw, 4.5rem)',
            fontWeight: 400,
            lineHeight: 1.15,
            letterSpacing: '-0.02em',
          }}
        >
          Creative Designer who learned to build.
        </h1>
      </div>
    </div>
  )
}
