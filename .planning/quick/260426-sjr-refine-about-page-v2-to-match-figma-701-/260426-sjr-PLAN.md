---
phase: quick-260426-sjr
plan: 01
type: execute
wave: 1
depends_on: []
files_modified:
  - src/components/sections/v2/AboutSection.tsx
  - src/components/sections/v2/about/ProjectNavigation.tsx
  - src/components/sections/v2/about/AboutPinned.tsx
  - src/components/sections/v2/about/BioBlock.tsx
  - src/components/sections/v2/about/SkillsBlock.tsx
  - src/components/sections/v2/about/ClientsBlock.tsx
  - src/components/sections/v2/about/EducationBlock.tsx
autonomous: true
requirements:
  - QUICK-260426-sjr
must_haves:
  truths:
    - "/about no longer renders the welcome bar or the Bridging headline; only the sticky logo+pills row appears at top"
    - "A `← Back to Home` mono link renders below the sticky bar on /about and links to `/`"
    - "AboutPinned's first paragraph renders in Fabio XM 48px / 400 / leading-1.15 / tracking-[-0.96px]"
    - "BioBlock renders a left spacer (cols 1-4) and content in cols 5-12 with Core Expertise above bio paragraphs separated by ~64px"
    - "BioBlock renders the final bio paragraph as a full-width quote in Fabio XM 48px text-text-secondary"
    - "SkillsBlock renders categories as an exclusive accordion expanded on hover/focus only; expanded category stays open until another is hovered"
    - "Each Skills row reveals a yellow level-mapped bar (Expert 95% / Advanced 75% / Proficient 55% / Familiar 35%) on row hover with text-text-inverse text on top"
    - "ClientsBlock description renders in Fabio XM Bold 36px and the 16-cell logo grid has zero borders/dividers between cells"
    - "EducationBlock uses an outer 4-spacer + 8-content layout with a flat flex row (year w-[100px] + flex-1 info), no inner Grid"
    - "Home `/` continues to render the welcome bar + sticky bar + Bridging headline + tags exactly as before (no regression)"
    - "`pnpm typecheck` exits 0 and `pnpm build` succeeds (static export)"
  artifacts:
    - path: "src/components/sections/v2/AboutSection.tsx"
      provides: "Reorchestrated /about page: bg-bg-surface-secondary band wrapping StickyLogoBar only (no Hero, no welcome bar), then ProjectNavigation, then blocks"
      min_lines: 40
    - path: "src/components/sections/v2/about/ProjectNavigation.tsx"
      provides: "New mono nav strip with `← Back to Home` link to /, optional secondary slot prop"
      contains: "Back to Home"
    - path: "src/components/sections/v2/about/AboutPinned.tsx"
      provides: "First-paragraph reveal styled in Fabio XM 48px/400/leading-1.15/-0.96px"
      contains: "fontSize: '3rem'"
    - path: "src/components/sections/v2/about/BioBlock.tsx"
      provides: "4-spacer + 8-content layout with Core Expertise above bio paragraphs, plus full-width final-quote block"
      contains: "colStart: 5"
    - path: "src/components/sections/v2/about/SkillsBlock.tsx"
      provides: "Exclusive hover-driven accordion, hover-bar reveal per skill row with LEVEL_WIDTH_CLASS"
      contains: "expandedCategoryTitle"
    - path: "src/components/sections/v2/about/ClientsBlock.tsx"
      provides: "Fabio XM Bold 36px description, borderless 2/4-col logo grid (CELL_BORDERS removed)"
      contains: "fontWeight: 700"
    - path: "src/components/sections/v2/about/EducationBlock.tsx"
      provides: "Outer 4-spacer + 8-content GridItem with flex row (w-[100px] year + flex-1 info), no inner Grid"
      contains: "w-[100px]"
  key_links:
    - from: "src/components/sections/v2/AboutSection.tsx"
      to: "src/components/sections/v2/StickyLogoBar"
      via: "named import + render"
      pattern: "import \\{ StickyLogoBar \\}"
    - from: "src/components/sections/v2/AboutSection.tsx"
      to: "src/components/sections/v2/about/ProjectNavigation"
      via: "named import + render below StickyLogoBar"
      pattern: "import \\{ ProjectNavigation \\}"
    - from: "src/components/sections/v2/about/ProjectNavigation.tsx"
      to: "next/link"
      via: "Link href=\"/\""
      pattern: "from 'next/link'"
    - from: "src/components/sections/v2/about/SkillsBlock.tsx"
      to: "useState (React)"
      via: "expandedCategoryTitle state controls accordion"
      pattern: "useState"

# Final commit (single commit covering ALL changes — do NOT auto-commit per task)
commit_message: "refactor(quick-260426-sjr): refine /about page V2 to match Figma 701:303"
---

<objective>
Refine the /about page V2 to match Figma node 701:303 by applying 7 discrete changes across the about/ subdirectory: remove the /about hero in favor of just the home pills bar, add a `← Back to Home` mono nav strip, retype AboutPinned's first paragraph, reorganize BioBlock with a left spacer + final full-width quote, rebuild SkillsBlock as an exclusive hover-driven accordion with per-skill bar reveals, retype the ClientsBlock description and remove all logo-grid cell borders, and standardize EducationBlock as a 4-spacer + 8-content list mirroring Core Expertise. The home `/` IntroSection stays untouched. ONE final commit at the end covers all 7 changes.

Purpose: Match the Figma reference (701:303) precisely so the /about page reflects the design intent (Architectural Brutalism — Fabio XM display typography, Core-Expertise-style flat lists, hover-revealed accordion + level bars), without regressing the home hero.

Output:
- Edited AboutSection orchestrator (no welcome bar, no Hero, just StickyLogoBar + ProjectNavigation + blocks)
- New ProjectNavigation atom in about/ subdirectory
- Edited AboutPinned, BioBlock, SkillsBlock, ClientsBlock, EducationBlock
- Single git commit covering everything
</objective>

<execution_context>
@$HOME/.claude/get-shit-done/workflows/execute-plan.md
@$HOME/.claude/get-shit-done/templates/summary.md

# IMPORTANT: This is a quick task with a SINGLE final commit.
# Do NOT auto-commit per task. Run all task work, then run the commit step exactly once at the end of Task 3.
</execution_context>

<context>
@./CLAUDE.md
@.planning/STATE.md
@.planning/phases/04.2-about-consolidation/04.2-CONTEXT.md
@src/components/sections/v2/IntroSection.tsx
@src/components/sections/v2/AboutSection.tsx
@src/components/sections/v2/StickyLogoBar.tsx
@src/components/sections/v2/Hero.tsx
@src/components/sections/v2/about/AboutPinned.tsx
@src/components/sections/v2/about/BioBlock.tsx
@src/components/sections/v2/about/SkillsBlock.tsx
@src/components/sections/v2/about/ClientsBlock.tsx
@src/components/sections/v2/about/EducationBlock.tsx
@src/components/sections/v2/about/SectionDivider.tsx
@src/components/layout/Grid.tsx
@src/content/en.json
@src/content/types.ts

<interfaces>
<!-- Key contracts the executor needs. Extracted from codebase. -->
<!-- Use these directly — no codebase exploration required. -->

From src/components/sections/v2/StickyLogoBar.tsx:
```typescript
export function StickyLogoBar(): JSX.Element
// Renders: sticky top-0 z-50, px-5 py-4 md:px-8 lg:px-16
// Already a standalone component — IMPORT IT, do not duplicate.
// Used today by both IntroSection (home) and AboutSection (/about).
```

From src/components/layout/Grid.tsx:
```typescript
export const Grid: ForwardRefComponent<HTMLDivElement, GridProps>
// className adds: grid grid-cols-4 gap-4 px-5 md:grid-cols-8 md:gap-5 md:px-8 lg:grid-cols-12 lg:px-16

export const GridItem: ForwardRefComponent<HTMLDivElement, GridItemProps>
interface GridItemProps {
  span?: number       // desktop span 1..12
  tabletSpan?: number // tablet span 1..8
  mobileSpan?: number // mobile span 1..4
}
// Static class maps for col-span only. NO col-start map exists yet.
// To use lg:col-start-N you MUST add a static class string via className
// (Tailwind needs literal strings — see notes in Task 1).
```

From src/content/types.ts (Skill):
```typescript
export interface Skill {
  name: string
  level: 'Expert' | 'Advanced' | 'Proficient' | 'Familiar'
  projectSlugs?: string[]
}
export interface SkillCategory { title: string; skills: Skill[] }
```

From src/content/en.json:
```jsonc
"skills": {
  "categories": [
    { "title": "Design Systems", "skills": [{ "name": "...", "level": "Expert" }, ...] },
    // 6 categories total
  ]
}
"about": {
  "headline": "...",
  "bio": "First paragraph.\n\nMiddle paragraph 1.\n\n...\n\nFinal quote: What drives me ...",
  "expertise": ["...", "..."]
}
```

From src/components/sections/v2/IntroSection.tsx:
```typescript
// Home composition (DO NOT TOUCH):
//   <div bg-bg-surface-secondary>
//     <section> Welcome bar </section>
//     <div flex-1 />
//     <StickyLogoBar />          ← reuse this exact component on /about
//     <div> Bridging headline + tags </div>
//   </div>
```
</interfaces>

<existing_styles>
<!-- Critical project conventions to honor (CLAUDE.md): -->
- Static Tailwind class maps for any dynamic value (no template-literal class strings).
- Semantic tokens only: text-text-primary, text-text-secondary, text-text-tertiary, text-text-inverse, bg-bg-surface-secondary, border-border-secondary, bg-fill-primary, text-on-primary.
- Fabio XM via `style={{ fontFamily: 'var(--font-sans)' }}` (not a font class).
- Cascadia Mono via `font-mono` class.
- All entrance animations: `-entrance -slide-up -a-N` with `useInView` on the parent ref.
- `prefers-reduced-motion` must be respected on every new motion.
- Sharp corners (0px) on all gallery/logo cells (already standard for V2 grids).
</existing_styles>
</context>

<tasks>

<task type="auto">
  <name>Task 1: Refactor AboutSection orchestrator + add ProjectNavigation atom + retype AboutPinned</name>
  <files>
    src/components/sections/v2/about/ProjectNavigation.tsx
    src/components/sections/v2/AboutSection.tsx
    src/components/sections/v2/about/AboutPinned.tsx
  </files>
  <action>
    Three coordinated edits — all are top-of-page changes; group them so the executor doesn't context-switch between hero shape and block typography.

    === 1A. Create `src/components/sections/v2/about/ProjectNavigation.tsx` (Change 2) ===

    Client component. Single named export `ProjectNavigation`.

    ```tsx
    'use client'

    import Link from 'next/link'
    import type { ReactNode } from 'react'

    interface ProjectNavigationProps {
      /** Optional second slot for future next/prev project links. Reserved — does not render today. */
      secondary?: ReactNode
    }

    export function ProjectNavigation({ secondary: _secondary }: ProjectNavigationProps = {}) {
      return (
        <nav
          aria-label="Page navigation"
          className="border-t border-border-secondary px-5 md:px-8 lg:px-16 py-5"
        >
          <Link
            href="/"
            className="font-mono text-xs uppercase tracking-[1.12px] text-text-tertiary hover:text-text-primary transition-colors duration-200"
          >
            ← Back to Home
          </Link>
        </nav>
      )
    }
    ```

    Notes:
    - The `secondary` prop is accepted but intentionally NOT rendered (the user wants to keep the door open for next/prev project but ship just the back link).
    - `font-mono` + `text-xs` matches the Welcome Bar / SectionDivider mono-label voice.
    - `uppercase tracking-[1.12px]` matches the existing `SectionDivider`/Core Expertise label rhythm.

    === 1B. Refactor `src/components/sections/v2/AboutSection.tsx` (Change 1) ===

    Replace the entire file with this composition:

    ```tsx
    'use client'

    import { StickyLogoBar } from '@/components/sections/v2/StickyLogoBar'
    import { ProjectNavigation } from '@/components/sections/v2/about/ProjectNavigation'
    import { AboutPinned } from '@/components/sections/v2/about/AboutPinned'
    import { BioBlock } from '@/components/sections/v2/about/BioBlock'
    import { SkillsBlock } from '@/components/sections/v2/about/SkillsBlock'
    import { ClientsBlock } from '@/components/sections/v2/about/ClientsBlock'
    import { EducationBlock } from '@/components/sections/v2/about/EducationBlock'

    /**
     * /about page orchestrator.
     *
     * Sequence (Figma 701:303):
     *   bg-bg-surface-secondary band → <StickyLogoBar/>          ← only the pills row (no welcome bar, no headline)
     *   <ProjectNavigation/>                                       ← `← Back to Home` mono strip
     *   <AboutPinned/>                                             ← image-pin + first-paragraph reveal
     *   <BioBlock/> + <SkillsBlock/> + <ClientsBlock/> + <EducationBlock/>
     *
     * The home (/) IntroSection still composes welcome bar + StickyLogoBar + headline; only this page
     * drops the welcome bar and headline.
     */
    export function AboutSection() {
      return (
        <div className="min-h-screen bg-bg">
          {/* Hero band — same wrapper shape (bg + top padding) as the home,
              but ONLY the sticky pills row is rendered inside.
              No welcome bar, no Hero. */}
          <div className="bg-bg-surface-secondary pt-8 md:pt-10 lg:pt-12">
            <StickyLogoBar />
          </div>

          {/* Mono nav strip below the pills */}
          <ProjectNavigation />

          {/* Image pin + first-paragraph reveal */}
          <AboutPinned />

          {/* Numbered subsections */}
          <BioBlock />
          <SkillsBlock />
          <ClientsBlock />
          <EducationBlock />
        </div>
      )
    }
    ```

    Critical:
    - DO NOT remove or modify `IntroSection.tsx`. Home `/` keeps its welcome bar + sticky bar + headline + tags exactly as today.
    - DO NOT delete or rename `Hero.tsx` — it's still used by `ProjectPageShell`.
    - The `<div className="bg-bg-surface-secondary pt-8 md:pt-10 lg:pt-12">` wrapper preserves the continuous bg color behind the sticky bar (per CLAUDE.md "Wrapper provides background" rule).
    - The previous file imported `content` and `Hero` — drop both imports along with the Hero render.

    === 1C. Retype the first paragraph in `AboutPinned.tsx` (Change 3) ===

    Open `src/components/sections/v2/about/AboutPinned.tsx`. Locate the `<p>` element that renders `firstParagraph` (around line 108–120). Replace ONLY its `style` block. The new style must produce: Fabio XM, fontSize 3rem (48px), fontWeight 400, lineHeight 1.15, letterSpacing -0.96px.

    Keep the dynamic `opacity: paragraphOpacity` and reduced-motion `transition` exactly as today.

    Replace the existing `style` object on the paragraph with:
    ```tsx
    style={{
      fontFamily: 'var(--font-sans)',
      fontSize: '3rem',
      lineHeight: 1.15,
      letterSpacing: '-0.96px',
      fontWeight: 400,
      opacity: paragraphOpacity,
      transition: reducedMotion ? 'none' : 'opacity 60ms linear',
    }}
    ```

    Do NOT touch:
    - `useScrollVideo` import or call
    - `IMAGE_ENTRY_END`, `IMAGE_TRANSLATE_START`, `IMAGE_MAX_OPACITY`, `PARA_FADE_*`, `EXIT_*` constants
    - The image canvas wrapper, its `transform`, its `opacity`, its `transition`
    - The 400vh container or sticky inner div
    - The `reducedMotion` state hook or its useEffect
    - The grid `col-span-*` / `col-start-*` classes (image stays in cols 5-8, paragraph stays at full 12)

    Only change: the four typography properties on the paragraph's style object (fontSize, fontWeight, lineHeight, letterSpacing).
  </action>
  <verify>
    <automated>cd /Users/caioogata/Projects/portolio-v1 && pnpm typecheck 2>&1 | tail -20</automated>
  </verify>
  <done>
    - `src/components/sections/v2/about/ProjectNavigation.tsx` exists, exports `ProjectNavigation`, renders a `<Link href="/">← Back to Home</Link>` with mono/uppercase styling and a `border-t border-border-secondary`.
    - `src/components/sections/v2/AboutSection.tsx` no longer imports `content`, `Content`, or `Hero`. It renders: bg-band > StickyLogoBar; then `<ProjectNavigation/>`; then `<AboutPinned/>` and the four blocks.
    - `src/components/sections/v2/IntroSection.tsx` is UNCHANGED (home regression check).
    - `AboutPinned.tsx`'s first paragraph style is exactly `{ fontFamily: 'var(--font-sans)', fontSize: '3rem', lineHeight: 1.15, letterSpacing: '-0.96px', fontWeight: 400, opacity: paragraphOpacity, transition: ... }`. Scroll/scrub logic untouched.
    - `pnpm typecheck` exits 0.
  </done>
</task>

<task type="auto">
  <name>Task 2: Reorganize BioBlock + standardize EducationBlock + retype ClientsBlock and remove cell borders</name>
  <files>
    src/components/sections/v2/about/BioBlock.tsx
    src/components/sections/v2/about/EducationBlock.tsx
    src/components/sections/v2/about/ClientsBlock.tsx
  </files>
  <action>
    Three "list-style" blocks change to a shared "spacer (cols 1-4) + content (cols 5-12)" rhythm and a typography refresh on the Clients description. Group them so the executor sees the pattern repeat across all three files.

    Important Tailwind/Grid prerequisite — `lg:col-start-5` is NOT in the GridItem static class map (`Grid.tsx` only has `col-span-*` maps). Tailwind's JIT WILL pick up arbitrary classes embedded as literal strings in JSX, so we apply col-start via the `className` prop on `GridItem`. The classes used in this task — `lg:col-start-5`, `md:col-start-1` — appear elsewhere in the codebase (e.g., `AboutPinned.tsx` already uses `lg:col-start-5`) so they're guaranteed to be in the JIT bucket. Do not introduce any new col-start values that aren't already in use.

    === 2A. `src/components/sections/v2/about/BioBlock.tsx` (Change 4) ===

    Replace the file body (keep the imports + `typedContent`/`about` const + the file-level docstring updated). New structure:

    ```tsx
    'use client'

    import { useInView } from '@/hooks/useInView'
    import { Grid, GridItem } from '@/components/layout/Grid'
    import { SectionDivider } from './SectionDivider'
    import content from '@/content/en.json'
    import type { Content } from '@/content/types'

    const typedContent = content as unknown as Content
    const about = typedContent.about

    /**
     * 1.1 / Bio block. Layout per Figma 701:303:
     *   - Spacer GridItem in cols 1-4 (empty)
     *   - Content GridItem in cols 5-12: Core Expertise list, then a 64px gap, then bio paragraphs
     *   - Below the column area: full-width final quote (Fabio XM 48px text-text-secondary)
     *
     * Source paragraphs come from `about.bio.split('\n\n')`:
     *   index 0       → first paragraph (rendered inside <AboutPinned/>, NOT here)
     *   indices 1..n-2 → middle paragraphs (rendered in cols 5-12 stack)
     *   last index    → final quote (rendered full-width below column area)
     *
     * If there are fewer than 3 paragraphs total, the final-quote slot reuses the last
     * available middle paragraph (defensive — copy may shrink).
     */
    export function BioBlock() {
      const contentRef = useInView({ threshold: 0.1, once: true })
      const allParagraphs = about.bio.split('\n\n')
      // First paragraph lives in <AboutPinned/>. We work with the rest.
      const remaining = allParagraphs.slice(1)
      const middleParagraphs = remaining.length > 1 ? remaining.slice(0, -1) : []
      const finalQuote = remaining.length > 0 ? remaining[remaining.length - 1] : ''

      return (
        <div>
          <SectionDivider code="1.1" label="Bio" />

          <div
            ref={contentRef as React.RefObject<HTMLDivElement>}
            className="px-5 md:px-8 lg:px-16 py-16 md:py-24 lg:py-32"
          >
            <Grid className="!px-0">
              {/* Spacer cols 1-4 (mobile collapses) */}
              <GridItem span={4} tabletSpan={2} mobileSpan={4} />

              {/* Content cols 5-12 */}
              <GridItem
                span={8}
                tabletSpan={6}
                mobileSpan={4}
                className="lg:col-start-5"
              >
                {/* Core Expertise — same internal markup as today */}
                <div className="flex flex-col w-full">
                  <span
                    className="text-sm font-medium uppercase tracking-[1.12px] text-text-tertiary py-3"
                    style={{ fontFamily: 'var(--font-sans)' }}
                  >
                    Core Expertise
                  </span>
                  {about.expertise.map((item) => (
                    <p
                      key={item}
                      className="text-base text-text-primary py-3 border-t border-border-secondary"
                      style={{ fontFamily: 'var(--font-sans)' }}
                    >
                      {item}
                    </p>
                  ))}
                </div>

                {/* 64px gap between Core Expertise and bio paragraph stack */}
                <div className="mt-16">
                  <div className="flex flex-col gap-6">
                    {middleParagraphs.map((paragraph, i) => (
                      <p
                        key={i}
                        className={`-entrance -slide-up -a-${Math.min(i, 19)} text-[24px] font-semibold leading-[1.3] text-text-secondary`}
                        style={{ fontFamily: 'var(--font-sans)' }}
                      >
                        {paragraph}
                      </p>
                    ))}
                  </div>
                </div>
              </GridItem>
            </Grid>

            {/* Final quote — full 12 cols, below the column area */}
            {finalQuote && (
              <p
                className={`-entrance -slide-up -a-${Math.min(middleParagraphs.length, 19)} mt-16 md:mt-20 text-text-secondary`}
                style={{
                  fontFamily: 'var(--font-sans)',
                  fontSize: '3rem',
                  lineHeight: 1.15,
                  letterSpacing: '-0.96px',
                  fontWeight: 400,
                }}
              >
                {finalQuote}
              </p>
            )}
          </div>
        </div>
      )
    }
    ```

    Notes:
    - `mt-16` = 64px (Tailwind v4 default scale 4 = 1rem). The user described "gap-64" verbally meaning ~64px — express as `mt-16` since it's a single-direction gap inside the column.
    - `useInView` ref now sits on the OUTER `div.px-5...py-16` wrapper so the entrance class propagates to the bio paragraph stack AND the final quote (siblings under the same observed element).
    - `-a-N` continues from the middle-paragraph stagger so the final quote enters last — `Math.min(middleParagraphs.length, 19)`.

    === 2B. `src/components/sections/v2/about/EducationBlock.tsx` (Change 7) ===

    Replace the outer `<Grid>` body (keep `useMemo`, `getSortYear`, `getDisplayYear`, the imports, and the section divider). New body of the inner content div:

    ```tsx
    return (
      <div>
        <SectionDivider code="1.4" label="Education" />

        <div
          ref={blockRef as React.RefObject<HTMLDivElement>}
          className="px-5 md:px-8 lg:px-16 py-16 md:py-24 lg:py-32"
        >
          <Grid className="!px-0">
            {/* Spacer cols 1-4 */}
            <GridItem span={4} tabletSpan={2} mobileSpan={4} />

            {/* Content cols 5-12 */}
            <GridItem
              span={8}
              tabletSpan={6}
              mobileSpan={4}
              className="lg:col-start-5"
            >
              <div className="flex flex-col">
                {allEducation.map((edu, index) => {
                  const stagger = Math.min(index, 19)
                  return (
                    <div
                      key={`${edu.institution}-${edu.year}-${index}`}
                      className={`-entrance -slide-up -a-${stagger} flex gap-5 md:gap-8 border-t border-border-secondary py-6 md:py-8`}
                    >
                      {/* Year stamp — fixed width */}
                      <span className="font-mono text-sm text-text-tertiary w-[100px] shrink-0">
                        {getDisplayYear(edu.year)}
                      </span>

                      {/* Info stack — flex-1 */}
                      <div className="flex flex-col gap-1 flex-1">
                        <h3
                          className="text-lg md:text-xl text-text-primary"
                          style={{ fontFamily: 'var(--font-sans)', fontWeight: 600 }}
                        >
                          {edu.institution}
                        </h3>
                        <p
                          className="text-base text-text-secondary"
                          style={{ fontFamily: 'var(--font-sans)' }}
                        >
                          {edu.degree}
                        </p>
                        <p className="font-mono text-xs text-text-tertiary">
                          {edu.location}
                        </p>
                        {edu.note && (
                          <p
                            className="text-sm text-text-secondary mt-2"
                            style={{ fontFamily: 'var(--font-sans)' }}
                          >
                            {edu.note}
                          </p>
                        )}
                      </div>
                    </div>
                  )
                })}
              </div>
            </GridItem>
          </Grid>
        </div>
      </div>
    )
    ```

    Notes:
    - The inner `<Grid className="!px-0 py-6 md:py-8">` and inner `<GridItem span={2}>` / `<GridItem span={10}>` are GONE — replaced by a flat `flex gap-5 md:gap-8`.
    - `w-[100px]` for the year column matches the Core Expertise label rhythm (the year is the "label" of each row).
    - All existing fields preserved: institution → degree → location → optional note.

    === 2C. `src/components/sections/v2/about/ClientsBlock.tsx` (Change 6) ===

    Two coordinated edits in this file:

    (i) Description typography (the `<p>` inside the description Grid). Replace its className + style with:
    ```tsx
    <p
      className="-entrance -slide-up -a-0 text-text-secondary"
      style={{
        fontFamily: 'var(--font-sans)',
        fontSize: '2.25rem',
        lineHeight: 1.25,
        letterSpacing: '-0.36px',
        fontWeight: 700,
      }}
    >
      {shortDescription}
    </p>
    ```

    (ii) Logo grid: REMOVE the entire `CELL_BORDERS: string[]` constant (lines ~50–71) AND remove `borderClass` consumption inside the `.map(...)`. The new cell looks like:
    ```tsx
    <div
      key={client}
      className={`-entrance -fade -a-${stagger} min-h-[120px] flex items-center justify-center`}
    >
      {logo ? (
        <Image ... />
      ) : (
        <span ...>{client}</span>
      )}
    </div>
    ```

    Keep:
    - `Image` import + the `<Image>` element with all current props (`src`, `alt`, `width={120}`, `height={48}`, `className="object-contain max-h-[44px] max-w-[108px]${imgClass}"`, `unoptimized`).
    - The fallback `<span>` for missing logos.
    - The 16-cell `min-h-[120px]` cell sizing.
    - The `grid grid-cols-2 lg:grid-cols-4` parent (no border-related classes on it either).
    - The `CLIENT_LOGOS` map (still needed).
    - `useInView`, the description Grid wrapper, the entrance staggers `-a-N`.

    Discard:
    - `CELL_BORDERS` constant (and the `const borderClass = CELL_BORDERS[index] ?? ''` line — replace with nothing).
    - Any `border-r`, `border-t`, `lg:border-r`, `lg:border-t`, `border-border-secondary` classes on cells.
  </action>
  <verify>
    <automated>cd /Users/caioogata/Projects/portolio-v1 && pnpm typecheck 2>&1 | tail -20</automated>
  </verify>
  <done>
    - `BioBlock.tsx`: outer Grid uses span={4} spacer + span={8} `lg:col-start-5` content; inside content, Core Expertise renders first, then `mt-16` gap, then middle bio paragraphs in a flex-col gap-6 stack. Below the Grid (still inside `px-5...` wrapper), the final paragraph from `about.bio.split('\n\n')` renders with Fabio XM 48px / 400 / 1.15 / -0.96px text-text-secondary at full width.
    - `EducationBlock.tsx`: outer Grid is span={4} spacer + span={8} `lg:col-start-5`; each row is `flex gap-5 md:gap-8 border-t border-border-secondary py-6 md:py-8` with year `w-[100px] shrink-0` + info `flex-1`. No inner Grid. `getSortYear`/`getDisplayYear` untouched.
    - `ClientsBlock.tsx`: description `<p>` uses `style={{ fontFamily: 'var(--font-sans)', fontSize: '2.25rem', lineHeight: 1.25, letterSpacing: '-0.36px', fontWeight: 700 }}`. The `CELL_BORDERS` const is deleted. No cell renders any `border-*` class. Logo wall is just `grid grid-cols-2 lg:grid-cols-4` of `min-h-[120px] flex items-center justify-center` cells.
    - `pnpm typecheck` exits 0.
  </done>
</task>

<task type="auto">
  <name>Task 3: Rebuild SkillsBlock as exclusive hover/focus accordion + verify build + single final commit</name>
  <files>
    src/components/sections/v2/about/SkillsBlock.tsx
  </files>
  <action>
    Full rewrite of `SkillsBlock.tsx` per Change 5. This is the largest individual edit so it gets its own task.

    === 3A. Replace the file content with the new accordion ===

    ```tsx
    'use client'

    import { useEffect, useState } from 'react'
    import { useInView } from '@/hooks/useInView'
    import { Grid, GridItem } from '@/components/layout/Grid'
    import { SectionDivider } from './SectionDivider'
    import content from '@/content/en.json'
    import type { Content, Skill } from '@/content/types'

    const typedContent = content as unknown as Content
    const skillsData = typedContent.skills

    /**
     * Static class map: hover-revealed bar width per skill level.
     * Tailwind needs literal strings — never construct these via template literals.
     */
    const LEVEL_WIDTH_CLASS: Record<Skill['level'], string> = {
      Expert: 'group-hover:w-[95%]',
      Advanced: 'group-hover:w-[75%]',
      Proficient: 'group-hover:w-[55%]',
      Familiar: 'group-hover:w-[35%]',
    }

    /**
     * 1.2 / Skills — exclusive accordion. Per Figma 701:303:
     *   - Spacer cols 1-4 (empty), content cols 5-12.
     *   - Each category is a track-line + header (label + count + +/− indicator).
     *   - Hover/focus expands that category and collapses any other.
     *   - The expanded panel renders a list of skills; each skill row reveals
     *     a level-mapped yellow bar on row hover (text turns inverse).
     */
    export function SkillsBlock() {
      const blockRef = useInView({ threshold: 0.1, once: true })
      const [expanded, setExpanded] = useState<string | null>(null)
      const [reducedMotion, setReducedMotion] = useState(false)

      useEffect(() => {
        setReducedMotion(window.matchMedia('(prefers-reduced-motion: reduce)').matches)
      }, [])

      return (
        <div>
          <SectionDivider code="1.2" label="Skills" />

          <div
            ref={blockRef as React.RefObject<HTMLDivElement>}
            className="px-5 md:px-8 lg:px-16 py-16 md:py-24 lg:py-32"
          >
            <Grid className="!px-0">
              {/* Spacer cols 1-4 */}
              <GridItem span={4} tabletSpan={2} mobileSpan={4} />

              {/* Content cols 5-12 */}
              <GridItem
                span={8}
                tabletSpan={6}
                mobileSpan={4}
                className="lg:col-start-5"
              >
                <div className="flex flex-col">
                  {skillsData.categories.map((category, catIndex) => {
                    const isOpen = expanded === category.title
                    const stagger = Math.min(catIndex, 19)
                    const open = () => setExpanded(category.title)

                    return (
                      <div
                        key={category.title}
                        className={`-entrance -slide-up -a-${stagger} border-t border-border-secondary`}
                        onMouseEnter={open}
                      >
                        {/* Header row — focusable button (keyboard parity). No click toggle (hover-only spec). */}
                        <button
                          type="button"
                          onFocus={open}
                          aria-expanded={isOpen}
                          className="flex items-center justify-between w-full py-5 text-left"
                        >
                          <span
                            className="text-sm font-medium uppercase tracking-[1.12px] text-text-tertiary"
                            style={{ fontFamily: 'var(--font-sans)' }}
                          >
                            {category.title}
                          </span>
                          <span className="flex items-center gap-3">
                            <span className="font-mono text-xs text-text-tertiary">
                              {String(category.skills.length).padStart(2, '0')}
                            </span>
                            <span
                              className="font-mono text-base text-text-tertiary w-4 text-center"
                              aria-hidden="true"
                            >
                              {isOpen ? '−' : '+'}
                            </span>
                          </span>
                        </button>

                        {/* Panel — expand/collapse via grid-template-rows trick (no JS height math). */}
                        <div
                          className={`grid ${isOpen ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'} ${
                            reducedMotion ? '' : 'transition-[grid-template-rows] duration-500 ease-[cubic-bezier(0.5,0,0.3,1)]'
                          }`}
                        >
                          <div className="overflow-hidden">
                            <div className="flex flex-col pb-5">
                              {category.skills.map((skill) => {
                                const fillWidth = LEVEL_WIDTH_CLASS[skill.level] ?? 'group-hover:w-[50%]'
                                return (
                                  <div
                                    key={skill.name}
                                    className="group relative overflow-hidden p-2 cursor-default"
                                  >
                                    {/* Bar (z-0) */}
                                    <span
                                      aria-hidden="true"
                                      className={`absolute inset-y-0 left-0 w-0 bg-fill-primary ${fillWidth} ${
                                        reducedMotion
                                          ? ''
                                          : 'transition-all duration-500 ease-[cubic-bezier(0.5,0,0.3,1)]'
                                      }`}
                                    />
                                    {/* Text row (z-10) */}
                                    <div className="relative z-10 flex items-center justify-between">
                                      <span
                                        className={`text-base text-text-primary group-hover:text-text-inverse ${
                                          reducedMotion ? '' : 'transition-colors duration-300'
                                        }`}
                                        style={{ fontFamily: 'var(--font-sans)', fontWeight: 400 }}
                                      >
                                        {skill.name}
                                      </span>
                                      <span
                                        className={`font-mono text-xs text-text-tertiary group-hover:text-text-inverse ${
                                          reducedMotion ? '' : 'transition-colors duration-300'
                                        }`}
                                      >
                                        {skill.level}
                                      </span>
                                    </div>
                                  </div>
                                )
                              })}
                            </div>
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </GridItem>
            </Grid>
          </div>
        </div>
      )
    }
    ```

    Critical implementation notes:
    - Exclusive accordion: `setExpanded(category.title)` on hover/focus. Only one category open at a time. The container does NOT auto-collapse on `onMouseLeave` — it stays expanded until ANOTHER category is hovered (per spec).
    - Keyboard parity via `onFocus={open}` on the header `<button>` — Tab moves focus across category headers, each focus opens the corresponding panel.
    - No click toggle: clicking the button is a no-op for the accordion (the user said hover-only). Touch users get expansion via focus (tapping focuses on iOS Safari and Android Chrome — acceptable per spec). Do NOT add `onClick={() => setExpanded(...)}`.
    - Panel transition uses the established Phase 04 pattern: `grid grid-rows-[0fr]` ↔ `grid-rows-[1fr]` with `transition-[grid-template-rows]` on the outer + `overflow-hidden` on the inner. Decision logged in Phase 04 SUMMARYs (D-04: "CSS grid-template-rows 0fr/1fr for accordion — natural content sizing").
    - Bar reveal: `bg-fill-primary` div absolute-positioned at `inset-y-0 left-0 w-0`, with Tailwind `group-hover:w-[95%]` (etc.) class from `LEVEL_WIDTH_CLASS`. Text on top has `group-hover:text-text-inverse` for readability over yellow.
    - All transitions disabled when `reducedMotion === true`.
    - Stagger `-entrance -slide-up -a-N` continues to entrance the categories in.
    - The `pb-5` inside the panel inner gives the last skill row breathing room when expanded.

    Edge cases / verification:
    - The previous local `LEVEL_WIDTH` constant (with raw `'95%'` strings) is REPLACED by `LEVEL_WIDTH_CLASS` (Tailwind class strings). Do NOT keep both.
    - `'use client'` directive at top.
    - `Skill` type imported from `@/content/types` (already there). If TS complains about indexing `LEVEL_WIDTH_CLASS` with a `string` instead of `Skill['level']`, narrow with the lookup-with-fallback pattern (`LEVEL_WIDTH_CLASS[skill.level] ?? 'group-hover:w-[50%]'`).

    === 3B. Verify the build ===

    After the file is written, run:
    1. `pnpm typecheck` — must exit 0.
    2. `pnpm build` — must succeed (static export). If the pre-existing `WasmHash._updateWithBuffer` cache corruption surfaces (logged in STATE.md from quick tasks 260425-p77 and 260425-rcw), attempt a clean: `rm -rf .next/cache && pnpm build`. If it still fails with the same WasmHash error, surface the failure in the summary and continue to commit (per the precedent set by 260425-p77/rcw — this is environmental, not code-related). If it fails for any OTHER reason, fix the code first.

    === 3C. Single final commit (covers ALL 7 changes from Tasks 1-3) ===

    Run exactly once after the build verification:

    ```bash
    node "$HOME/.claude/get-shit-done/bin/gsd-tools.cjs" commit "refactor(quick-260426-sjr): refine /about page V2 to match Figma 701:303" --files src/components/sections/v2/AboutSection.tsx src/components/sections/v2/about/ProjectNavigation.tsx src/components/sections/v2/about/AboutPinned.tsx src/components/sections/v2/about/BioBlock.tsx src/components/sections/v2/about/SkillsBlock.tsx src/components/sections/v2/about/ClientsBlock.tsx src/components/sections/v2/about/EducationBlock.tsx
    ```

    The user explicitly authorized ONE commit covering all 7 changes — do not split into multiple commits.
  </action>
  <verify>
    <automated>cd /Users/caioogata/Projects/portolio-v1 && pnpm typecheck 2>&1 | tail -20 && pnpm build 2>&1 | tail -30</automated>
  </verify>
  <done>
    - `SkillsBlock.tsx` is fully rewritten with: span={4} spacer + span={8} `lg:col-start-5` content, `useState<string | null>('expanded')`, `LEVEL_WIDTH_CLASS` Tailwind-class map, exclusive accordion on hover/focus, `grid-rows-[0fr↔1fr]` panel transition, per-row `group-hover:w-[X%]` yellow bar with `text-text-inverse` text.
    - `pnpm typecheck` exits 0. `pnpm build` succeeds (or surfaces only the known pre-existing WasmHash corruption — flag in summary if encountered).
    - One git commit exists with the message `refactor(quick-260426-sjr): refine /about page V2 to match Figma 701:303` containing all 7 changed files.
    - Visiting /about (mentally / via screenshot review later) shows: pills row → Back to Home → AboutPinned with Fabio XM 48px first paragraph → BioBlock with right-aligned content + full-width quote → SkillsBlock accordion → ClientsBlock with Bold 36px description and borderless logo grid → EducationBlock flat list.
    - Visiting /home (mentally) shows the Welcome bar + sticky pills + Bridging headline + tags exactly as before (no regression).
  </done>
</task>

</tasks>

<verification>
- `pnpm typecheck` exits 0 after each task
- `pnpm build` succeeds (static export `output: 'export'`)
- Manual smoke (eyeball after dev server runs):
  - `/about` no longer shows the welcome bar or the Bridging headline; only the pills row + back link + the four content blocks
  - `/` (home) is byte-equivalent to before (welcome bar + pills + Bridging headline + tags)
  - AboutPinned first paragraph renders in Fabio XM ~48px
  - BioBlock middle paragraphs sit in cols 5-12; the final quote sits at full 12 cols below
  - SkillsBlock: hovering "Design Systems" header opens its panel and closes any previously open one; hovering a skill row reveals the yellow bar at the level-mapped width
  - ClientsBlock: description in Fabio XM Bold 36px; the 16 logos render with NO borders or dividers
  - EducationBlock: each row is a flat `year + info` flex pair, no inner grid alignment artifacts
- Git: exactly one new commit with the planned message; all 7 files staged together
</verification>

<success_criteria>
1. All 7 file changes (1 created + 6 edited) match the field-level spec in this plan.
2. `pnpm typecheck` and `pnpm build` succeed.
3. Home `/` IntroSection is unchanged (no welcome-bar/headline regression).
4. Single commit `refactor(quick-260426-sjr): refine /about page V2 to match Figma 701:303` lands all changes together.
5. `prefers-reduced-motion` disables every new transition (accordion, bar reveal, color swap).
6. Static class maps used wherever Tailwind needs literal strings (LEVEL_WIDTH_CLASS, no template-literal class strings beyond the existing `-a-${N}` Phase-04 stagger pattern which already exists in the codebase).
</success_criteria>

<output>
After completion, create `.planning/quick/260426-sjr-refine-about-page-v2-to-match-figma-701-/260426-sjr-SUMMARY.md` capturing:
- Files touched + a one-line description of each change
- Whether `pnpm build` cleanly succeeded or surfaced the known WasmHash cache corruption
- The single commit SHA and message
- Any deviation from the plan (with reasoning)
</output>
