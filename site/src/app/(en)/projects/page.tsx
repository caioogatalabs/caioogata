import { ProjectsSection } from '@/components/sections/v2/ProjectsSection'
import { staticPageMetadata } from '@/lib/seo'

export const metadata = staticPageMetadata('en', 'projects', '/projects')

export default function ProjectsPage() {
  return (
    <main id="main-content">
      <ProjectsSection />
    </main>
  )
}
