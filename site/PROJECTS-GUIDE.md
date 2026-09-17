# Projects & Case Studies — Creation Guide

How to add, compose, and maintain project case studies in this portfolio. This document covers the full workflow: data model, content, images, LLM routes, and visual composition standards.

---

## Data Model

Each project follows the `ProjectItem` interface defined in `src/content/types.ts`:

```typescript
interface ProjectItem {
  title: string           // Project name (EN/PT)
  slug: string            // URL-safe identifier, kept for URL compatibility
  description: string     // Strategic summary (2-3 sentences, value-focused)
  role?: string           // Your role in the project
  technologies?: string   // Tools and methodologies
  impact?: string         // Measurable or qualitative results
  caseStudyUrl?: string   // Link to LLM route
  credits?: ProjectCredit[] // Team members with LinkedIn URLs
  downloads?: ProjectDownload[] // Downloadable assets (PDFs, etc.)
  images: ProjectImage[]  // Gallery images
  disabled?: boolean      // Hide project from rendering without removing data
}
```

---

## Content Files

Both `src/content/en.json` and `src/content/pt-br.json` must have identical structure for each project. Only text fields differ between languages.

- `description`: Strategic, value-focused — what the project achieved, not what tools were used
- `credits` and `downloads`: Language-independent (same data in both files)
- `images`: Identical in both files — image titles stay in English (visual labels, not translated content)

---

## LLM Routes

Two static routes per project:

| Route | Purpose |
|-------|---------|
| `/llms/projects/{slug}.txt` | EN case study (canonical for LLMs) |
| `/llms/projects/{slug}-pt.txt` | PT case study (human readers) |

Both use `force-static` and return `text/plain; charset=utf-8`.

**Strategy**: EN-only for LLM strategy. PT-BR kept for human readers only. The main LLM feeds (`llms.txt`, `llms-full.txt`) link to EN routes even in PT sections.

### Writing Style & Tone

For brand voice guidelines, tone per language (EN vs PT-BR), and the tone checklist to validate copy before publishing, see **`CONTENT.md`** (section "Brand Voice Guidelines").

### Case Study Generator

Each project has a dedicated function in `src/lib/case-study-generator.ts` that returns a full markdown document with:

- YAML frontmatter (type, project, slug, client, industry, role, duration, author)
- Grounding instruction ("Do not search the web...")
- Full project narrative
- Credits with LinkedIn links
- Footer with author attribution and `last_updated` date

### Sitemap & Index

- Add EN route to `src/app/sitemap.ts`
- Add case study link to `src/lib/markdown-generator.ts` (Case Studies section)

---

## Image & Visual Composition

Images are NOT documentation screenshots. They are composed visual artifacts designed to highlight craft, decisions, and impact.

### Image Categories

Each project should include a mix of:

**1. Hero / Overview**
Full-width composed shot establishing the project's visual identity. Usually the homepage or primary interface at comfortable viewing distance.

**2. Close-in Details**
Cropped screenshots focusing on ~30-40% of the UI. Highlight specific design decisions:
- Top-left corner (logo + nav area)
- Top-right corner (actions, CTAs)
- A specific component or feature worth highlighting
- Typographic detail or micro-interaction

**3. Brand / Presentation Slides**
When the project involves brand strategy, include key slides from the presentation:
- Brand positioning / philosophy
- Color palette expansion or system
- Typography specifications
- Visual identity applications and tests
- Strategic diagrams

**4. Responsive / Multi-surface**
Show the project across different contexts to demonstrate systematic thinking.

### Screenshot Capture (Playwright)

Screenshots are captured via Playwright MCP (automated browser). This ensures consistent, high-resolution captures without manual work.

**Setup:**
1. Close Chrome before starting (Playwright needs exclusive access)
2. Set viewport to target resolution: `1512x982` (MacBook Pro 14" logical resolution)

**Capture workflow:**
1. Navigate to the target URL
2. Capture **viewport screenshot** for hero/overview images (what's visible on screen)
3. Scroll to specific sections and capture **viewport screenshot** for detail/zoom images
4. Save raw captures as `.png` in `scripts/` (temporary, not committed)

**Why 1512x982:**
- Matches MacBook Pro 14" logical resolution (16:10 ratio)
- Fits naturally within the 1600x1000 composition canvas — no side cropping needed
- UI elements appear at natural scale, more readable in final composed images
- `src_crop` is only needed for **content selection** (e.g., removing navbar), not for margin adjustment

**Viewport tips:**
- For pages with sticky headers or floating elements, wait for animations to settle before capture.
- Capture the viewport (not full-page) for each section independently — this gives better control over what's included.

**Example Playwright flow:**
```
1. browser_resize → 1512x982
2. browser_navigate → target URL
3. browser_evaluate → cleanup script (remove overlays)
4. browser_take_screenshot → hero viewport (scripts/project-hero-raw.png)
5. browser_evaluate → scroll to section
6. browser_evaluate → cleanup script again (re-apply after scroll)
7. browser_take_screenshot → section viewport (scripts/project-section-raw.png)
```

### Page Cleanup Before Capture

Most production sites have overlays that ruin screenshots: chat widgets, cookie banners, notification bars, dropdown menus stuck in DOM. These must be removed **before every capture**.

**Cleanup pattern (JS evaluate):**
```javascript
// Remove overlays: chat widgets, cookie banners, notification bars
document.querySelectorAll([
  '[id*="hubspot"]', '[class*="HubSpot"]',
  'iframe[title*="chat"]', '[class*="chat-widget"]',
  '[class*="cookie"]', '[id*="cookie"]', '[class*="consent"]',
  '[class*="notification-bar"]', '[class*="banner"]'
].join(',')).forEach(el => el.remove());

// Hide nav dropdown menus stuck in DOM
document.querySelectorAll('nav li > div').forEach(div => {
  if (div.querySelectorAll('ul').length >= 1) {
    div.style.cssText = 'display:none !important';
  }
});
```

**Important behaviors:**
- **Re-apply after scroll.** Some sites re-render DOM elements on scroll events. Always run the cleanup script again after scrolling to a new section.
- **Re-apply after navigation.** Each `browser_navigate` starts fresh — previous DOM changes are lost.
- **Navigate away between captures if needed.** If a previous page's state bleeds into the next capture (e.g., a dropdown from page A appears on page B), navigate to `about:blank` first, then navigate fresh.
- **Adapt the selectors.** The cleanup script above covers common patterns. Inspect the specific site and add selectors as needed — this is a template, not a universal solution.

---

### Composition Layout Model

Every composed image follows a **two-layer model**: a BG canvas and a screenshot placed on it.

**Project-level variables:**

| Variable | Default | Description |
|----------|---------|-------------|
| Output size | `1600x1000` | Final image dimensions (16:10, MacBook Pro ratio) |
| BG margin | `120px` | Fixed margin on all exposed sides (equal on every edge) |
| Corner radius | `12px` | Rounded corners on exposed edges |
| Capture viewport | `1512x982` | Playwright browser viewport |

#### Core principle: anchor + bleed

> **The alignment corner is the anchor — it never moves.** The BG margin positions the image from that corner. The opposite edges are bleed edges — content extends past the canvas and gets cropped. If the canvas size changes, the crop happens on the bleed edges. The anchor point and BG margins are stable.

```
┌─────────────────────────────────┐
│  BG gradient (margin)           │
│                                 │
│     ┌──────────────────────┐    │  ← exposed edges: rounded corners
│     │                      │    │
│     │     screenshot       │    │
│     │                      │    │
│     │                      ────── │  ← flush edge: image meets canvas border
│     │                      │    │     (crops here, no rounded corner)
└─────┴──────────────────────┘────┘
```

The frame is a window over the content. Resizing the canvas only crops on bleed edges — the BG margins and alignment are stable anchors.

---

### Composition Alignments

There are three alignments. The decision is **content-first**: "where is the interesting content in this screenshot?"

#### Center — "Show the page"

For hero shots, homepage views, or any image where you want to show the full page/section.

```
┌──────────────────────────────────┐
│          BG (top 120px)          │
│  ┌──────────────────────────┐   │
│  │ ╭─                    ─╮ │   │   ← rounded top-left + top-right
│  │ │                      │ │   │
│  │ │    screenshot         │ │   │
│  │ │    (page/section)     │ │   │
│  │ │                      │ │   │
│  │ │                      │ │   │
├──┤ │  bleeds bottom ───────┤─┤───┤   ← flush bottom
└──┴─┴──────────────────────┴─┘───┘
   ↑  BG sides (120px each)     ↑
```

- **Margins:** top + left + right (120px each)
- **Bleeds:** bottom
- **Rounded corners:** top-left + top-right
- **Use:** Homepage hero, product page overview, dashboard view, full section

#### Top-left — "Highlight a detail (left side)"

For close-up shots where the interesting content is in the top-left area of the crop.

```
┌──────────────────────────────────┐
│                                  │
│     BG (top 120px)               │
│                                  │
│         ╭────────────────────────│
│         │                        │  ← flush right
│  BG     │   screenshot           │
│ (left   │   (detail/section)     │
│ 120px)  │                        │
│         │                        │
│         │              ──────────│  ← flush bottom
└─────────┴────────────────────────┘
          ↑
          rounded top-left only
```

- **Margins:** top + left (120px each)
- **Bleeds:** right + bottom
- **Rounded corners:** top-left only
- **Use:** UI component detail, code editor close-up, feature panel, modal/dialog

#### Top-right — "Highlight a detail (right side)"

For close-up shots where the interesting content is in the top-right area of the crop.

```
┌──────────────────────────────────┐
│                                  │
│          BG (top 120px)          │
│                                  │
│────────────────────────╮         │
│                        │         │
│     screenshot         │  BG     │
│     (detail/section)   │ (right  │
│                        │ 120px)  │
│                        │         │
│──────────────          │         │  ← flush bottom
└────────────────────────┴─────────┘
                         ↑
                         rounded top-right only
```

- **Margins:** top + right (120px each)
- **Bleeds:** left + bottom
- **Rounded corners:** top-right only
- **Use:** Detail where content focus is on the right side

---

### Composition Rules

**Alignment Intent (decide BEFORE composing):**
- **"Show the page"** → Center
- **"Show a detail (left)"** → Top-left
- **"Show a detail (right)"** → Top-right

> Always discuss alignment intent before composing. "Where is the interesting content?" determines everything else.

**General rules:**
- Never use full-page screenshots for every image — they become repetitive
- Each image should have a clear "subject" — the feature or decision being highlighted
- Vary alignments across a project's gallery (mix Center and detail images)
- For detail crops, focus on ~1/3 of the section being highlighted
- **Avoid content cuts and empty space:** The crop region must frame actual content tightly. Before committing to a detail alignment, check:
  - Does the content fill the crop region densely? If not, tighten the crop or switch to Center.
  - Is important text near a bleed edge? It will get cut. Reposition so key content stays within the visible area.
  - Pages with centered headings or wide layouts often work better as Center than as detail crops.

**Composition priority (when constraints conflict):**

| Priority | Rule | Meaning |
|----------|------|---------|
| 1 | **Margins** | 120px on exposed sides — never reduced or removed |
| 2 | **Position / alignment** | The anchor point stays where the alignment defines it |
| 3 | **Zoom of content** | Adjust `src_crop` / `crop_box` to fit content within the frame |
| 4 | **Output size** | 1600x1000 default — reduce `canvas_h` per-image as a last resort to maintain bleed |

> If the content doesn't fit well within the frame, adjust the **zoom** (crop more or less of the screenshot). Never relax margins or change the anchor position to accommodate content. Never change bleed behavior to fit content.

**Content selection with `src_crop` / `crop_box`:**
- These control the **zoom** — which part of the screenshot is visible
- Common use: `src_crop=(0.0, 0.25, 1.0, 1.0)` to skip the navbar area
- Do NOT use `src_crop` for margin adjustment — the fixed 120px margin handles that

**Backgrounds:**
- Start with a dark base (`#080808` or project's darkest brand color)
- Layer 2-3 large radial gradients using the project's brand palette
- Apply heavy Gaussian blur (60-100px) — result should look like unfocused colored lights
- Position gradient centers asymmetrically (offset, not centered)
- The BG should help the screenshot pop, not compete with it

**Rounded corners:**
- Radius: `12px` on all rounded corners (consistent, single value)
- Only apply on exposed edges (where BG is visible)
- Flush edges (touching canvas border) get NO rounded corners — the image just bleeds off

**Shadows:**
- NO drop shadows — depth comes from dark background contrast + ambient color glow

**Reference**: Webflow's feature showcase (webflow.com/feature/design) for composition quality benchmark.

---

### Image Specs

| Property | Value |
|----------|-------|
| Format | `.webp` |
| Output size | `1600x1000` (16:10, MacBook Pro ratio) |
| Capture viewport | `1512x982` (MacBook Pro 14" logical) |
| BG margin | `120px` fixed on all exposed sides |
| Corner radius | `12px` |
| Max file size | ~200KB |
| Naming | `{descriptive-name}.webp` (kebab-case) |
| Location | `public/projects/{slug}/` |
| Raw captures | `scripts/` (temporary `.png`, not committed) |

### Size Relationship: Capture → Output → Margins

The capture viewport, output size, and margin are interdependent. Here's how the current defaults relate:

**Center alignment (full viewport, no src_crop):**

| Step | Calculation | Value |
|------|-------------|-------|
| Available width | 1600 − 2×120 | **1360px** |
| Scale factor | 1360 / 1512 | **0.899** |
| Scaled height | 982 × 0.899 | **883px** |
| Image Y position | anchored to top | **y=120** (MARGIN) |
| Bottom edge | 120 + 883 | **1003px** → bleeds 3px past canvas |

With 120px fixed margins and 1512x982 capture, Center alignment bleeds at the bottom as designed — the top margin is exactly 120px (matching the side margins).

**Center alignment with src_crop (shorter image):**

When `src_crop` reduces the image height, the image may not reach the bottom edge at default canvas height. Per composition priority (P4), use `canvas_h` to reduce the output height so the image still bleeds:

| Step | Example: src_crop 73% height | Value |
|------|------------------------------|-------|
| Cropped height | 982 × 0.73 | **717px** |
| Scaled height | 717 × 0.899 | **645px** |
| Bottom edge | 120 + 645 | **765px** |
| canvas_h | ≤ 765 (e.g. 760) | **bleeds 5px** |

**Top-left / Top-right alignment:**

| Step | Calculation | Value |
|------|-------------|-------|
| Available width | 1600 − 120 (one side margin) | **1480px** |
| Scale factor | 1480 / 1512 | **0.979** |
| Scaled height | 982 × 0.979 | **961px** |
| Bleed past output | 120 + 961 − 1000 | **81px** past bottom edge |

Detail alignments bleed on both right+bottom (or left+bottom), with content extending well past the output edges.

**If you change any variable**, recalculate this table to verify margins and bleeds still work as expected.

---

### Composing with Script

The Python composition script is at `scripts/compose-images.py`. It uses Pillow and provides:
- `create_orange_bg()` — gradient blur backgrounds from brand color variants
- `add_selective_rounded_corners()` — rounded corners on specific edges only
- `compose_center()` — Center alignment (BG top + sides, bleed bottom)
- `compose_top_left()` — Top-left alignment (BG top + left, bleed right + bottom)
- `compose_top_right()` — Top-right alignment (BG top + right, bleed left + bottom)

**Usage:**

```bash
# Per-project composition (edit main() for each project)
python3 scripts/compose-images.py

# Test composition with new screenshots
python3 scripts/compose-test.py
```

**Key parameters:**

| Parameter | Description | Default |
|-----------|-------------|---------|
| `bg_variant` | Gradient color scheme (`warm`, `hot`, `sunset`, `contrast`, `deep`, `lavender_accent`) | `warm` |
| `bg` | Pre-created background image (overrides bg_variant) | `None` |
| `corner_radius` | Rounded corner radius in pixels | `12` |
| `src_crop` | Content selection crop `(left, top, right, bottom)` as relative coords 0.0-1.0 | `None` |
| `crop_box` | Detail region crop `(left, top, right, bottom)` as relative coords 0.0-1.0 | Required for Top-left, optional for Top-right |
| `seed` | Random seed for reproducible BG gradients | `42` |
| `canvas_h` | Override output height for Center (P4 — when src_crop makes image too short to bleed) | `1000` |

**Center example:**
```python
compose_center(
    'scripts/hero-raw.png',
    'public/projects/slug/hero.webp',
    bg_variant='contrast',
)
```

**Top-left example:**
```python
compose_top_left(
    'scripts/section-raw.png',
    'public/projects/slug/detail.webp',
    crop_box=(0.1, 0.05, 0.8, 0.7),
)
```

**Top-right example:**
```python
compose_top_right(
    'scripts/section-raw.png',
    'public/projects/slug/detail-right.webp',
    crop_box=(0.2, 0.1, 0.9, 0.8),
    src_crop=(0.0, 0.25, 1.0, 1.0),  # skip navbar
)
```

### Composing in Figma

1. Create a frame at `1600x1000`
2. Add background fill using project brand colors with blur
3. Place the screenshot following the chosen alignment rules
4. Apply 12% margin on exposed sides, bleed on opposite sides
5. Apply rounded corners (`12px`) ONLY on exposed edges
6. Export as `.webp` at 2x then compress

---

## Open Graph image

One image for the whole site, at `public/og-img.png`, 1200x630. It is the hero's
own composition — headline left, portrait right, mono labels top and bottom — so
a shared link looks like the page it opens.

It is not drawn by hand: `/dev/og` renders the board with the site's own `Grid`,
fonts and tokens, and the image is a screenshot of it. Re-shoot whenever the
headline, the portrait, the bio or the availability line changes.

With the dev server running, in a Playwright page at a viewport of at least
1024 wide (below that the `Grid` drops to the tablet layout):

```js
await page.goto('http://localhost:3000/dev/og')
await page.evaluate(async () => {
  await document.fonts.ready
  // Render at 2x without reflowing: a transform re-rasterises the type at the
  // higher scale, where `zoom` or a wider viewport would re-wrap it.
  const b = document.getElementById('og-board')
  b.style.transformOrigin = 'top left'
  b.style.transform = 'scale(2)'
  const p = b.parentElement
  Object.assign(p.style, { display: 'block', padding: '0', minHeight: '0',
                           width: '2400px', height: '1260px', overflow: 'hidden' })
})
await page.locator('#og-board').screenshot({ path: 'og-2x.png', scale: 'css' })
```

```bash
sips -z 630 1200 og-2x.png --out public/og-img.png
```

Shooting at 2x and scaling down to 1200x630 is what keeps the thin Epilogue
headline clean. The board hides `[role="banner"]`, `footer` and `nextjs-portal`
itself — the root layout mounts the header and footer on every route, the header
is sticky, and an element screenshot picks up whatever is painted over the box.
`/dev/` is `noindex` and disallowed in `robots.txt`, so the board never shows up
in search.

**Composition.** The board is the intro's frame, not a card assembled from its
parts: a label row where the header sits, the headline on the left eight
columns, the portrait on the right four. Headline and portrait share one grid
row rather than stacking — at four columns the portrait is 365 wide, and at the
Figma's 216x281 that is 475 tall, three quarters of the card. Stacked it would
not fit; beside the headline it does.

Type runs four points over the page: labels at 17px against the page's 12,
because a share card is read in a feed at a third of its size.

**What the card does not carry, on purpose.** No bio — body copy at feed scale
is grey noise, and the description meta tag already says it in real text the
platform renders itself. No availability line; the email has that slot, because
away from the site the card's job is to be answerable.

**Crops.** LinkedIn, X and Facebook all show something near the native 1.91:1,
so the frame survives whole. A square-cropped preview (some WhatsApp contexts)
takes the middle 630px: it keeps the headline but loses the domain on the left
and most of the portrait on the right.

---

## Home Cover (ProjectCover)

The home project list (`ProjectsGrid` → `ProjectRow` → `ProjectCover`) shows one cover per project. This is a **separate standard** from the gallery composition above: gallery images are composed on a BG canvas (`1512x982` → `1600x1000`); cover images are bare screens that the component frames itself. Don't mix the two.

### How the component frames a cover

```
┌──────────── frame (component) ────────────┐
│                                           │
│   ┌──────── window 16:10 (asset) ──────┐  │
│   │                                    │  │
│   │            1920 × 1200             │  │
│   │                                    │  │
│   └────────────────────────────────────┘  │
│                                           │
└───────────────────────────────────────────┘
```

- **Frame**: 6 of 12 columns (cols 3–8), `bg-bg-surface-primary`. **3:2 from `md` up, square on mobile** — after bymonolog.com's Success Stories (3:2 desktop, 1:1 mobile). A 16:10 frame read squat on desktop (30px vertical margin) and as a thin strip on mobile. Drawn by the component — never baked into the asset.
- **Window**: centred, 86% of the frame width, `aspect-[16/10]`, 3px radius. The image **fills** it (`object-cover`), so anything not 16:10 gets cropped.
- **Planned, not built**: a per-project frame background (brand colour or art), as in juanmoraromero.com/projects/villiers and bymonolog.com. The window stays 16:10, so the asset spec below does not change.

Rendered sizes (desktop frame width = viewport/2 − 42px; window = 86% of frame). Margins at 1440: 47px sides, 44px top/bottom; at 390: 25px sides, 81px top/bottom.

| Viewport | Window | Window @2x |
|---|---|---|
| 1280 | 514×321 | 1028×642 |
| 1440 | 583×365 | 1166×729 |
| 1728 | 707×442 | 1414×884 |
| 1920 | 789×493 | 1578×986 |
| 2560 | 1065×665 | — |
| Mobile 390 | 301×188 | 602×376 |

The window is ~40–55% of a desktop screen, so body text in a full-page capture becomes texture. Headlines survive; for detail, frame a component or a section, not the whole page.

### Asset spec

| Property | Value |
|---|---|
| Ratio | **16:10, exact** — the window crops everything else |
| Final still | `1920x1200` `.webp` (q90) |
| Final video | `1920x1200` `.mp4` (H.264, CRF 18) + `.webm` (VP9, CRF 32), 60fps, no audio |
| Capture viewport | **`1680x1050`** CSS px — 1440 breaks some sites' nav (Lukso's menu overlapped EN/PT), 1152 breaks layouts |
| Capture density | 2x for stills (PNG `3360x2100`, kept as master) |
| Raw captures | `../content/captures/{project}/` (outside `public/`; pick finals from there) |
| Final location | `public/projects/{slug}/` |
| Naming | kebab-case by page and section: `home-en-hero`, `web-apps-use-cases-1`, `menu` |

### Where the pixels come from

- **Browser page** — capture at `1680x1050`; the screenshot is the window.
- **Figma screen** (e.g. a home concept) — frame any 16:10 size; the frame width sets the scale. `1152x720` shows detail, `1680x1050` matches browser captures. Export with the width suffix **`1920w`** (not `2x`) to land on 1920x1200 directly.
- **Art** (illustration, brand piece, icon set) — build a `1920x1200` board and place the art on it: centred on a solid ground, or bleeding to fill. Give the board a different tone from the frame, or the window disappears.

### Stills — `scripts/capture/shots.cjs`

```bash
OUT_DIR=../content/captures/azion/website nice -n 15 node scripts/capture/shots.cjs list.json
```

```json
[
  { "name": "home-en-hero", "url": "https://www.azion.com/en/" },
  { "name": "home-reliable", "url": "https://www.azion.com/en/", "text": "most reliable infrastructure", "section": true, "offset": 64 },
  { "name": "web-apps-use-cases-1", "url": "https://www.azion.com/en/solutions/web-apps/", "scroll": 1247, "wait": 3000 },
  { "name": "webkit-flow", "url": "https://webkit.azion.app/iframe.html?id=components-data-flow--branches&viewMode=story", "scale": 2,
    "css": "#storybook-root{min-height:100vh;display:flex!important;align-items:center;justify-content:center}" }
]
```

- **Framing a section**: find its `y` first (list `section`/`h2` offsets with Playwright) and set `scroll` so the section starts under the site's fixed nav.
- **Cleanup is automatic**: cookie/consent banners are hidden by selector, and any small `position: fixed` element in a bottom corner (chat launchers mount late, under arbitrary names) is hidden right before the shot. Never click a consent banner.
- **Sections with scroll-driven entrances** (pinned carousels, horizontal team rows) render empty at the section top. Scroll further in, check the shot, retake.
- **Storybook components**: shoot the isolated `iframe.html?id=…&viewMode=story` URL, centre `#storybook-root` with `css`, and magnify with `scale`. **Never CSS `zoom`** — it broke a flow diagram's connectors and collapsed a pricing-card row.

### Video — `scripts/capture/vcap.cjs`

**60fps.** The frame rate does not change speed: the sites checked (GSAP, R3F with `delta`, `Date.now` loops) animate on elapsed time, so any fps plays at 1x. 24–30fps visibly steps on marquees, scroll and card entrances; 120fps doubles capture time and file size for a window shown at ~600–800px.

**Frame by frame, not real time.** Real-time recording (CDP screencast, the `rec` command in `session.cjs`) came out uneven: frame intervals jittered 7–25ms with >100ms spikes, and frames arrived at 1x. `vcap.cjs` freezes the page clock and advances it exactly 1/60s per captured frame, so the result is perfectly even regardless of how long each frame takes. Interaction is scripted:

```bash
CURSOR=1 HOLD_MS=3000 OUT_DIR=../content/captures/azion/website \
  nice -n 15 node scripts/capture/vcap.cjs https://www.azion.com/en/ menu 10.5 menu-plan.json
```

```json
[
  { "start": [900, 640] },
  { "at": 0.8, "dur": 0.7,  "mouse": [224, 32] },
  { "at": 2.8, "dur": 0.4,  "mouse": [348, 32] },
  { "at": 4.8, "dur": 0.45, "mouse": [590, 32] },
  { "at": 8.6, "dur": 0.8,  "mouse": [900, 700] }
]
```

- **Loading sequences**: the clock stays at 0 during `HOLD_MS` (real time) so the page hydrates first. Starting it at navigation replayed Lukso's loader twice (remount mid-animation).
- **Off-screen embeds**: `BLOCK=player.vimeo.com,vimeocdn.com` — a Vimeo iframe loading in the background stalled every Lukso run.
- **Cursor**: `CURSOR=1` draws a white pointer; leave it off for pure page motion.
- **Known limit — heavy WebGL sites**: on lukso.com.br about half the runs stalled inside Chrome and the R3F icons mounted only intermittently (the site gates them on a network GPU-tier check). Light sites (azion.com, 10.5s menu in 32s) run clean. For heavy sites, record natively instead (`screencapture -v`, needs Screen Recording permission for the terminal) with the window at 1680×1050, then trim/scale with ffmpeg.
- **Trimming**: pick cut points from a contact sheet (`ffmpeg -vf "fps=2,scale=320:-1,tile=8x5"`), then `ffmpeg -ss A -to B -i raw.mp4 -c:v libx264 -crf 18 …`.

### Machine load

Captures run headless under `nice -n 15`; ffmpeg is capped at 4 threads. Every script closes its browser on finish, error, timeout and Ctrl+C — check with `ps -A | grep "Google Chrome for Testing"` after an interrupted run anyway. The visible window from `session.cjs` holds ~2 GB and constant CPU on animated sites: kill it as soon as the manual part is done. A 5s `vcap` run peaks around 3.4 GB / 6 cores for ~15s.

---

## File Locations

| What | Where |
|------|-------|
| Types | `src/content/types.ts` |
| Content EN | `src/content/en.json` |
| Content PT | `src/content/pt-br.json` |
| Component | `src/components/sections/Projects.tsx` |
| LLM generator | `src/lib/markdown-generator.ts` |
| Case study generators | `src/lib/case-study-generator.ts` |
| LLM routes | `src/app/llms/projects/{slug}.txt/route.ts` |
| Assets | `public/projects/{slug}/` |
| Image composer | `scripts/compose-images.py` |
| Composition test | `scripts/compose-test.py` |
| Raw captures | `scripts/` (temporary `.png`, not committed) |
| Crop examples | `crop-examples/` (reference patterns) |
| Home cover component | `src/components/sections/v2/ProjectCover.tsx` (framed by `ProjectRow.tsx`) |
| Cover capture scripts | `scripts/capture/` (`shots.cjs`, `vcap.cjs`, `session.cjs`) |
| Cover raw captures | `../content/captures/{project}/` |

---

## Workflow Checklist

When adding a new project:

- [ ] Write EN + PT content (description, role, technologies, impact)
- [ ] Add project data to `en.json` and `pt-br.json`
- [ ] Create case study generator function in `case-study-generator.ts`
- [ ] Create LLM routes (EN + PT) in `src/app/llms/projects/`
- [ ] Capture screenshots via Playwright at `1512x982` (hero viewport + section viewports)
  - [ ] Run page cleanup script before each capture (remove overlays, chat widgets, dropdowns)
  - [ ] Re-apply cleanup after scrolling to new sections
- [ ] Compose images using script (Center for pages, Top-left/Top-right for details)
- [ ] Add composed images to `public/projects/{slug}/`
- [ ] Capture the home cover per **Home Cover (ProjectCover)**: 16:10 at `1680x1050`, exported `1920x1200` (`scripts/capture/`)
- [ ] Add case study link to `markdown-generator.ts`
- [ ] Add EN route to `sitemap.ts`
- [ ] Update `types.ts` only if new fields are needed
- [ ] Build and verify (`pnpm build`)
