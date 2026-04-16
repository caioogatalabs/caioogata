'use client'

import React from 'react'
import type { ProjectItem, ProjectSection } from '@/content/types'
import type { Content } from '@/content/types'
import content from '@/content/en.json'
import { StickyLogoBar } from '@/components/sections/v2/StickyLogoBar'
import { ProjectHero } from './ProjectHero'
import { ProjectChallenge } from './ProjectChallenge'
import { ProjectImpact } from './ProjectImpact'
import { ProjectInfoBlock } from './ProjectInfoBlock'
import { ProjectGalleryStaggered } from './ProjectGalleryStaggered'
import { ProjectGalleryFeatureList } from './ProjectGalleryFeatureList'
import { ProjectGalleryFullDetail } from './ProjectGalleryFullDetail'
import { ProjectNavigation } from './ProjectNavigation'

const typedContent = content as unknown as Content
const enabledProjects = typedContent.projects.items.filter(p => !p.disabled)

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
      return <ProjectChallenge key={index} section={section} project={project} projectIndex={projectIndex} />
    case 'impact':
      return <ProjectImpact key={index} section={section} />
    case 'gallery-staggered':
      return <ProjectGalleryStaggered key={index} section={section} />
    case 'gallery-feature-list':
      return <ProjectGalleryFeatureList key={index} section={section} />
    case 'gallery-full-detail':
      return <ProjectGalleryFullDetail key={index} section={section} />
    case 'info':
      return <ProjectInfoBlock key={index} project={project} />
    default:
      return null
  }
}

export function ProjectPageShell({ project }: ProjectPageShellProps) {
  const sections = project.sections || []
  const projectIndex = enabledProjects.findIndex(p => p.slug === project.slug)

  const heroSection = sections.find(s => s.type === 'hero')
  const heroIndex = sections.findIndex(s => s.type === 'hero')
  const restSections = sections.filter(s => s.type !== 'hero')

  return (
    <div className="min-h-screen bg-bg">
      {/* Hero zone — bg wrapper provides continuous background for sticky bar */}
      <div className="bg-bg-surface-secondary pt-8 md:pt-10 lg:pt-12">
        <StickyLogoBar />
        {heroSection && (
          <SectionBlock
            section={heroSection}
            index={heroIndex}
            project={project}
            projectIndex={projectIndex}
          />
        )}
      </div>

      {/* Project navigation — below hero */}
      <ProjectNavigation currentSlug={project.slug} position="top" />

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

      {/* Bottom navigation */}
      <ProjectNavigation currentSlug={project.slug} position="bottom" />
    </div>
  )
}
