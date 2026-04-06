'use client'

import { useEffect } from 'react'
import content from '@/content/en.json'
import type { Content } from '@/content/types'

interface ProjectNavigationProps {
  currentSlug: string
  position: 'top' | 'bottom'
}

const typedContent = content as unknown as Content
const enabledProjects = typedContent.projects.items.filter(p => !p.disabled)

export function ProjectNavigation({ currentSlug, position }: ProjectNavigationProps) {
  const currentIndex = enabledProjects.findIndex(p => p.slug === currentSlug)
  const prev = currentIndex > 0 ? enabledProjects[currentIndex - 1] : null
  const next = currentIndex < enabledProjects.length - 1 ? enabledProjects[currentIndex + 1] : null

  // Keyboard navigation — only attach on top instance to avoid duplicates
  useEffect(() => {
    if (position !== 'top') return

    function handleKeyDown(e: KeyboardEvent) {
      // Don't intercept when user is typing in an input/textarea
      const tag = (e.target as HTMLElement)?.tagName
      if (tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT') return

      if (e.key === 'ArrowLeft' && prev) {
        window.location.href = `/projects/${prev.slug}`
      } else if (e.key === 'ArrowRight' && next) {
        window.location.href = `/projects/${next.slug}`
      } else if (e.key === 'Escape') {
        window.location.href = '/'
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [prev, next, position])

  const stickyClasses = position === 'top'
    ? 'sticky top-0 z-40 bg-bg backdrop-blur-xl'
    : ''

  return (
    <nav
      aria-label="Project navigation"
      className={`border-t border-border-primary px-5 md:px-8 lg:px-16 py-6 ${stickyClasses}`}
    >
      <div className="flex items-center justify-between">
        {/* Prev link (left) */}
        {prev ? (
          <a
            href={`/projects/${prev.slug}`}
            className="min-h-[44px] flex items-center font-mono text-xs text-text-secondary hover:text-text-primary transition-colors duration-300 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-border-focus)]"
          >
            <span aria-hidden="true" className="mr-2">&larr;</span>
            {prev.title}
          </a>
        ) : (
          <a
            href="/"
            className="min-h-[44px] flex items-center font-mono text-xs text-text-secondary hover:text-text-primary transition-colors duration-300 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-border-focus)]"
          >
            <span aria-hidden="true" className="mr-2">&larr;</span>
            Back to Home
          </a>
        )}

        {/* Next link (right) */}
        {next ? (
          <a
            href={`/projects/${next.slug}`}
            className="min-h-[44px] flex items-center font-mono text-xs text-text-secondary hover:text-text-primary transition-colors duration-300 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-border-focus)]"
          >
            {next.title}
            <span aria-hidden="true" className="ml-2">&rarr;</span>
          </a>
        ) : (
          <a
            href="/"
            className="min-h-[44px] flex items-center font-mono text-xs text-text-secondary hover:text-text-primary transition-colors duration-300 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-border-focus)]"
          >
            Back to Home
            <span aria-hidden="true" className="ml-2">&rarr;</span>
          </a>
        )}
      </div>
    </nav>
  )
}
