---
phase: quick-260425-rcw
plan: 01
type: execute
wave: 1
depends_on: []
files_modified:
  - src/components/sections/v2/Hero.tsx
  - src/components/sections/v2/project/ProjectHero.tsx
  - src/content/types.ts
  - src/content/en.json
  - src/content/pt-br.json
  - src/components/sections/v2/about/AboutPinned.tsx
  - src/components/sections/v2/about/BioBlock.tsx
  - src/components/sections/v2/AboutSection.tsx
autonomous: true
requirements:
  - QUICK-260425-rcw
must_haves:
  truths:
    - "/projects/* hero text section renders byte-equivalent (kicker + technologies + body) to current ProjectHero — zero visual regression"
    - "/about renders new sequence: Hero (rise) → AboutPinned (image pin + paragraph reveal) → BioBlock (without first paragraph) → SkillsBlock → ClientsBlock → EducationBlock"
    - "Hero component is reused across /about (no technologies, full-width headline) and /projects/* (with technologies, 4-8 split)"
    - "AboutPinned image enters from below during first 20% of scroll, pins, scrubs 241 frames, paragraph fades in during 20–40% scroll progress"
    - "BioBlock renders only paragraphs 2..N of about.bio (first paragraph belongs to AboutPinned)"
    - "about.headline content exists in both en.json and pt-br.json with proper PT-BR translation"
    - "prefers-reduced-motion users see Hero/AboutPinned without slide-up motion (image at translateY 0, paragraph visible immediately)"
  artifacts:
    - path: "src/components/sections/v2/Hero.tsx"
      provides: "Shared text-only hero component (kicker + optional technologies + headline)"
      exports: ["Hero"]
    - path: "src/components/sections/v2/about/AboutPinned.tsx"
      provides: "Image-pin + paragraph reveal section using useScrollVideo"
      exports: ["AboutPinned"]
    - path: "src/components/sections/v2/project/ProjectHero.tsx"
      provides: "Project hero — refactored to compose <Hero/> + noise gradient image"
      contains: "<Hero"
    - path: "src/components/sections/v2/AboutSection.tsx"
      provides: "About page orchestrator — Hero zone wrapper + AboutPinned + 4 blocks"
      contains: "<Hero"
    - path: "src/components/sections/v2/about/BioBlock.tsx"
      provides: "Bio block rendering paragraphs[1..N] only"
      contains: ".slice(1)"
    - path: "src/content/types.ts"
      provides: "Content.about.headline?: string typing"
      contains: "headline?: string"
    - path: "src/content/en.json"
      provides: "about.headline EN copy"
      contains: '"headline":'
    - path: "src/content/pt-br.json"
      provides: "about.headline PT-BR copy"
      contains: '"headline":'
  key_links:
    - from: "src/components/sections/v2/project/ProjectHero.tsx"
      to: "src/components/sections/v2/Hero.tsx"
      via: "import + JSX usage"
      pattern: "import.*Hero.*from.*['\"]@/components/sections/v2/Hero"
    - from: "src/components/sections/v2/AboutSection.tsx"
      to: "src/components/sections/v2/Hero.tsx"
      via: "import + JSX usage"
      pattern: "import.*Hero.*from.*['\"]@/components/sections/v2/Hero"
    - from: "src/components/sections/v2/AboutSection.tsx"
      to: "src/components/sections/v2/about/AboutPinned.tsx"
      via: "import + JSX usage"
      pattern: "import.*AboutPinned"
    - from: "src/components/sections/v2/about/AboutPinned.tsx"
      to: "src/hooks/useScrollVideo.ts"
      via: "useScrollVideo hook"
      pattern: "useScrollVideo\\("
    - from: "src/components/sections/v2/about/AboutPinned.tsx"
      to: "src/content/en.json"
      via: "about.bio.split('\\n\\n')[0]"
      pattern: "about\\.bio\\.split"
    - from: "src/components/sections/v2/about/BioBlock.tsx"
      to: "src/content/en.json"
      via: "about.bio.split('\\n\\n').slice(1)"
      pattern: "\\.slice\\(1\\)"
---

<objective>
Decouple /about from the current sticky-everything mess by extracting a shared Hero component and introducing a dedicated AboutPinned image-pin section. The first bio paragraph migrates from BioBlock to AboutPinned (where it reveals during the frame-scrub pin); BioBlock keeps only paragraphs 2..N. Project pages must remain visually identical (zero regression on /projects/*).

Purpose: Reuse the project hero text pattern as a primitive across pages, give the about page a calmer, more editorial structure, and clear out the entangled sticky+overlap logic in AboutSection.
Output: New `<Hero>` component, new `<AboutPinned>` component, refactored `ProjectHero`/`BioBlock`/`AboutSection`, content/types updated for `about.headline`.
</objective>

<execution_context>
@$HOME/.claude/get-shit-done/workflows/execute-plan.md
@$HOME/.claude/get-shit-done/templates/summary.md
</execution_context>

<context>
@CLAUDE.md
@.planning/STATE.md

@src/components/sections/v2/AboutSection.tsx
@src/components/sections/v2/IntroSection.tsx
@src/components/sections/v2/StickyLogoBar.tsx
@src/components/sections/v2/project/ProjectHero.tsx
@src/components/sections/v2/project/ProjectPageShell.tsx
@src/components/sections/v2/about/BioBlock.tsx
@src/components/sections/v2/about/SkillsBlock.tsx
@src/components/sections/v2/about/SectionDivider.tsx
@src/components/layout/Grid.tsx
@src/hooks/useScrollVideo.ts
@src/hooks/useInView.ts
@src/content/types.ts
@src/content/en.json
@src/content/pt-br.json

<interfaces>
<!-- Key types/exports the executor needs. Use these directly — do NOT explore the codebase to discover them. -->

From src/hooks/useScrollVideo.ts:
```typescript
export function useScrollVideo(opts?: {
  frameCount?: number       // default 241
  startFrame?: number       // default 26
  framePath?: string        // default '/about-frames/frame-'
  frameExtension?: string   // default '.jpg'
  scrollHeight?: number     // default 400 (vh) — applied via style on container
}): {
  containerRef: React.RefObject<HTMLDivElement | null>
  canvasRef: React.RefObject<HTMLCanvasElement | null>
  progress: number          // 0..1, scroll progress through container
}
// Reduced motion: progress is forced to 1, last frame drawn statically.
```

From src/hooks/useInView.ts:
```typescript
export function useInView(options?: {
  threshold?: number   // default 0.1
  rootMargin?: string  // default '0px'
  once?: boolean       // default true
}): React.RefObject<HTMLElement | null>
// On intersection, adds class "-inview" to the element. Descendants with -entrance classes will animate.
```

From src/components/layout/Grid.tsx:
```typescript
export const Grid: React.FC<{ className?: string; children?: React.ReactNode }>
export const GridItem: React.FC<{
  span?: number       // desktop 1..12
  tabletSpan?: number // tablet  1..8
  mobileSpan?: number // mobile  1..4
  className?: string
  children?: React.ReactNode
}>
// Grid root: grid-cols-4 gap-4 px-5  md:grid-cols-8 md:gap-5 md:px-8  lg:grid-cols-12 lg:px-16
```

From src/content/types.ts (current):
```typescript
export interface Content {
  about: {
    command: string
    heading: string
    bio: string           // multi-paragraph, split on '\n\n'
    expertise: string[]
    // headline?: string  // ← TO BE ADDED in Task 2
  }
  // ...
}
```

From src/components/sections/v2/project/ProjectHero.tsx (current text section, lines ~83-122 — the chunk to extract):
```tsx
<section className="flex flex-col justify-end min-h-[var(--height-hero)] pb-8 md:pb-10 lg:pb-12">
  <h1 className="sr-only">{project.title}</h1>
  <Grid>
    <GridItem span={12} tabletSpan={8} mobileSpan={4}>
      <span className="block font-mono text-xs uppercase tracking-[0.88px] text-text-tertiary mb-6 -entrance -fade -a-0">
        PRJ_{project.year} // {String(index + 1).padStart(3, '0')}
      </span>
    </GridItem>
    <GridItem span={4} tabletSpan={8} mobileSpan={4}>
      {project.technologies && (
        <p className="text-[14px] font-medium leading-[1.5] uppercase tracking-[1.12px] text-text-tertiary -entrance -fade -a-1"
           style={{ fontFamily: 'var(--font-sans)' }}>
          {project.technologies}
        </p>
      )}
    </GridItem>
    <GridItem span={8} tabletSpan={8} mobileSpan={4}>
      {section.body && (
        <p className="text-[48px] leading-[1.15] tracking-[-0.96px] text-text-primary -entrance -fade -a-1"
           style={{ fontFamily: 'var(--font-sans)' }}>
          {section.body}
        </p>
      )}
    </GridItem>
  </Grid>
</section>
```

From src/content/en.json:
```jsonc
"about": {
  "command": "whoami",
  "heading": "About",
  "bio": "My work bridges brand strategy, product craft, and technical implementation — ...\n\nThe most significant output of that approach is the Azion Console Kit — ...\n\nAt Azion Technologies I held three progressive roles ...\n\nWhat drives me is the gap between an idea and a real experience — ...",
  "expertise": [...]
}
```
First paragraph (`split('\n\n')[0]`):
> "My work bridges brand strategy, product craft, and technical implementation — designing and building at the intersection of design systems, developer experience, and product engineering, where craft and technical rigor reinforce each other rather than compete."

From src/content/pt-br.json — analogous structure; first paragraph:
> "Meu trabalho conecta estratégia de marca, craft de produto e implementação técnica — projetando e construindo na interseção entre design systems, developer experience e engenharia de produto, onde craft e rigor técnico se reforçam em vez de competir."
</interfaces>
</context>

<tasks>

<task type="auto" tdd="false">
  <name>Task 1: Extract shared Hero component and refactor ProjectHero to use it</name>
  <files>
    src/components/sections/v2/Hero.tsx (new),
    src/components/sections/v2/project/ProjectHero.tsx (modify)
  </files>
  <action>
    Create `src/components/sections/v2/Hero.tsx` as a `'use client'` component exporting `function Hero({ kicker, technologies, headline }: { kicker: string; technologies?: string; headline: string })`.

    Layout (clones the text section from ProjectHero verbatim, with conditional second-row split):
    ```tsx
    <section className="flex flex-col justify-end min-h-[var(--height-hero)] pb-8 md:pb-10 lg:pb-12">
      <Grid>
        <GridItem span={12} tabletSpan={8} mobileSpan={4}>
          <span className="block font-mono text-xs uppercase tracking-[0.88px] text-text-tertiary mb-6 -entrance -fade -a-0">
            {kicker}
          </span>
        </GridItem>

        {technologies ? (
          <>
            <GridItem span={4} tabletSpan={8} mobileSpan={4}>
              <p
                className="text-[14px] font-medium leading-[1.5] uppercase tracking-[1.12px] text-text-tertiary -entrance -fade -a-1"
                style={{ fontFamily: 'var(--font-sans)' }}
              >
                {technologies}
              </p>
            </GridItem>
            <GridItem span={8} tabletSpan={8} mobileSpan={4}>
              <p
                className="text-[48px] leading-[1.15] tracking-[-0.96px] text-text-primary -entrance -fade -a-1"
                style={{ fontFamily: 'var(--font-sans)' }}
              >
                {headline}
              </p>
            </GridItem>
          </>
        ) : (
          <GridItem span={12} tabletSpan={8} mobileSpan={4}>
            <p
              className="text-[48px] leading-[1.15] tracking-[-0.96px] text-text-primary -entrance -fade -a-1"
              style={{ fontFamily: 'var(--font-sans)' }}
            >
              {headline}
            </p>
          </GridItem>
        )}
      </Grid>
    </section>
    ```

    Imports: `Grid`, `GridItem` from `@/components/layout/Grid`. No `useInView` here — entrance is one-shot CSS via `-entrance -fade` (Pattern A); the consumer is responsible for putting this inside a `-inview`-tagged ancestor OR letting the page-level loaded gate fire it on mount.

    Then refactor `src/components/sections/v2/project/ProjectHero.tsx`:
    - Add `import { Hero } from '@/components/sections/v2/Hero'`.
    - Replace lines ~83-122 (the entire `<section className="flex flex-col justify-end ...">` block — including the `<h1 className="sr-only">` and the `<Grid>` with kicker/technologies/body) with:
      ```tsx
      <h1 className="sr-only">{project.title}</h1>
      <Hero
        kicker={`PRJ_${project.year} // ${String(index + 1).padStart(3, '0')}`}
        technologies={project.technologies}
        headline={section.body ?? ''}
      />
      ```
      Keep `<h1 className="sr-only">` outside `<Hero>` so the document outline is preserved (project title remains the page H1). The `<Hero>` itself uses `<p>` for the headline — same as current ProjectHero — so no heading semantics change.
    - Remove the now-unused `sectionRef` from `useInView()` call (the line `const sectionRef = useInView()` and its application to the removed `<section ref={sectionRef ...}>`). Keep `imageRef` and `expandRef` exactly as they are (image section is untouched).
    - Verify the surrounding fragment still wraps both `<h1>+<Hero>` and the image `<section>` (use `<>...</>`).

    DO NOT touch the noise gradient image section at all.
  </action>
  <verify>
    <automated>pnpm tsc --noEmit</automated>
    Manual sanity:
    - `grep -n "import { Hero }" src/components/sections/v2/project/ProjectHero.tsx` → returns 1 line.
    - `grep -n "min-h-\[var(--height-hero)\]" src/components/sections/v2/project/ProjectHero.tsx` → returns 0 lines (text section moved to Hero.tsx).
    - `grep -n "min-h-\[var(--height-hero)\]" src/components/sections/v2/Hero.tsx` → returns 1 line.
  </verify>
  <done>
    Hero.tsx exists, ProjectHero.tsx imports it, project hero text DOM is rendered via `<Hero>`, image section unchanged, `pnpm tsc --noEmit` exits 0.
  </done>
</task>

<task type="auto" tdd="false">
  <name>Task 2: Add about.headline content + Content.about.headline type</name>
  <files>
    src/content/types.ts (modify),
    src/content/en.json (modify),
    src/content/pt-br.json (modify)
  </files>
  <action>
    1. In `src/content/types.ts`, add `headline?: string` to the `about` shape inside `interface Content`. Insert immediately after `heading: string`:
       ```ts
       about: {
         command: string
         heading: string
         headline?: string   // ← NEW
         bio: string
         expertise: string[]
       }
       ```

    2. In `src/content/en.json`, inside the `"about"` object, add `"headline"` immediately after `"heading"` (around line 76-77):
       ```json
       "heading": "About",
       "headline": "Bridging brand strategy, product craft and technical workflow",
       "bio": "..."
       ```

    3. In `src/content/pt-br.json`, mirror the same insertion immediately after `"heading"`:
       ```json
       "heading": "Sobre",
       "headline": "Conectando brand strategy, product craft e technical workflow",
       "bio": "..."
       ```
       (Keep brand strategy / product craft / technical workflow in English — matches portfolio convention of leaving canonical industry terms untranslated.)

    Validate JSON syntax — both files must remain valid JSON (trailing commas forbidden, every string properly closed).
  </action>
  <verify>
    <automated>pnpm tsc --noEmit && node -e "JSON.parse(require('fs').readFileSync('src/content/en.json','utf8')); JSON.parse(require('fs').readFileSync('src/content/pt-br.json','utf8')); console.log('OK')"</automated>
    Sanity:
    - `grep -n '"headline"' src/content/en.json` → returns 1 hit inside about block.
    - `grep -n '"headline"' src/content/pt-br.json` → returns 1 hit inside about block.
    - `grep -n 'headline?: string' src/content/types.ts` → returns 1 hit.
  </verify>
  <done>
    Type updated, both locale JSON files contain `about.headline`, JSON parses cleanly, TypeScript compiles.
  </done>
</task>

<task type="auto" tdd="false">
  <name>Task 3: Build AboutPinned (image pin + paragraph reveal)</name>
  <files>
    src/components/sections/v2/about/AboutPinned.tsx (new)
  </files>
  <action>
    Create `src/components/sections/v2/about/AboutPinned.tsx`. `'use client'`. Implements the image-pin + paragraph-reveal pattern, following the same scroll-zone shape currently used in AboutSection (`useScrollVideo` containerRef + sticky inner layer).

    Imports:
    ```ts
    import { useEffect, useState } from 'react'
    import { useScrollVideo } from '@/hooks/useScrollVideo'
    import content from '@/content/en.json'
    import type { Content } from '@/content/types'
    ```

    Constants:
    ```ts
    const ENTRY_END = 0.2          // image slide-up completes here
    const PARA_FADE_START = 0.2    // paragraph fade begins right after image lands
    const PARA_FADE_END = 0.4      // paragraph fully visible by here
    ```

    Component shape:
    ```tsx
    export function AboutPinned() {
      const { containerRef, canvasRef, progress } = useScrollVideo()
      const [reducedMotion, setReducedMotion] = useState(false)

      useEffect(() => {
        setReducedMotion(window.matchMedia('(prefers-reduced-motion: reduce)').matches)
      }, [])

      const typedContent = content as unknown as Content
      const firstParagraph = typedContent.about.bio.split('\n\n')[0]

      // Image entry: 0 → ENTRY_END maps translateY 100% → 0%. Reduced motion = always 0.
      const entryProgress = reducedMotion ? 1 : Math.min(progress / ENTRY_END, 1)
      const imageStyle: React.CSSProperties = {
        transform: `translateY(${(1 - entryProgress) * 100}%)`,
      }

      // Paragraph fade: 0.2 → 0.4 maps opacity 0 → 1. Reduced motion = visible immediately.
      const paragraphOpacity = reducedMotion
        ? 1
        : Math.max(0, Math.min(1, (progress - PARA_FADE_START) / (PARA_FADE_END - PARA_FADE_START)))

      return (
        <div ref={containerRef} style={{ height: '400vh' }} className="relative">
          <div className="sticky top-0 h-screen overflow-hidden bg-bg flex items-center">
            <div className="w-full px-5 md:px-8 lg:px-16">
              <div className="grid grid-cols-4 md:grid-cols-8 lg:grid-cols-12 gap-4 md:gap-5 items-center">
                {/* Paragraph — cols 1-6 desktop */}
                <div className="col-span-4 md:col-span-8 lg:col-span-6">
                  <p
                    className="text-text-primary"
                    style={{
                      fontFamily: 'var(--font-sans)',
                      fontSize: 'clamp(1.75rem, 3.2vw, 2.5rem)', // ~28→40px
                      lineHeight: 1.4,
                      fontWeight: 500,
                      opacity: paragraphOpacity,
                      transition: reducedMotion ? 'none' : 'opacity 60ms linear',
                    }}
                  >
                    {firstParagraph}
                  </p>
                </div>

                {/* Image — cols 9-12 desktop, vertical aspect */}
                <div className="col-span-4 md:col-span-8 md:col-start-1 lg:col-span-4 lg:col-start-9">
                  <div
                    className="w-full aspect-[3/4] overflow-hidden bg-bg-surface-secondary"
                    style={imageStyle}
                  >
                    <canvas
                      ref={canvasRef}
                      className="block w-full h-full"
                      style={{ objectFit: 'cover' }}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )
    }
    ```

    Notes / rules followed:
    - Raw Tailwind grid utilities (`grid-cols-4 md:grid-cols-8 lg:grid-cols-12`) chosen over `<Grid>`/`<GridItem>` because we need vertical alignment (`items-center`) on the wrapper itself — `<Grid>` doesn't expose alignment props. Spans use static classes (`col-span-*`, `col-start-9`, etc.) — no template literals.
    - 400vh scroll container + sticky h-screen — same shape as the current AboutSection hero pin. Container height applied via `style={{ height: '400vh' }}` (matches useScrollVideo expectation).
    - `bg-bg` on sticky layer (semantic token). `bg-bg-surface-secondary` on the image fallback (same as current code, makes the empty-frame state read calmly).
    - Image stays in cols 9-12 (matches the existing /about layout the user just shipped in 260425-p77).
    - Paragraph in cols 1-6: gives editorial breathing room; the right column carries the image.
    - Typography: clamp 1.75-2.5rem, line-height 1.4, weight 500 — bigger than body, smaller than the new Hero headline (which is fixed 48px). Reads as a "destaque".
    - `prefers-reduced-motion`: image translateY locks at 0, paragraph opacity locks at 1, frames freeze at last frame (already handled inside useScrollVideo).
    - No `useInView` needed — the reveal is scroll-driven, not viewport-triggered.
    - DO NOT add `overflow-hidden` to the outer 400vh container (would break sticky behavior). The sticky inner layer keeps `overflow-hidden` for the image clip.
  </action>
  <verify>
    <automated>pnpm tsc --noEmit</automated>
    Sanity:
    - `grep -n "useScrollVideo" src/components/sections/v2/about/AboutPinned.tsx` → 1 hit.
    - `grep -n "about.bio.split" src/components/sections/v2/about/AboutPinned.tsx` → 1 hit.
    - `grep -n "sticky top-0" src/components/sections/v2/about/AboutPinned.tsx` → 1 hit.
    - `grep -nE "lg:col-(span-4|start-9)" src/components/sections/v2/about/AboutPinned.tsx` → 2 hits (image positioned in cols 9-12).
  </verify>
  <done>
    AboutPinned.tsx exists, exports `AboutPinned`, compiles with `pnpm tsc --noEmit`. Image pinned in cols 9-12 with slide-up entry; paragraph in cols 1-6 with opacity reveal; reduced-motion path documented.
  </done>
</task>

<task type="auto" tdd="false">
  <name>Task 4: Refactor BioBlock to skip first bio paragraph</name>
  <files>
    src/components/sections/v2/about/BioBlock.tsx (modify)
  </files>
  <action>
    In `src/components/sections/v2/about/BioBlock.tsx`, change the bio paragraph derivation. Currently:
    ```ts
    const paragraphs = about.bio.split('\n\n')
    ```
    Change to:
    ```ts
    // First paragraph lives in <AboutPinned/> (revealed during the image pin).
    // BioBlock renders the remaining narrative paragraphs.
    const paragraphs = about.bio.split('\n\n').slice(1)
    ```

    Everything else in BioBlock stays as-is — Core Expertise table, layout, stagger animation, SectionDivider, GridItem spans. The `paragraphs.map((paragraph, i) => ...)` block automatically renders one fewer paragraph because the source array is one shorter. Stagger indexing (`-a-${i}`) starts at 0 for the (now) first rendered paragraph — that is intentional and visually correct.
  </action>
  <verify>
    <automated>pnpm tsc --noEmit</automated>
    Sanity:
    - `grep -n "about.bio.split" src/components/sections/v2/about/BioBlock.tsx` → 1 hit ending with `.slice(1)`.
    - `grep -c "paragraphs.map" src/components/sections/v2/about/BioBlock.tsx` → 1.
  </verify>
  <done>
    BioBlock now renders paragraphs[1..N] (the first paragraph migrated to AboutPinned). Type-checks clean.
  </done>
</task>

<task type="auto" tdd="false">
  <name>Task 5: Rewrite AboutSection to compose Hero + AboutPinned + 4 blocks</name>
  <files>
    src/components/sections/v2/AboutSection.tsx (rewrite)
  </files>
  <action>
    Replace the entire body of `src/components/sections/v2/AboutSection.tsx` with the new orchestrator. Drop everything related to the old inline welcome bar, useScrollVideo wiring, slideStyle, and headline rendering — that logic now lives in AboutPinned (frame scrub) and Hero (headline) respectively.

    New file contents:
    ```tsx
    'use client'

    import content from '@/content/en.json'
    import type { Content } from '@/content/types'
    import { StickyLogoBar } from '@/components/sections/v2/StickyLogoBar'
    import { Hero } from '@/components/sections/v2/Hero'
    import { AboutPinned } from '@/components/sections/v2/about/AboutPinned'
    import { BioBlock } from '@/components/sections/v2/about/BioBlock'
    import { SkillsBlock } from '@/components/sections/v2/about/SkillsBlock'
    import { ClientsBlock } from '@/components/sections/v2/about/ClientsBlock'
    import { EducationBlock } from '@/components/sections/v2/about/EducationBlock'

    const typedContent = content as unknown as Content
    const about = typedContent.about

    export function AboutSection() {
      return (
        <div className="min-h-screen bg-bg">
          {/* Hero zone — same wrapper shape as ProjectPageShell:
              bg-bg-surface-secondary provides continuous color behind the sticky bar,
              top padding matches project pages. */}
          <div className="bg-bg-surface-secondary pt-8 md:pt-10 lg:pt-12">
            <StickyLogoBar />
            <Hero
              kicker="0.0 / About"
              headline={about.headline ?? 'Bridging brand strategy, product craft and technical workflow'}
            />
          </div>

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

    Notes:
    - Hero is rendered WITHOUT `technologies` → falls into the full-width 12-col headline branch. Layout matches the about case (no left/right split).
    - `kicker="0.0 / About"` — mirrors the `PRJ_{year} // {index}` shape used on project pages (mono kicker convention).
    - Fallback string in `headline={about.headline ?? '...'}` is defensive — Task 2 adds the field, but the optional `?:` typing means TS still requires a fallback. Keep the same EN copy for safety.
    - `data-theme="light"` etc. NOT applied — about page uses default dark, same as it does now.
    - DO NOT re-add the old welcome bar inline, useScrollVideo wiring, useInView for headline, slideStyle, or the sticky-overlap structure. All of that is gone.
    - Imports are alphabetized within groups; the file was previously importing `useEffect`, `useState`, `useInView`, `useScrollVideo`, `StickyLogoBar` — only `StickyLogoBar` survives.
  </action>
  <verify>
    <automated>pnpm tsc --noEmit</automated>
    Sanity:
    - `grep -n "useScrollVideo\|useInView\|slideStyle" src/components/sections/v2/AboutSection.tsx` → returns 0 lines.
    - `grep -n "<Hero" src/components/sections/v2/AboutSection.tsx` → 1 hit.
    - `grep -n "<AboutPinned" src/components/sections/v2/AboutSection.tsx` → 1 hit.
    - `grep -nE "<(BioBlock|SkillsBlock|ClientsBlock|EducationBlock)" src/components/sections/v2/AboutSection.tsx` → 4 hits.
  </verify>
  <done>
    AboutSection renders the new sequence (StickyLogoBar + Hero in surface-secondary wrapper → AboutPinned → BioBlock → SkillsBlock → ClientsBlock → EducationBlock). All legacy hero logic (useScrollVideo, useInView, slideStyle, inline welcome bar) removed.
  </done>
</task>

<task type="auto" tdd="false">
  <name>Task 6: Type-check + build verification</name>
  <files>
    (none — verification only, no code changes)
  </files>
  <action>
    Verification gate. Run both commands and confirm they exit 0.

    1. `pnpm tsc --noEmit`
       - Must exit 0. No TS errors.
       - If errors mention `Hero`, `AboutPinned`, `about.headline`, or `paragraphs.slice(1)` — fix in the relevant Task 1-5 file before declaring done.

    2. `pnpm build`
       - Must exit 0.
       - Must produce 28+ static pages.
       - Both `/about` and `/projects/{slug}` routes must prerender (check the build summary table — same table the user inspected in Phase 04.2 verification).
       - If a build cache corruption surfaces (HTTP 500, WasmHash crash — known issue from quick task 260425-p77), surface it explicitly in the summary; do not silently `rm -rf .next`.

    3. Optional smoke (do not block on this — verification is build-driven):
       - Visually confirm `/projects/azion-website` hero text section is unchanged (kicker on top, technologies left at 4-col, headline right at 8-col, all `-entrance -fade` classes intact in the rendered HTML). Use `pnpm dev` if convenient; otherwise rely on `pnpm build` static output.
       - Visually confirm `/about` shows: surface-secondary band → Hero (kicker "0.0 / About" + full-width headline) → AboutPinned (image rises in cols 9-12, first bio paragraph fades in cols 1-6, frames scrub) → BioBlock (Core Expertise + paragraphs[1..N]) → Skills/Clients/Education.

    No commit in this task — it is verification only. The five preceding tasks each produce their own atomic commit.
  </action>
  <verify>
    <automated>pnpm tsc --noEmit && pnpm build</automated>
    Both commands must exit 0. Build output must contain `/about` and `/projects/[slug]` routes.
  </verify>
  <done>
    `pnpm tsc --noEmit` exits 0. `pnpm build` exits 0 with 28+ static pages including `/about` and all `/projects/*`. No regressions surfaced beyond pre-existing known issues.
  </done>
</task>

</tasks>

<verification>
End-to-end checks for the quick task as a whole:

1. **Hero reuse** — `<Hero>` renders both with technologies (project pages) and without technologies (about). DOM structure for the kicker + technologies + headline on `/projects/*` is byte-equivalent to before this task (same classes, same Tailwind utilities, same `-entrance -fade -a-N` stagger indices).

2. **About sequence** — `/about` renders Hero zone (surface-secondary wrapper with sticky bar + headline) → AboutPinned (image pin from cols 9-12 + first-paragraph reveal in cols 1-6, 241 frames scrubbing) → BioBlock (Core Expertise + paragraphs[1..N]) → SkillsBlock → ClientsBlock → EducationBlock.

3. **Content** — `about.headline` exists in en.json + pt-br.json. `Content.about.headline?: string` is typed in types.ts.

4. **BioBlock first-paragraph migration** — BioBlock no longer renders the first bio paragraph; AboutPinned does.

5. **Reduced motion** — On a `prefers-reduced-motion: reduce` user agent: Hero entrance animations effectively no-op (CSS handles), AboutPinned image stays at translateY 0, paragraph stays at opacity 1, frames freeze at last frame (already handled by useScrollVideo).

6. **Build & types** — `pnpm tsc --noEmit` and `pnpm build` both exit 0; static export still produces 28+ pages.
</verification>

<success_criteria>
- All 6 tasks complete in order.
- Tasks 1-5 each produce one atomic commit (Task 6 produces none — verification only).
- `<Hero>` exists at `src/components/sections/v2/Hero.tsx` with the documented props/behavior.
- `ProjectHero.tsx` uses `<Hero>` and renders identically to before on `/projects/*`.
- `<AboutPinned>` exists with image pin + paragraph reveal driven by `useScrollVideo`.
- `BioBlock.tsx` skips first bio paragraph (`.slice(1)`).
- `AboutSection.tsx` renders new sequence; all legacy hero/scroll-video logic removed.
- `about.headline` exists in both locales with proper PT-BR translation; typed as optional in `Content.about`.
- `pnpm tsc --noEmit` exits 0.
- `pnpm build` exits 0 with `/about` and `/projects/*` routes prerendered.
- Semantic tokens only (no raw hex). Static class maps only (no dynamic template literals in className for Tailwind utilities). Fabio XM via `style={{ fontFamily: 'var(--font-sans)' }}` everywhere it appears.
</success_criteria>

<output>
After completion, create `.planning/quick/260425-rcw-reestruturar-about-com-hero-compartilhad/260425-rcw-SUMMARY.md` describing:
- Files created (Hero.tsx, AboutPinned.tsx).
- Files modified (ProjectHero.tsx, BioBlock.tsx, AboutSection.tsx, types.ts, en.json, pt-br.json).
- Atomic commits produced (5).
- Build/type-check status.
- Any edge cases or follow-ups (e.g., Pexel Grotesk swap on Hero hover not in scope; PT-BR copy may want a designer review).
</output>
