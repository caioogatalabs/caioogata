---
phase: quick-260429-edp
plan: 01
type: execute
wave: 1
depends_on: []
files_modified:
  - src/components/sections/v2/MenuSection.tsx
  - src/components/sections/v2/about/SkillsBlock.tsx
autonomous: false
requirements:
  - HCP-01  # Menu hover overlay typography aligned to default 1.5rem (remove inline 2.25rem overrides)
  - HCP-02  # Skills row gains unified Hover Cell pattern: 12px radius bar + -3px V bleed + 0.6s/0.5s ease-out timing
  - HCP-03  # Skills name swaps sans → .type-overlay-hover at 1.25rem (masked vertical pattern)
  - HCP-04  # Skills level label hidden by default, swap-in at right edge in mono 1.25rem on-primary
  - HCP-05  # Experience zero-diff (canonical reference preserved)
  - HCP-06  # prefers-reduced-motion guard preserved across all three components

must_haves:
  truths:
    - "Hovering a menu row shows the swapped-in label/description at 1.5rem (default .type-overlay-hover size), not 2.25rem"
    - "Hovering a skill row triggers four animations together: cell bleed (-3px V), yellow bar (12px radius, 0%→level-mapped width), name swap (sans→mono 1.25rem), level label swap-in at right (mono 1.25rem on-primary)"
    - "Default Skills state shows skill name only (no level label visible)"
    - "Skills bar timing matches Menu/Experience: 0.6s entry / 0.5s exit, ease-out cubic-bezier(0.22,0.31,0,1)"
    - "Experience component file has zero diff after the change"
    - "prefers-reduced-motion collapses all transitions to 0s in Menu and Skills (Experience already verified)"
  artifacts:
    - path: "src/components/sections/v2/MenuSection.tsx"
      provides: "Menu hover overlay at default size (1.5rem)"
      contains: "type-overlay-hover"
    - path: "src/components/sections/v2/about/SkillsBlock.tsx"
      provides: "Unified Hover Cell pattern on skill rows"
      contains: "type-overlay-hover"
  key_links:
    - from: "src/components/sections/v2/about/SkillsBlock.tsx"
      to: ".type-overlay-hover utility (src/app/globals.css)"
      via: "inline className with fontSize: '1.25rem' override on hover overlay span"
      pattern: "type-overlay-hover"
    - from: "src/components/sections/v2/about/SkillsBlock.tsx"
      to: "LEVEL_WIDTH map"
      via: "inline width style on bar (preserves level semantic)"
      pattern: "LEVEL_WIDTH\\[skill\\.level\\]"
---

<objective>
Unify the Hover Cell pattern across V2 Menu, Experience, and Skills components per the locked spec at `docs/superpowers/specs/2026-04-29-hover-cell-pattern-unification.md`.

Purpose: Three V2 components share a hover-driven "fill + reveal" interaction but currently diverge in mechanics, timing, and typography. Convergence on a single pattern (with proportional per-component variations) makes V2's interaction language read as one coherent system instead of three siblings drifting apart.

Output: Two surgical file edits — Menu loses 2 inline fontSize overrides; Skills gains the full unified pattern (radius, bleed, timing, type swap on name, hidden-then-swap-in level label). Experience is the canonical reference and stays untouched.
</objective>

<execution_context>
@$HOME/.claude/get-shit-done/workflows/execute-plan.md
@$HOME/.claude/get-shit-done/templates/summary.md
</execution_context>

<context>
@docs/superpowers/specs/2026-04-29-hover-cell-pattern-unification.md
@CLAUDE.md
@.planning/STATE.md

@src/components/sections/v2/MenuSection.tsx
@src/components/sections/v2/about/SkillsBlock.tsx
@src/components/sections/v2/ExperienceSection.tsx
@src/app/globals.css

<interfaces>
<!-- Pre-extracted contracts so the executor doesn't go scavenging.
     All three components already exist; we are modifying behavior in-place. -->

From src/app/globals.css (line 297):
```css
/* Button hover overlay (masked vertical text-swap) */
.type-overlay-hover {
  font-family: var(--font-mono);            /* JetBrains Mono */
  font-size: var(--text-overlay-hover);     /* 1.5rem default */
  font-weight: var(--primitive-font-regular);
  line-height: 1;
}
```
The default size (1.5rem / 24px) is what Menu/Experience visually want. Skills overrides it to 1.25rem (20px) inline because skill rows are denser (text-base + py-2 vs Menu's text-lg + py-3 — a 1.25× ratio over text-base preserves proportional rhythm).

From src/components/sections/v2/about/SkillsBlock.tsx (current — to be modified):
```typescript
const LEVEL_WIDTH: Record<Skill['level'], string> = {
  Expert: '95%',
  Advanced: '75%',
  Proficient: '55%',
  Familiar: '35%',
}
// State already exists: hoveredSkill, reducedMotion, expandedCategoryTitle
// Hover row currently renders: bar (inset-y-0, no radius, no bleed) + flex row { name (sans, text-base) + level label (mono, text-xs) }
```

From src/components/sections/v2/ExperienceSection.tsx (CANONICAL reference — DO NOT MODIFY):
```typescript
// Bar pattern (lines 152-171):
<div
  className="absolute bg-bg-fill-primary pointer-events-none"
  style={{
    left: '-12px', right: '-12px',
    top: '-5px', bottom: '-5px',           // Experience bleed = 5px
    transform: showYellowBar ? 'scaleX(1) scaleY(1)' : 'scaleX(0.92) scaleY(0.6)',
    opacity: showYellowBar ? 1 : 0,
    transition: showYellowBar
      ? 'transform 0.6s cubic-bezier(0.22,0.31,0,1) 0.04s, opacity 0.2s cubic-bezier(0.22,0.31,0,1) 0.04s'
      : 'transform 0.5s cubic-bezier(0.22,0.31,0,1) 0.06s, opacity 0.3s cubic-bezier(0.22,0.31,0,1) 0.06s',
    transformOrigin: 'left center',
    borderRadius: '12px',
    ...instantStyle,                       // {transitionDuration:'0s'} when reduced-motion
  }}
/>

// Masked vertical text swap (lines 226-279) — wrapper height: 2.8rem with -0.4rem top/bottom margins;
// default span translates -100%, hover span translates from 100% → 0; 1s cubic-bezier(0.16,1,0.3,1).
```

Key adaptation for Skills (the only divergence from canonical):
- Bar fill dimension is `width` (level-mapped), NOT `transform: scaleX`. Width carries the Expert/Advanced/Proficient/Familiar semantic; we cannot collapse it to a binary scale.
- Therefore: `transition: width 0.6s cubic-bezier(0.22,0.31,0,1) 0.04s, opacity 0.2s ...` for entry; `width 0.5s ... 0.06s` for exit. Same easing tokens. Same delays.
- Bleed: -3px (not -5px) because skill rows are denser.
</interfaces>
</context>

<tasks>

<task type="auto">
  <name>Task 1: Remove Menu hover overlay 2.25rem overrides</name>
  <files>src/components/sections/v2/MenuSection.tsx</files>
  <action>
Per spec section "Per-component variations → Menu (home)" and HCP-01.

Make exactly two single-property deletions. The default `.type-overlay-hover` size (1.5rem / 24px) is what we want — it matches Experience and brings Menu in line with the unified pattern. Bleed (-14px), arrow (3.5rem), bar radius (12px), and timing remain unchanged.

**Edit 1 — Label hover overlay (around line 184):**
Delete the `fontSize: '2.25rem'` line and the comment immediately above it. The span keeps its `className="absolute inset-0 flex items-center type-overlay-hover"` and its other inline styles (transform, transition, color).

```diff
                   <span
                     className="absolute inset-0 flex items-center type-overlay-hover"
                     style={{
                       transform: isHighlighted ? 'translateY(0)' : 'translateY(100%)',
                       transition: isHighlighted
                         ? 'transform 1s cubic-bezier(0.16,1,0.3,1) 0.04s'
                         : 'transform 1s cubic-bezier(0.16,1,0.3,1) 0.06s',
                       color: 'var(--color-text-on-primary)',
-                      // Override .type-overlay-hover default size (1.5rem) → 2.25rem for menu label emphasis
-                      fontSize: '2.25rem',
                     }}
                   >
```

**Edit 2 — Description hover overlay (around line 221):**
Same deletion pattern.

```diff
                     <span
                       className="absolute inset-0 flex items-center type-overlay-hover"
                       style={{
                         transform: isHighlighted ? 'translateY(0)' : 'translateY(100%)',
                         transition: isHighlighted
                           ? 'transform 1s cubic-bezier(0.16,1,0.3,1) 0.04s'
                           : 'transform 1s cubic-bezier(0.16,1,0.3,1) 0.06s',
                         color: 'var(--color-text-on-primary)',
-                        // Override .type-overlay-hover default size (1.5rem) → 2.25rem for menu description emphasis
-                        fontSize: '2.25rem',
                       }}
                     >
```

**Do NOT touch anything else in MenuSection.tsx.** No timing changes, no bleed changes, no arrow changes, no keyboard nav changes, no FloatingPreview changes. Spec is explicit: "Single change."
  </action>
  <verify>
    <automated>pnpm tsc --noEmit</automated>
    <automated>! grep -n "fontSize: '2.25rem'" src/components/sections/v2/MenuSection.tsx</automated>
    <automated>grep -c "type-overlay-hover" src/components/sections/v2/MenuSection.tsx  # expect: 2</automated>
  </verify>
  <done>
    - Both `fontSize: '2.25rem'` lines (and their comments) removed from MenuSection.tsx
    - Two `type-overlay-hover` className occurrences remain (label + description spans)
    - `pnpm tsc --noEmit` exits 0
    - No other diff in the file
  </done>
</task>

<task type="auto">
  <name>Task 2: Apply unified Hover Cell pattern to SkillsBlock</name>
  <files>src/components/sections/v2/about/SkillsBlock.tsx</files>
  <action>
Per spec section "Per-component variations → Skills (about)" and HCP-02/03/04/06.

Modify ONLY the per-skill row rendering (the inner `category.skills.map((skill) => ...)` loop, currently lines ~120-160). The category header, accordion expand-collapse, exclusive-open behavior, `useInView`, `LEVEL_WIDTH` map, and `onMouseLeave` reset are all preserved verbatim.

**Five changes to the skill row:**

### Change 1 — Bar styling: add 12px radius, -3px V bleed, ease-out timing

Current (lines ~129-140):
```tsx
<span
  aria-hidden="true"
  className={`absolute inset-y-0 left-0 bg-bg-fill-primary ${
    reducedMotion
      ? ''
      : 'transition-all duration-500 ease-[cubic-bezier(0.5,0,0.3,1)]'
  }`}
  style={{
    width: isHovered ? LEVEL_WIDTH[skill.level] : '0%',
  }}
/>
```

Replace with:
```tsx
<span
  aria-hidden="true"
  className="absolute left-0 bg-bg-fill-primary pointer-events-none"
  style={{
    top: '-3px',
    bottom: '-3px',
    width: isHovered ? LEVEL_WIDTH[skill.level] : '0%',
    opacity: isHovered ? 1 : 0,
    borderRadius: '12px',
    transformOrigin: 'left center',
    transition: reducedMotion
      ? 'none'
      : isHovered
        ? 'width 0.6s cubic-bezier(0.22,0.31,0,1) 0.04s, opacity 0.2s cubic-bezier(0.22,0.31,0,1) 0.04s'
        : 'width 0.5s cubic-bezier(0.22,0.31,0,1) 0.06s, opacity 0.3s cubic-bezier(0.22,0.31,0,1) 0.06s',
  }}
/>
```

Notes:
- `width` replaces `scaleX` from canonical Experience because width carries the level semantic (Expert 95%, Familiar 35%). Same ease-out cubic-bezier, same delays, same durations.
- `opacity` transitions in tandem (matches Experience's bar fade-in/out).
- `inset-y-0` → explicit `top: -3px; bottom: -3px` (the V bleed). Removed `inset-y-0` from className.
- `pointer-events-none` added to match Menu/Experience (defensive).
- `reducedMotion` short-circuits transition to `'none'`.

### Change 2 — Row container: must allow bar to bleed past padding

Current (line ~125):
```tsx
<div
  key={skill.name}
  className="relative overflow-hidden p-2 cursor-default"
  onMouseEnter={() => setHoveredSkill(skill.name)}
  onMouseLeave={() => setHoveredSkill(null)}
>
```

Change `overflow-hidden` → remove (otherwise the -3px V bleed is clipped). Keep `relative`, `p-2`, `cursor-default`. The cell still has implicit visual containment from the inner row content. To prevent skill-name overflow on narrow widths, wrap the name's masked vertical span in its own `overflow-hidden` (Change 3 handles that).

```tsx
<div
  key={skill.name}
  className="relative p-2 cursor-default"
  onMouseEnter={() => setHoveredSkill(skill.name)}
  onMouseLeave={() => setHoveredSkill(null)}
>
```

If a higher-level container needs `overflow-hidden` removed too (to permit bleed), check the wrapping `<div className="overflow-hidden">` at line ~118 — that one stays (it's the accordion grid-rows-[0fr/1fr] panel clip and is necessary). The bar bleed only needs to escape the row's own `p-2`, which it now will because we removed `overflow-hidden` at the row level.

**However**: the accordion's outer `overflow-hidden` will still clip the bleed of the FIRST and LAST rows in a category panel. That's acceptable — the spec calls for -3px V bleed for visual lift on every row; the panel boundary clipping at top/bottom of the list is a known consequence of the accordion's necessary clip. Per spec ("Proportional to the denser skill rows"), -3px is calibrated specifically for this density and is small enough that the panel clip is not perceptually disruptive.

### Change 3 — Skill name: masked vertical sans → mono 1.25rem swap

Current (lines ~143-150):
```tsx
<span
  className={`text-base ${
    isHovered ? 'text-text-inverse' : 'text-text-primary'
  } ${reducedMotion ? '' : 'transition-colors duration-300'}`}
  style={{ fontFamily: 'var(--font-sans)', fontWeight: 400 }}
>
  {skill.name}
</span>
```

Replace with the masked vertical text-swap pattern (mirrors Experience's company/title spans, lines 226-279). The wrapper has fixed height with negative top/bottom margins to overlap with row padding; default span translates from 0 → -100%, hover span translates from 100% → 0; same 1s cubic-bezier(0.16,1,0.3,1) easing.

```tsx
<span
  className="relative block overflow-hidden flex-1 min-w-0"
  style={{
    height: '2rem',
    marginTop: '-0.25rem',
    marginBottom: '-0.25rem',
  }}
>
  {/* Default text — sans, text-base */}
  <span
    className="absolute inset-0 flex items-center"
    style={{
      transform: isHovered ? 'translateY(-100%)' : 'translateY(0)',
      color: 'var(--color-text-primary)',
      fontFamily: 'var(--font-sans)',
      fontSize: '1rem',  // text-base equivalent
      fontWeight: 400,
      transition: reducedMotion
        ? 'none'
        : isHovered
          ? 'transform 1s cubic-bezier(0.16,1,0.3,1) 0.04s, color 0.3s cubic-bezier(0.22,0.31,0,1)'
          : 'transform 1s cubic-bezier(0.16,1,0.3,1) 0.06s, color 0.3s cubic-bezier(0.22,0.31,0,1)',
    }}
  >
    <span className="block truncate">{skill.name}</span>
  </span>
  {/* Hover text — mono via .type-overlay-hover, inline 1.25rem override */}
  <span
    className="absolute inset-0 flex items-center type-overlay-hover"
    style={{
      transform: isHovered ? 'translateY(0)' : 'translateY(100%)',
      color: 'var(--color-text-on-primary)',
      fontSize: '1.25rem',  // override .type-overlay-hover default 1.5rem → 1.25rem (denser row)
      transition: reducedMotion
        ? 'none'
        : isHovered
          ? 'transform 1s cubic-bezier(0.16,1,0.3,1) 0.04s'
          : 'transform 1s cubic-bezier(0.16,1,0.3,1) 0.06s',
    }}
  >
    <span className="block truncate">{skill.name}</span>
  </span>
</span>
```

Wrapper height `2rem` with `-0.25rem` margins: the row's `p-2` (8px top/bottom) + 2rem inner span = ~3rem total content area. The negative margins (-4px each) collapse the swap-zone slightly into the row's padding so the visible row height stays close to the original ~2.5rem feel.

### Change 4 — Level label: hidden by default, swap-in on hover (mono 1.25rem on-primary)

Current (lines ~151-157) — **the label is always visible at text-xs and changes color on hover. Replace this entirely.**

```tsx
<span
  className={`font-mono text-xs ${
    isHovered ? 'text-text-inverse' : 'text-text-tertiary'
  } ${reducedMotion ? '' : 'transition-colors duration-300'}`}
>
  {skill.level}
</span>
```

Replace with a masked vertical swap-in container that holds NOTHING in the default state and the level label in the hover state. Per spec: "always-on-primary color for the label, not color-conditional on fill width."

```tsx
<span
  className="relative block overflow-hidden shrink-0"
  style={{
    height: '2rem',
    marginTop: '-0.25rem',
    marginBottom: '-0.25rem',
    minWidth: '6rem',  // reserves space so the row right edge doesn't shift on hover
  }}
  aria-hidden="true"
>
  {/* Default state — empty (no level label visible) */}
  {/* Hover state — mono 1.25rem on-primary at right */}
  <span
    className="absolute inset-0 flex items-center justify-end type-overlay-hover"
    style={{
      transform: isHovered ? 'translateY(0)' : 'translateY(100%)',
      color: 'var(--color-text-on-primary)',
      fontSize: '1.25rem',
      transition: reducedMotion
        ? 'none'
        : isHovered
          ? 'transform 1s cubic-bezier(0.16,1,0.3,1) 0.04s'
          : 'transform 1s cubic-bezier(0.16,1,0.3,1) 0.06s',
    }}
  >
    {skill.level}
  </span>
</span>
```

Notes:
- Spec decision: label is `aria-hidden="true"` because the level is decorative-on-hover; the underlying skill name is the semantic content. Screen-reader users won't lose information (level is discovered via the data, not the visual hover).
- `justify-end` aligns the label to the right edge of the row's content area (NOT to the right edge of the yellow fill, which varies by level — spec accepts this; the swap motion reads as "level is being announced", not "level is positioned at fill tip").
- `minWidth: '6rem'` reserves horizontal space in the flex row so the skill name doesn't reflow when the label appears. (The longest level is "Proficient" — 9 chars at 1.25rem mono ≈ 5.5rem; 6rem gives a small margin.)
- No default-state span needed: the swap-out is "from nothing", which is just the hover span starting at translateY(100%) (off-screen below).

### Change 5 — Outer text row: keep flex layout

The wrapping `<div className="relative z-10 flex items-center justify-between">` at line ~142 is unchanged. The two children spans (Change 3 = name, Change 4 = level label container) are flex children of this row.

### Verification of preserved behaviors (do NOT change):
- `useInView` block ref + entrance animation (line ~31, ~78)
- `expandedCategoryTitle` state and exclusive-accordion behavior (line ~32, ~67-73)
- `hoveredSkill` state (line ~33) — name unchanged, just consumed in new way
- `reducedMotion` state (line ~34, ~37) — now wired into Change 1 + 3 + 4 transitions
- Category header button (lines ~82-110) — unchanged
- `grid-rows-[0fr/1fr]` accordion panel transition (lines ~113-117) — unchanged
- `LEVEL_WIDTH` map (lines ~13-18) — unchanged, consumed by Change 1
- `onMouseLeave` outer reset (line ~45-48) — unchanged

Reference: full canonical Experience masked-text-swap pattern is at `src/components/sections/v2/ExperienceSection.tsx` lines 226-279 — when in doubt about timing/easing/delay constants, copy from there.
  </action>
  <verify>
    <automated>pnpm tsc --noEmit</automated>
    <automated>grep -c "type-overlay-hover" src/components/sections/v2/about/SkillsBlock.tsx  # expect: 2 (name swap + level label)</automated>
    <automated>grep -n "borderRadius: '12px'" src/components/sections/v2/about/SkillsBlock.tsx  # expect: 1 hit on the bar</automated>
    <automated>grep -n "top: '-3px'" src/components/sections/v2/about/SkillsBlock.tsx  # expect: 1 hit on the bar</automated>
    <automated>grep -n "cubic-bezier(0.22,0.31,0,1)" src/components/sections/v2/about/SkillsBlock.tsx  # expect: 2+ hits (entry + exit on bar)</automated>
    <automated>! grep -n "font-mono text-xs" src/components/sections/v2/about/SkillsBlock.tsx  # level label no longer text-xs default</automated>
    <automated>git diff --stat src/components/sections/v2/ExperienceSection.tsx  # expect: empty (zero diff on canonical)</automated>
  </verify>
  <done>
    - SkillsBlock.tsx skill row bar has: `borderRadius: '12px'`, `top: '-3px'`, `bottom: '-3px'`, width transition with `cubic-bezier(0.22,0.31,0,1)` ease-out, 0.6s entry / 0.5s exit, opacity in tandem
    - Skill name renders as masked vertical sans→mono swap with `.type-overlay-hover` class + inline `fontSize: '1.25rem'`
    - Level label is hidden by default (no text-xs always-visible mono span); appears only in hover via masked vertical swap with `.type-overlay-hover` + `fontSize: '1.25rem'` + `color: var(--color-text-on-primary)` + `justify-end`
    - `reducedMotion` wired into all three new transitions (bar, name swap, level label swap) — set to `'none'` when reduced
    - LEVEL_WIDTH map preserved and still drives bar width
    - Category accordion + exclusive-open behavior + outer mouse-leave reset all unchanged
    - ExperienceSection.tsx has zero diff
    - `pnpm tsc --noEmit` exits 0
  </done>
</task>

<task type="checkpoint:human-verify" gate="blocking">
  <name>Task 3: Visual verification of unified Hover Cell pattern</name>
  <what-built>
    - Menu hover overlay typography reduced from 2.25rem → 1.5rem (default `.type-overlay-hover` size). Bleed, arrow, bar, timing unchanged.
    - Skills row hover gains the unified pattern: 12px radius bar with -3px V bleed, growing from 0% → level-mapped width with 0.6s ease-out cubic-bezier(0.22,0.31,0,1); skill name swaps from sans (text-base) → mono 1.25rem on-primary via masked vertical translate; level label appears at right edge in mono 1.25rem on-primary (hidden in default state).
    - Experience component is the canonical reference and has zero diff.
  </what-built>
  <how-to-verify>
    1. Run `pnpm dev` and open http://localhost:3000.
    2. **Menu (home)** — Hover each menu row. The hovered label and description should swap to JetBrains Mono at 1.5rem (24px) — visibly smaller than the previous 2.25rem (36px). Bleed (-14px), arrow (3.5rem), 12px bar radius, and ease-out timing should all feel identical to before, just with smaller hover type. Tab through with keyboard — same behavior.
    3. **Experience** (http://localhost:3000/experience) — Hover and keyboard-navigate rows. Should be visually identical to before (zero diff). This is the canonical reference; if anything looks different, that's a regression.
    4. **Skills (about)** — http://localhost:3000/about. Click or focus a category to expand it. Hover each skill row inside the panel. Verify all four animations fire together:
       - (a) Yellow bar grows from 0% → level-mapped width (Expert ~95%, Familiar ~35%), with 12px rounded corners, bleeding 3px above/below the row.
       - (b) Skill name slides up and swaps to JetBrains Mono at 1.25rem (20px) on-primary (dark text on yellow).
       - (c) Level label appears at the right edge of the row (mono 1.25rem on-primary) — sliding up from below.
       - (d) Bar timing should match Menu/Experience feel — strong deceleration at end (cubic-bezier(0.22,0.31,0,1)), 0.6s entry / 0.5s exit.
       - **In the default (non-hover) state, the level label should NOT be visible.** Only the skill name shows.
    5. **prefers-reduced-motion** — In macOS System Settings → Accessibility → Display → "Reduce motion" ON, refresh all three pages. Hover should produce instant state changes (no animated transitions). Bar appears/disappears instantly, type swaps instantly, no slide animations.
    6. **Mobile** (DevTools responsive at 375px width) — Skills accordion still works; hover-driven reveal degrades gracefully (touch tap reveals are not in scope, but rows shouldn't visually break).
    7. **Build sanity** — Run `pnpm tsc --noEmit` and confirm exit 0.
  </how-to-verify>
  <resume-signal>Type "approved" if visuals match the spec, or describe any deviations (e.g., "Skills bar bleed clips at panel boundaries", "level label overlaps name on Familiar level", "menu hover type still feels too large").</resume-signal>
</task>

</tasks>

<verification>
- `pnpm tsc --noEmit` exits 0
- `git diff --stat src/components/sections/v2/ExperienceSection.tsx` is empty (canonical untouched)
- `grep -c "fontSize: '2.25rem'" src/components/sections/v2/MenuSection.tsx` is 0
- `grep -c "type-overlay-hover" src/components/sections/v2/about/SkillsBlock.tsx` is 2 (name + level label hover spans)
- Manual verification per Task 3 checklist confirms all six acceptance criteria from the spec
</verification>

<success_criteria>
All six spec acceptance criteria met:
1. Menu hover overlay typography is 1.5rem (24px), not 2.25rem.
2. Skills row hover triggers (a) cell expand via 3px V bleed, (b) yellow bar with 12px radius growing from 0% width to level-mapped width, (c) skill name swaps to mono 1.25rem, (d) level label appears at right edge of row in mono 1.25rem on-primary, (e) all three animations fire together with the unified timing.
3. Skills' default state shows skill name only (no level label visible).
4. Bar timing in Skills matches Menu/Experience: 0.6s entry, 0.5s exit, ease-out + opacity.
5. Experience component file has zero diff.
6. `prefers-reduced-motion` collapses all transitions to 0s in all three components.
</success_criteria>

<output>
After completion, create `.planning/quick/260429-edp-implement-hover-cell-pattern-unification/260429-edp-SUMMARY.md` summarizing:
- Files changed (Menu: 2 line deletions; Skills: 1 row template rewrite)
- Commit hash(es)
- Verification status (tsc, visual checkpoint, reduced-motion test)
- Any deviations from spec or notes for future maintenance (e.g., accordion panel clip on first/last row bleed)
</output>
