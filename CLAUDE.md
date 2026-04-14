<!-- GSD:project-start source:PROJECT.md -->
## Project

**Portfolio V2 — Caio Ogata**

Evolution of caioogata.com portfolio from V1 (CLI-inspired monospace) to V2 (Architectural Brutalism). Same content, same tone, but with refined typography (Fabio XM), brutalista/minimalist aesthetic, rich micro-interactions, dedicated project pages, and a token-first design system. Target: design directors, engineering managers, and recruiters evaluating senior design/engineering leadership.

**Core Value:** The portfolio must communicate design engineering credibility through its own craft — the UI itself is the strongest portfolio piece.

### Constraints

- **Stack**: Next.js 15 (App Router) + React 19 + Tailwind v4 + pnpm + Vercel
- **Export**: Static export in production (`output: 'export'`) — no server-side features in pages
- **Performance**: CSS/JS animations only, `prefers-reduced-motion` respected. Exception: R3F WebGL for project hero noise gradient (lazy-loaded, client-only, `dpr=1`)
- **Font**: Fabio XM is trial version — display use only, verify license before production
- **Grid**: 12-column system, all layouts use column spans (6-6, 4-4-4, 3-6-3, 2-8-2)
- **Radius**: 12px default for components, 999px for pill buttons, 0px eliminated
- **Shadows**: None — depth via tonal stacking only (Design.md rule)
- **Color**: 60-30-10 distribution — neutrals 60%, surfaces 30%, brand/accent 10%
<!-- GSD:project-end -->

<!-- GSD:stack-start source:STACK.md -->
## Technology Stack

- **Framework**: Next.js 15 (App Router) + React 19
- **Styling**: Tailwind CSS v4 with `@theme` (semantic tokens in `src/tokens/`)
- **Fonts**: Fabio XM (variable, 300-900) as `--font-sans`, Cascadia Mono as `--font-mono`
- **Package manager**: pnpm
- **Hosting**: Vercel (static export in production)
- **Animation**: CSS-first (no runtime library) — `requestAnimationFrame` for cursor-follow and scroll-linked reveals. Three.js/R3F for project hero noise gradient (client-only lazy load)
- **Contact**: Resend API via `/api/contact`
- **Analytics**: Vercel Analytics + Speed Insights + Microsoft Clarity
<!-- GSD:stack-end -->

<!-- GSD:conventions-start source:CONVENTIONS.md -->
## Conventions

### Animation System

- **Easing tokens**: `--ease-out` (0.22,0.31,0,1) for entrances, `--ease-in` (0.69,0,0,1) for exits, `--ease-smooth` (0.5,0,0.3,1) for micro-interactions
- **Entrance system**: CSS classes `-entrance -slide-up`, `-entrance -fade`, `-entrance -scale-in` triggered by `-inview` class (IntersectionObserver via `useInView` hook). Parent `-inview` propagates to descendant `-entrance` children.
- **Stagger**: `-a-0` through `-a-20`, 70ms per index + 150ms base offset
- **Loading gate**: `html.-loaded.-ready` required before any entrance fires. Set by inline `<script>` in `<head>` (not React hook — survives hydration).

### Interaction Patterns (reference: fiddle.digital)

- **Primary easing**: `cubic-bezier(0.16, 1, 0.3, 1)` — strong deceleration at end, used for text reveals and preview expand
- **List hover**: Yellow bar (66.66% width, bleeds -5px vertical), masked text clip reveal on label AND description (1.0s ease-out), duplicate text enters at 2xl/1.5rem bold. Display-size arrow `→` (3.5rem Fabio XM) expands before label. Bar 0.6s entry, 0.5s exit.
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
- **Welcome bar text**: Split into separate word groups with `<br/>` line breaks matching Figma layout: "Welcome/to", "caioogata", "portfolio & website" (left), "V2./0.12" (center), "Built for human/and AI assistance" (right). Font: Fabio XM Semibold 12px, line-height 1.2, opacity 50%.

### Button Hover Patterns

Two distinct hover patterns, both using masked vertical text swap (Fabio XM → Pexel Grotesk 1.5rem):

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
- **Font family**: `style={{ fontFamily: 'var(--font-sans)' }}` for Fabio XM display text, `font-mono` class for Cascadia Mono.
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
