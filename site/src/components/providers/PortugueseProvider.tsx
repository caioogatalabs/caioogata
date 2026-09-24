'use client'

import type { ReactNode } from 'react'
import pt from '@/content/pt-br.json'
import type { Content } from '@/content/types'
import { LanguageProvider } from './LanguageProvider'

/** The Portuguese content, in a module of its own so English pages never load it. */
export function PortugueseProvider({ children }: { children: ReactNode }) {
  return (
    <LanguageProvider language="pt-br" content={pt as unknown as Content}>
      {children}
    </LanguageProvider>
  )
}
