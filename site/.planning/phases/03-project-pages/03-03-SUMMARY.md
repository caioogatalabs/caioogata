---
phase: 03-project-pages
plan: 03
subsystem: ui
tags: [react, hooks, scroll-parallax, gallery, navigation, keyboard-nav, accessibility]

requires:
  - phase: 03-project-pages
    provides: "ProjectPageShell orchestrator with data-block placeholders, content model with sections/GalleryRow/features types"
provides:
  - "useScrollParallax hook for scroll-driven translateY with reduced-motion support"
  - "ProjectGalleryStaggered: mixed-span image grid with scroll-reveal clip-path"
  - "ProjectGalleryFeatureList: 3-6-3 layout with parallax float on center image"
  - "ProjectGalleryFullDetail: editorial 4-8/8-4 layout with min-h-screen image"
  - "ProjectNavigation: prev/next with keyboard support and sticky glassmorphism"
  - "ProjectPageShell fully wired with zero placeholder blocks"
affects: []

tech-stack:
  added: []
  patterns:
    - "Sub-component pattern for hooks in loops (RevealImage, ParallaxRevealImage)"
    - "Dual navigation instances (sticky top + static bottom) from same component"
    - "Keyboard navigation guard: skip when focus is in input/textarea/select"

key-files:
  created:
    - src/hooks/useScrollParallax.ts
    - src/components/sections/v2/project/ProjectGalleryStaggered.tsx
    - src/components/sections/v2/project/ProjectGalleryFeatureList.tsx
    - src/components/sections/v2/project/ProjectGalleryFullDetail.tsx
    - src/components/sections/v2/project/ProjectNavigation.tsx
  modified:
    - src/components/sections/v2/project/ProjectPageShell.tsx

key-decisions:
  - "Sub-component pattern (RevealImage/ParallaxRevealImage) to use hooks per-image without violating rules of hooks"
  - "Keyboard nav guard to prevent arrow key interception when typing in form inputs"

patterns-established:
  - "Sub-component extraction for hooks-in-loops: create small inner components that call hooks individually"
  - "Position-based behavior: single component renders differently based on position prop (sticky vs static)"

requirements-completed: [PROJ-01, PROJ-03]

duration: 3min
completed: 2026-04-06
---

# Phase 03 Plan 03: Galleries, Parallax, and Navigation Summary

**Three gallery types (staggered grid, feature list, full detail), scroll-parallax hook, and inter-project keyboard navigation wired into ProjectPageShell**

## Performance

- **Duration:** 3 min
- **Started:** 2026-04-06T15:01:53Z
- **Completed:** 2026-04-06T15:04:24Z
- **Tasks:** 2
- **Files modified:** 6

## Accomplishments
- Built useScrollParallax hook following same rAF pattern as useScrollReveal with +/-20px clamp and reduced-motion support
- Created three gallery components: staggered grid with scroll-reveal, feature list with parallax float, full detail editorial layout
- Created ProjectNavigation with prev/next boundary handling, sticky glassmorphism top bar, and ArrowLeft/ArrowRight/Escape keyboard navigation
- Wired all components into ProjectPageShell -- zero placeholder data-block divs remain

## Task Commits

Each task was committed atomically:

1. **Task 1: Create useScrollParallax hook and three gallery components** - `4578194` (feat)
2. **Task 2: Create ProjectNavigation and wire galleries + navigation into Shell** - `1b63cea` (feat)

## Files Created/Modified
- `src/hooks/useScrollParallax.ts` - Scroll-driven parallax translateY hook with rAF throttling
- `src/components/sections/v2/project/ProjectGalleryStaggered.tsx` - Mixed-span image rows (12, 6-6, 4-4-4) with scroll-reveal
- `src/components/sections/v2/project/ProjectGalleryFeatureList.tsx` - 3-6-3 feature list with parallax float on center image
- `src/components/sections/v2/project/ProjectGalleryFullDetail.tsx` - Editorial 4-8/8-4 layout with min-h-screen image and useInView entrance
- `src/components/sections/v2/project/ProjectNavigation.tsx` - Prev/next navigation with keyboard support and sticky glassmorphism
- `src/components/sections/v2/project/ProjectPageShell.tsx` - Replaced all gallery + navigation placeholders with real components

## Decisions Made
- Used sub-component pattern (RevealImage, ParallaxRevealImage) to call hooks per-image without violating rules of hooks
- Added keyboard navigation guard to skip ArrowLeft/ArrowRight/Escape when user is typing in input/textarea/select elements
- Dual navigation instances rendered from same component with position prop controlling sticky vs static behavior

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 1 - Bug] Fixed useInView destructuring**
- **Found during:** Task 1 (ProjectGalleryFullDetail)
- **Issue:** Plan showed `const { ref: inViewRef } = useInView()` but useInView returns a ref directly, not an object
- **Fix:** Changed to `const inViewRef = useInView()`
- **Files modified:** src/components/sections/v2/project/ProjectGalleryFullDetail.tsx
- **Verification:** TypeScript compiles without errors
- **Committed in:** 4578194 (Task 1 commit)

**2. [Rule 2 - Missing Critical] Added keyboard navigation input guard**
- **Found during:** Task 2 (ProjectNavigation)
- **Issue:** Arrow key and Escape handlers would intercept keystrokes while user types in form inputs
- **Fix:** Added tag check to skip navigation when target is INPUT, TEXTAREA, or SELECT
- **Files modified:** src/components/sections/v2/project/ProjectNavigation.tsx
- **Verification:** Keyboard nav only activates outside form elements
- **Committed in:** 1b63cea (Task 2 commit)

---

**Total deviations:** 2 auto-fixed (1 bug, 1 missing critical)
**Impact on plan:** Both fixes necessary for correctness. No scope creep.

## Issues Encountered
None

## User Setup Required
None - no external service configuration required.

## Next Phase Readiness
- All project page components are now real (no placeholders remain)
- Gallery types render from content model data
- Navigation enables project-to-project flow with keyboard support
- Project pages are feature-complete for Phase 03

## Self-Check: PASSED

All 5 created files verified on disk. Both commit hashes (4578194, 1b63cea) found in git log.

---
*Phase: 03-project-pages*
*Completed: 2026-04-06*
