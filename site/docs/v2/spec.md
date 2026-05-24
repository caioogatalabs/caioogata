# Portfolio V2 — Design Spec

## Overview

Evolution of caioogata.com portfolio from V1 to V2. The V2 is a visual and structural evolution — same content foundation, same navigation mechanics, same tone of voice, but with refined typography, brutalista/minimalist aesthetic, rich micro-interactions, and project pages with dedicated routes.

V1 remains accessible at `v1.caioogata.com` as a frozen snapshot.

---

## 1. Coexistence Strategy (V1 / V2)

### Preservation of V1
- Create branch `v1` from current `main` state
- Tag `v1.0.0` to mark the snapshot
- Branch `v1` is frozen — no further commits

### Vercel Setup
- New Vercel project (or branch deployment) pointing to branch `v1`
- Custom domain `v1.caioogata.com` configured on that deployment
- V1 continues building and serving exactly as today — same Next.js 15, same routes, same static export

### V2 Development
- V2 development happens on `main` (or feature branches that merge into `main`)
- `www.caioogata.com` continues serving `main`
- Vercel preview deployments for testing V2 during development
- Go-live is simply deploying `main` with the V2 code

### LLM Routes
- V1 retains its `/llms.txt`, `/llms-full.txt` etc. on `v1.caioogata.com`
- V2 gets its own LLM routes on `www.caioogata.com` — independent
- Optional: V2 `robots.txt` can reference V1 as previous version

### SEO & Canonical URLs
- `www.caioogata.com` is the canonical domain — V2 owns all canonical URLs
- `v1.caioogata.com` should include `<meta name="robots" content="noindex">` or `rel="canonical"` pointing to `www.caioogata.com` to prevent duplicate content
- Schema.org Person JSON-LD carries over from V1 to V2 (updated with any new info)
- OG metadata updated for V2 visual identity on main pages
- Per-project OG metadata on `/projects/[slug]` pages (title, description, image)

---

## 2. Tech Stack

### What stays
- **Next.js 15** (App Router) + **React 19**
- **Tailwind CSS** (custom theme — tokens will be updated for V2 visual identity)
- **pnpm** as package manager
- **Vercel** hosting with hybrid rendering (static pages + serverless API routes for `/api/contact`)
- **i18n**: `en.json` + `pt-br.json` with `LanguageProvider` (client-side)
- **Resend** for contact form
- **Vercel Analytics** + **Speed Insights**
- **Motion** library for animations (will be used more extensively)

### What changes
- **Typography**: New typeface(s) — moving away from Cascadia Mono as primary. Mono retained as accent/code font. Candidates: Pexel Grotesk (display) and Fabio XM (structural) — see section 3 for details
- **Routing**: Projects get dedicated routes (`/projects/[slug]`) instead of SPA-only rendering
- **Design tokens**: New color palette, spacing, and typography scale aligned with brutalista/minimalist direction
- **Animations**: Significantly expanded — page transitions, scroll reveals, hover states, typographic animation, layout transforms. All CSS/JS, no WebGL. Performance is a hard constraint.
- **Project canvas approach removed**: The V1 canvas-based image viewer (`ProjectCanvas`, `FreeView`, `ImageWindow`, `ImageEditorWindow`, `VideoEditorWindow`) is fully deprecated. Project images in V2 are displayed inline within the section and on dedicated project pages — standard responsive images in grid layouts, no interactive canvas or windowed viewer

### What's added
- **App Router dynamic routes**: `/projects/[slug]` for individual project pages
- **Inter-project navigation**: Next/prev links between project pages
- **Home project highlights**: 50/50 grid of featured projects on home
- **Footer with expandable contact**: Replaces standalone Contact section — minimalista footer that expands upward to reveal contact form

---

## 3. Visual Direction

### Aesthetic
- **Brutalista / minimalist** — raw, intentional, high contrast
- **Tech-inspired** but not literal CLI — the V1 terminal aesthetic evolves into something more refined that nods to tech without being constrained by it
- **Display typography** as a primary design element — large, bold type for positioning statements
- **Performance-first motion**: micro-interactions (hover, scroll, transitions) over heavy effects

### Typography

Two candidate typefaces under evaluation (trial versions in `font-test/`). Not used simultaneously — tests will determine which one(s) make the final cut.

| Font | Role | Weights | Notes |
|---|---|---|---|
| **Pexel Grotesk** | Display — headlines, statements, visual impact | Regular (trial) | Personality-driven grotesque |
| **Fabio XM** | Structural — titles, paragraphs, navigation | Light → Black + Variable (trial) | Versatile, wide weight range |
| **Cascadia Mono** | Accent — code, technical details, hints | 400, 700 (from V1) | Retained from V1 |

Final selection after visual testing in Google Stitch.

### Design Tokens

**Color palette — direction defined, exact values to be refined in Stitch:**
- **Primary:** Yellow (evolve from V1 `#FAEA4D`)
- **Base:** Dark tones (evolve from V1 `#0c0c0d`)
- **Complementary:** Neutral grays, tonal
- **V1 legacy colors:** Orange (`#BC5F04`) and teal (`#618985`) are candidates for removal or evolution — Stitch will validate
- Spacing system: evolve from V1 tokens
- Border radius: stays minimal (brutalista)
- Shadows: minimal or none (brutalista)

### Animation Principles

**Style:** Mixed approach — structural elements enter fast/dry (snappy, editorial cuts), while hero/featured elements (images, project previews) get more elaborate transitions. Specific timing and easing per section, defined after section details are finalized.

- Page transitions between sections
- Scroll-triggered reveals
- Hover states on all interactive elements
- Typographic animations (text reveals, weight shifts)
- Layout transforms (grid rearrangements, element repositioning)
- Everything must be fast — no animation should delay perceived content access

### Visual Validation (Stitch)

Google Stitch is used as the visual validation layer. The workflow:
1. **Spec** (this document) → defines intent, layout, behavior, references
2. **Stitch** → generates screens from spec, validates visually, extracts tokens
3. **Spec updated** → incorporates Stitch outputs (final tokens, validated layouts) back here

Stitch limitation: custom fonts (Pexel Grotesk, Fabio XM) not available in Stitch's font catalog. Proxy fonts (e.g., Space Grotesk, Geist) used for layout validation; real fonts applied during implementation.

---

## 4. Section-by-Section Spec

### 4.1 Home

The home page is composed of four distinct blocks: Intro, Menu, Projects, and Footer (section 4.10).

#### 4.1.1 Intro

**Layout:**
- Full-width hero block — visually autonomous, separated from the rest of the site with a hard visual cut (no gradual transition)
- **Background:** Primary color (yellow) as full background, OR dark background with primary color on typography — to be validated in Stitch
- **Overline:** "Design Director / Design System / ..." — roles and specializations, smaller text above the main statement
- **Display statement:** "Bridging brand strategy, product craft and technical workflow" — dominant size, personality font (Pexel Grotesk or Fabio XM), typographic impact as primary design element
- **Elements:** Logo, LLM interaction CTA, language toggle — positioned without competing with the statement

**Intro behavior:**
- V1 has two components: `Intro` (full, shown on home default) and `IntroCompact` (shown when navigating to a section). V2 preserves this pattern — full intro on home default view, compact version when a section is active. Visual treatment of both evolves with V2 design.

**Figma references:** [Intro moodboard](https://www.figma.com/board/rhat0lw7toyYarEDXAbzIw/Notes-always-open?node-id=342-328)
- Patterns extracted: full-width dark blocks with yellow accents, display typography dominating the layout, statement text at aggressive scale, clean separation between hero and content below, responsive compositions (mobile + desktop) as part of the visual language

**Animations:**
- Intro elements animate in on load (timing/easing TBD per section)

#### 4.1.2 Menu

**Layout:**
- Tabular list structure — items as rows, not buttons
- Larger font than V1, structural font with personality
- Possible columns: index/number + section name + metadata
- Navigation bar wraps around (top and bottom), same mechanic as V1

**Behavior:**
- **Hover:** Expands inline showing **samples/teasers** of the section's content — e.g., hovering "Projects" shows project thumbnails, hovering "Experience" shows company logos or names
- **The samples are not interactive** — they provide visual context only. Click always navigates to the full section, never to individual items within the preview
- **Click/Enter:** Always navigates to the full section
- Keyboard navigation preserved (arrow keys, Enter, Esc, type-to-filter)

**Figma references:** [Menu moodboard](https://www.figma.com/board/rhat0lw7toyYarEDXAbzIw/Notes-always-open?node-id=342-400)
- Patterns extracted: tabular/spreadsheet-style list with numbered rows, hover reveals image previews inline with highlight color (yellow), "Projects Index" feel — large title + structured list below, preview thumbnails appear on hover without leaving the list context

**Animations:**
- Hover expansion/preview reveal (timing TBD)
- Highlight transitions on active/hover states

#### 4.1.3 Project Highlights

**Layout:**
- Grid 2 columns, 50/50 split — equal weight, clean division
- Each cell: project image/preview as visual content, title aligned **top-left corner**
- Button with arrow (→) for navigation — enter the project page
- **Contrast with Intro:** Visual break between the intro block and this section (different background treatment, rhythm change)

**Behavior:**
- Each card links to `/projects/[slug]`
- Cards show: title + arrow button only — no description, no tags

**Figma references:** [Projects moodboard](https://www.figma.com/board/rhat0lw7toyYarEDXAbzIw/Notes-always-open?node-id=342-345)
- Patterns extracted: dark container cards with clean framing, text anchored top-left, 50/50 grid division, strong contrast between sections, visual content fills the card space, labels/titles are discrete and don't compete with imagery

**Animations:**
- Hover states on cards (TBD)
- Possible entrance animation on scroll

---

### 4.2 About

**Content:** Same as V1 — bio, expertise, background.

**Layout changes:**
- Better structured grid layout
- Quotes or highlighted key statements pulled out as visual elements
- Improved typographic hierarchy — display type for key phrases, body for narrative
- More visual breathing room

**Animations:**
- Scroll reveals for content blocks
- Quote/highlight entrance animations

---

### 4.3 Experience

**Content:** Same as V1 — roles, companies, key achievements.

**Layout changes:**
- Maintains tabular/list structure — the structured, product-design feel of lists and crosses stays
- Main list shows summary; details are expandable
- Expand mechanism TBD (could be accordion, lateral panel, or other — to be decided during visual design phase)
- Better typographic hierarchy and spacing

**Animations:**
- List item entrance on scroll
- Expand/collapse transitions

---

### 4.4 Skills

**Content:** Same as V1 — skills by category with proficiency indication.

**Layout changes:**
- Keeps the core: show quantity/quality per skill with categorized listing
- Same objective, may get a different visual treatment (tags, bars, grid) but must communicate the same information
- Visual solution TBD during design phase

**Animations:**
- Skill items reveal on scroll
- Possible animated proficiency indicators

---

### 4.5 Education

**Content:** Same as V1 — degrees, institutions, continuing learning.

**Layout changes:**
- Different listing treatment — more compact or visually distinct from Experience
- Clean, minimal presentation

**Animations:**
- Subtle scroll reveals

---

### 4.6 Clients

**Content:** Same as V1 — logos of Brazilian and international brands.

**Layout changes:**
- Modern grid alignment
- Same objective: showcase client logos
- Visual refinement — spacing, sizing, possible hover treatments

**Animations:**
- Logo grid entrance animation
- Hover states on logos

---

### 4.7 Philosophy

**Content:** Same as V1 — design principles, approach to product and teams.

**Layout changes:**
- Article-style layout — favor long-form reading
- Better typographic hierarchy: pull quotes, section breaks, generous line height
- Should feel like reading a well-typeset article or essay

**Animations:**
- Scroll reveals for paragraphs/sections
- Pull quote entrance animations

---

### 4.8 Contact

**Content:** Migrated into the Footer (section 4.10). The contact form, social links, and all contact functionality now live inside the expandable footer.

**Menu integration:** "Contact" remains as an item in the CLI Menu. Clicking it expands the footer to reveal the contact form — same destination, different mechanism.

**Functionality preserved:** Form submission (Resend), validation, toast feedback — all unchanged.

---

### 4.9 Project Pages (Template System)

**Route:** `/projects/[slug]`

**Architecture:** Data-driven template. Each project defines its page via a `sections[]` array in `en.json`. The shell (`ProjectPageShell`) iterates the array and dispatches each entry to its block component. All blocks are optional — a project with only `hero` + `impact` works just as well as one with all 7 blocks.

**Principle:** Any system-level adjustment (animation, spacing, alignment, loading) made to a block component propagates to every project that uses it. Content varies per project; behavior is shared.

#### Page Structure

```
Shell (fixed)
├── sections[0] → SectionBlock dispatcher
├── ProjectNavigation (fixed, sticky top — NOT a block)
├── sections[1..n] → SectionBlock dispatcher
└── ProjectNavigation (fixed, bottom — NOT a block)
```

`ProjectNavigation` is page infrastructure (prev/next + keyboard nav), not a block. It renders at fixed positions regardless of section composition.

#### Block Catalog

All blocks are optional. Order in `sections[]` = order on page.

##### 1. `hero`
Project introduction with stamp, technologies, description, and hero image.

| Field | Type | Required | Notes |
|-------|------|----------|-------|
| `body` | string | no | Large display description (48px Fabio XM) |

Additional data pulled from `project.*` (not from the section object):
- `project.title` → sr-only h1
- `project.year` → stamp (`PRJ_2022 // 001`)
- `project.technologies` → left column
- `project.images[0]` → hero image (eager loaded, rounded corners)
- `project.colors` → noise gradient background (3 hex values, optional — if absent, image renders without gradient)

Hero image is part of this block (not a separate component). If `project.images[0]` is missing, only the text renders.

Noise gradient: R3F Canvas, client-only lazy import, `dpr=1`, Perlin noise GLSL. Scroll-linked polygon expand via `useScrollExpand`. Only renders when `project.colors` is defined.

##### 2. `challenge`
Two-column text block with customizable headings. Default headings: "Challenge" / "Solution".

| Field | Type | Required | Notes |
|-------|------|----------|-------|
| `heading` | string | no | Left column heading (default: "Challenge") |
| `body` | string | no | Left column text |
| `solutionHeading` | string | no | Right column heading (default: "Solution") |
| `solution` | string | no | Right column text |

Layout: 4-4-4 grid (text-text-empty). Each column renders independently — if only `body` is provided, only the left column appears.

##### 3. `impact`
Stats/metrics grid with large numbers and labels.

| Field | Type | Required | Notes |
|-------|------|----------|-------|
| `stats` | `{ value: string, label: string }[]` | no | Dynamic column spanning based on count |

If `stats` is empty or missing, block does not render. Stats distributed across 9 cols (3-col left spacer). Column span adapts: 2 stats = 4-col each, 3 stats = 3-col each.

##### 4. `gallery-staggered`
Images in alternating stagger positions with scroll-reveal animation.

| Field | Type | Required | Notes |
|-------|------|----------|-------|
| `rows` | `{ images: string[] }[]` | no | All images flattened into stagger pattern |

Stagger pattern cycles: center → right → center → left. Each image occupies 4 cols in a 12-col grid. Scroll-linked `clip-path: inset()` reveal via `useScrollReveal`.

If `rows` is empty or missing, block does not render.

##### 5. `gallery-feature-list`
Feature showcase: name + media + description per row.

| Field | Type | Required | Notes |
|-------|------|----------|-------|
| `features` | `{ name, image, description }[]` | no | Each feature is a full-width row |

Layout per feature: 4-5-3 grid (name+title, media, description). Media supports `image`, `video` (YouTube/Vimeo), and `figma` (embed URL). Scroll-reveal + parallax on images.

If `features` is empty or missing, block does not render.

##### 6. `gallery-full-detail`
Large image with optional text sidebar.

| Field | Type | Required | Notes |
|-------|------|----------|-------|
| `image` | `ProjectImage` | no | If missing, block does not render |
| `heading` | string | no | Sidebar heading |
| `description` | string | no | Sidebar text |
| `layout` | `'4-8'` \| `'8-4'` | no | Text-image or image-text (default: `'4-8'`) |

Scroll-reveal on the image. If no `heading` and no `description`, image renders full-width without sidebar.

##### 7. `info`
Project metadata footer: role, year, technologies, credits, links.

| Field | Type | Required | Notes |
|-------|------|----------|-------|
| (none) | — | — | All data pulled from `project.*` |

Layout: 3-3-3-3 grid (project details, technologies, credits, links). Each column gracefully shows "—" when data is missing. Credits support optional `role` and `url` (LinkedIn etc.). Links show external link icon.

This block typically goes last but can be positioned anywhere in `sections[]`.

#### Shared Behaviors (propagate to all blocks)

- **Entrance animations:** CSS classes `-entrance -fade`, `-entrance -slide-up`, `-entrance -scale-in` triggered by `useInView` (IntersectionObserver)
- **Stagger:** `-a-0` through `-a-20` (70ms per index + 150ms base)
- **Scroll reveal:** `useScrollReveal` — `clip-path: inset()` driven by scroll position via rAF
- **Scroll expand:** `useScrollExpand` — polygon clip-path with distorted corners (hero only)
- **Grid:** 12-col system via `Grid`/`GridItem` components
- **Semantic tokens:** All colors via `text-text-*`, `bg-bg-*` etc.
- **`prefers-reduced-motion`:** All motion disabled — instant positions, no parallax
- **Loading:** Hero image `eager`, all others `lazy`

#### Resilience Rules

1. If a block's required data is missing/empty, the block returns `null` — no crash, no empty wrapper
2. A project with `sections: []` renders only the fixed navigation — valid but empty
3. New block types can be added to the catalog without touching existing projects
4. Block order in `sections[]` is respected exactly — no implicit ordering

**Shareability:**
- Dedicated URL per project for social sharing
- OG metadata per project page (title, description, image)

---

### 4.10 Footer (NEW)

**Visibility:** All pages (home + project pages).

**Closed state (default):**
- Minimalista — project tech stack (Next.js, React, Tailwind...), copyright notice
- Primary "Contact" button — prominent, invites interaction

**Expanded state:**
- Triggered by clicking the Contact button (or selecting Contact from CLI Menu)
- Expands **upward**, revealing the contact form (Resend) + social links
- Same content and functionality as V1's Contact section, adapted to V2 visual identity
- Form submission, inline validation, toast feedback — all preserved

**Animations:**
- Expand/collapse transition upward (timing/easing TBD)
- Form field focus states
- Submit button interaction
- Success/error state transitions

---

## 5. Navigation

### Global Navigation
- Same structure as V1 — navigation lives within section context, no fixed header
- NavigationBar component will be shared across main sections AND project pages
- On project pages: includes back-to-home + prev/next project links
- Keyboard navigation preserved across all views

### Routing Architecture
```
/                           → Home (Intro + Menu + Project Highlights)
/projects/[slug]            → Individual project page
/llms.txt                   → LLM index
/llms-full.txt              → LLM full content
/llms-pt.txt                → LLM PT-BR
/llms/projects/[slug].txt   → LLM project case study EN
/llms/projects/[slug]-pt.txt → LLM project case study PT-BR
/api/contact                → Contact form endpoint (serverless)
/api/llms                   → LLM JSON/markdown API
```

### Section Navigation (unchanged)
- Sections render client-side based on NavigationProvider state
- CLI Menu with type-to-filter
- Keyboard: arrow keys, Enter, Esc
- Mouse/touch: click/tap

---

## 6. Performance Constraints

- No WebGL, no 3D, no heavy canvas effects
- Animations via CSS transitions/animations + Motion library (JS)
- All animations must be fast — content access is never delayed
- Pages are statically generated where possible; `/api/contact` runs as Vercel serverless function
- Image optimization strategy for project pages (responsive images, lazy loading)
- Bundle size monitoring — animation library additions should not bloat the build
- `prefers-reduced-motion`: all animations must respect this media query — users who opt out get instant state changes with no motion

---

## 7. Content & Copy

- **Tone of voice:** Unchanged — same brand voice, same copy approach
- **i18n:** Same dual-language approach (EN + PT-BR), client-side switching
- **LLM strategy:** Maintained — all existing LLM routes evolve with V2 content
- **Project content:** Initially reuses V1 case study content, expanded incrementally

---

## 8. Responsive Behavior

- **Breakpoints:** Follow Tailwind defaults (sm: 640px, md: 768px, lg: 1024px, xl: 1280px) — same as V1
- **Home intro:** Stacks vertically on mobile (logo top, display text, CTA + lang toggle below)
- **Home 2x2 project grid:** Becomes single column on mobile (4 stacked cards)
- **CLI Menu:** Preserved on all breakpoints — keyboard navigation on desktop, tap on touch
- **Experience expandable:** Expand mechanism adapts to viewport (full-width on mobile regardless of desktop treatment)
- **Project pages:** Single column on mobile, alternating grid on desktop
- **Philosophy article layout:** Full-width with comfortable reading measure on all breakpoints

---

## 9. Accessibility

- **`prefers-reduced-motion`:** All animations disabled or reduced to instant transitions
- **Keyboard focus indicators:** Visible, high-contrast focus rings on all interactive elements — critical since keyboard navigation is a core feature
- **ARIA:** CLI menu, expandable experience items, and project navigation use appropriate ARIA roles and states
- **Color contrast:** New palette must meet WCAG AA minimum (4.5:1 for body text, 3:1 for large text)
- **Skip links:** Preserved from V1

---

## 10. Error States

- **404 for `/projects/[slug]`:** Custom not-found page consistent with V2 visual identity, with link back to home
- **Contact form errors:** Inline validation + toast for submission failures (network, server errors)
- **Contact form success:** Toast confirmation + form reset
- **Loading states:** Page transitions include a minimal loading indicator if content takes time to render

---

## 11. Open Items

### Resolved (this session)
- ~~**Typography selection**~~ → Pexel Grotesk (display) + Fabio XM (structural) as candidates. Final selection after Stitch testing.
- ~~**Color palette**~~ → Yellow primary, dark base, neutral complementary. Direction set, exact tokens refined in Stitch.
- ~~**Animation style**~~ → Mixed: structural elements fast/dry, hero/featured elements more elaborate. Details per section.
- ~~**Project card design**~~ → 50/50 grid, title top-left, arrow button, contrast with intro. Figma refs linked.
- ~~**Contact section**~~ → Migrated into expandable Footer (4.10).

### Still Open
1. **Typography final selection** — Pexel Grotesk vs Fabio XM (or both with different roles) — decided after Stitch testing
2. **Color exact tokens** — refined in Stitch from yellow/dark/neutral direction
3. **Animation timing/easing per section** — defined after section details are finalized
4. **Experience expand mechanism** — accordion, lateral panel, or other
5. **Skills visual treatment** — keep list, switch to tags, bars, or grid
6. **Detailed spacing/grid system** — column count, gutters, breakpoints
7. **Menu hover preview details** — exact preview content per section, animation style
8. **Footer expand animation** — timing, easing, height behavior

### Next Step
Visual validation in Google Stitch — generate Home screens (Intro, Menu, Projects, Footer) from this spec, extract tokens, validate layout decisions.
