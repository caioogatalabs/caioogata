---
quick_id: 260410-mqc
description: Footer collapsed height fix - remove phantom gap-5 between form and CTA
created: 2026-04-10
mode: quick
tasks: 1
---

# Quick 260410-mqc: Footer collapsed height fix

## Problem

The grey form card has `p-5 md:p-8 flex flex-col gap-5`. When collapsed, the form child collapses to `max-height: 0` but `gap-5` (20px) still applies between flex children, leaving dead space between the invisible form and the CTA button.

Collapsed math (desktop):
- padding-top: 32 (md:p-8)
- form: 0 (max-height 0)
- gap: 20 (phantom)
- button: 48 (h-12)
- padding-bottom: 32
- **total: 132px** — 20px more than necessary

Target: **112px** (padding + button only).

## Fix

Single file: `src/components/sections/v2/FooterSection.tsx` around lines 217-234.

1. Remove `gap-5` from the grey card div className.
2. Add animated `marginBottom` to the form wrapper inline style:
   - `marginBottom: isExpanded ? 20 : 0` (matches the removed `gap-5` = 1.25rem = 20px)
   - Extend the existing `transition` string to include `margin-bottom ${transitionDuration}`

### Before

```tsx
<div
  className="col-span-12 md:col-span-6 bg-bg-surface-tertiary rounded-[12px] p-5 md:p-8 flex flex-col gap-5"
  data-theme="light"
>
  <div
    id={EXPAND_CONTENT_ID}
    ref={contentRef}
    style={{
      maxHeight: isExpanded ? contentRef.current?.scrollHeight ?? 2000 : 0,
      opacity: isExpanded ? 1 : 0,
      overflow: 'hidden',
      transition: `max-height ${transitionDuration}, opacity ${transitionDuration}`,
    }}
  >
```

### After

```tsx
<div
  className="col-span-12 md:col-span-6 bg-bg-surface-tertiary rounded-[12px] p-5 md:p-8 flex flex-col"
  data-theme="light"
>
  <div
    id={EXPAND_CONTENT_ID}
    ref={contentRef}
    style={{
      maxHeight: isExpanded ? contentRef.current?.scrollHeight ?? 2000 : 0,
      marginBottom: isExpanded ? 20 : 0,
      opacity: isExpanded ? 1 : 0,
      overflow: 'hidden',
      transition: `max-height ${transitionDuration}, margin-bottom ${transitionDuration}, opacity ${transitionDuration}`,
    }}
  >
```

## Verification

- Collapsed card height = padding + button (~112px desktop, ~88px mobile)
- Expanded card keeps same 20px visual gap between form bottom and button top
- Transition smooth (both max-height and margin-bottom animate together)
- No regression on hover, toggle, auto-expand
