# Phase 3: Project Pages - Context

**Gathered:** 2026-04-06
**Status:** Ready for planning

<domain>
## Phase Boundary

Dedicated project routes at `/projects/[slug]` with component-based page composition, three gallery types, inter-project navigation, and project metadata info block. Pages rendered from existing `en.json` data model using `generateStaticParams` for static export. Each project page is assembled from reusable block components (not a rigid template).

</domain>

<decisions>
## Implementation Decisions

### Page Layout & Hero
- **D-01:** Component-based composition — project pages are assembled from reusable block components, not a fixed template. Each project defines which blocks to use and in what order.
- **D-02:** Hero always leads with display text (title) + image(s): either full-width 12-col OR two images in 6-6 split.
- **D-03:** Hero metadata: data-stamp (PRJ_YEAR // NNN), role, and technologies displayed alongside the title — consistent with Home card pattern.
- **D-04:** Below hero: challenge/solution structure (inspired by fiddle.digital/work/tarotoo), then big impact numbers when available. All structured on the 12-col grid.

### Image Galleries (3 types)
- **D-05:** **Gallery 1 — Staggered grid:** Mixed column spans (12, 6-6, 4-4-4) within the site's column system, playing with size differences. High image density. Each image reveals with scroll-linked clip-path expansion (reuse `useScrollReveal` pattern).
- **D-06:** **Gallery 2 — Feature list:** Vertical stack in 3-6-3 grid layout. Feature/screen name on the left (3-col), image centered (6-col), description on the right (3-col). Scroll-reveal similar to Home project cards + parallax float on the image inside its container box.
- **D-07:** **Gallery 3 — Full detail:** Generous showcase block (1+ viewport height). Large image with extended text description alongside. Editorial treatment for hero moments within a project.
- **D-08:** No lightbox/modal on image click — images are large enough inline. Keeps scroll flow unbroken.

### Inter-project Navigation
- **D-09:** Navigation bar below the hero/intro AND another at the end of content (like V1). If one is sticky, then a single sticky bar at the top is sufficient.
- **D-10:** Back/Esc + arrow key navigation, consistent with the keyboard nav system from Phase 2 (D-13). Same `useMenuNavigation` pattern.
- **D-11:** At the last project, "next" becomes "Back to Home" instead of looping. At the first project, "prev" is hidden or also "Back to Home".

### Project Metadata Info Block
- **D-12:** Dedicated info block at the bottom of the project, after all galleries. Structured as a grid list (dark bar layout with columns: Project, Client/Role, Technologies, Year, Links).
- **D-13:** Credits (team members with LinkedIn links) displayed in the footer section of the project, after the info block.

### Page Transitions
- **D-14:** DEFERRED — brand motion direction needs to evolve first. For now, use the same entrance system as Home: fade + slide-up with `-entrance -slide-up`, gated behind `-loaded -ready` classes (Phase 2, D-17).

### Claude's Discretion
- Content model extensions needed for the 3 gallery types (how to specify which gallery type per image group in `en.json`)
- Responsive behavior of Gallery 2 (3-6-3) on mobile — likely stacks vertically
- Exact parallax implementation for Gallery 2 image float (rAF approach similar to FloatingPreview)
- Static params generation from `en.json` project slugs

</decisions>

<canonical_refs>
## Canonical References

**Downstream agents MUST read these before planning or implementing.**

### Design System & Tokens
- `docs/v2/Design.md` — Architectural Brutalism direction, color rules, typography, component specs
- `docs/v2/spec.md` — V2 specification (check for project page specs)
- `src/tokens/primitives.css` — OKLCH color primitives
- `src/tokens/semantic.css` — Semantic tokens for Tailwind v4 @theme

### Content & Data Model
- `src/content/en.json` — Content data model (projects array with images, descriptions, etc.)
- `src/content/types.ts` — TypeScript types (`ProjectItem`, `ProjectImage`, `ProjectCredit`, `ProjectLink`)

### Figma References (moodboard)
- Figma `rhat0lw7toyYarEDXAbzIw` node `359:248` — Project page hero reference (display text + mixed images)
- Figma `rhat0lw7toyYarEDXAbzIw` node `359:252` — Portfolio landing reference (year, title, description, full-bleed image)
- Figma `rhat0lw7toyYarEDXAbzIw` node `361:301` — Gallery 1 reference: staggered grid with mixed sizes
- Figma `rhat0lw7toyYarEDXAbzIw` node `359:256` — Gallery 2 reference: feature list vertical stack
- Figma `rhat0lw7toyYarEDXAbzIw` node `361:293` — Gallery 3 reference: full detail showcase block
- Figma `rhat0lw7toyYarEDXAbzIw` node `362:312` — Project info block reference: grid list dark bar

### Existing V2 Code (reuse)
- `src/components/sections/v2/ProjectCard.tsx` — Home card with scroll-reveal (links to `/projects/${slug}`)
- `src/components/sections/v2/ProjectsGrid.tsx` — Home projects grid
- `src/hooks/useScrollReveal.ts` — Scroll-linked clip-path reveal (reuse for Gallery 1 & 2)
- `src/hooks/useInView.ts` — IntersectionObserver entrance trigger
- `src/hooks/useMenuNavigation.ts` — Keyboard navigation (adapt for inter-project nav)
- `src/components/layout/Grid.tsx` — 12-col responsive grid (Grid + GridItem)

### Motion Reference
- `docs/v2/fiddle-digital-extraction.md` — fiddle.digital animation patterns (challenge/solution layout reference)

</canonical_refs>

<code_context>
## Existing Code Insights

### Reusable Assets
- `useScrollReveal` hook: clip-path inset reveal driven by scroll — ready for Gallery 1 & 2 image reveals
- `useInView` hook: IntersectionObserver adding `-inview` class — entrance animation trigger
- `Grid` + `GridItem` components: 12-col responsive layout with static class maps
- `ProjectCard` already links to `/projects/${slug}` — routes just need to exist
- Entrance animation CSS classes (`-entrance -slide-up`, `-fade`, `-scale-in`) with stagger system
- `FloatingPreview` rAF lerp pattern — reference for Gallery 2 parallax implementation

### Established Patterns
- Static export with `generateStaticParams` needed for dynamic `[slug]` route
- V2 components in `src/components/sections/v2/` — new project page components go here
- Semantic tokens via `data-theme` attribute for section theming (dark default)
- Content from `src/content/en.json` — no content rewrite, extend model as needed

### Integration Points
- `src/app/projects/[slug]/page.tsx` — new dynamic route (does not exist yet)
- `src/content/en.json` — may need schema extensions for gallery type definitions per project
- `src/content/types.ts` — may need new types for gallery configurations
- `public/projects/{slug}/` — 7 project asset directories already exist with `.webp` images

</code_context>

<specifics>
## Specific Ideas

- **fiddle.digital/work/tarotoo** is the reference for the challenge/solution content structure below the hero
- **Gallery 2 parallax**: image should "float" subtly inside its container box on scroll — not full parallax, just a gentle drift effect
- **Info block at bottom**: inspired by the dark bar grid list (Figma 362:312) — columns for Project, Client, Role, Tech, Year, Links. Architectural spec-sheet feel.
- **Component composition**: each project page is unique in its block arrangement — some may skip Gallery 3, others may have multiple Gallery 1 sections. The data model should support this flexibility.
- **Navigation mirrors V1**: the keyboard-first, Esc-to-go-back pattern is a signature of the portfolio. Project pages must maintain this identity.

</specifics>

<deferred>
## Deferred Ideas

- Custom page transition (card morph, clip-path reveal) — deferred until brand motion direction evolves
- Video embeds in galleries — start with static images only
- Per-project color theming (accent color per project) — evaluate after base implementation

None beyond the above — discussion stayed within phase scope

</deferred>

---

*Phase: 03-project-pages*
*Context gathered: 2026-04-06*
