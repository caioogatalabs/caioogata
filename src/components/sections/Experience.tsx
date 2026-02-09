'use client'

import { useRef, useEffect } from 'react'
import { clsx } from 'clsx'
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
          const hasContent = !!(job.description || (job.achievements && job.achievements.length > 0))

          const titleContent = (
            <div className="flex flex-col gap-1 md:grid md:grid-cols-[2fr_3fr_3fr] md:gap-4 md:items-center w-full">
              <span className="truncate">{job.dateRange}</span>
              <span className="truncate">{job.company}</span>
              <span className="truncate">{job.title}</span>
            </div>
          )

          if (!hasContent) {
            return (
              <div
                key={index}
                className="group border-t transition-colors duration-150 border-secondary/10 pl-6"
              >
                <button
                  ref={el => { sectionRefs.current[index] = el }}
                  type="button"
                  onFocus={() => setSubItemIndex(index)}
                  className={clsx(
                    'w-full text-left py-2 font-mono text-sm transition-colors duration-150 flex items-center justify-between focus:outline-none cursor-default',
                    isSelected
                      ? 'text-primary opacity-100'
                      : 'text-secondary opacity-60'
                  )}
                  tabIndex={0}
                >
                  <span className="flex items-center gap-2 min-w-0 flex-1">{titleContent}</span>
                </button>
              </div>
            )
          }

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
                  <div className="columns-1 md:columns-2 gap-6">
                    <p className="text-sm text-neutral-300 font-mono leading-relaxed break-inside-avoid">
                      {job.description}
                    </p>
                  </div>
                  <div>
                    <h3 className="text-sm text-secondary py-2.5 px-4 text-left font-mono leading-relaxed mb-0">
                      Achievements
                    </h3>
                    {/* Mobile: stacked cards */}
                    <div className="md:hidden border border-dotted border-secondary/30 rounded-base font-mono">
                      <div className="flex flex-col">
                        {job.achievements.map((achievement, achievementIndex) => (
                          <div
                            key={achievementIndex}
                            className="text-sm text-neutral-300 py-2.5 px-4 text-left font-mono border-b border-dotted border-secondary/30 last:border-b-0"
                          >
                            <div className="flex flex-col">
                              <p className="text-sm text-neutral-300 font-mono leading-relaxed mb-2">
                                {achievement.text}
                              </p>
                              <div className="border-b border-dotted border-secondary/30 mb-2"></div>
                              <p className="text-sm text-secondary font-mono">
                                +{((achievementIndex + 1) * 10)}%
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                    {/* Desktop: horizontal table */}
                    <div className="hidden md:block border border-dotted border-secondary/30 rounded-base font-mono overflow-x-auto">
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
                                  <p className="text-sm text-secondary font-mono">
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
                <div className="columns-1 md:columns-2 gap-6">
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
