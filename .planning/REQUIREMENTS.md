# Requirements: Portfolio V2

**Defined:** 2026-04-02
**Core Value:** The portfolio must communicate design engineering credibility through its own craft — the UI itself is the strongest portfolio piece.

## v1 Requirements

### Infrastructure

- [ ] **INFRA-01**: V1 preserved on branch `v1` with tag `v1.0.0`
- [ ] **INFRA-02**: V1 deployed and accessible at `v1.caioogata.com`
- [ ] **INFRA-03**: Tailwind migrated from v3 to v4 with `@tailwindcss/postcss`
- [ ] **INFRA-04**: Design tokens integrated via `globals.css` → `src/tokens/index.css`
- [ ] **INFRA-05**: Fabio XM font loaded via `@font-face` with variable font support

### Home Page

- [ ] **HOME-01**: Intro section with inverted brand bg, logo, overline, display headline
- [ ] **HOME-02**: Menu section with CLI input, filterable command list, keyboard navbar
- [ ] **HOME-03**: Projects grid in 6-6 layout with 4 cards, data-stamps, arrow buttons
- [ ] **HOME-04**: Footer with tech tags, copyright, pill contact button
- [ ] **HOME-05**: All sections responsive across Desktop (12col) / Tablet (8col) / Mobile (4col)

### Content Sections

- [ ] **SECT-01**: About section with bio, expertise, and background
- [ ] **SECT-02**: Experience section with expandable role details
- [ ] **SECT-03**: Skills section with visual proficiency treatment
- [ ] **SECT-04**: Education section (clean, minimal)
- [ ] **SECT-05**: Clients section with modern logo grid
- [ ] **SECT-06**: Philosophy section with article-style layout

### Project Pages

- [ ] **PROJ-01**: Dedicated routes at `/projects/[slug]` with hero image and scroll layout
- [ ] **PROJ-02**: Project content rendered from existing `en.json` data model
- [ ] **PROJ-03**: Image gallery with responsive grid layout (no canvas viewer)

### Interaction & Animation

- [ ] **ANIM-01**: Page transitions between sections using Motion library
- [ ] **ANIM-02**: Scroll-triggered reveal animations on content blocks
- [ ] **ANIM-03**: Hover states on all interactive elements (buttons, cards, menu items)
- [ ] **ANIM-04**: All animations respect `prefers-reduced-motion`

### Footer & Contact

- [ ] **FOOT-01**: Expandable contact form in footer
- [ ] **FOOT-02**: Form sends email via Resend API (existing `/api/contact`)

## v2 Requirements

### Theming

- **THEME-01**: Light mode toggle with theme persistence
- **THEME-02**: PT-BR language support restored

### LLM

- **LLM-01**: Updated LLM routes reflecting V2 content and structure
- **LLM-02**: Per-project LLM routes at `/llms/projects/{slug}.txt`

### SEO

- **SEO-01**: Per-project OG metadata on `/projects/[slug]` pages
- **SEO-02**: Updated Schema.org Person JSON-LD for V2

## Out of Scope

| Feature | Reason |
|---------|--------|
| WebGL / 3D effects | Performance constraint — CSS/JS animations only |
| Canvas image viewer | V1 approach replaced by inline responsive images |
| shadcn/ui components | Custom components to match brutalista aesthetic |
| Multiple languages at launch | EN only for V2 initial release |
| Light mode at launch | Dark is default, Light deferred to v2 |

## Traceability

| Requirement | Phase | Status |
|-------------|-------|--------|
| INFRA-01 | Phase 1 | Pending |
| INFRA-02 | Phase 1 | Pending |
| INFRA-03 | Phase 1 | Pending |
| INFRA-04 | Phase 1 | Pending |
| INFRA-05 | Phase 1 | Pending |
| HOME-01 | Phase 2 | Pending |
| HOME-02 | Phase 2 | Pending |
| HOME-03 | Phase 2 | Pending |
| HOME-04 | Phase 2 | Pending |
| HOME-05 | Phase 2 | Pending |
| SECT-01 | Phase 3 | Pending |
| SECT-02 | Phase 3 | Pending |
| SECT-03 | Phase 3 | Pending |
| SECT-04 | Phase 3 | Pending |
| SECT-05 | Phase 3 | Pending |
| SECT-06 | Phase 3 | Pending |
| PROJ-01 | Phase 4 | Pending |
| PROJ-02 | Phase 4 | Pending |
| PROJ-03 | Phase 4 | Pending |
| ANIM-01 | Phase 4 | Pending |
| ANIM-02 | Phase 4 | Pending |
| ANIM-03 | Phase 4 | Pending |
| ANIM-04 | Phase 4 | Pending |
| FOOT-01 | Phase 2 | Pending |
| FOOT-02 | Phase 2 | Pending |

**Coverage:**
- v1 requirements: 25 total
- Mapped to phases: 25
- Unmapped: 0 ✓

---
*Requirements defined: 2026-04-02*
*Last updated: 2026-04-02 after initial definition*
