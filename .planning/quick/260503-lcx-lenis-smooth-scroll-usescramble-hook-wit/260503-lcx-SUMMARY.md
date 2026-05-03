---
phase: 260503-lcx
plan: quick
subsystem: animation-infrastructure
tags: [lenis, scroll, scramble, hook, menu-section, pilot]
dependency-graph:
  requires:
    - src/components/layout/PageShell.tsx (existing)
    - src/components/sections/v2/MenuSection.tsx (existing)
  provides:
    - lenis runtime dependency
    - useScramble hook (V2-scoped, hand-rolled, zero-deps)
    - first MenuSection item scramble pilot
  affects:
    - V1 useScramble consumers (Intro, AsciiScrambleLogo, InlineToast) — renamed to useAsciiScramble (no behavior change)
tech-stack:
  added:
    - lenis@1.3.23 (runtime dependency)
  patterns:
    - hand-rolled hook (setInterval + ref + cleanup) following project hook convention
    - reduced-motion gate at instantiation (skip Lenis entirely, not just disable)
    - hooks-at-top-level for conditional row application (call once, thread result by index)
key-files:
  created:
    - src/hooks/useScramble.ts
  modified:
    - package.json
    - pnpm-lock.yaml
    - src/components/layout/PageShell.tsx
    - src/components/sections/v2/MenuSection.tsx
    - src/hooks/useAsciiScramble.ts (renamed from src/hooks/useScramble.ts to free the V2 name)
    - src/components/sections/Intro.tsx (V1 — import path follows rename)
    - src/components/ui/AsciiScrambleLogo.tsx (V1 — import path follows rename)
    - src/components/ui/InlineToast.tsx (V1 — import path follows rename)
decisions:
  - Renamed pre-existing useScramble (V1 ASCII block-scramble with `{ chars, isComplete }` return) to useAsciiScramble to free the canonical V2 hook name per the plan's contract; semantic separation is also clearer (block-scramble vs. character-reveal are distinct primitives)
  - Hand-rolled scramble via setInterval + ref-based cleanup (per plan); useTimeout-recursion deliberately avoided for clean strict-mode cancellation
  - Reduced-motion gate is a hard skip at mount (Lenis never instantiated) rather than a runtime media-query subscription — static export + one-shot mount makes subscribing redundant
  - useScramble does NOT internally check prefers-reduced-motion (deliberate scope choice; can be added in rollout task if needed). Effective behaviour: when active=false the hook snaps to text immediately, so reduced-motion users who never trigger active=true never see scramble — the hover/focus-driven activation path naturally collapses to no-op for them
metrics:
  duration: ~12 min
  completed: 2026-05-02
  tasks_completed: 3 of 3 auto tasks (Task 4 awaiting human-verify)
---

# Phase 260503-lcx Plan quick: Lenis smooth scroll + useScramble hook + first MenuSection item pilot Summary

Established two animation-infrastructure primitives — Lenis damped scroll mounted at the home shell, and `useScramble` (zero-deps character reveal) — and validated the scramble primitive by wiring it to the first MenuSection row only, leaving the rest of the menu and ExperienceSection / button overlays explicitly untouched until human verification.

## What Changed

### Lenis smooth scroll (Task 1, commit `efba36c`)

- `pnpm add lenis` — `lenis@1.3.23` added as a runtime dependency
- `src/components/layout/PageShell.tsx`: new `useEffect` block before `useFontReady()` instantiates `new Lenis({ lerp: 0.1, smoothWheel: true })`, drives a `requestAnimationFrame` loop that calls `lenis.raf(time)`, and cleans up via `cancelAnimationFrame(rafId) + lenis.destroy()`
- Reduced-motion gate: `window.matchMedia('(prefers-reduced-motion: reduce)').matches` short-circuits before Lenis is constructed — the library is never instantiated for reduced-motion users, so its CSS classes (`.lenis`, `.lenis-smooth`) never appear on `<html>`
- Scope: home only (PageShell is the home orchestrator). `/about`, `/experience`, `/projects/*` use their own page components and are NOT wired in this pilot — broader mounting decision deferred per plan's success-criteria note

### useScramble hook (Task 2, commit `0384994`)

- New file: `src/hooks/useScramble.ts` (~95 lines)
- Signature: `useScramble(text: string, active: boolean, opts?: { stepMs?: number; charPool?: string }): string`
- Defaults: `stepMs = 26`, `charPool = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ!@#$%'`
- Behaviour contract:
  - `active === true` → progressive left-to-right reveal; unrevealed positions show random `charPool` chars re-rolled every step; reveals one character per 2 steps (a 10-char label settles in ~520ms with default `stepMs`)
  - `active === false` → `setDisplay(text)` immediately and clear any in-flight interval — no residue
  - Whitespace preserved (never randomised)
  - On settle (`revealed >= total`) the interval self-clears
  - Cleanup on unmount; React 19 strict-mode double-invoke is safe (cleanup fires between effect calls — no two intervals coexist)
  - First tick fires synchronously so the first frame shows scramble (not the original text for `stepMs` ms)
- Implementation: `setInterval` + `useRef` for the interval handle (deliberately avoids `setTimeout` recursion which is harder to cancel cleanly under strict mode)
- TypeScript: passes `tsc --noEmit` with strict mode (no `any`); uses `ReturnType<typeof setInterval>` for cross-environment interval handle typing

### Pilot wire-up: first MenuSection row (Task 3, commit `6ae3a99`)

- `src/components/sections/v2/MenuSection.tsx`:
  - Added `import { useScramble } from '@/hooks/useScramble'`
  - After `keyboardSticky` derivation, hoisted `firstItem`, `firstItemHighlighted`, `firstItemScrambledLabel` to component top level — `useScramble` is called UNCONDITIONALLY once per render, before the row map. This keeps hook ordering stable across renders even if `filteredItems` changes (e.g., type-to-filter)
  - Inside the row map, `const labelText = index === 0 ? firstItemScrambledLabel : item.label` — index 0 receives the scrambled string, indices 1..N pass through unchanged
  - Replaced both `/{item.label}` renderings (resting `font-sans` line + `.type-overlay-hover` `font-mono` overlay) with `/{labelText}` so they scramble in lockstep from a single hook call
  - Description, arrow, bar, animations, keyboard nav, FloatingPreview, and keyboard hints are all untouched

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 3 - Blocking] Pre-existing `useScramble` hook collision**

- **Found during:** Task 2
- **Issue:** `src/hooks/useScramble.ts` already existed with a different API: `useScramble(finalText: string, options?: UseScrambleOptions): { chars: ScrambleChar[], isComplete: boolean, text: string }`. It supports two modes (`'scramble'` block-cycle and `'scanner'` left-to-right sweep with `█▓▒░`), respects `prefers-reduced-motion` internally, and is consumed by 3 V1 components (`Intro.tsx`, `AsciiScrambleLogo.tsx`, `InlineToast.tsx`). The plan's `Write` for `useScramble.ts` would have silently broken all three V1 consumers and lost the existing logic.
- **Fix:** Renamed the existing hook file to `src/hooks/useAsciiScramble.ts` and renamed its export + interfaces to `useAsciiScramble`, `UseAsciiScrambleOptions`, `UseAsciiScrambleResult`. Updated the 3 V1 consumers to import from the new name. Then created the new V2 `useScramble.ts` per the plan's contract. The V1 ASCII block-scramble and the V2 character-reveal scramble are now distinct primitives with separate names — semantically clearer and respects both call-site contracts.
- **Files modified:** `src/hooks/useScramble.ts` (renamed → `useAsciiScramble.ts`), `src/components/sections/Intro.tsx`, `src/components/ui/AsciiScrambleLogo.tsx`, `src/components/ui/InlineToast.tsx`
- **Commit:** `0384994` (bundled with the new hook creation as a single atomic commit — the rename is a prerequisite, not a separate concern)
- **Why bundled:** The rename + V2 hook creation is one atomic unit. Splitting them across two commits would leave a window where `useScramble` is gone but `useAsciiScramble` is not yet imported by V1 consumers — broken intermediate state.

## Authentication / Human-Action Gates

None encountered during automated execution.

## Pilot Integration Site

- **MenuSection first row only** (`filteredItems[0]`)
- Both `font-sans` resting span (line ~191) and `.type-overlay-hover` `font-mono` overlay span (line ~203) consume the same `firstItemScrambledLabel` value — they scramble in lockstep
- Items 2..N: identical to pre-pilot behaviour (regression-free)
- Edge cases handled:
  - Empty `filteredItems` (type-to-filter no match): `firstItem` is `undefined`, `useScramble('', false)` returns `''`, map body is empty — safe
  - First item changes due to type-to-filter: the hook re-runs (deps include `text`), the new index-0 item gets scramble on hover — acceptable for pilot

## Out-of-Scope (Confirmed Deferred)

Per plan GATE-01 — execution stopped after Task 3 commit. The following are EXPLICITLY out of scope and will be tackled in a separate quick task ONLY after user approves the pilot:

- Replicating scramble to remaining MenuSection items (indices 1..N)
- Applying scramble to ExperienceSection rows
- Applying scramble to `.type-overlay-hover` button text (Primary / Secondary button hover overlays)
- Lenis `scrollTo` helpers / anchor handlers
- Page-transition scroll restoration coordination with Lenis
- Migrating `useScrollReveal` / `useScrollExpand` to Motion's `useScroll` (Lenis-aware)
- Mounting Lenis on `/about`, `/experience`, `/projects/*` page shells

## Rollback Marker

Tag `pre-lenis-scramble` at commit `f98294f` is the safety net for the entire pilot range (Tasks 1-3). To roll back:

```bash
git reset --hard pre-lenis-scramble
pnpm install   # remove lenis from node_modules + lockfile
```

The 3 V1 consumer renames (`useAsciiScramble`) are bundled into commit `0384994` and would be reverted together with the new hook.

## Task 4 Status: AWAITING HUMAN VERIFICATION

Task 4 is a `checkpoint:human-verify` gate. The plan executor stopped after Task 3 commit per GATE-01 and did NOT attempt to verify scroll feel or scramble timing programmatically. The user must manually validate four axes before broader rollout:

1. **Lenis smoothness** — home page mouse wheel + trackpad feels noticeably damped (compare against `git stash` or `git reset --hard pre-lenis-scramble` for an A/B); no scroll jank, no stutter, no conflict with `-inview` IntersectionObserver entrances; `AboutPinned` (sticky 400vh on `/about`) and `ExperienceHero` (sticky 400vh on `/experience`) pin correctly — Lenis is not mounted on those routes so they should be unaffected
2. **Reduced-motion gate** — DevTools → Rendering → emulate `prefers-reduced-motion: reduce`, hard refresh, scroll: native browser scroll (instant), and `<html>` has no `.lenis` / `.lenis-smooth` classes
3. **First-item scramble pilot** — hover the topmost MenuSection row: characters scramble briefly, settle on the original label as it reveals left-to-right over ~500-600ms; resting `font-sans` line and `font-mono` hover overlay show the SAME scrambled string at the SAME moment (lockstep); cursor-off snaps back to the original text instantly; cursor-back-on restarts cleanly; keyboard nav (↑↓ to land on first row) fires identically
4. **No regression** — items 2..N render normally (no scramble); no timer leaks across rapid hover toggles

If any axis fails, the user describes which axis (Lenis feel / scramble timing / scramble char pool / span sync) and the executor returns to the corresponding task to tune (e.g., `stepMs` default, `DEFAULT_POOL` chars).

On `"approved"`, the next quick task replicates scramble to remaining MenuSection items, ExperienceSection rows, and button hover overlays.

## Self-Check: PASSED

Verified:
- `src/hooks/useScramble.ts` exists, exports `useScramble`, `(text, active, opts?) => string` signature, has `clearInterval` cleanup
- `src/hooks/useAsciiScramble.ts` exists (renamed from prior `useScramble.ts`), exports `useAsciiScramble`
- Commits exist: `efba36c` (Task 1), `0384994` (Task 2), `6ae3a99` (Task 3) — all visible in `git log --oneline -5`
- `package.json` contains `"lenis"`, `pnpm-lock.yaml` updated
- `src/components/layout/PageShell.tsx` imports `Lenis`, has `new Lenis`, `prefers-reduced-motion: reduce` gate, `lenis.destroy`, `cancelAnimationFrame`
- `src/components/sections/v2/MenuSection.tsx` imports `useScramble`, defines `firstItemScrambledLabel`, has `const labelText = index === 0` derivation, renders `/{labelText}` exactly twice and `/{item.label}` zero times
- `pnpm tsc --noEmit` exits 0
