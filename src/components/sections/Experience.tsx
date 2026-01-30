'use client'

import { useEffect } from 'react'
import { useLanguage } from '@/components/providers/LanguageProvider'
import { useNavigation } from '@/components/providers/NavigationProvider'
import SectionHeading from '@/components/ui/SectionHeading'
import ExpandableSection from '@/components/ui/ExpandableSection'

export default function Experience() {
  const { content } = useLanguage()
  const { subItemIndex, setSubItemsCount, expandedSubItems, toggleSubItemExpanded } = useNavigation()

  // Set the number of sub-items for keyboard navigation
  useEffect(() => {
    setSubItemsCount(content.experience.jobs.length)
  }, [content.experience.jobs.length, setSubItemsCount])

  return (
    <section id="experience" aria-labelledby="experience-heading">
      <SectionHeading command={content.experience.command} id="experience-heading">
        {content.experience.heading}
      </SectionHeading>

      <div className="space-y-0">
        {content.experience.jobs.map((job, index) => {
          const title = `${job.title} @ ${job.company} | ${job.dateRange}`
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
              {job.achievements && job.achievements.length > 0 ? (
                <div className="grid grid-cols-[3fr_2fr] gap-6">
                  <div>
                    <div className="flex items-center gap-2 mb-element-sm">
                      <span className="text-secondary font-mono">@</span>
                      <p className="text-base text-secondary font-bold">
                        {job.company}
                      </p>
                    </div>
                    <p className="text-sm text-neutral-400 font-mono mb-4">
                      {job.dateRange} | {job.location}
                    </p>
                    <p className="text-base text-secondary leading-relaxed">
                      {job.description}
                    </p>
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-element-sm">
                      <span className="text-primary font-mono">$</span>
                      <span className="text-primary font-mono text-sm">Achievements</span>
                    </div>
                    <ul className="space-y-1.5 ml-4" role="list">
                      {job.achievements.map((achievement, achievementIndex) => (
                        <li
                          key={achievementIndex}
                          className="text-base text-secondary flex items-start"
                        >
                          <span className="text-primary mr-2 flex-shrink-0" aria-hidden="true">
                            •
                          </span>
                          <span>{achievement.text}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              ) : (
                <div>
                  <div className="flex items-center gap-2 mb-element-sm">
                    <span className="text-secondary font-mono">@</span>
                    <p className="text-base text-secondary font-bold">
                      {job.company}
                    </p>
                  </div>
                  <p className="text-sm text-neutral-400 font-mono mb-4">
                    {job.dateRange} | {job.location}
                  </p>
                  <p className="text-base text-secondary leading-relaxed">
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
