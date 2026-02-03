'use client'

import { useLanguage } from '@/components/providers/LanguageProvider'
import SectionHeading from '@/components/ui/SectionHeading'

export default function Skills() {
  const { content } = useLanguage()

  return (
    <section id="skills" aria-labelledby="skills-heading">
      <SectionHeading id="skills-heading">
        {content.skills.heading}
      </SectionHeading>

      <div className="grid gap-4 md:grid-cols-2">
        {content.skills.categories.map((category, index) => (
          <div key={index}>
            <h3 className="text-base font-bold text-primary font-mono mb-6">
              {category.title}
            </h3>
            <div className="flex flex-wrap gap-1.5">
              {category.skills.map((skill, skillIndex) => (
                <span
                  key={skillIndex}
                  className="px-2 py-1 bg-neutral border border-secondary/10
                             text-neutral-300 rounded-base text-sm
                             font-mono"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
