'use client'

/**
 * PageNavigation — unified sticky nav strip for V2 pages.
 *
 * Visual: all controls left-aligned, mono small (matches home menu typography).
 * Keyboard: ←/→ lateral, Esc home (or back.href when provided).
 *
 * TODO: review keyboard navigation flow including Enter (descend into selected
 * item) when /projects becomes a real index page and category pages need
 * 'enter' semantics. Currently 'Enter' is unhandled here.
 */

import { useEffect } from 'react'
import Link from 'next/link'
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

export function PageNavigation({ back, lateral }: PageNavigationProps) {
  const router = useRouter()
  const pathname = usePathname()

  const prev = lateral && lateral.currentIndex > 0
    ? lateral.items[lateral.currentIndex - 1]
    : null
  const next = lateral && lateral.currentIndex < lateral.items.length - 1
    ? lateral.items[lateral.currentIndex + 1]
    : null

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
      } else if (e.key === 'Escape') {
        if (back) {
          e.preventDefault()
          router.push(back.href)
        } else if (pathname !== '/') {
          e.preventDefault()
          router.push('/')
        }
        // else: on '/' with no back → do nothing (allow MenuSection's Escape to handle filter clear)
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [prev, next, back, router, pathname])

  const baseLink =
    'font-mono text-xs uppercase tracking-[1.12px] text-text-tertiary hover:text-text-primary transition-colors duration-300'
  const disabledLink = 'opacity-30 pointer-events-none'

  return (
    <nav
      aria-label="Page navigation"
      className="sticky top-0 z-40 bg-bg backdrop-blur-xl border-t border-border-secondary px-5 md:px-8 lg:px-16 py-5"
    >
      <div className="flex items-center gap-8 font-mono text-xs uppercase tracking-[1.12px] text-text-tertiary">
        {back && (
          <Link href={back.href} className={baseLink}>
            <span aria-hidden="true">← </span>{back.label}
          </Link>
        )}

        {lateral && (
          <>
            {prev ? (
              <Link href={prev.href} className={baseLink}>
                <span aria-hidden="true">← </span>{prev.title}
              </Link>
            ) : (
              <span className={`${baseLink} ${disabledLink}`} aria-disabled="true" tabIndex={-1}>
                <span aria-hidden="true">← </span>{lateral.items[0]?.title ?? ''}
              </span>
            )}

            {next ? (
              <Link href={next.href} className={baseLink}>
                {next.title}<span aria-hidden="true"> →</span>
              </Link>
            ) : (
              <span className={`${baseLink} ${disabledLink}`} aria-disabled="true" tabIndex={-1}>
                {lateral.items[lateral.items.length - 1]?.title ?? ''}<span aria-hidden="true"> →</span>
              </span>
            )}

            <span className="opacity-60">to navigate {lateral.scope}</span>
          </>
        )}
      </div>
    </nav>
  )
}
