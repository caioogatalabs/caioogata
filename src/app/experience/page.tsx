import type { Metadata } from 'next'
import { ExperienceSection } from '@/components/sections/v2/ExperienceSection'

export const metadata: Metadata = {
  title: 'Experience - Caio Ogata',
  description: '15+ years of design engineering practice across 6 companies, 2 executive roles.',
}

export default function ExperiencePage() {
  return (
    <main id="main-content">
      <ExperienceSection />
    </main>
  )
}
