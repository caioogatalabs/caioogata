'use client'

import { useLanguage } from '@/components/providers/LanguageProvider'

export default function About() {
  const { content } = useLanguage()

  return (
    <section id="about" aria-labelledby="about-heading" className="text-left">
      <div className="grid grid-cols-1 md:grid-cols-[10fr_50fr_20fr] gap-8 md:gap-12">
        {/* Col 10%: title */}
        <h2 id="about-heading" className="text-base font-bold text-primary font-mono">
          {content.about.heading}
        </h2>
        {/* Col 50%: bio */}
        <div className="space-y-4">
          {content.about.bio.split('\n\n').map((paragraph, index) => (
            <p
              key={index}
              className="text-sm text-neutral-400 font-mono leading-relaxed"
            >
              {paragraph}
            </p>
          ))}
        </div>
        {/* Col 20%: Core Expertise list with dividers like Contact */}
        <div className="flex flex-col w-full">
          <p className="text-sm font-mono text-primary py-2 border-t border-secondary/10 first:border-t-0 first:pt-0">
            Core Expertise
          </p>
          {content.about.expertise.map((item, index) => (
            <p
              key={index}
              className="text-sm text-neutral-400 font-mono py-2 border-t border-secondary/10"
            >
              {item}
            </p>
          ))}
        </div>
      </div>
    </section>
  )
}
