---
phase: 260428-fmr
plan: quick
type: execute
wave: 1
depends_on: []
files_modified:
  - src/fonts/Switzer-Variable.woff2
  - src/fonts/Switzer-VariableItalic.woff2
  - src/fonts/JetBrainsMono-Variable.woff2
  - src/fonts/JetBrainsMono-VariableItalic.woff2
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
  - src/components/sections/v2/about/StatsCard.tsx
  - src/components/sections/v2/about/BioBlock.tsx
  - src/app/dev/buttons/page.tsx
  - CLAUDE.md
autonomous: true
requirements:
  - QUICK-260428-fmr-01
  - QUICK-260428-fmr-02
  - QUICK-260428-fmr-03
  - QUICK-260428-fmr-04
  - QUICK-260428-fmr-05
must_haves:
  truths:
    - "Browser renders body text in Switzer (not Fabio XM)"
    - "Browser renders monospace text in JetBrains Mono (not Cascadia Mono)"
    - "Button hover overlay text renders in JetBrains Mono 1.5rem (not Pexel Grotesk)"
    - "No V2 component contains a hardcoded font-family inline style"
    - "@fontsource/cascadia-mono is removed from package.json and lockfile"
    - "pnpm build succeeds and pnpm tsc --noEmit exits 0"
    - "V1 components on this branch render with new fonts via token inheritance (no V1 file edited)"
  artifacts:
    - path: "src/fonts/Switzer-Variable.woff2"
      provides: "Switzer variable font (300-900) for --font-sans"
    - path: "src/fonts/JetBrainsMono-Variable.woff2"
      provides: "JetBrains Mono variable font for --font-mono and overlay-hover"
    - path: "src/app/globals.css"
      provides: "Updated @font-face rules + new .type-overlay-hover utility class"
      contains: "@font-face\\s+\\{[^}]*Switzer.*\\.type-overlay-hover"
    - path: "src/tokens/primitives.css"
      provides: "--primitive-font-sans=Switzer, --primitive-font-mono=JetBrains Mono"
      contains: "--primitive-font-sans:.*Switzer"
    - path: "src/tokens/semantic.css"
      provides: "--text-overlay-hover token aliased to primitive-text-2xl (24px)"
      contains: "--text-overlay-hover:"
  key_links:
    - from: "src/tokens/primitives.css"
      to: "src/tokens/semantic.css"
      via: "--primitive-font-sans → --font-sans → Tailwind/components"
      pattern: "--font-sans:\\s*var\\(--primitive-font-sans\\)"
    - from: "V2 components"
      to: "src/app/globals.css .type-overlay-hover"
      via: "className replaces inline fontFamily/fontSize/fontWeight"
      pattern: "type-overlay-hover"
    - from: "src/app/layout.tsx"
      to: "@fontsource/cascadia-mono"
      via: "Removed — Cascadia replaced by self-hosted JetBrains Mono"
      pattern: "(?!.*@fontsource/cascadia-mono)"
---

<objective>
Swap V2 typography from Fabio XM + Pexel Grotesk + Cascadia Mono to Switzer + JetBrains Mono via token-only mutation. JetBrains Mono absorbs both the `--font-mono` role (replacing Cascadia) AND the masked vertical text-swap overlay (replacing Pexel Grotesk). Introduce a `.type-overlay-hover` utility class so V2 components stop hardcoding `fontFamily: "'Pexel Grotesk', var(--font-sans)"` inline.

Purpose: Prepare V2 for typography that we can ship to production (Fabio XM is trial-only). Centralize the overlay-hover declaration so future tweaks are one-file changes. V1 production on `main` is unaffected because the swap is on the `v2` branch.

Output:
- 4 self-hosted variable woff2 files in `src/fonts/`
- New `@font-face` rules + `.type-overlay-hover` utility in `globals.css`
- Updated primitive + semantic font tokens
- Removed `@fontsource/cascadia-mono` dependency
- ~30 hardcoded `fontFamily` inline styles in V2 components replaced by `type-overlay-hover` className
- Updated CLAUDE.md prose
</objective>

<execution_context>
@$HOME/.claude/get-shit-done/workflows/execute-plan.md
</execution_context>

<context>
@.planning/STATE.md
@CLAUDE.md
@src/tokens/primitives.css
@src/tokens/semantic.css
@src/app/globals.css
@src/app/layout.tsx
@package.json

<interfaces>
<!-- Existing tokens this plan touches. Executor should NOT explore the codebase to find these. -->

From src/tokens/primitives.css (current):
```css
--primitive-font-sans: 'Fabio XM', system-ui, -apple-system, sans-serif;   /* line 96 */
--primitive-font-mono: 'Cascadia Mono', 'Fira Code', monospace;             /* line 97 */
--primitive-text-2xl:  1.5rem;                                              /* line 105 */
--primitive-font-regular: 400;                                              /* line 117 */
```

From src/tokens/semantic.css (current):
```css
--font-sans: var(--primitive-font-sans);   /* line 84 */
--font-mono: var(--primitive-font-mono);   /* line 85 */
--text-heading-md: var(--primitive-text-2xl);  /* line 93 — comment mentions Fabio XM Semibold */
```

From src/app/globals.css (lines 4-18, current @font-face block):
```css
@font-face {
  font-family: 'Fabio XM';
  src: url('../fonts/FabioXM-Variable.ttf') format('truetype');
  font-weight: 300 900;
  font-style: normal;
  font-display: swap;
}

@font-face {
  font-family: 'Pexel Grotesk';
  src: url('../fonts/PexelGrotesk-Regular.otf') format('opentype');
  font-weight: 400;
  font-style: normal;
  font-display: swap;
}
```

From src/app/layout.tsx (lines 9-10):
```tsx
import '@fontsource/cascadia-mono/400.css'
import '@fontsource/cascadia-mono/700.css'
```

Source font files (already on disk, must be copied to src/fonts/):
- font-test/Switzer_Complete/Fonts/WEB/fonts/Switzer-Variable.woff2
- font-test/Switzer_Complete/Fonts/WEB/fonts/Switzer-VariableItalic.woff2
- font-test/JetBrainsMono_Complete/Fonts/WEB/fonts/JetBrainsMono-Variable.woff2
- font-test/JetBrainsMono_Complete/Fonts/WEB/fonts/JetBrainsMono-VariableItalic.woff2

Note: V1 file `src/fonts/FabioXM-Variable.ttf` and `src/fonts/PexelGrotesk-Regular.otf` MUST be left in place (cleanup later, per locked decision 6).
</interfaces>

<hardcoded_pexel_grotesk_occurrences>
<!-- All occurrences gathered by orchestrator's pre-grep. Each is an absolutely-positioned <span> doing masked vertical text-swap. -->
<!-- Refactor: REMOVE fontFamily/fontSize/fontWeight from inline style; ADD `type-overlay-hover` to className. -->
<!-- KEEP transform/opacity/transition inline styles untouched. -->

- src/components/sections/v2/StickyLogoBar.tsx — lines 48, 81
- src/components/sections/v2/StickyHeader.tsx — lines 81, 115 (legacy/not imported, refactor for consistency)
- src/components/sections/v2/FooterSection.tsx — lines 98, 258, 283, 321, 346
- src/components/sections/v2/ProjectCard.tsx — line 62
- src/components/sections/v2/ExperienceSection.tsx — lines 180, 272, 329
- src/components/sections/v2/MenuSection.tsx — lines 135, 182, 220
- src/components/sections/v2/ContactForm.tsx — lines 77, 258, 274
- src/app/dev/buttons/page.tsx — lines 105, 122, 140, 154, 158, 195, 214, 235, 254, 262
</hardcoded_pexel_grotesk_occurrences>

<v1_files_do_not_touch>
The following V1 files share the global token pipeline and will inherit the new fonts automatically. DO NOT edit them directly — they are referenced here only so the executor avoids them:
- src/components/sections/Skills.tsx
- src/components/sections/Projects.tsx
- src/components/sections/Philosophy.tsx
- src/components/layout/Header.tsx
- src/components/layout/Footer.tsx

Production V1 lives on `main`; this work is on `v2`, so V1 production is unaffected.
</v1_files_do_not_touch>
</context>

<tasks>

<task type="auto">
  <name>Task 1: Install Switzer + JetBrains Mono fonts and rewrite @font-face</name>
  <files>
    src/fonts/Switzer-Variable.woff2,
    src/fonts/Switzer-VariableItalic.woff2,
    src/fonts/JetBrainsMono-Variable.woff2,
    src/fonts/JetBrainsMono-VariableItalic.woff2,
    src/app/globals.css
  </files>
  <action>
1. Copy 4 variable woff2 files into `src/fonts/`:
   - `cp font-test/Switzer_Complete/Fonts/WEB/fonts/Switzer-Variable.woff2 src/fonts/`
   - `cp font-test/Switzer_Complete/Fonts/WEB/fonts/Switzer-VariableItalic.woff2 src/fonts/`
   - `cp font-test/JetBrainsMono_Complete/Fonts/WEB/fonts/JetBrainsMono-Variable.woff2 src/fonts/`
   - `cp font-test/JetBrainsMono_Complete/Fonts/WEB/fonts/JetBrainsMono-VariableItalic.woff2 src/fonts/`

2. Edit `src/app/globals.css` lines 4-18 — REPLACE the two existing `@font-face` blocks (Fabio XM + Pexel Grotesk) with FOUR new blocks (Switzer normal + italic, JetBrains Mono normal + italic). Use this exact replacement:

```css
@font-face {
  font-family: 'Switzer';
  src: url('../fonts/Switzer-Variable.woff2') format('woff2-variations');
  font-weight: 100 900;
  font-style: normal;
  font-display: swap;
}

@font-face {
  font-family: 'Switzer';
  src: url('../fonts/Switzer-VariableItalic.woff2') format('woff2-variations');
  font-weight: 100 900;
  font-style: italic;
  font-display: swap;
}

@font-face {
  font-family: 'JetBrains Mono';
  src: url('../fonts/JetBrainsMono-Variable.woff2') format('woff2-variations');
  font-weight: 100 800;
  font-style: normal;
  font-display: swap;
}

@font-face {
  font-family: 'JetBrains Mono';
  src: url('../fonts/JetBrainsMono-VariableItalic.woff2') format('woff2-variations');
  font-weight: 100 800;
  font-style: italic;
  font-display: swap;
}
```

3. APPEND a new utility class block at the end of `src/app/globals.css` (after the existing rules but inside the same file). Add:

```css
/* Button hover overlay (masked vertical text-swap) — collapses font-family + size + weight + line-height */
.type-overlay-hover {
  font-family: var(--font-mono);
  font-size: var(--text-overlay-hover);
  font-weight: var(--primitive-font-regular);
  line-height: 1;
}
```

DO NOT delete `src/fonts/FabioXM-Variable.ttf` or `src/fonts/PexelGrotesk-Regular.otf` — they stay until end-of-project cleanup (locked decision 6).
  </action>
  <verify>
    <automated>ls src/fonts/Switzer-Variable.woff2 src/fonts/Switzer-VariableItalic.woff2 src/fonts/JetBrainsMono-Variable.woff2 src/fonts/JetBrainsMono-VariableItalic.woff2 && grep -q "font-family: 'Switzer'" src/app/globals.css && grep -q "font-family: 'JetBrains Mono'" src/app/globals.css && grep -q "\.type-overlay-hover" src/app/globals.css && ! grep -q "Fabio XM" src/app/globals.css && ! grep -q "Pexel Grotesk" src/app/globals.css</automated>
  </verify>
  <done>4 woff2 files exist in src/fonts/. globals.css has 4 @font-face rules (Switzer × 2, JetBrains Mono × 2), no references to Fabio XM or Pexel Grotesk, and the `.type-overlay-hover` utility class is defined. Old TTF/OTF files still on disk (not deleted).</done>
</task>

<task type="auto">
  <name>Task 2: Update primitive + semantic tokens</name>
  <files>src/tokens/primitives.css, src/tokens/semantic.css</files>
  <action>
1. In `src/tokens/primitives.css` line 96-97, REPLACE:
```css
--primitive-font-sans: 'Fabio XM', system-ui, -apple-system, sans-serif;
--primitive-font-mono: 'Cascadia Mono', 'Fira Code', monospace;
```
WITH:
```css
--primitive-font-sans: 'Switzer', system-ui, -apple-system, sans-serif;
--primitive-font-mono: 'JetBrains Mono', 'Fira Code', monospace;
```

2. In `src/tokens/semantic.css`, inside the `@theme` block (where `--font-sans` and `--font-mono` are declared, around line 84-85), ADD a new line:
```css
--text-overlay-hover: var(--primitive-text-2xl);
```
Place it grouped with the other type-scale tokens (`--text-heading-md`, etc.) so it's discoverable. Add a brief comment: `/* 24px — button hover overlay (masked vertical text-swap) */`

3. In `src/tokens/semantic.css` line 93, UPDATE the comment for `--text-heading-md` from "Fabio XM Semibold" to "Switzer Semibold". Scan the file for any other "Fabio XM", "Pexel Grotesk", or "Cascadia" references in comments and update them to "Switzer" or "JetBrains Mono" as appropriate (font-family swap only — NEVER change size/weight/lh values per locked decision 7).

DO NOT add new font family tokens (locked decision 1: two families only). DO NOT change any size or weight values (locked decision 7).
  </action>
  <verify>
    <automated>grep -q "primitive-font-sans:.*'Switzer'" src/tokens/primitives.css && grep -q "primitive-font-mono:.*'JetBrains Mono'" src/tokens/primitives.css && grep -q "text-overlay-hover:" src/tokens/semantic.css && ! grep -q "Fabio XM\|Pexel Grotesk\|Cascadia Mono" src/tokens/primitives.css src/tokens/semantic.css</automated>
  </verify>
  <done>primitives.css points --primitive-font-sans at Switzer and --primitive-font-mono at JetBrains Mono. semantic.css declares --text-overlay-hover and contains zero references to Fabio XM/Pexel Grotesk/Cascadia in comments.</done>
</task>

<task type="auto">
  <name>Task 3: Refactor V2 components — replace hardcoded fontFamily inline styles with .type-overlay-hover className</name>
  <files>
    src/components/sections/v2/StickyLogoBar.tsx,
    src/components/sections/v2/StickyHeader.tsx,
    src/components/sections/v2/FooterSection.tsx,
    src/components/sections/v2/ProjectCard.tsx,
    src/components/sections/v2/ExperienceSection.tsx,
    src/components/sections/v2/MenuSection.tsx,
    src/components/sections/v2/ContactForm.tsx,
    src/app/dev/buttons/page.tsx
  </files>
  <action>
For each occurrence listed in `<hardcoded_pexel_grotesk_occurrences>`, refactor the absolutely-positioned `<span>` that does the masked vertical text-swap:

**Before** (typical shape):
```tsx
<span
  className="absolute inset-0 ..."
  style={{
    fontFamily: "'Pexel Grotesk', var(--font-sans)",
    fontSize: '1.5rem',
    fontWeight: '400',          // may be '400', 400, 'normal', or absent
    transform: 'translateY(0)',
    opacity: 1,
    transition: 'transform 1s ...'
  }}
>
```

**After**:
```tsx
<span
  className="absolute inset-0 ... type-overlay-hover"
  style={{
    transform: 'translateY(0)',
    opacity: 1,
    transition: 'transform 1s ...'
  }}
>
```

Rules:
1. ADD `type-overlay-hover` to the existing `className` string (append at the end).
2. REMOVE these three keys from the inline `style` object: `fontFamily`, `fontSize`, `fontWeight`. Remove ONLY when their values map to the overlay-hover trio (`'Pexel Grotesk', var(--font-sans)` / `'1.5rem'` / `400|'400'|'normal'`). If a span has DIFFERENT values for fontSize or fontWeight, alert via comment instead of silently changing.
3. KEEP `transform`, `opacity`, `transition`, and any other animation-related style keys exactly as-is.
4. Preserve all other classes and props on the element.
5. If the result leaves an empty `style={{}}`, delete the entire `style` prop.
6. DO NOT touch any `<span>` whose font-family is `var(--font-sans)` only (those are the OUTGOING/default spans, not the overlay span — they keep their existing styling).

Files to walk (exact line numbers from orchestrator pre-grep):
- StickyLogoBar.tsx: 48, 81
- StickyHeader.tsx: 81, 115 (legacy file, refactor anyway for consistency — DO NOT add an import; it's not imported elsewhere)
- FooterSection.tsx: 98, 258, 283, 321, 346
- ProjectCard.tsx: 62
- ExperienceSection.tsx: 180, 272, 329
- MenuSection.tsx: 135, 182, 220
- ContactForm.tsx: 77, 258, 274
- src/app/dev/buttons/page.tsx: 105, 122, 140, 154, 158, 195, 214, 235, 254, 262

V1 files in `src/components/sections/{Skills,Projects,Philosophy}.tsx` and `src/components/layout/{Header,Footer}.tsx` MUST NOT be edited (constraint).

Run a final cross-check: `grep -rn "Pexel Grotesk" src/` should return zero matches inside `src/components/sections/v2/`, `src/components/sections/v2/about/`, and `src/app/dev/`.
  </action>
  <verify>
    <automated>! grep -rn "Pexel Grotesk" src/components/sections/v2/ src/app/dev/ && pnpm tsc --noEmit</automated>
  </verify>
  <done>All ~26 hardcoded `fontFamily: "'Pexel Grotesk', var(--font-sans)"` occurrences across the 8 V2/dev files are removed. Each affected `<span>` carries `type-overlay-hover` in its className. Animation-related inline styles (transform, opacity, transition) preserved. `pnpm tsc --noEmit` exits 0.</done>
</task>

<task type="auto">
  <name>Task 4: Remove @fontsource/cascadia-mono dependency</name>
  <files>src/app/layout.tsx, package.json, pnpm-lock.yaml</files>
  <action>
1. Edit `src/app/layout.tsx` — DELETE lines 9-10:
```tsx
import '@fontsource/cascadia-mono/400.css'
import '@fontsource/cascadia-mono/700.css'
```
Leave all other imports intact.

2. Edit `package.json` — REMOVE `"@fontsource/cascadia-mono"` from `dependencies`. Use a JSON-aware edit (preserve formatting/trailing commas).

3. Run `pnpm install` to refresh `pnpm-lock.yaml`.

4. Sanity check: `grep -rn "cascadia-mono\|Cascadia Mono" src/ package.json` should return zero matches (excluding node_modules).
  </action>
  <verify>
    <automated>! grep -q "cascadia-mono" src/app/layout.tsx && ! grep -q "@fontsource/cascadia-mono" package.json && pnpm install --frozen-lockfile=false 2>&1 | tail -5</automated>
  </verify>
  <done>layout.tsx no longer imports @fontsource/cascadia-mono. package.json has no @fontsource/cascadia-mono entry. pnpm-lock.yaml refreshed (no missing-package error). `grep -rn "cascadia" src/ package.json` returns zero matches.</done>
</task>

<task type="auto">
  <name>Task 5: Update CLAUDE.md + V2 component prose comments + final build verification</name>
  <files>
    CLAUDE.md,
    src/components/sections/v2/about/StatsCard.tsx,
    src/components/sections/v2/about/BioBlock.tsx,
    src/components/sections/v2/ExperienceSection.tsx
  </files>
  <action>
1. Edit `CLAUDE.md` — find/replace the following prose. Match-then-update, not blind replace:
   - "Fabio XM" → "Switzer" (every occurrence in CLAUDE.md, including the `### Constraints` font line, the technology stack `**Fonts**:` line, and any prose example in the conventions sections)
   - "Cascadia Mono" → "JetBrains Mono"
   - "Pexel Grotesk" → "JetBrains Mono via .type-overlay-hover" (in the Button Hover Patterns section's "Fabio XM → Pexel Grotesk 1.5rem" mention, rewrite to "Switzer → JetBrains Mono via .type-overlay-hover")
   - In the `### Component Patterns` section, the bullet:
     `**Font family**: \`style={{ fontFamily: 'var(--font-sans)' }}\` for Fabio XM display text, \`font-mono\` class for Cascadia Mono.`
     → REPLACE with:
     `**Font family**: \`style={{ fontFamily: 'var(--font-sans)' }}\` for Switzer display text, \`font-mono\` class for JetBrains Mono. For the masked vertical text-swap on button hover, use the \`.type-overlay-hover\` utility class instead of inline \`fontFamily\`.`
   - The Constraints `**Font**:` line: keep the warning posture — replace with `**Font**: Switzer + JetBrains Mono (self-hosted woff2 variable). Verify license before production.`

2. Edit `src/components/sections/v2/about/StatsCard.tsx` lines 12-13 — update any code-comment prose mentioning "Fabio XM" to "Switzer" (font-family role unchanged).

3. Edit `src/components/sections/v2/about/BioBlock.tsx` line 15 — update code-comment prose mentioning "Fabio XM" to "Switzer".

4. Edit `src/components/sections/v2/ExperienceSection.tsx` line 112 — update code-comment prose mentioning "Fabio XM" to "Switzer".

   For tasks 2-4: search each file for `Fabio XM`, `Pexel Grotesk`, `Cascadia Mono` in comments only — DO NOT modify code logic. Update prose to the new family names.

5. Run final build verification:
   - `pnpm tsc --noEmit` (must exit 0)
   - `pnpm build` (must succeed)

6. Smoke-grep across the entire repo (excluding node_modules, .next, font-test/, src/fonts/) for any leftover references:
   - `grep -rn "Fabio XM\|Pexel Grotesk\|Cascadia Mono\|cascadia-mono" --exclude-dir=node_modules --exclude-dir=.next --exclude-dir=font-test --exclude-dir=src/fonts .`
   - Acceptable leftovers: STATE.md historical entries, .planning/ archives, RETROSPECTIVE.md, docs/v2/spec.md (historical context). These are project history and stay.
   - Unacceptable: any match in `src/`, `package.json`, `CLAUDE.md`. Fix before declaring done.
  </action>
  <verify>
    <automated>! grep -q "Fabio XM\|Pexel Grotesk\|Cascadia Mono" CLAUDE.md && ! grep -rq "Fabio XM\|Pexel Grotesk\|Cascadia Mono" src/components/sections/v2/ && pnpm tsc --noEmit && pnpm build 2>&1 | tail -20</automated>
  </verify>
  <done>CLAUDE.md prose reflects Switzer + JetBrains Mono with no leftover Fabio XM/Pexel Grotesk/Cascadia references. V2 component code-comments updated. `pnpm tsc --noEmit` exits 0. `pnpm build` completes successfully (no font-load errors, no TypeScript errors). Grep across `src/` + `CLAUDE.md` + `package.json` returns zero matches for old font names.</done>
</task>

</tasks>

<verification>
Final state checks (all must pass):

1. **Token integrity**: `grep -E "primitive-font-(sans|mono)" src/tokens/primitives.css` shows Switzer + JetBrains Mono.
2. **Utility class exists**: `grep "\.type-overlay-hover" src/app/globals.css` returns the rule.
3. **No hardcoded font-family in V2**: `grep -rn "Pexel Grotesk\|Fabio XM" src/components/sections/v2/ src/app/dev/` returns zero.
4. **Dependency removed**: `grep "@fontsource/cascadia-mono" package.json` returns zero.
5. **TypeScript clean**: `pnpm tsc --noEmit` exits 0.
6. **Build succeeds**: `pnpm build` completes without font-load errors or static-export failures.
7. **V1 untouched**: `git diff --stat src/components/sections/Skills.tsx src/components/sections/Projects.tsx src/components/sections/Philosophy.tsx src/components/layout/Header.tsx src/components/layout/Footer.tsx` shows no changes.

Visual verification (manual, deferred to user):
- Home page renders body in Switzer (not Fabio XM)
- Welcome bar mono labels render in JetBrains Mono (not Cascadia Mono)
- Hover any V2 button (Send Message, Download CV, project links) — overlay text swaps to JetBrains Mono 24px
- /experience and /about pages render correctly with new fonts
- /dev/buttons showcase still renders all 10 button variants without layout shifts
</verification>

<success_criteria>
- [ ] 4 woff2 variable fonts copied to src/fonts/
- [ ] globals.css has 4 new @font-face rules (Switzer × 2, JetBrains Mono × 2) and zero Fabio XM / Pexel Grotesk references
- [ ] `.type-overlay-hover` utility class defined in globals.css
- [ ] primitives.css points --primitive-font-sans to Switzer and --primitive-font-mono to JetBrains Mono
- [ ] semantic.css declares --text-overlay-hover token (= var(--primitive-text-2xl))
- [ ] All 26 hardcoded `'Pexel Grotesk', var(--font-sans)` inline styles in V2 components replaced by `type-overlay-hover` className
- [ ] `@fontsource/cascadia-mono` removed from package.json + pnpm-lock.yaml
- [ ] layout.tsx no longer imports cascadia-mono CSS
- [ ] CLAUDE.md prose updated (Switzer + JetBrains Mono everywhere)
- [ ] V2 component prose comments updated (StatsCard, BioBlock, ExperienceSection)
- [ ] Old TTF/OTF files in src/fonts/ untouched (cleanup at end of project)
- [ ] V1 components untouched (Skills/Projects/Philosophy/Header/Footer)
- [ ] `pnpm tsc --noEmit` exits 0
- [ ] `pnpm build` succeeds
</success_criteria>

<output>
After completion, create `.planning/quick/260428-fmr-swap-v2-typography-from-fabio-xm-pexel-g/260428-fmr-SUMMARY.md` capturing:
- Final font stack (Switzer + JetBrains Mono via woff2 variable, two families only)
- Token additions (--text-overlay-hover) and utility class (.type-overlay-hover)
- File counts: 4 woff2 added, ~26 inline styles refactored, 1 dependency removed
- Build verification result (tsc + build exit codes)
- Note that old TTF/OTF files remain in src/fonts/ pending end-of-project cleanup
- Commits produced (one per task = 5 commits)
</output>
