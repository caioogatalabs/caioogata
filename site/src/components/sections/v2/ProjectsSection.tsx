'use client'

import { PageNavigation } from '@/components/sections/v2/PageNavigation'
import { MAIN_NAVIGATION } from '@/content/main-navigation'
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

  return (
    <div className="min-h-screen bg-bg">
      <ProjectsHero
        kicker="2.0 / Selected Work"
        headline="A selection of projects across design systems, brand expansion, and the consoles engineers ship to every day."
      />

      <PageNavigation
        lateral={{ items: MAIN_NAVIGATION, currentIndex, scope: 'categories' }}
      />

      <ProjectsList />

      <PageNavigation
        sticky={false}
        lateral={{ items: MAIN_NAVIGATION, currentIndex, scope: 'categories' }}
      />
    </div>
  )
}
