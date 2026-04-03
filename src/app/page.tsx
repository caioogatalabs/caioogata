import SkipLink from '@/components/ui/SkipLink'
import { PageShell } from '@/components/layout/PageShell'

export default function Home() {
  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: 'Caio Ogata',
    jobTitle: 'Design Director',
    description: 'Design Director specializing in design systems, brand experience, and developer-focused products',
    url: 'https://www.caioogata.com',
    sameAs: [
      'https://www.linkedin.com/in/caioogata/',
      'https://github.com/caioogatalabs',
      'https://www.instagram.com/caioogata.labs',
      'https://medium.com/@caioogata',
    ],
    address: {
      '@type': 'PostalAddress',
      addressLocality: 'Porto Alegre',
      addressRegion: 'RS',
      addressCountry: 'BR',
    },
    knowsAbout: [
      'Design Systems',
      'UI/UX Design',
      'Developer Experience',
      'Brand Strategy',
      'Design Leadership',
    ],
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />

      <SkipLink />

      <main id="main-content">
        <PageShell />
      </main>
    </>
  )
}
