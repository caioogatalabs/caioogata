'use client'

import { useLanguage } from '@/components/providers/LanguageProvider'
import ExternalLinkIcon from '@/components/ui/ExternalLinkIcon'

export default function Contact() {
  const { content } = useLanguage()

  return (
    <section id="contact" aria-labelledby="contact-heading" className="text-left">
      <div className="grid grid-cols-1 md:grid-cols-[10fr_50fr_20fr] gap-8 md:gap-12">
        {/* Col 10%: title */}
        <h2 id="contact-heading" className="text-base font-bold text-primary font-mono">
          {content.contact.heading}
        </h2>
        {/* Col 50%: text */}
        <div className="space-y-4">
          <p className="text-sm text-neutral-400 font-mono leading-relaxed">
            {content.hero.location}
          </p>
          {content.contact.description.split('\n\n').map((paragraph, index) => (
            <p
              key={index}
              className="text-sm text-neutral-400 font-mono leading-relaxed"
            >
              {paragraph}
            </p>
          ))}
        </div>

        {/* Right: email + links stacked vertically, divided like experience list */}
        <div className="flex flex-col w-full">
          <a
            href={`mailto:${content.contact.email}`}
            className="block w-full text-sm font-mono text-secondary/70 hover:text-primary focus:outline-none focus-visible:text-primary transition-colors duration-200 border-t border-secondary/10 py-2 first:border-t-0 first:pt-0"
          >
            {content.contact.email}
          </a>
          {content.contact.links.map((link, index) => (
            <a
              key={index}
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-between w-full py-2 border-t border-secondary/10
                         text-secondary/70 font-mono text-sm
                         hover:text-primary focus:outline-none focus-visible:text-primary transition-colors duration-200"
              aria-label={`${link.label} (opens in new tab)`}
            >
              <span>{link.label}</span>
              <span
                className="inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-sm bg-primary text-neutral-950"
                aria-hidden="true"
              >
                <ExternalLinkIcon />
              </span>
            </a>
          ))}
        </div>
      </div>
    </section>
  )
}
