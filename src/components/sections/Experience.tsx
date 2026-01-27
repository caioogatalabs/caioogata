'use client'

import { useLanguage } from '@/components/providers/LanguageProvider'
import SectionHeading from '@/components/ui/SectionHeading'
import ExpandableSection from '@/components/ui/ExpandableSection'

export default function Experience() {
  const { content } = useLanguage()

  return (
    <section id="experience" aria-labelledby="experience-heading">
      <SectionHeading command={content.experience.command} id="experience-heading">
        {content.experience.heading}
      </SectionHeading>

      <div className="space-y-4">
        {content.experience.jobs.map((job, index) => {
          const title = `${job.title} @ ${job.company} | ${job.dateRange}`
          
          return (
            <ExpandableSection key={index} title={title} defaultExpanded={false}>
              <div className="mb-4">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-primary font-mono">*</span>
                  <h3 className="text-base font-bold text-primary">
                    {job.title}
                  </h3>
                </div>
                <div className="flex items-center gap-2 mb-element-sm">
                  <span className="text-secondary font-mono">@</span>
                  <p className="text-base text-secondary font-bold">
                    {job.company}
                  </p>
                </div>
                <p className="text-sm text-neutral-400 font-mono ml-content-sm">
                  {job.dateRange} | {job.location}
                </p>
              </div>

              <p className="text-base text-secondary mb-content-sm leading-relaxed">
                {job.description}
              </p>

              {job.achievements && job.achievements.length > 0 && (
                <div className="pt-element">
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
              )}
            </ExpandableSection>
          )
        })}
      </div>
    </section>
  )
}
