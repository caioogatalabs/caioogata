'use client'

import { useInView } from '@/hooks/useInView'
import { StickyLogoBar } from './StickyLogoBar'

const TAGS = [
  { label: 'Design Engineering', pill: true },
  { label: 'Ai Workflow', pill: false },
  { label: 'Product design', pill: true },
] as const

export function IntroSection() {
  const welcomeRef = useInView({ threshold: 0.1, once: true })
  const headlineRef = useInView({ threshold: 0.1, once: true })

  return (
    <div className="bg-bg-surface-secondary">
      {/* ── Welcome bar ── */}
      <section
        ref={welcomeRef as React.RefObject<HTMLElement>}
        aria-label="Introduction"
        data-section-id="intro"
        className="relative px-5 pt-8 pb-32 md:px-8 md:pt-10 md:pb-40 lg:px-16 lg:pt-12 lg:pb-48"
      >
        <div
          className="-entrance -fade -a-0 flex items-start justify-between w-full text-text-primary opacity-50 uppercase tracking-[1.2px]"
          style={{
            fontFamily: 'var(--font-sans)',
            fontSize: '12px',
            fontWeight: 600,
            lineHeight: 1.2,
          }}
        >
          <div className="flex gap-5">
            <span className="hidden md:inline">
              Welcome
              <br />
              to
            </span>
            <span className="hidden md:inline">caioogata</span>
            <span className="hidden lg:inline">portfolio &amp; website</span>
          </div>
          <span className="text-right">
            V2.
            <br />
            0.12
          </span>
          <span className="hidden lg:inline text-right">
            Built for human
            <br />
            and AI assistance
          </span>
        </div>
      </section>

      {/* ── Logo + CTA — sticky bar ── */}
      <StickyLogoBar />

      {/* ── Headline ── */}
      <div ref={headlineRef as React.RefObject<HTMLDivElement>} className="-entrance -slide-up -a-2 px-5 pb-8 md:px-8 md:pb-10 lg:px-16 lg:pb-12">
        <div
          className="flex flex-wrap items-center gap-x-3 gap-y-2"
          style={{
            fontFamily: 'var(--font-sans)',
            fontSize: 'clamp(2.25rem, 5vw, 4.5rem)',
            fontWeight: 400,
            lineHeight: 1.15,
            letterSpacing: '-0.02em',
          }}
        >
          <span className="text-text-primary whitespace-nowrap">Bridging</span>
          <span className="inline-flex items-center gap-0 flex-wrap">
            {TAGS.map((tag) => (
              <span
                key={tag.label}
                className={`inline-flex items-center justify-center h-10 md:h-12 px-5 md:px-8 border border-border-primary text-text-primary text-sm md:text-base font-medium whitespace-nowrap ${
                  tag.pill ? 'rounded-full' : 'rounded-[12px]'
                }`}
                style={{ fontFamily: 'var(--font-sans)' }}
              >
                {tag.label}
              </span>
            ))}
          </span>
          <span className="text-text-primary whitespace-nowrap">brand</span>
        </div>
        <p
          className="text-text-primary w-full"
          style={{
            fontFamily: 'var(--font-sans)',
            fontSize: 'clamp(2.25rem, 5vw, 4.5rem)',
            fontWeight: 400,
            lineHeight: 1.15,
            letterSpacing: '-0.02em',
          }}
        >
          strategy, product craft and technical workflow
        </p>
      </div>
    </div>
  )
}
