import type { Metadata } from 'next'
import { SkillsSection } from '@/components/sections/v2/SkillsSection'

export const metadata: Metadata = {
  title: 'Skills - Caio Ogata',
  description: 'Design engineering skills mapped to real project work across 6 categories.',
}

export default function SkillsPage() {
  return (
    <main id="main-content">
      <SkillsSection />
    </main>
  )
}
