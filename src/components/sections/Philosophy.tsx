'use client'

import { useEffect } from 'react'
import { useLanguage } from '@/components/providers/LanguageProvider'
import { useNavigation } from '@/components/providers/NavigationProvider'
import SectionHeading from '@/components/ui/SectionHeading'
import ExpandableSection from '@/components/ui/ExpandableSection'

export default function Philosophy() {
  const { content } = useLanguage()
  const { subItemIndex, setSubItemsCount, expandedSubItems, toggleSubItemExpanded } = useNavigation()

  // Set the number of sub-items for keyboard navigation (just 1 item)
  useEffect(() => {
    setSubItemsCount(1)
  }, [setSubItemsCount])

  const isSelected = subItemIndex === 0
  const isExpanded = expandedSubItems.has(0)

  return (
    <section id="philosophy" aria-labelledby="philosophy-heading">
      <SectionHeading command={content.philosophy.command} id="philosophy-heading">
        {content.philosophy.heading}
      </SectionHeading>

      <ExpandableSection
        title={content.philosophy.title}
        isSelected={isSelected}
        isExpanded={isExpanded}
        onToggle={() => toggleSubItemExpanded(0)}
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
