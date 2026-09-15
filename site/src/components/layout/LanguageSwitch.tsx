'use client'

import { useLanguage } from '@/components/providers/LanguageProvider'
import type { Language } from '@/content/types'

const OPTIONS: { value: Language; label: string; name: string }[] = [
  { value: 'en', label: 'EN', name: 'English' },
  { value: 'pt-br', label: 'PT', name: 'Português' },
]

/**
 * `EN / PT`, in the header's location slot under the clock (desktop) and in the
 * mobile panel. Typeset like the slot around it: the active language reads at
 * full strength, the other at the slot's 50%, which is the only state it needs.
 *
 * `pointer-events-auto` because the header bar is click-through by design.
 */
export function LanguageSwitch({ className = '' }: { className?: string }) {
  const { language, setLanguage, content } = useLanguage()

  return (
    <div
      role="group"
      aria-label={content.ui.header.language}
      className={`pointer-events-auto flex items-center gap-1 ${className}`.trim()}
    >
      {OPTIONS.map((option, i) => {
        const active = option.value === language
        return (
          <span key={option.value} className="flex items-center gap-1">
            {i > 0 && <span aria-hidden className="opacity-50">/</span>}
            <button
              type="button"
              lang={option.value === 'pt-br' ? 'pt-BR' : 'en'}
              aria-label={option.name}
              aria-pressed={active}
              onClick={() => setLanguage(option.value)}
              className={`transition-opacity duration-300 hover:opacity-100 ${
                active ? 'opacity-100' : 'opacity-50'
              }`}
            >
              {option.label}
            </button>
          </span>
        )
      })}
    </div>
  )
}
