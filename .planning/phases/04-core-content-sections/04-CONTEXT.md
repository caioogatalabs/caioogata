# Phase 4: Core Content Sections - Context

**Gathered:** 2026-04-18
**Updated:** 2026-04-18
**Status:** Ready for planning (revised — previous implementation reverted)

<domain>
## Phase Boundary

Three high-impact portfolio content sections — About, Experience, Skills — implemented as V2 sections rendered inside PageShell between ProjectsGrid and Footer. Each section has a **hero zone** (display heading + stats or immersive scroll) followed by its **content zone**. Major upgrade from initial context: sections now feature richer interaction patterns (menu-style hover, scroll-driven video, SVG relationship mapping) that match the V2 quality bar.

Content sourced from existing `en.json` data — no content rewrite. Skills section requires a new data extension: skill-to-project mapping. These are the sections a hiring manager or design director reads to evaluate the candidate.

</domain>

<decisions>
## Implementation Decisions

### About Section

#### Hero Zone — Scroll-Driven Frame-by-Frame Video
- **D-01:** Hero background is a scroll-driven frame-by-frame video (`about-refs/caio-about-video-hero.mp4`). The video shows a person under a bridge walking forward — the "bridging" narrative. As user scrolls, video frames advance, person is revealed.
- **D-02:** Frame-by-frame technique: **Canvas + image sequence** (Apple-style). Extract 241 frames from the mp4 to WebP sequence, draw to `<canvas>` element driven by scroll position via rAF. Estimated ~2-5MB total for the sequence.
- **D-03:** Content overlaid on video hero: display-size headline "Bridging brand..." + core expertise list. Composed on top of the video frames, like the Monolith Constructions reference (`about-refs/dab60f2b33c4ca22dcc141a5c716058c.jpg`).
- **D-04:** The hero is a tall scroll zone (multiple viewport heights) — the video plays through its full 241 frames as the user scrolls through this zone.

#### Content Zone — After Video Completes
- **D-05:** Layout: `6-6` grid — **left column empty**, content scrolls only in the **right column**. Asymmetric editorial layout.
- **D-06:** Right column contains: bio text, pull quotes, detailed expertise information.
- **D-07:** Pull quotes: extract 1-2 key sentences from bio as display-size Fabio XM Light with tonal shift background (`bg-surface-secondary` block with extra padding).
- **D-08:** Bio text: `body-md` with generous line-height, paragraphs separated by spacing (not indentation).
- **D-09:** Theme: dark (default) — no `data-theme` attribute needed.
- **D-10:** Animations: `useInView` with `-entrance -slide-up` on content blocks.

### Experience Section

#### Hero Zone
- **D-11:** Hero with display-size "Experience" heading in Fabio XM + key stats (e.g., "12+ years", "6 companies", "3 director roles"). Same hero pattern as project pages.

#### Row List — Menu-Style Hover Pattern
- **D-12:** Experience rows reuse the **MenuSection fiddle-style hover pattern**: yellow background bar (`bg-fill-primary`), masked vertical text swap (Fabio XM → Pexel Grotesk), display arrow `→` expanding before label. All hover animations, timings, and easings match MenuSection exactly.
- **D-13:** Row grid: **3-3-3-3** — Date range | Company | Title | Arrow/expand indicator. Information perfectly aligned to 12-col grid columns, forming an organized table.
- **D-14:** Click or Enter expands the row — accordion inline using CSS `grid-template-rows: 0fr → 1fr` transition with `--ease-smooth`.
- **D-15:** Expanded content layout: **6-6** grid — description on the left, achievements bullet list on the right.
- **D-16:** Expanded row stays in **brand yellow** (`bg-fill-primary`) — the hover state persists as the active/expanded state. Text colors adapt to on-primary tokens.
- **D-17:** **No special Azion grouping** — all 12 roles treated equally. The dates and company name tell the career progression story naturally.
- **D-18:** Minor roles (indices 7-11): same row pattern, just less content when expanded (no achievements list, only description if available).
- **D-19:** Theme: `data-theme="light"` — grey background, dark text. Tonal break from About (dark) above.
- **D-20:** Keyboard navigation: arrow keys to navigate rows, Enter to expand/collapse. Keyboard parity with hover interactions.
- **D-21:** Row dimming: when hovering/focusing one row, other rows dim (same as MenuSection `isDimmed` pattern).

### Skills Section

#### Hero Zone
- **D-22:** Hero with display-size "Skills" heading + stats. Same hero pattern as Experience section.

#### Skills-to-Projects Relationship Map
- **D-23:** Layout: **6-6** grid — skills on the **left**, projects (case studies) on the **right**.
- **D-24:** Within each side, content organized in sub-columns for density.
- **D-25:** **SVG connecting lines** between skills and their associated projects. Lines show which skills were applied in which projects. Reference: Nike "Articulated Speed" data mapping (`about-refs/dab60f2b33c4ca22dcc141a5c716058c.jpg` pattern — two columns with relationship lines).
- **D-26:** Hover interaction: **bidirectional highlighting**. Hover a skill → its lines + connected projects highlight, everything else dims. Hover a project → its lines + connected skills highlight. Clean focus effect.
- **D-27:** Level indicator: **progress bar over divider**. Between each skill item, a thin divider line serves as the track. A thicker bar overlays the divider showing the proficiency level as a fill proportion (like V1). Text label (`Expert`, `Advanced`, etc.) below the divider, aligned with the skill name.
- **D-28:** Theme: dark (default) — returns to dark after Experience light section. Tonal rhythm: dark → light → dark.
- **D-29:** Animations: section entrance with `useInView`, SVG lines could draw on scroll entry.

#### Data Model Extension
- **D-30:** Skills-to-projects mapping requires a new data structure in `en.json` or a separate mapping file. Each skill needs an array of project slugs it connects to. This is NEW data not currently in the content model.

### Section Integration
- **D-31:** Section order in PageShell: Intro → Menu → ProjectsGrid → About → Experience → Skills → (Footer stays in layout.tsx)
- **D-32:** Each section is a separate component file in `src/components/sections/v2/`: `AboutSection.tsx`, `ExperienceSection.tsx`, `SkillsSection.tsx`
- **D-33:** Each section has its own `id` attribute for future scroll-to-section functionality (Phase 5): `id="about"`, `id="experience"`, `id="skills"`
- **D-34:** Each section uses full-width padding pattern: `px-5 md:px-8 lg:px-16` (consistent with existing sections)
- **D-35:** Section spacing: generous vertical padding between sections (80px+ for section separation)
- **D-36:** All three sections now have hero zones — consistent pattern across About, Experience, Skills

### Claude's Discretion
- Exact pull quote selection from bio text (which 1-2 sentences to extract)
- Responsive behavior: skills relationship map likely simplifies on mobile (stacked, no lines)
- Responsive behavior: experience 3-3-3-3 grid likely collapses on mobile
- Frame extraction tooling: ffmpeg command to extract WebP sequence from mp4
- Number of frames to use (all 241 or a reduced set for performance)
- Exact scroll-to-frame mapping curve (linear vs eased)
- SVG line rendering approach (bezier curves vs straight lines between items)
- Whether skill-to-project mapping lives in `en.json` or a separate file
- Hero stats content (exact numbers and labels for Experience and Skills heroes)
- How the About video hero transitions into the content zone below

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

### Reference Assets (About Hero)
- `about-refs/caio-about-video-hero.mp4` — Source video for frame-by-frame scroll (241 frames, 24fps, 1268x724)
- `about-refs/dab60f2b33c4ca22dcc141a5c716058c.jpg` — Monolith Constructions layout reference (content composed over full-bleed image)

### Existing V2 Patterns (reuse)
- `src/components/sections/v2/MenuSection.tsx` — **PRIMARY REFERENCE** for Experience row hover pattern (yellow bar, masked text swap, arrow, dimming). Experience rows must match this interaction language exactly.
- `src/components/sections/v2/IntroSection.tsx` — Reference for section structure, useInView pattern, entrance animations
- `src/components/sections/v2/FooterSection.tsx` — Reference for `data-theme="light"` usage, accordion-like expand
- `src/components/sections/v2/ProjectCard.tsx` — Reference for scroll-reveal pattern
- `src/hooks/useScrollReveal.ts` — Scroll-linked clip-path (reference for scroll-driven patterns)
- `src/hooks/useScrollExpand.ts` — Scroll-linked polygon expand (reference for rAF scroll mapping)
- `src/components/layout/Grid.tsx` — 12-col grid with GridItem (static class maps)
- `src/hooks/useInView.ts` — IntersectionObserver entrance trigger
- `src/app/globals.css` — Entrance animation CSS classes (`-entrance -slide-up`, `-fade`, `-scale-in`, stagger `-a-N`)
- `src/components/layout/PageShell.tsx` — Section orchestrator (where new sections are added)

### Prior Phase Context
- `.planning/phases/02-home-page/02-CONTEXT.md` — Animation system decisions, section theming approach
- `.planning/phases/03-project-pages/03-CONTEXT.md` — Component composition pattern, scroll-reveal reuse

</canonical_refs>

<code_context>
## Existing Code Insights

### Reusable Assets
- `useInView` hook: IntersectionObserver → adds `-inview` class for entrance animations. Already used by all V2 sections.
- `Grid` + `GridItem`: 12-col responsive layout. Static class maps for `MOBILE_SPAN`, `TABLET_SPAN`, `DESKTOP_SPAN`.
- Entrance animation CSS: `-entrance -slide-up`, `-entrance -fade`, `-entrance -scale-in` with stagger classes `-a-0` through `-a-20`.
- `MenuSection` hover pattern: yellow bar, masked text swap, arrow expand, row dimming — **must be replicated for Experience rows**.
- `useScrollReveal` / `useScrollExpand`: existing rAF scroll-linked hooks — reference architecture for the scroll-driven video frame mapping.
- `FooterSection` has existing expand/collapse pattern (contact form) — reference for accordion behavior.
- `data-theme="light"` already implemented in FooterSection's inner card — token overrides work.

### Established Patterns
- Section components are `'use client'` with `useInView` for entrance triggers
- Full-width padding via `px-5 md:px-8 lg:px-16` (not Grid wrapper)
- Grid used only for internal 12-col alignment
- Content imported directly from `en.json` with type casting
- Font family for display text: `style={{ fontFamily: 'var(--font-sans)' }}`
- Mono text: `font-mono` class for Cascadia Mono
- Client-only dynamic imports for heavy dependencies (Three.js pattern in `NoiseGradientCanvas`)

### Integration Points
- `PageShell.tsx` — Add 3 new section imports and render between `<ProjectsGrid />` and end of fragment
- `en.json` — Content exists for About and Experience. **Skills needs new skill-to-project mapping data.**
- `types.ts` — Needs extension for skill-to-project mapping type
- `public/about-frames/` — New directory for extracted WebP frame sequence (build-time asset)

</code_context>

<specifics>
## Specific Ideas

- **"Bridging" narrative** is the conceptual thread for About. The video literally shows someone under a bridge walking forward to reveal themselves — the metaphor for bridging brand strategy, product craft, and technical implementation. The headline "Bridging brand..." reinforces this.
- **Experience rows = menu rows** — the hover interaction must feel identical. Same yellow bar, same text swap, same arrow, same timing. The expanded state keeps the yellow active. This creates a consistent interactive language across the portfolio.
- **Skills relationship map** is a data visualization — Nike "Articulated Speed" style. SVG lines connecting skills to projects prove each skill with real work. Bidirectional hover highlighting lets visitors explore from either direction.
- **Progress bar level indicator** over the divider between skill items — the divider is the track, the thicker bar is the fill. Text label below. Same concept as V1 but refined for V2 aesthetics.
- **Hero zones on all three sections** — consistent pattern with display-size headings. About gets the immersive scroll-driven video, Experience and Skills get heading + stats.
- **Tonal rhythm** maintained: dark (About) → light (Experience) → dark (Skills).

</specifics>

<deferred>
## Deferred Ideas

- Menu scroll-to-section integration (clicking "about" in menu scrolls to About section) — Phase 5
- Light mode support for all sections — deferred post-launch
- i18n (PT-BR) for all sections — deferred post-launch
- Per-section OG metadata — not needed for home page sections
- Clickable project links in Skills relationship map (navigate to project page) — could be Phase 5 or post-launch

</deferred>

---

*Phase: 04-core-content-sections*
*Context gathered: 2026-04-18*
*Context updated: 2026-04-18*
