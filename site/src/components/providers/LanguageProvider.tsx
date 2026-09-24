'use client'

import { createContext, useContext, useCallback, ReactNode } from 'react'
import type { Content, Language } from '@/content/types'
import { localePath } from '@/lib/i18n'

interface LanguageContextType {
  language: Language
  content: Content
  /** An internal path in the current language (`/about` → `/pt/about`). */
  localize: (path: string) => string
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined)

/**
 * The language comes from the route (`app/(en)/layout.tsx` or `app/pt/layout.tsx`), so the server
 * renders each page already in its language and nothing changes after
 * hydration. Switching language is a navigation to the other URL, not a state
 * change here.
 *
 * The content is passed in rather than imported, so each language's JSON is
 * bundled only by its own provider module (`EnglishProvider`,
 * `PortugueseProvider`) and a page ships just the one it reads.
 */
export function LanguageProvider({
  language,
  content,
  children,
}: {
  language: Language
  content: Content
  children: ReactNode
}) {
  const localize = useCallback((path: string) => localePath(path, language), [language])

  return (
    <LanguageContext.Provider value={{ language, content, localize }}>
      {children}
    </LanguageContext.Provider>
  )
}

/** Fills `{name}` placeholders in a UI string. */
export function fill(template: string, vars: Record<string, string | number>) {
  return template.replace(/\{(\w+)\}/g, (match, key) => (key in vars ? String(vars[key]) : match))
}

export function useLanguage() {
  const context = useContext(LanguageContext)
  if (!context) {
    throw new Error('useLanguage must be used within LanguageProvider')
  }
  return context
}
