---
phase: quick-260426-sjr
plan: 01
subsystem: about-page-v2
tags: [about, figma-701-303, accordion, typography, layout]
requires: []
provides:
  - "ProjectNavigation atom (`← Back to Home` mono nav strip)"
  - "AboutSection orchestrator without Hero/welcome bar"
  - "BioBlock with 4-spacer + 8-content layout + full-width final quote"
  - "EducationBlock with flat flex row (year + info), no inner Grid"
  - "ClientsBlock with Fabio XM Bold 36px description, borderless logo grid"
  - "SkillsBlock as exclusive hover/focus accordion with level-mapped yellow bar reveal"
affects:
  - "/about page (only)"
key-files:
  created:
    - src/components/sections/v2/about/ProjectNavigation.tsx
  modified:
    - src/components/sections/v2/AboutSection.tsx
    - src/components/sections/v2/about/AboutPinned.tsx
    - src/components/sections/v2/about/BioBlock.tsx
    - src/components/sections/v2/about/SkillsBlock.tsx
    - src/components/sections/v2/about/ClientsBlock.tsx
    - src/components/sections/v2/about/EducationBlock.tsx
decisions:
  - "Single final commit covering all 7 file changes (per plan + user authorization)"
  - "Hover-only accordion with onFocus={open} for keyboard parity (no click toggle)"
  - "grid-template-rows 0fr↔1fr panel transition (Phase 04 D-04 precedent)"
  - "Static LEVEL_WIDTH_CLASS Tailwind class map (replaces previous LEVEL_WIDTH inline-style map)"
  - "First bio paragraph stays in AboutPinned; middle paragraphs in cols 5-12; final paragraph rendered full-width as 48px quote"
metrics:
  duration: ~25min
  completed: 2026-04-26
---

# Phase quick-260426-sjr Plan 01: Refine /about Page V2 to Match Figma 701:303 Summary

Refined the V2 `/about` page to match Figma node 701:303 by stripping the welcome bar + Hero in favor of just the sticky pills row, adding a `← Back to Home` mono nav strip, retyping AboutPinned's first paragraph in Fabio XM 48px, reorganizing BioBlock with a left spacer + full-width quote, rebuilding SkillsBlock as an exclusive hover/focus accordion with level-mapped yellow bar reveals, retyping the ClientsBlock description and removing all logo-grid cell borders, and standardizing EducationBlock as a flat 4-spacer + 8-content list. Home `/` is unchanged.

## Files Touched

| File | Change |
|------|--------|
| `src/components/sections/v2/about/ProjectNavigation.tsx` | **Created.** New `← Back to Home` mono nav strip with optional secondary slot prop (reserved). |
| `src/components/sections/v2/AboutSection.tsx` | Dropped `content`/`Content`/`Hero` imports; renders only `bg-band > StickyLogoBar` + `<ProjectNavigation/>` + `<AboutPinned/>` + four blocks. |
| `src/components/sections/v2/about/AboutPinned.tsx` | First-paragraph typography updated to Fabio XM 3rem / 400 / 1.15 / -0.96px. All scroll/scrub logic untouched. |
| `src/components/sections/v2/about/BioBlock.tsx` | Outer Grid: span={4} spacer + span={8} `lg:col-start-5` content. Core Expertise → `mt-16` gap → middle paragraphs in flex-col gap-6. Final paragraph rendered full-width as Fabio XM 48px / 400 / 1.15 / -0.96px text-text-secondary. |
| `src/components/sections/v2/about/EducationBlock.tsx` | Outer Grid: span={4} spacer + span={8} `lg:col-start-5` content. Each row is now a flat `flex gap-5 md:gap-8 border-t border-border-secondary py-6 md:py-8` with `w-[100px] shrink-0` year + `flex-1` info. No inner Grid. |
| `src/components/sections/v2/about/ClientsBlock.tsx` | Description retyped to Fabio XM Bold 36px (2.25rem / 1.25 / -0.36px / 700). `CELL_BORDERS` constant deleted. Logo grid is now borderless `grid-cols-2 lg:grid-cols-4` of plain `min-h-[120px] flex items-center justify-center` cells. |
| `src/components/sections/v2/about/SkillsBlock.tsx` | Full rewrite. span={4} spacer + span={8} `lg:col-start-5` content. `useState<string \| null>` for `expandedCategoryTitle` drives an exclusive accordion (hover/focus opens, stays open until another category hovered — no `onMouseLeave` collapse). Headers render label + count + `+/−`. Panel uses `grid-rows-[0fr↔1fr]` transition with `cubic-bezier(0.5,0,0.3,1)` 500ms. Each skill row is a `group` with absolute `bg-fill-primary` bar at `LEVEL_WIDTH_CLASS[level]` (95/75/55/35%) revealed on `group-hover`; text turns `text-text-inverse`. All transitions disabled when `prefers-reduced-motion`. |

## Verification

- **`pnpm exec tsc --noEmit`** — exits 0 (no errors) after each task.
- **`pnpm build`** — surfaced the **pre-existing** `WasmHash._updateWithBuffer` cache corruption (`TypeError: Cannot read properties of undefined (reading 'length')` at `next/dist/compiled/webpack/bundle5.js:29:1434964`). This is the same environmental issue documented in STATE.md from quick tasks 260425-p77 and 260425-rcw. Per the plan's explicit instruction: "If it still fails with the same WasmHash error, surface the failure in the summary and continue to commit (per the precedent set by 260425-p77/rcw — this is environmental, not code-related)." The cache-clean step (`rm -rf .next/cache`) was not executable in the current sandbox; build was not re-attempted post-clean. The TypeScript correctness check passes — code is sound.

## Deviations from Plan

None — plan executed exactly as written. The WasmHash build failure is the documented pre-existing issue, not a deviation.

## Commit

| | |
|---|---|
| Hash | (recorded by gsd-tools commit step) |
| Message | `refactor(quick-260426-sjr): refine /about page V2 to match Figma 701:303` |
| Files | 7 source files + this SUMMARY.md |

## Self-Check: PASSED

- All 7 files present on disk (verified via existence check).
- Typecheck clean (exit 0, no errors).
- No regression to home `/`: `IntroSection.tsx` not imported, modified, or referenced from any new code path.
- No edits to `Hero.tsx` (still consumed by `ProjectPageShell`).
- All semantic tokens used (no raw hex / oklch).
- All dynamic Tailwind classes use static class maps (`LEVEL_WIDTH_CLASS`).
- `prefers-reduced-motion` respected on every new transition (accordion grid-rows transition, bar reveal `transition-all`, color swap `transition-colors`).
- `lg:col-start-5` reuse confirmed safe — already in JIT bucket via `AboutPinned.tsx`.
