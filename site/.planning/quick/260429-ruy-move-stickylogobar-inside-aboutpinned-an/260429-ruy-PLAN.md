---
phase: 260429-ruy
plan: quick
type: execute
wave: 1
depends_on: []
files_modified:
  - src/components/sections/v2/about/AboutPinned.tsx
  - src/components/sections/v2/experience/ExperienceHero.tsx
  - src/components/sections/v2/AboutSection.tsx
  - src/components/sections/v2/ExperienceSection.tsx
autonomous: false
requirements:
  - RUY-01
must_haves:
  truths:
    - "On /about, the StickyLogoBar stays visible and stuck to the top during the entire 400vh AboutPinned scroll (image-pin + paragraph reveal)."
    - "On /experience, the StickyLogoBar stays visible and stuck to the top during the entire 400vh ExperienceHero pin (converging-cards trajectory)."
    - "On both pages, the StickyLogoBar is naturally pushed off-screen when its pin container ends, and the PageNavigation directly below takes over as the next sticky-top element."
    - "On /experience mobile (<768px, ExperienceHero outer height='auto'), the logo still appears at the top of the hero region — sticky relative to the auto-height container."
    - "Home (/) IntroSection is unchanged — welcome bar + StickyLogoBar + headline still works exactly as before."
    - "Yellow `bg-fill-primary` pills inside StickyLogoBar still read clearly over `bg-bg` (now sitting on dark surface inside AboutPinned/ExperienceHero, not the previous yellow-ish `bg-bg-surface-secondary` band)."
  artifacts:
    - path: "src/components/sections/v2/about/AboutPinned.tsx"
      provides: "StickyLogoBar mounted as first child of the 400vh outer ref'd div, before the inner sticky pin sibling."
      contains: "<StickyLogoBar />"
    - path: "src/components/sections/v2/experience/ExperienceHero.tsx"
      provides: "StickyLogoBar mounted as first child of the outer ref'd div, before the isMobile-branched inner sibling."
      contains: "<StickyLogoBar />"
    - path: "src/components/sections/v2/AboutSection.tsx"
      provides: "Orchestrator with the short bg-bg-surface-secondary wrapper removed; renders <AboutPinned /> directly; no StickyLogoBar import."
    - path: "src/components/sections/v2/ExperienceSection.tsx"
      provides: "Orchestrator with the short bg-bg-surface-secondary wrapper removed; renders <ExperienceHero /> directly; no StickyLogoBar import."
  key_links:
    - from: "src/components/sections/v2/about/AboutPinned.tsx"
      to: "src/components/sections/v2/StickyLogoBar.tsx"
      via: "import + first-child render inside containerRef 400vh outer"
      pattern: "import.*StickyLogoBar.*sections/v2/StickyLogoBar"
    - from: "src/components/sections/v2/experience/ExperienceHero.tsx"
      to: "src/components/sections/v2/StickyLogoBar.tsx"
      via: "import + first-child render inside outerRef container"
      pattern: "import.*StickyLogoBar.*sections/v2/StickyLogoBar"
    - from: "src/components/sections/v2/AboutSection.tsx"
      to: "(removed) StickyLogoBar import"
      via: "import line and short bg-bg-surface-secondary wrapper deleted"
      pattern: "!StickyLogoBar"
    - from: "src/components/sections/v2/ExperienceSection.tsx"
      to: "(removed) StickyLogoBar import"
      via: "import line and short bg-bg-surface-secondary wrapper deleted"
      pattern: "!StickyLogoBar"
---

<objective>
Move `<StickyLogoBar />` from the short `bg-bg-surface-secondary` wrapper in the orchestrators (`AboutSection.tsx`, `ExperienceSection.tsx`) into the FIRST child position of the 400vh pin containers (`AboutPinned.tsx`, `ExperienceHero.tsx`).

Why: today the wrapper that hosts the logo is a short, bounded box that ends BEFORE the 400vh pinned-hero scroll completes — so the logo unsticks too early and disappears before the user finishes scrolling through the image-pin / converging-cards interaction. By making the logo a sibling INSIDE the 400vh container (above the inner sticky pin sibling), its sticky context spans the entire pin, and it is naturally released only when the 400vh box ends — at which point the `PageNavigation` (its own sticky-top element) takes over visually.

Out of scope: home `IntroSection.tsx` already works correctly with its own composition; do NOT touch it.

Purpose: align /about and /experience hero behavior with user intent — the logo follows the user through the entire pinned interaction, then hands off to PageNavigation.
Output: 4 files modified (2 components gain the logo as first child; 2 orchestrators drop the wrapper + import).
</objective>

<execution_context>
@$HOME/.claude/get-shit-done/workflows/execute-plan.md
@$HOME/.claude/get-shit-done/templates/summary.md
</execution_context>

<context>
@./CLAUDE.md
@.planning/STATE.md
@src/components/sections/v2/AboutSection.tsx
@src/components/sections/v2/ExperienceSection.tsx
@src/components/sections/v2/about/AboutPinned.tsx
@src/components/sections/v2/experience/ExperienceHero.tsx
@src/components/sections/v2/StickyLogoBar.tsx
@src/components/sections/v2/IntroSection.tsx

<interfaces>
<!-- Key types and exports the executor needs. Extracted from codebase. -->

From src/components/sections/v2/StickyLogoBar.tsx:
```tsx
export function StickyLogoBar(): JSX.Element
// Renders: <div className="sticky top-0 z-50 px-5 py-4 md:px-8 lg:px-16">…</div>
// No props. No background paint. Yellow pill (bg-fill-primary + text-on-primary)
// + square close button. Internally driven hover state.
```

From src/components/sections/v2/about/AboutPinned.tsx:
```tsx
export function AboutPinned(): JSX.Element
// Outer: <div ref={containerRef} style={{ height: '400vh' }} className="relative">
//          <div className="sticky top-0 h-screen overflow-hidden bg-bg flex items-center"> … </div>
//        </div>
// containerRef comes from useScrollVideo({ scrubEnd }).
```

From src/components/sections/v2/experience/ExperienceHero.tsx:
```tsx
interface ExperienceHeroProps {
  headline: string
  stats: { value: string; label: string }[]
}
export function ExperienceHero(props: ExperienceHeroProps): JSX.Element
// Outer: <div ref={outerRef} style={{ height: isMobile ? 'auto' : '400vh' }} className="relative">
//          <div ref={mobileInViewRef} className={isMobile ? 'py-12 bg-bg' : 'sticky top-0 h-screen overflow-hidden bg-bg flex items-center'}>
//            …
//          </div>
//        </div>
// outerRef from useExperienceHero(); isMobile from local useState (window.innerWidth < 768).
```

CSS sticky semantics:
- `position: sticky` is bounded by its NEAREST scroll container ancestor with overflow-* set, OR by the bounds of its OWN parent block, whichever is closer.
- For the new arrangement, `<StickyLogoBar />` (sticky top-0 z-50) becomes a direct child of the outer 400vh container — that's its sticky bound. As long as the outer 400vh box overlaps the viewport, the logo sticks to top:0. When the outer 400vh ends, the logo unsticks naturally.
- The inner sticky pin sibling (`sticky top-0 h-screen … bg-bg`) is a separate sticky context (its own sibling), unaffected. The logo's z-50 sits above it.
- The outer container does NOT have `overflow-hidden` (verified in source), so sticky propagates to the page scroll — correct.
</interfaces>
</context>

<tasks>

<task type="auto">
  <name>Task 1: Move StickyLogoBar inside AboutPinned + ExperienceHero (first child of 400vh outer)</name>
  <files>
    src/components/sections/v2/about/AboutPinned.tsx,
    src/components/sections/v2/experience/ExperienceHero.tsx
  </files>
  <action>
**File 1: `src/components/sections/v2/about/AboutPinned.tsx`**

1. Add import at the top, alongside the existing imports:
```tsx
import { StickyLogoBar } from '@/components/sections/v2/StickyLogoBar'
```

2. Inside the JSX return, locate the outer 400vh ref'd div:
```tsx
<div ref={containerRef} style={{ height: '400vh' }} className="relative">
  <div className="sticky top-0 h-screen overflow-hidden bg-bg flex items-center">
    …
  </div>
</div>
```

3. Insert `<StickyLogoBar />` as the FIRST child, BEFORE the inner sticky pin div:
```tsx
<div ref={containerRef} style={{ height: '400vh' }} className="relative">
  <StickyLogoBar />
  <div className="sticky top-0 h-screen overflow-hidden bg-bg flex items-center">
    …
  </div>
</div>
```

Do NOT modify the inner sticky pin div, its `bg-bg` class, the canvas/image markup, the paragraph, or any of the scroll-progress logic. Only add the import + insert the single `<StickyLogoBar />` line as first child of the 400vh outer.

---

**File 2: `src/components/sections/v2/experience/ExperienceHero.tsx`**

1. Add import alongside existing imports:
```tsx
import { StickyLogoBar } from '@/components/sections/v2/StickyLogoBar'
```

2. Inside the JSX return, locate the outer ref'd div with the `isMobile ? 'auto' : '400vh'` height:
```tsx
<div
  ref={outerRef}
  style={{ height: isMobile ? 'auto' : '400vh' }}
  className="relative"
>
  <div
    ref={mobileInViewRef as React.RefObject<HTMLDivElement>}
    className={isMobile ? 'py-12 bg-bg' : 'sticky top-0 h-screen overflow-hidden bg-bg flex items-center'}
  >
    …
  </div>
</div>
```

3. Insert `<StickyLogoBar />` as the FIRST child, BEFORE the `mobileInViewRef` inner div:
```tsx
<div
  ref={outerRef}
  style={{ height: isMobile ? 'auto' : '400vh' }}
  className="relative"
>
  <StickyLogoBar />
  <div
    ref={mobileInViewRef as React.RefObject<HTMLDivElement>}
    className={isMobile ? 'py-12 bg-bg' : 'sticky top-0 h-screen overflow-hidden bg-bg flex items-center'}
  >
    …
  </div>
</div>
```

Do NOT modify the inner branch, the headline, the StatsCards, useExperienceHero, or any progress logic. Only add the import + insert the single `<StickyLogoBar />` line as first child of the outer ref'd div. The mobile branch (`height: 'auto'`) still works because `position: sticky` falls back to natural-flow when the bounding block is auto-height — the logo simply appears at the top of the hero block on mobile.

---

**Rationale for first-child placement (record in commit body):**
- StickyLogoBar is `sticky top-0 z-50`. Its sticky bound = nearest scroll-overflow ancestor or its own parent block.
- Making it a direct child of the 400vh outer (which has no `overflow-hidden`) means the logo sticks to the page-scroll viewport top until the 400vh outer scrolls past — exactly what the user wants.
- z-50 keeps it above the inner sticky pin sibling (which has no explicit z, defaults to auto/0), so the logo always paints over the pinned image / converging-cards content.
- The PageNavigation that follows in the parent orchestrator is ALSO sticky top-0 (its own block). When the 400vh container ends, the logo's sticky context releases, and PageNavigation's begins — visually, PageNavigation appears to "push" the logo up and out. No extra coordination CSS needed.
  </action>
  <verify>
    <automated>
pnpm tsc --noEmit 2>&1 | tail -20 \
  && grep -c "import { StickyLogoBar }" src/components/sections/v2/about/AboutPinned.tsx \
  && grep -c "<StickyLogoBar />" src/components/sections/v2/about/AboutPinned.tsx \
  && grep -c "import { StickyLogoBar }" src/components/sections/v2/experience/ExperienceHero.tsx \
  && grep -c "<StickyLogoBar />" src/components/sections/v2/experience/ExperienceHero.tsx
    </automated>

Expected: tsc clean exit; each grep returns `1`.

Also verify ordering with a structural grep — `<StickyLogoBar />` must appear BEFORE the inner sticky-pin sibling line in each file:

```
awk '/<StickyLogoBar \/>/{logo=NR} /sticky top-0 h-screen overflow-hidden bg-bg/{pin=NR} END{print "AboutPinned: logo="logo" pin="pin}' src/components/sections/v2/about/AboutPinned.tsx
awk '/<StickyLogoBar \/>/{logo=NR} /mobileInViewRef/{ref=NR; if(!pin) pin=NR} END{print "ExperienceHero: logo="logo" pin="pin}' src/components/sections/v2/experience/ExperienceHero.tsx
```

Expected: `logo < pin` in both.
  </verify>
  <done>
- Both component files import `StickyLogoBar` from `@/components/sections/v2/StickyLogoBar`.
- Each renders `<StickyLogoBar />` as the FIRST child of its outer ref'd container (the 400vh-height div), strictly above the inner sticky pin sibling.
- All existing logic (useScrollVideo, useExperienceHero, isMobile branch, headline, StatsCards, canvas, paragraph, opacity/translate calculations) is untouched.
- `pnpm tsc --noEmit` exits 0.
  </done>
</task>

<task type="auto">
  <name>Task 2: Drop the short bg-bg-surface-secondary wrapper from orchestrators + remove unused imports</name>
  <files>
    src/components/sections/v2/AboutSection.tsx,
    src/components/sections/v2/ExperienceSection.tsx
  </files>
  <action>
**File 1: `src/components/sections/v2/AboutSection.tsx`**

1. Remove the import line at the top:
```tsx
import { StickyLogoBar } from '@/components/sections/v2/StickyLogoBar'
```
Keep all other imports (PageNavigation, MAIN_NAVIGATION, AboutPinned, BioBlock, SkillsBlock, ClientsBlock, EducationBlock).

2. Inside the JSX, delete this entire block including the comment:
```tsx
{/* Hero band — same wrapper shape (bg + top padding) as the home,
    but ONLY the sticky pills row is rendered inside.
    No welcome bar, no Hero. */}
<div className="bg-bg-surface-secondary pt-8 md:pt-10 lg:pt-12 pb-16 md:pb-24 lg:pb-32">
  <StickyLogoBar />
</div>
```

3. The first child of `<div className="min-h-screen bg-bg">` is now `<AboutPinned />` directly (preceded only by its inline comment if you choose to keep one). Recommended: replace the deleted block with a one-line comment summarising the new arrangement, e.g.:
```tsx
{/* AboutPinned now hosts the StickyLogoBar internally — it stays sticky
    through the full 400vh pin, then PageNavigation below takes over. */}
<AboutPinned />
```

4. Do NOT change `<PageNavigation … />`, `<BioBlock />`, `<SkillsBlock />`, `<ClientsBlock />`, `<EducationBlock />`, or the JSDoc summary at the top of the file (you MAY update the JSDoc to drop the now-stale "bg-bg-surface-secondary band → <StickyLogoBar/>" line in the Sequence list — replace with `<AboutPinned/> (logo lives inside)`).

---

**File 2: `src/components/sections/v2/ExperienceSection.tsx`**

1. Remove the import line at the top:
```tsx
import { StickyLogoBar } from '@/components/sections/v2/StickyLogoBar'
```
Keep all other imports.

2. Inside the JSX, delete this entire block including the comment:
```tsx
{/* Hero band — short bg-bg-surface-secondary container around the
    StickyLogoBar. Matches /about exactly: same pt/pb values, same
    single-child shape. The short container is what releases the
    sticky logo: when its bottom scrolls into the viewport top, the
    PageNavigation (further down) takes over as the top-stuck element
    and visually pushes the logo off-screen. */}
<div className="bg-bg-surface-secondary pt-8 md:pt-10 lg:pt-12 pb-16 md:pb-24 lg:pb-32">
  <StickyLogoBar />
</div>
```

3. The first child of `<div className="min-h-screen bg-bg">` is now `<ExperienceHero … />` directly. Recommended replacement comment:
```tsx
{/* ExperienceHero hosts the StickyLogoBar internally — sticky through
    the full 400vh pin (mobile: through the auto-height block), then the
    sticky PageNavigation below takes over. */}
<ExperienceHero
  headline={typedContent.experience.hero.headline}
  stats={typedContent.experience.hero.stats}
/>
```

4. Do NOT change anything else: rowsRef, containerRef, expandedIndex/reducedMotion state, useExperienceNavigation, the rows map, the bottom non-sticky PageNavigation. The only deletions are the import and the wrapper div block.
  </action>
  <verify>
    <automated>
pnpm tsc --noEmit 2>&1 | tail -20 \
  && ! grep -q "StickyLogoBar" src/components/sections/v2/AboutSection.tsx \
  && ! grep -q "StickyLogoBar" src/components/sections/v2/ExperienceSection.tsx \
  && ! grep -q "bg-bg-surface-secondary pt-8 md:pt-10 lg:pt-12 pb-16 md:pb-24 lg:pb-32" src/components/sections/v2/AboutSection.tsx \
  && ! grep -q "bg-bg-surface-secondary pt-8 md:pt-10 lg:pt-12 pb-16 md:pb-24 lg:pb-32" src/components/sections/v2/ExperienceSection.tsx \
  && grep -q "IntroSection" src/components/layout/PageShell.tsx 2>/dev/null || true
    </automated>

Expected: tsc clean exit; the four negative greps all succeed (no `StickyLogoBar` reference and no orphan wrapper class string left in either orchestrator).

Sanity check that home is untouched:
```
grep -c "StickyLogoBar" src/components/sections/v2/IntroSection.tsx
```
Expected: `1` (the existing IntroSection import + render — unchanged).
  </verify>
  <done>
- `src/components/sections/v2/AboutSection.tsx` no longer imports or references `StickyLogoBar`; the `bg-bg-surface-secondary pt-…` wrapper div is gone; `<AboutPinned />` is the first JSX child of the page wrapper.
- `src/components/sections/v2/ExperienceSection.tsx` no longer imports or references `StickyLogoBar`; the same wrapper div is gone; `<ExperienceHero … />` is the first JSX child.
- `src/components/sections/v2/IntroSection.tsx` is untouched (home still renders its own `<StickyLogoBar />` via the existing fragment composition).
- `pnpm tsc --noEmit` exits 0.
  </done>
</task>

<task type="checkpoint:human-verify" gate="blocking">
  <name>Task 3: Manual scroll verification on /about, /experience, and / (home)</name>
  <what-built>
StickyLogoBar relocated from the short `bg-bg-surface-secondary` orchestrator wrapper into the FIRST child of the 400vh pin containers (`AboutPinned`, `ExperienceHero`). Orchestrators (`AboutSection`, `ExperienceSection`) had the wrapper + import removed. Home (`IntroSection`) is intentionally NOT changed.
  </what-built>
  <how-to-verify>
Start dev server: `pnpm dev` — open in Chromium (per project rule, do NOT use Chrome).

**1. /about (desktop, ≥1024px):**
   1. Navigate to `http://localhost:3000/about`.
   2. Confirm at scroll=0: yellow `ask about` pill + close button visible at top-right; CO logo top-left.
   3. Slowly scroll down through the entire AboutPinned (image pin + paragraph reveal) — watch the StickyLogoBar.
      - Expected: logo stays stuck to the top of the viewport for the ENTIRE 400vh scroll (~4 viewport heights). Image pin + paragraph reveal happen below it.
      - Bug if: logo scrolls away before the paragraph fade-out / image rise-up at progress 0.85→1.0 completes.
   4. Continue scrolling past the pin — when AboutPinned ends, the PageNavigation (mono "← back / Home About Experience Philosophy") should sticky-pin in its place.
      - Expected: smooth handoff; PageNavigation appears stuck at top, logo no longer visible (released).
      - Bug if: brief gap where neither is stuck, or visual jump.

**2. /experience (desktop, ≥1024px):**
   1. Navigate to `http://localhost:3000/experience`.
   2. Same checks as /about: logo sticks through the full 400vh ExperienceHero converging-cards trajectory (cards converge, hold, exit fade).
   3. After the hero, PageNavigation takes over. Smooth handoff.

**3. /experience (mobile, <768px — use Chromium DevTools device emulation, e.g. iPhone 14 Pro):**
   1. Navigate to `http://localhost:3000/experience`.
   2. ExperienceHero outer height is `auto` on mobile — the logo should still appear at the top of the hero region (sticky relative to the auto-height block).
   3. Scroll down through the stacked StatsCards. Logo behaves naturally — sticks while the hero block is in viewport, releases when the hero block ends.
      - Bug if: logo invisible on mobile, or covers content awkwardly.

**4. / (home — should be UNCHANGED):**
   1. Navigate to `http://localhost:3000/`.
   2. Welcome bar at top → headline ("Bridging design engineering brand") visible → StickyLogoBar sits in the middle of the hero (between welcome bar and headline) and sticks to top:0 once you scroll past it.
   3. Continues sticking through MenuSection / ProjectsGrid / FooterSection.
   4. Confirm NO regression: behavior is identical to before the change.

**5. Visual contrast check (both /about and /experience):**
   1. The logo now sits over `bg-bg` (dark) instead of the previous `bg-bg-surface-secondary` (yellow-ish) at scroll=0. The yellow `bg-fill-primary` pill should still be very legible.
   2. Confirm: pill remains the same yellow, hover swap (sans → mono "ask about") still works, close-× button hover still works.

**6. Reduced-motion (optional but recommended):**
   1. macOS: System Settings → Accessibility → Display → "Reduce motion" ON.
   2. Reload /about and /experience. The pins still work (sticky is not animation), the logo still sticks. Scroll-driven scrubs collapse to instant per existing reduced-motion paths.

If all 6 pass, type `approved`. If any issue, describe with screenshots/scroll position.
  </how-to-verify>
  <resume-signal>Type "approved" or describe issues (e.g., "logo unsticks at progress 0.6 on /about", "mobile logo hidden behind StatsCards", "home regression").</resume-signal>
</task>

</tasks>

<verification>
Final state checks (after Task 3 approval):

```bash
# Imports
grep -n "StickyLogoBar" src/components/sections/v2/about/AboutPinned.tsx
grep -n "StickyLogoBar" src/components/sections/v2/experience/ExperienceHero.tsx
grep -n "StickyLogoBar" src/components/sections/v2/IntroSection.tsx
# Expected: 2 lines each (import + render) for all three.

# Orchestrators clean
grep -n "StickyLogoBar" src/components/sections/v2/AboutSection.tsx
grep -n "StickyLogoBar" src/components/sections/v2/ExperienceSection.tsx
# Expected: no output (zero matches).

# No orphan wrapper
grep -rn "bg-bg-surface-secondary pt-8 md:pt-10 lg:pt-12 pb-16 md:pb-24 lg:pb-32" src/
# Expected: no output.

# Type check
pnpm tsc --noEmit
# Expected: exit 0.
```
</verification>

<success_criteria>
- StickyLogoBar stays sticky through the full 400vh pin on /about and /experience (desktop) — verified by manual scroll.
- StickyLogoBar present and behaving naturally on /experience mobile.
- Home (/) unchanged — IntroSection still works.
- PageNavigation handoff is clean on both pages (no gap, no jump).
- Yellow pill remains legible over the new `bg-bg` (dark) backdrop.
- `pnpm tsc --noEmit` exits 0.
- 4 files modified, 0 added, 0 deleted.
</success_criteria>

<output>
After completion, create `.planning/quick/260429-ruy-move-stickylogobar-inside-aboutpinned-an/260429-ruy-SUMMARY.md` documenting:
- Files changed and what changed in each.
- The sticky-context rationale (why first-child of the 400vh outer is the correct bound).
- Mobile branch behavior on ExperienceHero (auto-height + natural-flow sticky fallback).
- Confirmation that home is untouched.
- Commit hash(es).
- pnpm tsc --noEmit result.
- Any visual notes from the manual verification (e.g., if user pointed out contrast tweak needed).
</output>
