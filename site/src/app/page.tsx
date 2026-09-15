import SkipLink from '@/components/ui/SkipLink'
import { PageShell } from '@/components/layout/PageShell'

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
