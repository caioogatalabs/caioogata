'use client'

import { useEffect, useRef, useState } from 'react'

const EASE = 'cubic-bezier(0.16,1,0.3,1)'
const EASE_OUT = 'cubic-bezier(0.22,0.31,0,1)'

/**
 * FloatingContactButton — surfaces only when the StickyLogoBar's `ask about`
 * CTA (marked `data-share-with-ai`) leaves the viewport. Click dispatches
 * `open-contact` to open ContactOverlay.
 */
export function FloatingContactButton() {
  const [visible, setVisible] = useState(false)
  const [groupHovered, setGroupHovered] = useState(false)
  const prefersReducedMotion = useRef(false)

  useEffect(() => {
    prefersReducedMotion.current = window.matchMedia(
      '(prefers-reduced-motion: reduce)'
    ).matches
  }, [])

  const reduced = prefersReducedMotion.current

  useEffect(() => {
    const target = document.querySelector('[data-share-with-ai]')
    if (!target) return
    const obs = new IntersectionObserver(
      ([entry]) => {
        // Visible iff the target is NOT intersecting (out of viewport)
        setVisible(!entry.isIntersecting)
      },
      { threshold: 0, rootMargin: '0px 0px -10% 0px' }
    )
    obs.observe(target)
    return () => obs.disconnect()
  }, [])

  const open = () => {
    window.dispatchEvent(new CustomEvent('open-contact'))
  }

  const t = `1s ${EASE}`
  const tFast = `0.3s ${EASE}`

  return (
    <div
      className="fixed bottom-4 right-4 lg:bottom-6 lg:right-6 z-[70] flex items-center gap-0.5"
      style={{
        transform: visible ? 'translateY(0)' : 'translateY(120%)',
        opacity: visible ? 1 : 0,
        pointerEvents: visible ? 'auto' : 'none',
        transition: reduced
          ? 'none'
          : `transform 0.5s ${EASE_OUT}, opacity 0.3s ${EASE}`,
      }}
      onMouseEnter={() => setGroupHovered(true)}
      onMouseLeave={() => setGroupHovered(false)}
    >
      <button
        type="button"
        onClick={open}
        aria-label="Open contact form"
        className="relative inline-flex items-center justify-center h-12 rounded-full bg-bg-fill-primary text-text-on-primary px-8 overflow-hidden transition-colors duration-300 hover:bg-bg-fill-primary-hover"
      >
        <span className="invisible text-base font-medium" style={{ fontFamily: 'var(--font-sans)' }} aria-hidden="true">
          Contact
        </span>
        <span
          className="absolute inset-0 flex items-center justify-center text-base font-medium"
          style={{
            fontFamily: 'var(--font-sans)',
            transform: groupHovered ? 'translateY(-100%)' : 'translateY(0)',
            opacity: groupHovered ? 0 : 1,
            transition: `transform ${t}, opacity ${tFast}`,
          }}
        >
          Contact
        </span>
        <span
          className="absolute inset-0 flex items-center justify-center type-overlay-hover"
          style={{
            transform: groupHovered ? 'translateY(0)' : 'translateY(100%)',
            opacity: groupHovered ? 1 : 0,
            transition: `transform ${t}, opacity ${tFast}`,
          }}
        >
          Contact
        </span>
      </button>
      <button
        type="button"
        onClick={open}
        aria-label="Open contact form"
        className="relative flex items-center justify-center size-12 rounded-[12px] bg-bg-fill-primary text-text-on-primary overflow-hidden transition-colors duration-300 hover:bg-bg-fill-primary-hover"
      >
        <span className="invisible text-lg" style={{ fontFamily: 'var(--font-sans)' }} aria-hidden="true">+</span>
        <span
          className="absolute inset-0 flex items-center justify-center text-lg"
          style={{
            fontFamily: 'var(--font-sans)',
            transform: groupHovered ? 'translateY(-100%)' : 'translateY(0)',
            opacity: groupHovered ? 0 : 1,
            transition: `transform ${t} 0.1s, opacity ${tFast} 0.1s`,
          }}
        >
          +
        </span>
        <span
          className="absolute inset-0 flex items-center justify-center type-overlay-hover"
          style={{
            transform: groupHovered ? 'translateY(0)' : 'translateY(100%)',
            opacity: groupHovered ? 1 : 0,
            transition: `transform ${t} 0.1s, opacity ${tFast} 0.1s`,
          }}
        >
          +
        </span>
      </button>
    </div>
  )
}
