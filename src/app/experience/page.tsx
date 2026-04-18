import type { Metadata } from 'next'
import { ExperienceSection } from '@/components/sections/v2/ExperienceSection'

export const metadata: Metadata = {
  title: 'Experience - Caio Ogata',
  description: '12+ years of design engineering leadership across 6 companies.',
}

export default function ExperiencePage() {
  return (
    <main id="main-content">
      <ExperienceSection />
    </main>
  )
}
