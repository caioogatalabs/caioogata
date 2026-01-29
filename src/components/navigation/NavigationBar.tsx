'use client'

import { useState, useEffect } from 'react'
import { useLanguage } from '@/components/providers/LanguageProvider'
import { useKeyboardNavigation } from '@/hooks/useKeyboardNavigation'

interface NavigationBarProps {
  variant?: 'primary' | 'secondary'
}

type ActiveKey = 'esc' | 'up' | 'down' | 'enter' | null

function ArrowUpIcon({ className }: { className?: string }) {
  return (
    <svg
      width="12"
      height="12"
      viewBox="0 0 12 12"
      fill="none"
      className={className}
      aria-hidden
    >
      <path
        d="M6 9V3M6 3L3 6M6 3L9 6"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

function ArrowDownIcon({ className }: { className?: string }) {
  return (
    <svg
      width="12"
      height="12"
      viewBox="0 0 12 12"
      fill="none"
      className={className}
      aria-hidden
    >
      <path
        d="M6 3V9M6 9L3 6M6 9L9 6"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

export default function NavigationBar({ variant = 'primary' }: NavigationBarProps) {
  const { content } = useLanguage()
  const { navigateUp, navigateDown, selectItem, goBack } = useKeyboardNavigation()
  const [activeKey, setActiveKey] = useState<ActiveKey>(null)

  // Listen for keyboard events to show visual feedback
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      switch (event.key) {
        case 'Escape':
          setActiveKey('esc')
          break
        case 'ArrowUp':
          setActiveKey('up')
          break
        case 'ArrowDown':
          setActiveKey('down')
          break
        case 'Enter':
          setActiveKey('enter')
          break
      }
    }

    const handleKeyUp = () => {
      setActiveKey(null)
    }

    window.addEventListener('keydown', handleKeyDown)
    window.addEventListener('keyup', handleKeyUp)
    return () => {
      window.removeEventListener('keydown', handleKeyDown)
      window.removeEventListener('keyup', handleKeyUp)
    }
  }, [])

  const borderColor = variant === 'primary' ? 'border-primary/10' : 'border-secondary/10'

  const buttonBaseClass = 'inline-flex items-center gap-1 text-xs font-mono text-neutral-500 hover:text-primary transition-colors cursor-pointer select-none'
  const keyClass = 'px-1 py-0.5 rounded bg-neutral-800/50 text-neutral-400 hover:bg-neutral-700/50 hover:text-primary transition-colors'
  const keyActiveClass = 'px-1 py-0.5 rounded bg-neutral-700/50 text-primary transition-colors'

  return (
    <div className={`mt-8 pt-4 border-t ${borderColor}`}>
      <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-xs font-mono text-neutral-500">
        {/* Esc to go back */}
        <button
          type="button"
          onClick={goBack}
          className={`${buttonBaseClass} ${activeKey === 'esc' ? 'text-primary' : ''}`}
        >
          <span className={activeKey === 'esc' ? keyActiveClass : keyClass}>Esc</span>
          <span>{content.menu.navigation.back}</span>
        </button>

        <span className="text-neutral-600" aria-hidden>·</span>

        {/* Arrow navigation */}
        <div className="inline-flex items-center gap-1">
          <button
            type="button"
            onClick={navigateUp}
            className={activeKey === 'up' ? keyActiveClass : keyClass}
            aria-label={content.menu.navigation.arrowUp}
          >
            <ArrowUpIcon />
          </button>
          <button
            type="button"
            onClick={navigateDown}
            className={activeKey === 'down' ? keyActiveClass : keyClass}
            aria-label={content.menu.navigation.arrowDown}
          >
            <ArrowDownIcon />
          </button>
          <span className="ml-0.5">{content.menu.navigation.navigate}</span>
        </div>

        <span className="text-neutral-600" aria-hidden>·</span>

        {/* Enter to select */}
        <button
          type="button"
          onClick={selectItem}
          className={`${buttonBaseClass} ${activeKey === 'enter' ? 'text-primary' : ''}`}
        >
          <span className={activeKey === 'enter' ? keyActiveClass : keyClass}>Enter</span>
          <span>{content.menu.navigation.select}</span>
        </button>
      </div>
    </div>
  )
}
