---
phase: 260503-nrv
plan: quick
subsystem: animation/v2
tags:
  - scramble
  - hover-pattern
  - typography-swap
  - rollout
  - reusable-component
dependency-graph:
  requires:
    - "src/hooks/useScramble.ts (V2-scoped, post-260503-lcx)"
    - "MenuSection pilot pattern at commit c7514bd"
  provides:
    - "src/components/motion/ScrambledLabel.tsx — reusable scramble + typography-swap component"
    - "Scramble hover applied to ALL menu items, ExperienceSection rows, 6 button-overlay surfaces"
  affects:
    - "src/components/sections/v2/MenuSection.tsx"
    - "src/components/sections/v2/ExperienceSection.tsx"
    - "src/components/sections/v2/StickyLogoBar.tsx"
    - "src/components/sections/v2/ProjectCard.tsx"
    - "src/components/sections/v2/ContactOverlay.tsx"
    - "src/components/sections/v2/FloatingContactButton.tsx"
    - "src/components/sections/v2/ContactForm.tsx"
    - "src/components/sections/v2/about/SkillsBlock.tsx"
tech-stack:
  added: []
  patterns:
    - "Reusable scramble + typography-swap component encapsulating useScramble"
    - "Per-mount hook instances (idle when active=false, zero cost at rest)"
    - "Driven by existing per-surface React hover state — no new state machinery"
key-files:
  created:
    - "src/components/motion/ScrambledLabel.tsx"
  modified:
    - "src/components/sections/v2/MenuSection.tsx"
    - "src/components/sections/v2/ExperienceSection.tsx"
    - "src/components/sections/v2/StickyLogoBar.tsx"
    - "src/components/sections/v2/ProjectCard.tsx"
    - "src/components/sections/v2/ContactOverlay.tsx"
    - "src/components/sections/v2/FloatingContactButton.tsx"
    - "src/components/sections/v2/ContactForm.tsx"
    - "src/components/sections/v2/about/SkillsBlock.tsx"
decisions:
  - "ScrambledLabel exposes only `text` + `active` props — no opts pass-through. Default useScramble timings (stepMs 35, charPool ABC...!@#$%) locked from pilot."
  - "Two-span fragment during scramble (font-mono resolved + font-sans tail) preserves the typography-contrast effect from c7514bd. Plain `<>{text}</>` when settled to avoid rendering empty spans."
  - "MenuSection: dual-mount per row (rest + overlay both render <ScrambledLabel>). Independent random tails are not user-visible because the rest span is translateY(-100%) hidden during hover."
  - "Skipped StickyHeader.tsx — verified not imported anywhere (legacy file, dead code)."
  - "Applied to icon overlays (×, +, →) per BTN-02; brief 1-frame flicker is treated as desired effect (consistent pattern across surfaces). User may roll back icon-only application via follow-up if visually unpleasant."
  - "Applied to SkillsBlock skill-name + level-label per BTN-03; accordion sweep behavior treated as deliberate hover (user may roll back if too transient)."
metrics:
  duration: "~12 min"
  completed: "2026-05-03T20:18:24Z"
  tasks-executed: 4
  task-5-status: "awaiting-human-verify (gate per plan)"
  task-6-status: "deferred (optional, post-gate)"
---

# Quick 260503-nrv: Roll Out Scramble Pattern to All Menu/Experience/Button Surfaces — Summary

Extracted the MenuSection-pilot scramble + typography-swap pattern (locked at commit `c7514bd`) into a reusable `<ScrambledLabel>` component and rolled it out to ALL applicable hover surfaces across the V2 surface area: every MenuSection row (was index 0 only), every ExperienceSection row's company + title masked-swap spans, and all `.type-overlay-hover` spans on production buttons (StickyLogoBar, ProjectCard, ContactOverlay, FloatingContactButton, ContactForm, SkillsBlock).

## Tasks Executed

| # | Task | Commit | Status |
|---|------|--------|--------|
| 1 | Extract ScrambledLabel component | `501d049` | done |
| 2 | Apply to all MenuSection items | `ff260d7` | done |
| 3 | Apply to ExperienceSection rows (company + title) | `755d626` | done |
| 4 | Apply to button hover overlays (6 files) | `c012321` | done |
| 5 | Visual validation gate | n/a | **AWAITING HUMAN VERIFY** |
| 6 | Apply to dev/buttons playground (optional) | n/a | **DEFERRED until Task 5 approved** |

## Component Contract

**`src/components/motion/ScrambledLabel.tsx`** (new, 28 lines):

```tsx
'use client'
import { useScramble } from '@/hooks/useScramble'

interface ScrambledLabelProps {
  text: string
  active: boolean
}

export function ScrambledLabel({ text, active }: ScrambledLabelProps) {
  const { display, revealed } = useScramble(text, active)
  const scrambling = active && revealed < display.length
  if (!scrambling) return <>{text}</>
  return (
    <>
      <span className="font-mono">{display.slice(0, revealed)}</span>
      <span className="font-sans">{display.slice(revealed)}</span>
    </>
  )
}
```

Returns `<>{text}</>` (Fragment) so consumers render it as `{<ScrambledLabel ... />}` where a string would otherwise sit. During scramble, two spans render the resolved/unresolved typography contrast. When settled (or inactive), collapses to bare text — no empty spans.

## Per-Surface Application

**MenuSection** (Task 2, `ff260d7`):
- Dropped `firstItem` / `firstItemHighlighted` / `firstItemScramble` top-level plumbing.
- Dropped `isScrambling` / `labelNode` per-row derivation inside the map.
- Each row's two `/{label}` renderings (rest line + `.type-overlay-hover` overlay) now render `<ScrambledLabel text={item.label} active={isHighlighted} />`.
- Replaced `useScramble` import with `ScrambledLabel` import.
- **2 ScrambledLabel instances** per row (one rest + one overlay), N rows total.

**ExperienceSection** (Task 3, `755d626`):
- 4 masked-swap text spans wrapped: `job.company` rest + overlay (cols 4-6), `job.title` rest + overlay (cols 7-12).
- All driven by the existing `showLargeText = isHighlighted || isExpanded` boolean — matches the existing typography swap trigger.
- Mobile-only `md:hidden` block, font-mono date column, arrow icon, and accordion expand panel left as plain text (per EXP-02).
- **4 ScrambledLabel instances** per row.

**Button overlay surfaces** (Task 4, `c012321`):

| File | Instances | Driven by |
|------|-----------|-----------|
| StickyLogoBar.tsx | 2 (ask-about pill + × icon) | `groupHovered` |
| ProjectCard.tsx | 1 (arrow → icon) | `arrowHovered` |
| ContactOverlay.tsx | 5 (SubjectChip + Close pill + × + Submit + Clear) | per-button `h` / `groupHovered` |
| FloatingContactButton.tsx | 2 (pillLabel + squareLabel) | `groupHovered` |
| ContactForm.tsx | 3 (SubjectChip + Submit + Clear) | per-button `h` / `submitHovered` / `clearHovered` |
| SkillsBlock.tsx | 2 (skill name + level label) | `isHovered` |

**Total Task 4 instances: 15.**

**Skipped surfaces:**
- `StickyHeader.tsx` — verified not imported anywhere (legacy file, dead code).

## Verification Trail

**Per-task automated grep + tsc:**
- Task 1: `ScrambledLabel.tsx` exists, exports `ScrambledLabel`, references `useScramble` + `font-mono` + `font-sans` + `'use client'`. tsc clean.
- Task 2: MenuSection imports `ScrambledLabel` (not `useScramble`); no `firstItemScramble` / `firstItemHighlighted` / `labelNode` references; exactly 2 `<ScrambledLabel>` instances. tsc clean.
- Task 3: ExperienceSection imports `ScrambledLabel`; exactly 4 instances (2 company + 2 title); all `active={showLargeText}`. tsc clean.
- Task 4: 6 files import `ScrambledLabel`; instance counts StickyLogoBar=2, ProjectCard=1, ContactOverlay=5, FloatingContactButton=2, ContactForm=3, SkillsBlock=2. tsc clean.

**Aggregate:** 1 component + 4 production-surface refactors + 8 modified files + 4 atomic commits + per-task tsc+grep verification.

## Out of Scope (confirmed unchanged)

- `useScramble` defaults (stepMs 35, charPool 'ABC...!@#$%') — untouched.
- Non-hover surfaces (h1s, body text, non-button links) — no scramble applied.
- `useScrollReveal` / `useScrollExpand` migration to Motion's `useScroll` — deferred.
- Lenis tuning — untouched.
- AboutPinned / BioBlock / EducationBlock / ClientsBlock animations — untouched.
- `dev/buttons` playground — Task 6 deferred until Task 5 gate clears.

## Deviations from Plan

None — plan executed exactly as written.

The `<files_modified>` list in the plan frontmatter included `src/app/dev/buttons/page.tsx` because Task 6 is the optional final commit; per `GATE-01` this surface stays untouched until the user explicitly approves the production rollout. Not a deviation — it's the explicit plan gate.

## Rollback Markers

- `c012321` — buttons overlay rollout (revert this commit alone to remove Task 4 changes; MenuSection + Experience untouched).
- `755d626` — Experience rollout.
- `ff260d7` — MenuSection rollout.
- `501d049` — ScrambledLabel extraction (revert and the 4 above to fully unwind).
- `c7514bd` — post-pilot, pre-rollout safety floor (this rollout's marker).
- `pre-lenis-scramble` (`f98294f`) — entire scramble feature floor; do NOT touch.

Each commit is independently revertible — atomic per surface per `COMMITS-01`.

## Awaiting (Task 5 — human-verify gate)

User to run `pnpm dev`, exercise the 6 production surfaces (Menu, Experience, StickyLogoBar, ProjectCard, ContactOverlay, FloatingContactButton, ContactForm, SkillsBlock), and confirm:
1. All MenuSection rows scramble on highlight (regression-free).
2. ExperienceSection company + title scramble on highlight/expand.
3. All button overlays scramble on hover with the expected typography contrast.
4. No interval leaks across rapid hover toggling.
5. No regressions on rest-state visuals, masked vertical swap, fill animations, color transitions, sticky header, FAB visibility, accordion behavior.

On "approved" → Task 6 (dev/buttons playground, +9 instances) MAY proceed.

On any axis fail → revert the corresponding commit (StickyHeader skip + atomic per-surface commits make this clean).

## Self-Check: PASSED

- File exists: `src/components/motion/ScrambledLabel.tsx` — FOUND
- Commit `501d049` — FOUND
- Commit `ff260d7` — FOUND
- Commit `755d626` — FOUND
- Commit `c012321` — FOUND
- All 4 task commits land in order on top of `c7514bd` (rollout safety floor).
- pnpm tsc --noEmit exits 0 after each commit.
- Per-task grep counts match plan expectations exactly (Menu=2, Experience=4, Buttons=2+1+5+2+3+2=15).
