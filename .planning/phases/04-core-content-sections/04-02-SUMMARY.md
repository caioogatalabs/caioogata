---
phase: 04-core-content-sections
plan: 02
subsystem: ui
tags: [react, tailwind, css-animations, accordion, keyboard-navigation]

requires:
  - phase: 02-home-page
    provides: MenuSection hover pattern (yellow bar, masked text swap, arrow), useMenuNavigation, useInView, StickyLogoBar
provides:
  - /experience route with interactive role rows
  - useExperienceNavigation keyboard navigation hook
  - MenuSection-identical hover pattern on experience rows
  - CSS grid accordion expand with 6-6 content layout
affects: [04-core-content-sections, 05-polish]

tech-stack:
  added: []
  patterns: [experience-row-hover-pattern, css-grid-accordion, independent-mouse-keyboard-tracking]

key-files:
  created:
    - src/app/experience/page.tsx
    - src/hooks/useExperienceNavigation.ts
  modified:
    - src/components/sections/v2/ExperienceSection.tsx

key-decisions:
  - "Replicated MenuSection hover pattern exactly (yellow bar, masked text swap, arrow, timings) for visual consistency"
  - "Used CSS grid-template-rows 0fr/1fr for accordion instead of max-height for natural content sizing"
  - "Expanded row keeps bg-fill-primary yellow with on-primary text for active state"

patterns-established:
  - "Experience row hover: identical to MenuSection yellow bar + masked text swap pattern"
  - "CSS grid accordion: grid-template-rows 0fr to 1fr with ease-smooth transition"
  - "Keyboard nav hook pattern: separate activeIndex/hoveredIndex with highlightedIndex derived, isDimmed utility"

requirements-completed: [SECT-02]

duration: 3min
completed: 2026-04-18
---

# Phase 04 Plan 02: Experience Page Summary

**Interactive experience page with 12 role rows using MenuSection-identical hover pattern, CSS grid accordion expand, and full keyboard navigation**

## Performance

- **Duration:** 3 min
- **Started:** 2026-04-18T23:11:57Z
- **Completed:** 2026-04-18T23:15:54Z
- **Tasks:** 2
- **Files modified:** 3

## Accomplishments
- Built /experience route with display heading hero and career stats
- 12 experience rows with MenuSection-identical hover (yellow bar, masked text swap, 3.5rem arrow, row dimming)
- CSS grid-template-rows accordion expand with 6-6 content layout (description + achievements)
- Full keyboard navigation via useExperienceNavigation hook (arrows, enter, escape)
- prefers-reduced-motion support disabling all animated transitions
- Light theme (data-theme="light") throughout

## Task Commits

Each task was committed atomically:

1. **Task 1: Route page + useExperienceNavigation hook** - `de0251d` (feat)
2. **Task 2: ExperienceSection component** - `4350c39` (feat)

## Files Created/Modified
- `src/app/experience/page.tsx` - Route page thin wrapper with metadata
- `src/hooks/useExperienceNavigation.ts` - Keyboard navigation hook with arrow keys, enter expand/collapse, escape, isDimmed
- `src/components/sections/v2/ExperienceSection.tsx` - Full experience page with hero, interactive rows, accordion, light theme

## Decisions Made
- Replicated MenuSection hover pattern exactly (yellow bar, masked text swap, arrow, timings) for visual consistency across the portfolio
- Used CSS grid-template-rows for accordion (0fr to 1fr) instead of max-height for natural content sizing
- Expanded row keeps yellow bg-fill-primary with on-primary text to signal active state
- 6-6 grid inside expanded content: description left, achievements right (conditionally rendered)

## Deviations from Plan

None - plan executed exactly as written.

## Issues Encountered
None

## User Setup Required
None - no external service configuration required.

## Next Phase Readiness
- Experience page complete with all interactions
- Pattern established for content page structure (StickyLogoBar + hero + content + keyboard hints)
- Ready for Skills page (plan 03) which follows similar pattern

## Self-Check: PASSED

- src/app/experience/page.tsx: FOUND
- src/hooks/useExperienceNavigation.ts: FOUND
- src/components/sections/v2/ExperienceSection.tsx: FOUND
- Commit de0251d: FOUND
- Commit 4350c39: FOUND

---
*Phase: 04-core-content-sections*
*Completed: 2026-04-18*
