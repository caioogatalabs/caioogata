# Experience Page Redesign — Design Spec

**Date:** 2026-04-27
**Branch:** v2
**Status:** Awaiting user review
**Figma:** [Port — node 737:676](https://www.figma.com/design/1y4Fj3s8z9qTLsIpWQB87i/Port?node-id=737-676)

## Context

The `/experience` page currently renders a static hero (h1 + meta line) followed by `PageNavigation` and a yellow-on-hover accordion list of jobs. The Figma redesign introduces:

- A **scroll-pinned hero** modeled after `AboutPinned`, with three big-number cards that start staggered vertically and **converge horizontally** as the user scrolls.
- A **simplified expanded row** (no yellow background — same neutral surface as the rest of the page, with dividers above and below).
- **12-col grid alignment** so cells line up cleanly between collapsed and expanded states.

The redesign reuses existing primitives (`StickyLogoBar`, `PageNavigation`, the `useInView` entrance system) and adds one new hook (`useExperienceHero`) plus a small set of presentational components in `src/components/sections/v2/experience/`.

## Goals

1. Match the rhythm of `/about` so the two pages feel like part of the same system: sticky-pin hero with a fade-out exit at progress ≥ 0.85.
2. Introduce a **convergence interaction** that earns the three big-number cards — they don't just sit there, they tell the career arc by literally aligning under the headline.
3. Standardize the row alignment so the user's instruction ("fechada ou aberta ambos fiquem completamente alinhados") is satisfied.

## Non-goals

- Reworking the keyboard navigation or the `useExperienceNavigation` hook — current behavior (↑/↓ to navigate, Enter to expand, Esc to collapse all) stays as-is.
- Changing the `ExperienceItem` data model in `content/types.ts`.
- Touching `/about` or `/projects` — this spec is scoped to `/experience`.

## Decisions made during brainstorming

| # | Decision | Rationale |
|---|---|---|
| 1 | Hero behavior is **total convergence** (not partial parallax). | Cards must align horizontally above the headline to deliver the visual punchline. |
| 2 | Alignment Y-line is **15vh from top of viewport**. | User-specified — leaves room for the headline below the alignment line. |
| 3 | Headline copy: option 5 from content-strategist — *"Design Engineering as a practice: where brand rigor, product thinking, and shipped code occupy the same role."* | Aligns with bio voice, doesn't compete with the three cards below. |
| 4 | Big-number cards: `15+ years` · `6 companies` · `2 executive roles`. | 15+ counts the full design career from 2010 (first project designer role). 2 executive roles = Huia (Partner) + Azion (Director). |
| 5 | Hero uses a **12-col grid with col 1 empty** — cards live in cols 4-6, 7-9, 10-12. | Matches Figma asymmetry; the empty left column gives the section room to breathe. |
| 6 | Mobile (<768px) hero: **stacked vertically, no parallax**. | Pin + scroll-driven layout doesn't survive short viewports; vertical stack with normal entrance stagger is enough. |
| 7 | Expanded rows: **no yellow background**. Same neutral surface, divider above and below. | Confirmed via Figma screenshot of node 737:1106. |
| 8 | Row 12-col grid: arrow (1) / date (2) / company (3) / title (6). Expanded bottom: description (4) / spacer (2) / 3 achievements (2 each). | Matches Figma pixel widths when mapped to a 1200px grid. |
| 9 | Hero scroll budget: **400vh** (matches `AboutPinned`). | Consistency of pacing between `/about` and `/experience`. |

## Architecture

### Page structure

```
ExperienceSection.tsx (orchestrator, no logic — composes the parts below)
├── ExperienceHero                     ← new
│   ├── StickyLogoBar                  (existing, reused)
│   └── inside the sticky 100vh pin:
│       ├── Headline (z-20, pinned)
│       └── StatsCards (z-10, scroll-driven)
│           ├── StatsCard "15+ years"
│           ├── StatsCard "6 companies"
│           └── StatsCard "2 executive roles"
├── PageNavigation (existing, reused — currentIndex: 2, scope: 'categories')
└── ExperienceRows (refactored inline in ExperienceSection)
```

### New files

```
src/hooks/useExperienceHero.ts
src/components/sections/v2/experience/ExperienceHero.tsx
src/components/sections/v2/experience/StatsCards.tsx
src/components/sections/v2/experience/StatsCard.tsx
```

### Modified files

```
src/components/sections/v2/ExperienceSection.tsx     (replace hero + refactor rows)
src/content/en.json                                  (add experience.hero, update stats)
src/content/pt-br.json                               (mirror)
```

## Hero — scroll mechanics

### Container

```jsx
<div ref={outerRef} style={{ height: '400vh' }} className="relative bg-bg-surface-secondary">
  <div className="sticky top-0 h-screen overflow-hidden flex items-center">
    <div className="w-full px-5 md:px-8 lg:px-16">
      <div className="grid grid-cols-4 md:grid-cols-8 lg:grid-cols-12 gap-4 md:gap-5">
        {/* Headline — z-20, full row */}
        {/* StatsCards — z-10, behind headline */}
      </div>
    </div>
  </div>
</div>
```

### `useExperienceHero` hook

Returns `{ outerRef, progress }`. Identical pattern to `useScrollVideo`:
- `getBoundingClientRect()` on the outer container
- `progress = clamp(-rect.top / (rect.height - innerHeight), 0, 1)`
- `requestAnimationFrame` + `passive: true` scroll listener
- `prefers-reduced-motion`: progress locked at 1 (final state — cards aligned, content faded)

### Per-card trajectory

Each card has a constant `xColStart` (its column position) and an animated `translateY`.

| Card | Initial Y | Alignment Y | Easing |
|---|---|---|---|
| `15+ years` (col 4-6) | `30vh` from sticky-container top | `15vh` | `cubic-bezier(0.16, 1, 0.3, 1)` |
| `6 companies` (col 7-9) | `50vh` | `15vh` | same |
| `2 executive roles` (col 10-12) | `70vh` | `15vh` | same |

Each card travels a different distance (`15vh`, `35vh`, `55vh`), but **all reach `15vh` at progress = 0.7**. That's the convergence moment.

### Phase breakdown

| Phase | Range | Cards | Headline |
|---|---|---|---|
| **Entry** | `0 → 0.6` | Each card moves linearly from initial Y toward `15vh`, but only covers 6/7 of the trip in this phase (so the last 1/7 lands during convergence — adds the "lock" feeling). | Mounted at opacity 1, sticky-pinned. |
| **Convergence** | `0.6 → 0.7` | Cards complete the last segment of their travel with the eased curve, locking at `15vh`. | Still at opacity 1. |
| **Hold** | `0.7 → 0.85` | Cards stay at `15vh`, opacity 1. | Same. |
| **Exit** | `0.85 → 1.0` | All three cards translate up to `-30vh` and fade `1 → 0` together. | Fades `1 → 0` on the same range (mirrors `AboutPinned` paragraph exit). |

The exit phase is intentionally short (15% of scroll budget) — by the time the pin releases (progress = 1.0), the headline + cards are invisible and the next section (`PageNavigation` + rows) is ready to enter cleanly with its own `useInView` stagger.

### Z-stacking

- Headline: `z-20`
- Cards: `z-10`
- Cards pass *behind* the headline. Visually: as a card rises through the Y-band where the headline sits, the headline cuts in front. After convergence (above the headline), cards are again fully visible above it.

## Hero — visual layout

### Desktop (≥1024px)

12-col grid, `gap-5` (20px), `px-16` (64px lateral padding).

```
┌──────────────────────────────────────────────────────────────┐
│ [StickyLogoBar — flex justify-between, ask about + close]   │
├──────────────────────────────────────────────────────────────┤
│                                                              │
│        Headline (Fabio XM Regular, 48px, z-20)              │
│        spans cols 1-12 with text-indent (matches AboutPinned)│
│                                                              │
│  ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ alignment line (15vh)
│                                                              │
│       │ col 4-6  │ col 7-9   │ col 10-12 │                  │
│       │ [empty]  │ [empty]   │ [empty]   │                  │
│       │ [card 1] │ [empty]   │ [empty]   │                  │
│       │          │ [card 2]  │ [empty]   │                  │
│       │          │           │ [card 3]  │                  │
└──────────────────────────────────────────────────────────────┘
```

Cards in their staggered initial state. Card 1 (col 4-6) starts highest; card 3 (col 10-12) starts lowest.

### StatsCard component

```jsx
<div className="border border-border-secondary rounded-[8px] p-5">
  <p style={{ fontFamily: 'var(--font-sans)', fontSize: '72px', lineHeight: 1.15, letterSpacing: '-1.44px' }}>
    {number}
  </p>
  <div className="h-px w-full bg-border-secondary my-2" />
  <p style={{ fontFamily: 'var(--font-sans)', fontSize: '36px', fontWeight: 700, lineHeight: 1.25, letterSpacing: '-0.36px' }}>
    {label}
  </p>
</div>
```

Width auto (fills col-span 3 minus gap). Tokens: `border-border-secondary`, `text-text-secondary`.

### Tablet (768-1023px)

Hero pin still active. 8-col grid. Cards in cols 3-4 / 5-6 / 7-8 (col 1-2 stay empty for the same asymmetry). Same scroll mechanics.

### Mobile (<768px)

**Pin disabled.** The outer container becomes a normal `<section>` with stacked content:

```
[StickyLogoBar]
[Headline — 32px, full width]
[Card 1 — full width, normal entrance stagger]
[Card 2 — full width, normal entrance stagger]
[Card 3 — full width, normal entrance stagger]
```

`useExperienceHero` checks `window.innerWidth >= 768` — if not, returns `progress: 1` immediately and skips the rAF loop.

## Listing rows — refactor

### Collapsed row (12-col grid)

```
col 1  col 2-3   col 4-6        col 7-12
arrow  date      company        title
```

- Arrow: hidden until row is highlighted (current behavior — keep).
- Date: `font-mono`, `text-sm`, `text-text-secondary` (or tertiary when dimmed).
- Company: `Fabio XM`, semibold, `text-text-primary`.
- Title: `Fabio XM`, regular, `text-text-secondary`.

### Expanded row (12-col grid, neutral background)

```
TOP    : col 1   | col 2-3   | col 4-6        | col 7-12
         arrow   | date      | company        | title          (text-text-primary, NOT text-on-primary)

BOTTOM : col 1-4                  | col 5-6    | col 7-8         | col 9-10        | col 11-12
         description block         | (empty)    | achievement 1   | achievement 2   | achievement 3
         (location label + para)              (text-text-primary)
```

### Yellow bar — unchanged for hover/highlight

The animated yellow bar (`bg-bg-fill-primary`, scaleX/Y reveal) that appears behind a row when it is **highlighted** (hovered or keyboard-focused) stays. It still animates in on hover/focus and on the row that is *about to expand*.

When a row **expands**, the yellow bar fades out (set its opacity to 0 for `isExpanded` state), revealing the neutral background. Top divider hides while highlighted/expanded, bottom divider hides while expanded.

### Padding standardization

Both collapsed and expanded use `px-3 py-3`. Internal cell positions become identical: arrow text starts at the same X, date at the same X, company at the same X, title at the same X — across collapsed and expanded.

The yellow bar (when shown) bleeds beyond the row content via `left: -12px; right: -12px` so the visible "fill" extends past the standardized padding (matches V1 behavior).

## Content updates

### `src/content/en.json` — add under `experience`

```json
"experience": {
  "hero": {
    "headline": "Design Engineering as a practice: where brand rigor, product thinking, and shipped code occupy the same role.",
    "stats": [
      { "value": "15+", "label": "years" },
      { "value": "6", "label": "companies" },
      { "value": "2", "label": "executive roles" }
    ]
  },
  "jobs": [...]
}
```

### `src/content/pt-br.json` — mirror

PT-BR translation of the headline (content-strategist can produce it in a follow-up if needed; for now, ship EN-only and leave a TODO for PT-BR).

### `src/app/experience/page.tsx` metadata

Update the description to: `"15+ years of design engineering practice across 6 companies, 2 executive roles."`

### `src/components/sections/v2/ExperienceSection.tsx`

The hardcoded `<span>12+ years</span> · <span>6 companies</span> · <span>3 director roles</span>` block is removed entirely (replaced by `StatsCards`).

## Accessibility

- Cards: `role="group"`, `aria-label="Career stats"`. Each card has an accessible label like `"15 plus years of design engineering practice"`.
- The convergence animation is purely visual — `prefers-reduced-motion` locks all cards at the final aligned state, no scroll-driven motion.
- Headline keeps `<h1>` semantics. The `font-size` clamp (`text-5xl md:text-7xl lg:text-8xl` → `48px`) stays.
- Sticky pin doesn't trap focus — focus order proceeds naturally through StickyLogoBar → headline → StatsCards → PageNavigation → rows.
- Keyboard hints (`↑↓ Enter Esc`) at the bottom of the rows section: unchanged.

## Performance

- `useExperienceHero` uses the same rAF + ticking-flag pattern as `useScrollStick` and `useScrollVideo` — single rAF per scroll event, max one re-render per frame.
- No `THREE.js`, no canvas, no WebGL. Cards are CSS transforms only.
- Reduced motion check at hook init returns early without setting up the scroll listener.
- Mobile (<768px) bypasses the rAF loop entirely.

## Open follow-ups (out of scope for this spec)

- PT-BR translation of the new headline.
- Optional: add the same hero pattern to `/projects` index page (separate spec).
- Confirm whether the `2010-2012` job entry in `en.json` should be relabeled (the user clarified "Manga Rosa" is not in his career; the data uses a different company name already, so no edit needed — flagged as known-good).

## Verification checklist

After implementation, confirm:

- [ ] `progress` snapshot matches expectations at scroll positions 0%, 50%, 70%, 85%, 100%.
- [ ] Cards align at exactly `15vh` from top of viewport at progress = 0.7.
- [ ] Headline stays pinned through progress 0–0.85, fades 0.85–1.0.
- [ ] No yellow bg on expanded rows. Yellow bar still shows on hover/focus of collapsed rows.
- [ ] Cells (arrow / date / company / title) align across collapsed and expanded states (same X positions).
- [ ] Mobile (<768px): no pin, cards stack vertically with `-entrance -slide-up` stagger.
- [ ] `prefers-reduced-motion`: cards at final aligned state on load, no scroll-driven motion, no entrance animation.
- [ ] Keyboard nav in rows still works (↑↓ Enter Esc).
- [ ] Static export build (`pnpm build`) succeeds with no client-only warnings.
