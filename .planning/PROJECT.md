# Portfolio V2 — Caio Ogata

## What This Is

Evolution of caioogata.com portfolio from V1 (CLI-inspired monospace) to V2 (Architectural Brutalism). Same content, same tone, but with refined typography (Fabio XM), brutalista/minimalist aesthetic, rich micro-interactions, dedicated project pages, and a token-first design system. Target: design directors, engineering managers, and recruiters evaluating senior design/engineering leadership.

## Core Value

The portfolio must communicate design engineering credibility through its own craft — the UI itself is the strongest portfolio piece.

## Requirements

### Validated

- ✓ Design System: Figma variables (Primitives, Semantic Colors, Layout) — 120+ vars, 3 modes (Dark/Light/Inverse) — v2-design
- ✓ CSS Tokens: `src/tokens/` with OKLCH primitives, semantic @theme for Tailwind v4, TypeScript map — v2-design
- ✓ 12-Column Grid: Desktop (12col/20px/64px), Tablet (8col/20px/32px), Mobile (4col/16px/20px) — v2-design
- ✓ Typography: 10 text styles (Display, Heading, Body, Label) + 6 Button styles — v2-design
- ✓ Button Component: 324 variants (9 shapes × 3 sizes × 3 states × 4 icon types) — v2-design
- ✓ Home Layout (Figma): Intro (inverted brand bg), Menu (CLI), Projects (6-6 grid), Footer — v2-design
- ✓ Logo SVG: vectorized in Figma with semantic variable binding — v2-design

### Active

- [ ] Preserve V1: branch `v1` + tag `v1.0.0` + deploy to `v1.caioogata.com`
- [ ] Migrate Tailwind v3 → v4: `@tailwindcss/postcss`, remove `tailwind.config.ts`, CSS `@theme`
- [ ] Integrate design tokens: `globals.css` imports `src/tokens/index.css`
- [ ] Typography setup: Fabio XM `@font-face` + variable font
- [x] Implement Home V2: Intro, Menu, Projects grid, Footer — Validated in Phase 02: Home Page (2026-04-03)
- [ ] Section layouts: About, Experience, Skills, Education, Clients, Philosophy
- [x] Project Pages: `/projects/[slug]` dedicated routes with hero + scroll layout — Validated in Phase 03: Project Pages (2026-04-06)
- [x] Animations: Motion library (page transitions, scroll reveals, hover states) — Validated in Phase 02: Home Page (2026-04-03)
- [x] Footer with expandable contact form — Validated in Phase 02: Home Page (2026-04-03)
- [ ] Responsive: all sections work across Desktop/Tablet/Mobile grid breakpoints

### Out of Scope

- WebGL / 3D effects — performance constraint, CSS/JS animations only
- shadcn/ui — building custom components from scratch
- Canvas-based image viewer (V1 ProjectCanvas) — replaced by inline images in grid
- Light mode at launch — Dark is default, Light mode deferred post-launch
- Multiple languages at launch — EN only for V2 initial release

## Context

- V1 is live at caioogata.com with CLI-inspired UI (Cascadia Mono), full i18n (EN/PT-BR), LLM routes
- V2 design system complete in Figma file `1y4Fj3s8z9qTLsIpWQB87i`, page "V2-claude-layouts"
- CSS tokens ready in `src/tokens/` but not yet integrated (project still on Tailwind v3)
- Current stack: Next.js 15 + React 19 + Tailwind v3 + pnpm + Vercel + static export
- Full spec: `docs/v2/spec.md` (439 lines), Design direction: `docs/v2/Design.md`
- Font files: `font-test/Trial Fabio XM/` (Light through Black + Variable)
- Content: `src/content/en.json` + `src/content/pt-br.json` with LanguageProvider

## Constraints

- **Stack**: Next.js 15 (App Router) + React 19 + Tailwind v4 + pnpm + Vercel
- **Export**: Static export in production (`output: 'export'`) — no server-side features in pages
- **Performance**: No WebGL, CSS/JS animations only, `prefers-reduced-motion` respected
- **Font**: Fabio XM is trial version — display use only, verify license before production
- **Grid**: 12-column system, all layouts use column spans (6-6, 4-4-4, 3-6-3, 2-8-2)
- **Radius**: 12px default for components, 999px for pill buttons, 0px eliminated
- **Shadows**: None — depth via tonal stacking only (Design.md rule)
- **Color**: 60-30-10 distribution — neutrals 60%, surfaces 30%, brand/accent 10%

## Key Decisions

| Decision | Rationale | Outcome |
|----------|-----------|---------|
| Architectural Brutalism direction | Premium feel through extreme precision, not decoration | — Pending |
| Fabio XM for structural type | Wide weight range, versatile, pairs well with Cascadia Mono | — Pending |
| Gabarito as Figma proxy | Fabio XM not available in Figma; Gabarito closest match | ✓ Good |
| Dark-first (default theme) | Portfolio is dark-only at launch; Light deferred | — Pending |
| Inverse mode for brand bg | Components on yellow need dark text/controls | ✓ Good |
| 12px corner radius (not 0px) | User preferred softer corners over pure brutalista | ✓ Good |
| Tailwind v4 migration | Tokens use @theme, need v4 for native CSS integration | — Pending |
| No shadcn/ui | Custom components from scratch to match brutalista aesthetic | — Pending |
| Column-based communication | All layouts described in grid spans, never arbitrary widths | ✓ Good |

## Evolution

This document evolves at phase transitions and milestone boundaries.

**After each phase transition** (via `/gsd:transition`):
1. Requirements invalidated? → Move to Out of Scope with reason
2. Requirements validated? → Move to Validated with phase reference
3. New requirements emerged? → Add to Active
4. Decisions to log? → Add to Key Decisions
5. "What This Is" still accurate? → Update if drifted

**After each milestone** (via `/gsd:complete-milestone`):
1. Full review of all sections
2. Core Value check — still the right priority?
3. Audit Out of Scope — reasons still valid?
4. Update Context with current state

---
*Last updated: 2026-04-02 after initialization*
