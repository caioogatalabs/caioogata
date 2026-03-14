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
2. Set viewport to target resolution: `1920x1080` (desktop standard)

**Capture workflow:**
1. Navigate to the target URL
2. Capture **viewport screenshot** for hero/overview images (what's visible on screen)
3. Scroll to specific sections and capture **viewport screenshot** for detail/zoom images
4. Save raw captures as `.png` in `scripts/` (temporary, not committed)

**Viewport considerations:**
- `1920x1080` — standard desktop, 16:9 aspect. Good for most captures.
- For pages with sticky headers or floating elements, wait for animations to settle before capture.
- Capture the viewport (not full-page) for each section independently — this gives better control over what's included.

**Example Playwright flow:**
```
1. browser_resize → 1920x1080
2. browser_navigate → target URL
3. browser_take_screenshot → hero viewport (scripts/project-hero-raw.png)
4. browser_evaluate → scroll to section
5. browser_take_screenshot → section viewport (scripts/project-section-raw.png)
```

---

### Composition Layout Model

Every composed image follows a **two-layer model**: a BG canvas and a screenshot placed on it. The screenshot's position relative to the canvas determines where the image crops and where the BG gradient breathes.

**Canvas:** `1600x1000` (16:10, MacBook Pro proportion)

**Core principle:** The image is ALWAYS positioned relative to the BG canvas. Crops only happen on edges where the screenshot meets the canvas border (flush edges). Exposed edges (where BG is visible) get rounded corners and breathing room.

```
┌─────────────────────────────────┐
│  BG gradient (breathing room)   │
│                                 │
│     ┌──────────────────────┐    │  ← exposed edges: rounded corners
│     │                      │    │
│     │     screenshot       │    │
│     │                      │    │
│     │                      ────── │  ← flush edge: image meets canvas border
│     │                      │    │     (crops here, no rounded corner)
└─────┴──────────────────────┘────┘
```

**BG breathing room:** 10-17% of the canvas on exposed sides. The image (content) is always the priority — BG is complementary, never competing.

---

### Composition Patterns

There are two primary patterns. Decide which one to use BEFORE composing.

#### Pattern 1: Overview (full screen)

For hero shots, homepage views, or any image where you want to "show the product."

```
┌─────────────────────────────────┐
│        BG (top ~10%)            │
│  ┌─────────────────────────┐    │
│  │  ╭─                  ─╮ │    │  ← rounded corners top only
│  │  │   screenshot        │ │    │
│  │  │   (nav, hero,       │ │    │
│  │  │    main content)    │ │    │
│  │  │                     │ │    │
│  │  │                     │ │    │
│  │  │                     │ │    │
├──┤  │   bleeds here ──────┤─┤────┤  ← crops at canvas bottom
└──┴──┴─────────────────────┴─┘────┘
   ↑                           ↑
   BG sides (~7-10% each)
```

**Rules:**
- **Anchor:** center-top
- **BG breathing:** top (~10%) + sides (~7-10% each)
- **Bleed:** bottom edge (image extends past canvas)
- **Rounded corners:** top-left + top-right only (exposed corners)
- **Source crop:** trim ~8-10% from each side of the raw screenshot (`src_crop`) to make the aspect ratio taller — this ensures the image is tall enough to bleed at the bottom while preserving side padding
- **Never crop the top** — the navbar/toolbar provides essential context
- **Bottom bleed is natural** — the content that gets cut off suggests continuity

**When to use:** Homepage hero, product page overview, dashboard view, any "first impression" image.

#### Pattern 2: Zoom / Detail

For close-up shots of specific features, UI details, or sections worth highlighting.

```
┌────────────────────────────────┐
│                                │
│  BG (top ~15%)                 │
│                                │
│        ╭─────────────────────── │
│        │                        │  ← flush right edge (crops)
│  BG    │    screenshot           │
│  left  │    (detail/section)     │
│ ~15%   │                         │
│        │                         │
│        │                   ───── │  ← flush bottom edge (crops)
└────────┴─────────────────────────┘
         ↑
         rounded corner top-left only
```

**Rules:**
- **Anchor:** bottom-right (default for detail crops)
- **BG breathing:** top (~15-17%) + left (~15-17%)
- **Bleed:** right + bottom edges (image extends past canvas)
- **Rounded corners:** top-left only (the single exposed corner)
- **Pre-crop the source** to ~1/3 of the original section — focus on the specific detail being highlighted
- Crops on flush edges (right, bottom) are OK and expected — they reinforce the "zoomed in" feeling
- The BG gradient should be more visible here than in Overview — it frames the detail

**When to use:** UI component detail, code editor close-up, feature panel, modal/dialog, typography detail, specific interaction.

---

### Composition Rules

**Crop Intent (decide BEFORE composing):**
- **"Show the product"** → Pattern 1 (Overview). Anchor center-top, bleed bottom.
- **"Show a detail"** → Pattern 2 (Zoom). Anchor bottom-right, bleed right+bottom.
- **"Show the result"** → Pattern 1 variant. Center crop of hero area.
- **"Show the full picture"** → Pattern 1 with less src_crop. Match source ratio.

> Always discuss crop intent before composing. "Where do we anchor?" is as important as "which screenshot do we use?"

**General cropping rules:**
- Never use full-page screenshots for every image — they become repetitive
- Each crop should have a clear "subject" — the feature or decision being highlighted
- Vary patterns across a project's gallery (mix Overview and Zoom images)
- For Zoom crops, focus on ~1/3 of the section being highlighted
- **Avoid content cuts and empty space:** The crop region must frame actual content tightly. If the source section has wide horizontal layouts or generous spacing on dark backgrounds, the Zoom pattern will amplify empty areas and cut text at flush edges. Before committing to Pattern 2, check:
  - Does the content fill the crop region densely? If not, tighten the crop or switch to Pattern 1.
  - Is important text near the right or bottom edge? It will get cut by the bleed. Reposition the crop so key content stays within the visible area (left + top).
  - Pages with centered headings or content spread across the full viewport width often work better as Pattern 1 (Overview) than Pattern 2 (Zoom).

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
- This creates the effect of the image "entering" the frame from one side

**Shadows:**
- NO drop shadows — depth comes from dark background contrast + ambient color glow

**Reference**: Webflow's feature showcase (webflow.com/feature/design) for composition quality benchmark.

---

### Image Specs

| Property | Value |
|----------|-------|
| Format | `.webp` |
| Canvas | `1600x1000` (16:10, MacBook Pro ratio) |
| Max file size | ~200KB |
| Naming | `{descriptive-name}.webp` (kebab-case) |
| Location | `public/projects/{slug}/` |
| Raw captures | `scripts/` (temporary `.png`, not committed) |

---

### Composing with Script

The Python composition script is at `scripts/compose-images.py`. It uses Pillow and provides:
- `create_orange_bg()` — gradient blur backgrounds from brand color variants
- `add_selective_rounded_corners()` — rounded corners on specific edges only
- `compose_overview()` — Pattern 1 composition (center-top, bleed bottom)
- `compose_zoom_detail()` — Pattern 2 composition (bottom-right, bleed right+bottom)

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
| `bg_ratio` | How much of canvas is BG breathing room (0.10-0.17) | `0.15` |
| `corner_radius` | Rounded corner radius in pixels | `12` |
| `src_crop` | Pre-crop source image `(left, top, right, bottom)` as relative coords 0.0-1.0 | `None` |
| `crop_box` | Pre-crop for zoom detail `(left, top, right, bottom)` as relative coords 0.0-1.0 | Required for zoom |
| `seed` | Random seed for reproducible BG gradients | `42` |

**Pattern 1 example (Overview):**
```python
compose_overview(
    'scripts/hero-raw.png',
    'public/projects/slug/hero.webp',
    bg_variant='contrast',
    bg_ratio=0.10,           # 10% BG on top, ~7-10% on sides
    corner_radius=12,
    src_crop=(0.08, 0.0, 0.92, 1.0),  # trim 8% from each side
)
```

**Pattern 2 example (Zoom/Detail):**
```python
compose_zoom_detail(
    'scripts/section-raw.png',
    'public/projects/slug/detail.webp',
    crop_box=(0.1, 0.05, 0.8, 0.7),  # ~1/3 of section
    bg_variant='warm',
    bg_ratio=0.15,            # 15% BG on top + left
    corner_radius=12,
)
```

### Composing in Figma

1. Create a frame at `1600x1000`
2. Add background fill using project brand colors with blur
3. Place the screenshot following Pattern 1 or Pattern 2 anchor rules
4. Apply rounded corners ONLY on exposed edges (not flush edges)
5. For zoom crops: crop the screenshot to ~1/3 first, then place
6. Export as `.webp` at 2x then compress

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

---

## Workflow Checklist

When adding a new project:

- [ ] Write EN + PT content (description, role, technologies, impact)
- [ ] Add project data to `en.json` and `pt-br.json`
- [ ] Create case study generator function in `case-study-generator.ts`
- [ ] Create LLM routes (EN + PT) in `src/app/llms/projects/`
- [ ] Capture screenshots via Playwright (hero viewport + section viewports)
- [ ] Compose images using script (Pattern 1 for overview, Pattern 2 for details)
- [ ] Add composed images to `public/projects/{slug}/`
- [ ] Add case study link to `markdown-generator.ts`
- [ ] Add EN route to `sitemap.ts`
- [ ] Update `types.ts` only if new fields are needed
- [ ] Build and verify (`pnpm build`)
