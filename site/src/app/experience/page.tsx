import type { Metadata } from 'next'
import { ExperienceSection } from '@/components/sections/v2/ExperienceSection'

export const metadata: Metadata = {
  alternates: { canonical: '/experience' },
  title: 'Experience - Caio Ogata',
  description: 'Agencies, then a studio, then a company of engineers. Twenty years of work, role by role.',
  // Without this the page inherits the home's card wholesale: a share of
  // /experience would show the home's title and link back to the root.
  openGraph: {
    title: 'Experience - Caio Ogata',
    description: 'Agencies, then a studio, then a company of engineers. Twenty years of work, role by role.',
    url: 'https://www.caioogata.com/experience',
  },
  twitter: {
    title: 'Experience - Caio Ogata',
    description: 'Agencies, then a studio, then a company of engineers. Twenty years of work, role by role.',
  },
}

export default function ExperiencePage() {
  return (
    <main id="main-content">
      <ExperienceSection />
    </main>
  )
}
