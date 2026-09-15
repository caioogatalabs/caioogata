'use client'

import { createContext, useContext, useState, useEffect, Fragment, ReactNode } from 'react'
import enContent from '@/content/en.json'
import ptContent from '@/content/pt-br.json'
import type { Content, Language } from '@/content/types'

interface LanguageContextType {
  language: Language
  setLanguage: (lang: Language) => void
  content: Content
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined)

const STORAGE_KEY = 'portfolio-language'

/**
 * The static export ships English HTML; a saved Portuguese preference is
 * applied right after hydration. Changing language remounts the tree under the
 * provider (`key={language}`): SplitText measures and splits its lines once on
 * mount, so swapping the strings in place would leave the old line breaks.
 */
export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<Language>('en')

  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY)
      if (saved === 'en' || saved === 'pt-br') setLanguageState(saved)
    } catch {
      // Storage blocked — stay on English.
    }
  }, [])

  useEffect(() => {
    document.documentElement.lang = language === 'pt-br' ? 'pt-BR' : 'en'
  }, [language])

  const setLanguage = (lang: Language) => {
    setLanguageState(lang)
    try {
      localStorage.setItem(STORAGE_KEY, lang)
    } catch {
      // Storage blocked — the choice lasts for this page view only.
    }
  }

  const content = (language === 'en' ? enContent : ptContent) as unknown as Content

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
