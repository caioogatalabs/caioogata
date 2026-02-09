'use client'

import { useLanguage } from '@/components/providers/LanguageProvider'
import SectionHeading from '@/components/ui/SectionHeading'
import CLIBox from '@/components/ui/CLIBox'
import ArrowRightIcon from '@/components/ui/ArrowRightIcon'

export default function Clients() {
  const { content } = useLanguage()

  return (
    <section id="clients" aria-labelledby="clients-heading">
      <SectionHeading id="clients-heading">
        {content.clients.heading}
      </SectionHeading>

      <CLIBox>
        <p className="text-sm text-neutral-300 font-mono leading-relaxed mb-6">
          {content.clients.description}
        </p>

        <div className="grid gap-6 md:grid-cols-2">
          <div>
            <div className="flex items-center gap-2 mb-6">
              <span className="w-4 shrink-0 flex items-center justify-center text-primary" aria-hidden>
                <ArrowRightIcon />
              </span>
              <h3 className="text-base font-bold text-secondary font-mono">
                Brazilian Brands
              </h3>
            </div>
            <ul className="space-y-1.5 ml-4" role="list">
              {content.clients.brazilian.map((client, index) => (
<li
                key={index}
                className="text-sm text-neutral-300 font-mono flex"
              >
                  <span className="text-primary mr-2" aria-hidden="true">•</span>
                  <span>{client}</span>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <div className="flex items-center gap-2 mb-6">
              <span className="w-4 shrink-0 flex items-center justify-center text-primary" aria-hidden>
                <ArrowRightIcon />
              </span>
              <h3 className="text-base font-bold text-secondary font-mono">
                International (via Mondelez)
              </h3>
            </div>
            <ul className="space-y-1.5 ml-4" role="list">
              {content.clients.international.map((client, index) => (
                <li
                  key={index}
                  className="text-sm text-neutral-300 font-mono flex"
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
