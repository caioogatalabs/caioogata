# Phase 2: Home Page - Context

**Gathered:** 2026-04-03
**Status:** Ready for planning

<domain>
## Phase Boundary

Implement the complete V2 Home experience: Intro section (dark bg, compacts on scroll), CLI Menu with floating hover previews, Projects grid (6-6 cards with data-stamps), and Footer with expandable contact form. All sections responsive across Desktop (12col), Tablet (8col), and Mobile (4col). Components rebuilt from scratch using V2 design tokens. Each menu section gets a separate route.

</domain>

<decisions>
## Implementation Decisions

### Intro Section
- **D-01:** Dark background for V1 launch (bg/surface-secondary). Yellow inverted variant deferred for future A/B testing.
- **D-02:** Top bar: Logo left, "V2.0.01" + "Built for human and AI assistance" right.
- **D-03:** "Ask about" pill CTA links to `/llms.txt` (simple external link, no chat UI).
- **D-04:** On scroll, Intro compacts to a sticky header bar showing: logo, version, "Built for human and AI", and "ask about" CTA.
- **D-05:** Display headline: Fabio XM Regular 72px, overline: Fabio XM Medium 14px uppercase.

### Menu Section
- **D-06:** Full polished hover previews using floating overlay that follows cursor — inspired by fiddle.digital/work.
- **D-07:** Uniform preview component for all menu items (page preview image, video in future).
- **D-08:** Both keyboard (arrow keys) and mouse trigger the floating preview.
- **D-09:** No previews on mobile — tap navigates directly to the section route.
- **D-10:** Each section gets a separate route (`/about`, `/experience`, `/skills`, etc.).
- **D-11:** Navigation always returns to home menu (Esc key). No cross-section navigation between routes. Adjustable after first tests.
- **D-12:** Menu lives on home page only. No active state indicator needed on section pages.
- **D-13:** The navbar (Esc to go back, arrows to navigate, Enter to select) persists across all routes as the primary navigation mechanism.

### Animation & Motion System
- **D-14:** CSS-first animation system inspired by fiddle.digital — no external animation runtime for entrance/scroll animations. IntersectionObserver + CSS transitions.
- **D-15:** Primary easing: `cubic-bezier(0.22, 0.31, 0, 1)` with 0.9s duration for entrances. `cubic-bezier(0.5, 0, 0.3, 1)` for micro-interactions (0.3-0.45s).
- **D-16:** Stagger pattern: 70ms between elements, 150ms base offset. CSS classes with index (`-a-0` through `-a-N`).
- **D-17:** Page transitions: 600ms, opacity + translateY(32px), gated behind a `-ready` class that fires after fonts load.
- **D-18:** Menu hover: dim non-hovered rows (0.3s color transition), floating image preview tracks cursor with velocity-based skew.

### Projects Grid
- **D-19:** 4 cards in 2×2 grid (6-6 column layout per row, 20px gap), 420px height.
- **D-20:** Card structure: project name (top-left), data-stamp `PRJ_YEAR // NNN` (top-right), arrow button (bottom-right, 999px pill radius).
- **D-21:** Cards use `bg/surface-primary` background, `radius/md` (12px) corners.

### Footer & Contact
- **D-22:** Footer shows: tech tags (Next.js, React, Tailwind, Vercel — static list), copyright, Contact pill button.
- **D-23:** Contact form expands inline (footer grows in height). Two triggers: click Contact button OR scroll past footer.
- **D-24:** `/contact` in CLI menu triggers footer expand (scrolls to footer + opens), not a separate route.
- **D-25:** Form submission approach: Claude's discretion (must work with static export constraint).
- **D-26:** Tech tags are a static hardcoded list, not dynamic from package.json.

### V1 Component Strategy
- **D-27:** Rebuild all components from scratch for V2. Replace V1 files in-place (V1 preserved on `v1` branch).
- **D-28:** Same text content from `en.json` — no content rewrite. Asset organization (images/videos) at Claude's discretion.
- **D-29:** LLM routes must be preserved and continue working.

### Claude's Discretion
- Form submission mechanism for static export (D-25 — likely serverless function or client-side SDK)
- Content model adjustments for V2 needs (add preview images per section for menu hovers, etc.)
- Animation implementation details (whether to use Motion library for page transitions alongside CSS system)
- Responsive breakpoint exact values (reference: Fiddle uses 1024px as main split; our grid system uses Desktop/Tablet/Mobile)

</decisions>

<canonical_refs>
## Canonical References

**Downstream agents MUST read these before planning or implementing.**

### Design System & Tokens
- `docs/v2/Design.md` — Architectural Brutalism design direction, color rules, typography philosophy, component specs, do's and don'ts
- `docs/v2/spec.md` §4.1-4.1.3, §4.10 — Home section specs (Intro, Menu, Project Highlights, Footer)
- `src/tokens/primitives.css` — OKLCH color primitives
- `src/tokens/semantic.css` — Semantic tokens for Tailwind v4 @theme
- `src/tokens/tokens.ts` — TypeScript token map

### Figma References
- Figma file `1y4Fj3s8z9qTLsIpWQB87i` node `500:210` — Home V2 dark version (PRIMARY reference)
- Figma file `1y4Fj3s8z9qTLsIpWQB87i` node `513:873` — Home V2 yellow inverted version (DEFERRED)

### Motion Reference
- `docs/v2/fiddle-digital-extraction.md` — Complete extraction of fiddle.digital animation patterns, easing curves, hover behavior, responsive strategy. **Primary motion reference for Phase 2.**

### Content & Data
- `src/content/en.json` — Content data model (projects, sections, etc.)
- `src/content/types.ts` — TypeScript types for content model

### Existing V1 Code (reference only — being rebuilt)
- `src/components/sections/Intro.tsx` + `IntroCompact.tsx` — V1 intro pattern (full/compact behavior)
- `src/components/navigation/CLIMenu.tsx` — V1 CLI menu with keyboard nav
- `src/components/layout/Footer.tsx` — V1 footer
- `src/components/ui/ContactForm.tsx` — V1 contact form
- `src/hooks/useKeyboardNavigation.ts` — V1 keyboard navigation hook
- `src/hooks/useContactForm.ts` — V1 contact form hook

</canonical_refs>

<code_context>
## Existing Code Insights

### Reusable Assets
- Token system (`src/tokens/`) is fully operational — primitives + semantic + TS map ready for V2
- Fabio XM variable font already loaded (300-900 weight range)
- `src/content/en.json` has all content data needed for Home sections
- `/api/contact` endpoint exists for form submission (needs evaluation for static export)

### Established Patterns
- Next.js 15 App Router with static export (`output: 'export'`)
- Tailwind v4 with `@theme` consuming CSS custom properties from tokens
- 12-column grid system defined in tokens (Desktop 12col/20px/64px, Tablet 8col/20px/32px, Mobile 4col/16px/20px)

### Integration Points
- `src/app/page.tsx` — Current home page entry point (will be rewritten)
- `src/app/layout.tsx` — Root layout with Schema.org JSON-LD (preserve)
- `src/app/globals.css` — Global styles importing token system
- New routes needed: `/about`, `/experience`, `/skills`, `/education`, `/notable-clients`, `/philosophy`

</code_context>

<specifics>
## Specific Ideas

- **fiddle.digital/work is the primary motion reference** — the floating cursor with project images, row dimming on hover, and the velocity-based skew are the key interactions to adapt for the CLI menu
- **Intro compact on scroll** should feel like a smooth transition from full intro to header bar — not a jarring swap
- **Footer scroll reveal** should feel like the contact form was always there, just below the fold — natural extension, not a pop-up
- **Data-stamp format** on project cards: `PRJ_YEAR // NNN` (e.g., `PRJ_2024 // 001`) — reinforces the architectural blueprint theme from Design.md
- **Page transitions between home and section routes** should preserve the fast back-and-forth feel of V1's SPA navigation despite now using real routes

</specifics>

<deferred>
## Deferred Ideas

- Yellow inverted Intro variant (Figma node `513:873`) — test as A/B variant after launch
- Video previews in menu hover component — start with static images, swap to video later
- Cross-section navigation (next/prev between routes) — evaluate after first user tests
- Custom cursor with velocity skew — implement if time allows, otherwise use simpler floating preview

None — discussion stayed within phase scope

</deferred>

---

*Phase: 02-home-page*
*Context gathered: 2026-04-03*
