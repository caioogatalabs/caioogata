# Phase 3: Project Pages - Discussion Log

> **Audit trail only.** Do not use as input to planning, research, or execution agents.
> Decisions are captured in CONTEXT.md — this log preserves the alternatives considered.

**Date:** 2026-04-06
**Phase:** 03-project-pages
**Areas discussed:** Page layout & hero, Image gallery, Inter-project nav, Page transitions, Credits/metadata

---

## Page Layout & Hero

| Option | Description | Selected |
|--------|-------------|----------|
| Full-bleed image | Hero image spans full viewport width, title overlaid or below | |
| Contained hero | Hero image within 12-col grid, title above | |
| Split layout | Image 6-col + title 6-col side by side | |

**User's choice:** Component-based composition. Hero always has display text + either full-width 12-col image OR two 6-6 images. Referenced Figma nodes 359:248 and 359:252 as references.
**Notes:** Pages are assembled from reusable block components, not a rigid template. Each project can compose differently.

---

## Page Layout — Hero Metadata

| Option | Description | Selected |
|--------|-------------|----------|
| Year + role + tech | Data-stamp, role, technologies in hero | ✓ |
| Year + role only | Lighter, tech shown below | |
| Title only | Minimal, all metadata below hero | |

**User's choice:** Year + role + tech (Recommended)

---

## Page Layout — Content Below Hero

| Option | Description | Selected |
|--------|-------------|----------|
| Description + impact + gallery | Uses existing en.json fields | |
| Free-form sections | Requires extending content model | |
| Description + credits + gallery | Highlights collaboration | |

**User's choice:** Challenge/solution structure (like fiddle.digital/work/tarotoo), then big impact numbers when available. All on column grid.

---

## Image Gallery — Type 1: Staggered Grid

| Option | Description | Selected |
|--------|-------------|----------|
| Grid with mixed spans | 12, 6-6, 4-4-4 layouts per project | ✓ |
| Uniform grid | All images same size | |
| Masonry | Pinterest-style variable height | |

**User's choice:** Staggered grid with mixed column spans, scroll-reveal expand. Referenced Figma node 361:301.

---

## Image Gallery — Type 2: Feature List

**User's choice:** Described directly. Vertical stack in 3-6-3 grid. Feature name left, image center (6-col), description right. Scroll-reveal + parallax float on image. Referenced Figma node 359:256.

---

## Image Gallery — Type 3: Full Detail

**User's choice:** Described directly. Generous block (1+ viewport height), large image + extended text description. Editorial showcase. Referenced Figma node 361:293.

---

## Image Zoom

| Option | Description | Selected |
|--------|-------------|----------|
| Inline only | No lightbox, images large enough in context | ✓ |
| Lightbox on click | Full-screen overlay on click | |
| You decide | Claude picks | |

**User's choice:** Inline only (Recommended)

---

## Inter-project Navigation

| Option | Description | Selected |
|--------|-------------|----------|
| Footer nav bar | Bar at bottom with next/prev | |
| Next project CTA block | Large visual block showing next project | |
| Sticky side arrows | Fixed arrows on viewport edges | |

**User's choice:** Like V1 — nav bar below hero/intro AND another at end of content. If one is sticky, single sticky bar at top. Back/Esc + arrow key navigation consistent with Phase 2 keyboard nav.

---

## Navigation — Last Project Behavior

| Option | Description | Selected |
|--------|-------------|----------|
| Loop to first | Circular navigation | |
| Show 'Back to Home' | Replace next with home link | ✓ |
| Hide next arrow | Simply remove next button | |

**User's choice:** Show 'Back to Home'

---

## Page Transitions

| Option | Description | Selected |
|--------|-------------|----------|
| Card expand morph | Clicked card morphs into project hero | |
| Fade crossfade | Fade out/in with slide-up | |
| Clip-path reveal | Circle/inset expands from click point | |

**User's choice:** Deferred — brand motion direction needs to evolve. Use same entrance as Home (fade + slide-up) for now.

---

## Credits Display

| Option | Description | Selected |
|--------|-------------|----------|
| Footer section | Credits at bottom after galleries | ✓ |
| Sidebar alongside content | Credits in side column | |
| Inline after description | Credits between description and galleries | |

**User's choice:** Footer section

---

## Role/Tech/Links Display

| Option | Description | Selected |
|--------|-------------|----------|
| Hero metadata row | Tags in hero area | |
| Dedicated info block | Spec sheet below galleries | ✓ |
| Scattered contextually | Each field where most relevant | |

**User's choice:** Dedicated info block at bottom, after images. Grid list dark bar layout (Figma 362:312) with columns for Project, Client, Role, Tech, Year, Links.

---

## Claude's Discretion

- Content model extensions for gallery type definitions
- Responsive behavior of Gallery 2 (3-6-3) on mobile
- Parallax implementation details for Gallery 2
- Static params generation approach

## Deferred Ideas

- Custom page transitions (card morph, clip-path reveal) — deferred until brand motion evolves
- Video embeds in galleries
- Per-project color theming
