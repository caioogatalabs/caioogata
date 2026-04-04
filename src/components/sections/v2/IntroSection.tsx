'use client'

import { useInView } from '@/hooks/useInView'
import { StickyHeader } from './StickyHeader'
import Image from 'next/image'

const TAGS = [
  { label: 'Design Engineering', pill: true },
  { label: 'Ai Workflow', pill: false },
  { label: 'Product design', pill: true },
] as const

export function IntroSection() {
  const sectionRef = useInView({ threshold: 0.1, once: true })

  return (
    <>
      <StickyHeader />
      <section
        ref={sectionRef as React.RefObject<HTMLElement>}
        aria-label="Introduction"
        data-section-id="intro"
        className="relative flex flex-col justify-between min-h-[600px] bg-bg-surface-secondary px-5 py-8 md:px-8 md:py-10 lg:px-16 lg:py-12 overflow-hidden"
      >
        {/* ── Top block: welcome bar + logo row ── */}
        <div className="-entrance -fade -a-0 flex flex-col gap-10 lg:gap-16 w-full">
          {/* Welcome bar */}
          <div
            className="flex items-center justify-between w-full text-text-primary opacity-50 uppercase tracking-[1.2px]"
            style={{
              fontFamily: 'var(--font-sans)',
              fontSize: '12px',
              fontWeight: 500,
              lineHeight: 1.5,
            }}
          >
            <span className="hidden md:inline">Welcome to Caio Ogata portfolio.</span>
            <span>V2.0.01</span>
            <span className="hidden lg:inline text-right">Built for human and AI assistance</span>
          </div>

          {/* Logo + CTA row */}
          <div className="flex items-center justify-between w-full">
            {/* Logo */}
            <Image
              src="/logo-co.svg"
              alt="Caio Ogata — CO"
              width={105}
              height={48}
              priority
              className="h-10 w-auto md:h-12"
            />

            {/* CTA buttons */}
            <div className="flex items-center gap-0.5">
              <a
                href="/llms.txt"
                className="inline-flex items-center justify-center h-12 rounded-full bg-bg-fill-primary text-text-on-primary px-8 text-base font-medium transition-colors duration-300 hover:bg-bg-fill-primary-hover"
                style={{ fontFamily: 'var(--font-sans)' }}
              >
                ask about
              </a>
              <button
                type="button"
                className="flex items-center justify-center size-12 rounded-[12px] bg-bg-fill-primary text-text-on-primary text-lg transition-colors duration-300 hover:bg-bg-fill-primary-hover"
                style={{ fontFamily: 'var(--font-sans)' }}
                aria-label="Close"
              >
                ×
              </button>
            </div>
          </div>
        </div>

        {/* ── Bottom: headline with inline tags ── */}
        <div className="-entrance -slide-up -a-2 flex flex-col w-full mt-12 lg:mt-0">
          {/* Line 1: "Bridging [tags] brand" */}
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

            {/* Inline tags */}
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

          {/* Line 2 */}
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
      </section>
    </>
  )
}
