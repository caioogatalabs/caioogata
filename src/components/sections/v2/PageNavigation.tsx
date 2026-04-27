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
 * TODO: review keyboard navigation flow including Enter (descend into selected
 * item) when /projects becomes a real index page and category pages need
 * 'enter' semantics. Currently 'Enter' is unhandled here.
 */

import { useEffect, useState } from 'react'
import { useRouter, usePathname } from 'next/navigation'
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

function KeyBadge({
  children,
  onClick,
  disabled,
  ariaLabel,
  isActive,
}: {
  children: React.ReactNode
  onClick?: () => void
  disabled?: boolean
  ariaLabel?: string
  isActive?: boolean
}) {
  if (onClick && !disabled) {
    const activeClass = isActive ? 'bg-bg-fill-primary text-text-on-primary' : ''
    return (
      <button
        type="button"
        onClick={onClick}
        aria-label={ariaLabel}
        className={`${KEYBADGE_BASE} ${activeClass} hover:opacity-80 cursor-pointer transition-colors duration-200`}
      >
        {children}
      </button>
    )
  }
  return (
    <span
      aria-disabled={disabled || undefined}
      className={`${KEYBADGE_BASE} ${disabled ? 'opacity-30' : ''}`}
    >
      {children}
    </span>
  )
}

export function PageNavigation({ back, lateral }: PageNavigationProps) {
  const router = useRouter()
  const pathname = usePathname()
  const { mode } = useInteractionMode()
  const [activeKey, setActiveKey] = useState<'esc' | 'left' | 'right' | null>(null)

  const prev = lateral && lateral.currentIndex > 0
    ? lateral.items[lateral.currentIndex - 1]
    : null
  const next = lateral && lateral.currentIndex < lateral.items.length - 1
    ? lateral.items[lateral.currentIndex + 1]
    : null

  // Show Esc hint on any non-home page, or whenever an explicit back override is given.
  // On '/', leave Escape free for MenuSection's own filter-clear handler.
  const showEsc = pathname !== '/' || !!back

  // Stabilize listener deps with primitive-derived values so parent re-renders
  // (object literal `back={{ ... }}` recreated each render) don't thrash the
  // keydown listener registration. Without this, HMR fast-refresh on project
  // pages can unmount the listener mid-keypress and the Escape navigation
  // silently fails.
  const prevHref = prev?.href
  const nextHref = next?.href
  const backHref = back?.href ?? '/'

  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      const target = e.target as HTMLElement | null
      if (!target) return
      const tag = target.tagName
      if (tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT') return
      if (target.isContentEditable) return

      if (e.key === 'ArrowLeft' && prevHref) {
        e.preventDefault()
        setActiveKey('left')
        router.push(prevHref)
      } else if (e.key === 'ArrowRight' && nextHref) {
        e.preventDefault()
        setActiveKey('right')
        router.push(nextHref)
      } else if (e.key === 'Escape' && showEsc) {
        e.preventDefault()
        setActiveKey('esc')
        router.push(backHref)
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
  }, [prevHref, nextHref, backHref, showEsc, router])

  // Adaptive Esc keycap: arrow icon for mouse/touch, literal "Esc" text for keyboard.
  const showBackAsArrow = mode === 'mouse' || mode === 'touch'

  return (
    <nav
      aria-label="Page navigation"
      className="sticky top-0 z-40 bg-bg backdrop-blur-xl border-t border-border-secondary px-5 md:px-8 lg:px-16 py-3"
    >
      <div className="flex items-center gap-3">
        {showEsc && (
          <>
            <div className="flex items-center gap-1.5">
              <KeyBadge
                onClick={() => router.push(backHref)}
                isActive={activeKey === 'esc'}
                ariaLabel={back?.label ?? 'Back to home'}
              >
                {showBackAsArrow ? <ArrowLeftIcon /> : 'Esc'}
              </KeyBadge>
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
            <KeyBadge
              onClick={prev ? () => router.push(prev.href) : undefined}
              disabled={!prev}
              isActive={activeKey === 'left'}
              ariaLabel={prev ? `Previous: ${prev.title}` : 'Previous (disabled)'}
            >
              <ArrowLeftIcon />
            </KeyBadge>
            <KeyBadge
              onClick={next ? () => router.push(next.href) : undefined}
              disabled={!next}
              isActive={activeKey === 'right'}
              ariaLabel={next ? `Next: ${next.title}` : 'Next (disabled)'}
            >
              <ArrowRightIcon />
            </KeyBadge>
            <span className="text-xs text-text-tertiary ml-0.5">
              to navigate {lateral.scope}
            </span>
          </div>
        )}
      </div>
    </nav>
  )
}
