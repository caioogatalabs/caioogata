'use client'

import { forwardRef, useState } from 'react'
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
  onFocus?: () => void
  disabled?: boolean
}

const ExpandableSection = forwardRef<HTMLButtonElement, ExpandableSectionProps>(function ExpandableSection({
  title,
  children,
  defaultExpanded = false,
  className = '',
  isSelected,
  isExpanded: controlledExpanded,
  onToggle,
  onFocus,
  disabled = false,
}, ref) {
  const [internalExpanded, setInternalExpanded] = useState(defaultExpanded)
  const isControlled = controlledExpanded !== undefined
  const expanded = isControlled ? controlledExpanded : internalExpanded

  const handleToggle = () => {
    if (disabled) return
    if (onToggle) {
      onToggle()
    } else {
      setInternalExpanded(!internalExpanded)
    }
  }

  const borderClass = disabled
    ? 'border-secondary/10'
    : 'border-secondary/10 group-hover:border-primary'

  return (
    <div
      className={clsx(
        'group border-t transition-colors duration-150',
        borderClass,
        className
      )}
    >
      <button
        ref={ref}
        type="button"
        onClick={handleToggle}
        onFocus={disabled ? undefined : onFocus}
        disabled={disabled}
        className={clsx(
          'w-full text-left py-2 font-mono text-sm transition-colors duration-150 flex items-center justify-between focus:outline-none',
          disabled
            ? 'text-secondary opacity-25 cursor-default'
            : isSelected
              ? 'text-primary opacity-100'
              : 'text-secondary opacity-60 group-hover:text-primary group-hover:opacity-100'
        )}
        aria-expanded={disabled ? undefined : expanded}
      >
        <span className="flex items-center gap-2 min-w-0 flex-1">{title}</span>
        {!disabled && (
          <span
            aria-hidden
            className={clsx(
              'shrink-0 flex items-center justify-center w-4 transition-transform duration-150',
              expanded && 'rotate-90'
            )}
          >
            <ArrowRightIcon />
          </span>
        )}
      </button>
      {!disabled && expanded && (
        <div className="pb-4 pt-2">
          {children}
        </div>
      )}
    </div>
  )
})

export default ExpandableSection
