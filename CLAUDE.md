<!-- GSD:project-start source:PROJECT.md -->
## Project

**Portfolio V2 — Caio Ogata**

Evolution of caioogata.com portfolio from V1 (CLI-inspired monospace) to V2 (Architectural Brutalism). Same content, same tone, but with refined typography (Fabio XM), brutalista/minimalist aesthetic, rich micro-interactions, dedicated project pages, and a token-first design system. Target: design directors, engineering managers, and recruiters evaluating senior design/engineering leadership.

**Core Value:** The portfolio must communicate design engineering credibility through its own craft — the UI itself is the strongest portfolio piece.

### Constraints

- **Stack**: Next.js 15 (App Router) + React 19 + Tailwind v4 + pnpm + Vercel
- **Export**: Static export in production (`output: 'export'`) — no server-side features in pages
- **Performance**: No WebGL, CSS/JS animations only, `prefers-reduced-motion` respected
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
- **Animation**: CSS-first (no runtime library) — `requestAnimationFrame` for cursor-follow only
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
- **`prefers-reduced-motion`**: All motion disabled — instant positions, zero skew, zero parallax.

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
  IntroSection.tsx                    → 600px hero: logo, overline, headline, CTA
  StickyHeader.tsx                    → Glassmorphism bar on scroll (z-50)
  MenuSection.tsx                     → CLI menu with fiddle-style hover + FloatingPreview
  FloatingPreview.tsx                 → Elastic cursor-follow image (rAF lerp)
  ProjectsGrid.tsx                    → 2x2 flex grid with ProjectCard
  ProjectCard.tsx                     → Card with data-stamp + arrow button
  FooterSection.tsx                   → Expandable contact + tech tags
  ContactForm.tsx                     → Underline-input form with validation
src/hooks/
  useInView.ts                        → IntersectionObserver → adds -inview class
  useFontReady.ts                     → document.fonts.ready → -loaded/-ready (backup, layout.tsx has inline script)
  useMenuNavigation.ts                → Keyboard nav (arrows/enter/esc) + type-to-filter
src/tokens/
  primitives.css                      → Raw OKLCH values (:root)
  semantic.css                        → Purpose-driven tokens (@theme for Tailwind v4)
```

### Token Flow

`primitives.css` → `semantic.css` (@theme) → Tailwind utility classes → Components
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
