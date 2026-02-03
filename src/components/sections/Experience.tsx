'use client'

import { useRef, useEffect } from 'react'
import { useLanguage } from '@/components/providers/LanguageProvider'
import { useNavigation } from '@/components/providers/NavigationProvider'
import SectionHeading from '@/components/ui/SectionHeading'
import ExpandableSection from '@/components/ui/ExpandableSection'

export default function Experience() {
  const { content } = useLanguage()
  const { subItemIndex, setSubItemIndex, setSubItemsCount, expandedSubItems, toggleSubItemExpanded } = useNavigation()
  const sectionRefs = useRef<(HTMLButtonElement | null)[]>([])

  // Set the number of sub-items for keyboard navigation
  useEffect(() => {
    setSubItemsCount(content.experience.jobs.length)
  }, [content.experience.jobs.length, setSubItemsCount])

  // When subItemIndex changes via Arrow keys, move focus to the selected section (keeps Tab and Arrow in sync)
  useEffect(() => {
    const currentFocusedIsSection = sectionRefs.current.some(ref => ref === document.activeElement)
    if (!currentFocusedIsSection && sectionRefs.current[subItemIndex]) {
      sectionRefs.current[subItemIndex]?.focus()
    }
  }, [subItemIndex])

  return (
    <section id="experience" aria-labelledby="experience-heading">
      <SectionHeading command={content.experience.command} id="experience-heading">
        {content.experience.heading}
      </SectionHeading>

      <div className="space-y-0">
        {content.experience.jobs.map((job, index) => {
          const isSelected = subItemIndex === index
          const isExpanded = expandedSubItems.has(index)

          const titleContent = (
            <div className="grid grid-cols-[2fr_3fr_3fr] gap-4 items-center w-full">
              <span className="truncate">{job.dateRange}</span>
              <span className="truncate">{job.company}</span>
              <span className="truncate">{job.title}</span>
            </div>
          )

          return (
            <ExpandableSection
              key={index}
              ref={el => { sectionRefs.current[index] = el }}
              title={titleContent}
              isSelected={isSelected}
              isExpanded={isExpanded}
              onToggle={() => toggleSubItemExpanded(index)}
              onFocus={() => setSubItemIndex(index)}
            >
              {job.achievements && job.achievements.length > 0 ? (
                <div className="grid grid-cols-[3fr_2fr] gap-6">
                  <div>
                    <p className="text-sm text-neutral-400 font-mono leading-relaxed">
                      {job.description}
                    </p>
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-element-sm ml-4">
                      <span className="text-primary font-mono">$</span>
                      <span className="text-primary font-mono text-sm">Achievements</span>
                    </div>
                    <ul className="ml-4" role="list">
                      {job.achievements.map((achievement, achievementIndex) => (
                        <li
                          key={achievementIndex}
                          className="text-sm text-neutral-400 font-mono border-t border-secondary/10 py-2 first:border-t-0 first:pt-0 first:pb-2"
                        >
                          {achievement.text}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              ) : (
                <p className="text-sm text-neutral-400 font-mono leading-relaxed">
                  {job.description}
                </p>
              )}
            </ExpandableSection>
          )
        })}
      </div>
    </section>
  )
}
