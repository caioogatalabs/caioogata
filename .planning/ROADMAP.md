# Roadmap: Portfolio V2

## Overview

Transform the portfolio from V1 (CLI-inspired monospace) to V2 (Architectural Brutalism) across four phases: lay the infrastructure foundation (V1 preservation, Tailwind v4, tokens, fonts), build the Home page as the hero experience, implement all content sections, then add project pages with animations and polish. The design system is already complete in Figma and CSS tokens -- this roadmap covers implementation only.

## Phases

**Phase Numbering:**
- Integer phases (1, 2, 3, 4): Planned milestone work
- Decimal phases (2.1, 2.2): Urgent insertions (marked with INSERTED)

Decimal phases appear between their surrounding integers in numeric order.

- [x] **Phase 1: Infrastructure** - Preserve V1, migrate Tailwind v4, integrate tokens, load Fabio XM
- [ ] **Phase 2: Home Page** - Implement the full Home V2 layout with intro, menu, projects grid, footer
- [ ] **Phase 3: Content Sections** - Build all content sections (About, Experience, Skills, Education, Clients, Philosophy)
- [ ] **Phase 4: Project Pages & Polish** - Dedicated project routes, animations, and interaction polish

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
- [ ] 02-03-PLAN.md — Menu section with CLI input, keyboard nav, floating preview
- [x] 02-04-PLAN.md — Projects grid with data-stamps, Footer with expandable contact form

### Phase 3: Content Sections
**Goal**: All portfolio content sections are implemented with the V2 design language, displaying real data from the content model
**Depends on**: Phase 2
**Requirements**: SECT-01, SECT-02, SECT-03, SECT-04, SECT-05, SECT-06
**Success Criteria** (what must be TRUE):
  1. About section renders bio, expertise areas, and background using V2 typography and grid
  2. Experience section displays roles with expandable detail panels
  3. Skills section shows proficiency data with a visual treatment (not plain text lists)
  4. Clients section renders a logo grid and Education section displays cleanly
  5. Philosophy section reads as an article-style layout with proper typographic hierarchy
**Plans**: TBD
**UI hint**: yes

Plans:
- [ ] 03-01: TBD
- [ ] 03-02: TBD

### Phase 4: Project Pages & Polish
**Goal**: Each project has a dedicated page with rich visual content, and the entire site feels alive with purposeful motion
**Depends on**: Phase 3
**Requirements**: PROJ-01, PROJ-02, PROJ-03, ANIM-01, ANIM-02, ANIM-03, ANIM-04
**Success Criteria** (what must be TRUE):
  1. Navigating to `/projects/[slug]` loads a dedicated page with hero image and scrollable content rendered from `en.json`
  2. Project pages display image galleries in responsive grid layouts
  3. Page transitions animate smoothly between sections using Motion library
  4. Content blocks reveal on scroll, and interactive elements (buttons, cards, menu items) have hover states
  5. All animations are suppressed when `prefers-reduced-motion` is enabled
**Plans**: TBD
**UI hint**: yes

Plans:
- [ ] 04-01: TBD
- [ ] 04-02: TBD
- [ ] 04-03: TBD

## Progress

**Execution Order:**
Phases execute in numeric order: 1 -> 2 -> 3 -> 4

| Phase | Plans Complete | Status | Completed |
|-------|----------------|--------|-----------|
| 1. Infrastructure | 2/2 | Complete | 2026-04-02 |
| 2. Home Page | 2/4 | In Progress|  |
| 3. Content Sections | 0/2 | Not started | - |
| 4. Project Pages & Polish | 0/3 | Not started | - |
