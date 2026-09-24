import SkipLink from '@/components/ui/SkipLink'
import { PageShell } from '@/components/layout/PageShell'
import { staticPageMetadata } from '@/lib/seo'

export const metadata = staticPageMetadata('en', 'home', '/')

export default function Home() {
  return (
    <>
      <SkipLink />

      <main id="main-content">
        <PageShell />
      </main>
    </>
  )
}
