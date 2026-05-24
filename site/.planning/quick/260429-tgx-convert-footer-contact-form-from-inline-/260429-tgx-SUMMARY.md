---
phase: 260429-tgx
plan: quick
subsystem: V2 contact UX
tags: [v2, contact-overlay, fab, footer, intersection-observer]
dependency-graph:
  requires: [useContactForm, MenuSection (existing open-contact dispatch)]
  provides: [ContactOverlay, FloatingContactButton, slim FooterSection]
  affects: [src/components/layout/PageShell.tsx, src/components/sections/v2/StickyLogoBar.tsx]
tech-stack:
  added: []
  patterns:
    - Window CustomEvent channel ('open-contact' / 'close-contact') for cross-component overlay control
    - IntersectionObserver on a stable data-attribute target for FAB visibility
    - aria-modal="false" non-modal floating dialog (body keeps scrolling, no backdrop)
key-files:
  created:
    - src/components/sections/v2/ContactOverlay.tsx
    - src/components/sections/v2/FloatingContactButton.tsx
  modified:
    - src/components/sections/v2/StickyLogoBar.tsx (data-share-with-ai attribute)
    - src/components/sections/v2/FooterSection.tsx (slimmed 418 -> 125 lines)
    - src/components/layout/PageShell.tsx (mount overlay + FAB at root)
decisions:
  - FooterSection stays mounted in app/layout.tsx (not duplicated in PageShell) — PageShell only adds the two new fixed-position components.
  - Twitch dropped from overlay social list (4 links: LinkedIn / GitHub / Instagram / YouTube) per spec.
  - FAB icon is "+" matching the existing footer/StickyLogoBar pattern (not "→").
  - Overlay uses bg-bg-fill-primary (yellow) with text-text-primary inside data-theme="inverse"; Submit button is outlined w/ text-primary border + slide-up text-primary fill (inverted secondary fill pattern) so the primary CTA reads as solid dark on yellow on hover. Clear button uses standard outline secondary fill.
  - Subject chips: selected state uses bg-text-primary + text-bg-fill-primary (inverted from default selected pattern) for stronger contrast on the yellow surface.
  - Overlay DOM stays mounted when closed (opacity 0 + pointer-events none) — preserves form state for re-open speed; resetForm fires on close after exit transition (skipped if mid-submit).
  - Overlay social rows borrow the "row + secondary fill on hover + label-left/`↗`-right" pattern (mono ↗ glyph). They use a single bordered container (rounded-[12px]) with internal first-child border-top-0 dividers — matches the "thin-bordered list" guidance.
metrics:
  duration: ~25 min
  completed: 2026-04-29
---

# Quick 260429-tgx: Convert Footer Contact Form from Inline to Floating Overlay — Summary

Converted the V2 footer's inline-expand contact form into a floating bottom-right overlay (`50%×80%` lg / full-viewport mobile, yellow `data-theme="inverse"` surface, no backdrop, body keeps scrolling). Footer collapses to a minimal "tags + © + Contact pill" bar. Added a Floating Contact FAB that surfaces only when the StickyLogoBar's `ask about` CTA leaves the viewport, giving the home page a persistent contact entry point without occupying the hero.

## What Changed

### New components

**`src/components/sections/v2/ContactOverlay.tsx`** (572 lines) — Floating contact overlay.
- Listens to window `open-contact` (open) and `close-contact` (close); Escape closes; reuses `useContactForm(form.validation)` directly — no validation re-implementation.
- Layout: header strip ("Get in touch") + scroll region with 70/30 form/social columns + footer-of-card Close pill+× group.
- Form: stacked Name/Email rows (bordered cells), Subject chips (radiogroup), full-width Message textarea, Submit + Clear buttons. **No FormLog column.**
- Right column: vertical social list (LinkedIn / GitHub / Instagram / YouTube) — `target="_blank" rel="noopener noreferrer"`, `↗` glyph at right, secondary-fill hover.
- Success state: replaces card body with `form.success` headline + `successDetail` + Close button.
- Reduced-motion: useRef + matchMedia gate; collapses transitions to `'none'`.
- Container: `data-theme="inverse"`, `aria-modal="false"`, `bg-bg-fill-primary` (yellow), `rounded-[12px]`, `bottom-4/right-4/left-4` mobile + `lg:bottom-6 lg:right-6 lg:w-[50vw] lg:h-[80vh]` desktop, `overflow-hidden` on the card only (NOT the page) with internal `overflow-y-auto`.

**`src/components/sections/v2/FloatingContactButton.tsx`** (123 lines) — FAB.
- IntersectionObserver target: `[data-share-with-ai]` (the StickyLogoBar `ask about` anchor).
- Contract: FAB is visible iff target is **NOT** intersecting. `rootMargin: '0px 0px -10% 0px'` so the FAB shows just before the target fully exits at the top.
- Click on either pill or `+` square dispatches `window.dispatchEvent(new CustomEvent('open-contact'))`.
- `z-[70]` (below overlay's `z-[80]`, above page).
- Reduced-motion: same useRef + matchMedia pattern; transitions become `'none'`.

### Modified

**`src/components/sections/v2/StickyLogoBar.tsx`** — added a single attribute (`data-share-with-ai`) on the `ask about` anchor. Diff is intentionally one line.

**`src/components/sections/v2/FooterSection.tsx`** — slimmed from **418 → 125 lines** (-293 lines).
- Removed: `ContactForm` import, `SocialLink` helper, `SecondaryFill` helper, `SOCIAL_ICONS` map, `isOpen`/`isExpanded`/`showContent`/`groupHovered` state, `openDrawer`/`closeDrawer`/`toggleDrawer` callbacks, `open-contact` listener, Escape listener, `scrollIntoView` effect, the entire grey-card right-half block, the `EXPAND_CONTENT_ID` constant.
- Kept: `TECH_TAGS` const, `useInView` for entrance, the masked text-swap CTA pill+× pattern (now dispatches `open-contact` only — no toggle).
- Top padding reduced from `pt-[400px]` to `pt-32 md:pt-40` since there's no longer a giant card occupying space.

**`src/components/layout/PageShell.tsx`** — adds `<FloatingContactButton />` and `<ContactOverlay />` as the last two children (root-level fixed-position siblings). Documented inline that FooterSection is intentionally NOT mounted here (it lives in `app/layout.tsx`).

## Verification

- `pnpm tsc --noEmit` exits **0** after each task and at end-of-plan. No new TypeScript errors.
- `pnpm lint` skipped — `next lint` is deprecated and prompts interactively for ESLint config (not viable in non-interactive context). No lint config currently in repo.
- No raw hex colors introduced; all colors flow through semantic tokens (`bg-bg-fill-primary`, `text-text-primary`, `bg-text-primary`, `text-bg-fill-primary`, `border-border-primary`, `border-text-primary`, `bg-bg-fill-outline-hover`, `text-text-on-outline-hover`).
- No shadows introduced — depth via tonal layering only.
- Radii: `rounded-[12px]` on the card + square buttons + Clear, `rounded-full` on pills, no 0px.

## Manual checks pending (Task 3 — checkpoint:human-verify)

The plan includes a manual browser verification step that cannot be performed in this autonomous context. The user should run `pnpm dev` and visit http://localhost:3000 to verify:

1. **Initial state**: yellow `ask about` CTA visible top-right; FAB NOT visible; no overlay.
2. **Scroll down**: when `ask about` leaves viewport, FAB animates in (slide-up + fade).
3. **Scroll back up**: FAB animates out as `ask about` re-enters viewport.
4. **Open via FAB**: overlay animates in from bottom-right (50%×80% lg). **Verify body keeps scrolling — no scroll lock, no backdrop.**
5. **Open via footer Contact**: scroll to footer, click Contact pill or `+` — same overlay opens.
6. **Open via Menu**: navigate to Contact item in MenuSection and press Enter — same overlay opens (existing `open-contact` dispatch from `MenuSection.tsx:35` still works).
7. **Form submit**: fill Name + Email, pick Subject chip, type Message, Send — POST to `/api/contact` (Resend); success state renders inside the card.
8. **Clear**: button resets form.
9. **Close paths**: Escape closes; Close pill closes; × closes.
10. **Mobile (<768px)**: overlay becomes full-viewport with 16px margins, still rounded, no backdrop.
11. **Reduced motion**: toggle macOS Reduce Motion → reload → overlay/FAB appear instantly, no transitions.
12. **Keyboard parity**: Tab walks Name → Email → chips → textarea → Send → Clear → social links → Close pill → ×. FAB itself is focusable when visible.

## Decisions Made

1. **FooterSection mount point untouched** — discovered via grep that FooterSection is mounted in `app/layout.tsx`, not PageShell. Plan's Task 2.3 contemplated both cases; took the "leave PageShell footer-free" branch per its conditional instruction.
2. **Yellow surface contrast model** — overlay sits on `bg-bg-fill-primary` (yellow) inside `data-theme="inverse"`, which remaps `text-text-primary` to dark brand text. Submit button inverts the secondary fill pattern: outlined `border-text-primary` + slide-up `bg-text-primary` fill + `text-bg-fill-primary` on hover. Subject chips selected state inverted to `bg-text-primary + text-bg-fill-primary` for stronger contrast on yellow.
3. **Overlay DOM kept mounted** — closed state uses `opacity: 0 + pointerEvents: none` instead of unmount, so re-open animates from prior position (no remount cost) and form state survives until reset. `resetForm()` runs after exit transition (skipped if mid-submit).
4. **Twitch dropped** — overlay social list shows 4 links (LinkedIn / GitHub / Instagram / YouTube). Twitch icon kept in en.json content (5th link there) but filtered out by `SOCIAL_ORDER` const in ContactOverlay.
5. **Out-of-scope changes deferred** — `BioBlock.tsx` and `SkillsBlock.tsx` had pre-existing uncommitted changes from a parallel quick task (`260429-thh`); not touched. Logged in `deferred-items.md`.
6. **Lint skipped** — `next lint` is deprecated and prompts for interactive ESLint config (not viable in autonomous context). `tsc --noEmit 0` is the canonical verification.

## Deviations from Plan

None — plan executed exactly as written. The single conditional decision (PageShell footer mount) resolved cleanly to "do not add FooterSection to PageShell" per the plan's own conditional instruction (Task 2.3, second paragraph).

## Files (final)

- `src/components/sections/v2/ContactOverlay.tsx` — **created** (572 lines)
- `src/components/sections/v2/FloatingContactButton.tsx` — **created** (123 lines)
- `src/components/sections/v2/StickyLogoBar.tsx` — **modified** (+1 line: `data-share-with-ai` attribute)
- `src/components/sections/v2/FooterSection.tsx` — **modified** (418 → 125 lines, -293)
- `src/components/layout/PageShell.tsx` — **modified** (3 imports + 2 components + comment)

## Commits

- `c1bcb34` — `feat(quick-260429-tgx): add ContactOverlay + StickyLogoBar data hook`
- `e3be2af` — `feat(quick-260429-tgx): FAB + slim footer + mount overlay in PageShell`
- `a7045a7` — `fix(quick-260429-tgx): use bg-bg on inverse-themed overlay (was bg-fill-primary → dark)` — post-execution smoke test fix

## Post-execution smoke test (2026-04-30)

Manual playwright verification on `/` flagged that `bg-bg-fill-primary` on the `data-theme="inverse"` overlay resolved to `brand-950` (dark — that token is reserved for the dark pills sitting on yellow), not the yellow surface. Swapped to `bg-bg` which resolves to `brand-400` in inverse mode (yellow). Confirmed visually: yellow surface, bottom-right anchor, 50%×80% on lg, content layout matches Figma 826:303 (Get in touch heading, name+email rows, 4 subject chips, full-width message textarea, Send Message + Clear left, vertical socials right with proper SVG icons + ↗, Close + × bottom-right). Body scroll preserved while overlay is open.

## Self-Check: PASSED

- ContactOverlay.tsx: FOUND
- FloatingContactButton.tsx: FOUND
- Slim FooterSection.tsx (125 lines): FOUND
- PageShell.tsx with new imports + mounts: FOUND
- StickyLogoBar.tsx with data-share-with-ai: FOUND
- Commit c1bcb34: FOUND
- Commit e3be2af: FOUND
- pnpm tsc --noEmit: EXIT=0
