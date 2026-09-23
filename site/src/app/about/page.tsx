import type { Metadata } from 'next'
import { AboutSection } from '@/components/sections/v2/AboutSection'

export const metadata: Metadata = {
  alternates: { canonical: '/about' },
  title: 'About - Caio Ogata',
  description: 'Caio Ogata is a Creative Designer. A former art director with a background in user interfaces and a self-taught path into development.',
  // Without this the page inherits the home's card wholesale: a share of
  // /about would show the home's title and link back to the root.
  openGraph: {
    title: 'About - Caio Ogata',
    description: 'Caio Ogata is a Creative Designer. A former art director with a background in user interfaces and a self-taught path into development.',
    url: 'https://www.caioogata.com/about',
  },
  twitter: {
    title: 'About - Caio Ogata',
    description: 'Caio Ogata is a Creative Designer. A former art director with a background in user interfaces and a self-taught path into development.',
  },
}

export default function AboutPage() {
  return (
    <main id="main-content">
      <AboutSection />
    </main>
  )
}
