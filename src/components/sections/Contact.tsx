'use client'

import { useLanguage } from '@/components/providers/LanguageProvider'
import SectionHeading from '@/components/ui/SectionHeading'
import CLIBox from '@/components/ui/CLIBox'

export default function Contact() {
  const { content } = useLanguage()

  return (
    <section id="contact" aria-labelledby="contact-heading">
      <SectionHeading command={content.contact.command} id="contact-heading">
        {content.contact.heading}
      </SectionHeading>

      <CLIBox>
        <div className="space-y-4 mb-6">
          {content.contact.description.split('\n\n').map((paragraph, index) => (
            <p
              key={index}
              className="text-base text-secondary leading-relaxed"
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
          <div className="flex flex-wrap gap-2 ml-4">
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
                           focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-neutral-950"
                aria-label={`${link.label} (opens in new tab)`}
              >
                <span className="mr-1">&gt;</span>
                {link.label}
                <span className="ml-1.5 text-xs" aria-hidden="true">↗</span>
              </a>
            ))}
          </div>
        </div>
      </CLIBox>
    </section>
  )
}
