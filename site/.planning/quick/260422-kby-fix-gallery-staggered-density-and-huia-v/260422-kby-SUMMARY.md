---
plan: 260422-kby
status: complete
started: 2026-04-22T17:38:00Z
completed: 2026-04-22T17:45:00Z
duration: ~7min
---

# Quick Task 260422-kby: Fix gallery-staggered density and Huia video layout

## What Changed

Redistributed gallery-staggered span configurations in `src/content/en.json` for 3 projects. No component code changes — purely content data.

### azion-website (4 rows -> 5 rows)
- Before: `[12], [6,6], [4,4,4], [6,6]` — all rows fill 12 cols
- After: `[12], [8,4], [4,4], [8], [4,8]` — asymmetric spans, partial rows with breathing room

### azion-brand-system (8 rows -> 9 rows)
- Before: `[12], [6,6], [4,4,4], [6,6], [4,4], [4,4,4], [4,4], [4,4,4]` — mostly full rows
- After: `[12], [8,4], [4,4,4], [4,8], [6,4], [4,4], [8], [6,4], [4,4,4]` — alternating asymmetry, partial rows

### huia (7 rows -> 5 rows)
- Before: `[6,6], [6,6]` + 5 separate `[4]` video rows (tiny, left-aligned)
- After: `[8,4], [4,8]` images + `[6,6], [6,6], [6]` videos (paired at half-width)

### azion-console-kit
- Unchanged (1 row, already fine)

## Key Files

- `src/content/en.json` — gallery span redistributions

## Commits

- `abce2c4` — content: redistribute gallery-staggered spans

## Decisions

- Kept all existing images — only changed span arrays and row groupings
- Used alternating asymmetry pattern (8-4, 4-8) for visual rhythm
- Grouped Huia videos into pairs at 6-col width for usable size
