---
quick_id: 260410-mcf
type: execute
status: awaiting-verification
completed_date: 2026-04-10
duration: 2min
tasks_completed: 1
tasks_total: 2
files_modified:
  - src/components/sections/v2/FooterSection.tsx
commits:
  - 0e578b9
requirements:
  - QUICK-260410-mcf
---

# Quick Task 260410-mcf: Footer Second Pass — CTA in Card, Social Bottom-Aligned

Restructured FooterSection so the Contact pill+icon CTA lives inside the grey right-column card (anchored at card bottom), the form expands upward from the button via max-height animation on the form wrapper, social links are bottom-aligned in the left column, and the bottom row contains only tech tags + copyright.

## Files Modified

- `src/components/sections/v2/FooterSection.tsx` — JSX body restructured (hooks, state, helper components untouched)

## Structural Before → After

**Before:**
- Outer `<div id={EXPAND_CONTENT_ID}>` with max-height wrapped the entire 6-6 grid (whole grid collapsed/expanded together)
- Left col: social links in `flex flex-col gap-1` (top-aligned)
- Right col: grey card with only `<ContactForm />`
- Bottom row: `justify-between` with tags+copyright left and the CTA group (pill + square icon) right

**After:**
- Main 6-6 grid is always rendered (no outer max-height)
- Left col: `flex flex-col justify-end` — social links wrapper bottom-aligned, fades in via `opacity` + `pointerEvents` when `isExpanded`
- Right col: grey card becomes `flex flex-col gap-5` and contains:
  - Form wrapper (`id={EXPAND_CONTENT_ID}`, `ref={contentRef}`) — `max-height` + `opacity` animated from 0 → `scrollHeight`
  - CTA group (pill + square icon) — `self-end`, always visible, naturally pinned at card bottom because it's the last flex child
- Bottom row: plain `flex items-center pt-2` with only tags + copyright (CTA removed)

## Key Implementation Details

1. `id={EXPAND_CONTENT_ID}` + `ref={contentRef}` moved from the outer grid wrapper to the form wrapper inside the card, so `scrollHeight` measures the form directly. `aria-controls` on both CTA buttons still correctly points at `EXPAND_CONTENT_ID`.
2. Both CTA buttons (pill and square icon) copied verbatim into the card — hover timings, font swap, EASE refs, `isExpanded` labels/icons, aria attributes, yellow fill (`bg-fill-primary` / `text-on-primary`) all untouched.
3. Form wrapper uses `transition: max-height ${transitionDuration}, opacity ${transitionDuration}` so `prefers-reduced-motion` auto-applies via the existing `transitionDuration` derivation (0.01s vs 0.6s).
4. Social links wrapper preserves fade-in-on-expand via inline `opacity` + `pointerEvents` styles (existing behavior).
5. Bottom row dropped `justify-between` since only one child remains; kept `flex items-center pt-2`.
6. All hooks and effects preserved byte-for-byte: `useInView`, `prefersReducedMotion` effect, `open-contact` listener, auto-expand-on-scroll, `toggleExpanded`, `footerRef`/`sectionRef` merging.

## Verification

- `pnpm exec tsc --noEmit`: FooterSection.tsx clean (no errors). Pre-existing TS errors in `src/components/layout/Grid.tsx` and `src/components/sections/v2/project/ProjectImpact.tsx` are unrelated to this task and out of scope.
- `git diff src/components/sections/v2/ContactForm.tsx`: empty (0 lines) ✓
- ESLint/`next lint` unavailable in worktree (pre-existing infra — Next.js CLI can't find `app/` from worktree root; ESLint v9 requires flat config not present). Out of scope.

## Deviations from Plan

None. Plan executed exactly as written.

**Out-of-scope discoveries (NOT fixed, logged here):**
- Pre-existing TS errors in `src/components/layout/Grid.tsx` (lines 36–60) and `src/components/sections/v2/project/ProjectImpact.tsx` (line 40).
- Lint tooling broken in worktree (`next lint` can't find app dir; `eslint` has no config file).

## Task 2: Checkpoint (NOT executed)

Task 2 is `type="checkpoint:human-verify"` — per task instructions, it was not executed by the executor. Visual verification is pending user approval.

**How to verify (from plan):**
1. `pnpm dev`, scroll to footer.
2. Collapsed: right col shows small grey bubble with only the Contact CTA pinned bottom-right; left col empty; bottom row shows tags + copyright only.
3. Click Contact/`+` → form grows upward from button; social links fade in bottom-aligned on the left.
4. Hover either CTA button → both swap to Pexel Grotesk 1.5rem with +0.1s icon stagger.
5. Click Close/`×` → form collapses upward into button.
6. Scroll to very bottom → auto-expands after ~300ms.
7. DevTools: `window.dispatchEvent(new Event('open-contact'))` → expands + scrolls into view.
8. Reduced motion → instant transitions.
9. Tab to pill → `aria-expanded` reflects state; SR announces "Contact form" / "Close contact form" on icon.
10. `git diff src/components/sections/v2/ContactForm.tsx` empty.

## Follow-up

- **Button color tweak**: User noted the yellow CTA inside the grey light-themed card may need a different treatment to harmonize with the surface — deferred ("depois olhamos"). To be handled in a follow-up quick task.

## Commits

| # | Hash    | Message                                                       |
|---|---------|---------------------------------------------------------------|
| 1 | 0e578b9 | refactor(quick-260410-mcf): relocate footer CTA into grey card |

## Self-Check: PASSED

- FOUND: src/components/sections/v2/FooterSection.tsx (modified)
- FOUND: commit 0e578b9
- CONFIRMED: ContactForm.tsx unchanged (git diff empty)
- CONFIRMED: id={EXPAND_CONTENT_ID} on form wrapper inside card
- CONFIRMED: Left col uses `flex flex-col justify-end`
- CONFIRMED: Right col card uses `flex flex-col gap-5` with form first + CTA last (`self-end`)
- CONFIRMED: Bottom row contains only tags + copyright (no `setGroupHovered` references in bottom row)
