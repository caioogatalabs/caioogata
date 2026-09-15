import type { Metadata } from 'next'
import { AboutSection } from '@/components/sections/v2/AboutSection'

export const metadata: Metadata = {
  title: 'About - Caio Ogata',
  description: 'Caio Ogata is a Creative Designer. A former art director with a background in user interfaces and a self-taught path into development.',
}

export default function AboutPage() {
  return (
    <main id="main-content">
      <AboutSection />
    </main>
  )
}
