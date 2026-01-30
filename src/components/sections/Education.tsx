'use client'

import { useEffect } from 'react'
import { useLanguage } from '@/components/providers/LanguageProvider'
import { useNavigation } from '@/components/providers/NavigationProvider'
import SectionHeading from '@/components/ui/SectionHeading'
import ExpandableSection from '@/components/ui/ExpandableSection'

export default function Education() {
  const { content } = useLanguage()
  const { subItemIndex, setSubItemsCount, expandedSubItems, toggleSubItemExpanded } = useNavigation()

  // Calculate total items: education items + additional training (if exists)
  const hasAdditional = content.education.additional && content.education.additional.length > 0
  const totalItems = content.education.items.length + (hasAdditional ? 1 : 0)

  // Set the number of sub-items for keyboard navigation
  useEffect(() => {
    setSubItemsCount(totalItems)
  }, [totalItems, setSubItemsCount])

  return (
    <section id="education" aria-labelledby="education-heading">
      <SectionHeading command={content.education.command} id="education-heading">
        {content.education.heading}
      </SectionHeading>

      <div className="space-y-0">
        {content.education.items.map((edu, index) => {
          const title = `${edu.degree} @ ${edu.institution} | ${edu.year}`
          const isSelected = subItemIndex === index
          const isExpanded = expandedSubItems.has(index)

          return (
            <ExpandableSection
              key={index}
              title={title}
              isSelected={isSelected}
              isExpanded={isExpanded}
              onToggle={() => toggleSubItemExpanded(index)}
            >
              <div className="flex items-center gap-2 mb-1">
                <span className="text-secondary font-mono">@</span>
                <p className="text-base text-secondary">
                  {edu.institution}
                </p>
              </div>
              <p className="text-sm text-neutral-400 font-mono ml-4 mb-2">
                {edu.location} | {edu.year}
              </p>
              {edu.note && (
                <p className="text-sm text-primary italic ml-4">
                  {edu.note}
                </p>
              )}
            </ExpandableSection>
          )
        })}

        {hasAdditional && (
          <ExpandableSection
            title="Additional Training"
            isSelected={subItemIndex === content.education.items.length}
            isExpanded={expandedSubItems.has(content.education.items.length)}
            onToggle={() => toggleSubItemExpanded(content.education.items.length)}
          >
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
