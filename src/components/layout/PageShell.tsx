'use client'
import { useFontReady } from '@/hooks/useFontReady'
import { IntroSection } from '@/components/sections/v2/IntroSection'
import { MenuSection } from '@/components/sections/v2/MenuSection'
import { ProjectsGrid } from '@/components/sections/v2/ProjectsGrid'
import { FooterSection } from '@/components/sections/v2/FooterSection'

export function PageShell() {
  useFontReady()
  return (
    <>
      <IntroSection />
      <MenuSection />
      <ProjectsGrid />
      <FooterSection />
    </>
  )
}
