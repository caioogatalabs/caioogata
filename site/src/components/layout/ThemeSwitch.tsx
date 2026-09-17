'use client'

import { useLanguage } from '@/components/providers/LanguageProvider'
import { useTheme, type Theme } from '@/components/providers/ThemeProvider'

/**
 * `DARK / LIGHT`, typeset and placed like `LanguageSwitch` — the same slot in
 * the header, the same 50% / 100% pair of states, so the two preferences read
 * as one row of small print rather than two different controls.
 *
 * `pointer-events-auto` because the header bar is click-through by design.
 */
export function ThemeSwitch({ className = '' }: { className?: string }) {
  const { theme, setTheme } = useTheme()
  const t = useLanguage().content.ui.header

  const options: { value: Theme; label: string }[] = [
    { value: 'dark', label: t.themeDark },
    { value: 'light', label: t.themeLight },
  ]

  return (
    <div
      role="group"
      aria-label={t.theme}
      className={`pointer-events-auto flex items-center gap-1 ${className}`.trim()}
    >
      {options.map((option, i) => {
        const active = option.value === theme
        return (
          <span key={option.value} className="flex items-center gap-1">
            {i > 0 && <span aria-hidden className="opacity-50">/</span>}
            <button
              type="button"
              aria-pressed={active}
              onClick={() => setTheme(option.value)}
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
