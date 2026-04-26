'use client'

import { StickyLogoBar } from '@/components/sections/v2/StickyLogoBar'
import { ProjectNavigation } from '@/components/sections/v2/about/ProjectNavigation'
import { AboutPinned } from '@/components/sections/v2/about/AboutPinned'
import { BioBlock } from '@/components/sections/v2/about/BioBlock'
import { SkillsBlock } from '@/components/sections/v2/about/SkillsBlock'
import { ClientsBlock } from '@/components/sections/v2/about/ClientsBlock'
import { EducationBlock } from '@/components/sections/v2/about/EducationBlock'

/**
 * /about page orchestrator.
 *
 * Sequence (Figma 701:303):
 *   bg-bg-surface-secondary band → <StickyLogoBar/>          ← only the pills row (no welcome bar, no headline)
 *   <ProjectNavigation/>                                       ← `← Back to Home` mono strip
 *   <AboutPinned/>                                             ← image-pin + first-paragraph reveal
 *   <BioBlock/> + <SkillsBlock/> + <ClientsBlock/> + <EducationBlock/>
 *
 * The home (/) IntroSection still composes welcome bar + StickyLogoBar + headline; only this page
 * drops the welcome bar and headline.
 */
export function AboutSection() {
  return (
    <div className="min-h-screen bg-bg">
      {/* Hero band — same wrapper shape (bg + top padding) as the home,
          but ONLY the sticky pills row is rendered inside.
          No welcome bar, no Hero. */}
      <div className="bg-bg-surface-secondary pt-8 md:pt-10 lg:pt-12">
        <StickyLogoBar />
      </div>

      {/* Mono nav strip below the pills */}
      <ProjectNavigation />

      {/* Image pin + first-paragraph reveal */}
      <AboutPinned />

      {/* Numbered subsections */}
      <BioBlock />
      <SkillsBlock />
      <ClientsBlock />
      <EducationBlock />
    </div>
  )
}
