# Hover Cell Pattern — Unification across Menu / Experience / Skills

**Date:** 2026-04-29
**Branch:** v2
**Status:** Spec → Implementation

## Problem

Three components in V2 share a hover-driven "fill + reveal" interaction but diverge in mechanics, timing, and typography. The result is a visual language that feels inconsistent — each component feels like its own pattern instead of one design system response.

| Aspect | Menu (home) | Experience | Skills (about) |
|---|---|---|---|
| Fill mechanism | scaleX bar bleed -14px V | scaleX bar bleed -5px V | width 0%→N% (level-based), no bleed |
| Cell expand | yes | yes | **no** |
| Type swap | sans → mono **2.25rem (36px)** | sans → mono 1.5rem (24px) | **none** |
| Arrow → | 3.5rem mono | 3.5rem mono | none |
| Border radius | 12px | 12px | **0px** |
| Bar entrance | 0.6s `ease-out` | 0.6s `ease-out` | 0.5s generic ease |
| Level label (Skills) | n/a | n/a | text-xs mono, always visible at right; hard to read on yellow |

## Goal

Establish one **Hover Cell pattern** with three behaviors that always fire together, plus per-component proportional variations that respect each context's typographic hierarchy and density.

## Design

### Shared anatomy

Every hover cell across the three components has:

1. **Yellow fill bar** with `border-radius: 12px`, anchored at `transformOrigin: left center`.
2. **Cell expansion** via vertical bleed (negative top/bottom on the bar) — proportional to row density.
3. **Typography swap** from `var(--font-sans)` → `.type-overlay-hover` (mono) using masked vertical translate, same easing, same duration across all three.

### Shared timing tokens (no new tokens, all already exist)

| Property | Value | Source |
|---|---|---|
| Bar entry duration | `0.6s` | inline (current Menu/Exp) |
| Bar entry easing | `cubic-bezier(0.22,0.31,0,1)` | `--ease-out` |
| Bar entry delay | `0.04s` | inline |
| Bar exit duration | `0.5s` | inline |
| Bar exit delay | `0.06s` | inline |
| Type swap duration | `1s` | inline |
| Type swap easing | `cubic-bezier(0.16,1,0.3,1)` | inline |

### Per-component variations

#### Menu (home) — `MenuSection.tsx`

Single change: remove the inline `fontSize: '2.25rem'` overrides on the label and description hover overlays. The default `.type-overlay-hover` size (1.5rem / 24px) is what we want — it matches Experience and brings the menu in line.

```diff
- // Override .type-overlay-hover default size (1.5rem) → 2.25rem for menu label emphasis
- fontSize: '2.25rem',
```

Both overlay span on label (line ~184) and description (line ~221).

Everything else (bleed -14px, arrow 3.5rem, bar radius, timing) stays.

#### Experience — `ExperienceSection.tsx`

**No changes.** This is the canonical reference for the unified pattern.

#### Skills — `SkillsBlock.tsx`

This file gets the most work — three additions and one modification:

1. **Border radius**: bar gains `border-radius: 12px` (was 0).
2. **Cell expansion**: bar bleeds `-3px` top/bottom (currently `inset-y-0`, no bleed). Proportional to the denser skill rows (each row is ~text-base + py-2 vs Menu's text-lg + py-3).
3. **Bar timing/easing alignment**: bar transitions become `transform 0.6s cubic-bezier(0.22,0.31,0,1) 0.04s, opacity 0.2s ...` for entry; `0.5s ... 0.06s` for exit — matching Menu/Experience. **However**, the fill dimension here is `width` (not `transform`), since width is what carries the level semantic (Expert=95%, etc.). So the transition property is `width 0.6s/0.5s` with the same easing; opacity transitions in tandem.
4. **Typography swap on skill name**: add masked vertical text swap, sans → `.type-overlay-hover` at `fontSize: '1.25rem'` (20px). The 1.25× ratio over text-base preserves the proportional relationship (Menu/Exp use 24px / 18px ≈ 1.33×; Skills uses 20px / 16px = 1.25× — slightly tighter because the row is denser).
5. **Level label transformation**: the label (Expert/Advanced/Proficient/Familiar) is removed from the always-visible default state and re-introduced inside the hover state, on the right edge of the row, animated with the same masked vertical swap as the skill name. Mono, 1.25rem, `var(--color-text-on-primary)` color.

Level label positioning — anchored to the YELLOW BAR, not the row.

**Problem with row-anchored placement (initial draft):** if the label sits flush-right of the row, on Expert (95% fill) the un-filled portion is only 5% — narrower than the label's mono text width. Half of "Expert" then bleeds past the yellow tip onto the dark background, where on-primary (dark) text becomes essentially invisible.

**Solution — anchor the label container to the bar's right edge.** Use absolute positioning on the row with:

```
top: 0; bottom: 0; left: 0;
right: calc(100% - LEVEL_WIDTH);
overflow: hidden; pointer-events: none;
```

This makes the label container exactly the width of the yellow bar. An inner `absolute inset-0 flex items-center justify-end` span with `padding-right: 0.75rem` puts the text right-justified inside the bar with breathing room from the bar's right edge. Result: the label always sits inside the yellow zone, regardless of level (Expert at 95% → label near the row's right edge; Familiar at 35% → label at the 35% mark, sitting in mid-row).

**Translate-clip detail:** the inner span must be `absolute inset-0` (full container height), not just inline text. With inline text, `transform: translateY(100%)` only translates by the text's own height (~20px for 1.25rem mono with line-height 1) — leaking the top half of the label through the `overflow-hidden` clip. With `absolute inset-0`, the inner span fills the container, so `translateY(100%)` moves it by the full row height (~40px) and the clip is total.

**Color decision:** label is always `var(--color-text-on-primary)` (high-contrast dark on yellow) because it now always sits inside the yellow bar — no need for color-conditional logic on fill width.

### Preserved behaviors

- Skills' level-based fill width (`LEVEL_WIDTH` map: Expert 95%, Advanced 75%, Proficient 55%, Familiar 35%) — confirmed kept (option A).
- Skills has no arrow indicator (rows are non-navigable, `cursor-default`).
- Skills' category accordion (header click → expand) is unchanged. The hover cell pattern applies only to the skill rows inside the expanded panel.
- Menu's keyboard nav, Experience's accordion expand state, Skills' exclusive category accordion — all unchanged.
- `prefers-reduced-motion` guards stay in place per component.

## Acceptance criteria

- Menu hover overlay typography is 1.5rem (24px), not 2.25rem.
- Skills row hover triggers (a) cell expand via 3px V bleed, (b) yellow bar with 12px radius growing from 0% width to level-mapped width, (c) skill name swaps to mono 1.25rem, (d) level label appears anchored to the bar's right edge in mono 1.25rem on-primary (always inside the yellow), (e) all three animations fire together with the unified timing.
- Skills' default state shows skill name only (no level label visible). Level label is hover-only.
- Bar timing in Skills matches Menu/Experience: 0.6s entry, 0.5s exit, ease-out + opacity.
- Experience component file has zero diff.
- `prefers-reduced-motion` collapses all transitions to 0s in all three components.

## Out of scope

- No changes to Menu's keyboard nav, FloatingPreview, or accordion behaviour in Experience.
- No new design tokens or CSS utility classes — all changes use existing `.type-overlay-hover`, existing easing tokens, and existing color tokens.
- No type-overlay-hover-sm size variant — Skills uses an inline `fontSize: '1.25rem'` override, mirroring how Menu currently inline-overrides to 2.25rem (which we're removing). Symmetry preserved.
- No changes to Skills' category header (+ / − indicator and accordion expand). The unification applies only to skill rows.

## Implementation notes

- Files touched:
  - `src/components/sections/v2/MenuSection.tsx` — remove 2 inline `fontSize: '2.25rem'` overrides.
  - `src/components/sections/v2/about/SkillsBlock.tsx` — restructure skill row to add type swap on name, hide-then-swap on level label, add bleed + radius + timing on bar.
- No new files. No token changes. No CSS class changes.
- Verification: `pnpm dev`, hover each of the three components, verify with `prefers-reduced-motion: reduce` toggle that motion collapses cleanly. Visual diff on Menu (smaller hover type), Skills (full new pattern). Experience untouched.
