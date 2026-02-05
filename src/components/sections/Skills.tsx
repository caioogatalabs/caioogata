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

      <div className="grid gap-4 md:grid-cols-2 pl-6">
        {content.skills.categories.map((category, catIndex) => (
          <div key={catIndex} className={`flex flex-col gap-3 ${catIndex >= 2 ? 'mt-6' : ''}`}>
            <h3 className="text-sm text-neutral-300 font-mono leading-relaxed">
              {category.title}
            </h3>
            <div className="flex flex-col">
              {category.skills.map((skill, skillIndex) => (
                <div
                  key={skillIndex}
                  className="relative border border-dotted border-secondary/30 -mt-px
                             first:rounded-t-base last:rounded-b-base
                             overflow-hidden"
                >
                  <div
                    className="absolute inset-0
                               animate-[bar-fill_0.6s_ease-out_both]"
                    style={{
                      width: `${skill.level}%`,
                      animationDelay: `${catIndex * 100 + skillIndex * 50}ms`,
                    }}
                  >
                    <div className="absolute inset-0 bg-neutral-700" />
                    <div
                      className="absolute inset-y-0 right-0 w-8"
                      style={{
                        background: `
                          linear-gradient(to right, transparent 50%, var(--bg-neutral)),
                          repeating-conic-gradient(var(--bg-neutral) 0% 25%, transparent 0% 50%) 0 0 / 4px 4px
                        `,
                        WebkitMaskImage: 'linear-gradient(to right, transparent, black)',
                        maskImage: 'linear-gradient(to right, transparent, black)',
                      }}
                    />
                  </div>
                  <div className="relative flex justify-between items-center
                                  px-2 py-1">
                    <span className="text-sm font-mono text-neutral-300">
                      {skill.name}
                    </span>
                    <span
                      className="text-sm font-mono text-neutral-300
                                 animate-[fade-in_0.4s_ease-out_both]"
                      style={{
                        animationDelay: `${catIndex * 100 + skillIndex * 50 + 300}ms`,
                      }}
                    >
                      {skill.level}%
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
