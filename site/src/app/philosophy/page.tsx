import type { Metadata } from 'next'
import { PhilosophySection } from '@/components/sections/v2/PhilosophySection'

export const metadata: Metadata = {
  alternates: { canonical: '/philosophy' },
  title: 'Philosophy - Caio Ogata',
  description: 'Fall, learn, evolve — design principles drawn from Judo, skateboarding, and twenty years of shipping product.',
  // Without this the page inherits the home's card wholesale: a share of
  // /philosophy would show the home's title and link back to the root.
  openGraph: {
    title: 'Philosophy - Caio Ogata',
    description: 'Fall, learn, evolve — design principles drawn from Judo, skateboarding, and twenty years of shipping product.',
    url: 'https://www.caioogata.com/philosophy',
  },
  twitter: {
    title: 'Philosophy - Caio Ogata',
    description: 'Fall, learn, evolve — design principles drawn from Judo, skateboarding, and twenty years of shipping product.',
  },
}

export default function PhilosophyPage() {
  return (
    <main id="main-content">
      <PhilosophySection />
    </main>
  )
}
