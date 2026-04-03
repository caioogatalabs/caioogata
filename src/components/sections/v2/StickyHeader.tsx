'use client'

import { useState, useEffect, useRef } from 'react'

export function StickyHeader() {
  const [visible, setVisible] = useState(false)
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

        {/* Right side */}
        <div className="flex items-center gap-3">
          <span className="hidden lg:inline text-sm font-medium uppercase tracking-[0.08em] text-text-secondary font-mono">
            V2.0.01
          </span>
          <span className="hidden lg:inline text-sm font-medium text-text-secondary">
            Built for human and AI assistance
          </span>
          <a
            href="/llms.txt"
            className="inline-flex items-center justify-center rounded-full bg-bg-fill-primary text-text-on-primary px-4 py-1.5 text-xs font-medium transition-colors duration-300 hover:bg-bg-fill-primary-hover"
            style={{ borderRadius: '999px' }}
            tabIndex={visible ? 0 : -1}
          >
            Ask about
          </a>
        </div>
      </div>
    </header>
  )
}
