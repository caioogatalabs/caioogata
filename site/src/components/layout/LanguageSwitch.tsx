'use client'

import { usePathname } from 'next/navigation'
import { useLanguage } from '@/components/providers/LanguageProvider'
import type { Language } from '@/content/types'
import { LANG_COOKIE, htmlLang, localePath, stripLocale } from '@/lib/i18n'

const OPTIONS: { value: Language; label: string; name: string; cookie: string }[] = [
  { value: 'en', label: 'EN', name: 'English', cookie: 'en' },
  { value: 'pt-br', label: 'PT', name: 'Português', cookie: 'pt' },
]

/**
 * `EN / PT`, in the header's location slot under the clock (desktop) and in the
 * mobile panel. Typeset like the slot around it: the active language reads at
 * full strength, the other at the slot's 50%, which is the only state it needs.
 *
 * Each option is a link to the same page in that language — the URL is where
 * the language lives. The click also writes the `lang` cookie, which is what
 * tells the middleware not to send a visitor from Brazil back to `/pt` after
 * they chose English.
 *
 * `pointer-events-auto` because the header bar is click-through by design.
 */
export function LanguageSwitch({ className = '' }: { className?: string }) {
  const { language, content } = useLanguage()
  const path = stripLocale(usePathname())

  const remember = (cookie: string) => {
    document.cookie = `${LANG_COOKIE}=${cookie}; path=/; max-age=31536000; samesite=lax`
  }

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
            <a
              href={localePath(path, option.value)}
              hrefLang={htmlLang(option.value)}
              lang={htmlLang(option.value)}
              aria-label={option.name}
              aria-current={active ? 'page' : undefined}
              onClick={() => remember(option.cookie)}
              className={`transition-opacity duration-300 hover:opacity-100 ${
                active ? 'opacity-100' : 'opacity-50'
              }`}
            >
              {option.label}
            </a>
          </span>
        )
      })}
    </div>
  )
}
