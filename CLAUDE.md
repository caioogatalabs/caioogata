<!-- GSD:project-start source:PROJECT.md -->
## Project

**Portfolio V2 — Caio Ogata**

Evolution of caioogata.com portfolio from V1 (CLI-inspired monospace) to V2 (Architectural Brutalism). Same content, same tone, but with refined typography (Epilogue), brutalista/minimalist aesthetic, rich micro-interactions, dedicated project pages, and a token-first design system. Target: design directors, engineering managers, and recruiters evaluating senior design/engineering leadership.

**Core Value:** The portfolio must communicate design engineering credibility through its own craft — the UI itself is the strongest portfolio piece.

### Constraints

- **Stack**: Next.js 15 (App Router) + React 19 + Tailwind v4 + pnpm + Vercel
- **Export**: Static export in production (`output: 'export'`) — no server-side features in pages
- **Performance**: CSS/JS animations only, `prefers-reduced-motion` respected. Exception: R3F WebGL for project hero noise gradient (lazy-loaded, client-only, `dpr=1`)
- **Font**: Epilogue + JetBrains Mono (self-hosted woff2 variable). Verify license before production.
- **Grid**: 12-column system, all layouts use column spans (6-6, 4-4-4, 3-6-3, 2-8-2)
- **Radius**: 12px default for components, 999px for pill buttons, 0px eliminated
- **Shadows**: None — depth via tonal stacking only (Design.md rule)
- **Color**: 60-30-10 distribution — neutrals 60%, surfaces 30%, brand/accent 10%
<!-- GSD:project-end -->

<!-- GSD:stack-start source:STACK.md -->
## Technology Stack

- **Framework**: Next.js 15 (App Router) + React 19
- **Styling**: Tailwind CSS v4 with `@theme` (semantic tokens in `src/tokens/`)
- **Fonts**: Epilogue (variable, 100-900) as `--font-sans`, JetBrains Mono (variable, 100-800) as `--font-mono`
- **Package manager**: pnpm
- **Hosting**: Vercel (static export in production)
- **Animation**: CSS-first (no runtime library) — `requestAnimationFrame` for cursor-follow and scroll-linked reveals. Three.js/R3F for project hero noise gradient (client-only lazy load)
- **Contact**: Resend API via `/api/contact`
- **Analytics**: Vercel Analytics + Speed Insights + Microsoft Clarity
<!-- GSD:stack-end -->

<!-- GSD:conventions-start source:CONVENTIONS.md -->
## Conventions

### Animation System

- **Easing tokens**: `--ease-out` (0.22,0.31,0,1) for entrances, `--ease-in` (0.69,0,0,1) for exits, `--ease-smooth` (0.5,0,0.3,1) for micro-interactions, `--ease-fiddle` (0.16,1,0.3,1) for the project's signature deceleration curve (text reveals + preview expand)
- **Entrance system**: CSS classes `-entrance -slide-up`, `-entrance -fade`, `-entrance -scale-in`, `-entrance -mask-down`, `-entrance -mask-right`, `-entrance -line-x` triggered by `-inview` class (IntersectionObserver via `useInView` hook). Parent `-inview` propagates to descendant `-entrance` children.
- **Stagger**: `-a-0` through `-a-20`, 70ms per index + 150ms base offset. Modifier `.-flow` overrides the cadence to a reading-pace ~150-180ms per step, used inside text blocks where grid speed feels too fast.
- **Loading gate**: `html.-loaded.-ready` required before any entrance fires. Set by inline `<script>` in `<head>` (not React hook — survives hydration).

### Motion Text Reveal (`SplitText`)

Text reveal system built on `motion` (motion.dev, ~22 KB gzipped). Single component: [`src/components/motion/SplitText.tsx`](src/components/motion/SplitText.tsx). Used wherever copy benefits from a deliberate entrance — supersedes the CSS `-entrance` variants for editorial text. The CSS variants remain in use for grid/UI items (logos, etc).

**Two patterns** (selected via `type` prop):

- **`type="line"`** — line-by-line mask reveal. After layout, the component clones the rendered element (preserves font axes, letter-spacing, text-indent), splits text into words, groups by `offsetTop`, and renders each detected line wrapped in `<span overflow:hidden>` with an inner `motion.span` that translates from `y: 110% → 0%`. Per-line `staggerMs` between lines. Use for: hero / display copy, section kickers (`1.1 / Bio`, etc), Bio middle paragraphs, final quote, large statements. Honors `text-indent` on the parent — extracts it from style and applies as `padding-left` to the first line span only (otherwise inheritance would indent every line).
- **`type="word"`** — whole-block opacity fade. Renders the text as a single `motion.span` with `opacity: 0 → 1`. No splitting, no transform. Use for: short titles, body text where word-by-word stagger competes with reading. (`staggerMs` is ignored in this mode.)

**Trigger position** — when in scroll the animation fires:
- `amount` (default `0.2`) — fraction of the element's own height that must be visible. `0.1` = peeks in; `0.5` = half visible.
- `viewportMargin` (default `"0px 0px -20% 0px"`) — `IntersectionObserver` rootMargin in `top right bottom left` order. The default shrinks the bottom of the viewport by 20vh, so text fires when it's clearly in scene (~70vh from the top), not when it just touches the bottom edge. Combine with `amount` for vh-anchored triggering.

**Synchronizing groups** — when multiple text elements in the same visual block (e.g., institution + degree of an Education row, or kicker + items of a Core Expertise list) should enter on the same beat, wrap them in `<RevealGroup>` (exported from the same file). The group owns one `useInView` and broadcasts the in-view boolean to descendant `<SplitText>` via React context.

```tsx
<RevealGroup as="div" className="...">
  <SplitText type="line" as="span" text="Core Expertise" baseDelayMs={100} />
  {items.map((item, i) => (
    <SplitText type="word" text={item} baseDelayMs={250 + i * 60} />
  ))}
</RevealGroup>
```

For mixed content (SplitText + plain `motion.span`/`motion.p` for metadata like year, location), use `useInView` directly on the parent ref and pass the boolean: `<SplitText inView={inView} />` plus `<motion.p animate={inView ? ... : ...} />`. See `EducationBlock.tsx` for the canonical example.

Priority for resolving in-view inside `<SplitText>`: explicit `inView` prop > `<RevealGroup>` context > internal observer.

**Defaults** (override per call site):
- `durationMs`: `700` (word) / `900` (line)
- `baseDelayMs`: `100`
- `staggerMs`: `100` (line only)
- `easing`: `cubic-bezier(0.16, 1, 0.3, 1)` (`--ease-fiddle`)
- `as`: `'p'` — set to `'span'` for inline kickers, `'h3'` for headings, etc.
- `once`: `true` — fires once per page load

**`prefers-reduced-motion`**: handled at the framework level — Motion respects the media query and collapses transforms. The CSS reduced-motion override at `globals.css:354` also forces `clip-path: inset(0)` on the legacy `-entrance` variants.

**Where it's applied** (`/about` only as of 2026-05-02):
- AboutPinned hero paragraph: `type="line"`
- BioBlock kicker `1.1 / Bio`: `type="line" as="span"`
- BioBlock `Core Expertise` kicker: `type="line" as="span"`
- BioBlock 7 Core Expertise items: `type="word"` (one per item)
- BioBlock 3 middle paragraphs: `type="line"`
- BioBlock final quote: `type="line"`
- SkillsBlock kicker `1.2 / Skills`: `type="line" as="span"`
- SkillsBlock 6 category titles: `type="word" as="span"`
- ClientsBlock kicker `1.3 / Notable Clients`: `type="line" as="span"`
- ClientsBlock shortDescription: `type="line"`
- EducationBlock kicker `1.4 / Education`: `type="line" as="span"`
- EducationBlock 5 institution names: `type="word" as="h3"` (synced per entry)
- EducationBlock 5 degrees: `type="word"` (synced per entry)
- EducationBlock 5 entries: each entry uses `useInView` on the row wrapper to sync year + h3 + degree p + location + note as one beat
- BioBlock Core Expertise: kicker + 7 items wrapped in `<RevealGroup>` so the whole list enters together with cascading `baseDelayMs`

The 16 ClientsBlock logos remain on the legacy CSS `-entrance -fade` system with grid-cadence stagger (70ms) — they're true grid items, not editorial text.

### Interaction Patterns (reference: fiddle.digital)

- **Primary easing**: `cubic-bezier(0.16, 1, 0.3, 1)` — strong deceleration at end, used for text reveals and preview expand
- **List hover**: Yellow bar (66.66% width, bleeds -5px vertical), masked text clip reveal on label AND description (1.0s ease-out), duplicate text enters at 2xl/1.5rem bold. Display-size arrow `→` (3.5rem JetBrains Mono) expands before label. Bar 0.6s entry, 0.5s exit.
- **Floating preview**: rAF lerp loop (factor 0.12) for elastic cursor follow. Skew on both axes from lerped velocity delta (±30° clamp). Entry: wrapper scale 0.5→1 (0.6s), inner image scale 3→1.25 zoom reveal (0.7s). `key={imageSrc}` remounts on row switch — re-triggers expand from center. Sharp corners (0px radius). Parallax via inverse velocity translate.
- **All interactions must have keyboard parity** — if it works on hover, it must work on arrow key navigation.
- **Scroll-linked reveal** (`useScrollReveal` hook): `clip-path: inset()` with `round 12px` driven by scroll position via rAF. Reveals top→bottom as element scrolls into view. `startFraction` (0.85) = viewport Y where reveal begins, `endFraction` (0.3) = where it completes. Returns `{ ref, clipPath }` as React state — clipPath applied via `style` prop. Used by `ProjectCard`. Reference: fiddle.digital canvas section.
- **Scroll-linked expand** (`useScrollExpand` hook): `clip-path: polygon()` with distorted corners driven by scroll position via rAF. Expands from small center-bottom shape to full rect. Each polygon vertex has independent easing (power curve) for organic distortion — bottom corners arrive first, top-left arrives last. `startFraction` (0.95) = viewport Y where expand begins, `endFraction` (0.1) = where it completes. Returns `{ ref, clipPath, opacity }`. Used by `ProjectHeroImage` noise gradient background. Bottom Y is always 100% to prevent bottom clipping. Reference: fiddle.digital `.preview-bg`.
- **`prefers-reduced-motion`**: All motion disabled — instant positions, zero skew, zero parallax.

### Noise Gradient Background (Project Hero)

3D Perlin noise gradient behind project hero images. Only renders when `ProjectItem.colors` (3 hex colors) is defined — backward compatible.

**Architecture — layered composition:**
```
div.relative (expandRef — measures scroll position)
├── div.absolute.inset-0 (clip-path + opacity from useScrollExpand) ← only BG expands
│   └── NoiseGradientCanvas (R3F Canvas, absolute inset-0)
│       └── NoiseGradient mesh (planeGeometry 10x6, auto-scaled to viewport)
└── div.relative.z-10.mx-auto.w-[75%].py-[12%] (image) ← always visible, no clip
```

**Critical rules (learned from debugging):**
- **Client-only import**: Three.js CANNOT be imported at module level. Use `useEffect` + dynamic `import()` pattern (`ClientNoiseGradient` wrapper), NOT `next/dynamic` (fails silently in static export) or `React.lazy` (breaks SSR in App Router).
- **Canvas sizing**: R3F Canvas must have `position: absolute; inset: 0` set in the wrapper div's `style` prop (not just className). The mesh uses `useThree().viewport` to auto-scale the plane geometry to fill the canvas — never hardcode zoom values.
- **No `overflow-hidden` on gradient wrapper**: The clip-path polygon controls the shape. Adding `overflow-hidden` clips the expanding polygon and causes visual cuts at edges.
- **Clip-path on gradient only**: The `clipPath` and `opacity` from `useScrollExpand` go on the gradient wrapper div, NOT on the outer container. The image must always be visible without clipping.
- **Bottom Y always 100%**: In the polygon clip-path, bottom corners must have Y=100% at all states. Animating bottom Y causes visible clipping at the bottom edge.
- **`transpilePackages` not needed**: Three.js works without `transpilePackages` in next.config. Adding it causes extremely slow dev server startup (minutes). Don't add it.
- **Container height = image padding**: The gradient background height is determined by the image wrapper's padding (`py-[12%]`). Increase padding to give more visible gradient area around the image.

**Performance budget:**
- Geometry: `planeGeometry(10, 6, 48, 48)` — 2,304 vertices
- Material: `THREE.ShaderMaterial` (raw GLSL, no PBR, no lights)
- Canvas: `dpr={1}`, `antialias: false`, `alpha: false`
- Animation: `uTime += delta * 0.15` (slow breathing)
- `prefers-reduced-motion`: `frameloop="demand"` + `paused=true` (renders 1 frame)

**Files:**
- `src/components/three/shaders/noise.glsl.ts` — Perlin noise GLSL (vertex + fragment)
- `src/components/three/NoiseGradient.tsx` — R3F mesh with ShaderMaterial
- `src/components/three/NoiseGradientCanvas.tsx` — Canvas wrapper with reduced-motion
- `src/hooks/useScrollExpand.ts` — Scroll-linked polygon expand

### Gallery Staggered Pattern

Span-aware row grid for project image galleries. Each row is a 12-col CSS grid; `spans[]` controls column widths. The design goal is **breathing room** — avoid filling every row to 12 columns.

**Data model** (`GalleryRow` in `src/content/types.ts`):
```typescript
{ spans: number[], images: (string | ProjectImage)[], colStart?: number }
```

**Default pattern — scattered single-image rows (Brand System pattern):**
The DEFAULT staggered layout is single-image rows of `[4]` with `colStart` cycling across `1`, `5`, `9` to scatter content across the three zones of the 12-col grid (cols 1-4, 5-8, 9-12). Reference: `azion-brand-system` gallery — 9 illustrations each in a `[4]` row with rotating `colStart`. Prioritize zones 2 and 3 (`colStart: 5` and `colStart: 9`) for the scattered, randomic feel.

Multi-image rows (`[6,6]`, `[8,4]`, `[4,8]`, `[4,4]`) and full-width rows (`[12]`) are EXCEPTIONS and require explicit justification:
- **Image pair belongs together** (e.g., before/after, two views of same artifact) → `[8,4]` or `[4,8]`
- **Hero shot at top of gallery** → `[12]`
- **Wide horizontal asset** (banners, strips) → `[12]` or `[8]`
- **Explicit user request** for a specific layout

**Span rules when justified — for non-default rows:**
- **Asymmetric pairs** over symmetric: prefer `[8,4]` or `[4,8]` over `[6,6]`. Alternating asymmetry creates visual rhythm.
- **Partial rows for air**: `[4,4]` (8/12), `[8]` (8/12), `[6]` (6/12) leave empty grid space. At least 30% of rows in a gallery should be partial.
- **Never three consecutive full rows**: If row N and N+1 both sum to 12, row N+2 must be partial.
- **`colStart` field**: Optional 1-based column start for first image only, desktop only (mobile stacks full-width). Values: `1`, `5`, `9` for thirds.
- **Videos**: Pair into `[6,6]` rows (default `[4]` is too small for video). For solo hero videos, use `[8]` with `colStart: 5` to focus on zones 2-3.

**Sizing:**
- Images: `w-full max-h-[500px] min-h-[200px] object-cover` — natural aspect within bounds
- Sharp corners (0px radius) on all gallery images
- Gaps: `gap-x-[4px]` within rows, `gap-y-[8px]` between rows

**Stagger animation:** Each image in a multi-image row gets `startFraction: 0.85 + staggerIndex * 0.03` for left-to-right scroll-reveal wave.

**Component:** `src/components/sections/v2/project/ProjectGalleryStaggered.tsx`
**Static class maps:** `DESKTOP_SPAN`, `TABLET_SPAN`, `MOBILE_SPAN`, `COL_START` — never use dynamic template literals.

### Video Background Overlay Pattern

When using video (or any media) as a hero background with text overlaid, always add a `bg-bg` overlay div between the canvas/media and the text content, set to **70% opacity**. This ensures text readability across all frames while preserving the video atmosphere.

```
canvas/media (absolute inset-0)
├── div.absolute.inset-0.bg-bg  style={{ opacity: 0.7 }}   ← overlay
└── div.relative.z-10 (text content)
```

- **Token**: `bg-bg` — adapts automatically to dark/light/inverse themes
- **Opacity**: `0.7` (70%) — validated value; lower values compromise readability
- **Position**: absolute inset-0, between media and content (no z-index needed, DOM order suffices)
- **Never use `overflow-hidden` on the overlay** — it's sized by `inset-0`, not overflow

### Intro / Hero Section

Three-fragment structure inside a single `bg-bg-surface-secondary` wrapper div:

```
div.bg-bg-surface-secondary          ← continuous background
├── section (welcome bar)            ← large pb (pb-32/40/48) creates hero spacing
├── div.sticky.top-0.z-50 (logo+CTA) ← transparent, sticks on scroll
└── div (headline + inline tags)
```

**Critical rules (learned from debugging):**
- **Fragment split for sticky**: The logo+CTA bar must be a sibling of the sections (not nested inside a bounded section) for `position: sticky` to work across the full page scroll. A single `<section min-h-600px>` wrapper kills sticky once the section scrolls away.
- **Wrapper provides background**: The sticky bar itself has NO background. The parent wrapper div with `bg-bg-surface-secondary` provides the continuous color. This prevents visible bg flash on stick/unstick transitions.
- **No `overflow-hidden` on wrapper**: Breaks `position: sticky`.
- **Separate `useInView` per fragment**: Each fragment needs its own `useInView` ref for entrance animations, since `-inview` only propagates to *descendants* of the observed element, not siblings.
- **No glassmorphism header**: The old `StickyHeader` component (glassmorphism backdrop-blur bar) is replaced by the inline sticky logo+CTA row. `StickyHeader.tsx` still exists but is NOT imported.
- **Welcome bar text**: Split into separate word groups with `<br/>` line breaks matching Figma layout: "Welcome/to", "caioogata", "portfolio & website" (left), "V2./0.12" (center), "Built for human/and AI assistance" (right). Font: Epilogue Semibold 12px, line-height 1.2, opacity 50%.

### Button Hover Patterns

Two distinct hover patterns, both using masked vertical text swap (Epilogue → JetBrains Mono via .type-overlay-hover):

**Primary** (font swap only):
- Default text exits up: `transform 1s ease, opacity 0.3s ease`. No delay.
- Hover text enters from below: same timing. Composition icon +0.1s delay.
- Easing: `cubic-bezier(0.16, 1, 0.3, 1)`. Exit delay: 0.06s.

**Secondary** (fill reveal + font swap):
- Expanding fill: `translateY(100%) → translateY(0)`, 0.2s ease, `overflow-hidden` on button.
- Default text exits: 0.4s at 0.05s delay (before fill completes).
- Hover text enters: 1s at 0.1s delay (overlaps with fill completion).
- Color via React state (not CSS hover) — enables group hover on compositions.
- Composition icon: fill +0.1s, text +0.1s extra.
- Fill tokens: `bg-fill-outline-hover` (bg) + `text-on-outline-hover` (text). Dark=light fill/dark text, Light=dark fill/light text, Inverse=light fill/dark text.

### Component Patterns

- **Full-width sections**: Use direct `px-5 md:px-8 lg:px-16` padding (64px desktop). Grid component (`Grid`/`GridItem`) only where 12-col alignment is needed.
- **GridItem**: Uses static Tailwind class maps (not dynamic template literals) — `MOBILE_SPAN`, `TABLET_SPAN`, `DESKTOP_SPAN` lookup objects.
- **Semantic tokens**: Always use `text-text-primary`, `bg-bg-surface-primary` etc. Never raw hex or oklch in components.
- **Font family**: `style={{ fontFamily: 'var(--font-sans)' }}` for Epilogue display text, `font-mono` class for JetBrains Mono. For the masked vertical text-swap on button hover, use the `.type-overlay-hover` utility class instead of inline `fontFamily`.
<!-- GSD:conventions-end -->

<!-- GSD:architecture-start source:ARCHITECTURE.md -->
## Architecture

### V2 Component Structure

```
src/app/page.tsx                      → Home (SkipLink + PageShell)
src/components/layout/PageShell.tsx   → Orchestrates V2 sections, runs useFontReady
src/components/layout/Grid.tsx        → 12-col responsive grid (Grid + GridItem)
src/components/sections/v2/
  IntroSection.tsx                    → Hero: welcome bar + sticky logo/CTA + headline (3 fragments in bg wrapper)
  StickyHeader.tsx                    → (legacy, not imported) Glassmorphism bar
  MenuSection.tsx                     → CLI menu with fiddle-style hover + FloatingPreview
  FloatingPreview.tsx                 → Elastic cursor-follow image (rAF lerp)
  ProjectsGrid.tsx                    → 2x2 flex grid with ProjectCard
  ProjectCard.tsx                     → Card with data-stamp + arrow button + scroll-linked reveal
  FooterSection.tsx                   → Expandable contact + tech tags
  ContactForm.tsx                     → Underline-input form with validation
src/hooks/
  useInView.ts                        → IntersectionObserver → adds -inview class
  useFontReady.ts                     → document.fonts.ready → -loaded/-ready (backup, layout.tsx has inline script)
  useMenuNavigation.ts                → Keyboard nav (arrows/enter/esc) + type-to-filter
  useScrollReveal.ts                  → Scroll-linked clip-path reveal (rAF + React state)
  useScrollExpand.ts                  → Scroll-linked polygon expand (distorted corners, rAF)
src/components/three/
  shaders/noise.glsl.ts               → Perlin noise GLSL vertex + fragment shaders
  NoiseGradient.tsx                    → R3F mesh (auto-scales to viewport)
  NoiseGradientCanvas.tsx              → R3F Canvas wrapper (client-only, reduced-motion)
src/tokens/
  primitives.css                      → Raw OKLCH values (:root)
  semantic.css                        → Purpose-driven tokens (@theme for Tailwind v4)
```

### Token Flow

`primitives.css` → `semantic.css` (@theme) → Tailwind utility classes → Components

### Section Theming

Three modes via `data-theme` attribute on section container — all semantic tokens remap automatically:
- **Dark (default):** no attribute needed
- **Light:** `data-theme="light"` — grey bg (neutral-200, 0.65), dark text/borders. NOT white.
- **Inverse:** `data-theme="inverse"` — brand yellow bg, dark brand text

Yellow primary button (`bg-fill-primary` + `text-on-primary`) stays stable across Dark and Light. Only Inverse overrides it. Never hardcode inverted colors — use `data-theme` on the container.
<!-- GSD:architecture-end -->

<!-- GSD:workflow-start source:GSD defaults -->
## GSD Workflow Enforcement

Before using Edit, Write, or other file-changing tools, start work through a GSD command so planning artifacts and execution context stay in sync.

Use these entry points:
- `/gsd:quick` for small fixes, doc updates, and ad-hoc tasks
- `/gsd:debug` for investigation and bug fixing
- `/gsd:execute-phase` for planned phase work

Do not make direct repo edits outside a GSD workflow unless the user explicitly asks to bypass it.
<!-- GSD:workflow-end -->



<!-- GSD:profile-start -->
## Developer Profile

> Profile not yet configured. Run `/gsd:profile-user` to generate your developer profile.
> This section is managed by `generate-claude-profile` -- do not edit manually.
<!-- GSD:profile-end -->
