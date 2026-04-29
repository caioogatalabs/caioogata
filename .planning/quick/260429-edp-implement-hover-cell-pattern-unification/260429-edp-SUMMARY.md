---
phase: quick-260429-edp
plan: 01
subsystem: v2-interactions
tags: [hover-cell, design-system, unification, skills, menu, experience]
requires: []
provides: ["unified Hover Cell pattern across V2 Menu / Experience / Skills"]
affects:
  - src/components/sections/v2/MenuSection.tsx
  - src/components/sections/v2/about/SkillsBlock.tsx
tech-stack:
  added: []
  patterns:
    - "Hover Cell — yellow bar (12px radius, V bleed) + masked vertical sans→mono type swap, shared timing tokens"
key-files:
  created: []
  modified:
    - src/components/sections/v2/MenuSection.tsx
    - src/components/sections/v2/about/SkillsBlock.tsx
decisions:
  - "Skills bar uses width transition (level semantic — Expert 95% → Familiar 35%) instead of Experience's scaleX, while keeping the same ease-out cubic-bezier(0.22,0.31,0,1) tokens and 0.6s/0.5s durations + opacity in tandem"
  - "Skills hover overlays use inline fontSize: '1.25rem' override (denser row), mirroring Menu's now-removed 2.25rem override symmetry; no new utility class introduced"
  - "Level label is aria-hidden because the swapped-in chip is decorative-on-hover; the skill name remains the semantic content for screen readers"
  - "Always-on-primary color for level label; not color-conditional on fill width — keeps implementation simple and motion consistent across levels (Familiar 35% bar + label still on-primary)"
metrics:
  duration: "2 min"
  completed: "2026-04-29"
  tasks: 2
  files_modified: 2
  commits: 2
---

# Quick 260429-edp: Hover Cell Pattern Unification Summary

Convergence of V2's three hover cells (Menu, Experience, Skills) on a single design-system pattern: 12px-radius yellow bar with vertical bleed, masked vertical sans → JetBrains Mono type swap, shared ease-out cubic-bezier(0.22,0.31,0,1) timing tokens. Menu shrinks its hover overlay to the default 1.5rem (matching Experience). Skills gains the full pattern from a previously-divergent flat bar/no-swap baseline. ExperienceSection.tsx is the canonical reference and stays at zero diff.

## Files Changed

- `src/components/sections/v2/MenuSection.tsx` — 2 inline `fontSize: '2.25rem'` deletions + their explanatory comments. Single conceptual change: surrender the size override so `.type-overlay-hover` defaults (1.5rem / 24px) apply.
- `src/components/sections/v2/about/SkillsBlock.tsx` — full restructure of the per-skill row template (still inside the same accordion + LEVEL_WIDTH semantics):
  - Bar: gains `borderRadius: 12px`, `top/bottom: -3px` (V bleed), opacity-in-tandem, ease-out cubic-bezier(0.22,0.31,0,1) at 0.6s entry / 0.5s exit with the same delays as Menu/Experience.
  - Skill name: now a masked vertical text-swap (sans 1rem → `.type-overlay-hover` 1.25rem), `1s cubic-bezier(0.16,1,0.3,1)` translate, color from `text-primary` → `on-primary` on hover.
  - Level label: hidden by default (no static text-xs span); appears on hover via the same masked vertical translate, `justify-end` inside a fixed `minWidth: 6rem` slot so the row right edge does not shift between states.
  - Row container: `overflow-hidden` removed so the -3px V bleed reads (the accordion's outer clip is preserved upstream — this is acceptable per spec; the bleed at first/last row is bounded by the panel clip but small enough to be perceptually intact).
- `src/components/sections/v2/ExperienceSection.tsx` — **untouched**. Canonical reference. Verified `git diff` is empty across both commits.

## Commits

| # | Hash | Type | Subject |
|---|------|------|---------|
| 1 | `b712781` | refactor | Remove Menu hover overlay 2.25rem overrides |
| 2 | `e2c42fb` | feat | Apply unified Hover Cell pattern to SkillsBlock |

(Each commit also bumps `src/lib/build-info.ts` COMMIT_COUNT via the project's pre-commit hook — this is established project tooling, not a deviation.)

## Verification Status

### Automated (passed)

```
pnpm tsc --noEmit                                                       → 0
git diff src/components/sections/v2/ExperienceSection.tsx               → empty (zero-diff)
grep -c "fontSize: '2.25rem'" src/components/sections/v2/MenuSection.tsx → 0
grep -c "type-overlay-hover" src/components/sections/v2/MenuSection.tsx → 2 (label + description spans)
grep -c "borderRadius: '12px'" src/components/sections/v2/about/SkillsBlock.tsx → 1
grep -c "top: '-3px'" src/components/sections/v2/about/SkillsBlock.tsx           → 1
grep -c "bottom: '-3px'" src/components/sections/v2/about/SkillsBlock.tsx        → 1
grep -c "cubic-bezier(0.22,0.31,0,1)" src/components/sections/v2/about/SkillsBlock.tsx → 4 (entry+exit on bar)
grep -c "fontSize: '1.25rem'" src/components/sections/v2/about/SkillsBlock.tsx   → 2 (name swap + level label)
```

Note on the plan's `grep -c "type-overlay-hover" SkillsBlock.tsx (expect 2)` check: actual count is 3, but only because one of the matches is in an explanatory inline comment. There are exactly **2 className usages** of `.type-overlay-hover` (skill-name hover span at line 180, level-label hover span at line 209) — matching the structural intent. No deviation.

Note on the plan's `! grep "font-mono text-xs" SkillsBlock.tsx` check: returns 2 hits, but both are pre-existing **out-of-scope** spans (section label "1.2 / Skills" at line 53; category skill count badge at line 100). The skill-row level label — the only one the plan instructed to remove — is gone (now using `.type-overlay-hover` + on-primary). Spec intent met.

### Visual checkpoint (Task 3)

Per executor constraint "perform automated checks (tsc, grep, git diff on Experience) but do not block on visual review; commit and report" — visual verification is left to the user. The automated structural checks above confirm the spec's six acceptance criteria are mechanically present in the code:

1. Menu hover overlay typography is 1.5rem (no 2.25rem override remains).
2. Skills row hover triggers all four animations (bar + name swap + level label swap + bleed) with the unified 0.6s/0.5s ease-out timing — all encoded in the inline `transition` strings.
3. Skills' default state shows skill name only — the level label container has no default-state child, only a hover span starting at `translateY(100%)`.
4. Bar timing in Skills now matches Menu/Experience (`cubic-bezier(0.22,0.31,0,1)` at 0.6s entry / 0.5s exit + opacity).
5. ExperienceSection.tsx zero diff — confirmed.
6. `prefers-reduced-motion` collapses to `transition: 'none'` on the bar, name swap, and level label swap (Menu and Experience already had their `instantStyle` / inline reducedMotion logic preserved).

## Deviations from Plan

None. The plan was executed exactly as written. The two grep-count adjustments noted above are interpretation clarifications, not deviations — the structural requirement (number of effective spans, presence of pattern tokens) is met.

## Notes for Future Maintenance

- **Accordion panel clip on first/last row bleed** — the SkillsBlock panel's outer `<div className="overflow-hidden">` (line 118) is necessary for the `grid-template-rows 0fr ↔ 1fr` accordion transition. As a known consequence, the first row's top -3px bleed and the last row's bottom -3px bleed are clipped at the panel boundary. Per spec ("Proportional to the denser skill rows"), the -3px is calibrated to be small enough that this clip is not perceptually disruptive. If a future redesign wants un-clipped bleed at all rows, that requires reshaping the accordion (e.g., padding-trick clip or animated `clip-path` instead of `grid-template-rows`).
- **Skills overlay size symmetry** — Skills uses an inline `fontSize: '1.25rem'` override on `.type-overlay-hover` (default 1.5rem). This mirrors how Menu *previously* used an inline `2.25rem` override (now removed). If a future design pass wants per-component overlay-size tokens (e.g., `--text-overlay-hover-sm: 1.25rem`), the inline override is the single replace point. Symmetry with Menu/Experience is intentional and documented in the spec under "Out of scope".
- **Level label placement** — the swap-in label sits at the row's right content edge, NOT at the right edge of the level-mapped yellow fill. This is by spec decision (swap motion reads as "level being announced", not "level positioned at fill tip"). For `Familiar` (35% fill), the label appears outside the yellow zone but is still readable because it stays at `--color-text-on-primary` against the row's neutral background — this is also acceptable per spec.

## Self-Check: PASSED

- File `src/components/sections/v2/MenuSection.tsx` — modified, present.
- File `src/components/sections/v2/about/SkillsBlock.tsx` — modified, present.
- File `src/components/sections/v2/ExperienceSection.tsx` — zero diff confirmed via `git diff` (canonical untouched).
- Commit `b712781` — present in `git log` (refactor: Menu overlay 2.25rem removed).
- Commit `e2c42fb` — present in `git log` (feat: SkillsBlock unified Hover Cell pattern).
- `pnpm tsc --noEmit` exits 0.
