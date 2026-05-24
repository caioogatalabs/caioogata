---
phase: 260426-u5d
plan: quick
subsystem: about-page-v2
tags: [about, layout, typography, figma-701-303]
requires:
  - quick task 260426-sjr (4-spacer + 8-content layout already in place on Bio/Skills/Education; 6-spacer + 6-content on Clients)
provides:
  - Section labels (1.1 / Bio, 1.2 / Skills, 1.3 / Notable Clients, 1.4 / Education) rendered inside left spacer GridItem of each block
  - text-indent: 8em on AboutPinned first paragraph + BioBlock final quote (magazine-style first-line indent)
  - bg-bg-surface-secondary header band extended downward (pb-16 / pb-24 / pb-32)
affects:
  - src/components/sections/v2/AboutSection.tsx
  - src/components/sections/v2/about/AboutPinned.tsx
  - src/components/sections/v2/about/BioBlock.tsx
  - src/components/sections/v2/about/SkillsBlock.tsx
  - src/components/sections/v2/about/ClientsBlock.tsx
  - src/components/sections/v2/about/EducationBlock.tsx
tech-stack:
  added: []
  patterns:
    - Reuse welcome-bar mono-label typography (font-mono text-xs uppercase tracking-[0.88px] text-text-tertiary) inline as the spacer-column child — no atom required
    - text-indent on inline-style display paragraphs (additive, single property; no className change)
key-files:
  created: []
  modified:
    - src/components/sections/v2/AboutSection.tsx
    - src/components/sections/v2/about/AboutPinned.tsx
    - src/components/sections/v2/about/BioBlock.tsx
    - src/components/sections/v2/about/SkillsBlock.tsx
    - src/components/sections/v2/about/ClientsBlock.tsx
    - src/components/sections/v2/about/EducationBlock.tsx
decisions:
  - SectionDivider.tsx left on disk but removed from imports in all 4 about blocks — keeps the atom available for any future reintroduction without touching git history
  - Label placed as direct child of spacer GridItem (no flex/justify) — natural block flow puts it top-left, matches Figma 701:303
  - textIndent applied via inline style (next to existing fontSize/lineHeight) so the property co-locates with the rest of the typographic spec for that paragraph
metrics:
  duration: ~6min
  completed: "2026-04-26"
---

# Quick Task 260426-u5d: Move Section Labels into Left Spacers + Display-Paragraph Indent + Hero Band Padding Summary

Three Figma 701:303 alignment refinements on /about V2: section labels relocated into the left spacer column of each about block, magazine-style 8em first-line indent added to two display paragraphs, and the dark hero band extended downward to properly frame the sticky pills row.

## What Was Done

### Change A — Labels into spacers (4 files)

Removed `import { SectionDivider }` and the corresponding `<SectionDivider code=… label=… />` JSX call from BioBlock, SkillsBlock, ClientsBlock, EducationBlock. In each block, converted the existing self-closing left-spacer `<GridItem />` into an opening/closing form whose only child is a single `<span className="font-mono text-xs uppercase tracking-[0.88px] text-text-tertiary">…</span>` carrying the canonical label string:

| Block         | Spacer span             | Label                |
| ------------- | ----------------------- | -------------------- |
| BioBlock      | span=4 / tabletSpan=2   | 1.1 / Bio            |
| SkillsBlock   | span=4 / tabletSpan=2   | 1.2 / Skills         |
| ClientsBlock  | span=6 / tabletSpan=2   | 1.3 / Notable Clients |
| EducationBlock| span=4 / tabletSpan=2   | 1.4 / Education      |

ClientsBlock retains its `span={6}` spacer (intentional — its description column is also `span={6}`, unlike the 4+8 split in the other three blocks).

### Change B — Display-paragraph text-indent (2 files)

Added `textIndent: '8em'` to the inline `style={{ … }}` object on:
- `AboutPinned.tsx` first paragraph (the pinned-bio reveal in cols 1-12 inside the 400vh scroll zone)
- `BioBlock.tsx` final quote `<p>` (full-width below the column area)

Both paragraphs share an identical typographic spec (Fabio XM 3rem / lineHeight 1.15 / letterSpacing -0.96px / fontWeight 400). The new property was inserted directly after `fontWeight: 400,` so the visual spec stays grouped.

### Change C — Hero band bottom padding (1 file)

`AboutSection.tsx` header wrapper className extended from
`bg-bg-surface-secondary pt-8 md:pt-10 lg:pt-12`
to
`bg-bg-surface-secondary pt-8 md:pt-10 lg:pt-12 pb-16 md:pb-24 lg:pb-32`.
The dark band now extends well below the sticky logo+CTA row, giving the Figma 701:303 hero proportions.

## Verification

`pnpm exec tsc --noEmit` exits 0 (no TS regressions).

All 14 plan-level grep / file-existence checks pass:

| # | Check                                                    | Result |
| - | -------------------------------------------------------- | ------ |
| 1 | `import './SectionDivider'` removed from 4 about blocks  | PASS   |
| 2 | `<SectionDivider` JSX removed from 4 about blocks        | PASS   |
| 3 | "1.1 / Bio" present in BioBlock.tsx                      | PASS   |
| 4 | "1.2 / Skills" present in SkillsBlock.tsx                | PASS   |
| 5 | "1.3 / Notable Clients" present in ClientsBlock.tsx      | PASS   |
| 6 | "1.4 / Education" present in EducationBlock.tsx          | PASS   |
| 7 | `textIndent: '8em'` in AboutPinned.tsx                   | PASS   |
| 8 | `textIndent: '8em'` in BioBlock.tsx                      | PASS   |
| 9 | `pb-16 md:pb-24 lg:pb-32` in AboutSection.tsx            | PASS   |
| 10| `SectionDivider.tsx` file still exists on disk           | PASS   |

`pnpm build` skipped per plan constraints (pre-existing WasmHash cache corruption documented in 260425-p77 / 260425-rcw / 260426-sjr summaries; not introduced by this task and not worth restarting from cold cache for a 6-line edit).

## Deviations from Plan

None — plan executed exactly as written. No bugs found, no missing critical functionality, no blocking issues encountered.

## Preserved Behaviour

- All `-entrance -slide-up` / `-entrance -fade` classes and `useInView` refs unchanged on all 4 blocks.
- SkillsBlock accordion logic untouched: `expandedCategoryTitle`, `hoveredSkill`, `LEVEL_WIDTH` static map, the per-row `mouseEnter` / `mouseLeave`, the `grid-rows-[0fr↔1fr]` panel transition, the per-skill yellow level bar, the `text-text-inverse` hover swap, and the outer `onMouseLeave` collapsing both states.
- ClientsBlock CLIENT_LOGOS map and the `grid grid-cols-2 lg:grid-cols-4` borderless logo grid unchanged.
- EducationBlock `getSortYear` / `getDisplayYear` / `useMemo` sort unchanged; flat `flex gap-5 md:gap-8` row with `w-[100px]` year stamp untouched.
- BioBlock Core Expertise list and middle-paragraph stack untouched; only the final-quote inline style gained `textIndent`.
- AboutPinned image-translate logic, `useScrollVideo` hook, reduced-motion handling, and constants (`IMAGE_ENTRY_END`, `EXIT_START`, `EXIT_END`, `IMAGE_TRANSLATE_START`, `IMAGE_TRANSLATE_EXIT`, `IMAGE_MAX_OPACITY`) all unchanged; only the first-paragraph inline style gained `textIndent`.
- `SectionDivider.tsx` file still on disk, unmodified — only no longer imported.

## Self-Check: PASSED

- All 6 modified files exist at expected paths
- All 10 verification checks above pass
- Typecheck exits 0
- Single commit covers exactly the 6 source files + this SUMMARY (recorded after commit)
