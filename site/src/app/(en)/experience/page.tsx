import { ExperienceSection } from '@/components/sections/v2/ExperienceSection'
import { staticPageMetadata } from '@/lib/seo'

export const metadata = staticPageMetadata('en', 'experience', '/experience')

export default function ExperiencePage() {
  return (
    <main id="main-content">
      <ExperienceSection />
    </main>
  )
}
