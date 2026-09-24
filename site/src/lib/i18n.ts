import type { Language } from '@/content/types'

/**
 * The URL is where the language lives: English unprefixed (`/about`, the
 * `app/(en)` route group), Portuguese under `/pt` (`app/pt`). `Locale` names
 * the two routes; the content language keeps its own name, `pt-br`, which is
 * what the JSON files and `Language` were already called.
 */
export type Locale = 'en' | 'pt'

export const SITE_URL = 'https://www.caioogata.com'

export function toLanguage(locale: Locale): Language {
  return locale === 'pt' ? 'pt-br' : 'en'
}

/** `<html lang>` and hreflang value. */
export function htmlLang(language: Language) {
  return language === 'pt-br' ? 'pt-BR' : 'en'
}

/**
 * An internal path in the given language. `path` is the English, unprefixed
 * form; hash-only and external links pass through.
 */
export function localePath(path: string, language: Language) {
  if (language === 'en' || !path.startsWith('/')) return path
  if (path === '/') return '/pt'
  if (path.startsWith('/#')) return `/pt${path.slice(1)}`
  return `/pt${path}`
}

/** The unprefixed (English) form of a pathname, whichever language it is in. */
export function stripLocale(pathname: string) {
  if (pathname === '/pt') return '/'
  if (pathname.startsWith('/pt/')) return pathname.slice(3)
  return pathname
}

/** The cookie the language switch writes, read by the middleware. */
export const LANG_COOKIE = 'lang'
