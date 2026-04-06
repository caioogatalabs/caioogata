'use client'
import { useFontReady } from '@/hooks/useFontReady'
import { IntroSection } from '@/components/sections/v2/IntroSection'
import { MenuSection } from '@/components/sections/v2/MenuSection'
import { ProjectsGrid } from '@/components/sections/v2/ProjectsGrid'
import content from '@/content/en.json'
import type { Content } from '@/content/types'

const typedContent = content as unknown as Content

export function PageShell() {
  useFontReady()
  return (
    <>
      <IntroSection />
      <MenuSection content={typedContent.menu} />
      <ProjectsGrid />
    </>
  )
}
