'use client'

import { useLanguage } from '@/components/providers/LanguageProvider'
import SectionHeading from '@/components/ui/SectionHeading'

export default function Contact() {
  const { content } = useLanguage()

  return (
    <section id="contact" aria-labelledby="contact-heading" className="text-left">
      <SectionHeading command={content.contact.command} id="contact-heading">
        {content.contact.heading}
      </SectionHeading>

      <div className="space-y-4 mb-6">
        {content.contact.description.split('\n\n').map((paragraph, index) => (
          <p
            key={index}
            className="text-sm text-neutral-400 font-mono leading-relaxed"
          >
            {paragraph}
          </p>
        ))}
      </div>

      <div className="pt-4">
        <div className="flex items-center gap-2 mb-3">
          <span className="text-primary font-mono">$</span>
          <span className="text-primary font-mono text-sm">Links</span>
        </div>
        <div className="flex flex-wrap gap-2">
          {content.contact.links.map((link, index) => (
            <a
              key={index}
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center px-3 py-1.5
                         border border-primary/30 text-secondary
                         rounded-base font-mono text-sm
                         hover:border-primary hover:text-primary hover:bg-primary/10
                         transition-colors duration-200
                         focus:outline-none focus-visible:border-primary focus-visible:text-primary focus-visible:bg-primary/10"
              aria-label={`${link.label} (opens in new tab)`}
            >
              <span className="mr-1">&gt;</span>
              {link.label}
              <span className="ml-1.5 text-xs" aria-hidden="true">↗</span>
            </a>
          ))}
        </div>
      </div>
    </section>
  )
}
