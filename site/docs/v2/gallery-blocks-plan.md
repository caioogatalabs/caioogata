# Gallery Blocks — Comparison & Implementation Plan

Comparison between fiddle.digital project page gallery patterns and our current portfolio blocks.
Goal: decide which new blocks to implement to increase visual impact and storytelling quality.

---

## Current Blocks (Ours)

### 1. `gallery-staggered`
**What it does:** Flattens all images into a zigzag pattern. Each image occupies 4/12 columns (33%), positioned alternately at col 5→9→5→1.

**Data model:** `rows[]` with `spans[]` and `images[]` — but the component **ignores spans** and flattens everything into zigzag.

**Rendering:**
```
grid-cols-12, each item col-span-4
Height: fixed 340px
Position: alternates center→right→center→left
Effect: scroll-reveal clip-path
```

**Problem:** The `spans` in the JSON (12, 6-6, 4-4-4) suggest a flexible grid layout, but the component renders them all as small 4-col zigzag tiles. The data model promises more than the component delivers.

**Used by:** Azion Website (7 images), Console Kit (2 images), Azion Console (10+ images), WebKit (14+ images)

---

### 2. `gallery-feature-list`
**What it does:** Grid 4-5-3 layout — feature name (left), image (center), description (right). Vertical stack of features.

**Rendering:**
```
Grid 4-5-3 (text + image + description)
Image: parallax + scroll-reveal
Feature name: repeated twice (small label + large display)
Height: text column fixed at 410px
```

**Good for:** Named features with descriptions (Product Navigation, Developer Tools, etc.)

**Used by:** All 5 projects (2-4 features each). Supports video, figma embeds, and images.

---

### 3. `gallery-full-detail`
**What it does:** Split layout — text on one side, full-height image on the other. Configurable 4-8 or 8-4.

**Rendering:**
```
Grid 4-8 or 8-4
Image: min-h-screen with scroll-reveal
Text: heading + description
```

**Problem:** Not used by any project in the current content. Exists as code but zero instances in en.json.

---

## Fiddle Blocks (Reference)

### F1. `narrow-media` — Centered Showcase
Single image, centered at ~56% viewport width (~8 cols equivalent), with generous margins (~22% each side). Images stack vertically with minimal 4px gap.

**Visual effect:** Clean, editorial. The whitespace commands attention on the image. Aspect ratio: natural (16:10 in their case).

**Best for:** Hero screenshots, key UI moments that deserve focused attention.

---

### F2. `wide-media` — Full-Bleed Impact
Image at 100% viewport width (some at 140% with overflow:hidden bleed). Zero margins, zero radius.

**Visual effect:** Cinematic. Breaks the page rhythm completely. Creates immersive moments.

**Best for:** Environmental/context photos, brand imagery, full-page screenshots of websites.

---

### F3. `blend-media` — Tonal Highlight
Image centered (~56% width) with a tonal background fill (position:relative, padding 135px vertical). The bg color creates a "stage" for the image.

**Visual effect:** Elevates one image above the normal flow. The bg tint acts as a spotlight.

**Best for:** A single standout screenshot or mockup that deserves special framing.

---

### F4. `stick-gallery` — Scroll-Pinned Showcase
Content pinned to viewport while scroll advances. Slides swap based on scroll position. Container is 2700-3600px tall (3-4x viewport) but content stays fixed.

**Visual effect:** Most sophisticated pattern. Forces the user to "scrub" through states of a feature. Feels like an interactive demo.

**Best for:** Multiple states of the same UI (hover/active/mobile), step-by-step flows, before/after comparisons.

---

### F5. `grid` — Asymmetric Media Grid
14-column CSS grid with items placed at specific columns. Mixed aspect ratios (portrait + landscape) and media types (video + image) in the same grid.

**Visual effect:** Creates visual tension and hierarchy. Items at different sizes and positions feel curated, not templated.

**Best for:** Collections of UI interactions (short videos), component showcases, diverse media mixes.

---

### F6. `grid 2-up portrait` — Side-by-Side Portraits
Two portrait images (aspect ~4:5, ~702px each) side by side at near full-width. Multiple rows stacked.

**Visual effect:** Gallery wall. Dense visual presentation. Works beautifully for mobile screenshots.

**Best for:** Mobile app screens, portrait-oriented mockups, pairwise comparisons.

---

### F7. `sticky + video` — Pinned Video with Scrolling Text
Small video (~300px) stays pinned while text content scrolls beside it.

**Visual effect:** The video provides continuous visual context while the text tells the story.

**Best for:** Process documentation, interactive demos, micro-interaction showcases.

---

## Mapping: What Translates to Our Portfolio

| Fiddle Block | Our Equivalent | Gap | Priority |
|---|---|---|---|
| F1. narrow-media | `gallery-staggered` (broken) | We zigzag at 33% width instead of centering at 56-66%. Our staggered ignores the span data. | High — fix existing |
| F2. wide-media | None | No full-bleed images. Everything constrained by px-16 padding. | Medium |
| F3. blend-media | None | No tonal background framing for images. | Low |
| F4. stick-gallery | None | No scroll-pinned content. | Low (high effort) |
| F5. asymmetric grid | `gallery-staggered` (broken) | We have fixed 4-col tiles. No mixed aspect ratios or free placement. | High — fix existing |
| F6. 2-up portrait | None (data exists in rows) | The JSON has `[6,6]` rows but component flattens them. | High — fix existing |
| F7. sticky + video | None | No pinned video pattern. | Low |

---

## Proposed Plan

### Option A: Fix `gallery-staggered` to Actually Use Spans (Recommended)

The `gallery-staggered` JSON already contains the layout data:
```json
{ "spans": [12], "images": ["hero.webp"] }           → 1 image full-width
{ "spans": [6, 6], "images": ["a.webp", "b.webp"] }  → 2 images side-by-side
{ "spans": [4, 4, 4], "images": [...] }               → 3 images equal
```

**The component ignores this and renders everything as 4-col zigzag.** If we fix the component to respect `spans`, we immediately get:

- **Full-width showcase** (`spans: [12]`) → equivalent to F1 narrow-media or F2 wide-media
- **Side-by-side** (`spans: [6, 6]`) → equivalent to F6 2-up
- **Triple grid** (`spans: [4, 4, 4]`) → equivalent to F5 grid
- **Asymmetric** (`spans: [8, 4]` or `[4, 8]`) → new layout

**Effort:** Low-medium. One component rewrite, zero data model changes.
**Impact:** Massive. All 5 projects immediately get varied gallery layouts.

### Option B: Add New Dedicated Block Types

Add new section types to the data model:

1. `gallery-centered` — single image at 8-col width, centered (F1)
2. `gallery-full-bleed` — edge-to-edge image, no padding (F2)
3. `gallery-pairs` — two portrait images side by side (F6)

**Effort:** Medium. New components + new section types + content updates.
**Impact:** More control per block, but more complexity in the data model.

### Option C: Hybrid — Fix Staggered + Add Full-Bleed

Fix `gallery-staggered` to respect spans (Option A), **plus** add one new type:

- `gallery-full-bleed` — for the cinematic full-width moments that can't exist within the grid padding

**Effort:** Medium.
**Impact:** Best of both worlds. Staggered becomes the flexible workhorse, full-bleed adds the "wow" moments.

---

## Decision Matrix

| Criteria | Option A (Fix Staggered) | Option B (New Types) | Option C (Hybrid) |
|---|---|---|---|
| Effort | Low | High | Medium |
| Data model changes | None | New types + content | 1 new type |
| Immediate impact | High (all projects benefit) | Medium (need content migration) | High |
| Layout flexibility | Good (span-based) | Best (dedicated components) | Best |
| Full-bleed support | No (still within grid padding) | Yes | Yes |
| Content author UX | Simple (just change spans) | Complex (choose from 6+ types) | Balanced |

---

## Recommendation

**Option C (Hybrid)** — delivers 90% of the value:

1. **Fix `gallery-staggered`** → respect `spans`, use natural aspect ratio (not fixed 340px), keep scroll-reveal
2. **Add `gallery-full-bleed`** → one new simple component for edge-to-edge images

This gives us 5 effective layout patterns from just 2 changes:
- `spans: [12]` → centered showcase (≈ F1 narrow)
- `spans: [6, 6]` → side-by-side (≈ F6 2-up)
- `spans: [4, 4, 4]` → triple grid (≈ F5 grid)
- `spans: [8, 4]` → asymmetric (new)
- `gallery-full-bleed` → cinematic full-width (≈ F2 wide)

Defer F3 (blend), F4 (stick-gallery), F7 (sticky video) — they add complexity without proportional value for a portfolio of UI screenshots.
