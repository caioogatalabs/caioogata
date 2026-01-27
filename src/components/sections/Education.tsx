'use client'

import { useLanguage } from '@/components/providers/LanguageProvider'
import SectionHeading from '@/components/ui/SectionHeading'
import ExpandableSection from '@/components/ui/ExpandableSection'

export default function Education() {
  const { content } = useLanguage()

  return (
    <section id="education" aria-labelledby="education-heading">
      <SectionHeading command={content.education.command} id="education-heading">
        {content.education.heading}
      </SectionHeading>

      <div className="space-y-4">
        {content.education.items.map((edu, index) => {
          const title = `${edu.degree} @ ${edu.institution} | ${edu.year}`
          
          return (
            <ExpandableSection key={index} title={title} defaultExpanded={false}>
              <div className="flex items-center gap-2 mb-2">
                <span className="text-primary font-mono">#</span>
                <h3 className="text-base font-bold text-primary">
                  {edu.degree}
                </h3>
              </div>
              <div className="flex items-center gap-2 mb-1 ml-4">
                <span className="text-secondary font-mono">@</span>
                <p className="text-base text-secondary">
                  {edu.institution}
                </p>
              </div>
              <p className="text-sm text-neutral-400 font-mono ml-6 mb-2">
                {edu.location} | {edu.year}
              </p>
              {edu.note && (
                <p className="text-sm text-primary italic ml-6">
                  {edu.note}
                </p>
              )}
            </ExpandableSection>
          )
        })}

        {content.education.additional && content.education.additional.length > 0 && (
          <ExpandableSection title="Additional Training" defaultExpanded={false}>
            <div className="flex items-center gap-2 mb-3">
              <span className="text-primary font-mono">$</span>
              <h3 className="text-base font-bold text-primary">
                Additional Training
              </h3>
            </div>
            <ul className="space-y-1.5 ml-4" role="list">
              {content.education.additional.map((item, index) => (
                <li
                  key={index}
                  className="text-base text-secondary flex"
                >
                  <span className="text-primary mr-2" aria-hidden="true">&gt;</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </ExpandableSection>
        )}
      </div>
    </section>
  )
}
