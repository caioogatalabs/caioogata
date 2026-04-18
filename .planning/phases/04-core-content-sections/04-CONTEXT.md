# Phase 4: Core Content Sections - Context

**Gathered:** 2026-04-18
**Status:** Ready for planning

<domain>
## Phase Boundary

Three high-impact portfolio content sections — About, Experience, Skills — implemented as V2 sections rendered inside PageShell between ProjectsGrid and Footer. Each section is a standalone component in `src/components/sections/v2/`, themed via `data-theme` for tonal rhythm. Content sourced from existing `en.json` data — no content rewrite. These are the sections a hiring manager or design director reads to evaluate the candidate.

</domain>

<decisions>
## Implementation Decisions

### About Section (`whoami`)
- **D-01:** Grid layout: `4-8` — left column has heading "About" + expertise list, right column has bio text
- **D-02:** Pull quotes: extract 1-2 key sentences from bio as `display-sm` Fabio XM Light with tonal shift background (`bg-surface-secondary` block with extra padding)
- **D-03:** Expertise display: vertical list with `label-sm` uppercase (blueprint-style), stacked in left column
- **D-04:** Bio text: `body-md` with generous line-height, paragraphs separated by spacing (not indentation)
- **D-05:** Theme: dark (default) — no `data-theme` attribute needed, tonal break from ProjectsGrid above via spacing
- **D-06:** Animations: `useInView` with `-entrance -slide-up` on main blocks, stagger on expertise items

### Experience Section (`cat experience.txt`)
- **D-07:** Expand mechanism: accordion inline, CSS-only using `grid-template-rows: 0fr → 1fr` transition. No JS animation library.
- **D-08:** Row layout (collapsed): `3-6-3` grid — date range (left, `label-sm`), company + title (center, `body-md` bold), expand arrow indicator (right)
- **D-09:** Row layout (expanded): below the collapsed row, `3-9` grid — empty space (left 3-col), description + achievements bullet list (right 9-col, `body-sm`)
- **D-10:** Career grouping: Azion's 3 progressive roles (Design Director → Brand Experience Director → Developer Experience Director) visually grouped — subtle left border or indent to show progression at the same company
- **D-11:** Minor roles: jobs without achievements (indices 7-11 in `en.json`) render as compact rows without expand capability. Smaller text (`label-sm`), no arrow indicator.
- **D-12:** Theme: `data-theme="light"` — grey background, dark text. Tonal break from About (dark) above.
- **D-13:** Animations: list items with `-entrance -slide-up` + stagger (70ms/150ms pattern). Expand/collapse uses `--ease-smooth` (0.5,0,0.3,1).

### Skills Section (`ls skills/`)
- **D-14:** Layout: `4-4-4` grid (3 categories per row, 2 rows = 6 categories total). Each category is a self-contained block.
- **D-15:** Level indicator: dot system — `●●●●` Expert, `●●●○` Advanced, `●●○○` Proficient, `●○○○` Familiar. Filled dots in `text-text-primary`, empty dots in `text-text-tertiary`.
- **D-16:** Category title: `heading-sm` Fabio XM Semibold, uppercase. Skill items below as `body-sm` with dots inline right-aligned.
- **D-17:** Theme: dark (default) — returns to dark after Experience light section. Tonal rhythm: dark → light → dark.
- **D-18:** Animations: category blocks with `-entrance -scale-in` + stagger, individual skill items with `-fade` on `useInView`.

### Section Integration
- **D-19:** Section order in PageShell: Intro → Menu → ProjectsGrid → About → Experience → Skills → (Footer stays in layout.tsx)
- **D-20:** Each section is a separate component file in `src/components/sections/v2/`: `AboutSection.tsx`, `ExperienceSection.tsx`, `SkillsSection.tsx`
- **D-21:** Each section has its own `id` attribute for future scroll-to-section functionality (Phase 5): `id="about"`, `id="experience"`, `id="skills"`
- **D-22:** Each section uses full-width padding pattern: `px-5 md:px-8 lg:px-16` (consistent with existing sections)
- **D-23:** Section spacing: generous vertical padding between sections (consistent with Design.md "Don't Use Safe Spacing" — use 80px+ for section separation)

### Claude's Discretion
- Exact pull quote selection from bio text (which 1-2 sentences to extract)
- Responsive breakpoint behavior for 4-4-4 skills grid on mobile (likely stacks to single column)
- Responsive behavior for Experience 3-6-3 on mobile (likely stacks vertically)
- Whether to add section-specific content type extensions to `types.ts` or use existing types directly
- Exact Azion career grouping visual treatment (left border vs indent vs other subtle indicator)

</decisions>

<canonical_refs>
## Canonical References

**Downstream agents MUST read these before planning or implementing.**

### Design System & Direction
- `docs/v2/Design.md` — Architectural Brutalism direction, "No-Line Rule" (tonal stacking), typography philosophy, do's/don'ts
- `docs/v2/spec.md` §4.2 — About section spec (bio, expertise, pull quotes)
- `docs/v2/spec.md` §4.3 — Experience section spec (roles, expandable details)
- `docs/v2/spec.md` §4.4 — Skills section spec (categories, proficiency)

### Tokens & Styling
- `src/tokens/primitives.css` — OKLCH color primitives
- `src/tokens/semantic.css` — Semantic tokens for Tailwind v4 @theme (includes `data-theme` overrides)
- `src/tokens/tokens.ts` — TypeScript token map

### Content Data
- `src/content/en.json` — Content data: `about` (bio + expertise[]), `experience` (jobs[12] with achievements), `skills` (categories[6] with skills+levels)
- `src/content/types.ts` — TypeScript interfaces for content model

### Existing V2 Patterns (reuse)
- `src/components/sections/v2/IntroSection.tsx` — Reference for section structure, useInView pattern, entrance animations
- `src/components/sections/v2/FooterSection.tsx` — Reference for `data-theme="light"` usage, accordion-like expand
- `src/components/sections/v2/ProjectCard.tsx` — Reference for scroll-reveal pattern
- `src/components/layout/Grid.tsx` — 12-col grid with GridItem (static class maps)
- `src/hooks/useInView.ts` — IntersectionObserver entrance trigger
- `src/app/globals.css` — Entrance animation CSS classes (`-entrance -slide-up`, `-fade`, `-scale-in`, stagger `-a-N`)
- `src/components/layout/PageShell.tsx` — Section orchestrator (where new sections are added)

### Prior Phase Context
- `.planning/phases/02-home-page/02-CONTEXT.md` — Animation system decisions (D-14 through D-18), section theming approach
- `.planning/phases/03-project-pages/03-CONTEXT.md` — Component composition pattern, scroll-reveal reuse

</canonical_refs>

<code_context>
## Existing Code Insights

### Reusable Assets
- `useInView` hook: IntersectionObserver → adds `-inview` class for entrance animations. Already used by all V2 sections.
- `Grid` + `GridItem`: 12-col responsive layout. Static class maps for `MOBILE_SPAN`, `TABLET_SPAN`, `DESKTOP_SPAN`.
- Entrance animation CSS: `-entrance -slide-up`, `-entrance -fade`, `-entrance -scale-in` with stagger classes `-a-0` through `-a-20`.
- `FooterSection` has an existing expand/collapse pattern (contact form) — reference for Experience accordion, though it uses JS state rather than CSS-only grid-rows.
- `data-theme="light"` already implemented in FooterSection's inner card — token overrides work.

### Established Patterns
- Section components are `'use client'` with `useInView` for entrance triggers
- Full-width padding via `px-5 md:px-8 lg:px-16` (not Grid wrapper)
- Grid used only for internal 12-col alignment
- Content imported directly from `en.json` with type casting
- Font family for display text: `style={{ fontFamily: 'var(--font-sans)' }}`
- Mono text: `font-mono` class for Cascadia Mono

### Integration Points
- `PageShell.tsx` — Add 3 new section imports and render between `<ProjectsGrid />` and end of fragment
- `en.json` — Content already complete for all 3 sections, no model changes needed
- `types.ts` — Existing types cover About (`bio` + `expertise[]`), Experience (`jobs[]` with `achievements[]`), Skills (`categories[]` with `skills[]`)

</code_context>

<specifics>
## Specific Ideas

- **Tonal rhythm** is the primary visual separator between sections — About (dark) → Experience (light/grey) → Skills (dark). No borders, no dividers, just background color shifts per Design.md "No-Line Rule".
- **Experience accordion** should feel like a data terminal expanding — compact rows that unfold to reveal detail, not a fancy animated panel. The transition should be quick and functional (CSS grid-rows, `--ease-smooth`).
- **Azion career progression** is a key narrative element — the 3 progressive roles tell a story of growth from Design Director to Developer Experience Director. The grouping should make this progression immediately visible.
- **Skills dots** should be small and monochrome — no color coding by level. The dots are informational, not decorative. Same brutalista precision as data-stamps on project cards.
- **Pull quotes in About** serve the same role as display headlines — they break the reading flow with a typographic moment, reinforcing the "technical manual crossed with fashion magazine" identity from Design.md.

</specifics>

<deferred>
## Deferred Ideas

- Menu scroll-to-section integration (clicking "about" in menu scrolls to About section) — Phase 5
- Light mode support for all sections — deferred post-launch
- i18n (PT-BR) for all sections — deferred post-launch
- Per-section OG metadata — not needed for home page sections

None beyond the above — discussion stayed within phase scope

</deferred>

---

*Phase: 04-core-content-sections*
*Context gathered: 2026-04-18*
