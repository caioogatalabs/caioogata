'use client'

import { useLanguage } from '@/components/providers/LanguageProvider'
import ArrowRightIcon from '@/components/ui/ArrowRightIcon'

export default function About() {
  const { content } = useLanguage()

  return (
    <section id="about" aria-labelledby="about-heading" className="text-left">
      {/* Title row — same as Contact */}
      <div className="flex items-center gap-2 mb-6">
        <span className="w-4 shrink-0 flex items-center justify-center text-primary" aria-hidden>
          <ArrowRightIcon />
        </span>
        <h2 id="about-heading" className="text-base font-bold text-primary font-mono">
          {content.about.heading}
        </h2>
      </div>

      {/* Two columns: 60% text, 40% expertise */}
      <div className="grid grid-cols-1 md:grid-cols-[6fr_4fr] gap-8 md:gap-12">
        <div className="space-y-4 min-w-0 pl-6">
          {content.about.bio.split('\n\n').map((paragraph, index) => (
            <p
              key={index}
              className="text-sm text-neutral-300 font-mono leading-relaxed"
            >
              {paragraph}
            </p>
          ))}
        </div>

        <div className="flex flex-col w-full min-w-0">
          <p className="text-sm font-mono text-primary py-2 border-t border-secondary/10 first:border-t-0 first:pt-0">
            Core Expertise
          </p>
          {content.about.expertise.map((item, index) => (
            <p
              key={index}
              className="text-sm text-neutral-300 font-mono py-2 border-t border-secondary/10"
            >
              {item}
            </p>
          ))}
        </div>
      </div>
    </section>
  )
}
