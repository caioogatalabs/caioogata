'use client'
import { useFontReady } from '@/hooks/useFontReady'
import { IntroSection } from '@/components/sections/v2/IntroSection'
import { MenuSection } from '@/components/sections/v2/MenuSection'
import { ProjectsGrid } from '@/components/sections/v2/ProjectsGrid'
import { ContactOverlay } from '@/components/sections/v2/ContactOverlay'
import { FloatingContactButton } from '@/components/sections/v2/FloatingContactButton'
import content from '@/content/en.json'
import type { Content } from '@/content/types'

const typedContent = content as unknown as Content

export function PageShell() {
  useFontReady()
  // ContactOverlay + FloatingContactButton are intentionally root-level
  // (fixed-position siblings) so they sit above all home sections and are
  // not bound to any single section's layout context.
  // FooterSection is mounted in app/layout.tsx — do not duplicate here.
  return (
    <>
      <IntroSection />
      <MenuSection content={typedContent.menu} />
      <ProjectsGrid />
      <FloatingContactButton />
      <ContactOverlay />
    </>
  )
}
