'use client'

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
 *   <BioBlock/> + <SkillsBlock/> + <ClientsBlock/> + <EducationBlock/>
 *
 * Home (/) IntroSection still composes welcome bar + sticky pills row + headline;
 * only this page drops the welcome bar and headline.
 */
export function AboutSection() {
  return (
    <div className="min-h-screen bg-bg">
      <AboutPinned />

      {/* Numbered subsections */}
      <BioBlock />
      <SkillsBlock />
      <ClientsBlock />
      <EducationBlock />
    </div>
  )
}
