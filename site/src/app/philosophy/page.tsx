import type { Metadata } from 'next'
import { PhilosophySection } from '@/components/sections/v2/PhilosophySection'

export const metadata: Metadata = {
  title: 'Philosophy - Caio Ogata',
  description: 'Fall, learn, evolve — design principles drawn from Judo, skateboarding, and twenty years of shipping product.',
}

export default function PhilosophyPage() {
  return (
    <main id="main-content">
      <PhilosophySection />
    </main>
  )
}
