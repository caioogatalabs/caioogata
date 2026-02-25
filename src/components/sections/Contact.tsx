'use client'

import { useLanguage } from '@/components/providers/LanguageProvider'
import ExternalLinkIcon from '@/components/ui/ExternalLinkIcon'
import ArrowRightIcon from '@/components/ui/ArrowRightIcon'
import ContactForm from '@/components/ui/ContactForm'

export default function Contact() {
  const { content } = useLanguage()

  return (
    <section id="contact" aria-labelledby="contact-heading" className="text-left">
      {/* Title row — arrow + label, no borders */}
      <div className="flex items-center gap-2 mb-6">
        <span className="w-4 shrink-0 flex items-center justify-center text-primary" aria-hidden>
          <ArrowRightIcon />
        </span>
        <h2 id="contact-heading" className="text-base font-bold text-primary font-mono">
          {content.contact.heading}
        </h2>
      </div>

      {/* Two columns: description text (left), email + links (right) */}
      <div className="grid grid-cols-1 md:grid-cols-[4fr_1fr] gap-8 md:gap-12">
        <div className="space-y-4 min-w-0 pl-6">
          <p className="text-sm text-neutral-300 font-mono leading-relaxed">
            {content.hero.location}
          </p>
          {content.contact.description.split('\n\n').map((paragraph, index) => (
            <p
              key={index}
              className="text-sm text-neutral-300 font-mono leading-relaxed"
            >
              {paragraph}
            </p>
          ))}
        </div>

        <div className="flex flex-col w-full min-w-0">
          {content.contact.links.map((link, index) => (
            <a
              key={index}
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-between w-full py-2 border-t border-secondary/10
                         text-secondary/70 font-mono text-sm
                         hover:text-primary focus:outline-none focus-visible:text-primary transition-colors duration-200 first:border-t-0 first:pt-0"
              aria-label={`${link.label} (opens in new tab)`}
            >
              <span className="min-w-0 truncate">{link.label}</span>
              <span
                className="inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-sm bg-primary text-neutral-950 ml-2"
                aria-hidden="true"
              >
                <ExternalLinkIcon />
              </span>
            </a>
          ))}
        </div>
      </div>

      {/* Contact Form + ASCII Smile — below description, full width */}
      <div className="mt-8 pl-6">
        <ContactForm />
      </div>
    </section>
  )
}
