'use client'

import { ProjectRow } from '@/components/sections/v2/ProjectRow'
import content from '@/content/en.json'

type Project = (typeof content.projects.items)[number]

const projects = content.projects.items.filter((p) => !p.disabled)

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
 * Values are real, lifted from each project's `impact` prose; the labels are
 * ours. Move both into the content file once the project copy is revisited.
 */
const BADGES: Record<string, { value: string; label: string }> = {
  'azion-console-kit': { value: '6,000+', label: 'commits, 34+ contributors, in production at Itaú, Magalu and Netshoes.' },
  'azion-design-system': { value: '40+', label: 'documented components on token-based foundations.' },
  'azion-brand-system': { value: '20,000+', label: 'hosted applications under one brand experience.' },
  huia: { value: '40', label: 'people, from internal nucleus to independent studio.' },
  // azion-website has no number in its impact copy — renders without a badge.
}

export function ProjectsGrid() {
  // Deliberately no observer on the section. `-inview` propagates to every
  // descendant, so one here fires every row's entrance the moment the list
  // edges into view — which defeats the per-row staging in ProjectRow, where
  // the image and the copy are supposed to arrive at different moments.
  // Each row owns its own observers now.
  return (
    <section
      aria-label="Projects"
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
          badge={BADGES[project.slug]?.value}
          badgeLabel={BADGES[project.slug]?.label}
          cover={coverOf(project)}
        />
      ))}
    </section>
  )
}
