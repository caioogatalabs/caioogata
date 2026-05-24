'use client'

import { PageNavigation } from '@/components/sections/v2/PageNavigation'
import { MAIN_NAVIGATION } from '@/content/main-navigation'
import { PhilosophyHero } from '@/components/sections/v2/philosophy/PhilosophyHero'
import { PhilosophyBlock } from '@/components/sections/v2/philosophy/PhilosophyBlock'
import content from '@/content/en.json'
import type { Content } from '@/content/types'

const typedContent = content as unknown as Content

/**
 * /philosophy orchestrator.
 *
 * Sequence (mirrors /about diagramming):
 *   <PhilosophyHero/>     ← sticky logo bar + kicker title + first paragraph as headline
 *   <PageNavigation/>     ← unified mono nav strip
 *   <PhilosophyBlock/>    ← 3.1 / Practice — middle paragraphs + closing quote in BioBlock layout
 *   <PageNavigation/>     ← bottom mirror, non-sticky
 *
 * Source content: `philosophy.body.split('\n\n')`
 *   index 0       → headline in <PhilosophyHero/>
 *   indices 1..n-2 → middle paragraphs in <PhilosophyBlock/>
 *   last index    → closing quote in <PhilosophyBlock/> (line-mask reveal)
 */
export function PhilosophySection() {
  const philosophy = typedContent.philosophy
  const allParagraphs = philosophy.body.split('\n\n')
  const headline = allParagraphs[0] ?? ''
  const remaining = allParagraphs.slice(1)
  const middle = remaining.length > 1 ? remaining.slice(0, -1) : remaining
  const closingQuote = remaining.length > 1 ? remaining[remaining.length - 1] : undefined

  const currentIndex = MAIN_NAVIGATION.findIndex((item) => item.href === '/philosophy')

  return (
    <div className="min-h-screen bg-bg">
      <PhilosophyHero title={philosophy.title} headline={headline} />

      <PageNavigation
        lateral={{ items: MAIN_NAVIGATION, currentIndex, scope: 'categories' }}
      />

      <PhilosophyBlock paragraphs={middle} closingQuote={closingQuote} />

      <PageNavigation
        sticky={false}
        lateral={{ items: MAIN_NAVIGATION, currentIndex, scope: 'categories' }}
      />
    </div>
  )
}
