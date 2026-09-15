'use client'

import { ProjectRow } from '@/components/sections/v2/ProjectRow'
import { useLanguage } from '@/components/providers/LanguageProvider'
import type { ProjectItem } from '@/content/types'

type Project = ProjectItem

/** First image with a real src — some entries lead with a video, one has none. */
function coverOf(project: Project): string | undefined {
  return project.images?.find((i) => i.src)?.src || undefined
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

/**
 * PLACEHOLDER — the badge marks one number per project, as in the Figma study.
 * Values are real, lifted from each project's `impact` prose; the labels live
 * in `ui.projects.badges` so they translate. Move the values there too once
 * the project copy is revisited.
 */
const BADGE_VALUES: Record<string, string> = {
  'azion-console-kit': '6,000+',
  'azion-design-system': '40+',
  'azion-brand-system': '20,000+',
  huia: '40',
  // azion-website has no number in its impact copy — renders without a badge.
}

export function ProjectsGrid() {
  const { content } = useLanguage()
  const projects = content.projects.items.filter((p) => !p.disabled)
  const badgeLabels: Record<string, string> = content.ui.projects.badges
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
          badge={BADGE_VALUES[project.slug]}
          badgeLabel={badgeLabels[project.slug]}
          cover={coverOf(project)}
        />
      ))}
    </section>
  )
}
