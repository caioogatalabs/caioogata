import { AboutSection } from '@/components/sections/v2/AboutSection'
import { staticPageMetadata } from '@/lib/seo'

export const metadata = staticPageMetadata('pt', 'about', '/about')

export default function AboutPage() {
  return (
    <main id="main-content">
      <AboutSection />
    </main>
  )
}
