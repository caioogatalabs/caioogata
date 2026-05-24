---
phase: quick-260425-rcw
plan: 01
subsystem: ui
tags: [react, nextjs, hero, about, scroll-video, scroll-pin, reusable-components, content-i18n]

requires:
  - phase: quick-260425-p77
    provides: useScrollVideo hook + 400vh sticky pin pattern + cols 9-12 vertical aspect 3/4 image layout (the patterns this task decomposes into a reusable Hero + AboutPinned)
provides:
  - Shared <Hero> primitive (kicker + optional technologies + headline) reused across /projects/* and /about
  - <AboutPinned> section — 400vh scroll zone with image-pin (cols 9-12) and first-paragraph reveal (cols 1-6)
  - about.headline content slot (EN + PT-BR) with optional Content.about.headline?: string typing
  - BioBlock now renders paragraphs[1..N] (first paragraph migrated to AboutPinned)
  - AboutSection reduced to a thin orchestrator (Hero zone + AboutPinned + 4 numbered blocks)
affects: [v2-hero-system, /about, /projects/*, future-page-templates]

tech-stack:
  added: []
  patterns:
    - Shared Hero primitive — text-only hero used both with technologies (4-8 split) and without (full-width)
    - AboutPinned pattern — separate scroll-pin component decoupled from Hero text, eliminating the previous monolithic AboutSection hero that bundled everything

key-files:
  created:
    - src/components/sections/v2/Hero.tsx
    - src/components/sections/v2/about/AboutPinned.tsx
  modified:
    - src/components/sections/v2/project/ProjectHero.tsx
    - src/components/sections/v2/about/BioBlock.tsx
    - src/components/sections/v2/AboutSection.tsx
    - src/content/types.ts
    - src/content/en.json
    - src/content/pt-br.json

key-decisions:
  - "[Quick 260425-rcw]: Hero primitive is text-only — no useInView, no h1. Consumers wrap their own h1 (sr-only on /projects/*, omitted on /about because the hero is decorative until users reach BioBlock). Keeps the primitive composable across pages with different document outlines."
  - "[Quick 260425-rcw]: AboutPinned uses raw Tailwind grid utilities (grid-cols-4 md:grid-cols-8 lg:grid-cols-12) instead of <Grid>/<GridItem>, because <Grid> does not expose vertical alignment props (items-center is required to vertically center the text+image pair inside the sticky h-screen viewport)."
  - "[Quick 260425-rcw]: First bio paragraph migrated from BioBlock to AboutPinned — it is the editorial 'destaque' that reads alongside the image pin, while paragraphs 2..N remain in the Bio table next to Core Expertise. Stagger reindexes from -a-0 in BioBlock; visually correct because the pinned reveal is a separate reading beat."
  - "[Quick 260425-rcw]: about.headline typed as optional (?:) for migration safety; AboutSection.tsx renders `about.headline ?? '<EN fallback>'` to keep the page rendering even if a future locale is added without the field."
  - "[Quick 260425-rcw]: PT-BR keeps 'brand strategy', 'product craft', and 'technical workflow' in English, matching the portfolio convention of leaving canonical industry terms untranslated (mirrors Skills/Expertise lists)."

patterns-established:
  - "Hero primitive: text-only, no useInView, consumer-controlled h1 — composable across page templates"
  - "AboutPinned isolation: scroll-pin behaviour lives in its own component instead of being entangled inside an orchestrator section"

requirements-completed: [QUICK-260425-rcw]

duration: 7min
completed: 2026-04-25
---

# Quick 260425-rcw: Restructure /about with shared Hero + AboutPinned Summary

**Decoupled /about from the previous monolithic hero — extracted a reusable `<Hero>` primitive (now used by both /projects/* and /about), introduced a dedicated `<AboutPinned>` image-pin + paragraph-reveal section, and migrated the first bio paragraph from BioBlock to AboutPinned.**

## Performance

- **Duration:** 7 min
- **Started:** 2026-04-25T22:47:13Z
- **Completed:** 2026-04-25T22:54:14Z
- **Tasks:** 6 (5 implementation + 1 verification)
- **Files modified:** 7 (2 created, 5 modified)

## Accomplishments

- Shared `<Hero>` primitive lives at `src/components/sections/v2/Hero.tsx`. Renders kicker (12-col) + technologies (4-col) + headline (8-col) when `technologies` is provided, or kicker (12-col) + full-width headline (12-col) without it.
- `ProjectHero.tsx` refactored to compose `<Hero/>` for the text section. `<h1 className="sr-only">` kept outside `<Hero>` to preserve document outline. Image section (noise gradient + clip-path expand) untouched.
- `<AboutPinned>` lives at `src/components/sections/v2/about/AboutPinned.tsx`. 400vh scroll container with sticky h-screen inner pin: image (cols 9-12, aspect-3/4) slides up during 0..20% scroll progress and then scrubs 241 frames; first bio paragraph (cols 1-6) fades in between 20% and 40% scroll progress.
- `about.headline` shipped in both locales (EN: "Bridging brand strategy, product craft and technical workflow"; PT-BR: "Conectando brand strategy, product craft e technical workflow"); typed as `Content.about.headline?: string`.
- `BioBlock.tsx` skips first bio paragraph via `.slice(1)`. Layout, stagger, and Core Expertise table unchanged.
- `AboutSection.tsx` reduced from 130 lines to 51 lines — pure orchestrator: Hero zone (bg-bg-surface-secondary wrapper around `<StickyLogoBar/>` + `<Hero/>`) → `<AboutPinned/>` → `<BioBlock/>` → `<SkillsBlock/>` → `<ClientsBlock/>` → `<EducationBlock/>`.
- Reduced-motion path preserved: AboutPinned locks image translateY at 0 and paragraph opacity at 1; useScrollVideo freezes at the last frame.

## Task Commits

1. **Task 1: Extract shared Hero component and refactor ProjectHero** — `943c8db` (feat)
2. **Task 2: Add about.headline content + Content.about.headline type** — `8ba4308` (feat)
3. **Task 3: Build AboutPinned image-pin + paragraph reveal** — `22e9208` (feat)
4. **Task 4: Refactor BioBlock to skip first bio paragraph** — `c3adc1e` (refactor)
5. **Task 5: Rewrite AboutSection to compose Hero + AboutPinned** — `f483bff` (refactor)
6. **Task 6: Type-check + build verification** — no commit (verification only)

## Files Created/Modified

**Created:**
- `src/components/sections/v2/Hero.tsx` — Shared text-only hero primitive (kicker + optional technologies + headline). Used by both /projects/* and /about.
- `src/components/sections/v2/about/AboutPinned.tsx` — 400vh scroll-pin section. Image (cols 9-12) slide-up entry + frame scrub via useScrollVideo; first bio paragraph (cols 1-6) opacity reveal between 20–40% scroll progress.

**Modified:**
- `src/components/sections/v2/project/ProjectHero.tsx` — Text section replaced by `<Hero kicker={...} technologies={project.technologies} headline={section.body ?? ''} />`. `<h1 className="sr-only">` kept outside `<Hero>`. Removed unused `sectionRef` (was applied to the extracted `<section>`); `imageRef` and `expandRef` retained for the image section.
- `src/components/sections/v2/about/BioBlock.tsx` — `about.bio.split('\n\n').slice(1)` (was `split('\n\n')` without slice). One-line change, no other layout/stagger modifications.
- `src/components/sections/v2/AboutSection.tsx` — Full rewrite. Removed inline welcome bar, useScrollVideo wiring, slideStyle, useInView for headline, headline rendering. Now imports/orchestrates: `StickyLogoBar`, `Hero`, `AboutPinned`, `BioBlock`, `SkillsBlock`, `ClientsBlock`, `EducationBlock`.
- `src/content/types.ts` — Added `headline?: string` to `Content.about` shape (after `heading: string`, before `bio: string`).
- `src/content/en.json` — Added `"headline": "Bridging brand strategy, product craft and technical workflow"` inside `about` block.
- `src/content/pt-br.json` — Added `"headline": "Conectando brand strategy, product craft e technical workflow"` inside `about` block.

## Decisions Made

See key-decisions in frontmatter. Highlights:
- Hero is text-only and consumer-controlled for `<h1>` ownership — keeps the primitive composable across pages with different document outlines (`/projects/*` has `<h1 className="sr-only">project.title</h1>`; `/about` does not declare an `<h1>` in the hero zone).
- AboutPinned uses raw Tailwind grid utilities (not `<Grid>`/`<GridItem>`) because vertical alignment (`items-center`) is required and `<Grid>` does not expose alignment props.
- First bio paragraph migrated from BioBlock to AboutPinned — read alongside the pin instead of inside the Bio table.
- `about.headline` typed as optional for migration safety; consumer renders with `?? '<EN fallback>'`.
- PT-BR keeps "brand strategy", "product craft", "technical workflow" in English, matching portfolio convention.

## Deviations from Plan

None — plan executed exactly as written. The plan's verification sanity-check `grep -n "useScrollVideo\|useInView\|slideStyle"` flagged a JSDoc comment in the new AboutSection (the comment listed the legacy hooks no longer used here). Cleaned the comment wording to fully satisfy the spec; not a code-behaviour deviation.

## Issues Encountered

**`pnpm build` crash — pre-existing, surfaced not auto-fixed.**

Task 6's `pnpm build` step crashed at:

```
TypeError: Cannot read properties of undefined (reading 'length')
    at WasmHash._updateWithBuffer (...next/dist/compiled/webpack/bundle5.js:29:1434964)
    at WasmHash.update (...)
    at BatchedHash.update (...)
    at processQueue (...)
Next.js build worker exited with code: 1
```

This is the **identical** corruption documented in STATE.md from quick task `260425-p77` (4 days prior):

> "Build/dev verification blocked by pre-existing .next/cache/webpack corruption (HTTP 500 on every dev route, WasmHash._updateWithBuffer crash on build) — surfaced not auto-fixed per Task 2's explicit instruction."

**This task's PLAN.md Task 6 explicitly instructed the same posture:**

> "If a build cache corruption surfaces (HTTP 500, WasmHash crash — known issue from quick task 260425-p77), surface it explicitly in the summary; do not silently `rm -rf .next`."

Posture honoured: the failure is documented here, but `.next/cache/` was not touched. The corruption is independent of this task's changes — it was already on the v2 branch before Task 1 ran.

`pnpm tsc --noEmit` exits 0 — TypeScript verification passed. No type errors introduced.

Dev-server smoke check attempted on ports 3000 and 3002 (per the prompt's fallback list) — neither port responded, so the user's dev server was not running during execution. No new dev server was spawned (per prompt constraint).

## Next Phase Readiness

- `<Hero>` is ready for reuse on any future page that needs the kicker+headline pattern (e.g., `/contact`, `/work`, future case-study landings).
- `<AboutPinned>` decouples the scroll-pin pattern from /about — a future `/process` or `/case-study` page could compose its own pin section without re-bundling Hero text into it.
- The `.next/cache` WasmHash crash needs to be resolved before the next deploy can be exercised. Suggested follow-up (separate task): clean `.next/`, reinstall pnpm deps, rerun `pnpm build`. NOT in scope here.

## Self-Check: PASSED

- File `src/components/sections/v2/Hero.tsx` — FOUND
- File `src/components/sections/v2/about/AboutPinned.tsx` — FOUND
- File `src/components/sections/v2/AboutSection.tsx` — FOUND (modified)
- File `src/components/sections/v2/project/ProjectHero.tsx` — FOUND (modified)
- File `src/components/sections/v2/about/BioBlock.tsx` — FOUND (modified)
- File `src/content/types.ts` — FOUND (modified)
- File `src/content/en.json` — FOUND (modified)
- File `src/content/pt-br.json` — FOUND (modified)
- Commit `943c8db` (Task 1) — FOUND
- Commit `8ba4308` (Task 2) — FOUND
- Commit `22e9208` (Task 3) — FOUND
- Commit `c3adc1e` (Task 4) — FOUND
- Commit `f483bff` (Task 5) — FOUND
- `pnpm tsc --noEmit` — exit 0
- `pnpm build` — exit 1 (pre-existing WasmHash corruption from 260425-p77, surfaced not fixed per Task 6 instruction)

---

*Quick task: 260425-rcw*
*Completed: 2026-04-25*
