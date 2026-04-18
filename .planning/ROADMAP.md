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
- [ ] **Phase 4: Core Content Sections** - About, Experience, Skills — the 3 high-impact portfolio sections
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
**Goal**: The 3 highest-impact portfolio sections are live — a visitor can read About, browse Experience, and scan Skills with rich visual treatments that match V2 quality
**Depends on**: Phase 3
**Requirements**: SECT-01, SECT-02, SECT-03
**Success Criteria** (what must be TRUE):
  1. About section renders bio in 4-8 grid with pull quotes and expertise tags using V2 typography
  2. Experience section displays 12 roles with CSS-only accordion expand for detailed jobs (Azion, Huia) and compact rows for earlier roles
  3. Skills section shows 6 categories in 4-4-4 grid with dot/label level indicators (not plain text lists)
  4. Each section uses appropriate `data-theme` for tonal rhythm (dark → light → dark)
  5. All sections animate with `useInView` entrances and respect `prefers-reduced-motion`
**Plans**: 3 plans
**UI hint**: yes

Plans:
- [ ] 04-01-PLAN.md — About section: 4-8 grid, pull quotes, expertise tags
- [x] 04-02-PLAN.md — Experience section: accordion list with CSS-only expand, career progression
- [ ] 04-03-PLAN.md — Skills section: 4-4-4 category grid with level indicators

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
| 4. Core Content Sections | 0/3 | Not started | - |
| 5. Secondary Sections & Polish | 0/4 | Not started | - |
