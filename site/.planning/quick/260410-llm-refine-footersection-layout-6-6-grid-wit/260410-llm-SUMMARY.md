---
phase: quick
plan: 260410-llm
subsystem: v2-footer
tags: [footer, refactor, grid, cta, ui]
requires:
  - FooterSection.tsx (existing)
  - ContactForm.tsx (unchanged)
  - IntroSection.tsx (pattern reference)
provides:
  - Refactored FooterSection with 6-6 grid layout
  - Grouped Contact pill + square icon CTA (shared hover state)
affects:
  - Home page footer visual/interaction
tech-stack:
  added: []
  patterns:
    - Grouped CTA hover (pill + icon shared state, icon +0.1s delay) — ported from IntroSection
    - data-theme="light" scoped to right-column card only
key-files:
  created: []
  modified:
    - src/components/sections/v2/FooterSection.tsx
decisions:
  - Footer root stays dark; data-theme="light" lives only on the right-column grey form card
  - Social links and grey card both live inside the max-height wrapper (no separate conditional render) so collapsed state hides both
  - Replaced contactHovered with groupHovered driving both pill and square icon animations
metrics:
  duration: ~3min
  completed: 2026-04-10
  tasks_completed: 1
  tasks_total: 2
  status: awaiting-human-verify
---

# Quick 260410-llm: Refine FooterSection Layout Summary

Refactored `FooterSection.tsx` into a 6-6 expandable grid (social links on dark bg left, grey `data-theme="light"` form card right) with a grouped Contact pill + square icon CTA that shares a single `groupHovered` state, matching the IntroSection pattern.

## Tasks Executed

### Task 1: Refactor FooterSection structure and CTA group — COMMITTED

- **Commit:** `eabb8c2`
- **File:** `src/components/sections/v2/FooterSection.tsx`
- **Changes:**
  - Removed outer `<div className="bg-bg-surface-tertiary rounded-[12px]" data-theme="light">` that wrapped the entire footer.
  - Replaced the old `p-5 md:p-8 grid grid-cols-4 ... lg:grid-cols-12` grid with a flat `grid grid-cols-12 gap-4 md:gap-5 pb-8` containing two `col-span-12 md:col-span-6` children.
  - Left column: social links on dark bg (no theme override — inherits dark tokens from footer root).
  - Right column: grey card with `bg-bg-surface-tertiary rounded-[12px] p-5 md:p-8 data-theme="light"` containing only `<ContactForm />`.
  - Bottom row moved out of the grey wrapper, now a direct sibling of the expandable div with `flex items-center justify-between pt-2`, on dark bg.
  - Replaced single Contact button with a grouped flex wrapper (`gap-0.5`) containing:
    - Pill: `h-12 rounded-full px-8` — label swaps Contact/Close, Fabio XM → Pexel Grotesk 1.5rem masked vertical swap.
    - Square icon: `size-12 rounded-[12px]` — icon swaps +/×, Fabio XM → Pexel Grotesk 1.5rem swap with +0.1s delay on enter branch.
  - Both buttons call `onClick={toggleExpanded}`; both carry `aria-expanded` and `aria-controls={EXPAND_CONTENT_ID}`.
  - Replaced `contactHovered` state with `groupHovered`, toggled via `onMouseEnter/Leave` on the flex wrapper (not individual buttons).
  - All three `useEffect` hooks (reduced-motion detection, `open-contact` listener, scroll-to-bottom auto-expand), `toggleExpanded`, `transitionDuration`, and refs preserved byte-for-byte.
  - `ContactForm.tsx` not modified.

**Verification:**
- `pnpm exec tsc --noEmit` — no errors in `FooterSection.tsx` (pre-existing unrelated errors in `Grid.tsx` and `ProjectImpact.tsx` out of scope).
- Done-criteria greps: `grid-cols-12` ×1, `col-span-12 md:col-span-6` ×2, `data-theme="light"` ×1, `bg-bg-surface-tertiary` ×1, `onClick={toggleExpanded}` ×2 — all match plan.
- `git diff` limited to `src/components/sections/v2/FooterSection.tsx` (120+/74-).

### Task 2: Human-verify checkpoint — PENDING

Not executed per orchestrator instructions. This is a `checkpoint:human-verify` gate. User must run `pnpm dev` and verify:

1. Collapsed state shows only bottom row on dark bg (no grey card, no social links).
2. Hovering pill or square icon animates both together; icon hover has ~100ms stagger.
3. Clicking either element expands the footer into the 6-6 grid (social links left dark, grey rounded-12 form card right).
4. Pill text swaps Contact ↔ Close, icon swaps + ↔ ×.
5. Auto-expand on scroll-to-bottom still works (once).
6. `open-contact` event still expands and scrolls footer into view.
7. Keyboard: Tab to pill/icon, Enter toggles expand.
8. `prefers-reduced-motion` collapses transition to 0.01s.

See the plan's `<how-to-verify>` block for the full checklist.

## Deviations from Plan

None — plan executed exactly as written.

## Lint Note

`pnpm exec next lint --file ...` could not run non-interactively because the project has not been migrated off `next lint` (deprecated in Next 16) and prompts for initial ESLint config. TypeScript type-check on the modified file is clean. Not a blocker — pre-existing project setup state, out of scope for this quick task.

## Commits

- `eabb8c2` refactor(quick-260410-llm): restructure FooterSection into 6-6 grid with grouped CTA

## Self-Check: PASSED

- `src/components/sections/v2/FooterSection.tsx` — FOUND (modified)
- `src/components/sections/v2/ContactForm.tsx` — FOUND (unchanged, verified via diff scope)
- Commit `eabb8c2` — FOUND in `git log`
- `.planning/quick/260410-llm-refine-footersection-layout-6-6-grid-wit/260410-llm-SUMMARY.md` — FOUND (this file)
