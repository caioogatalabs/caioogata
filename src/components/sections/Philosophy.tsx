'use client'

import { useLanguage } from '@/components/providers/LanguageProvider'

export default function Philosophy() {
  const { content } = useLanguage()

  return (
    <section id="philosophy" aria-labelledby="philosophy-heading" className="text-left">
      <div className="grid grid-cols-1 md:grid-cols-[10fr_50fr_20fr] gap-8 md:gap-12">
        {/* Col 10%: title */}
        <h2 id="philosophy-heading" className="text-base font-bold text-primary font-mono">
          {content.philosophy.heading}
        </h2>
        {/* Col 50%: body */}
        <div className="space-y-4">
          {content.philosophy.body.split('\n\n').map((paragraph, index) => (
            <p
              key={index}
              className="text-sm text-neutral-400 font-mono leading-relaxed"
            >
              {paragraph}
            </p>
          ))}
        </div>
        {/* Col 20%: philosophy title as subtitle */}
        <div className="flex flex-col w-full">
          <p className="text-sm text-neutral-400 font-mono leading-relaxed">
            {content.philosophy.title}
          </p>
        </div>
      </div>
    </section>
  )
}
