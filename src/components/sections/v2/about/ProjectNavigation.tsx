'use client'

import Link from 'next/link'
import type { ReactNode } from 'react'

interface ProjectNavigationProps {
  /** Optional second slot for future next/prev project links. Reserved — does not render today. */
  secondary?: ReactNode
}

export function ProjectNavigation({ secondary: _secondary }: ProjectNavigationProps = {}) {
  return (
    <nav
      aria-label="Page navigation"
      className="sticky top-0 z-40 bg-bg backdrop-blur-xl border-t border-border-secondary px-5 md:px-8 lg:px-16 py-5"
    >
      <Link
        href="/"
        className="font-mono text-xs uppercase tracking-[1.12px] text-text-tertiary hover:text-text-primary transition-colors duration-200"
      >
        ← Back to Home
      </Link>
    </nav>
  )
}
