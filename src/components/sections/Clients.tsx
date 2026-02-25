'use client'

import { useLanguage } from '@/components/providers/LanguageProvider'
import SectionHeading from '@/components/ui/SectionHeading'

export default function Clients() {
  const { content } = useLanguage()

  const allClients = [
    ...content.clients.brazilian,
    ...content.clients.international,
    ...(content.clients.other ?? []),
  ]

  return (
    <section id="clients" aria-labelledby="clients-heading">
      <SectionHeading id="clients-heading">
        {content.clients.heading}
      </SectionHeading>

      <p className="text-sm text-neutral-300 font-mono leading-relaxed mb-6">
        {content.clients.description}
      </p>

      <div className="border border-dotted border-secondary/30 rounded-base p-2 sm:p-3">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-3">
          {allClients.map((client, index) => (
            <div
              key={`${client}-${index}`}
              className="border border-dotted border-secondary/30 rounded-base p-4 min-h-[100px] flex items-center justify-center bg-[var(--bg-neutral)]"
            >
              <span className="text-sm font-mono text-secondary/70 text-center">
                {client}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
