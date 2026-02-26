'use client'

import { useLanguage } from '@/components/providers/LanguageProvider'
import SectionHeading from '@/components/ui/SectionHeading'

export default function Philosophy() {
  const { content } = useLanguage()

  return (
    <section id="philosophy" aria-labelledby="philosophy-heading" className="text-left">
      <SectionHeading id="philosophy-heading">
        {content.philosophy.heading}
      </SectionHeading>

      <div className="mt-2">
        <div className="pl-6 flex flex-col gap-2 md:grid md:grid-cols-[180px_100px_1fr] md:items-baseline md:gap-0">
          <span className="hidden md:block" aria-hidden />
          <span className="hidden md:block" aria-hidden />
          <div className="min-w-0 space-y-4 py-0.5">
            <p className="text-sm font-mono font-bold text-primary">
              {content.philosophy.title}
            </p>
            {content.philosophy.body.split('\n\n').map((paragraph, index) => (
              <p
                key={index}
                className="text-sm text-neutral-300 font-mono leading-relaxed"
              >
                {paragraph}
              </p>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
