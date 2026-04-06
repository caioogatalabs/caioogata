'use client'

import type { ProjectItem, ProjectSection } from '@/content/types'
import type { Content } from '@/content/types'
import content from '@/content/en.json'
import { ProjectHero } from './ProjectHero'
import { ProjectChallenge } from './ProjectChallenge'
import { ProjectImpact } from './ProjectImpact'
import { ProjectInfoBlock } from './ProjectInfoBlock'
import { ProjectCredits } from './ProjectCredits'
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
      return <ProjectChallenge key={index} section={section} />
    case 'impact':
      return <ProjectImpact key={index} section={section} />
    case 'gallery-staggered':
      return <ProjectGalleryStaggered key={index} section={section} />
    case 'gallery-feature-list':
      return <ProjectGalleryFeatureList key={index} section={section} />
    case 'gallery-full-detail':
      return <ProjectGalleryFullDetail key={index} section={section} />
    default:
      return null
  }
}

export function ProjectPageShell({ project }: ProjectPageShellProps) {
  const sections = project.sections || []
  const projectIndex = enabledProjects.findIndex(p => p.slug === project.slug)

  return (
    <div className="min-h-screen bg-bg">
      {/* Composed sections: hero first, then top navigation, then remaining sections */}
      {sections.length > 0 && (
        <>
          <SectionBlock
            section={sections[0]}
            index={0}
            project={project}
            projectIndex={projectIndex}
          />
          <ProjectNavigation currentSlug={project.slug} position="top" />
          {sections.slice(1).map((section, i) => (
            <SectionBlock
              key={i + 1}
              section={section}
              index={i + 1}
              project={project}
              projectIndex={projectIndex}
            />
          ))}
        </>
      )}

      {/* Info block and credits are always present (not configurable per project) */}
      <ProjectInfoBlock project={project} />
      <ProjectCredits project={project} />

      {/* Bottom navigation */}
      <ProjectNavigation currentSlug={project.slug} position="bottom" />
    </div>
  )
}
