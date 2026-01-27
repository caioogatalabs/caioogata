'use client'

import { useLanguage } from '@/components/providers/LanguageProvider'
import SectionHeading from '@/components/ui/SectionHeading'
import CLIBox from '@/components/ui/CLIBox'

export default function Clients() {
  const { content } = useLanguage()

  return (
    <section id="clients" aria-labelledby="clients-heading">
      <SectionHeading command={content.clients.command} id="clients-heading">
        {content.clients.heading}
      </SectionHeading>

      <CLIBox>
        <p className="text-base text-secondary leading-relaxed mb-6">
          {content.clients.description}
        </p>

        <div className="grid gap-6 md:grid-cols-2">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <span className="text-primary font-mono">/</span>
              <h3 className="text-base font-bold text-primary">
                Brazilian Brands
              </h3>
            </div>
            <ul className="space-y-1.5 ml-4" role="list">
              {content.clients.brazilian.map((client, index) => (
                <li
                  key={index}
                  className="text-base text-secondary flex"
                >
                  <span className="text-primary mr-2" aria-hidden="true">•</span>
                  <span>{client}</span>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <div className="flex items-center gap-2 mb-3">
              <span className="text-primary font-mono">/</span>
              <h3 className="text-base font-bold text-primary">
                International (via Mondelez)
              </h3>
            </div>
            <ul className="space-y-1.5 ml-4" role="list">
              {content.clients.international.map((client, index) => (
                <li
                  key={index}
                  className="text-base text-secondary flex"
                >
                  <span className="text-primary mr-2" aria-hidden="true">•</span>
                  <span>{client}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </CLIBox>
    </section>
  )
}
