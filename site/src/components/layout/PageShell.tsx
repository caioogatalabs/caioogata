'use client'
import { useFontReady } from '@/hooks/useFontReady'
import { IntroSection } from '@/components/sections/v2/IntroSection'
import { ProjectsGrid } from '@/components/sections/v2/ProjectsGrid'

export function PageShell() {
  useFontReady()
  return (
    <>
      <IntroSection />
      {/* Menu hidden 2026-09-10 — being rethought. To restore:
            import { MenuSection } from '@/components/sections/v2/MenuSection'
            import content from '@/content/en.json'
            import type { Content } from '@/content/types'
            const typedContent = content as unknown as Content
          then render <MenuSection content={typedContent.menu} /> here. */}
      <ProjectsGrid />
    </>
  )
}
