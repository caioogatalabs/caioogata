---
phase: 260428-trs
plan: quick
type: execute
wave: 1
depends_on: [260428-fmr]
files_modified:
  - src/fonts/Epilogue-Variable.woff2
  - src/fonts/Epilogue-VariableItalic.woff2
  - src/app/globals.css
  - src/tokens/primitives.css
  - src/tokens/semantic.css
  - CLAUDE.md
  - src/components/sections/v2/experience/StatsCard.tsx
  - src/components/sections/v2/about/BioBlock.tsx
  - src/components/sections/v2/ExperienceSection.tsx
autonomous: true
must_haves:
  truths:
    - "Browser renders body text in Epilogue (not Switzer)"
    - "JetBrains Mono unchanged for --font-mono and .type-overlay-hover"
    - "No hardcoded font-family inline style introduced"
    - "pnpm build succeeds and pnpm tsc --noEmit exits 0"
    - "Switzer woff2 files preserved on disk (cleanup later)"
  key_links:
    - from: "src/tokens/primitives.css"
      to: "Epilogue @font-face in globals.css"
      via: "--primitive-font-sans → 'Epilogue'"
      pattern: "--primitive-font-sans:.*Epilogue"
---

<objective>
Replace V2 sans typography Switzer → Epilogue. Token-only swap. JetBrains Mono and the .type-overlay-hover system from quick task 260428-fmr remain untouched.
</objective>

<context>
This is a derivative of quick task 260428-fmr (Switzer + JetBrains Mono swap). The DSS additions (`.type-overlay-hover`, `--text-overlay-hover`) are permanent — only the sans family changes here.

Source files (already on disk):
- font-test/Epilogue_Complete/Fonts/WEB/fonts/Epilogue-Variable.woff2
- font-test/Epilogue_Complete/Fonts/WEB/fonts/Epilogue-VariableItalic.woff2

Existing Switzer references to update:
- src/app/globals.css — 2 @font-face blocks (Switzer normal + italic)
- src/tokens/primitives.css — line ~96 `--primitive-font-sans: 'Switzer', ...`
- src/tokens/semantic.css — type-scale comments mentioning "Switzer"
- CLAUDE.md — multiple prose references to "Switzer"
- V2 component comments referencing Switzer (StatsCard.tsx, BioBlock.tsx, ExperienceSection.tsx)

Switzer woff2 files in src/fonts/ stay (cleanup later, same rule as Fabio/Pexel).
</context>

<tasks>

<task type="auto">
  <name>Task 1: Install Epilogue + rewrite Switzer @font-face blocks</name>
  <files>src/fonts/Epilogue-Variable.woff2, src/fonts/Epilogue-VariableItalic.woff2, src/app/globals.css</files>
  <action>
1. Copy 2 variable woff2 files into src/fonts/:
   - cp font-test/Epilogue_Complete/Fonts/WEB/fonts/Epilogue-Variable.woff2 src/fonts/
   - cp font-test/Epilogue_Complete/Fonts/WEB/fonts/Epilogue-VariableItalic.woff2 src/fonts/

2. Edit src/app/globals.css — REPLACE the two Switzer @font-face blocks with Epilogue:

```css
@font-face {
  font-family: 'Epilogue';
  src: url('../fonts/Epilogue-Variable.woff2') format('woff2-variations');
  font-weight: 100 900;
  font-style: normal;
  font-display: swap;
}

@font-face {
  font-family: 'Epilogue';
  src: url('../fonts/Epilogue-VariableItalic.woff2') format('woff2-variations');
  font-weight: 100 900;
  font-style: italic;
  font-display: swap;
}
```

JetBrains Mono blocks stay. .type-overlay-hover stays. Switzer woff2 files NOT deleted.
  </action>
  <verify>grep -q "font-family: 'Epilogue'" src/app/globals.css && ! grep -q "font-family: 'Switzer'" src/app/globals.css && ls src/fonts/Epilogue-Variable.woff2</verify>
  <done>2 Epilogue woff2 files in src/fonts/. globals.css has 2 Epilogue @font-face rules + 2 JetBrains Mono blocks + .type-overlay-hover utility. No Switzer reference in globals.css.</done>
</task>

<task type="auto">
  <name>Task 2: Update --primitive-font-sans to Epilogue</name>
  <files>src/tokens/primitives.css</files>
  <action>
Edit src/tokens/primitives.css line 96 — REPLACE:
`--primitive-font-sans: 'Switzer', system-ui, -apple-system, sans-serif;`
WITH:
`--primitive-font-sans: 'Epilogue', system-ui, -apple-system, sans-serif;`

Leave --primitive-font-mono ('JetBrains Mono') untouched.
  </action>
  <verify>grep -q "primitive-font-sans:.*'Epilogue'" src/tokens/primitives.css && grep -q "primitive-font-mono:.*'JetBrains Mono'" src/tokens/primitives.css</verify>
  <done>primitives.css points --primitive-font-sans at Epilogue; mono unchanged.</done>
</task>

<task type="auto">
  <name>Task 3: Update prose (CLAUDE.md + semantic.css comments + V2 comments) + build verify</name>
  <files>
    CLAUDE.md,
    src/tokens/semantic.css,
    src/components/sections/v2/experience/StatsCard.tsx,
    src/components/sections/v2/about/BioBlock.tsx,
    src/components/sections/v2/ExperienceSection.tsx
  </files>
  <action>
1. CLAUDE.md: replace every "Switzer" with "Epilogue".
2. src/tokens/semantic.css: replace "Switzer" with "Epilogue" in type-scale comments only (no value changes).
3. V2 component comments: replace "Switzer" with "Epilogue" in code-comment prose only (StatsCard.tsx, BioBlock.tsx, ExperienceSection.tsx).
4. Run pnpm tsc --noEmit (must exit 0) and pnpm build (must succeed).
5. Smoke-grep: `grep -rn "Switzer" --exclude-dir=node_modules --exclude-dir=.next --exclude-dir=font-test --exclude-dir=src/fonts --exclude-dir=.planning .` — only acceptable matches: docs/v2/ historical references and .planning/ archives. src/, CLAUDE.md, package.json must return zero.
  </action>
  <verify>! grep -q "Switzer" CLAUDE.md && ! grep -rq "Switzer" src/components/sections/v2/ src/tokens/ && pnpm tsc --noEmit && pnpm build 2>&1 | tail -5</verify>
  <done>Zero "Switzer" matches in src/, CLAUDE.md. tsc clean. Build succeeds.</done>
</task>

</tasks>

<success_criteria>
- [ ] 2 Epilogue woff2 files in src/fonts/
- [ ] globals.css: Epilogue @font-face × 2, JetBrains Mono × 2, .type-overlay-hover preserved
- [ ] primitives.css: --primitive-font-sans → 'Epilogue'
- [ ] No Switzer reference in src/, CLAUDE.md
- [ ] Switzer woff2 files preserved on disk
- [ ] V1 components untouched
- [ ] pnpm tsc --noEmit clean, pnpm build succeeds
</success_criteria>
</content>
</invoke>