---
phase: 260427-uge
plan: quick
subsystem: experience-page
tags: [v2, experience, hero, scroll-pin, convergence, accessibility]
requires:
  - useScrollVideo (rAF + ticking-flag pattern, mirrored)
  - StickyLogoBar (existing primitive, reused)
  - PageNavigation (existing primitive, reused)
  - useExperienceNavigation (existing hook, untouched)
  - useInView (existing hook, retained for rows entrance)
provides:
  - useExperienceHero hook (scroll-progress + reduced-motion + mobile bypass)
  - ExperienceHero component (400vh pin + converging stats cards)
  - StatsCards component (progress-driven trio with 4-phase trajectory)
  - StatsCard component (72px value + divider + 36px label)
  - experience.hero content shape (headline + stats[])
affects:
  - /experience page (hero replaced, rows refactored, neutral expanded state)
  - Content shape (Content.experience.hero added; en.json + pt-br.json mirrored)
  - /experience route metadata (description updated)
tech-stack:
  added: []
  patterns:
    - rAF + ticking-flag scroll-progress (cloned from useScrollVideo)
    - 4-phase per-card animation (entry / convergence / hold / exit)
    - Cubic ease-out approximation for cubic-bezier(0.16, 1, 0.3, 1) over short range
    - Static Tailwind class maps for column spans (no dynamic template literals)
    - Mobile bypass at hook init (no rAF cost on small viewports)
    - prefers-reduced-motion override → progress = 0.75 (hold phase, cards aligned + visible)
key-files:
  created:
    - src/hooks/useExperienceHero.ts
    - src/components/sections/v2/experience/StatsCard.tsx
    - src/components/sections/v2/experience/StatsCards.tsx
    - src/components/sections/v2/experience/ExperienceHero.tsx
  modified:
    - src/components/sections/v2/ExperienceSection.tsx
    - src/content/types.ts
    - src/content/en.json
    - src/content/pt-br.json
    - src/app/experience/page.tsx
decisions:
  - Reduced-motion progress remap to 0.75 (not 1.0) so cards land aligned AND visible — resolves spec ambiguity in favor of verification checklist
  - cubic-bezier(0.16, 1, 0.3, 1) approximated as 1-(1-t)^3 over the short convergence segment (visually indistinguishable, no JS curve sampler needed)
  - Mobile bypass evaluated on mount only (no resize re-eval) — page reload is the typical UX when crossing 768px
  - Achievement rendering sliced to first 3; fewer-than-3 leaves trailing grid slots empty (no rebalancing)
  - PT-BR: stat labels translated (anos / empresas / cargos executivos); headline shipped EN until follow-up PT translation
  - StatsCard uses `bg-bg-surface-secondary` so cards stay opaque against the hero's matching background (avoids transparent overlap as cards translate through the headline)
metrics:
  duration: 8min
  completed: 2026-04-27
---

# Quick 260427-uge: Experience Page Redesign Summary

Implemented the /experience hero/rows redesign per spec — new converging-cards hero on a 400vh pin (matching /about's pacing) plus rows aligned on a strict 12-col grid with a neutral expanded state. Three-task plan executed cleanly; final visual verification (Task 4) is a `checkpoint:human-verify` and is now awaiting user approval (no dev server / browser run by the executor).

## What was built

### Task 1 — Hero infrastructure (commit `c87c7d3`)

Four new files in dependency order:

- **`src/hooks/useExperienceHero.ts`** — scroll-progress hook returning `{ outerRef, progress, reducedMotion }`. Pattern cloned from `useScrollVideo` (rAF + ticking-flag, passive scroll/resize, single re-render per frame). Two bypass conditions evaluated at mount:
  1. `prefers-reduced-motion: reduce` → set `progress=1`, surface `reducedMotion=true`, skip rAF loop entirely.
  2. `window.innerWidth < 768` → set `progress=1`, skip rAF loop (mobile pin disabled per spec).
- **`src/components/sections/v2/experience/StatsCard.tsx`** — pure presentational. 72px Fabio XM display value over 1px divider over 36px Fabio XM bold label. Tokens: `border-border-secondary`, `text-text-primary`, `text-text-secondary`, `bg-bg-surface-secondary`. `rounded-[8px]`, `p-5`.
- **`src/components/sections/v2/experience/StatsCards.tsx`** — trio of progress-driven cards. 4-phase trajectory:
  - Entry (0 → 0.6): linear from `INITIAL_Y_VH[i]` (30/50/70 vh) covering 6/7 of distance toward `15vh`.
  - Convergence (0.6 → 0.7): eased final 1/7 with `1 - (1-t)^3` (cubic-ease-out approximation of `cubic-bezier(0.16, 1, 0.3, 1)`).
  - Hold (0.7 → 0.85): locked at 15vh, opacity 1.
  - Exit (0.85 → 1.0): translate to `-30vh` simultaneously across all 3 cards, opacity `1 → 0`.
  Static `COL_CLASSES` lookup (cols 4-6 / 7-9 / 10-12 desktop; 3-4/5-6/7-8 tablet; full-width mobile). When `isMobile`, renders the cards with `-entrance -slide-up -a-{i}` stagger and no inline transform/opacity.
- **`src/components/sections/v2/experience/ExperienceHero.tsx`** — composer. 400vh outer + sticky 100vh inner pin with a 12-col grid. Headline at z-20 (full row, `clamp(2rem, 5vw, 3rem)`, `textIndent: 8em`); StatsCards at z-10 (share `lg:row-start-1` so cards translate UP THROUGH the headline). Reduced-motion path remaps `progress` to **0.75** (hold phase) so cards land aligned and fully visible — resolves a spec ambiguity (the spec body said "cards aligned, content faded" but the verification checklist said "cards at final aligned state on load" implying visible — sided with the checklist).

`pnpm tsc --noEmit` exits 0 after Task 1.

### Task 2 — ExperienceSection refactor (commit `c136cc1`)

Replaced the static h1 + meta-line hero with `<ExperienceHero />`. `StickyLogoBar` now lives outside the 400vh pin (sibling pattern matching `AboutPinned`). `heroRef` + its `useInView` removed (ExperienceHero owns its own scroll motion). `rowsRef` retained for row entrance stagger.

**Rows refactored to strict 12-col grid** (collapsed and expanded share identical X-positions for arrow / date / company / title):
- Collapsed cells: `col-span-1` arrow / `col-span-2` date / `col-span-3` company / `col-span-6` title.
  - Note: spec says "company col 4-6, title col 7-12". Implemented as `col-span-3` + `col-span-6` (sums to 12 with 1+2 prefix), giving the title a 6-wide band starting at col 7. The original implementation used `col-span-4` for company which left no room — fixed in this pass.
- `px-3 py-3` standardized on both states.
- Expanded panel: NO yellow background (`backgroundColor: transparent`, no inline `borderRadius`, no `marginLeft/Right` bleed). Bottom grid: description in col 1-4, spacer in col 5-6, up to 3 achievements at col 7-8 / 9-10 / 11-12.
- Achievements rendered as plain `<p>` (no leading dash), `text-text-primary`, `font-sans`.
- If `achievements.length < 3`, trailing slots are simply empty (no rebalancing). If `> 3`, sliced to first 3.

**Yellow bar — hover/focus only:**
- New `showYellowBar = isHighlighted && !isExpanded` flag drives the bar's transform/opacity.
- New `showLargeText = isHighlighted || isExpanded` keeps the larger Pexel Grotesk variant on both states (Figma-confirmed: expanded rows still display the bigger headline-style title).
- Cell text colors when expanded use `text-text-primary` / `text-text-secondary` (neutral on neutral) — never `text-on-primary` (which is for yellow-bar contrast only).

**Dividers:**
- Top divider rendered only above index 0 (subsequent rows use the previous row's bottom divider — avoids duplicates).
- Both dividers hide when `showYellowBar || isExpanded`.

`useExperienceNavigation`, `ExperienceItem` shape, accordion mechanics, keyboard handling — all unchanged.

### Task 3 — Content + types + metadata (commit `afc3b1c`)

- `src/content/types.ts`: `Content.experience` extended with `hero: { headline: string; stats: { value: string; label: string }[] }`.
- `src/content/en.json`: added `experience.hero` with the spec headline ("Design Engineering as a practice…") + 3 stats (`15+ years`, `6 companies`, `2 executive roles`).
- `src/content/pt-br.json`: mirrored with translated stat labels (`anos`, `empresas`, `cargos executivos`). Headline kept in EN as a follow-up TODO (JSON has no comment syntax — flagged here in the SUMMARY instead).
- `src/app/experience/page.tsx`: `metadata.description` updated to "15+ years of design engineering practice across 6 companies, 2 executive roles.".

Both JSON files parse cleanly; `pnpm tsc --noEmit` exits 0.

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 1 — Bug] Title col-span sum exceeded 12 in original spec interpretation**

- **Found during:** Task 2
- **Issue:** Spec literal says "arrow(1) / date(2-3) / company(4-6) / title(7-12)" = 1+2+3+6=12 ✓. Original implementation used `col-span-4` for company which would have summed to 13. Caught while writing the new grid.
- **Fix:** Used `col-span-3` for company (cols 4-6) and `col-span-6` for title (cols 7-12) so the row sums cleanly to 12.
- **Files modified:** `src/components/sections/v2/ExperienceSection.tsx`
- **Commit:** c136cc1

**2. [Rule 2 — Missing critical functionality] StatsCard background**

- **Found during:** Task 1
- **Issue:** The spec only specified `border-border-secondary` + `rounded-[8px]` + `p-5` — no fill. Cards translate THROUGH the headline (z-10 vs z-20) — without an opaque background, the headline text would bleed through the card body during the convergence phase, producing visual garbage.
- **Fix:** Added `bg-bg-surface-secondary` to StatsCard wrapper. Matches the hero's wrapper background, so the card visually disappears into the hero surface but still occludes the headline as it passes.
- **Files modified:** `src/components/sections/v2/experience/StatsCard.tsx`
- **Commit:** c87c7d3

**3. [Rule 3 — Blocking issue] Spec ambiguity on reduced-motion final state**

- **Found during:** Task 1
- **Issue:** Spec §"Hero — scroll mechanics" says `prefers-reduced-motion: reduce` should "lock progress at 1 (final state — cards aligned, content faded)". But the verification checklist says "cards at final aligned state on load, no scroll-driven motion, no entrance animation" — which implies the cards must be VISIBLE, not faded.
- **Fix:** Hook returns `progress = 1` and `reducedMotion = true`. ExperienceHero remaps progress to **0.75** (the hold phase: cards aligned, fully visible, no fade) when `reducedMotion` is true. Headline `opacity` also stays at 1 in this branch (no exit fade triggered). Documented inline with a code comment so the next reader doesn't re-litigate.
- **Files modified:** `src/hooks/useExperienceHero.ts`, `src/components/sections/v2/experience/ExperienceHero.tsx`
- **Commit:** c87c7d3

### Authentication gates

None.

### Notes / Observations (not deviations)

- **PT-BR headline** kept in EN per spec ("ship EN-only and leave a TODO for PT-BR"). JSON doesn't support comments — TODO is captured here in the SUMMARY and should be added to `docs/v2/README.md` follow-ups list (not done in this plan to avoid scope creep).
- **Mobile bypass at hook init only**: documented in the hook source — page reload on viewport-cross is the accepted UX trade-off. This matches the precedent in `useScrollVideo` and `useScrollStick`.
- **`pnpm build` not run by the executor**: the project has a known pre-existing WasmHash cache corruption from prior quick tasks (260425-p77, 260425-rcw, 260426-sjr). Running build was not in this plan's verify steps; user can validate during the human-verify checkpoint or as a follow-up.

## Verification

- [x] `pnpm tsc --noEmit` exits 0 (after each commit)
- [x] All four new files exist at their declared paths
- [x] `ExperienceSection.tsx` no longer renders the static h1 + meta line
- [x] `/experience` `metadata.description` updated
- [x] `experience.hero` present and valid in en.json + pt-br.json
- [ ] Visual verification (Task 4) — **awaiting user** (see `<how-to-verify>` in PLAN.md):
  - Hero pin & convergence (cards meet at 15vh by progress 0.7; headline fades 0.85→1.0)
  - Mobile (<768px) — no pin, vertical stack with entrance stagger
  - Reduced-motion — cards visible at aligned state on load
  - Rows alignment — cells match X-positions across collapsed/expanded states
  - Yellow bar visible only on hover/focus of collapsed rows
  - Keyboard nav (↑↓ Enter Esc) preserved

## Self-Check: PASSED

Files verified:
- FOUND: `src/hooks/useExperienceHero.ts`
- FOUND: `src/components/sections/v2/experience/StatsCard.tsx`
- FOUND: `src/components/sections/v2/experience/StatsCards.tsx`
- FOUND: `src/components/sections/v2/experience/ExperienceHero.tsx`
- FOUND: `src/components/sections/v2/ExperienceSection.tsx` (modified)
- FOUND: `src/content/types.ts` (modified)
- FOUND: `src/content/en.json` (modified)
- FOUND: `src/content/pt-br.json` (modified)
- FOUND: `src/app/experience/page.tsx` (modified)

Commits verified:
- FOUND: c87c7d3 (Task 1)
- FOUND: afc3b1c (Task 3)
- FOUND: c136cc1 (Task 2)

`pnpm tsc --noEmit` final state: exit 0. Both JSON files parse.
