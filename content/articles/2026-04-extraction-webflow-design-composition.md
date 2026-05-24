# Extraction: Webflow /feature/design — Visual Composition Patterns

> Source: https://webflow.com/feature/design
> Date: 2026-03-14
> Focus: Image composition, feature block layout, background treatments, screenshot framing, depth/layering

## Summary

Webflow's feature page uses a layered composition system where screenshots are "placed" on visually rich backgrounds using a combination of **Three.js-rendered "fluted glass" gradient canvases** (for the colorful blurred backgrounds), **dark card containers** with `border-radius: 8px` and `overflow: clip`, and **backdrop-filter blur overlays** on hero cards. The page alternates between several distinct block patterns to create visual variety while maintaining a consistent grid.

---

## 1. Block Patterns (Section by Section)

### Pattern A — "Hero Triptych" (3-column accordion cards)
**Section**: "Build exactly what you want" / "Stay consistent" / "Find more room"

**Layout:**
- Flex row, 3 equal columns at `~411px` each
- Row gap: `32px`
- Total container: `1296px`

**Each card:**
- `.accordion-card_wrap` — `border-radius: 8px`, `overflow: hidden`
- Aspect: `411 x 548` (~3:4 portrait)
- Background: Full-bleed `.webp` image (`object-fit: cover`, `position: absolute`, fills entire card)
- Overlay: `.u-bg-blur` — `position: absolute`, z-index 1
  - `backdrop-filter: blur(10px)`
  - `background-image: linear-gradient(rgba(255,255,255,0.16) 4%, rgba(0,0,0,0.35) 60%, rgba(0,0,0,0.7))`
  - This creates the frosted glass effect over the background image
- Text sits on TOP of the blur overlay (z-index 2+)
- "Fluted glass" canvas (`<canvas>`) rendered behind via Three.js at z-index 0

**Key insight:** The background image IS the visual content (a composed screenshot). The blur gradient overlay creates the glass effect that makes the text readable at the bottom. No separate "background color" — the screenshot itself serves as both content and background.

---

### Pattern B — "Slider Card" (full-width dark block with side-by-side text + image)
**Section**: "Build a site" / "Less busywork, more brand-building"

**Layout:**
- Single `.card.cc-outline-none.u-mode-dark` — `1296 x 725`, `border-radius: 8px`, `overflow: clip`
- Background: `rgb(8, 8, 8)` (near-black)
- Two-column inside: text left (~40%), image right (~60%)

**Background effect:**
- `.module-slider_bg-wrap` — absolutely positioned, full-size
- Contains `.fluted-glass-component` and `.fluted-glass-canvas`
- The canvas renders a **Three.js gradient blur** — soft, colorful ambient gradient (blue/purple/pink tones visible in screenshots)
- This is NOT a CSS gradient — it's a WebGL canvas rendering colored light blobs

**Image composition:**
- `.img-component` — `border-radius: 8px 0px 0px 8px` (rounded on left side only, flush with card right edge)
- `object-fit: cover`, `737 x 553`
- Images show composed UI screenshots of the Webflow editor with websites being built
- The screenshot feels "inset" into the dark card, with the gradient glow peeking from behind

---

### Pattern C — "Full-width Tabbed Image" (text tabs + full screenshot)
**Section**: "Edit content in a visual canvas"

**Layout:**
- Section heading + description at top
- Tab bar below (3 tabs: "Edit content", "Equip marketers", "Empower devs")
- Full-width image below tabs: `1296 x 729`

**Image container:**
- `.u-position-relative.u-radius-base.u-overflow-hidden` — `border-radius: 8px`, `overflow: hidden`
- Inside: `.img-component` with `border-radius: 8px`
- Behind: `.fluted-glass-canvas` (Three.js gradient canvas) at z-index 0

**Key insight:** Each tab swaps the screenshot AND the background canvas gradient. The gradient color matches the mood of the screenshot content. Image takes full container width with no padding.

---

### Pattern D — "Asymmetric Grid" (2-3 columns, mixed sizes)
**Section**: "Stay on brand as you scale"

**Layout — Row 1:**
- 2 columns: `853px` (wide, ~65%) + `411px` (narrow, ~32%)
- Row gap: `32px`
- Both cards: `480px` height

**Layout — Row 2:**
- 3 columns: `411px` + `411px` + `885px` — BUT the visual shows 2 columns
- Actually structured as: narrow + wide, alternating the heavy side

**Image containers:**
- `.img-component` with `border-radius: 8px`, `overflow: hidden`
- Behind: fluted-glass canvas gradient
- Screenshots show Webflow UI components (libraries panel, review updates modal)
- The screenshots are composed WITH their tool chrome visible (sidebars, panels, toolbars)

**Key insight:** The grid alternates which side gets the "wide" column across rows (wide-left/narrow-right, then narrow-left/wide-right), creating visual rhythm and preventing monotony.

---

### Pattern E — "2-up Portrait" (two tall cards side by side)
**Section**: "One platform, two ways to launch"

**Layout:**
- 2 equal columns: `632px` each
- Left card: `632 x 711` (slightly taller)
- Right card: `632 x 632` (square)
- Both: `border-radius: 8px`, `overflow: hidden`

**Background effect:**
- Fluted-glass canvas behind each
- One card has a pink/coral gradient, other has warm tones (orange/motion blur photo)

---

### Pattern F — "Feature Index" (list + preview card)
**Section**: "All features"

**Layout:**
- 3-column: category label (left) + feature list (center) + preview image (right)
- Preview image: `~508 x 571`, `border-radius: 8px`
- Image swaps on hover/click of feature list items

---

## 2. Background Treatment Details

### The "Fluted Glass" System

Webflow uses **Three.js (r128)** to render gradient backgrounds as WebGL canvases. The console shows `THREE.WebGLRenderer` and color references like `FF6B00`.

**How it works:**
1. A `<canvas>` element is positioned `absolute`, `top: 0`, `left: 0`, `z-index: 0`
2. Three.js renders soft, blurred color blobs — like bokeh or out-of-focus lights
3. The canvas renders at 75% of display size (e.g., `972 x 546` for a `1296 x 729` container) for performance
4. This sits behind the screenshot image, peeking through at edges

**Why they use WebGL instead of CSS gradients:**
- Organic, non-uniform color distribution (not linear/radial/conic)
- Colors can animate and shift
- Creates a more natural "light" feel than flat CSS gradients
- Resembles depth-of-field bokeh photography

### Simpler Alternative (for static images / Pillow script):
The effect CAN be approximated with:
- 2-3 large, overlapping radial gradients
- Heavy Gaussian blur (40-80px radius)
- Layered with different blend modes
- Colors extracted from the project's brand palette

---

## 3. Screenshot Framing Specs

### Border Radius
- **Cards/containers**: `8px` (universal — the only radius used besides pills at `1600px`)
- **Image wrappers**: `8px` (applied to parent `.img-component`, image itself is `0px` with `overflow: hidden` on parent)
- **Edge-flush images**: `8px 0px 0px 8px` (rounded on left only, flush right)

### Box Shadow
- **None.** Webflow does NOT use box-shadow on any of their image blocks.
- Depth is created entirely through:
  - Dark card backgrounds (`rgb(8, 8, 8)`)
  - Gradient overlays (the blur layer)
  - Color contrast between the bright screenshot and dark/colored surroundings
  - The z-index stacking itself

### Object Fit
- All screenshots use `object-fit: cover`
- Images fill their container completely — no padding, no letterboxing

### Layering Order (z-index stack within each card):
1. **z-index 0**: `.fluted-glass-canvas` (Three.js gradient background)
2. **z-index 0**: `.accordion-card_bg` containing the `<img>` (screenshot)
3. **z-index 1**: `.u-bg-blur` (frosted glass overlay with backdrop-filter)
4. **z-index 2+**: Text content, buttons, accordion triggers

---

## 4. Layout Grid Specs

| Property | Value |
|----------|-------|
| Container width | `1296px` (at 1440px viewport) |
| Container side margin | `72px` each side |
| Row gap | `32px` (consistent across all rows) |
| Section padding | `80px` top, `80px` bottom (standard) |
| Section padding (intro) | `80px` top, `0px` bottom (when followed by content section) |

### Column Width System (at 1296px container):

| Columns | Widths | Ratio |
|---------|--------|-------|
| 3 equal | `411 + 411 + 411 + gaps` | 1:1:1 |
| 2 asymmetric (wide+narrow) | `853 + 411 + gap` | ~2:1 |
| 2 equal | `632 + 632 + gap` | 1:1 |
| Text + image (slider) | `~520 + 737 + gap` | ~40:60 |
| Full width | `1296` | single |

---

## 5. Image Aspect Ratios Used

| Context | Dimensions | Ratio |
|---------|-----------|-------|
| Hero triptych cards | 411 x 548 | ~3:4 (portrait) |
| Slider card image | 737 x 553 | ~4:3 (landscape) |
| Full-width tab image | 1296 x 729 | 16:9 |
| Wide grid card | 853 x 480 | ~16:9 |
| Narrow grid card | 411 x 480 | ~5:6 (near-square portrait) |
| Portrait launch card | 632 x 711 | ~9:10 |
| Square launch card | 632 x 632 | 1:1 |

---

## 6. Screenshot Cropping Strategy

All images use `object-fit: cover` with `position: absolute` and `top/left/right/bottom: 0`. The image stretches to fill 100% of the container and the excess is clipped by `overflow: hidden` on the parent. **Which part stays visible** is controlled by `object-position`.

### The 3 `object-position` values used:

| Value | Behavior | When to use |
|-------|----------|-------------|
| `0% 0%` | **Anchors top-left** — crops right and bottom | Product UI screenshots (editor, panels, toolbars). The top-left corner of any app UI is the most recognizable part (logo, sidebar, nav). |
| `50% 50%` (default) | **Centers** — crops equally from all sides | Final website/result screenshots, content-focused images. Shows the "hero area" of the page. |
| `100% 0%` | **Anchors top-right** — crops left and bottom | Rare. Used when the right side has the focal point (e.g., a panel or action area). |

### Source Image Sizes vs Display (how much gets cropped):

| Section | Natural size | Container | Scale | object-position | What's visible |
|---------|-------------|-----------|-------|-----------------|----------------|
| "Build a site" (slider) | 2480×1860 | 737×553 | ~30% | `0% 0%` | Top-left: logo, sidebar, main canvas. Bottom/right cropped. |
| "Structure/Style" (side panel) | 1440×1620 | 564×635 | ~39% | `0% 0%` or `50% 50%` | Either top-left (toolbar+panel) or center of editor |
| "Edit content" (full-width tab) | 2560×1440 | 1296×729 | ~51% | `50% 50%` | **No significant crop** — same aspect ratio (16:9). Just scaled down. |
| "Stay on brand" (wide card) | 2560×1440 | 853×480 | ~33% | `50% 50%` | Center of the screenshot. Sides and top/bottom cropped equally. |
| "Stay on brand" (narrow card) | 1154×1440 | 411×480 | ~36% | `0% 0%` or `50% 50%` | Top-left (UI components) or center |
| "One platform" (portrait) | 1440×1620 | 632×711 | ~44% | `100% 0%` | **Top-right**: right-side panel/content area |
| "Bold ideas" (carousel) | 1167×654 | 853×480 | ~73% | `50% 50%` | Center. Minimal crop — almost full image visible. |

### Key Principles:

1. **Source images are always 2-3x larger than display** — never pixel-matched. This allows the same image to be reused in different container sizes/aspects.
2. **No pre-cropping** — the crop is 100% controlled by CSS (`object-fit` + `object-position`). The source files are full, uncropped screenshots.
3. **Product UI → anchor top-left (`0% 0%`)** — the toolbar, sidebar, and logo are always visible. This is the recognizable "signature" of the product.
4. **Result/website → center (`50% 50%`)** — shows the hero content, the most visually impactful area.
5. **Aspect ratio mismatch is intentional** — source images have different ratios than containers. The crop is a compositional choice, not an accident.

### Decision Framework for Portfolio Images

When composing a new case study image, decide the **crop intent** before placing:

| Intent | object-position | Source prep | Example |
|--------|----------------|-------------|---------|
| **"Show the product"** — highlight the tool/interface, sidebar panels, editor chrome | `0% 0%` (top-left) | Full screenshot with all UI visible | Console Kit editor, design system panel |
| **"Show the result"** — highlight the final website/output, hero area, visual impact | `50% 50%` (center) | Full-page screenshot of the live site | Azion homepage, Huia website |
| **"Show a detail"** — highlight a specific UI component, feature, or interaction | Custom crop in Pillow/Figma before placing | Pre-crop to ~30-40% of full screenshot, centering the subject | A specific button state, color picker, component variant |
| **"Show the full picture"** — no crop, entire screen visible | Match container ratio to source ratio (e.g., 16:9 → 16:9) | Full screenshot at matching aspect | Full dashboard view, complete page layout |
| **"Grid with highlights"** — multiple screenshots showing different aspects | Mixed: wide card `50% 50%` + narrow card `0% 0%` | Multiple screenshots, different regions | Overview + detail side by side |

> **Rule: always discuss crop intent before composing.** "Where do we anchor?" is as important as "which screenshot do we use?"

---

## 7. Cross-Domain Patterns

### What Makes Screenshots Feel "Placed" Not "Pasted"

1. **Dark container wrapping** — The near-black (`rgb(8,8,8)`) card behind the image creates natural contrast without needing a shadow
2. **Ambient color glow** — The Three.js gradient background peeks around the screenshot edges, creating a subtle "backlight" effect
3. **Flush edges** — In slider cards, images are flush with one or more card edges (e.g., `border-radius: 8px 0px 0px 8px`), making the screenshot feel embedded in the card rather than floating
4. **Tool chrome visible** — Screenshots include the Webflow UI chrome (sidebars, toolbars). This adds authenticity and makes the composition feel like a "window" into the actual product
5. **No drop shadows** — Depth comes from the layering system itself, not applied shadows
6. **Content as background** — In hero cards, the screenshot IS the background, with the frosted overlay making text readable

### Variety System
The page uses **6 distinct block patterns** (A-F) to prevent visual monotony, but ALL share:
- `border-radius: 8px` on containers
- `32px` gap between elements
- `80px` section padding
- `1296px` container width
- `object-fit: cover` on all images
- Fluted-glass gradient backgrounds

---

## 8. Prompt-Ready Spec (for Portfolio Case Study Images)

### For static image composition via Pillow/Figma:

**Container:**
- Canvas: 1600x900 or 1600x1000 (as per PROJECTS-GUIDE.md)
- Border radius: 8px on all image containers (NOT on the canvas itself)

**Background technique (approximating the fluted-glass effect):**
1. Start with a dark base (`#080808` or project's darkest brand color)
2. Create 2-3 large, soft radial gradients using the project's brand palette colors
3. Apply heavy Gaussian blur (60-100px radius in Pillow, or scale equivalent)
4. Position gradient centers asymmetrically (avoid centered — offset to top-right or bottom-left)
5. Blend mode: screen or additive over the dark base
6. The result should look like unfocused colored lights on a dark surface

**Screenshot placement:**
- Use `object-fit: cover` behavior — crop screenshots to fill their container
- Include UI chrome when relevant (browser frame, sidebar, toolbar)
- For edge-flush: round only the non-flush corners (e.g., 8px left, 0px right)
- For contained: round all corners at 8px
- NO drop shadows — rely on dark background contrast for depth

**Overlay (optional, for text-over-image cards):**
- `backdrop-filter: blur(10px)` or pre-blurred in Pillow
- Gradient: `linear-gradient(rgba(255,255,255,0.16) 4%, rgba(0,0,0,0.35) 60%, rgba(0,0,0,0.7))`
- Text in white over the overlay

**Grid composition for multi-image layouts:**
- Gap: 32px between elements (scale proportionally for 1600px canvas)
- Use asymmetric splits: ~65/32 (wide/narrow) or 50/50
- Alternate which side is heavy across rows
- Mix aspect ratios: wide landscape for main, portrait/square for secondary
