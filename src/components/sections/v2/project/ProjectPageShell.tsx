'use client'

import type { ProjectItem, ProjectSection } from '@/content/types'
import type { Content } from '@/content/types'
import content from '@/content/en.json'
import { ProjectHero } from './ProjectHero'
import { ProjectChallenge } from './ProjectChallenge'
import { ProjectImpact } from './ProjectImpact'
import { ProjectInfoBlock } from './ProjectInfoBlock'
import { ProjectCredits } from './ProjectCredits'

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
      return <ProjectChallenge key={index} section={section} />
    case 'impact':
      return <ProjectImpact key={index} section={section} />
    case 'gallery-staggered':
      return (
        <section key={index} className="py-16" data-block="gallery-staggered">
          <div className="px-5 md:px-8 lg:px-16">
            <p className="font-mono text-xs text-text-tertiary uppercase tracking-[0.88px]">
              Gallery: Staggered ({section.rows?.length || 0} rows)
            </p>
          </div>
        </section>
      )
    case 'gallery-feature-list':
      return (
        <section key={index} className="py-16" data-block="gallery-feature-list">
          <div className="px-5 md:px-8 lg:px-16">
            <p className="font-mono text-xs text-text-tertiary uppercase tracking-[0.88px]">
              Gallery: Feature List ({section.features?.length || 0} features)
            </p>
          </div>
        </section>
      )
    case 'gallery-full-detail':
      return (
        <section key={index} className="py-16" data-block="gallery-full-detail">
          <div className="px-5 md:px-8 lg:px-16">
            <p className="font-mono text-xs text-text-tertiary uppercase tracking-[0.88px]">
              Gallery: Full Detail
            </p>
          </div>
        </section>
      )
    default:
      return null
  }
}

export function ProjectPageShell({ project }: ProjectPageShellProps) {
  const sections = project.sections || []
  const projectIndex = enabledProjects.findIndex(p => p.slug === project.slug)

  return (
    <div className="min-h-screen bg-bg">
      {/* Composed sections from data model (per D-01) */}
      {sections.map((section, i) => (
        <SectionBlock
          key={i}
          section={section}
          index={i}
          project={project}
          projectIndex={projectIndex}
        />
      ))}

      {/* Info block and credits are always present (not configurable per project) */}
      <ProjectInfoBlock project={project} />
      <ProjectCredits project={project} />

      {/* Navigation placeholder (Plan 03) */}
      <nav className="border-t border-border-primary py-6 px-5 md:px-8 lg:px-16" data-block="navigation" aria-label="Project navigation">
        <p className="font-mono text-xs text-text-tertiary uppercase tracking-[0.88px]">
          Navigation (Plan 03)
        </p>
      </nav>
    </div>
  )
}
