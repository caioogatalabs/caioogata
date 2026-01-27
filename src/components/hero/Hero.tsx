'use client'

import { useLanguage } from '@/components/providers/LanguageProvider'
import CopyDropdown from './CopyDropdown'

export default function Hero() {
  const { content } = useLanguage()

  return (
    <section
      className="min-h-screen flex flex-col justify-center"
      aria-labelledby="hero-heading"
    >
      <div className="max-w-content mx-0 px-6 py-24 md:px-12 lg:px-16 w-full">
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-primary font-mono">$</span>
            <h1
              id="hero-heading"
              className="text-2xl font-bold text-primary tracking-tight"
            >
              {content.hero.name}
            </h1>
          </div>
          <p className="text-base text-secondary mb-4 leading-relaxed">
            {content.hero.tagline}
          </p>
          <p className="text-base text-secondary mb-4 leading-relaxed">
            {content.hero.summary}
          </p>
          <p className="text-sm text-neutral-400 font-mono">
            {content.hero.location}
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4">
          <CopyDropdown variant="primary" />

          <a
            href="https://www.linkedin.com/in/caioogata/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center px-3 py-1.5
                       border border-primary/30 text-secondary
                       rounded-base font-mono text-sm
                       hover:border-primary hover:text-primary hover:bg-primary/10
                       transition-colors duration-200
                       focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-neutral-950"
            aria-label="View Caio Ogata's profile on LinkedIn (opens in new tab)"
          >
            <span className="mr-1">&gt;</span>
            {content.hero.cta.linkedin}
          </a>
        </div>
      </div>
    </section>
  )
}
