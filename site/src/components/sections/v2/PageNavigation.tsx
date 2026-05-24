'use client'

/**
 * PageNavigation — unified sticky nav strip for V2 pages.
 *
 * Visual: keyboard-keycap pattern (matches the bottom legend in MenuSection).
 * Adaptive: in mouse/touch mode the Esc keycap swaps to an arrow icon (V1
 * NavigationBar parity). Lateral arrows always render as SVG icons.
 *
 * Keyboard: ←/→ lateral, Esc home (or back.href when provided). Active key
 * gets a yellow flash via `activeKey` state, matching the V1 feedback.
 *
 * Navigation is delegated to <Link> components — keyboard handlers dispatch
 * a click on the corresponding Link via ref so SPA soft-nav stays consistent
 * with the click path. (next/navigation's `router.push` was unreliable in
 * this setup; clicking <Link> programmatically is the robust path.)
 *
 * TODO: review keyboard navigation flow including Enter (descend into selected
 * item) when /projects becomes a real index page and category pages need
 * 'enter' semantics. Currently 'Enter' is unhandled here.
 */

import { useEffect, useRef, useState } from 'react'
import { usePathname } from 'next/navigation'
import { useInteractionMode } from '@/hooks/useInteractionMode'

export interface PageNavigationLateralItem {
  href: string
  title: string
}

export interface PageNavigationProps {
  back?: { href: string; label: string }
  lateral?: {
    items: PageNavigationLateralItem[]
    currentIndex: number
    scope: string  // 'categories' | 'projects'
  }
  /**
   * Render up/down/enter hints for in-page item navigation. Visual-only —
   * keyboard handling lives in the consumer's own hook (e.g. useExperienceNavigation).
   * `enterLabel` defaults to "to expand" but can be overridden ("to select", etc).
   */
  items?: {
    label?: string  // e.g. "to navigate" — defaults to "to navigate"
    enterLabel?: string  // e.g. "to expand" — defaults to "to expand"
  }
  /**
   * When false, the nav renders inline (no sticky positioning, no backdrop blur).
   * Used for the bottom navbar on Experience. Defaults to true (sticky top).
   */
  sticky?: boolean
}

function ArrowLeftIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden>
      <path d="M9 6H3M3 6L6 3M3 6L6 9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function ArrowRightIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden>
      <path d="M3 6H9M9 6L6 3M9 6L6 9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

const KEYBADGE_BASE =
  'inline-flex items-center justify-center bg-bg-surface-primary text-text-primary text-[11px] font-medium font-mono px-[5px] py-[2px] rounded-[3px] leading-none'

function KeyBadgeLink({
  href,
  ariaLabel,
  isActive,
  forwardRef,
  children,
}: {
  href: string
  ariaLabel: string
  isActive?: boolean
  forwardRef: React.RefObject<HTMLAnchorElement | null>
  children: React.ReactNode
}) {
  // Native <a> instead of next/link Link — Link's programmatic .click() (used by
  // the keyboard handler) doesn't reliably trigger SPA navigation in this setup,
  // so all PageNavigation links use native anchors (hard reload). The trade-off
  // is acceptable: pages are mostly static and React state doesn't need to persist
  // across these transitions.
  const activeClass = isActive ? 'bg-bg-fill-primary text-text-on-primary' : ''
  return (
    <a
      href={href}
      ref={forwardRef}
      aria-label={ariaLabel}
      className={`${KEYBADGE_BASE} ${activeClass} hover:opacity-80 cursor-pointer transition-colors duration-200`}
    >
      {children}
    </a>
  )
}

function KeyBadgeDisabled({
  ariaLabel,
  children,
}: {
  ariaLabel: string
  children: React.ReactNode
}) {
  return (
    <span
      aria-label={ariaLabel}
      aria-disabled="true"
      className={`${KEYBADGE_BASE} opacity-30`}
    >
      {children}
    </span>
  )
}

export function PageNavigation({ back, lateral, items, sticky = true }: PageNavigationProps) {
  const pathname = usePathname()
  const { mode } = useInteractionMode()
  const [activeKey, setActiveKey] = useState<'esc' | 'left' | 'right' | null>(null)

  const escLinkRef = useRef<HTMLAnchorElement | null>(null)
  const prevLinkRef = useRef<HTMLAnchorElement | null>(null)
  const nextLinkRef = useRef<HTMLAnchorElement | null>(null)

  const prev = lateral && lateral.currentIndex > 0
    ? lateral.items[lateral.currentIndex - 1]
    : null
  const next = lateral && lateral.currentIndex < lateral.items.length - 1
    ? lateral.items[lateral.currentIndex + 1]
    : null

  // Show Esc hint on any non-home page, or whenever an explicit back override is given.
  // On '/', leave Escape free for MenuSection's own filter-clear handler.
  const showEsc = pathname !== '/' || !!back
  const backHref = back?.href ?? '/'

  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      const target = e.target as HTMLElement | null
      if (!target) return
      const tag = target.tagName
      if (tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT') return
      if (target.isContentEditable) return

      if (e.key === 'ArrowLeft' && prevLinkRef.current) {
        e.preventDefault()
        setActiveKey('left')
        prevLinkRef.current.click()
      } else if (e.key === 'ArrowRight' && nextLinkRef.current) {
        e.preventDefault()
        setActiveKey('right')
        nextLinkRef.current.click()
      } else if (e.key === 'Escape' && showEsc && escLinkRef.current) {
        e.preventDefault()
        setActiveKey('esc')
        escLinkRef.current.click()
      }
    }

    function handleKeyUp() {
      setActiveKey(null)
    }

    window.addEventListener('keydown', handleKeyDown)
    window.addEventListener('keyup', handleKeyUp)
    return () => {
      window.removeEventListener('keydown', handleKeyDown)
      window.removeEventListener('keyup', handleKeyUp)
    }
  }, [showEsc])

  // Adaptive Esc keycap: arrow icon for mouse/touch, literal "Esc" text for keyboard.
  const showBackAsArrow = mode === 'mouse' || mode === 'touch'

  const navClassName = sticky
    ? 'sticky top-0 z-40 bg-bg backdrop-blur-xl border-t border-border-secondary px-5 md:px-8 lg:px-16 py-3'
    : 'bg-bg border-t border-border-secondary px-5 md:px-8 lg:px-16 py-3'

  return (
    <nav
      aria-label="Page navigation"
      className={navClassName}
    >
      <div className="flex items-center gap-3 flex-wrap">
        {showEsc && (
          <>
            <div className="flex items-center gap-1.5">
              <KeyBadgeLink
                href={backHref}
                forwardRef={escLinkRef}
                isActive={activeKey === 'esc'}
                ariaLabel={back?.label ?? 'Back to home'}
              >
                {showBackAsArrow ? <ArrowLeftIcon /> : 'Esc'}
              </KeyBadgeLink>
              <span className="text-xs text-text-tertiary">
                {back?.label ?? 'back to home'}
              </span>
            </div>
            {lateral && (
              <span className="text-xs text-text-tertiary opacity-40">·</span>
            )}
          </>
        )}

        {lateral && (
          <div className="flex items-center gap-1">
            {prev ? (
              <KeyBadgeLink
                href={prev.href}
                forwardRef={prevLinkRef}
                isActive={activeKey === 'left'}
                ariaLabel={`Previous: ${prev.title}`}
              >
                <ArrowLeftIcon />
              </KeyBadgeLink>
            ) : (
              <KeyBadgeDisabled ariaLabel="Previous (disabled)">
                <ArrowLeftIcon />
              </KeyBadgeDisabled>
            )}
            {next ? (
              <KeyBadgeLink
                href={next.href}
                forwardRef={nextLinkRef}
                isActive={activeKey === 'right'}
                ariaLabel={`Next: ${next.title}`}
              >
                <ArrowRightIcon />
              </KeyBadgeLink>
            ) : (
              <KeyBadgeDisabled ariaLabel="Next (disabled)">
                <ArrowRightIcon />
              </KeyBadgeDisabled>
            )}
            <span className="text-xs text-text-tertiary ml-0.5">
              to navigate {lateral.scope}
            </span>
          </div>
        )}

        {items && (
          <>
            {(showEsc || lateral) && (
              <span className="text-xs text-text-tertiary opacity-40">·</span>
            )}
            {/* Up/Down — visual only; keyboard handled by useExperienceNavigation. */}
            <div className="flex items-center gap-1">
              <span className={KEYBADGE_BASE} aria-label="Up">↑</span>
              <span className={KEYBADGE_BASE} aria-label="Down">↓</span>
              <span className="text-xs text-text-tertiary ml-0.5">
                {items.label ?? 'to navigate'}
              </span>
            </div>
            <span className="text-xs text-text-tertiary opacity-40">·</span>
            <div className="flex items-center gap-1.5">
              <span className={KEYBADGE_BASE} aria-label="Enter">Enter</span>
              <span className="text-xs text-text-tertiary">
                {items.enterLabel ?? 'to expand'}
              </span>
            </div>
          </>
        )}
      </div>
    </nav>
  )
}
