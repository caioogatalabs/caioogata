import SkipLink from '@/components/ui/SkipLink'
import Intro from '@/components/sections/Intro'
import Hero from '@/components/hero/Hero'
import Projects from '@/components/sections/Projects'
import About from '@/components/sections/About'
import Experience from '@/components/sections/Experience'
import Skills from '@/components/sections/Skills'
import Education from '@/components/sections/Education'
import Clients from '@/components/sections/Clients'
import Philosophy from '@/components/sections/Philosophy'
import Contact from '@/components/sections/Contact'
import Footer from '@/components/layout/Footer'

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
        <div className="w-full">
          <div className="max-w-content mx-0 px-6 md:px-12 lg:px-16 pt-8 md:pt-12 pb-8 md:pb-12 w-full">
            <Intro />
          </div>

          <Hero />

          <div className="max-w-content mx-0 px-6 md:px-12 lg:px-16 space-y-12 pb-16 md:pb-20 w-full">
            <Projects />
            <About />
            <Experience />
            <Skills />
            <Education />
            <Clients />
            <Philosophy />
            <Contact />
          </div>
        </div>
      </main>

      <Footer />
    </>
  )
}
