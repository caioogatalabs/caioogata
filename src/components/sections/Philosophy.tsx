'use client'

import { useRef, useEffect } from 'react'
import { useLanguage } from '@/components/providers/LanguageProvider'
import { useNavigation } from '@/components/providers/NavigationProvider'
import SectionHeading from '@/components/ui/SectionHeading'
import ExpandableSection from '@/components/ui/ExpandableSection'

export default function Philosophy() {
  const { content } = useLanguage()
  const { subItemIndex, setSubItemIndex, setSubItemsCount, expandedSubItems, toggleSubItemExpanded } = useNavigation()
  const sectionRef = useRef<HTMLButtonElement | null>(null)

  // Set the number of sub-items for keyboard navigation (just 1 item)
  useEffect(() => {
    setSubItemsCount(1)
  }, [setSubItemsCount])

  // When subItemIndex changes via Arrow keys, move focus to the section (keeps Tab and Arrow in sync)
  useEffect(() => {
    if (subItemIndex === 0 && document.activeElement !== sectionRef.current) {
      sectionRef.current?.focus()
    }
  }, [subItemIndex])

  const isSelected = subItemIndex === 0
  const isExpanded = expandedSubItems.has(0)

  return (
    <section id="philosophy" aria-labelledby="philosophy-heading">
      <SectionHeading command={content.philosophy.command} id="philosophy-heading">
        {content.philosophy.heading}
      </SectionHeading>

      <ExpandableSection
        ref={sectionRef}
        title={content.philosophy.title}
        isSelected={isSelected}
        isExpanded={isExpanded}
        onToggle={() => toggleSubItemExpanded(0)}
        onFocus={() => setSubItemIndex(0)}
      >
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
