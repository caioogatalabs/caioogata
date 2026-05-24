---
phase: 260427-uge
plan: quick
type: execute
wave: 1
depends_on: []
files_modified:
  - src/hooks/useExperienceHero.ts
  - src/components/sections/v2/experience/ExperienceHero.tsx
  - src/components/sections/v2/experience/StatsCards.tsx
  - src/components/sections/v2/experience/StatsCard.tsx
  - src/components/sections/v2/ExperienceSection.tsx
  - src/content/en.json
  - src/content/pt-br.json
  - src/content/types.ts
  - src/app/experience/page.tsx
autonomous: false
requirements:
  - SPEC-2026-04-27-EXPERIENCE-PAGE-REDESIGN
must_haves:
  truths:
    - "On /experience desktop, the hero pins for 400vh and three big-number cards converge horizontally to a single 15vh alignment line at progress = 0.7"
    - "Headline stays pinned at full opacity through progress 0–0.85, then fades to 0 by progress 1.0 alongside the cards"
    - "Cards pass behind the headline (z-10 vs z-20) during the entry phase, then appear above it after convergence"
    - "On mobile (<768px), the pin is disabled and cards stack vertically with normal `-entrance -slide-up` stagger"
    - "Expanded experience rows render on the same neutral surface as collapsed rows (no yellow background); yellow bar still appears on hover/focus of collapsed rows"
    - "Collapsed and expanded rows share identical X-positions for arrow / date / company / title cells (12-col grid alignment)"
    - "`prefers-reduced-motion` locks all cards at the final aligned state with no scroll-driven motion"
    - "Keyboard nav in rows still works (↑↓ Enter Esc) — `useExperienceNavigation` behavior is unchanged"
  artifacts:
    - path: "src/hooks/useExperienceHero.ts"
      provides: "Scroll-progress hook returning { outerRef, progress } with rAF + reduced-motion + mobile bypass"
      exports: ["useExperienceHero"]
    - path: "src/components/sections/v2/experience/StatsCard.tsx"
      provides: "Single big-number card (border, 72px value, divider, 36px label)"
      exports: ["StatsCard"]
    - path: "src/components/sections/v2/experience/StatsCards.tsx"
      provides: "Trio of StatsCards positioned in cols 4-6/7-9/10-12 with per-card translateY driven by progress"
      exports: ["StatsCards"]
    - path: "src/components/sections/v2/experience/ExperienceHero.tsx"
      provides: "400vh outer + sticky 100vh inner pin orchestrator (StickyLogoBar + headline z-20 + StatsCards z-10)"
      exports: ["ExperienceHero"]
    - path: "src/components/sections/v2/ExperienceSection.tsx"
      provides: "Composes ExperienceHero + PageNavigation + refactored 12-col rows; hardcoded stats line removed"
    - path: "src/content/en.json"
      provides: "experience.hero { headline, stats[3] }"
      contains: "Design Engineering as a practice"
    - path: "src/content/pt-br.json"
      provides: "experience.hero mirror (TODO PT translation, ship EN headline)"
    - path: "src/content/types.ts"
      provides: "ExperienceHero type on Experience content shape"
  key_links:
    - from: "ExperienceSection.tsx"
      to: "ExperienceHero (new component)"
      via: "Direct JSX import"
      pattern: "import.*ExperienceHero.*from.*experience/ExperienceHero"
    - from: "ExperienceHero.tsx"
      to: "useExperienceHero hook"
      via: "outerRef + progress destructure"
      pattern: "useExperienceHero\\("
    - from: "StatsCards.tsx"
      to: "progress prop"
      via: "Per-card translateY computed from progress phases (entry 0–0.6, convergence 0.6–0.7, hold 0.7–0.85, exit 0.85–1.0)"
      pattern: "translateY"
    - from: "ExperienceSection.tsx (rows)"
      to: "ExperienceItem data + 12-col grid"
      via: "grid grid-cols-12 cells: arrow(1) / date(2-3) / company(4-6) / title(7-12)"
      pattern: "grid-cols-12"
---

<objective>
Implement the /experience page redesign per the approved spec at `docs/superpowers/specs/2026-04-27-experience-page-redesign.md`.

Deliverables:
1. New `useExperienceHero` hook + 3 presentational components in `src/components/sections/v2/experience/` that produce a scroll-pinned, converging stats-cards hero (modeled on `AboutPinned`).
2. Refactored ExperienceSection: replace static h1 hero with `ExperienceHero`; rebuild rows on a strict 12-col grid (arrow 1 / date 2 / company 3 / title 6); remove yellow background from expanded state (neutral surface + dividers above/below); preserve yellow bar on hover/focus.
3. Content + types updates: add `experience.hero { headline, stats[] }` to en.json and pt-br.json, extend `Content` type, update `/experience` route metadata.

Purpose: Bring /experience into rhythm with /about (matching 400vh pin + fade-out at 0.85), earn the three big-number cards via a convergence interaction, and lock collapsed/expanded row alignment.
Output: Updated `/experience` page renders the new hero + aligned rows; build + tsc clean; keyboard + reduced-motion parity preserved.
</objective>

<execution_context>
@$HOME/.claude/get-shit-done/workflows/execute-plan.md
@$HOME/.claude/get-shit-done/templates/summary.md
</execution_context>

<context>
@docs/superpowers/specs/2026-04-27-experience-page-redesign.md
@CLAUDE.md
@src/components/sections/v2/ExperienceSection.tsx
@src/components/sections/v2/about/AboutPinned.tsx
@src/hooks/useScrollVideo.ts
@src/hooks/useExperienceNavigation.ts
@src/components/sections/v2/StickyLogoBar.tsx
@src/components/sections/v2/PageNavigation.tsx
@src/content/main-navigation.ts
@src/content/types.ts
@src/content/en.json
@src/content/pt-br.json
@src/app/experience/page.tsx

<interfaces>
<!-- Key contracts the executor needs. The spec is authoritative for behavior; these are the codebase touchpoints. -->

ExperienceItem shape (from src/content/types.ts — DO NOT modify):
```typescript
interface ExperienceItem {
  company: string
  title: string
  dateRange: string
  location?: string
  description?: string
  achievements?: { text: string }[]
}
```

New type to add to src/content/types.ts under `Content.experience`:
```typescript
experience: {
  hero: {
    headline: string
    stats: { value: string; label: string }[]
  }
  jobs: ExperienceItem[]
}
```

useScrollVideo pattern (the rAF + ticking-flag template — useExperienceHero mirrors this minus the canvas/frames):
- containerRef on outer (400vh) div
- rAF-batched scroll listener with `passive: true`
- progress = clamp(-rect.top / (rect.height - innerHeight), 0, 1)
- prefers-reduced-motion → skip listener, set progress = 1
- New: window.innerWidth < 768 → skip listener, set progress = 1 (mobile bypass)

useExperienceNavigation (existing — DO NOT modify):
- Accepts { itemCount, onExpand, onCollapse, containerRef }
- Returns { activeIndex, hoveredIndex, highlightedIndex, setHoveredIndex, handleKeyDown, isDimmed }

PageNavigation usage (already wired in current ExperienceSection — keep as-is):
```tsx
<PageNavigation lateral={{ items: MAIN_NAVIGATION, currentIndex: 2, scope: 'categories' }} />
```

StickyLogoBar (existing — render once at top of ExperienceHero outer container, before the 400vh sticky region OR inside the sticky pin per spec; current ExperienceSection renders it OUTSIDE — match AboutPinned pattern: StickyLogoBar lives outside the 400vh container, then ExperienceHero owns the 400vh pin).

Easing tokens (CLAUDE.md):
- Convergence easing: `cubic-bezier(0.16, 1, 0.3, 1)` (apply manually — this is a Pexel/fiddle curve, not a token)
- Use semantic tokens for all colors: `border-border-secondary`, `text-text-primary`, `text-text-secondary`, `bg-bg-surface-secondary`, `bg-bg-fill-primary`
</interfaces>
</context>

<tasks>

<task type="auto">
  <name>Task 1: Hero infrastructure — useExperienceHero hook + 3 experience components</name>
  <files>
    src/hooks/useExperienceHero.ts (new),
    src/components/sections/v2/experience/StatsCard.tsx (new),
    src/components/sections/v2/experience/StatsCards.tsx (new),
    src/components/sections/v2/experience/ExperienceHero.tsx (new)
  </files>
  <action>
    Create the four new files exactly per spec §"Hero — scroll mechanics" and §"Hero — visual layout".

    **`src/hooks/useExperienceHero.ts`** — clone the rAF + ticking-flag template from `useScrollVideo` minus the canvas/frame logic.
    - Signature: `useExperienceHero(): { outerRef: React.RefObject<HTMLDivElement | null>, progress: number }`
    - Use `getBoundingClientRect()` on `outerRef.current`; compute `progress = clamp(-rect.top / (rect.height - innerHeight), 0, 1)`.
    - rAF-batched scroll + resize listener (`passive: true`); single re-render per frame via `tickingRef`.
    - At init, check `window.matchMedia('(prefers-reduced-motion: reduce)').matches` → skip listener, set `progress = 1` (final aligned/faded state per spec phase table).
    - At init, check `window.innerWidth < 768` → also skip listener, set `progress = 1` (mobile bypass per spec). On mount only; no resize re-eval needed for that branch (acceptable trade-off given the page reload typical UX; document this in a comment).
    - Cleanup: remove both listeners on unmount.

    **`src/components/sections/v2/experience/StatsCard.tsx`** — pure presentational.
    - Props: `{ value: string; label: string; ariaLabel?: string }`.
    - Markup per spec §"StatsCard component":
      ```tsx
      <div role="group" aria-label={ariaLabel} className="border border-border-secondary rounded-[8px] p-5">
        <p style={{ fontFamily: 'var(--font-sans)', fontSize: '72px', lineHeight: 1.15, letterSpacing: '-1.44px' }} className="text-text-primary">{value}</p>
        <div className="h-px w-full bg-border-secondary my-2" />
        <p style={{ fontFamily: 'var(--font-sans)', fontSize: '36px', fontWeight: 700, lineHeight: 1.25, letterSpacing: '-0.36px' }} className="text-text-secondary">{label}</p>
      </div>
      ```
    - Width auto (fills its column span via parent grid).

    **`src/components/sections/v2/experience/StatsCards.tsx`** — trio of cards with progress-driven translateY.
    - Props: `{ progress: number; stats: { value: string; label: string }[] }`.
    - Internal constants per spec §"Per-card trajectory":
      ```ts
      const INITIAL_Y_VH = [30, 50, 70]      // card 0/1/2 starting Y in vh from sticky-container top
      const ALIGNMENT_Y_VH = 15              // all cards meet here at progress = 0.7
      const COL_CLASSES = [                  // static class maps — NO dynamic template literals
        'lg:col-start-4 lg:col-span-3 md:col-start-3 md:col-span-2 col-span-4',
        'lg:col-start-7 lg:col-span-3 md:col-start-5 md:col-span-2 col-span-4',
        'lg:col-start-10 lg:col-span-3 md:col-start-7 md:col-span-2 col-span-4',
      ]
      ```
    - Phase math per spec §"Phase breakdown":
      - Entry (0 → 0.6): linear interp covers 6/7 of the trip from `INITIAL_Y_VH[i]` toward `ALIGNMENT_Y_VH`.
      - Convergence (0.6 → 0.7): remaining 1/7 with the eased curve `cubic-bezier(0.16, 1, 0.3, 1)` — implement easing as a JS approximation. Since we only need the curve applied to the last 1/7 of travel, use a simple cubic-bezier sampler OR a closed-form approximation; a sufficient approximation: `eased = 1 - Math.pow(1 - t, 3)` (cubic ease-out — visually consistent with `(0.16, 1, 0.3, 1)` at this short range). Document the approximation in a comment.
      - Hold (0.7 → 0.85): all cards locked at `ALIGNMENT_Y_VH`, opacity 1.
      - Exit (0.85 → 1.0): translate from `ALIGNMENT_Y_VH` to `-30vh`, opacity 1 → 0 simultaneously for all three cards.
    - Apply via inline `style={{ transform: `translateY(${y}vh)`, opacity }}` on each card wrapper. Z-index 10 on each card.
    - Render in a 12-col grid via parent (the parent ExperienceHero owns the grid; StatsCards just emits the 3 cards in their col-span/col-start classes).
    - aria-labels per card: `"15 plus years of design engineering practice"`, `"6 companies across the career"`, `"2 executive roles"` (derive from `${value} ${label}` where reasonable; spec gives the first one literally).

    **`src/components/sections/v2/experience/ExperienceHero.tsx`** — composer.
    - `'use client'` directive.
    - Props: `{ headline: string; stats: { value: string; label: string }[] }`.
    - Calls `const { outerRef, progress } = useExperienceHero()`.
    - Computes `headlineOpacity`: 1 through progress ≤ 0.85; linear fade to 0 across 0.85 → 1.0.
    - Markup:
      ```tsx
      <div ref={outerRef} style={{ height: '400vh' }} className="relative bg-bg-surface-secondary">
        <div className="sticky top-0 h-screen overflow-hidden flex items-center">
          <div className="w-full px-5 md:px-8 lg:px-16">
            <div className="grid grid-cols-4 md:grid-cols-8 lg:grid-cols-12 gap-4 md:gap-5">
              {/* Headline — full row, z-20 */}
              <h1 className="col-span-4 md:col-span-8 lg:col-span-12 lg:row-start-1 z-20 text-text-primary"
                  style={{ fontFamily: 'var(--font-sans)', fontSize: 'clamp(2rem, 5vw, 3rem)', lineHeight: 1.15, letterSpacing: '-0.96px', fontWeight: 400, textIndent: '8em', opacity: headlineOpacity }}>
                {headline}
              </h1>
              {/* StatsCards — same row-start, z-10 (behind headline during entry, above after convergence per spec; z-stacking is constant 10 vs 20 — visual passing happens because cards translate from below up through the headline) */}
              <StatsCards progress={progress} stats={stats} />
            </div>
          </div>
        </div>
      </div>
      ```
    - **Mobile fallback**: when `progress` is locked to 1 by the hook (mobile bypass), the cards land at their final aligned state — but the spec says mobile should *stack vertically with normal entrance stagger*, not pile up at 15vh. Solve via a small media-query branch inside StatsCards: detect `window.innerWidth < 768` once on mount in `ExperienceHero`, pass `isMobile` to StatsCards. When `isMobile`, StatsCards renders the cards in a single column (col-span-4 each, full width) with `-entrance -slide-up -a-{i}` classes and NO inline transform/opacity. When desktop, applies the progress-driven translateY/opacity as designed. The hook's mobile bypass remains the safety net (no rAF cost on mobile); the visual stack is owned by `isMobile`.
    - Reduced-motion: when `useExperienceHero` returns `progress = 1` (because of reduced-motion), we WANT cards at the aligned-but-faded state... wait — spec says reduced-motion locks at "final aligned state, no fade". Re-read spec §"Hero — scroll mechanics": "`prefers-reduced-motion`: progress locked at 1 (final state — cards aligned, content faded)". The spec literally says faded. But verification checklist says "cards at final aligned state on load, no scroll-driven motion, no entrance animation" — which implies VISIBLE. RESOLUTION: surface a separate `reducedMotion` flag from the hook (in addition to progress). When reducedMotion is true, force `progress` for layout to 0.75 (hold phase — cards aligned, fully visible, no fade). Document this resolution in a code comment referencing the spec ambiguity. Update hook signature to `{ outerRef, progress, reducedMotion }`.

    Use semantic tokens throughout. NEVER raw hex. Use static Tailwind class maps for column spans (NEVER dynamic template literals — see CLAUDE.md `GridItem` pattern).
  </action>
  <verify>
    <automated>pnpm tsc --noEmit</automated>
    Also: files exist at the four declared paths and export the expected symbols.
  </verify>
  <done>
    All four files created; `pnpm tsc --noEmit` exits 0; `useExperienceHero` exports a hook returning `{ outerRef, progress, reducedMotion }`; `StatsCard` / `StatsCards` / `ExperienceHero` exported as named components; no dynamic Tailwind class strings; no raw hex colors; reduced-motion + mobile branches present and commented.
  </done>
</task>

<task type="auto">
  <name>Task 2: Refactor ExperienceSection — wire ExperienceHero + 12-col rows + neutral expanded state</name>
  <files>
    src/components/sections/v2/ExperienceSection.tsx
  </files>
  <action>
    Refactor `ExperienceSection.tsx` to compose the new hero and rebuild the rows per spec §"Listing rows — refactor".

    **Hero replacement:**
    - Remove the entire current hero block (the `<div className="bg-bg-surface-secondary pt-8 ..."` wrapper containing StickyLogoBar + h1 + the hardcoded "12+ years · 6 companies · 3 director roles" line).
    - Replace with: `<StickyLogoBar />` rendered once at the top of the section (matching AboutPinned's pattern of StickyLogoBar OUTSIDE the 400vh container), followed by `<ExperienceHero headline={typedContent.experience.hero.headline} stats={typedContent.experience.hero.stats} />`.
    - The `heroRef` / `useInView` for the hero is no longer needed (ExperienceHero owns its own scroll-driven motion); delete that ref.

    **Rows refactor — 12-col grid alignment:**
    - Both collapsed and expanded states use `grid grid-cols-12 gap-x-4` with identical `px-3 py-3` padding.
    - **Collapsed row cell positions (per spec §"Collapsed row"):**
      - col 1: arrow (Pexel Grotesk display arrow, hidden until highlighted — keep current animation)
      - col 2-3: date (font-mono, text-sm, text-text-secondary; tertiary when dimmed)
      - col 4-6: company (Fabio XM semibold, text-text-primary; masked text swap stays)
      - col 7-12: title (Fabio XM regular, text-text-secondary; masked text swap stays)
      - On mobile (`<md`), keep the current mobile-stacked behavior (company on its own row, title+date stacked below).
    - **Expanded row (per spec §"Expanded row"):**
      - TOP cells: SAME as collapsed row positions (col 1 arrow / col 2-3 date / col 4-6 company / col 7-12 title) — re-render the top row inside the expanded panel so cells align across states. CRITICAL: the spec requires "fechada ou aberta ambos fiquem completamente alinhados" — text must occupy identical X positions. Implementation: the existing accordion already uses the same row button as the visual top of the expanded state. Confirmation: when expanded, the top cells stay rendered AS the row button (no re-render needed); only the bottom panel changes.
      - BOTTOM cells:
        - col 1-4: description block (location label `font-mono text-xs text-text-secondary mb-2`, then description `text-base text-text-primary fontFamily: var(--font-sans)`)
        - col 5-6: empty spacer
        - col 7-8: achievement 1
        - col 9-10: achievement 2
        - col 11-12: achievement 3
      - Each achievement: `text-text-primary` (NOT `text-on-primary` — the yellow bg is gone), no leading dash, `text-base leading-relaxed`, `fontFamily: var(--font-sans)`.
      - If `job.achievements` has fewer than 3 entries, render the available ones in cols 7-8/9-10/11-12 in order (leave trailing slots empty). If more than 3, slice to first 3.
    - **Background:** the expanded panel `<div>` (currently with `backgroundColor: isExpanded ? 'var(--color-bg-fill-primary)' : 'transparent'`) → CHANGE to no inline `backgroundColor` (transparent / inherits the section's `bg-bg`). Remove `borderRadius: '0 0 12px 12px'`. Remove the `marginLeft/marginRight: -12px` + `paddingLeft/paddingRight: 12px` bleed (no longer needed without yellow bg).

    **Yellow bar — preserve hover/focus, hide on expand:**
    - The yellow bar div (currently `bg-bg-fill-primary` with scaleX/Y) stays. ITS LOGIC CHANGES:
      - Show when `isHighlighted && !isExpanded` (was `isHighlighted || isExpanded`).
      - When `isExpanded`, opacity = 0, transform = `scaleX(0.92) scaleY(0.6)` (collapsed visual — the bar disappears entirely while expanded).
    - Cell text color logic: when `isExpanded` (no yellow bg behind), colors should NOT switch to `text-on-primary`. Update the inline `color:` ternaries throughout (arrow, date, company default, title default, mobile stacked title/date) so:
      - `isHighlighted && !isExpanded` → `var(--color-text-on-primary)` (yellow bar is showing, contrast on yellow)
      - `isExpanded` → `var(--color-text-primary)` for company, `var(--color-text-secondary)` for date/title (neutral text on neutral bg)
      - default/dimmed: unchanged
    - The masked text swap (default → 1.5rem Pexel Grotesk bold variant) currently triggers on `isHighlighted || isExpanded`. Keep that trigger — the bigger Pexel Grotesk variant is the "highlighted" typography; it should still show when the row is expanded (Figma confirms this — expanded rows display the larger title). But its `color` value when expanded should be `text-text-primary` (not `text-on-primary`) since there's no yellow bg.

    **Dividers:**
    - Replace the bottom `h-px bg-border-primary` divider logic so:
      - Above each row: divider visible by default, hidden when `isHighlighted || isExpanded` (current behavior already hides it; check whether dividers above exist — currently only ONE divider per row at the bottom). Spec says "divider above and below" the expanded panel.
      - For the implementation: keep the current bottom divider, AND add a top divider above the row button. Both hide when `isHighlighted || isExpanded`. Use `h-px w-full bg-border-primary opacity-10` (matches current opacity 0.1).
      - Edge case: avoid duplicate dividers between adjacent rows. Render the top divider ONLY for index 0 (the very first row); rely on each row's bottom divider for the rest.

    **Cleanup:**
    - Remove the import of `PageNavigation` and `MAIN_NAVIGATION` if unused after refactor — they ARE still used (PageNavigation between hero and rows), keep them.
    - Remove `useInView` import + `heroRef` if no longer used by the hero (rowsRef stays).
    - The keyboard hints block at the bottom (`KeyBadge` row) stays unchanged.
    - The `data-theme="light"` on the outermost `<div>` stays — `/experience` is a light-themed page.
    - Section background: outer `<div className="min-h-screen bg-bg" data-theme="light">` stays. ExperienceHero's `bg-bg-surface-secondary` provides the hero's own surface (matches AboutPinned).

    NO CHANGES to `useExperienceNavigation`, `ExperienceItem` data shape, accordion expand/collapse mechanics, or keyboard handling.
  </action>
  <verify>
    <automated>pnpm tsc --noEmit</automated>
    Manual smoke: `pnpm dev`, visit `/experience`, scroll the hero (cards converge to 15vh, headline fades 0.85→1.0), expand a row (no yellow bg, cells align with collapsed state), test ↑↓ Enter Esc.
  </verify>
  <done>
    `pnpm tsc --noEmit` exits 0; `/experience` renders the new ExperienceHero (400vh pin, converging cards, fade-out exit); rows align on a strict 12-col grid; expanded rows have neutral background with achievements in cols 7-8/9-10/11-12; yellow bar still appears on hover/focus of collapsed rows and disappears on expand; keyboard nav unchanged.
  </done>
</task>

<task type="auto">
  <name>Task 3: Content + types + page metadata updates</name>
  <files>
    src/content/types.ts,
    src/content/en.json,
    src/content/pt-br.json,
    src/app/experience/page.tsx
  </files>
  <action>
    **`src/content/types.ts`** — extend the `Content.experience` shape:
    ```ts
    experience: {
      hero: {
        headline: string
        stats: { value: string; label: string }[]
      }
      jobs: ExperienceItem[]
    }
    ```
    (If a separate `Experience` type exists, augment that instead. Match the existing pattern — see how `about.bio` and `about.headline` are typed.)

    **`src/content/en.json`** — under `"experience"`, add a new `"hero"` key (sibling of existing `"jobs"`):
    ```json
    "hero": {
      "headline": "Design Engineering as a practice: where brand rigor, product thinking, and shipped code occupy the same role.",
      "stats": [
        { "value": "15+", "label": "years" },
        { "value": "6", "label": "companies" },
        { "value": "2", "label": "executive roles" }
      ]
    }
    ```
    Do NOT touch the existing `"jobs"` array.

    **`src/content/pt-br.json`** — mirror the structure with the SAME English headline (per spec: "ship EN-only and leave a TODO for PT-BR"). Add a JSON-friendly TODO marker by leaving the EN string as-is — JSON does not support comments, so document the pending PT translation in `docs/v2/README.md` follow-ups instead. Do NOT add invalid JSON comments. The `stats` array uses the same numeric values; only the labels MAY be translated. For a quick first pass, mirror the EN labels verbatim (`"years"`, `"companies"`, `"executive roles"`) — PT translation can be a follow-up.

    Actually: improve the pt-br stats with reasonable translations on the safe side (numbers don't translate; labels: `"anos"`, `"empresas"`, `"cargos executivos"`) since these are trivial. Headline stays EN with a follow-up flagged.

    **`src/app/experience/page.tsx`** — update `metadata.description` to: `"15+ years of design engineering practice across 6 companies, 2 executive roles."` (replacing the current description). Do NOT touch the page component itself if it just renders `<ExperienceSection />`.

    Validate JSON syntax for both en.json and pt-br.json after edits (no trailing commas, balanced braces).
  </action>
  <verify>
    <automated>pnpm tsc --noEmit && node -e "JSON.parse(require('fs').readFileSync('src/content/en.json','utf8')); JSON.parse(require('fs').readFileSync('src/content/pt-br.json','utf8')); console.log('JSON OK')"</automated>
  </verify>
  <done>
    `Content.experience.hero` typed; en.json + pt-br.json both contain a valid `experience.hero { headline, stats[3] }`; `/experience` route metadata.description reflects the new "15+ years…" copy; `pnpm tsc --noEmit` exits 0; both JSON files parse cleanly.
  </done>
</task>

<task type="checkpoint:human-verify" gate="blocking">
  <name>Task 4: Visual + interaction verification on /experience</name>
  <what-built>
    Full /experience redesign per spec — new converging-cards hero (400vh pin, fade-out at 0.85), 12-col aligned rows with neutral expanded state.
  </what-built>
  <how-to-verify>
    1. Run `pnpm dev` and visit `http://localhost:3000/experience`.
    2. **Hero pin & convergence:**
       - Scroll slowly. The three cards (`15+ years`, `6 companies`, `2 executive roles`) start staggered (heights ~30vh, 50vh, 70vh from sticky-top).
       - Around 60–70% scroll, all three cards align horizontally on the same Y line (~15vh from top of viewport).
       - The headline ("Design Engineering as a practice…") stays at full opacity through ~85% scroll.
       - From ~85–100% scroll, headline + cards fade out together as the pin releases.
       - Cards visibly pass *behind* the headline on the way up, then sit above it after convergence.
    3. **Mobile (DevTools <768px):**
       - No pin. Three cards stack vertically full-width with normal slide-up entrance.
    4. **Reduced motion** (DevTools → Rendering → Emulate `prefers-reduced-motion: reduce`):
       - Cards visible at the aligned state on load, no scroll-driven motion, headline stays at opacity 1.
    5. **Rows alignment:**
       - In a collapsed row, note the X-positions of arrow / date / company / title.
       - Click to expand a row. The TOP cells (arrow, date, company, title) MUST occupy IDENTICAL X-positions. Achievements appear below in 3 columns (cols 7-8 / 9-10 / 11-12).
       - The expanded row has NO yellow background — same neutral surface as collapsed.
       - Hover or arrow-key onto a different row: yellow bar still appears on the highlighted (non-expanded) row.
    6. **Keyboard nav:**
       - ↑/↓ moves through rows (yellow highlight follows).
       - Enter expands the highlighted row.
       - Esc collapses all.
    7. **Build sanity:** Run `pnpm build` (separately if convenient) — should not introduce new client-only warnings.
  </how-to-verify>
  <resume-signal>Type "approved" or describe any issues (e.g., convergence Y off, headline not fading, row cells misaligned, yellow showing on expanded).</resume-signal>
</task>

</tasks>

<verification>
- `pnpm tsc --noEmit` exits 0 after Task 3.
- All four new files exist at `src/hooks/useExperienceHero.ts`, `src/components/sections/v2/experience/{ExperienceHero,StatsCards,StatsCard}.tsx`.
- `ExperienceSection.tsx` no longer renders the static h1 + meta line; renders `<ExperienceHero />` instead.
- `/experience` metadata.description updated.
- en.json + pt-br.json both contain `experience.hero` with headline + 3 stats; both files parse as valid JSON.
- All spec verification checklist items (§"Verification checklist") confirmed via Task 4 checkpoint.
</verification>

<success_criteria>
- /experience hero pins for 400vh; cards converge at 15vh by progress 0.7; headline + cards fade 0.85 → 1.0.
- Mobile (<768px) stacks cards vertically with no pin.
- `prefers-reduced-motion` shows cards at aligned-and-visible state, no scroll-driven motion.
- Collapsed and expanded rows share identical X-positions for arrow / date / company / title.
- Expanded rows render on the neutral background; yellow bar only on hover/focus of collapsed rows.
- Keyboard nav (↑↓ Enter Esc) preserved.
- `pnpm tsc --noEmit` clean.
- Single commit covers all changes (per project precedent for quick tasks).
</success_criteria>

<output>
After completion, create `.planning/quick/260427-uge-implement-the-experience-page-redesign-p/260427-uge-SUMMARY.md` summarizing files added/modified, key decisions made during execution (reduced-motion resolution, achievement count edge cases, easing approximation), and any deviations from the spec with rationale.
</output>
