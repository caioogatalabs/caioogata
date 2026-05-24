# Portfolio V2 — Planning Hub

Central directory for all V2 planning, design, and execution artifacts.

## Status

**Phase:** Design System complete → Component library + Section layouts

## Quick Links

- [spec.md](spec.md) — Main design specification (sections, layout, behavior, references)
- [Design.md](Design.md) — Design System Strategy: Architectural Brutalism
- [stitch/](stitch/) — Stitch outputs, prompts, tokens, visual decisions
- [references/](references/) — Moodboards, screenshots, pattern extractions
- [decisions/](decisions/) — Architecture/design decisions with context (ADR-lite)

## What's Done

### Spec & Direction
- Spec sections 1-10 defined (coexistence, stack, visual direction, all sections)
- Home detailed: Intro, Menu, Projects grid, Footer
- Typography: Fabio XM (structural) + Cascadia Mono (accent) — Gabarito as Figma proxy
- Color direction: Brand Yellow (#FAEA4D), Secondary Teal (#618985), Accent Orange (#BC5F04), Neutral scale
- Animation style: mixed (fast/dry structural + elaborate hero)
- Design.md: Architectural Brutalism strategy

### Design System (Figma)
- **Primitives** collection: 54 color vars (Brand, Secondary, Accent, Neutral, Red, Green)
- **Semantic Colors** collection: 40 vars, 3 modes (Dark, Light, Inverse)
- **Layout** collection: 31 vars (spacing, radius, grid)
- **10 text styles** with Gabarito (Display, Heading, Body, Label)
- **3 grid styles**: Desktop (12col/20px/64px), Tablet (8col/20px/32px), Mobile (4col/16px/20px)
- **12-column grid** applied and validated — all layouts use column spans (6-6, 4-4-4, 2-8-2, etc.)

### CSS Tokens (Code)
- `src/tokens/primitives.css` — OKLCH color scales + spacing/radius/typography
- `src/tokens/semantic.css` — @theme for Tailwind v4 + Light/Inverse overrides
- `src/tokens/tokens.ts` — TypeScript map for dynamic styles
- `src/tokens/index.css` — entry point

### Home Layout (Figma)
- Figma file: `1y4Fj3s8z9qTLsIpWQB87i`, page "V2-claude-layouts"
- Frame "Home — V2 (DS)" (`465:2`) — fully rebuilt with DS variables
- Intro: Inverted (brand yellow bg), SVG logo, overline, display headline
- Menu: CLI input, compact rows (2-10 grid), navbar with key badges
- Projects: 6-6 grid, 4 cards with tonal stacking, data-stamps, pill arrow buttons
- Footer: `data-theme="light"` (grey bg), tech tags, copyright, pill contact button, expandable contact form

## What's Next

### Components (Figma)
Priority components to build as Figma component sets with variants:
- [ ] **Button** — Primary, Secondary, Ghost, Destructive × sm/md/lg + pill variant
- [ ] **Card** — Project card, surface card
- [ ] **Badge/Tag** — Tech tags, status badges
- [ ] **Input** — CLI input, form input
- [ ] **Navbar** — Key badges, navigation hints
- [ ] **Divider** — Ghost border variants
- [ ] **Data Stamp** — PRJ_YYYY // NNN label pattern

### Section Layouts (Figma)
- [ ] About — Bio, expertise, background
- [ ] Experience — Expandable role details
- [ ] Skills — Visual proficiency treatment
- [ ] Education — Clean, minimal
- [ ] Clients — Modern logo grid
- [ ] Philosophy — Article-style layout
- [ ] Project Pages — `/projects/[slug]` hero + scroll layout

### Code Implementation
- [ ] V1 preservation: branch `v1` + tag `v1.0.0` + deploy to `v1.caioogata.com`
- [ ] Migrate to Tailwind v4: `postcss.config.mjs` + simplify `tailwind.config.ts`
- [ ] Integrate tokens: `globals.css` imports `src/tokens/index.css`
- [ ] Typography setup: Fabio XM `@font-face` + font files
- [ ] Routing: `/projects/[slug]` dedicated pages
- [ ] Animations: Motion library (page transitions, scroll reveals, hover states)
- [ ] Rebuild sections with new layouts
- [ ] Contact → expandable Footer

## Key Decisions

| Decision | Choice | Date |
|----------|--------|------|
| Design direction | Architectural Brutalism | 2026-03 |
| Font (structural) | Fabio XM (Gabarito proxy in Figma) | 2026-04-02 |
| Font (accent) | Cascadia Mono | 2026-03 |
| Colors | Brand Yellow + Teal + Orange + Neutral | 2026-04-02 |
| Themes | Dark (default) + Light (grey-based) + Inverse | 2026-04-02 |
| Light theme bg | Grey (neutral-200, 0.65) — not white | 2026-04-05 |
| Light theme usage | `data-theme="light"` on section container | 2026-04-05 |
| Radius | 0px brutalista, pill (999px) buttons only | 2026-04-02 |
| Shadows | None — tonal stacking only | 2026-04-02 |
| Grid | 12-col, spans: 6-6, 4-4-4, 3-6-3, 2-8-2 | 2026-04-02 |
| Tailwind | v4 (@theme in CSS) | 2026-04-02 |
| Component library | Custom (no shadcn) | 2026-04-02 |
