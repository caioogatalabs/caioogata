import type { Metadata } from 'next'
import { Toaster } from 'react-hot-toast'
import { LanguageProvider } from '@/components/providers/LanguageProvider'
import { NavigationProvider } from '@/components/providers/NavigationProvider'
import '@fontsource/cascadia-mono/400.css'
import '@fontsource/cascadia-mono/700.css'
import './globals.css'

export const metadata: Metadata = {
  title: 'Caio Ogata - Design Director | Design Systems & DevEx',
  description: 'Design Director with 20+ years in Art Direction and 15 in UI design. Specializing in design systems, brand experience, and developer-focused products. Based in Porto Alegre, Brazil.',
  keywords: [
    'Design Director',
    'Design Systems',
    'Developer Experience',
    'DevEx',
    'UI/UX Design',
    'Brand Experience',
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
    title: 'Caio Ogata - Design Director | Design Systems & DevEx',
    description: 'Design Director with 20+ years in Art Direction and 15 in UI design. Specializing in design systems, brand experience, and developer-focused products.',
    siteName: 'Caio Ogata Portfolio',
    images: [
      {
        url: 'https://www.caioogata.com/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Caio Ogata - Design Director',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Caio Ogata - Design Director | Design Systems & DevEx',
    description: 'Design Director with 20+ years in Art Direction and 15 in UI design.',
    images: ['https://www.caioogata.com/og-image.png'],
  },
  icons: {
    icon: '/favicon.ico',
  },
  robots: {
    index: true,
    follow: true,
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="font-mono bg-neutral text-neutral-200 antialiased">
        <LanguageProvider>
          <NavigationProvider>
            {children}
            <Toaster
            position="top-center"
            toastOptions={{
              duration: 4000,
              style: {
                background: 'var(--bg-neutral)',
                color: '#D8D1DA',
                border: '1px solid #618985',
                borderRadius: '0.25rem',
                fontFamily: '"Cascadia Mono", monospace',
                fontSize: '0.875rem',
              },
              success: {
                iconTheme: {
                  primary: '#EFD246',
                  secondary: 'var(--bg-neutral)',
                },
              },
              error: {
                iconTheme: {
                  primary: '#BC5F04',
                  secondary: 'var(--bg-neutral)',
                },
              },
            }}
            />
          </NavigationProvider>
        </LanguageProvider>
      </body>
    </html>
  )
}
