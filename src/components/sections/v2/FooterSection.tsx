'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { useInView } from '@/hooks/useInView'
import { ContactForm } from '@/components/sections/v2/ContactForm'
import content from '@/content/en.json'

const TECH_TAGS = ['Next.js', 'React', 'Tailwind', 'Vercel']
const EXPAND_CONTENT_ID = 'footer-expand-content'

const SOCIAL_ICONS: Record<string, React.ReactNode> = {
  LinkedIn: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
      <rect x="2" y="9" width="4" height="12" />
      <circle cx="4" cy="4" r="2" />
    </svg>
  ),
  GitHub: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22" />
    </svg>
  ),
  Instagram: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
    </svg>
  ),
  YouTube: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.4 19.1c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.25 29 29 0 0 0-.46-5.33z" />
      <polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02" />
    </svg>
  ),
  Twitch: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 2H3v16h5v4l4-4h5l4-4V2zm-10 9V7m5 4V7" />
    </svg>
  ),
}

const EASE = 'cubic-bezier(0.16,1,0.3,1)'
const EASE_OUT = 'cubic-bezier(0.22,0.31,0,1)'

function SecondaryFill({ active, radius = '12px', delay = 0 }: { active: boolean; radius?: string; delay?: number }) {
  return (
    <div
      className="absolute bg-bg-fill-outline-hover pointer-events-none"
      style={{
        inset: '0',
        borderRadius: radius,
        transform: active ? 'translateY(0)' : 'translateY(100%)',
        transition: active
          ? `transform 0.2s ${EASE} ${delay}s`
          : `transform 0.2s ${EASE} 0.04s`,
      }}
    />
  )
}

function SocialLink({ label, url }: { label: string; url: string }) {
  const [h, setIsHovered] = useState(false)

  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className="flex items-center gap-0.5 w-full"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onFocus={() => setIsHovered(true)}
      onBlur={() => setIsHovered(false)}
    >
      <div
        className="relative flex-1 inline-flex items-center justify-center h-12 border border-border-primary rounded-[12px] overflow-hidden"
        style={{ color: h ? 'var(--color-text-on-outline-hover)' : 'var(--color-text-secondary)', transition: 'color 0.15s' }}
      >
        <SecondaryFill active={h} />
        <span
          className="relative z-10 block text-sm font-medium overflow-hidden"
          style={{
            fontFamily: 'var(--font-sans)',
            transform: h ? 'translateY(-100%)' : 'translateY(0)',
            opacity: h ? 0 : 1,
            transition: h
              ? `transform 0.4s ${EASE} 0.05s, opacity 0.2s ${EASE} 0.05s`
              : `transform 1s ${EASE} 0.06s, opacity 0.3s ${EASE} 0.06s`,
          }}
        >
          {label}
        </span>
        <span
          className="absolute inset-0 z-10 flex items-center justify-center font-normal overflow-hidden"
          style={{
            fontFamily: "'Pexel Grotesk', var(--font-sans)",
            fontSize: '1.5rem',
            transform: h ? 'translateY(0)' : 'translateY(100%)',
            opacity: h ? 1 : 0,
            transition: h
              ? `transform 1s ${EASE} 0.1s, opacity 0.3s ${EASE} 0.1s`
              : `transform 1s ${EASE} 0.06s, opacity 0.3s ${EASE} 0.06s`,
          }}
        >
          {label}
        </span>
      </div>
      <div
        className="relative flex items-center justify-center size-12 shrink-0 border border-border-primary rounded-[12px] overflow-hidden"
        style={{ color: h ? 'var(--color-text-on-outline-hover)' : 'var(--color-text-secondary)', transition: 'color 0.15s' }}
      >
        <SecondaryFill active={h} delay={0.1} />
        <span
          className="relative z-10 block overflow-hidden"
          style={{
            transform: h ? 'translateY(-100%)' : 'translateY(0)',
            opacity: h ? 0 : 1,
            transition: h
              ? `transform 0.4s ${EASE} 0.15s, opacity 0.2s ${EASE} 0.15s`
              : `transform 1s ${EASE} 0.06s, opacity 0.3s ${EASE} 0.06s`,
          }}
        >
          {SOCIAL_ICONS[label] ?? '→'}
        </span>
        <span
          className="absolute inset-0 z-10 flex items-center justify-center overflow-hidden"
          style={{
            transform: h ? 'translateY(0)' : 'translateY(100%)',
            opacity: h ? 1 : 0,
            transition: h
              ? `transform 1s ${EASE} 0.2s, opacity 0.3s ${EASE} 0.2s`
              : `transform 1s ${EASE} 0.06s, opacity 0.3s ${EASE} 0.06s`,
          }}
        >
          {SOCIAL_ICONS[label] ?? '→'}
        </span>
      </div>
    </a>
  )
}

export function FooterSection() {
  const [isOpen, setIsOpen] = useState(false)      // mounted in DOM
  const [isExpanded, setIsExpanded] = useState(false) // triggers scale transition
  const [showContent, setShowContent] = useState(false)
  const [groupHovered, setGroupHovered] = useState(false)
  const footerRef = useRef<HTMLElement>(null)
  const hasAutoExpanded = useRef(false)
  const prefersReducedMotion = useRef(false)
  const sectionRef = useInView({ threshold: 0.1 })

  useEffect(() => {
    prefersReducedMotion.current = window.matchMedia(
      '(prefers-reduced-motion: reduce)'
    ).matches
  }, [])

  const reduced = prefersReducedMotion.current

  const openDrawer = useCallback(() => {
    setIsOpen(true)
    // Next frame: trigger scale transition (needs initial collapsed frame first)
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        setIsExpanded(true)
      })
    })
    // Stage 2: fade in content after card finishes expanding
    const delay = prefersReducedMotion.current ? 10 : 500
    setTimeout(() => setShowContent(true), delay)
  }, [])

  const closeDrawer = useCallback(() => {
    setShowContent(false)
    // After content fades, collapse card
    const fadeDelay = prefersReducedMotion.current ? 10 : 150
    setTimeout(() => setIsExpanded(false), fadeDelay)
    // After card collapses, unmount
    const totalDelay = prefersReducedMotion.current ? 20 : 600
    setTimeout(() => setIsOpen(false), totalDelay)
  }, [])

  const toggleDrawer = useCallback(() => {
    if (isOpen) closeDrawer()
    else openDrawer()
  }, [isOpen, openDrawer, closeDrawer])

  // open-contact event
  useEffect(() => {
    const handler = () => openDrawer()
    window.addEventListener('open-contact', handler)
    return () => window.removeEventListener('open-contact', handler)
  }, [openDrawer])

  // auto-expand on scroll to bottom
  useEffect(() => {
    const handleScroll = () => {
      if (hasAutoExpanded.current) return
      const atBottom = window.innerHeight + window.scrollY >= document.body.offsetHeight - 50
      if (atBottom) {
        hasAutoExpanded.current = true
        setTimeout(() => openDrawer(), 300)
      }
    }
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [openDrawer])

  // Escape key
  useEffect(() => {
    if (!isOpen) return
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeDrawer()
    }
    document.addEventListener('keydown', handleKey)
    return () => document.removeEventListener('keydown', handleKey)
  }, [isOpen, closeDrawer])

  // Body scroll lock
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => { document.body.style.overflow = '' }
  }, [isOpen])

  const ctaGroup = (
    <div
      className="flex items-center gap-0.5"
      onMouseEnter={() => setGroupHovered(true)}
      onMouseLeave={() => setGroupHovered(false)}
    >
      <button
        type="button"
        onClick={toggleDrawer}
        aria-expanded={isOpen}
        aria-controls={EXPAND_CONTENT_ID}
        className="relative inline-flex items-center justify-center h-12 rounded-full bg-bg-fill-primary text-text-on-primary px-8 overflow-hidden transition-colors duration-300 hover:bg-bg-fill-primary-hover"
      >
        <span
          className="block text-base font-medium"
          style={{
            fontFamily: 'var(--font-sans)',
            transform: groupHovered ? 'translateY(-100%)' : 'translateY(0)',
            opacity: groupHovered ? 0 : 1,
            transition: groupHovered
              ? `transform 1s ${EASE}, opacity 0.3s ${EASE}`
              : `transform 1s ${EASE} 0.06s, opacity 0.3s ${EASE} 0.06s`,
          }}
        >
          {isOpen ? 'Close' : 'Contact'}
        </span>
        <span
          className="absolute inset-0 flex items-center justify-center font-normal"
          style={{
            fontFamily: "'Pexel Grotesk', var(--font-sans)",
            fontSize: '1.5rem',
            transform: groupHovered ? 'translateY(0)' : 'translateY(100%)',
            opacity: groupHovered ? 1 : 0,
            transition: groupHovered
              ? `transform 1s ${EASE}, opacity 0.3s ${EASE}`
              : `transform 1s ${EASE} 0.06s, opacity 0.3s ${EASE} 0.06s`,
          }}
        >
          {isOpen ? 'Close' : 'Contact'}
        </span>
      </button>
      <button
        type="button"
        onClick={toggleDrawer}
        aria-label={isOpen ? 'Close contact form' : 'Open contact form'}
        aria-expanded={isOpen}
        aria-controls={EXPAND_CONTENT_ID}
        className="relative flex items-center justify-center size-12 rounded-[12px] bg-bg-fill-primary text-text-on-primary overflow-hidden transition-colors duration-300 hover:bg-bg-fill-primary-hover"
      >
        <span
          className="block text-lg"
          style={{
            fontFamily: 'var(--font-sans)',
            transform: groupHovered ? 'translateY(-100%)' : 'translateY(0)',
            opacity: groupHovered ? 0 : 1,
            transition: groupHovered
              ? `transform 1s ${EASE} 0.1s, opacity 0.3s ${EASE} 0.1s`
              : `transform 1s ${EASE}, opacity 0.3s ${EASE}`,
          }}
        >
          {isOpen ? '×' : '+'}
        </span>
        <span
          className="absolute inset-0 flex items-center justify-center"
          style={{
            fontFamily: "'Pexel Grotesk', var(--font-sans)",
            fontSize: '1.5rem',
            transform: groupHovered ? 'translateY(0)' : 'translateY(100%)',
            opacity: groupHovered ? 1 : 0,
            transition: groupHovered
              ? `transform 1s ${EASE} 0.1s, opacity 0.3s ${EASE} 0.1s`
              : `transform 1s ${EASE}, opacity 0.3s ${EASE}`,
          }}
        >
          {isOpen ? '×' : '+'}
        </span>
      </button>
    </div>
  )

  return (
    <>
      {/* Footer — always visible */}
      <footer
        ref={(node) => {
          footerRef.current = node
          if (sectionRef && 'current' in sectionRef) {
            (sectionRef as React.MutableRefObject<HTMLElement | null>).current = node
          }
        }}
        aria-label="Footer"
        data-section-id="footer"
        className="-entrance -slide-up -a-0 px-5 md:px-8 lg:px-16 pt-[400px] pb-8"
      >
        <div className="flex items-center gap-4">
          {/* Left half: tags + copyright */}
          <div className="w-1/2 flex items-center gap-3 flex-wrap">
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

          {/* Right half: CTA — always in place, z-[60] stays above overlay */}
          <div className="w-1/2 relative z-[60]">
            {ctaGroup}
          </div>
        </div>
      </footer>

      {/* Overlay — fixed, anchored to bottom, card scales up from button position */}
      {isOpen && (
        <div
          className="fixed inset-0 z-50 flex flex-col justify-end"
          role="dialog"
          aria-modal="true"
          aria-label="Contact"
          id={EXPAND_CONTENT_ID}
        >
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/60"
            style={{
              opacity: isExpanded ? 1 : 0,
              transition: reduced ? 'none' : `opacity 0.5s ${EASE_OUT}`,
            }}
            onClick={closeDrawer}
          />

          {/* Panel — same px as footer, pinned to bottom */}
          <div className="relative z-10 px-5 md:px-8 lg:px-16 pb-8 pt-8">
            <div className="flex items-end gap-4 md:gap-5">
              {/* Left: social links — fade in after card */}
              <div
                className="hidden md:flex flex-col gap-1 w-1/4 pb-16"
                style={{
                  opacity: showContent ? 1 : 0,
                  transition: reduced ? 'none' : `opacity 0.3s ${EASE} 0.15s`,
                  pointerEvents: showContent ? 'auto' : 'none',
                }}
              >
                {content.contact.links.map((link) => (
                  <SocialLink key={link.label} label={link.label} url={link.url} />
                ))}
              </div>

              {/* Right: grey card — scales from bottom-left (button anchor) */}
              <div
                className="w-full md:w-1/2 ml-auto bg-bg-surface-tertiary rounded-[12px] overflow-hidden"
                data-theme="light"
                style={{
                  transformOrigin: 'bottom left',
                  transform: isExpanded ? 'scale(1)' : 'scale(0.3, 0.05)',
                  opacity: isExpanded ? 1 : 0,
                  transition: reduced
                    ? 'none'
                    : isExpanded
                      ? `transform 0.6s ${EASE_OUT} 0.04s, opacity 0.2s ${EASE_OUT} 0.04s`
                      : `transform 0.5s ${EASE} 0.06s, opacity 0.3s ${EASE} 0.06s`,
                }}
              >
                {/* Content — fades in after card expand */}
                <div
                  className="p-4 md:p-6 flex flex-col gap-2"
                  style={{
                    opacity: showContent ? 1 : 0,
                    transition: reduced ? 'none' : `opacity 0.3s ${EASE}`,
                    pointerEvents: showContent ? 'auto' : 'none',
                  }}
                >
                  <ContactForm actionSlot={ctaGroup} />

                  {/* Mobile social links */}
                  <div className="flex md:hidden flex-col gap-1 mt-2" data-theme="">
                    {content.contact.links.map((link) => (
                      <SocialLink key={link.label} label={link.label} url={link.url} />
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
