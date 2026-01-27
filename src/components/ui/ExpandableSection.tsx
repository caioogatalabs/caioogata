'use client'

import { useState } from 'react'
import { clsx } from 'clsx'

interface ExpandableSectionProps {
  title: string
  children: React.ReactNode
  defaultExpanded?: boolean
  className?: string
}

export default function ExpandableSection({
  title,
  children,
  defaultExpanded = false,
  className = '',
}: ExpandableSectionProps) {
  const [isExpanded, setIsExpanded] = useState(defaultExpanded)

  return (
    <div className={clsx('border-2 border-primary/30 rounded-base', className)}>
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full text-left px-4 py-3 font-mono text-sm text-primary hover:bg-primary/10 transition-colors duration-150 flex items-center justify-between"
        aria-expanded={isExpanded}
      >
        <span>{title}</span>
        <span aria-hidden="true">{isExpanded ? '▼' : '▶'}</span>
      </button>
      {isExpanded && (
        <div className="px-4 pb-4 pt-2">
          {children}
        </div>
      )}
    </div>
  )
}
