'use client'

import { ProjectRow } from '@/components/sections/v2/ProjectRow'
import { useLanguage } from '@/components/providers/LanguageProvider'
import type { ProjectItem } from '@/content/types'

type Project = ProjectItem

/**
 * The authored `cover` when there is one; otherwise the first image with a real
 * src — some entries lead with a video, one has none.
 */
function coverOf(project: Project): string | undefined {
  return project.cover || project.images?.find((i) => i.src)?.src || undefined
}

/**
 * PLACEHOLDER — the column wants a two-line summary and `description` runs
 * 345–554 characters. There is no summary field in the content yet, so this
 * takes the first sentence. Replace with an authored `summary` per project.
 */
function summaryOf(project: Project): string {
  const first = project.description.split(/(?<=\.)\s/)[0] ?? project.description
  return first
}

export function ProjectsGrid() {
  const { content } = useLanguage()
  const projects = content.projects.items.filter((p) => !p.disabled)
  // Deliberately no observer on the section. `-inview` propagates to every
  // descendant, so one here fires every row's entrance the moment the list
  // edges into view — which defeats the per-row staging in ProjectRow, where
  // the image and the copy are supposed to arrive at different moments.
  // Each row owns its own observers now.
  return (
    <section
      aria-label={content.ui.projects.gridLabel}
      data-section-id="projects"
      // Horizontal padding comes from each row's <Grid>; doubling it here would
      // push the columns off the 12-col track.
      // The hero is sticky now, so it holds its own viewport in the flow and
      // the list no longer reserves one — it just needs its own top spacing.
      // z-10 keeps it under the hero, which stays readable over the rows.
      // gap-16 (64px) between rows — the same beat as the hero's --hero-gap cap
      // and the BLOCK_GAP the rest of the home is spaced on.
      className="relative z-10 flex flex-col gap-16 pt-16 pb-8 md:pb-12 lg:pb-16"
    >
      {projects.map((project, i) => (
        <ProjectRow
          key={project.slug}
          title={project.title}
          slug={project.slug}
          year={project.year}
          index={i + 1}
          summary={summaryOf(project)}
          cover={coverOf(project)}
        />
      ))}
    </section>
  )
}
