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
      <SectionHeading id="experience-heading">
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
              className="pl-6"
            >
              {job.achievements && job.achievements.length > 0 ? (
                <div className="flex flex-col gap-6">
                  <div className="columns-2 gap-6">
                    <p className="text-sm text-neutral-300 font-mono leading-relaxed break-inside-avoid">
                      {job.description}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-neutral-300 py-2.5 px-4 text-left font-mono leading-relaxed mb-0">
                      Achievements
                    </p>
                    <div className="border border-dotted border-secondary/30 rounded-base font-mono overflow-x-auto">
                      <table className="w-full border-collapse">
                        <tbody>
                          <tr>
                            {job.achievements.map((achievement, achievementIndex) => (
                              <td
                                key={achievementIndex}
                                className="text-sm text-neutral-300 py-2.5 px-4 text-left font-mono border-r border-dotted border-secondary/30 last:border-r-0 align-top"
                              >
                                <div className="flex flex-col">
                                  <p className="text-sm text-neutral-300 font-mono leading-relaxed mb-2">
                                    {achievement.text}
                                  </p>
                                  <div className="border-b border-dotted border-secondary/30 mb-2"></div>
                                  <p className="text-sm text-neutral-300 font-mono">
                                    +{((achievementIndex + 1) * 10)}%
                                  </p>
                                </div>
                              </td>
                            ))}
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="columns-2 gap-6">
                  <p className="text-sm text-neutral-300 font-mono leading-relaxed break-inside-avoid">
                    {job.description}
                  </p>
                </div>
              )}
            </ExpandableSection>
          )
        })}
      </div>
    </section>
  )
}
