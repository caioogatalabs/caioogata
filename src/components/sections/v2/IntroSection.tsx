'use client'

import { useState } from 'react'
import { useInView } from '@/hooks/useInView'
import Image from 'next/image'

const TAGS = [
  { label: 'Design Engineering', pill: true },
  { label: 'Ai Workflow', pill: false },
  { label: 'Product design', pill: true },
] as const

export function IntroSection() {
  const welcomeRef = useInView({ threshold: 0.1, once: true })
  const stickyRef = useInView({ threshold: 0.1, once: true })
  const headlineRef = useInView({ threshold: 0.1, once: true })
  const [groupHovered, setGroupHovered] = useState(false)

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
      <div
        ref={stickyRef as React.RefObject<HTMLDivElement>}
        className="sticky top-0 z-50 px-5 py-4 md:px-8 lg:px-16"
      >
        <div className="flex items-center justify-between w-full">
          <Image
            src="/logo-co.svg"
            alt="Caio Ogata — CO"
            width={105}
            height={48}
            priority
            className="h-10 w-auto md:h-12"
          />

          <div
            className="flex items-center gap-0.5"
            onMouseEnter={() => setGroupHovered(true)}
            onMouseLeave={() => setGroupHovered(false)}
          >
            <a
              href="/llms.txt"
              className="relative inline-flex items-center justify-center h-12 rounded-full bg-bg-fill-primary text-text-on-primary px-8 overflow-hidden transition-colors duration-300 hover:bg-bg-fill-primary-hover"
            >
              <span
                className="block text-base font-medium"
                style={{
                  fontFamily: 'var(--font-sans)',
                  transform: groupHovered ? 'translateY(-100%)' : 'translateY(0)',
                  opacity: groupHovered ? 0 : 1,
                  transition: groupHovered
                    ? 'transform 1s cubic-bezier(0.16,1,0.3,1), opacity 0.3s cubic-bezier(0.16,1,0.3,1)'
                    : 'transform 1s cubic-bezier(0.16,1,0.3,1) 0.06s, opacity 0.3s cubic-bezier(0.16,1,0.3,1) 0.06s',
                }}
              >
                ask about
              </span>
              <span
                className="absolute inset-0 flex items-center justify-center font-normal"
                style={{
                  fontFamily: "'Pexel Grotesk', var(--font-sans)",
                  fontSize: '1.5rem',
                  transform: groupHovered ? 'translateY(0)' : 'translateY(100%)',
                  opacity: groupHovered ? 1 : 0,
                  transition: groupHovered
                    ? 'transform 1s cubic-bezier(0.16,1,0.3,1), opacity 0.3s cubic-bezier(0.16,1,0.3,1)'
                    : 'transform 1s cubic-bezier(0.16,1,0.3,1) 0.06s, opacity 0.3s cubic-bezier(0.16,1,0.3,1) 0.06s',
                }}
              >
                ask about
              </span>
            </a>
            <button
              type="button"
              className="relative flex items-center justify-center size-12 rounded-[12px] bg-bg-fill-primary text-text-on-primary overflow-hidden transition-colors duration-300 hover:bg-bg-fill-primary-hover"
              aria-label="Close"
            >
              <span
                className="block text-lg"
                style={{
                  fontFamily: 'var(--font-sans)',
                  transform: groupHovered ? 'translateY(-100%)' : 'translateY(0)',
                  opacity: groupHovered ? 0 : 1,
                  transition: groupHovered
                    ? 'transform 1s cubic-bezier(0.16,1,0.3,1) 0.1s, opacity 0.3s cubic-bezier(0.16,1,0.3,1) 0.1s'
                    : 'transform 1s cubic-bezier(0.16,1,0.3,1), opacity 0.3s cubic-bezier(0.16,1,0.3,1)',
                }}
              >
                ×
              </span>
              <span
                className="absolute inset-0 flex items-center justify-center"
                style={{
                  fontFamily: "'Pexel Grotesk', var(--font-sans)",
                  fontSize: '1.5rem',
                  transform: groupHovered ? 'translateY(0)' : 'translateY(100%)',
                  opacity: groupHovered ? 1 : 0,
                  transition: groupHovered
                    ? 'transform 1s cubic-bezier(0.16,1,0.3,1) 0.1s, opacity 0.3s cubic-bezier(0.16,1,0.3,1) 0.1s'
                    : 'transform 1s cubic-bezier(0.16,1,0.3,1), opacity 0.3s cubic-bezier(0.16,1,0.3,1)',
                }}
              >
                ×
              </span>
            </button>
          </div>
        </div>
      </div>

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
