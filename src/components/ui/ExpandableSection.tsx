'use client'

import { useState } from 'react'
import { clsx } from 'clsx'
import ArrowRightIcon from '@/components/ui/ArrowRightIcon'

interface ExpandableSectionProps {
  title: React.ReactNode
  children: React.ReactNode
  defaultExpanded?: boolean
  className?: string
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
  const [internalExpanded, setInternalExpanded] = useState(defaultExpanded)
  const isControlled = controlledExpanded !== undefined
  const expanded = isControlled ? controlledExpanded : internalExpanded

  const handleToggle = () => {
    if (onToggle) {
      onToggle()
    } else {
      setInternalExpanded(!internalExpanded)
    }
  }

  const borderClass = 'border-secondary/10 group-hover:border-primary'

  return (
    <div
      className={clsx(
        'group border-t transition-colors duration-150',
        borderClass,
        className
      )}
    >
      <button
        onClick={handleToggle}
        className={clsx(
          'w-full text-left py-2 font-mono text-sm transition-colors duration-150 flex items-center justify-between',
          isSelected
            ? 'text-primary opacity-100'
            : 'text-secondary opacity-60 group-hover:text-primary group-hover:opacity-100'
        )}
        aria-expanded={expanded}
      >
        <span className="flex items-center gap-2 min-w-0 flex-1">{title}</span>
        <span
          aria-hidden
          className={clsx(
            'shrink-0 flex items-center justify-center w-4 transition-transform duration-150',
            expanded && 'rotate-90'
          )}
        >
          <ArrowRightIcon />
        </span>
      </button>
      {expanded && (
        <div className="pb-4 pt-2">
          {children}
        </div>
      )}
    </div>
  )
}
