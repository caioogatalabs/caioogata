# Quick Task 260428-trs — V2 sans typography swap (Switzer → Epilogue)

**Status:** Complete
**Date:** 2026-04-28
**Depends on:** 260428-fmr (DSS additions for Switzer/JetBrains Mono)

## What changed

Token-only swap of `--primitive-font-sans` from Switzer to Epilogue. JetBrains Mono (`--primitive-font-mono`) and the `.type-overlay-hover` system from 260428-fmr remain untouched.

## Commits

| # | Hash | Subject |
|---|------|---------|
| 1 | `20a7e98` | feat(typography): self-host Epilogue variable woff2; swap Switzer @font-face |
| 2 | `79361e0` | feat(tokens): swap --primitive-font-sans Switzer → Epilogue |
| 3 | `508c828` | docs: update CLAUDE.md + V2 prose comments for Epilogue swap |

## Files modified

- `src/fonts/Epilogue-Variable.woff2` (added)
- `src/fonts/Epilogue-VariableItalic.woff2` (added)
- `src/app/globals.css` (Switzer @font-face → Epilogue, 2 blocks)
- `src/tokens/primitives.css` (`--primitive-font-sans: 'Epilogue', ...`)
- `src/tokens/semantic.css` (10 type-scale comments updated)
- `CLAUDE.md` (6 prose references updated)
- `src/components/sections/v2/experience/StatsCard.tsx` (comment)
- `src/components/sections/v2/about/BioBlock.tsx` (comment)

## What did NOT change

- `--primitive-font-mono` → still 'JetBrains Mono'
- `.type-overlay-hover` utility class
- `--text-overlay-hover` token
- Any V2 component code (no hardcoded font-family — work from 260428-fmr is permanent)
- V1 components (untouched per Path A isolation strategy)

## Verification

- `pnpm tsc --noEmit` → exit 0
- `pnpm build` → exit 0, 28 static pages (after `.next` cache clear due to `WasmHash` build-cache corruption from prior Switzer build)
- `grep -rn "Switzer" CLAUDE.md src/` → 0 matches (V1 untouched, src/fonts/ Switzer woff2 preserved as physical files only)

## Notes

- Switzer woff2 files (`src/fonts/Switzer-Variable.woff2`, `Switzer-VariableItalic.woff2`) preserved on disk per the user's "cleanup at end of project" rule. They are no longer loaded by any `@font-face` rule.
- Production V1 on `main` unaffected (this work lives on `v2`).
- `.next.bak.epilogue-*` directory created during cache clear — can be removed any time.

## Visual verification (deferred to user)

Restart dev server and confirm:
- Body text renders in Epilogue
- Mono labels/eyebrows still in JetBrains Mono
- Button hover overlay still in JetBrains Mono 24px (from `.type-overlay-hover`)
