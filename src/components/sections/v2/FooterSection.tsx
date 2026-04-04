'use client'

import { useState, useEffect, useRef } from 'react'
import { useInView } from '@/hooks/useInView'
import { ContactForm } from '@/components/sections/v2/ContactForm'
import content from '@/content/en.json'

const TECH_TAGS = ['Next.js', 'React', 'Tailwind', 'Vercel']
const EXPAND_CONTENT_ID = 'footer-expand-content'

function SocialLink({ label, url }: { label: string; url: string }) {
  const [isHovered, setIsHovered] = useState(false)

  return (
    <div className="flex flex-col gap-2">
      <div className="h-px w-full bg-border-primary opacity-30" />
      <div className="flex items-center justify-between">
        <a
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          className="text-2xl text-text-primary transition-colors duration-300 hover:text-white"
          style={{ fontFamily: 'var(--font-sans)', fontWeight: 600, lineHeight: 1.3 }}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          onFocus={() => setIsHovered(true)}
          onBlur={() => setIsHovered(false)}
        >
          {label}
        </a>
        <div
          className="size-12 rounded-full bg-bg-fill-primary flex items-center justify-center transition-all duration-300"
          style={{
            opacity: isHovered ? 1 : 0,
            transform: isHovered ? 'scale(1)' : 'scale(0.6)',
          }}
          aria-hidden="true"
        >
          <span
            className="text-text-on-primary text-4xl leading-none -rotate-45"
            style={{ fontFamily: 'var(--font-sans)', fontWeight: 700 }}
          >
            &rarr;
          </span>
        </div>
      </div>
    </div>
  )
}

export function FooterSection() {
  const [isExpanded, setIsExpanded] = useState(false)
  const contentRef = useRef<HTMLDivElement>(null)
  const footerRef = useRef<HTMLElement>(null)
  const hasAutoExpanded = useRef(false)
  const prefersReducedMotion = useRef(false)
  const sectionRef = useInView({ threshold: 0.1 })

  useEffect(() => {
    prefersReducedMotion.current = window.matchMedia(
      '(prefers-reduced-motion: reduce)'
    ).matches
  }, [])

  useEffect(() => {
    const handler = () => {
      setIsExpanded(true)
      footerRef.current?.scrollIntoView({ behavior: 'smooth' })
    }
    window.addEventListener('open-contact', handler)
    return () => window.removeEventListener('open-contact', handler)
  }, [])

  useEffect(() => {
    const handleScroll = () => {
      if (hasAutoExpanded.current) return
      const atBottom = window.innerHeight + window.scrollY >= document.body.offsetHeight - 50
      if (atBottom) {
        hasAutoExpanded.current = true
        setTimeout(() => setIsExpanded(true), 300)
      }
    }
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const toggleExpanded = () => {
    setIsExpanded((prev) => !prev)
  }

  const transitionDuration = prefersReducedMotion.current ? '0.01s' : '0.6s var(--ease-out)'

  return (
    <footer
      ref={(node) => {
        footerRef.current = node
        if (sectionRef && 'current' in sectionRef) {
          (sectionRef as React.MutableRefObject<HTMLElement | null>).current = node
        }
      }}
      aria-label="Footer"
      data-section-id="footer"
      className="-entrance -slide-up -a-0 px-5 md:px-8 lg:px-16 py-8"
    >
      <div className="bg-bg-surface-primary rounded-[12px]">
        {/* Expandable contact section */}
        <div
          id={EXPAND_CONTENT_ID}
          style={{
            maxHeight: isExpanded ? contentRef.current?.scrollHeight ?? 2000 : 0,
            transition: `max-height ${transitionDuration}`,
            overflow: 'hidden',
          }}
        >
          <div
            ref={contentRef}
            className="p-5 md:p-8 grid grid-cols-4 gap-4 md:grid-cols-8 md:gap-5 lg:grid-cols-12"
          >
            {/* Left column — Social links (4 cols) */}
            <div className="col-span-4 md:col-span-3 lg:col-span-4 flex flex-col gap-5">
              {content.contact.links.map((link) => (
                <SocialLink key={link.label} label={link.label} url={link.url} />
              ))}
              <div className="h-px w-full bg-border-primary opacity-30" />
            </div>

            {/* Right column — Contact form (8 cols) */}
            <div className="col-span-4 md:col-span-5 lg:col-span-8 flex flex-col">
              <ContactForm />
            </div>
          </div>
        </div>

        {/* Bottom row: tags + copyright left, contact button right */}
        <div className="px-5 md:px-8 py-5 md:py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {TECH_TAGS.map((tag) => (
                <span
                  key={tag}
                  className="inline-flex items-center justify-center border border-border-primary text-xs text-text-secondary font-mono px-3 py-1.5 rounded-[12px]"
                >
                  {tag}
                </span>
              ))}
              <span className="text-xs text-text-tertiary font-mono">
                &copy; 2026 Caio Ogata
              </span>
            </div>
            <button
              type="button"
              onClick={toggleExpanded}
              aria-expanded={isExpanded}
              aria-controls={EXPAND_CONTENT_ID}
              className="rounded-full bg-bg-fill-primary text-text-on-primary px-8 py-3.5 text-sm font-medium transition-colors duration-300 hover:bg-bg-fill-primary-hover"
              style={{ fontFamily: 'var(--font-sans)' }}
            >
              {isExpanded ? 'Close' : 'Contact'}
            </button>
          </div>
        </div>
      </div>
    </footer>
  )
}
