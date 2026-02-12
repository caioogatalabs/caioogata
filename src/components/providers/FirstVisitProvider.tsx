'use client'

import { createContext, useContext, useState, useCallback, ReactNode } from 'react'
import Footer from '@/components/layout/Footer'

interface FirstVisitContextType {
  isFirstVisitActive: boolean
  setIsFirstVisitActive: (active: boolean) => void
}

export const FirstVisitContext = createContext<FirstVisitContextType | undefined>(undefined)

export function useFirstVisit() {
  const ctx = useContext(FirstVisitContext)
  if (ctx === undefined) {
    throw new Error('useFirstVisit must be used within FirstVisitProvider')
  }
  return ctx
}

export function FirstVisitProvider({ children }: { children: ReactNode }) {
  const [isFirstVisitActive, setIsFirstVisitActive] = useState(true)

  return (
    <FirstVisitContext.Provider value={{ isFirstVisitActive, setIsFirstVisitActive }}>
      {children}
    </FirstVisitContext.Provider>
  )
}

export function ConditionalFooter() {
  const { isFirstVisitActive } = useFirstVisit()
  if (isFirstVisitActive) return null
  return <Footer />
}
