---
phase: 04-core-content-sections
plan: 01
subsystem: ui
tags: [react, canvas, scroll-animation, video, hooks, next.js]

requires:
  - phase: 02-home-page
    provides: "StickyLogoBar, useInView, Grid/GridItem, entrance animations, semantic tokens"
  - phase: 03-project-pages
    provides: "ProjectPageShell pattern (StickyLogoBar reuse, page shell structure)"
provides:
  - "/about route with scroll-driven video hero and editorial bio layout"
  - "useScrollVideo hook for scroll-linked canvas frame sequencing"
  - "Frame extraction script for video-to-JPEG conversion"
affects: [04-core-content-sections, 05-secondary-sections]

tech-stack:
  added: [ffmpeg (build tool)]
  patterns: [scroll-linked canvas frame sequencer, video-to-frame extraction pipeline]

key-files:
  created:
    - src/app/about/page.tsx
    - src/hooks/useScrollVideo.ts
    - scripts/extract-frames.sh
    - public/about-frames/.gitkeep
  modified:
    - src/components/sections/v2/AboutSection.tsx
    - .gitignore

key-decisions:
  - "JPEG frames instead of WebP due to ffmpeg encoder availability (libwebp not compiled in)"
  - "Frames gitignored (10MB/241 files) with extraction script as source of truth"

patterns-established:
  - "useScrollVideo: rAF scroll-linked canvas frame sequencer with preload, reduced-motion fallback"
  - "Page route pattern: thin wrapper importing section component with metadata export"

requirements-completed: [SECT-01]

duration: 4min
completed: 2026-04-18
---

# Phase 04 Plan 01: About Page Summary

**Scroll-driven video hero with canvas frame sequencer and 6-6 editorial bio layout on /about route**

## Performance

- **Duration:** 4 min
- **Started:** 2026-04-18T23:12:14Z
- **Completed:** 2026-04-18T23:16:24Z
- **Tasks:** 2
- **Files modified:** 6

## Accomplishments
- Created useScrollVideo hook with rAF-driven canvas frame sequencer (241 frames, preloaded)
- Built AboutSection with scroll-driven video hero (400vh zone, sticky viewport canvas) and editorial bio layout
- Established frame extraction pipeline (ffmpeg script) for video-to-JPEG conversion
- Created /about route with proper metadata and static export compatibility

## Task Commits

Each task was committed atomically:

1. **Task 1: Frame extraction script + useScrollVideo hook + route page** - `64c55b7` (feat)
2. **Task 2: AboutSection component -- video hero + editorial bio layout** - `f3fdd4b` (feat)

## Files Created/Modified
- `scripts/extract-frames.sh` - ffmpeg script to extract JPEG frames from video (241 frames)
- `src/hooks/useScrollVideo.ts` - Scroll-linked canvas frame sequencer hook with rAF + preload
- `src/app/about/page.tsx` - Thin route wrapper with metadata for /about
- `src/components/sections/v2/AboutSection.tsx` - Video hero + StickyLogoBar + 6-6 editorial bio with pull quotes
- `public/about-frames/.gitkeep` - Directory placeholder for generated frames
- `.gitignore` - Added generated frame files exclusion

## Decisions Made
- Used JPEG format instead of WebP because the installed ffmpeg does not include libwebp encoder. Quality is comparable at q=4. The script and hook can be updated to WebP when the encoder is available.
- Generated frame files (241 JPEGs, ~10MB) are gitignored. The extraction script serves as the source of truth. Deployment pipeline should run the script or frames should be added to a CDN/asset pipeline.

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 3 - Blocking] WebP encoder not available in ffmpeg**
- **Found during:** Task 1 (frame extraction)
- **Issue:** ffmpeg installation lacks libwebp encoder, WebP output fails with "Encoder not found"
- **Fix:** Changed output format from WebP to JPEG (quality 4), updated hook default extension from .webp to .jpg
- **Files modified:** scripts/extract-frames.sh, src/hooks/useScrollVideo.ts
- **Verification:** 241 frames extracted successfully, TypeScript compiles clean
- **Committed in:** 64c55b7 (Task 1 commit)

---

**Total deviations:** 1 auto-fixed (1 blocking)
**Impact on plan:** Format change from WebP to JPEG is functionally equivalent. No scope creep.

## Issues Encountered
- Source video file (`about-refs/caio-about-video-hero.mp4`) is in the main repo but not in the git worktree (untracked directory). Resolved with symlink.

## User Setup Required
None - no external service configuration required.

## Next Phase Readiness
- /about route is functional with video hero and editorial content
- Experience and Skills pages (04-02, 04-03) can proceed independently
- Frame extraction script needs to be run on any new checkout (`bash scripts/extract-frames.sh`)

## Self-Check: PASSED

All created files verified. All commits verified (64c55b7, f3fdd4b).

---
*Phase: 04-core-content-sections*
*Completed: 2026-04-18*
