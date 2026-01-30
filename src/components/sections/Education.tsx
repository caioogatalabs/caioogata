'use client'

import { useRef, useEffect } from 'react'
import { useLanguage } from '@/components/providers/LanguageProvider'
import { useNavigation } from '@/components/providers/NavigationProvider'
import SectionHeading from '@/components/ui/SectionHeading'
import ExpandableSection from '@/components/ui/ExpandableSection'

export default function Education() {
  const { content } = useLanguage()
  const { subItemIndex, setSubItemIndex, setSubItemsCount, expandedSubItems, toggleSubItemExpanded } = useNavigation()
  const sectionRefs = useRef<(HTMLButtonElement | null)[]>([])

  // Calculate total items: education items + additional training (if exists)
  const hasAdditional = content.education.additional && content.education.additional.length > 0
  const totalItems = content.education.items.length + (hasAdditional ? 1 : 0)

  // Set the number of sub-items for keyboard navigation
  useEffect(() => {
    setSubItemsCount(totalItems)
  }, [totalItems, setSubItemsCount])

  // When subItemIndex changes via Arrow keys, move focus to the selected section (keeps Tab and Arrow in sync)
  useEffect(() => {
    const currentFocusedIsSection = sectionRefs.current.some(ref => ref === document.activeElement)
    if (!currentFocusedIsSection && sectionRefs.current[subItemIndex]) {
      sectionRefs.current[subItemIndex]?.focus()
    }
  }, [subItemIndex])

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
              ref={el => { sectionRefs.current[index] = el }}
              title={title}
              isSelected={isSelected}
              isExpanded={isExpanded}
              onToggle={() => toggleSubItemExpanded(index)}
              onFocus={() => setSubItemIndex(index)}
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
            ref={el => { sectionRefs.current[content.education.items.length] = el }}
            title="Additional Training"
            isSelected={subItemIndex === content.education.items.length}
            isExpanded={expandedSubItems.has(content.education.items.length)}
            onToggle={() => toggleSubItemExpanded(content.education.items.length)}
            onFocus={() => setSubItemIndex(content.education.items.length)}
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
