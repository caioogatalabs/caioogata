'use client'

import { useEffect, useRef, useState } from 'react'

const EASE = 'cubic-bezier(0.16,1,0.3,1)'
const EASE_OUT = 'cubic-bezier(0.22,0.31,0,1)'

/**
 * FloatingContactButton — single morphing trigger that doubles as the contact
 * overlay's open AND close action.
 *
 * Visibility: surfaces only after the StickyLogoBar's `ask about` CTA
 * (marked `data-share-with-ai`) leaves the viewport. Once visible, it stays
 * fixed at bottom-right.
 *
 * State: tracks the overlay's open/closed state by listening to the
 * `open-contact` / `close-contact` events. Click toggles by dispatching the
 * opposite event.
 *
 * Visual: when CLOSED, shows yellow `Contact` pill + `+` square (legible on
 * the dark page background). When OPEN, swaps to a dark `Close` pill + `×`
 * square (legible on the yellow overlay surface that sits below it). The
 * wrapper position never moves — same `bottom-right` anchor in both states.
 */
export function FloatingContactButton() {
  const [visible, setVisible] = useState(false)
  const [isOpen, setIsOpen] = useState(false)
  const [groupHovered, setGroupHovered] = useState(false)
  const prefersReducedMotion = useRef(false)

  useEffect(() => {
    prefersReducedMotion.current = window.matchMedia(
      '(prefers-reduced-motion: reduce)'
    ).matches
  }, [])

  const reduced = prefersReducedMotion.current

  // Sync with overlay state via window events
  useEffect(() => {
    const onOpen = () => setIsOpen(true)
    const onClose = () => setIsOpen(false)
    window.addEventListener('open-contact', onOpen)
    window.addEventListener('close-contact', onClose)
    return () => {
      window.removeEventListener('open-contact', onOpen)
      window.removeEventListener('close-contact', onClose)
    }
  }, [])

  // Visibility — IntersectionObserver on the `ask about` CTA
  useEffect(() => {
    const target = document.querySelector('[data-share-with-ai]')
    if (!target) {
      // No `ask about` on this page — keep FAB visible by default
      setVisible(true)
      return
    }
    const obs = new IntersectionObserver(
      ([entry]) => {
        setVisible(!entry.isIntersecting)
      },
      { threshold: 0, rootMargin: '0px 0px -10% 0px' }
    )
    obs.observe(target)
    return () => obs.disconnect()
  }, [])

  const toggle = () => {
    window.dispatchEvent(new CustomEvent(isOpen ? 'close-contact' : 'open-contact'))
  }

  const t = `1s ${EASE}`
  const tFast = `0.3s ${EASE}`

  // Color classes — swap based on isOpen so the button contrasts against
  // whichever background sits behind it.
  // Closed: yellow fill on dark page → `bg-bg-fill-primary text-text-on-primary`
  // Open:   dark fill on yellow overlay → `bg-bg text-bg-fill-primary`
  const colorPill = isOpen
    ? 'bg-bg text-bg-fill-primary'
    : 'bg-bg-fill-primary text-text-on-primary hover:bg-bg-fill-primary-hover'
  const colorSquare = isOpen
    ? 'bg-bg text-bg-fill-primary'
    : 'bg-bg-fill-primary text-text-on-primary hover:bg-bg-fill-primary-hover'

  const pillLabel = isOpen ? 'Close' : 'Contact'
  const squareLabel = isOpen ? '×' : '+'
  const ariaLabel = isOpen ? 'Close contact form' : 'Open contact form'

  return (
    <div
      className="fixed bottom-5 right-5 md:bottom-8 md:right-8 lg:bottom-16 lg:right-16 z-[90] flex items-center gap-0.5"
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
      {/* Pill button — Contact / Close */}
      <button
        type="button"
        onClick={toggle}
        aria-label={ariaLabel}
        aria-expanded={isOpen}
        className={`relative inline-flex items-center justify-center h-12 rounded-full px-8 overflow-hidden transition-colors duration-300 ${colorPill}`}
      >
        <span className="invisible text-base font-medium" style={{ fontFamily: 'var(--font-sans)' }} aria-hidden="true">
          {pillLabel === 'Close' ? 'Contact' : pillLabel}
        </span>
        <span
          key={`pill-${pillLabel}`}
          className="absolute inset-0 flex items-center justify-center text-base font-medium"
          style={{
            fontFamily: 'var(--font-sans)',
            transform: groupHovered ? 'translateY(-100%)' : 'translateY(0)',
            opacity: groupHovered ? 0 : 1,
            transition: `transform ${t}, opacity ${tFast}`,
          }}
        >
          {pillLabel}
        </span>
        <span
          className="absolute inset-0 flex items-center justify-center type-overlay-hover"
          style={{
            transform: groupHovered ? 'translateY(0)' : 'translateY(100%)',
            opacity: groupHovered ? 1 : 0,
            transition: `transform ${t}, opacity ${tFast}`,
          }}
        >
          {pillLabel}
        </span>
      </button>

      {/* Square button — + / × */}
      <button
        type="button"
        onClick={toggle}
        aria-label={ariaLabel}
        aria-expanded={isOpen}
        className={`relative flex items-center justify-center size-12 rounded-[12px] overflow-hidden transition-colors duration-300 ${colorSquare}`}
      >
        <span className="invisible text-lg" style={{ fontFamily: 'var(--font-sans)' }} aria-hidden="true">+</span>
        <span
          key={`sq-${squareLabel}`}
          className="absolute inset-0 flex items-center justify-center text-lg"
          style={{
            fontFamily: 'var(--font-sans)',
            transform: groupHovered ? 'translateY(-100%)' : 'translateY(0)',
            opacity: groupHovered ? 0 : 1,
            transition: `transform ${t} 0.1s, opacity ${tFast} 0.1s`,
          }}
        >
          {squareLabel}
        </span>
        <span
          className="absolute inset-0 flex items-center justify-center type-overlay-hover"
          style={{
            transform: groupHovered ? 'translateY(0)' : 'translateY(100%)',
            opacity: groupHovered ? 1 : 0,
            transition: `transform ${t} 0.1s, opacity ${tFast} 0.1s`,
          }}
        >
          {squareLabel}
        </span>
      </button>
    </div>
  )
}
