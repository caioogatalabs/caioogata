'use client'

import { createContext, useContext, useState, useEffect, useCallback, Fragment, ReactNode } from 'react'
import enContent from '@/content/en.json'
import type { Content, Language } from '@/content/types'

interface LanguageContextType {
  language: Language
  setLanguage: (lang: Language) => void
  content: Content
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined)

const STORAGE_KEY = 'portfolio-language'

/**
 * Portuguese is fetched, not bundled. Both content files are ~90 KB each, and
 * importing them statically put ~37 KB gzip of the language nobody is reading
 * into every page of the site. English stays static because the HTML is
 * English; Portuguese arrives on demand and is then cached by the browser.
 *
 * The language only changes once its content is in hand. Switching remounts
 * the tree, and SplitText measures its line breaks on mount, so a two-step
 * switch — language first, strings after — would leave the old line breaks on
 * screen.
 *
 * The static export ships English HTML; a saved Portuguese preference is
 * applied right after hydration, with the page held invisible until then (see
 * the `-lang-pending` script in app/layout.tsx). Changing language remounts the tree under the
 * provider (`key={language}`): SplitText measures and splits its lines once on
 * mount, so swapping the strings in place would leave the old line breaks.
 */
export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<Language>('en')
  const [ptContent, setPtContent] = useState<Content | null>(null)
  // True once the saved preference has been read and applied.
  const [resolved, setResolved] = useState(false)

  const loadPt = useCallback(async () => {
    if (ptContent) return ptContent
    const mod = await import('@/content/pt-br.json')
    const loaded = mod.default as unknown as Content
    setPtContent(loaded)
    return loaded
  }, [ptContent])

  useEffect(() => {
    let saved: string | null = null
    try {
      saved = localStorage.getItem(STORAGE_KEY)
    } catch {
      // Storage blocked — stay on English.
    }

    if (saved === 'pt-br') {
      // The page is held invisible until this resolves, which is the same hold
      // that already covered hydration. A failed fetch falls back to English
      // rather than leaving the visitor on a held page.
      loadPt()
        .then(() => setLanguageState('pt-br'))
        .catch(() => {})
        .finally(() => setResolved(true))
      return
    }

    if (saved === 'en') setLanguageState('en')
    setResolved(true)
  }, [loadPt])

  useEffect(() => {
    if (!resolved) return
    document.documentElement.lang = language === 'pt-br' ? 'pt-BR' : 'en'
    // Releases the pre-paint hold set in app/layout.tsx, now that the content
    // on screen is in the saved language.
    document.documentElement.classList.remove('-lang-pending')
  }, [language, resolved])

  const setLanguage = (lang: Language) => {
    const apply = () => {
      setLanguageState(lang)
      try {
        localStorage.setItem(STORAGE_KEY, lang)
      } catch {
        // Storage blocked — the choice lasts for this page view only.
      }
    }

    if (lang === 'pt-br') loadPt().then(apply).catch(() => {})
    else apply()
  }

  const content = (language === 'pt-br' && ptContent ? ptContent : enContent) as unknown as Content

  return (
    <LanguageContext.Provider value={{ language, setLanguage, content }}>
      <Fragment key={language}>{children}</Fragment>
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
