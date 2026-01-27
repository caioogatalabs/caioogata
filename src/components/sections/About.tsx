'use client'

import { useLanguage } from '@/components/providers/LanguageProvider'
import SectionHeading from '@/components/ui/SectionHeading'
import CLIBox from '@/components/ui/CLIBox'

export default function About() {
  const { content } = useLanguage()

  return (
    <section id="about" aria-labelledby="about-heading">
      <SectionHeading command={content.about.command} id="about-heading">
        {content.about.heading}
      </SectionHeading>

      <CLIBox>
        <div className="space-y-4">
          {content.about.bio.split('\n\n').map((paragraph, index) => (
            <p
              key={index}
              className="text-base text-secondary leading-relaxed"
            >
              {paragraph}
            </p>
          ))}
        </div>

        <div className="mt-6 pt-4">
          <div className="flex items-center gap-2 mb-3">
            <span className="text-primary font-mono">$</span>
            <span className="text-primary font-mono text-sm">Core Expertise</span>
          </div>
          <ul className="space-y-1.5" role="list">
            {content.about.expertise.map((item, index) => (
              <li
                key={index}
                className="text-base text-secondary flex items-start"
              >
                <span className="text-primary mr-2 flex-shrink-0" aria-hidden="true">
                  &gt;
                </span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </CLIBox>
    </section>
  )
}
