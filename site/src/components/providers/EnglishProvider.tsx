'use client'

import type { ReactNode } from 'react'
import en from '@/content/en.json'
import type { Content } from '@/content/types'
import { LanguageProvider } from './LanguageProvider'

/** The English content, in a module of its own so Portuguese pages never load it. */
export function EnglishProvider({ children }: { children: ReactNode }) {
  return (
    <LanguageProvider language="en" content={en as unknown as Content}>
      {children}
    </LanguageProvider>
  )
}
