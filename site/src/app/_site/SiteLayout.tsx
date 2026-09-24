import type { Metadata, Viewport } from 'next'
import Script from 'next/script'
import { Analytics } from '@vercel/analytics/next'
import { SpeedInsights } from '@vercel/speed-insights/next'
import { FooterSection } from '@/components/sections/v2/FooterSection'
import { SmoothScroll } from '@/components/layout/SmoothScroll'
import { HeaderBar } from '@/components/layout/HeaderBar'
import type { ComponentType, ReactNode } from 'react'
import { SITE_URL, htmlLang, toLanguage, type Locale } from '@/lib/i18n'
import { absoluteUrl, contentFor } from '@/lib/seo'

export const siteViewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
}

/**
 * The site's root layout, shared by the two root layouts that exist: English
 * in the `(en)` route group, unprefixed, and Portuguese under `app/pt`. Two
 * roots rather than one `[lang]` segment because each has to import only its
 * own content: a single layout importing both providers put both JSON files,
 * ~47 KB gzip, into every page.
 *
 * What every page shares goes in `siteMetadata`. Title, description,
 * canonical, hreflang and the share cards are stated by each page through
 * `lib/seo.ts`; the title here is only the fallback for the 404.
 */
export function siteMetadata(locale: Locale): Metadata {
  return {
    title: contentFor(locale).ui.seo.home.title,
    keywords: [
      'Creative Designer',
      'Freelance designer',
      'Art direction',
      'Brand and visual identity',
      'Interface design',
      'Motion design',
      'Front-end development',
      'Porto Alegre',
      'Brazil',
    ],
    authors: [{ name: 'Caio Ogata' }],
    creator: 'Caio Ogata',
    icons: {
      icon: [
        { url: '/favicon/favicon.ico', sizes: 'any' },
        { url: '/favicon/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
        { url: '/favicon/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
      ],
      apple: '/favicon/apple-touch-icon.png',
    },
    manifest: '/favicon/site.webmanifest',
    // Resolves the relative OG/Twitter image paths.
    metadataBase: new URL(SITE_URL),
    robots: {
      index: true,
      follow: true,
    },
  }
}

function personJsonLd(locale: Locale) {
  const content = contentFor(locale)
  return {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: content.hero.name,
    jobTitle: 'Creative Designer',
    url: absoluteUrl('/', toLanguage(locale)),
    image: `${SITE_URL}/caio-ogata-profile.webp`,
    email: content.contact.email,
    nationality: 'Brazilian',
    homeLocation: {
      '@type': 'Place',
      name: 'Porto Alegre, RS, Brazil',
    },
    sameAs: content.contact.links.map(link => link.url),
    knowsAbout: content.about.expertise,
    description: content.hero.summary,
    subjectOf: {
      '@type': 'WebPage',
      name: 'LLM-optimized portfolio (machine-readable)',
      url: `${SITE_URL}/${locale === 'pt' ? 'llms-pt.txt' : 'llms-full.txt'}`,
    },
  }
}

export function SiteLayout({
  locale,
  Provider,
  children,
}: {
  locale: Locale
  /** The language's content provider, imported by the root layout that owns it. */
  Provider: ComponentType<{ children: ReactNode }>
  children: ReactNode
}) {
  return (
    <html lang={htmlLang(toLanguage(locale))} suppressHydrationWarning>
      <head>
        {/* The markdown mirror of this site, for anything that would rather
            read text than parse the page. The file itself is also linked from
            the footer and listed in the sitemap. */}
        <link rel="alternate" type="text/markdown" href={`${SITE_URL}/${locale === 'pt' ? 'llms-pt.txt' : 'llms-full.txt'}`} />
        <script
          dangerouslySetInnerHTML={{
            __html: `document.fonts.ready.then(function(){document.documentElement.classList.add('-loaded','-ready')})`,
          }}
        />
      </head>
      <body className="antialiased overflow-x-hidden">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(personJsonLd(locale)) }}
        />
        <SmoothScroll />
        <Provider>
          {/* The page content is the lid the footer is revealed from
              under: opaque, and on a layer above the fixed panel.
              The header is its first child so that `sticky top-0` holds
              for the whole route rather than for one hero — every page
              used to mount its own, and on mobile that meant the bar left
              with the hero after a few hundred pixels. */}
          <div className="relative z-10 bg-bg">
            <HeaderBar />
            {children}
          </div>
          <FooterSection />
        </Provider>
        <Analytics />
        <SpeedInsights />
        {/* Google Analytics, after hydration so it never competes with the
            first paint. The stock snippet is wrapped in a host check: only the
            real domain reports, so localhost, Vercel previews and the
            measuring scripts stay out of the numbers. */}
        <Script
          id="google-analytics"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `if(/^(www\\.)?caioogata\\.com$/.test(location.hostname)){var s=document.createElement('script');s.async=1;s.src='https://www.googletagmanager.com/gtag/js?id=G-Z5YD3YDGWE';document.head.appendChild(s);window.dataLayer=window.dataLayer||[];window.gtag=function(){dataLayer.push(arguments)};gtag('js',new Date());gtag('config','G-Z5YD3YDGWE');}`,
          }}
        />
        <Script
          id="microsoft-clarity"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `(function(c,l,a,r,i,t,y){c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);})(window,document,"clarity","script","vqjki4zzkm");`,
          }}
        />
      </body>
    </html>
  )
}
