'use client'

import { useState, useEffect, useRef } from 'react'

export function StickyHeader() {
  const [visible, setVisible] = useState(false)
  const [btnHovered, setBtnHovered] = useState(false)
  const prefersReducedMotion = useRef(false)

  useEffect(() => {
    // Check reduced motion preference
    prefersReducedMotion.current = window.matchMedia(
      '(prefers-reduced-motion: reduce)'
    ).matches

    const handleScroll = () => {
      const threshold = window.innerHeight * 0.6
      setVisible(window.scrollY > threshold)
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    handleScroll() // Check initial position

    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const transitionClasses = prefersReducedMotion.current
    ? ''
    : 'transition-opacity duration-300'

  return (
    <header
      role="banner"
      aria-hidden={!visible}
      className={`sticky top-0 z-50 h-14 ${transitionClasses}`}
      style={{
        opacity: visible ? 1 : 0,
        pointerEvents: visible ? 'auto' : 'none',
        background: 'oklch(0.15 0 0 / 0.6)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        ...(prefersReducedMotion.current ? { transition: 'none' } : {}),
      }}
    >
      <div className="flex h-full items-center justify-between px-5 md:px-8 lg:px-16">
        {/* Logo */}
        <span
          className="text-xl font-bold text-text-primary"
          style={{ fontFamily: 'var(--font-sans)' }}
        >
          CO
        </span>

        {/* CTA */}
        <div
          className="flex items-center gap-0.5"
          onMouseEnter={() => setBtnHovered(true)}
          onMouseLeave={() => setBtnHovered(false)}
        >
          <a
            href="/llms.txt"
            className="relative inline-flex items-center justify-center h-8 rounded-full bg-bg-fill-primary text-text-on-primary px-5 overflow-hidden transition-colors duration-300 hover:bg-bg-fill-primary-hover"
            tabIndex={visible ? 0 : -1}
          >
            <span
              className="block text-xs font-medium"
              style={{
                fontFamily: 'var(--font-sans)',
                transform: btnHovered ? 'translateY(-100%)' : 'translateY(0)',
                opacity: btnHovered ? 0 : 1,
                transition: btnHovered
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
                fontSize: '0.875rem',
                transform: btnHovered ? 'translateY(0)' : 'translateY(100%)',
                opacity: btnHovered ? 1 : 0,
                transition: btnHovered
                  ? 'transform 1s cubic-bezier(0.16,1,0.3,1), opacity 0.3s cubic-bezier(0.16,1,0.3,1)'
                  : 'transform 1s cubic-bezier(0.16,1,0.3,1) 0.06s, opacity 0.3s cubic-bezier(0.16,1,0.3,1) 0.06s',
              }}
            >
              ask about
            </span>
          </a>
          <button
            type="button"
            className="relative flex items-center justify-center size-8 rounded-[8px] bg-bg-fill-primary text-text-on-primary overflow-hidden transition-colors duration-300 hover:bg-bg-fill-primary-hover"
            aria-label="Close"
            tabIndex={visible ? 0 : -1}
          >
            <span
              className="block text-sm"
              style={{
                fontFamily: 'var(--font-sans)',
                transform: btnHovered ? 'translateY(-100%)' : 'translateY(0)',
                opacity: btnHovered ? 0 : 1,
                transition: btnHovered
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
                fontSize: '0.875rem',
                transform: btnHovered ? 'translateY(0)' : 'translateY(100%)',
                opacity: btnHovered ? 1 : 0,
                transition: btnHovered
                  ? 'transform 1s cubic-bezier(0.16,1,0.3,1) 0.1s, opacity 0.3s cubic-bezier(0.16,1,0.3,1) 0.1s'
                  : 'transform 1s cubic-bezier(0.16,1,0.3,1), opacity 0.3s cubic-bezier(0.16,1,0.3,1)',
              }}
            >
              ×
            </span>
          </button>
        </div>
      </div>
    </header>
  )
}
