'use client'

import { useLanguage } from '@/components/providers/LanguageProvider'
import CopyDropdown from './CopyDropdown'
import ExternalLinkIcon from '@/components/ui/ExternalLinkIcon'

export default function Hero() {
  const { content } = useLanguage()

  return (
    <section className="w-full">
      <div className="max-w-content mx-0 px-6 pt-6 pb-8 md:px-12 md:pt-8 md:pb-10 lg:px-16 w-full">
        <div className="mb-6">
          <p className="text-sm text-neutral-400 font-mono mb-4 leading-relaxed">
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
            className="inline-flex items-center px-1.5 py-1.5
                       border border-primary/30 text-secondary
                       rounded-base font-mono text-sm
                       hover:border-primary hover:text-primary hover:bg-primary/10
                       transition-colors duration-200
                       focus:outline-none focus-visible:border-primary focus-visible:text-primary focus-visible:bg-primary/10"
            aria-label="View Caio Ogata's profile on LinkedIn (opens in new tab)"
          >
            {content.hero.cta.linkedin}
            <span
              className="ml-1.5 inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-sm bg-primary text-neutral-950"
              aria-hidden="true"
            >
              <ExternalLinkIcon />
            </span>
          </a>
        </div>
      </div>
    </section>
  )
}
