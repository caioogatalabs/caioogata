'use client'

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import enContent from '@/content/en.json'
import ptContent from '@/content/pt-br.json'
import type { Content, Language } from '@/content/types'

interface LanguageContextType {
  language: Language
  setLanguage: (lang: Language) => void
  content: Content
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined)

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState<Language>('en')

  // Persist language preference
  useEffect(() => {
    const saved = localStorage.getItem('portfolio-language')
    if (saved === 'en' || saved === 'pt-br') {
      setLanguage(saved)
    }
  }, [])

  useEffect(() => {
    localStorage.setItem('portfolio-language', language)
  }, [language])

  const content = (language === 'en' ? enContent : ptContent) as Content

  return (
    <LanguageContext.Provider value={{ language, setLanguage, content }}>
      {children}
    </LanguageContext.Provider>
  )
}

export function useLanguage() {
  const context = useContext(LanguageContext)
  if (!context) {
    throw new Error('useLanguage must be used within LanguageProvider')
  }
  return context
}
