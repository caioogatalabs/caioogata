'use client'

import { PageNavigation } from '@/components/sections/v2/PageNavigation'
import { MAIN_NAVIGATION } from '@/content/main-navigation'
import { useLanguage } from '@/components/providers/LanguageProvider'
import { ProjectsHero } from '@/components/sections/v2/projects/ProjectsHero'
import { ProjectsList } from '@/components/sections/v2/projects/ProjectsList'

/**
 * /projects index orchestrator.
 *
 * Sequence (mirrors /about and /experience):
 *   <ProjectsHero/>     ← sticky logo bar + display headline
 *   <PageNavigation/>   ← unified mono nav strip (lateral categories)
 *   <ProjectsList/>     ← all active projects in the home `ProjectCard` rhythm
 *   <PageNavigation/>   ← bottom mirror, non-sticky
 */
export function ProjectsSection() {
  // Projects sits between Experience (idx 2) and Philosophy (idx 4) in
  // MAIN_NAVIGATION. currentIndex is computed from the array so the lateral
  // nav stays correct if the canonical order shifts later.
  const currentIndex = MAIN_NAVIGATION.findIndex((item) => item.href === '/projects')
  const { content } = useLanguage()
  const { ui } = content
  const navigation = MAIN_NAVIGATION.map((item) => ({ ...item, title: ui.pageNav.titles[item.key] }))

  return (
    <div className="min-h-screen bg-bg">
      <ProjectsHero
        kicker={ui.projects.kicker}
        headline={ui.projects.headline}
      />

      <PageNavigation
        lateral={{ items: navigation, currentIndex, scope: ui.pageNav.scopeCategories }}
      />

      <ProjectsList />

      <PageNavigation
        sticky={false}
        lateral={{ items: navigation, currentIndex, scope: ui.pageNav.scopeCategories }}
      />
    </div>
  )
}
