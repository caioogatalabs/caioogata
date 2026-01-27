import type { Metadata } from 'next'
import { JetBrains_Mono } from 'next/font/google'
import { Toaster } from 'react-hot-toast'
import { LanguageProvider } from '@/components/providers/LanguageProvider'
import './globals.css'

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  weight: ['400', '700'],
  variable: '--font-jetbrains',
  display: 'swap',
  preload: true,
  fallback: ['ui-monospace', 'Courier New', 'monospace'],
})

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
  // #region agent log
  if (typeof window !== 'undefined') {
    const fontVar = getComputedStyle(document.documentElement).getPropertyValue('--font-jetbrains');
    const bodyFont = getComputedStyle(document.body).fontFamily;
    fetch('http://127.0.0.1:7244/ingest/fc0fd57c-00b9-4980-affa-2a3b4cd560ee',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'layout.tsx:61',message:'Font variables check',data:{fontVariable:fontVar,bodyFontFamily:bodyFont,jetbrainsMonoVariable:jetbrainsMono.variable,hasVariable:!!jetbrainsMono.variable},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'A'})}).catch(()=>{});
  }
  // #endregion
  return (
    <html lang="en" className={jetbrainsMono.variable}>
      <body className="font-mono bg-neutral text-neutral-200 antialiased">
        <LanguageProvider>
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
                fontFamily: 'var(--font-jetbrains), monospace',
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
        </LanguageProvider>
      </body>
    </html>
  )
}
