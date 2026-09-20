import type { Metadata, Viewport } from 'next'
import Script from 'next/script'
import { Analytics } from '@vercel/analytics/next'
import { SpeedInsights } from '@vercel/speed-insights/next'
import { LanguageProvider } from '@/components/providers/LanguageProvider'
import { FooterSection } from '@/components/sections/v2/FooterSection'
import { SmoothScroll } from '@/components/layout/SmoothScroll'
import { HeaderBar } from '@/components/layout/HeaderBar'
import content from '@/content/en.json'
import './globals.css'

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
}

const TITLE = 'Caio Ogata — Creative Designer'
const DESCRIPTION = `${content.hero.tagline} ${content.hero.tagline2}`

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
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
  openGraph: {
    type: 'website',
    locale: 'en_US',
    alternateLocale: ['pt_BR'],
    url: 'https://www.caioogata.com',
    title: TITLE,
    description: content.hero.summary,
    siteName: 'Caio Ogata Portfolio',
    images: [
      {
        url: 'https://www.caioogata.com/og-img.png',
        width: 1200,
        height: 630,
        alt: TITLE,
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: TITLE,
    description: DESCRIPTION,
    images: ['https://www.caioogata.com/og-img.png'],
  },
  icons: {
    icon: [
      { url: '/favicon/favicon.ico', sizes: 'any' },
      { url: '/favicon/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
      { url: '/favicon/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
    ],
    apple: '/favicon/apple-touch-icon.png',
  },
  manifest: '/favicon/site.webmanifest',
  // Resolves every relative canonical below, and the OG/Twitter image paths.
  metadataBase: new URL('https://www.caioogata.com'),
  alternates: { canonical: '/' },
  robots: {
    index: true,
    follow: true,
  },
}

const personJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Person',
  name: content.hero.name,
  jobTitle: 'Creative Designer',
  url: 'https://www.caioogata.com',
  image: 'https://www.caioogata.com/caio-ogata-profile.webp',
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
    url: 'https://www.caioogata.com/llms-full.txt',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `document.fonts.ready.then(function(){document.documentElement.classList.add('-loaded','-ready')})`,
          }}
        />
        {/* The static HTML is English. When the saved preference is Portuguese,
            hold the page invisible until LanguageProvider has swapped the
            content, so a full reload (every header link is a native anchor)
            does not flash the English first. The timeout releases it if
            hydration never arrives. */}
        <script
          dangerouslySetInnerHTML={{
            __html: `try{if(localStorage.getItem('portfolio-language')==='pt-br'){var r=document.documentElement;r.classList.add('-lang-pending');r.lang='pt-BR';setTimeout(function(){r.classList.remove('-lang-pending')},3000)}}catch(e){}`,
          }}
        />
      </head>
      <body className="antialiased overflow-x-hidden">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(personJsonLd) }}
        />
        <SmoothScroll />
        <LanguageProvider>
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
        </LanguageProvider>
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
