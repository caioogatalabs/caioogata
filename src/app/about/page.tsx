import type { Metadata } from 'next'
import { AboutSection } from '@/components/sections/v2/AboutSection'

export const metadata: Metadata = {
  title: 'About - Caio Ogata',
  description: 'Design engineering leader bridging brand strategy, product craft, and technical implementation.',
}

export default function AboutPage() {
  return (
    <main id="main-content">
      <AboutSection />
    </main>
  )
}
