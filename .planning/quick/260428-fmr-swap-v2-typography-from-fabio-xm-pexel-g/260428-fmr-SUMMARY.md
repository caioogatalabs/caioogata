---
phase: 260428-fmr
plan: quick
subsystem: typography
tags: [typography, tokens, design-system, fonts, v2]
requires:
  - Switzer variable woff2 (provided in font-test/)
  - JetBrains Mono variable woff2 (provided in font-test/)
provides:
  - Self-hosted Switzer + JetBrains Mono variable fonts
  - .type-overlay-hover utility class
  - --text-overlay-hover semantic token
affects:
  - All V2 components rendering body / mono / button-hover-overlay text
tech-stack:
  added: []
  patterns:
    - .type-overlay-hover utility class for masked vertical text-swap
    - woff2-variations format for variable fonts
key-files:
  created:
    - src/fonts/Switzer-Variable.woff2
    - src/fonts/Switzer-VariableItalic.woff2
    - src/fonts/JetBrainsMono-Variable.woff2
    - src/fonts/JetBrainsMono-VariableItalic.woff2
  modified:
    - src/app/globals.css
    - src/tokens/primitives.css
    - src/tokens/semantic.css
    - src/app/layout.tsx
    - package.json
    - pnpm-lock.yaml
    - src/components/sections/v2/StickyLogoBar.tsx
    - src/components/sections/v2/StickyHeader.tsx
    - src/components/sections/v2/FooterSection.tsx
    - src/components/sections/v2/ProjectCard.tsx
    - src/components/sections/v2/ExperienceSection.tsx
    - src/components/sections/v2/MenuSection.tsx
    - src/components/sections/v2/ContactForm.tsx
    - src/app/dev/buttons/page.tsx
    - src/components/sections/v2/about/BioBlock.tsx
    - src/components/sections/v2/experience/StatsCard.tsx
    - CLAUDE.md
decisions:
  - Adopt Switzer + JetBrains Mono as the V2 font stack (self-hosted variable woff2)
  - Centralize the masked vertical text-swap font + size + weight + line-height in .type-overlay-hover utility class so future tweaks are one-file changes
  - Keep V1 TTF/OTF font files (FabioXM-Variable.ttf, PexelGrotesk-Regular.otf) on disk for end-of-project cleanup (locked decision 6)
  - Preserve intentional fontSize/fontWeight overrides on overlay spans where the design intentionally diverges from the trio default (Rule 2 alert pattern via inline comments)
metrics:
  duration: 31min
  completed: 2026-04-28
---

# Quick Task 260428-fmr: Swap V2 typography from Fabio XM + Pexel Grotesk + Cascadia Mono to Switzer + JetBrains Mono Summary

V2 typography stack swapped to Switzer + JetBrains Mono via token-only mutation, with a new `.type-overlay-hover` utility class absorbing the masked vertical text-swap on every V2 button hover.

## What Shipped

- **4 self-hosted variable woff2 fonts** copied into `src/fonts/`:
  - `Switzer-Variable.woff2` + `Switzer-VariableItalic.woff2` (weight 100-900)
  - `JetBrainsMono-Variable.woff2` + `JetBrainsMono-VariableItalic.woff2` (weight 100-800)
- **4 new `@font-face` rules** in `globals.css` using `format('woff2-variations')`, replacing the legacy Fabio XM + Pexel Grotesk blocks (which referenced the V1 TTF/OTF files left on disk)
- **`.type-overlay-hover` utility class** in `globals.css`:
  ```css
  .type-overlay-hover {
    font-family: var(--font-mono);
    font-size: var(--text-overlay-hover);
    font-weight: var(--primitive-font-regular);
    line-height: 1;
  }
  ```
- **New `--text-overlay-hover` semantic token** = `var(--primitive-text-2xl)` (24px) — defined in `semantic.css` next to the type-scale tokens.
- **Primitive token swap**: `--primitive-font-sans` → `'Switzer'`, `--primitive-font-mono` → `'JetBrains Mono'`. No size/weight/line-height values changed.
- **27 hardcoded `fontFamily: "'Pexel Grotesk', var(--font-sans)"` inline styles refactored** across 8 V2/dev files. Affected spans now carry `type-overlay-hover` in their className string instead.
- **`@fontsource/cascadia-mono` dependency removed** from `package.json` + `pnpm-lock.yaml` + `layout.tsx`. Cascadia Mono was only used for `--font-mono` — JetBrains Mono now owns that role plus the overlay-hover.
- **CLAUDE.md prose updated** end-to-end: project blurb, constraints, tech stack, list-hover docs, welcome-bar docs, button-hover patterns, component-patterns font-family bullet — all now reference Switzer + JetBrains Mono and the `.type-overlay-hover` utility class.

## Component Refactor Breakdown (~27 spans across 8 files)

| File | Spans Refactored | Notes |
|------|-----:|-------|
| `StickyLogoBar.tsx` | 2 | Pill ("ask about") + close button |
| `StickyHeader.tsx` | 2 | Legacy/not imported. Compact 0.875rem fontSize override preserved with inline comment (Rule 2 alert) |
| `FooterSection.tsx` | 5 | SocialLink hover, Contact/Close hover (pill + icon), + + × hover swaps |
| `ProjectCard.tsx` | 1 | Arrow button hover |
| `ExperienceSection.tsx` | 2 (+ 1 family-only swap) | Company + title hover spans (`fontWeight: 700` override preserved). Display-size 3.5rem `→` arrow switched from `'Pexel Grotesk'` to `var(--font-mono)` |
| `MenuSection.tsx` | 2 (+ 1 family-only swap) | Label + description hover spans (`fontSize: 2.25rem` override preserved). Display arrow: same family-only swap |
| `ContactForm.tsx` | 3 | SubjectChip (1rem override preserved), Submit + Clear buttons |
| `dev/buttons/page.tsx` | 10 | Primary/Secondary × Pill/Squared/IconOnly/Composition combinations. Spread helpers (`...enterB(h)`, `...secB(h)`) preserved as-is per executor note |

## Token Updates

```diff
# src/tokens/primitives.css
- --primitive-font-sans: 'Fabio XM', system-ui, -apple-system, sans-serif;
- --primitive-font-mono: 'Cascadia Mono', 'Fira Code', monospace;
+ --primitive-font-sans: 'Switzer', system-ui, -apple-system, sans-serif;
+ --primitive-font-mono: 'JetBrains Mono', 'Fira Code', monospace;

# src/tokens/semantic.css (added inside @theme)
+ --text-overlay-hover: var(--primitive-text-2xl);   /* 24px — button hover overlay (masked vertical text-swap) */
```

Type-scale comments in `semantic.css` updated from "Fabio XM Regular/Bold/Semibold/Medium" → "Switzer Regular/Bold/Semibold/Medium". Size/weight/leading values untouched.

## Build Verification

| Check | Result |
|-------|--------|
| `pnpm tsc --noEmit` | Exit 0 |
| `pnpm build` | Exit 0 |
| Static pages generated | 28/28 (incl. /experience, /about, /dev/buttons, /projects/[slug]) |
| `grep "Fabio XM\|Pexel Grotesk\|Cascadia Mono"` in `src/` | 0 matches |
| `grep "Fabio XM\|Pexel Grotesk\|Cascadia Mono"` in `CLAUDE.md` | 0 matches |
| `grep "@fontsource/cascadia-mono"` in `package.json` | 0 matches |
| `grep "@fontsource/cascadia-mono"` in `pnpm-lock.yaml` | 0 matches |
| V1 components touched (Skills/Projects/Philosophy/Header/Footer) | None |

## Deviations from Plan

### Rule 2 alerts (preserved fontSize/fontWeight overrides on overlay-hover spans)

For spans listed in `<hardcoded_pexel_grotesk_occurrences>` whose intentional design diverges from the trio default (1.5rem / 400), the plan's Rule 2 (alert via comment, do not silently change) was applied. `type-overlay-hover` is added to className AND the divergent value is preserved as an explicit inline override with a leading code comment:

| Component | Override | Reason |
|-----------|----------|--------|
| StickyHeader (legacy) | `fontSize: 0.875rem` | Compact glassmorphism header sized smaller than V2 default |
| ContactForm SubjectChip | `fontSize: 1rem` | Subject chip is small, 1.5rem would overflow |
| MenuSection label hover | `fontSize: 2.25rem` | Menu items use display-size hover swap |
| MenuSection description hover | `fontSize: 2.25rem` | Same as above |
| ExperienceSection company hover | `fontWeight: 700` | Bold company name for emphasis |
| ExperienceSection title hover | `fontWeight: 700` | Bold title for emphasis |

Each override has an inline comment documenting why it deviates. Commit message of Task 3 lists them all.

### Display arrows (3.5rem `→`) — family-only swap

`ExperienceSection.tsx` line 180 and `MenuSection.tsx` line 135 both house a 3.5rem display-size arrow indicator that the orchestrator pre-grep listed under Pexel Grotesk hardcodes. These are NOT masked-vertical-text-swap spans — they're standalone display arrows with their own size + weight + tracking. Replacing only the family with `var(--font-mono)` (and preserving the rest) keeps their visual identity intact while removing the broken `'Pexel Grotesk'` reference. Documented in Task 3 commit message and inline comments.

### Task 3 verify gate fix (early prose-comment update)

Task 3's `<verify>` block runs `! grep -rn "Pexel Grotesk" src/components/sections/v2/ src/app/dev/`. After the structural refactor, one prose comment in `ExperienceSection.tsx:112` ("...the bigger Pexel Grotesk variant") still tripped the grep. Per Rule 3 (blocking issue — verify gate fails) the comment was updated inside Task 3 to "...the bigger JetBrains Mono via .type-overlay-hover variant". This made Task 5's responsibility for that file purely "no-op" — flagged in Task 5 commit message.

### Auto-staged build-info (project pre-commit hook)

The repo's pre-commit hook auto-bumps `src/lib/build-info.ts` with the commit count. This appears in Tasks 4 and 5 commit stats as a 1-line +1 change. Not a deviation by the executor — it's a project-level hook behavior. No action needed.

## Known Stubs

None — this task does not touch UI data flow. Both fonts are wired end-to-end (font file → @font-face → primitive token → semantic token → utility class → component className), and `pnpm build` confirms all routes render.

## Old Files Pending Cleanup

Per locked decision 6, the following V1 font files remain on disk and are NOT deleted by this task:

- `src/fonts/FabioXM-Variable.ttf`
- `src/fonts/PexelGrotesk-Regular.otf`

They are no longer loaded (no `@font-face` references them) but are kept until end-of-project cleanup to avoid accidental loss of trial-license assets. A future cleanup commit can `git rm` them when V2 ships to production.

## Acceptable Leftover Old Font References

Plan declares "Acceptable leftovers: STATE.md historical entries, .planning/ archives, RETROSPECTIVE.md, docs/v2/spec.md (historical context)". Beyond those, the following design-history docs in `docs/v2/` still reference the old font names:

- `docs/v2/Design.md`
- `docs/v2/README.md`
- `docs/v2/project-page-patterns.md`

These are project-history reference docs and stay. The strict success scope (`src/`, `CLAUDE.md`, `package.json`) is clean.

## Commits

| Task | Commit | Subject |
|------|--------|---------|
| Task 1 | 4562e44 | feat(typography): self-host Switzer + JetBrains Mono variable woff2 |
| Task 2 | 9814493 | feat(tokens): swap font-sans/mono to Switzer + JetBrains Mono; add overlay-hover |
| Task 3 | 8b2b8cf | refactor(v2): replace hardcoded Pexel Grotesk inline styles with .type-overlay-hover |
| Task 4 | 49794c8 | chore(deps): remove @fontsource/cascadia-mono |
| Task 5 | d5298af | docs: update CLAUDE.md + V2 prose comments for Switzer/JetBrains Mono |

## Self-Check: PASSED

- [x] All 4 woff2 files exist in `src/fonts/`
- [x] `globals.css` has 4 new @font-face rules + `.type-overlay-hover` utility class; no Fabio XM / Pexel Grotesk references
- [x] `primitives.css` points `--primitive-font-sans` → Switzer and `--primitive-font-mono` → JetBrains Mono
- [x] `semantic.css` declares `--text-overlay-hover` token
- [x] All 27 hardcoded fontFamily inline styles in V2/dev components replaced by `type-overlay-hover` className (or family-only swap for non-overlay spans)
- [x] `@fontsource/cascadia-mono` removed from `package.json` + `pnpm-lock.yaml` + `layout.tsx`
- [x] V1 TTF/OTF font files left on disk (not deleted)
- [x] V1 components untouched (Skills.tsx, Projects.tsx, Philosophy.tsx, Header.tsx, Footer.tsx)
- [x] CLAUDE.md prose updated end-to-end
- [x] `pnpm tsc --noEmit` exits 0
- [x] `pnpm build` exits 0 (28 static pages generated)
- [x] All 5 commits exist on `v2` branch (4562e44, 9814493, 8b2b8cf, 49794c8, d5298af)
