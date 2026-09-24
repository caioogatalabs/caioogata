import { PhilosophySection } from '@/components/sections/v2/PhilosophySection'
import { staticPageMetadata } from '@/lib/seo'

export const metadata = staticPageMetadata('pt', 'philosophy', '/philosophy')

export default function PhilosophyPage() {
  return (
    <main id="main-content">
      <PhilosophySection />
    </main>
  )
}
