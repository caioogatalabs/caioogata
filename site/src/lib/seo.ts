import type { Metadata } from 'next'
import en from '@/content/en.json'
import pt from '@/content/pt-br.json'
import type { Content, Language } from '@/content/types'
import { type Locale, SITE_URL, localePath, toLanguage } from '@/lib/i18n'

/** Server-side content lookup by route segment. Never imported by client code. */
export function contentFor(locale: Locale): Content {
  return (locale === 'pt' ? pt : en) as unknown as Content
}

/** Absolute URL of an unprefixed path in the given language. */
export function absoluteUrl(path: string, language: Language) {
  const localized = localePath(path, language)
  return localized === '/' ? SITE_URL : `${SITE_URL}${localized}`
}

/**
 * Both language versions of a page, for hreflang in the head and in the
 * sitemap. `x-default` is English: it is the version for anyone neither
 * language targets.
 */
export function languageAlternates(path: string) {
  return {
    en: absoluteUrl(path, 'en'),
    'pt-BR': absoluteUrl(path, 'pt-br'),
    'x-default': absoluteUrl(path, 'en'),
  }
}

/**
 * The metadata every page states for itself: title and description in its
 * language, a canonical pointing at its own language, the other language as an
 * alternate, and share cards that do not fall back to the home's.
 */
export function pageMetadata({
  locale,
  path,
  title,
  description,
  image,
  type = 'website',
}: {
  locale: Locale
  /** Unprefixed path: `/about`, `/projects/lukso`, `/`. */
  path: string
  title: string
  description: string
  image?: { url: string; width: number; height: number; alt?: string }
  type?: 'website' | 'article'
}): Metadata {
  const language = toLanguage(locale)
  const url = absoluteUrl(path, language)
  const images = image ? [image] : undefined

  return {
    title,
    description,
    alternates: { canonical: url, languages: languageAlternates(path) },
    openGraph: {
      type,
      url,
      title,
      description,
      siteName: 'Caio Ogata Portfolio',
      locale: locale === 'pt' ? 'pt_BR' : 'en_US',
      alternateLocale: [locale === 'pt' ? 'en_US' : 'pt_BR'],
      ...(images && { images }),
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      ...(images && { images: images.map(i => i.url) }),
    },
  }
}

export const OG_IMAGE = {
  url: `${SITE_URL}/og-img.png`,
  width: 1200,
  height: 630,
}

type StaticPage = keyof Content['ui']['seo']

/** Metadata for one of the five fixed pages, from `ui.seo` in its language. */
export function staticPageMetadata(locale: Locale, page: StaticPage, path: string): Metadata {
  const { title, description } = contentFor(locale).ui.seo[page]
  return pageMetadata({ locale, path, title, description, image: { ...OG_IMAGE, alt: title } })
}
