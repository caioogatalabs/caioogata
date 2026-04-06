---
phase: 03-project-pages
plan: 01
subsystem: ui
tags: [next.js, dynamic-routes, typescript, content-model, static-export]

requires:
  - phase: 02-home-page
    provides: "V2 component structure, semantic tokens, entrance system, ProjectCard linking to /projects/[slug]"
provides:
  - "ProjectSection, GalleryRow, ProjectSectionImage types for block composition"
  - "Dynamic route at /projects/[slug] with generateStaticParams and OG metadata"
  - "ProjectPageShell orchestrator mapping sections to placeholder blocks"
  - "Content data model with year and sections arrays for all 5 enabled projects"
affects: [03-02, 03-03]

tech-stack:
  added: []
  patterns:
    - "Component-based page composition via sections array in content JSON"
    - "Next.js 15 async params pattern (Promise<{ slug: string }>)"
    - "data-block attributes for placeholder block identification"

key-files:
  created:
    - src/app/projects/[slug]/page.tsx
    - src/components/sections/v2/project/ProjectPageShell.tsx
  modified:
    - src/content/types.ts
    - src/content/en.json

key-decisions:
  - "Content model extension: additive sections array alongside existing images array for backward compat"
  - "azion-design-system: hero + challenge + impact only (no gallery -- zero webp images available)"
  - "huia: only static images in galleries (videos deferred per CONTEXT.md)"

patterns-established:
  - "Block composition: project.sections.map() with switch on section.type"
  - "Placeholder blocks use data-block attribute for downstream replacement"
  - "Fixed blocks (info, credits, navigation) rendered outside sections loop"

requirements-completed: [PROJ-01, PROJ-02]

duration: 5min
completed: 2026-04-06
---

# Phase 03 Plan 01: Data Model, Route, and Page Shell Summary

**ProjectSection type system, en.json content model extension, dynamic /projects/[slug] route with OG metadata, and ProjectPageShell block composition orchestrator**

## Performance

- **Duration:** 5 min
- **Started:** 2026-04-06T14:53:48Z
- **Completed:** 2026-04-06T14:58:29Z
- **Tasks:** 3
- **Files modified:** 4

## Accomplishments
- Defined GalleryRow, ProjectSectionImage, and ProjectSection interfaces supporting 6 block types
- Extended all 5 enabled projects in en.json with year and sections arrays (challenge/solution text derived from existing descriptions)
- Created dynamic route with generateStaticParams producing routes for all 5 projects, OG/Twitter metadata per project
- Built ProjectPageShell orchestrator with placeholder blocks for all section types plus fixed info/credits/navigation sections

## Task Commits

Each task was committed atomically:

1. **Task 1: Define ProjectSection types and extend en.json data model** - `6f5e8b9` (feat)
2. **Task 2: Create dynamic route page with generateStaticParams and generateMetadata** - `a3a64b2` (feat)
3. **Task 3: Create ProjectPageShell block composition orchestrator** - `0c6ec5e` (feat)

## Files Created/Modified
- `src/content/types.ts` - Added GalleryRow, ProjectSectionImage, ProjectSection interfaces; extended ProjectItem with sections and year
- `src/content/en.json` - Added year and sections arrays to all 5 enabled projects
- `src/app/projects/[slug]/page.tsx` - Dynamic route with generateStaticParams, generateMetadata, and notFound handling
- `src/components/sections/v2/project/ProjectPageShell.tsx` - Client component orchestrating block composition from sections data

## Decisions Made
- Content model uses additive sections array alongside existing images array -- existing ProjectCard on Home page unaffected
- azion-design-system has no webp gallery images, so its sections array contains only hero, challenge, and impact blocks
- huia gallery uses only static image entries (4 webp files); video entries excluded per CONTEXT.md deferred scope
- Challenge/solution text derived from existing description and impact fields -- no fabricated metrics

## Deviations from Plan

None - plan executed exactly as written.

## Known Stubs

All placeholder blocks in ProjectPageShell are intentional stubs -- they display section type labels and will be replaced by actual block components in Plans 02 and 03. This is by design per D-01 (component-based composition).

| File | Stub | Reason | Resolved By |
|------|------|--------|-------------|
| ProjectPageShell.tsx | SectionBlock placeholder divs | Blocks implemented in Plans 02/03 | Plan 03-02, 03-03 |
| ProjectPageShell.tsx | data-block="info" placeholder | Info block implemented in Plan 02 | Plan 03-02 |
| ProjectPageShell.tsx | data-block="credits" placeholder | Credits implemented in Plan 02 | Plan 03-02 |
| ProjectPageShell.tsx | data-block="navigation" placeholder | Navigation implemented in Plan 03 | Plan 03-03 |

## Issues Encountered
None

## User Setup Required
None - no external service configuration required.

## Next Phase Readiness
- Route infrastructure complete -- Plans 02 and 03 can implement block components that plug into ProjectPageShell
- Content model is ready for all gallery types
- Build verified: all 5 project routes generated successfully via generateStaticParams

---
*Phase: 03-project-pages*
*Completed: 2026-04-06*
