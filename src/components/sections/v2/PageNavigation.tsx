'use client'

/**
 * PageNavigation — unified sticky nav strip for V2 pages.
 *
 * Visual: keyboard-keycap pattern (matches the bottom legend in MenuSection).
 * Each [Esc] / [←] / [→] is a small KeyBadge keycap, clickable for mouse users
 * AND triggered by the matching keyboard shortcut.
 *
 * Keyboard: ←/→ lateral, Esc home (or back.href when provided).
 *
 * TODO: review keyboard navigation flow including Enter (descend into selected
 * item) when /projects becomes a real index page and category pages need
 * 'enter' semantics. Currently 'Enter' is unhandled here.
 */

import { useEffect } from 'react'
import { useRouter, usePathname } from 'next/navigation'

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

const KEYBADGE_BASE =
  'inline-flex items-center justify-center bg-bg-surface-primary text-text-primary text-[11px] font-medium font-mono px-[5px] py-[2px] rounded-[3px] leading-none'

function KeyBadge({
  children,
  onClick,
  disabled,
  ariaLabel,
}: {
  children: React.ReactNode
  onClick?: () => void
  disabled?: boolean
  ariaLabel?: string
}) {
  if (onClick && !disabled) {
    return (
      <button
        type="button"
        onClick={onClick}
        aria-label={ariaLabel}
        className={`${KEYBADGE_BASE} hover:opacity-80 cursor-pointer transition-opacity duration-200`}
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

  const prev = lateral && lateral.currentIndex > 0
    ? lateral.items[lateral.currentIndex - 1]
    : null
  const next = lateral && lateral.currentIndex < lateral.items.length - 1
    ? lateral.items[lateral.currentIndex + 1]
    : null

  // Show Esc hint on any non-home page, or whenever an explicit back override is given.
  // On '/', leave Escape free for MenuSection's own filter-clear handler.
  const showEsc = pathname !== '/' || !!back

  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      const target = e.target as HTMLElement | null
      if (!target) return
      const tag = target.tagName
      if (tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT') return
      if (target.isContentEditable) return

      if (e.key === 'ArrowLeft' && prev) {
        e.preventDefault()
        router.push(prev.href)
      } else if (e.key === 'ArrowRight' && next) {
        e.preventDefault()
        router.push(next.href)
      } else if (e.key === 'Escape' && showEsc) {
        e.preventDefault()
        router.push(back?.href ?? '/')
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [prev, next, back, router, showEsc])

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
                onClick={() => router.push(back?.href ?? '/')}
                ariaLabel={back?.label ?? 'Back to home'}
              >
                Esc
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
              ariaLabel={prev ? `Previous: ${prev.title}` : 'Previous (disabled)'}
            >
              ←
            </KeyBadge>
            <KeyBadge
              onClick={next ? () => router.push(next.href) : undefined}
              disabled={!next}
              ariaLabel={next ? `Next: ${next.title}` : 'Next (disabled)'}
            >
              →
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
