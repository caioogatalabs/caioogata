# Roadmap: Portfolio V2

## Overview

Transform the portfolio from V1 (CLI-inspired monospace) to V2 (Architectural Brutalism) across five phases: lay the infrastructure foundation (V1 preservation, Tailwind v4, tokens, fonts), build the Home page as the hero experience, implement project pages, build the core content sections (About, Experience, Skills), then complete secondary sections and polish. The design system is already complete in Figma and CSS tokens -- this roadmap covers implementation only.

## Phases

**Phase Numbering:**
- Integer phases (1, 2, 3, 4, 5): Planned milestone work
- Decimal phases (2.1, 2.2): Urgent insertions (marked with INSERTED)

Decimal phases appear between their surrounding integers in numeric order.

- [x] **Phase 1: Infrastructure** - Preserve V1, migrate Tailwind v4, integrate tokens, load Fabio XM
- [x] **Phase 2: Home Page** - Implement the full Home V2 layout with intro, menu, projects grid, footer (completed 2026-04-03)
- [x] **Phase 3: Project Pages** - Dedicated project routes at `/projects/[slug]` with hero, content grid, navigation (completed 2026-04-06)
- [x] **Phase 4: Core Content Sections** - About, Experience, Skills — the 3 high-impact portfolio sections (completed 2026-04-18)
- [ ] **Phase 4.1: Project Gallery Blocks** (INSERTED) - Fix span-aware staggered grid, add full-bleed + scroll-pinned sticky galleries
- [ ] **Phase 5: Secondary Sections & Polish** - Education, Clients, Philosophy + menu scroll integration + responsive audit

## Phase Details

### Phase 1: Infrastructure
**Goal**: The codebase is ready for V2 development -- V1 is safely preserved, Tailwind v4 powers the build, design tokens flow through the system, and Fabio XM renders correctly
**Depends on**: Nothing (first phase)
**Requirements**: INFRA-01, INFRA-02, INFRA-03, INFRA-04, INFRA-05
**Success Criteria** (what must be TRUE):
  1. V1 source is preserved on a tagged branch and deployed at v1.caioogata.com
  2. The project builds successfully with Tailwind v4 and `@tailwindcss/postcss` (no v3 config remains)
  3. Design tokens from `src/tokens/` are consumed by Tailwind via `@theme` and available as CSS custom properties
  4. Fabio XM renders in the browser with variable font weight support across all intended styles
**Plans**: 2 plans

Plans:
- [x] 01-01-PLAN.md — Preserve V1 on branch/tag, deploy at v1.caioogata.com, migrate Tailwind v3 to v4
- [x] 01-02-PLAN.md — Integrate design tokens via @theme, load Fabio XM variable font

### Phase 2: Home Page
**Goal**: A visitor landing on caioogata.com sees the complete V2 Home experience -- brand intro, navigable menu, project highlights, and footer -- responsive across all breakpoints
**Depends on**: Phase 1
**Requirements**: HOME-01, HOME-02, HOME-03, HOME-04, HOME-05, FOOT-01, FOOT-02
**Success Criteria** (what must be TRUE):
  1. Intro section displays with inverted brand background, logo, and display headline
  2. Menu section renders CLI input with filterable commands and keyboard navigation works
  3. Projects grid shows cards in 6-6 column layout with data-stamps and functional arrow buttons
  4. Footer displays tech tags, copyright, and a contact button that expands into a working email form
  5. All Home sections reflow correctly across Desktop (12col), Tablet (8col), and Mobile (4col) breakpoints
**Plans**: 4 plans
**UI hint**: yes

Plans:
- [x] 02-01-PLAN.md — Animation system CSS, Grid component, PageShell, page.tsx rewrite
- [x] 02-02-PLAN.md — Intro section with hero layout and StickyHeader on scroll
- [x] 02-03-PLAN.md — Menu section with CLI input, keyboard nav, floating preview
- [x] 02-04-PLAN.md — Projects grid with data-stamps, Footer with expandable contact form

### Phase 3: Project Pages
**Goal**: Each project has a dedicated page with rich visual content, rendered from existing data model
**Depends on**: Phase 2
**Requirements**: PROJ-01, PROJ-02, PROJ-03
**Success Criteria** (what must be TRUE):
  1. Navigating to `/projects/[slug]` loads a dedicated page with hero image and scrollable content rendered from `en.json`
  2. Project pages display image galleries in responsive grid layouts
  3. Inter-project navigation (next/prev) works between project pages
  4. Per-project OG metadata generates correctly for social sharing
**Plans**: 3 plans
**UI hint**: yes

Plans:
- [x] 03-01-PLAN.md — Data model extension (types + en.json sections), dynamic route, ProjectPageShell orchestrator
- [x] 03-02-PLAN.md — Hero, Challenge, Impact, InfoBlock, Credits block components
- [x] 03-03-PLAN.md — Three gallery types, useScrollParallax hook, inter-project navigation

### Phase 4: Core Content Sections
**Goal**: The 3 highest-impact portfolio sections are live — About with scroll-driven video hero, Experience with menu-style hover rows, Skills with SVG relationship map — matching V2 craft quality
**Depends on**: Phase 3
**Requirements**: SECT-01, SECT-02, SECT-03
**Success Criteria** (what must be TRUE):
  1. About section renders scroll-driven frame-by-frame video hero with "Bridging" headline overlay, followed by 6-6 editorial layout (empty left, bio + pull quotes right)
  2. Experience section displays 12 roles with MenuSection-identical hover pattern (yellow bar, masked text swap, arrow) in 3-3-3-3 grid, CSS grid accordion expand, keyboard navigation
  3. Skills section shows 6-6 SVG relationship map connecting skills to projects with bidirectional hover highlighting and progress bar level indicators
  4. Each section uses appropriate `data-theme` for tonal rhythm (dark → light → dark)
  5. All sections animate with `useInView` entrances and respect `prefers-reduced-motion`
**Plans**: 3 plans
**UI hint**: yes

Plans:
- [x] 04-01-PLAN.md — About section: scroll-driven video hero (canvas + WebP frames), 6-6 editorial bio layout
- [x] 04-02-PLAN.md — Experience section: menu-style hover rows, CSS grid accordion expand, keyboard nav
- [x] 04-03-PLAN.md — Skills section: SVG relationship map, bidirectional hover, progress bar levels

### Phase 04.2: About Consolidation (INSERTED)

**Goal:** Consolidate `/skills` route + Notable Clients + Education content as subsections of `/about` so the single page becomes a richer, editorial-style biography. Delete `/skills` route and `SkillsSection.tsx`. V2 only.
**Requirements**: ABT-01 (subsection dividers), ABT-02 (skills block simplified), ABT-03 (clients grid), ABT-04 (education timeline)
**Depends on:** Phase 4
**Plans:** 2/6 plans executed

Plans:
- [x] 04.2-01-PLAN.md — SectionDivider atom + menu trim + clients.shortDescription content (ABT-01, ABT-05)
- [x] 04.2-02-PLAN.md — BioBlock (1.1) extracted from AboutSection (ABT-01)
- [ ] 04.2-03-PLAN.md — SkillsBlock (1.2) simplified, no SVG (ABT-02)
- [ ] 04.2-04-PLAN.md — ClientsBlock (1.3) 4-col grid with table dividers (ABT-03)
- [ ] 04.2-05-PLAN.md — EducationBlock (1.4) chronological timeline (ABT-04)
- [ ] 04.2-06-PLAN.md — Wire blocks into AboutSection, delete /skills route, build validation (ABT-01..ABT-04)

### Phase 04.1: Project Gallery Blocks (INSERTED)

**Goal**: Project pages support 5 gallery layout types — span-aware grid rows, full-bleed images, and scroll-pinned sticky galleries — replacing the broken zigzag staggered with a flexible system driven by existing JSON data
**Depends on**: Phase 4
**Requirements**: GAL-01 (fix gallery-staggered spans), GAL-02 (gallery-full-bleed), GAL-03 (gallery-stick)
**Success Criteria** (what must be TRUE):
  1. `gallery-staggered` renders rows respecting `spans[]` from JSON (12, 6-6, 4-4-4, 8-4) with natural aspect ratios instead of fixed 340px zigzag
  2. `gallery-full-bleed` renders edge-to-edge images (no padding, no radius) as a new section type
  3. `gallery-stick` renders a scroll-pinned gallery where content stays fixed while slides swap based on scroll position
  4. All gallery types include scroll-reveal entrance animation and respect `prefers-reduced-motion`
  5. Existing project content in en.json renders correctly with the fixed staggered component (no data migration needed)
**Plans**: 2 plans
**UI hint**: yes

Plans:
- [x] 04.1-01-PLAN.md — Type model extension + staggered gallery rewrite (span-aware row grid)
- [x] 04.1-02-PLAN.md — Full-bleed layered composition + sticky scroll-pinned gallery + ProjectPageShell wiring

### Phase 5: Secondary Sections & Polish
**Goal**: All remaining content sections are complete, menu links scroll to sections, and the full site is responsive and polished
**Depends on**: Phase 4
**Requirements**: SECT-04, SECT-05, SECT-06, ANIM-01, ANIM-02, ANIM-03, ANIM-04
**Success Criteria** (what must be TRUE):
  1. Education section displays degrees and certifications in a clean, compact layout
  2. Clients section renders a logo grid with hover treatments (requires logo assets in public/)
  3. Philosophy section reads as an article-style layout with pull quotes and proper typographic hierarchy
  4. Menu items scroll to their corresponding sections on click
  5. All sections reflow correctly across Desktop/Tablet/Mobile breakpoints
  6. Content blocks reveal on scroll, interactive elements have hover states
  7. All animations are suppressed when `prefers-reduced-motion` is enabled
**Plans**: TBD
**UI hint**: yes

Plans:
- [ ] 05-01: TBD
- [ ] 05-02: TBD
- [ ] 05-03: TBD
- [ ] 05-04: TBD

## Progress

**Execution Order:**
Phases execute in numeric order: 1 -> 2 -> 3 -> 4 -> 5

| Phase | Plans Complete | Status | Completed |
|-------|----------------|--------|-----------|
| 1. Infrastructure | 2/2 | Complete | 2026-04-02 |
| 2. Home Page | 4/4 | Complete | 2026-04-03 |
| 3. Project Pages | 3/3 | Complete | 2026-04-06 |
| 4. Core Content Sections | 3/3 | Complete   | 2026-04-18 |
| 4.1 Project Gallery Blocks | 0/2 | Not started | - |
| 5. Secondary Sections & Polish | 0/4 | Not started | - |
