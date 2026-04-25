'use client'

import content from '@/content/en.json'
import type { Content } from '@/content/types'
import { StickyLogoBar } from '@/components/sections/v2/StickyLogoBar'
import { Hero } from '@/components/sections/v2/Hero'
import { AboutPinned } from '@/components/sections/v2/about/AboutPinned'
import { BioBlock } from '@/components/sections/v2/about/BioBlock'
import { SkillsBlock } from '@/components/sections/v2/about/SkillsBlock'
import { ClientsBlock } from '@/components/sections/v2/about/ClientsBlock'
import { EducationBlock } from '@/components/sections/v2/about/EducationBlock'

const typedContent = content as unknown as Content
const about = typedContent.about

/**
 * /about page orchestrator.
 *
 * Sequence:
 *  1. Hero zone — bg-bg-surface-secondary band wrapping <StickyLogoBar/> and <Hero/>
 *     (mirrors ProjectPageShell's hero wrapper). Hero rendered without `technologies`,
 *     so headline takes the full 12 columns.
 *  2. <AboutPinned/> — image-pin in cols 9-12 + first-paragraph reveal in cols 1-6.
 *  3. Numbered subsections — BioBlock, SkillsBlock, ClientsBlock, EducationBlock.
 *
 * No scroll-video / in-view / slide-style logic here — that lives in AboutPinned
 * (frame scrub + image entry) and Hero (text entrance) respectively.
 */
export function AboutSection() {
  return (
    <div className="min-h-screen bg-bg">
      {/* Hero zone — same wrapper shape as ProjectPageShell:
          bg-bg-surface-secondary provides continuous color behind the sticky bar,
          top padding matches project pages. */}
      <div className="bg-bg-surface-secondary pt-8 md:pt-10 lg:pt-12">
        <StickyLogoBar />
        <Hero
          kicker="0.0 / About"
          headline={about.headline ?? 'Bridging brand strategy, product craft and technical workflow'}
        />
      </div>

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
