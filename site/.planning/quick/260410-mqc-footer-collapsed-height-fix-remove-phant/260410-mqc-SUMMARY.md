---
quick_id: 260410-mqc
status: completed
date: 2026-04-10
---

# Quick 260410-mqc: Footer collapsed height fix

## What changed

`src/components/sections/v2/FooterSection.tsx`:

- Removed `gap-5` from the grey card div (line 219).
- Added animated `marginBottom: isExpanded ? 20 : 0` to the form wrapper inline style (line 228).
- Extended transition string to include `margin-bottom ${transitionDuration}` (line 231).

## Result

Collapsed card height now = padding + button only (no phantom gap). The 20px visual gap between form and CTA is preserved in expanded state, animated via margin-bottom alongside max-height.

## Verification pending

Visual check: run `pnpm dev`, confirm collapsed card is ~112px (desktop) / ~88px (mobile), expand transition smooth.
