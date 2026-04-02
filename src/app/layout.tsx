import type { Metadata, Viewport } from 'next'
import Script from 'next/script'
import { Analytics } from '@vercel/analytics/next'
import { SpeedInsights } from '@vercel/speed-insights/next'
import { LanguageProvider } from '@/components/providers/LanguageProvider'
import { NavigationProvider } from '@/components/providers/NavigationProvider'
import { ToastProvider } from '@/components/providers/ToastProvider'
import '@fontsource/cascadia-mono/400.css'
import '@fontsource/cascadia-mono/700.css'
import './globals.css'

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
}

export const metadata: Metadata = {
  title: 'Caio Ogata - Design Director | Systems, DevEx & Engineering',
  description: 'Design Director specializing in design systems, DevEx, and product engineering. 15 years in UI/UX, 4 as DevEx Director at a global edge platform. Based in Porto Alegre, Brazil.',
  keywords: [
    'Design Director',
    'Design Systems',
    'Developer Experience',
    'DevEx',
    'Design Engineering',
    'Product Engineering',
    'UI/UX Design',
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
    title: 'Caio Ogata - Design Director | Systems, DevEx & Engineering',
    description: 'Design Director building at the intersection of design systems, developer experience, and product engineering — with end-to-end ownership from concept to production. Based in Porto Alegre, Brazil.',
    siteName: 'Caio Ogata Portfolio',
    images: [
      {
        url: 'https://www.caioogata.com/og-img.png',
        width: 1200,
        height: 630,
        alt: 'Caio Ogata - Design Director',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Caio Ogata - Design Director | Systems, DevEx & Engineering',
    description: 'Design Director at the intersection of design systems, developer experience, and product engineering. 15 years in UI/UX, 4 as DevEx Director.',
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
  robots: {
    index: true,
    follow: true,
  },
}

const personJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Person',
  name: 'Caio Ogata',
  jobTitle: 'Design Director',
  url: 'https://www.caioogata.com',
  image: 'https://www.caioogata.com/caio-ogata-profile.webp',
  email: 'caioogata.labs@gmail.com',
  birthDate: '1984-06',
  nationality: 'Brazilian',
  homeLocation: {
    '@type': 'Place',
    name: 'Porto Alegre, RS, Brazil',
  },
  sameAs: [
    'https://www.linkedin.com/in/caioogata/',
    'https://github.com/caioogatalabs',
    'https://www.instagram.com/caioogata.labs',
    'https://www.youtube.com/@caioogatalabs',
    'https://www.azion.design',
  ],
  knowsAbout: [
    'Design Systems',
    'Developer Experience',
    'Design Engineering',
    'Product Engineering',
    'Product Design',
    'UI/UX Design',
    'Design Leadership',
    'Design Operations',
    'Edge Computing',
    'Product-Led Growth',
  ],
  description:
    'Design Director with 15+ years in UI/UX and 4 years as Developer Experience Director at Azion Technologies. Specialized in design systems, product engineering, and end-to-end design execution from concept to production.',
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
    <html lang="en">
      <body className="antialiased overflow-x-hidden">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(personJsonLd) }}
        />
        <LanguageProvider>
          <NavigationProvider>
            <ToastProvider>
              {children}
            </ToastProvider>
          </NavigationProvider>
        </LanguageProvider>
        <Analytics />
        <SpeedInsights />
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
