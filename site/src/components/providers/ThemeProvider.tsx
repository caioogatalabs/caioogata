'use client'

import { createContext, useContext, useEffect, useState, ReactNode } from 'react'

export type Theme = 'dark' | 'light'

interface ThemeContextType {
  theme: Theme
  setTheme: (theme: Theme) => void
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined)

export const THEME_STORAGE_KEY = 'portfolio-theme'

/**
 * The site's two skins, on the same tokens: dark is the default set in
 * `tokens/semantic.css`, light is the `[data-theme="light"]` override already
 * used per-section. The only thing this adds is the attribute on `<html>`, so
 * one switch repaints every page at once and nested `data-theme` sections
 * (the footer's `inverse` yellow) keep winning over it.
 *
 * The site is dark until the reader says otherwise. `prefers-color-scheme` is
 * deliberately not consulted: the portfolio is dark-first by design, and a
 * light OS should not decide that for someone. Light is a choice, saved to
 * `portfolio-theme` and kept. The initial attribute is written by the inline
 * script in `app/layout.tsx` — before first paint, so a reader who chose light
 * never sees a dark flash on the way back. This provider only mirrors what
 * that script decided and owns the changes from here on.
 */
export function ThemeProvider({ children }: { children: ReactNode }) {
  // The static HTML is built once and cannot carry a per-reader preference, so
  // it ships dark and the saved choice is read on mount.
  const [theme, setThemeState] = useState<Theme>('dark')

  useEffect(() => {
    const root = document.documentElement
    setThemeState(root.dataset.theme === 'light' ? 'light' : 'dark')
  }, [])

  useEffect(() => {
    const root = document.documentElement
    // Dark is the token default, so it is the *absence* of the attribute —
    // writing `data-theme="dark"` would need a matching rule that does not
    // exist, and would quietly shadow nothing.
    if (theme === 'light') root.dataset.theme = 'light'
    else delete root.dataset.theme
    root.style.colorScheme = theme
  }, [theme])

  const setTheme = (next: Theme) => {
    setThemeState(next)
    try {
      localStorage.setItem(THEME_STORAGE_KEY, next)
    } catch {
      // Storage blocked — the choice lasts for this page view only.
    }
  }

  return <ThemeContext.Provider value={{ theme, setTheme }}>{children}</ThemeContext.Provider>
}

export function useTheme() {
  const context = useContext(ThemeContext)
  if (!context) {
    throw new Error('useTheme must be used within ThemeProvider')
  }
  return context
}
