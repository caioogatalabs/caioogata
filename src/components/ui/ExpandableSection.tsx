'use client'

import { useState } from 'react'
import { clsx } from 'clsx'

interface ExpandableSectionProps {
  title: string
  children: React.ReactNode
  defaultExpanded?: boolean
  className?: string
  // Controlled mode props
  isSelected?: boolean
  isExpanded?: boolean
  onToggle?: () => void
}

export default function ExpandableSection({
  title,
  children,
  defaultExpanded = false,
  className = '',
  isSelected,
  isExpanded: controlledExpanded,
  onToggle,
}: ExpandableSectionProps) {
  // Uncontrolled state (fallback)
  const [internalExpanded, setInternalExpanded] = useState(defaultExpanded)

  // Use controlled state if provided, otherwise use internal state
  const isControlled = controlledExpanded !== undefined
  const expanded = isControlled ? controlledExpanded : internalExpanded

  const handleToggle = () => {
    if (onToggle) {
      onToggle()
    } else {
      setInternalExpanded(!internalExpanded)
    }
  }

  return (
    <div
      className={clsx(
        'border-2 rounded-base transition-colors duration-150',
        isSelected ? 'border-primary bg-primary/5' : 'border-primary/30',
        className
      )}
    >
      <button
        onClick={handleToggle}
        className={clsx(
          'w-full text-left px-4 py-3 font-mono text-sm transition-colors duration-150 flex items-center justify-between',
          isSelected ? 'text-primary bg-primary/10' : 'text-primary hover:bg-primary/10'
        )}
        aria-expanded={expanded}
      >
        <span className="flex items-center gap-2">
          {isSelected && <span className="text-primary">&gt;</span>}
          <span>{title}</span>
        </span>
        <span aria-hidden="true">{expanded ? '▼' : '▶'}</span>
      </button>
      {expanded && (
        <div className="px-4 pb-4 pt-2">
          {children}
        </div>
      )}
    </div>
  )
}
