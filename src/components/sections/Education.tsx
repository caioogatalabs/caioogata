'use client'

import { useMemo } from 'react'
import { useLanguage } from '@/components/providers/LanguageProvider'
import SectionHeading from '@/components/ui/SectionHeading'
import type { EducationItem } from '@/content/types'

/** Extract sort year from education year string (e.g. "2001 - 2005" -> 2005, "2009" -> 2009) */
function getSortYear(yearStr: string): number {
  const match = yearStr.match(/\b(19|20)\d{2}\b/g)
  if (!match || match.length === 0) return 0
  return Math.max(...match.map(Number))
}

function EducationCard({ edu }: { edu: EducationItem }) {
  return (
    <article className="rounded-base border border-neutral-400 bg-neutral p-4 md:p-5">
      <h3 className="text-base font-bold text-primary font-mono mb-6">
        {edu.institution}
      </h3>
      <p className="text-sm text-neutral-300 font-mono mb-1">{edu.degree}</p>
      <p className="text-sm text-neutral-300 font-mono mb-2">
        {edu.location} · {edu.year}
      </p>
      {edu.note && (
        <p className="text-sm text-primary font-mono">{edu.note}</p>
      )}
    </article>
  )
}

export default function Education() {
  const { content } = useLanguage()

  // Combine formal education and additional training, then sort by year
  const allEducation = useMemo(() => {
    const formal = content.education.items
    const additional = content.education.additional || []
    return [...formal, ...additional].sort(
      (a, b) => getSortYear(b.year) - getSortYear(a.year)
    )
  }, [content.education.items, content.education.additional])

  return (
    <section id="education" aria-labelledby="education-heading">
      <SectionHeading id="education-heading">
        {content.education.heading}
      </SectionHeading>

      <div className="grid gap-4 md:grid-cols-2">
        {allEducation.map((edu, index) => (
          <EducationCard key={index} edu={edu} />
        ))}
      </div>
    </section>
  )
}
