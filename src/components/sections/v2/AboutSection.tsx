'use client'

import { PageNavigation } from '@/components/sections/v2/PageNavigation'
import { MAIN_NAVIGATION } from '@/content/main-navigation'
import { AboutPinned } from '@/components/sections/v2/about/AboutPinned'
import { BioBlock } from '@/components/sections/v2/about/BioBlock'
import { SkillsBlock } from '@/components/sections/v2/about/SkillsBlock'
import { ClientsBlock } from '@/components/sections/v2/about/ClientsBlock'
import { EducationBlock } from '@/components/sections/v2/about/EducationBlock'

/**
 * /about page orchestrator.
 *
 * Sequence (Figma 701:303):
 *   <AboutPinned/> (logo bar lives inside it)                  ← sticky pills row mounts as first child of the 400vh pin
 *   <PageNavigation/>                                          ← unified mono strip (lateral categories)
 *   <BioBlock/> + <SkillsBlock/> + <ClientsBlock/> + <EducationBlock/>
 *
 * Home (/) IntroSection still composes welcome bar + sticky pills row + headline;
 * only this page drops the welcome bar and headline.
 */
export function AboutSection() {
  return (
    <div className="min-h-screen bg-bg">
      {/* AboutPinned hosts the sticky logo+CTA bar internally — it stays sticky
          through the full 400vh pin, then PageNavigation below takes over. */}
      <AboutPinned />

      {/* Mono nav strip below the scrub section — categories circuit */}
      <PageNavigation
        lateral={{ items: MAIN_NAVIGATION, currentIndex: 1, scope: 'categories' }}
      />

      {/* Numbered subsections */}
      <BioBlock />
      <SkillsBlock />
      <ClientsBlock />
      <EducationBlock />
    </div>
  )
}
