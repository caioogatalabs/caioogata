'use client'

import React from 'react'
import type { ProjectItem, ProjectSection } from '@/content/types'
import { useLanguage } from '@/components/providers/LanguageProvider'
import { ProjectHero } from './ProjectHero'
import { ProjectChallenge } from './ProjectChallenge'
import { ProjectImpact } from './ProjectImpact'
import { ProjectInfoBlock } from './ProjectInfoBlock'
import { ProjectGalleryStaggered } from './ProjectGalleryStaggered'
import { ProjectGalleryFeatureList } from './ProjectGalleryFeatureList'
import { ProjectGalleryFullDetail } from './ProjectGalleryFullDetail'
import { ProjectGalleryFullBleed } from './ProjectGalleryFullBleed'
import { ProjectGalleryStick } from './ProjectGalleryStick'
import { PageNavigation } from '@/components/sections/v2/PageNavigation'


interface ProjectPageShellProps {
  project: ProjectItem
}

function SectionBlock({
  section,
  index,
  project,
  projectIndex,
}: {
  section: ProjectSection
  index: number
  project: ProjectItem
  projectIndex: number
}) {
  switch (section.type) {
    case 'hero':
      return (
        <ProjectHero
          key={index}
          project={project}
          section={section}
          index={projectIndex}
        />
      )
    case 'challenge':
      return (
        <ProjectChallenge
          key={index}
          section={section}
          project={project}
          projectIndex={projectIndex}
        />
      )
    case 'impact':
      return <ProjectImpact key={index} section={section} />
    case 'gallery-staggered':
      return <ProjectGalleryStaggered key={index} section={section} />
    case 'gallery-feature-list':
      return <ProjectGalleryFeatureList key={index} section={section} />
    case 'gallery-full-detail':
      return <ProjectGalleryFullDetail key={index} section={section} />
    case 'gallery-full-bleed':
      return <ProjectGalleryFullBleed key={index} section={section} />
    case 'gallery-stick':
      return <ProjectGalleryStick key={index} section={section} />
    case 'info':
      return <ProjectInfoBlock key={index} project={project} />
    default:
      return null
  }
}

export function ProjectPageShell({ project: projectFromRoute }: ProjectPageShellProps) {
  // The route resolves the slug against the English file at build time; the
  // page renders whichever language is active, matched by slug.
  const { content } = useLanguage()
  const enabledProjects = content.projects.items.filter(p => !p.disabled)
  const project = enabledProjects.find(p => p.slug === projectFromRoute.slug) ?? projectFromRoute
  const lateralItems = enabledProjects.map(p => ({
    href: `/projects/${p.slug}`,
    title: p.title,
  }))
  const sections = project.sections || []
  const projectIndex = enabledProjects.findIndex(p => p.slug === project.slug)

  // The stats travel with the challenge row, so the two have to be paired
  // before either is rendered.

  const heroSection = sections.find(s => s.type === 'hero')
  const heroIndex = sections.findIndex(s => s.type === 'hero')
  const restSections = sections.filter(s => s.type !== 'hero')

  return (
    <div className="min-h-screen bg-bg overflow-x-clip">
      {/* Hero zone — no background of its own: the page's `bg-bg` runs from the
          header straight through the hero, as on the home intro. A
          `surface-secondary` wrapper here drew a seam under the header.
          HeaderBar carries its own top padding — none needed here. */}
      <div>
        {heroSection && (
          <SectionBlock
            section={heroSection}
            index={heroIndex}
            project={project}
            projectIndex={projectIndex}
          />
        )}
      </div>

      {/* Unified page navigation — below hero (single instance) */}
      <PageNavigation
        back={{ href: '/', label: content.ui.project.backHome }}
        lateral={{ items: lateralItems, currentIndex: projectIndex, scope: 'projects' }}
      />

      {/* Remaining sections */}
      {restSections.map((section, i) => (
        <SectionBlock
          key={i}
          section={section}
          index={i}
          project={project}
          projectIndex={projectIndex}
        />
      ))}
    </div>
  )
}
