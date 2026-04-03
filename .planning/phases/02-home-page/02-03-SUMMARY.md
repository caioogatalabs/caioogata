---
phase: 02-home-page
plan: 03
subsystem: ui
tags: [cli-menu, keyboard-navigation, floating-preview, cursor-tracking, velocity-skew, react-hooks, reduced-motion]

# Dependency graph
requires:
  - phase: 02-home-page
    plan: 01
    provides: CSS animation system (entrance classes, stagger delays), Grid/GridItem, useInView hook, PageShell with section stubs
provides:
  - useMenuNavigation hook (keyboard nav, text filter, hover state)
  - FloatingPreview component (cursor-following image with velocity skew)
  - MenuSection with CLI input, filterable rows, keyboard navigation, row dimming, floating preview
affects: [02-04]

# Tech tracking
tech-stack:
  added: []
  patterns: [useMenuNavigation-hook, floating-preview-cursor-tracking, row-dimming-on-hover, cli-input-filter, velocity-skew-transform]

key-files:
  created:
    - src/hooks/useMenuNavigation.ts
    - src/components/sections/v2/FloatingPreview.tsx
  modified:
    - src/components/sections/v2/MenuSection.tsx
    - src/components/layout/PageShell.tsx

key-decisions:
  - "Separated hoveredIndex from activeIndex in useMenuNavigation for independent mouse/keyboard highlight tracking"
  - "FloatingPreview uses window.matchMedia for reduced-motion instead of CSS media query since skewX/scale are inline styles"
  - "Updated PageShell to import en.json content and pass typed menu prop to MenuSection"
  - "Preview images use /previews/{key}.webp convention -- images not yet created, component handles null gracefully"

patterns-established:
  - "Menu hook pattern: pure state hook (useMenuNavigation) with consumer handling routing"
  - "Velocity tracking: delta between current and previous mouseX fed to skewX transform"
  - "Row dimming: conditional text-tertiary class on non-hovered rows with CSS transition-colors"

requirements-completed: [HOME-02, HOME-05]

# Metrics
duration: 3min
completed: 2026-04-03
---

# Phase 2 Plan 3: Menu Section with CLI Navigation and Floating Preview Summary

**CLI-inspired menu with type-to-filter input, full keyboard navigation (arrows/Enter/Esc), cursor-following floating image preview with velocity-based skewX, and row dimming on hover**

## Performance

- **Duration:** 3 min
- **Started:** 2026-04-03T17:38:51Z
- **Completed:** 2026-04-03T17:41:33Z
- **Tasks:** 4
- **Files modified:** 4

## Accomplishments

### Task 1: useMenuNavigation hook (b46ba80)
- Created `src/hooks/useMenuNavigation.ts` with complete keyboard navigation and filter state
- ArrowDown/ArrowUp cycle through filteredItems with wrapping
- Enter calls onSelect, Escape calls onEscape
- Type-to-filter: typing anywhere focuses the input and updates filter
- Case-insensitive matching against item.label and item.description
- Separate hoveredIndex (mouse) from activeIndex (keyboard)
- Document-level keydown listener for global keyboard access

### Task 2: FloatingPreview component (6b8407e)
- Created `src/components/sections/v2/FloatingPreview.tsx`
- Fixed-position cursor-following preview (500x300px, 12px radius)
- Velocity-based skewX clamped to +/-30 degrees
- Opacity + scale transitions for smooth enter/exit
- Hidden on mobile and tablet via `hidden lg:block`
- `will-change: transform` for GPU acceleration
- prefers-reduced-motion: disables skewX, removes scale transition, reduces opacity transition

### Task 3a: MenuSection core (c866757)
- Replaced stub with full MenuSection using 2-8-2 Grid layout
- CLI input with `>` prompt, monospace font, brand-yellow caret, bound to filter
- Menu rows render filteredItems with 30px label and 16px description
- Contact item dispatches `open-contact` CustomEvent and scrolls to footer
- Projects item scrolls to `[data-section-id="projects"]` section
- Other items navigate via `router.push(/${key})`
- Navigation hints bar at bottom (desktop only, monospace, overline style)
- Staggered entrance animations (-slide-up with -a-N delays)
- Updated PageShell to import content and pass typed menu prop

### Task 3b: Interaction layer (40e33b0)
- Added mouse tracking (clientX/clientY) on section onMouseMove
- Velocity computed as delta between current and previous mouseX
- FloatingPreview receives imageSrc, alt, mouseX, mouseY, velocityX
- Row dimming: non-hovered rows transition to text-tertiary over 0.3s with --ease-out
- hoveredIndex drives both dimming visual and preview image selection
- Preview image path: `/previews/{key}.webp` (images to be added later)

## Cross-Plan Contracts

- MenuSection targets `[data-section-id="projects"]` for scroll (Plan 02-04 provides this)
- MenuSection dispatches `open-contact` CustomEvent (Plan 02-04 FooterSection listens)
- MenuSection targets `[data-section-id="footer"]` for scroll (Plan 02-04 provides this)

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 3 - Blocking] Updated PageShell to pass content prop**
- **Found during:** Task 3a
- **Issue:** PageShell rendered `<MenuSection />` without props, but MenuSection now requires `content: Menu` prop
- **Fix:** Imported en.json and Content type, passed `typedContent.menu` to MenuSection
- **Files modified:** src/components/layout/PageShell.tsx
- **Commit:** c866757

## Known Stubs

- **Preview images:** MenuSection references `/previews/{key}.webp` for 8 menu items, but these image files do not exist yet. FloatingPreview renders a solid surface-primary background as fallback. This is intentional -- preview images will be added as content assets, and the component handles null/missing images gracefully.

## Verification

- `npx next build` passes successfully
- All 8 menu items from en.json render in the menu
- Keyboard navigation (ArrowUp/Down/Enter/Esc) wired via useMenuNavigation
- Filter input narrows visible items
- FloatingPreview appears on desktop hover
- Row dimming transitions non-hovered rows to text-tertiary
- Section targeting uses `data-section-id` attributes
- FloatingPreview respects prefers-reduced-motion for inline style animations
