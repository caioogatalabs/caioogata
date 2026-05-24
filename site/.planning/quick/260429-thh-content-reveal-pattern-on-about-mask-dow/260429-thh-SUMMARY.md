---
phase: 260429-thh
plan: quick
subsystem: ui
tags: [animation, css, clip-path, entrance, about, design-system]

# Dependency graph
requires:
  - phase: 04.2 (about-consolidation)
    provides: BioBlock + SkillsBlock + ClientsBlock + EducationBlock components on /about
  - phase: 02 (animation-system)
    provides: -entrance / -inview / -slide-up / -fade / -scale-in / stagger map / loading gate
provides:
  - "Site-standard layered content reveal: -mask-down (top→bottom clip-path), -mask-right (left→right clip-path), -line-x (scaleX from left)"
  - ".-flow stagger override mapping -a-N to reading cadence (~150–180ms) instead of 70ms grid"
  - "--ease-fiddle token (cubic-bezier(0.16, 1, 0.3, 1))"
  - "Layered reveal applied to all four /about subsection blocks (numerals via mask-right; BioBlock body + ClientsBlock description via mask-down inside .-flow)"
affects: [/experience, /projects/*, future Hero / SectionDivider entrances, any future editorial body content]

# Tech tracking
tech-stack:
  added: []
  patterns:
    - "Layered Camadas reveal: Camada 1 (numeral / kicker via -mask-right), Camada 2 (title — N/A here, numeral is the head), Camada 3 (reading body via -mask-down inside .-flow)"
    - "Reading cadence vs grid cadence — .-flow modifier remaps -a-N delays for editorial content; lists/cards keep the 70ms .-a-N grid rhythm"
    - "Triple-selector pattern (`.X.-inview`, `.-inview > .X`, `.-inview .X`) extended to clip-path / scaleX variants for consistent activation semantics with -slide-up / -fade / -scale-in"

key-files:
  created: []
  modified:
    - src/app/globals.css
    - src/components/sections/v2/about/BioBlock.tsx
    - src/components/sections/v2/about/SkillsBlock.tsx
    - src/components/sections/v2/about/ClientsBlock.tsx
    - src/components/sections/v2/about/EducationBlock.tsx

key-decisions:
  - "Clip-path requires inline-block / block context — added inline-block to numeral spans (clip-path on inline elements is unreliable)"
  - "BioBlock body paragraph stagger capped at -a-10 (not -a-19) because .-flow map ends at 10; current copy has ≤4–5 middle paragraphs, so cap is generous and any overflow falls back gracefully to grid cadence"
  - "ClientsBlock description uses -a-1 (180ms in flow map) so it enters AFTER the numeral mask-right, reinforcing layered cadence — single-paragraph block, not a stack"
  - "BioBlock final quote wrapped in its own .-flow wrapper (not the same as middle paragraphs') to keep its full-12-cols layout while still using reading cadence; -a-0 delay so it begins immediately on its own .-inview"
  - "Defensive @media (prefers-reduced-motion: reduce) override forces clip-path: inset(0) and transform: none on the new variants — global rule already collapses transition-duration to 0.01ms but explicit final-state forcing avoids any clip-path residue"
  - "Numeral mask-right uses 0.6s (faster) vs body mask-down 0.9s (slower) — kicker should resolve before body content begins masking, reinforcing the Camada 1 → Camada 3 layered hierarchy"

patterns-established:
  - "-mask-down: opacity:1 + clip-path inset(0 0 100% 0) → inset(0), 0.9s --ease-fiddle, +6px translateY lift. Use for body paragraphs / titles."
  - "-mask-right: opacity:1 + clip-path inset(0 100% 0 0) → inset(0), 0.6s --ease-fiddle. Use for numerals / kickers / mono labels."
  - "-line-x: opacity:1 + transform scaleX(0)→scaleX(1), transform-origin:left, 0.5s --ease-fiddle. Use for top-section divider rules."
  - ".-flow modifier: parent class that remaps -a-0..-a-10 to reading cadence (0/180/350/510/660/800/930/1050/1160/1260/1350ms). Applies to descendants with -entrance.-a-N."
  - "Inline-block requirement: any element using -mask-* MUST be inline-block or block (not inline) for clip-path to render correctly — applied to all four /about numeral spans."

requirements-completed:
  - REVEAL-01
  - REVEAL-02
  - REVEAL-03
  - REVEAL-04
  - REVEAL-05
  - REVEAL-06
  - REVEAL-07
  - REVEAL-08
  - REVEAL-09
  - REVEAL-10

# Metrics
duration: 2 min (Tasks 1-2; Task 3 awaiting human-verify)
completed: 2026-04-29
---

# Quick 260429-thh: Layered Content Reveal Pattern (mask-down / mask-right / .-flow) Summary

**Site-standard layered reveal system: clip-path top→bottom for editorial body, clip-path left→right for numeral kickers, scaleX for divider rules, plus .-flow parent that swaps the 70ms grid stagger to reading cadence — applied to /about as the validation surface before replicating to /experience and /projects.**

## Performance

- **Duration:** ~2 min (Tasks 1–2; Task 3 visual verification pending)
- **Started:** 2026-04-30T00:19:19Z
- **Tasks 1–2 completed:** 2026-04-30T00:21:11Z
- **Task 3 (checkpoint):** awaiting `approved` from user before plan-completion commit
- **Tasks completed:** 2 of 3 (Task 3 is checkpoint:human-verify, intentionally not auto-resolved per plan constraints)
- **Files modified:** 5

## Accomplishments

- Added 4 new CSS primitives to the V2 animation system (`-mask-down`, `-mask-right`, `-line-x`, `.-flow`) + `--ease-fiddle` token in `globals.css`
- Replaced `-slide-up` with the layered Camadas pattern across all four `/about` subsection blocks: numerals reveal via `-mask-right`, BioBlock body + ClientsBlock description reveal via `-mask-down` inside `.-flow` reading cadence
- Preserved grid cadence (`-slide-up -a-N` 70ms) on Skills accordion rows + Clients logo wall + Education timeline rows — list/grid rhythm intact
- Defensive reduced-motion override forces clip-path / transform final-state, no residue
- Zero regressions in untouched surfaces: `IntroSection.tsx`, `AboutPinned.tsx`, `/experience`, `/projects/*`, footer, menu

## Task Commits

Each task was committed atomically:

1. **Task 1: Extend animation system in globals.css with mask-down / mask-right / line-x variants and .-flow stagger override** — `c40a648` (feat)
2. **Task 2: Apply layered reveal pattern to BioBlock + SkillsBlock + ClientsBlock + EducationBlock** — `7faa571` (feat)
3. **Task 3: Visual validation — /about layered reveal cadence** — pending; `checkpoint:human-verify`. Plan-metadata commit will be issued after user types `approved`.

## Application Table — Which Block Got Which Variant

| Block            | Numeral (Camada 1)             | Reading Body (Camada 3)                                                          | List/Grid Rows (untouched)                |
| ---------------- | ------------------------------ | -------------------------------------------------------------------------------- | ----------------------------------------- |
| BioBlock         | `-mask-right -a-0` on `1.1 / Bio` | `-mask-down -a-{0..10}` on middle paragraphs (inside `.-flow` wrapper) + `-mask-down -a-0` on full-width final quote (inside its own `.-flow` wrapper) | Core Expertise list — no entrance variant (intentionally instant)         |
| SkillsBlock      | `-mask-right -a-0` on `1.2 / Skills` | — (no body paragraph; numeral IS the head)                                        | Accordion category rows: `-slide-up -a-N` 70ms  |
| ClientsBlock     | `-mask-right -a-0` on `1.3 / Notable Clients` | `-mask-down -a-1` on `shortDescription` (inside `.-flow` wrapper) — 180ms after numeral | Logo grid: `-fade -a-N` 70ms              |
| EducationBlock   | `-mask-right -a-0` on `1.4 / Education` | — (no body paragraph; rows ARE the content)                                       | Timeline rows: `-slide-up -a-N` 70ms      |

## CSS Primitives Catalog

```css
:root { --ease-fiddle: cubic-bezier(0.16, 1, 0.3, 1); }

/* Camada 3 — body paragraphs / titles */
.-entrance.-mask-down       { clip-path: inset(0 0 100% 0); transform: translateY(6px);
                              transition: clip-path 0.9s var(--ease-fiddle), transform 0.9s var(--ease-fiddle); }

/* Camada 1 — numerals / kickers / mono labels */
.-entrance.-mask-right      { clip-path: inset(0 100% 0 0);
                              transition: clip-path 0.6s var(--ease-fiddle); }

/* Top-of-section divider rules */
.-entrance.-line-x          { transform: scaleX(0); transform-origin: left center;
                              transition: transform 0.5s var(--ease-fiddle); }

/* Reading-flow stagger override (parent class) */
.-flow > .-entrance.-a-0    { transition-delay: 0ms;    } /* 0,180,350,510,660,800,930,1050,1160,1260,1350 */
/* … through .-a-10 … */
```

## Files Created/Modified

- `src/app/globals.css` — Added `--ease-fiddle` token; 3 new entrance variant blocks (`-mask-down`, `-mask-right`, `-line-x`); `.-flow > .-entrance.-a-N` reading-cadence map (0–1350ms); defensive `prefers-reduced-motion` override forcing `clip-path: inset(0)` + `transform: none` on the 3 new variants. ~50 lines added; existing rules untouched.
- `src/components/sections/v2/about/BioBlock.tsx` — Numeral span gets `-entrance -mask-right -a-0 inline-block`. Middle-paragraphs wrapper gets `.-flow`; paragraphs switch from `-slide-up` to `-mask-down` with index cap reduced from 19 → 10. Final-quote moved into its own `.-flow` wrapper (mt-16/md:mt-20 hoisted from `<p>` to wrapper); paragraph variant changes from `-slide-up -a-N` to `-mask-down -a-0`.
- `src/components/sections/v2/about/SkillsBlock.tsx` — Numeral span only. Accordion list rows untouched (still `-entrance -slide-up -a-N` 70ms).
- `src/components/sections/v2/about/ClientsBlock.tsx` — Numeral span gets mask-right. Short description `<p>` wrapped in a `.-flow` `<div>`; variant changes from `-slide-up -a-0` to `-mask-down -a-1` (180ms delay so it lands after the numeral). Logo grid cells untouched (still `-entrance -fade -a-N` 70ms).
- `src/components/sections/v2/about/EducationBlock.tsx` — Numeral span only. Timeline rows untouched (still `-entrance -slide-up -a-N` 70ms).

## Decisions Made

See `key-decisions` in frontmatter. TL;DR:

- `inline-block` mandatory on mask-right numerals — clip-path on inline elements is unreliable
- Stagger cap reduced 19 → 10 inside `.-flow` (map only goes to `-a-10`); current copy ≤5 paragraphs, harmless
- ClientsBlock description gets `-a-1` (180ms) not `-a-0` to layer AFTER the numeral
- BioBlock final-quote uses its own `.-flow` wrapper to preserve full-12-cols layout
- Defensive reduced-motion override is belt-and-suspenders against clip-path residue
- Numeral 0.6s vs body 0.9s timing reinforces Camada 1 → Camada 3 hierarchy

## Deviations from Plan

None — plan executed exactly as written.

## Issues Encountered

None.

## Out of Scope (Confirmed Untouched)

- `src/components/sections/v2/about/AboutPinned.tsx` — sticky 400vh hero with scroll-linked first paragraph reveal; unchanged
- `src/components/sections/v2/IntroSection.tsx` — home hero (welcome bar + sticky logo + headline); unchanged
- `src/components/sections/v2/about/AboutSection.tsx` — orchestrator; unchanged
- `src/components/sections/v2/about/SectionDivider.tsx` — atom; unchanged (despite `-line-x` variant being available, deferred to follow-up plan)
- `/experience`, `/projects/*`, footer, menu — no edits

## Verification Scenarios for Task 3 (checkpoint:human-verify)

The user must visually confirm the cadence on `/about` before the plan-metadata commit and before this pattern is replicated.

### Test 1 — Each numeral reveals via mask-right (left→right)

1. Run `pnpm dev` (or use existing dev server).
2. Open http://localhost:3000/about (Chromium via Playwright MCP per project convention).
3. Scroll slowly into each block in turn (Bio → Skills → Notable Clients → Education).
4. **Expect:** the `1.X / [Label]` numeral on the LEFT of each block reveals as if a typewriter pass is uncovering it left → right (clip-path edge moves rightward over 0.6s). NOT a slide-up. NOT a fade.

### Test 2 — BioBlock body paragraphs use reading cadence (mask-down + .-flow)

1. Scroll BioBlock into view.
2. **Expect (middle paragraphs, 24px semibold, cols 5–12):** each paragraph reveals via top → bottom clip-path mask, paced ~180ms apart. By the time paragraph N completes (≈0.9s + delay), paragraph N+1 is mid-mask. NO simultaneous reveal. NO fast 70ms slot-machine cadence.
3. **Expect (final quote, full-width 48px, text-indent 8em):** reveals via the same top → bottom mask, single beat after entering its own viewport overlap.

### Test 3 — ClientsBlock layered cadence (numeral first → description second)

1. Scroll ClientsBlock into view.
2. **Expect:** `1.3 / Notable Clients` numeral mask-right (0.6s, 0ms delay), then 180ms later the short description `<p>` (36px Bold) mask-down (0.9s).
3. **Expect:** logo grid below enters with the existing `-fade -a-N` 70ms grid cadence — UNCHANGED.

### Test 4 — Skills + Education list rows untouched

1. Scroll SkillsBlock and EducationBlock into view.
2. **Expect:** numerals do mask-right; below them, accordion rows (Skills) and timeline rows (Education) enter with the existing fast `-slide-up -a-N` 70ms grid cadence. No regression — hover patterns, accordion grid-rows trick, and yellow bar fill behavior all intact.

### Test 5 — Reduced motion collapses correctly

1. DevTools → Rendering → "Emulate CSS media feature `prefers-reduced-motion`" → reduce.
2. Refresh `/about`.
3. **Expect:** ALL content visible at final state instantly. No clip-path animation. No transform. No cumulative delay. No flash.
4. Inspect the DOM: numeral `<span>` has `clip-path: inset(0)` computed; body `<p>` has `clip-path: inset(0)` and `transform: none` computed.

### Test 6 — Untouched surfaces still work

1. Visit `/` (home). Confirm IntroSection welcome bar + sticky logo + headline still entrance-animate with original cadence.
2. Visit `/about`. Confirm `AboutPinned` (sticky 400vh hero with scroll-linked first paragraph + slide-up cols 9–12 video) still works exactly as before.
3. Visit `/experience` and `/projects/[slug]`. Confirm zero visual diff.

### Test 7 — DOM inspection

1. Inspect a numeral span (e.g., `1.1 / Bio`):
   - `class` contains `-entrance -mask-right -a-0 inline-block`
   - parent or ancestor has `-inview` after scroll
2. Inspect a Bio middle paragraph:
   - `class` contains `-entrance -mask-down -a-N`
   - parent has `-flow`
3. Inspect a Skills accordion row:
   - `class` contains `-entrance -slide-up -a-N` (verify NO regression)

### Acceptance criterion

By the time the FIRST BioBlock middle paragraph finishes its mask-down (~900ms after `-inview`), the SECOND paragraph (a-1, 180ms delay) is mid-reveal. Reader's eye tracks downward naturally. NOT a slot-machine.

### Resume signal

User types **`approved`** if cadence feels editorial and untouched surfaces are preserved. Otherwise the user describes which block + which timing felt off (too fast / too slow / out of order) or whether reduced-motion collapsed correctly.

On `approved` → issue plan-metadata commit and proceed to follow-up quick task that replicates this pattern to `/experience` and `/projects/*`.

## User Setup Required

None — pure CSS + JSX; no env vars, no external services, no build config changes.

## Next Plan Readiness

- **Pattern is now a site standard** — `-mask-down`, `-mask-right`, `-line-x`, `.-flow`, `--ease-fiddle` available globally
- **Ready to replicate** after Task 3 approval: `/experience` rows + section labels, `/projects/[slug]` Hero + section blocks
- **`-line-x` is unused so far** — first call-site likely the `SectionDivider` rule line at the top of each numbered block
- **Open question for follow-up:** should we extend `.-flow` map beyond `-a-10`? Bio currently caps at 10; if a future editorial section has >10 paragraphs we'll need to either extend the map or fall back gracefully (current behavior: any beyond -a-10 hits the global 70ms map, which would feel jarring inside `.-flow`). Defer until needed.

## Self-Check: PASSED

**Files verified to exist:**
- FOUND: `src/app/globals.css` (modified — contains `--ease-fiddle`, `-mask-down`, `-mask-right`, `-line-x`, `.-flow > .-entrance.-a-N`)
- FOUND: `src/components/sections/v2/about/BioBlock.tsx` (modified — 1×`-mask-right`, 2×`-mask-down`, 2×`.-flow`)
- FOUND: `src/components/sections/v2/about/SkillsBlock.tsx` (modified — 1×`-mask-right`; `-slide-up` retained on accordion rows)
- FOUND: `src/components/sections/v2/about/ClientsBlock.tsx` (modified — 1×`-mask-right`, 1×`-mask-down`, 1×`.-flow`)
- FOUND: `src/components/sections/v2/about/EducationBlock.tsx` (modified — 1×`-mask-right`; `-slide-up` retained on timeline rows)

**Commits verified:**
- FOUND: `c40a648` (Task 1 — feat: animation system extension)
- FOUND: `7faa571` (Task 2 — feat: layered reveal applied to /about blocks)

**Plan-metadata commit:** pending — issued after Task 3 user approval.

---
*Quick: 260429-thh-content-reveal-pattern-on-about-mask-dow*
*Tasks 1–2 completed: 2026-04-29*
*Task 3 (checkpoint:human-verify): awaiting user approval*
