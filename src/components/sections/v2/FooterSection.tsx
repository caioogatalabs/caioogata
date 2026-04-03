'use client'

import { useState, useEffect, useRef } from 'react'
import { useInView } from '@/hooks/useInView'
import { Grid, GridItem } from '@/components/layout/Grid'
import { ContactForm } from '@/components/sections/v2/ContactForm'
import content from '@/content/en.json'

const TECH_TAGS = ['Next.js', 'React', 'Tailwind', 'Vercel']
const EXPAND_CONTENT_ID = 'footer-expand-content'

export function FooterSection() {
  const [isExpanded, setIsExpanded] = useState(false)
  const contentRef = useRef<HTMLDivElement>(null)
  const footerRef = useRef<HTMLElement>(null)
  const hasAutoExpanded = useRef(false)
  const prefersReducedMotion = useRef(false)
  const sectionRef = useInView({ threshold: 0.1 })

  // Check reduced motion preference
  useEffect(() => {
    prefersReducedMotion.current = window.matchMedia(
      '(prefers-reduced-motion: reduce)'
    ).matches
  }, [])

  // Listen for 'open-contact' custom event from MenuSection
  useEffect(() => {
    const handler = () => {
      setIsExpanded(true)
      footerRef.current?.scrollIntoView({ behavior: 'smooth' })
    }
    window.addEventListener('open-contact', handler)
    return () => window.removeEventListener('open-contact', handler)
  }, [])

  // Auto-expand when user scrolls past footer bottom (hit page end)
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
        // Also feed to the entrance animation ref
        if (sectionRef && 'current' in sectionRef) {
          (sectionRef as React.MutableRefObject<HTMLElement | null>).current = node
        }
      }}
      aria-label="Footer"
      data-section-id="footer"
      className="-entrance -slide-up -a-0 py-12 pb-6"
    >
      <Grid>
        <GridItem span={8} tabletSpan={8} mobileSpan={4} className="lg:col-start-3">
          {/* Expandable contact section */}
          <div
            id={EXPAND_CONTENT_ID}
            style={{
              maxHeight: isExpanded ? contentRef.current?.scrollHeight ?? 1000 : 0,
              transition: `max-height ${transitionDuration}`,
              overflow: 'hidden',
            }}
          >
            <div ref={contentRef} className="pb-8">
              <ContactForm />

              {/* Social links */}
              <div className="flex flex-wrap gap-4 mt-8">
                {content.contact.links.map((link) => (
                  <a
                    key={link.label}
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-base text-text-brand hover:underline transition-colors duration-300"
                  >
                    {link.label}
                  </a>
                ))}
              </div>
            </div>
          </div>

          {/* Tech tags */}
          <div className="flex flex-wrap gap-2 mb-6">
            {TECH_TAGS.map((tag) => (
              <span
                key={tag}
                className="font-mono text-sm uppercase tracking-widest text-text-secondary bg-bg-surface-primary rounded-full px-3 py-1"
              >
                {tag}
              </span>
            ))}
          </div>

          {/* Bottom row: copyright + contact button */}
          <div className="flex items-center justify-between">
            <span className="text-base text-text-secondary">
              &copy; 2026 Caio Ogata
            </span>
            <button
              type="button"
              onClick={toggleExpanded}
              aria-expanded={isExpanded}
              aria-controls={EXPAND_CONTENT_ID}
              className="rounded-full bg-bg-fill-primary text-text-on-primary px-6 py-2.5 text-base font-medium transition-colors duration-300 hover:bg-bg-fill-primary-hover"
            >
              Contact
            </button>
          </div>
        </GridItem>
      </Grid>
    </footer>
  )
}
