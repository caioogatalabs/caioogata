import type { Metadata } from 'next'
import { ProjectsSection } from '@/components/sections/v2/ProjectsSection'

export const metadata: Metadata = {
  alternates: { canonical: '/projects' },
  title: 'Projects - Caio Ogata',
  description: 'Selected work, and what it took. A brand identity, the website that carries it, a shared kit of parts, a rebuilt product console, and eight years at a creative technology studio.',
}

export default function ProjectsPage() {
  return (
    <main id="main-content">
      <ProjectsSection />
    </main>
  )
}
