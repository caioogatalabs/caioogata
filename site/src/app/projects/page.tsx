import type { Metadata } from 'next'
import { ProjectsSection } from '@/components/sections/v2/ProjectsSection'

export const metadata: Metadata = {
  title: 'Projects - Caio Ogata',
  description: 'Selected design engineering work across design systems, brand expansion, and developer-facing consoles.',
}

export default function ProjectsPage() {
  return (
    <main id="main-content">
      <ProjectsSection />
    </main>
  )
}
