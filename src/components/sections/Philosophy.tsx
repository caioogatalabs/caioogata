'use client'

import { useLanguage } from '@/components/providers/LanguageProvider'
import SectionHeading from '@/components/ui/SectionHeading'
import ExpandableSection from '@/components/ui/ExpandableSection'

export default function Philosophy() {
  const { content } = useLanguage()

  return (
    <section id="philosophy" aria-labelledby="philosophy-heading">
      <SectionHeading command={content.philosophy.command} id="philosophy-heading">
        {content.philosophy.heading}
      </SectionHeading>

      <ExpandableSection title={content.philosophy.title}>
        <div className="space-y-4">
          {content.philosophy.body.split('\n\n').map((paragraph, index) => (
            <p
              key={index}
              className="text-base text-secondary leading-relaxed"
            >
              {paragraph}
            </p>
          ))}
        </div>
      </ExpandableSection>
    </section>
  )
}
