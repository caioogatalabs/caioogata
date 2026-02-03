'use client'

import { useMemo } from 'react'
import { useLanguage } from '@/components/providers/LanguageProvider'
import SectionHeading from '@/components/ui/SectionHeading'

/** Extract sort year from education year string (e.g. "2001 - 2005" -> 2005, "2009" -> 2009) */
function getSortYear(yearStr: string): number {
  const match = yearStr.match(/\b(19|20)\d{2}\b/g)
  if (!match || match.length === 0) return 0
  return Math.max(...match.map(Number))
}

export default function Education() {
  const { content } = useLanguage()

  const sortedItems = useMemo(() => {
    return [...content.education.items].sort(
      (a, b) => getSortYear(b.year) - getSortYear(a.year)
    )
  }, [content.education.items])

  const hasAdditional =
    content.education.additional && content.education.additional.length > 0

  return (
    <section id="education" aria-labelledby="education-heading">
      <SectionHeading id="education-heading">
        {content.education.heading}
      </SectionHeading>

      <div className="grid gap-4 md:grid-cols-2">
        {sortedItems.map((edu, index) => (
          <article
            key={index}
            className="rounded-base border border-neutral-400 bg-neutral p-4 md:p-5"
          >
            <h3 className="text-base font-bold text-primary font-mono mb-6">
              {edu.institution}
            </h3>
            <p className="text-sm text-neutral-300 font-mono mb-1">
              {edu.degree}
            </p>
            <p className="text-sm text-neutral-300 font-mono mb-2">
              {edu.location} · {edu.year}
            </p>
            {edu.note && (
              <p className="text-sm text-primary font-mono">{edu.note}</p>
            )}
          </article>
        ))}

        {hasAdditional && (
          <article
            className="rounded-base border border-neutral-400 bg-neutral p-4 md:p-5"
            aria-label="Additional training"
          >
            <h3 className="text-base font-bold text-primary font-mono mb-6">
              {content.education.additionalHeading}
            </h3>
            <ul className="space-y-1.5" role="list">
              {content.education.additional!.map((item, index) => (
                <li
                  key={index}
                  className="text-sm text-neutral-300 font-mono flex items-center gap-2"
                >
                  <span className="text-primary shrink-0" aria-hidden>
                    &gt;
                  </span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </article>
        )}
      </div>
    </section>
  )
}
