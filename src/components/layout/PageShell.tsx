'use client'
import { useFontReady } from '@/hooks/useFontReady'
import { IntroSection } from '@/components/sections/v2/IntroSection'
import { MenuSection } from '@/components/sections/v2/MenuSection'
import { ProjectsGrid } from '@/components/sections/v2/ProjectsGrid'
import { PageNavigation } from '@/components/sections/v2/PageNavigation'
import { MAIN_NAVIGATION } from '@/content/main-navigation'
import content from '@/content/en.json'
import type { Content } from '@/content/types'

const typedContent = content as unknown as Content

export function PageShell() {
  useFontReady()
  return (
    <>
      <IntroSection />
      <PageNavigation
        lateral={{ items: MAIN_NAVIGATION, currentIndex: 0, scope: 'categories' }}
      />
      <MenuSection content={typedContent.menu} />
      <ProjectsGrid />
    </>
  )
}
