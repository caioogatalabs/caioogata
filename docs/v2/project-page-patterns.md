# Project Page — Section Patterns

Reference for all project page sections. Follow these patterns exactly when editing or creating new sections.

---

## Typography Tokens (Figma source of truth)

| Token | Font | Size | Weight | Line-height | Tracking | Usage |
|-------|------|------|--------|-------------|----------|-------|
| **Display/LG** | Fabio XM | 72px | 400 (regular) | 1.15 | -1.44px | Impact numbers |
| **Display/MD** | Fabio XM | 48px | 400 (regular) | 1.15 | -0.96px | Hero body, section headings, feature names |
| **Body/LG** | Fabio XM | 18px | 400 (regular) | 1.6 | 0 | Paragraphs, descriptions, values |
| **Label/LG** | Fabio XM | 14px | 500 (medium) | 1.5 | 1.12px | Technology tags, stat labels (uppercase) |
| **Data stamp** | Cascadia Mono | 12px | 400 | 16px | 0.88px | `PRJ_2022 // 001` identifiers (uppercase) |
| **Nav/Label** | Cascadia Mono | 12px | 400 | 16px | 0.6px | Feature labels, section labels (uppercase) |

### Color mapping

| Figma hex | Semantic token | Usage |
|-----------|---------------|-------|
| `#b6b7b9` | `text-text-primary` | Display headings, stat numbers |
| `#8e8f91` | `text-text-secondary` | Body text, descriptions, link text |
| `#5a5b5c` | `text-text-tertiary` | Labels, data stamps, technologies, feature names |

### Font family

- Display/Body/Label: `style={{ fontFamily: 'var(--font-sans)' }}` (Fabio XM)
- Mono labels: `className="font-mono"` (Cascadia Mono)

---

## Section Patterns

### 1. ProjectHero (text) + ProjectHeroImage (image)

Two separate components — shell places navigation between them.

**Grid**: 12-col
- Row 1: Data stamp (span 12)
- Row 2: Technologies (span 4, Label/LG) + Body description (span 8, Display/MD)

**HeroImage**: Full 12-col image, `loading="eager"`, `rounded-[12px]`, `-entrance -scale-in -a-2`

**Both require `useInView` ref** on their `<section>` to trigger entrance animations.

---

### 2. ProjectChallenge

**Grid**: 12-col
- Row 1: Data stamp (span 12, `mb-10`)
- Row 2: Challenge (span 4) + Solution (span 4) + empty (span 4)

**Headings**: Display/MD (48px regular), `text-text-primary`
**Body**: Body/LG (18px), `text-text-tertiary`
**Layout**: `flex flex-col gap-5` inside each column

**Props**: Requires `project` and `projectIndex` for data stamp.

---

### 3. ProjectImpact

**Grid**: 12-col
- Row 1: "Results" label (span 12, Data stamp style, `mb-4`)
- Row 2: Spacer (span 3, hidden on mobile/tablet) + Stats (dynamic span)

**Stat span logic** (`getStatSpan`):
- 2 stats → span 4 each
- 3 stats → span 3 each

**Stat layout**: `flex flex-wrap items-start gap-5`
- Value: Display/LG (72px regular), `text-text-primary`
- Label: Label/LG (14px medium), `text-text-tertiary`, `max-w-[224px]`, `pt-2`

**Values must be short numbers** (e.g., `+40`, `+20`). Avoid long text — flex-wrap handles overflow but numbers are the intended pattern.

---

### 4. ProjectGalleryStaggered

**Does NOT use Grid component** — uses inline `grid grid-cols-12` for full-width stagger control.

**Pattern**: Each image occupies exactly 4 cols within a 12-col grid. Two slots are always empty. Images stagger across positions.

**Stagger cycle** (`STAGGER_COLS`): `[5, 9, 5, 1]` → center, right, center, left

**Image sizing**: `h-[340px]` fixed height, `object-cover`, `rounded-[12px]`

**Data**: Flattens all `section.rows[].images` into a single list — row spans are ignored.

**Scroll reveal**: `useScrollReveal` → `clipPath` on wrapper. Wrapper needs `h-full` to fill grid cell.

**Padding**: `px-5 md:px-8 lg:px-16` (matches Grid component padding).

---

### 5. ProjectGalleryFeatureList

**Grid**: 12-col per feature row, `space-y-16` between rows.

**Columns per row**:
- Left (span 4): Label at top + Feature name at bottom, `justify-between h-[410px]`
  - Label: Nav/Label (Cascadia Mono 12px, tracking 0.6px)
  - Name: Display/MD (48px), `text-text-tertiary`
  - Bottom spacer: `h-4`
- Center (span 5): `ParallaxRevealImage` (scroll reveal + parallax factor 0.1)
- Right (span 3): Description, Body/LG (18px), `text-text-secondary`, `items-start`

---

### 6. ProjectInfoBlock

Unified metadata section — no section titles. `border-t border-border-primary`.

**Grid**: 3-3-3-3 (equal columns)
- Col 1: Project name + Client & Role + Year (stacked with `space-y-6`)
- Col 2: Technologies
- Col 3: Credits (names as links to LinkedIn)
- Col 4: Links (with ↗ external link icon, `opacity-50 group-hover:opacity-100`)

**Sub-components**: `Label` (Mono 12px), `Value` (Body/LG 18px), `ExternalLinkIcon` (14x14 SVG)

---

### 7. ProjectNavigation

Rendered twice: top (sticky, z-40, backdrop-blur) + bottom (static).

**Layout**: `flex justify-between`, Cascadia Mono 12px, `text-text-secondary`
**Keyboard**: ArrowLeft/Right (navigate), Escape (home) — only on top instance
**Fallback**: First/last project links to "Back to Home"

---

## Shell Rendering Order

```
ProjectHero (text)          — section[0]
ProjectNavigation (top)     — sticky
ProjectHeroImage            — first image from project.images
sections[1..n]              — Challenge, Impact, Gallery, FeatureList, etc.
ProjectInfoBlock            — always rendered
ProjectNavigation (bottom)  — static
```

---

## Rules

1. **Always use semantic tokens** — never raw hex or oklch in components
2. **Always use `useInView` ref** on `<section>` elements that contain `-entrance` children
3. **Gallery staggered uses inline grid**, not Grid component — to control column start
4. **Impact values should be short numbers** — Display/LG at 72px overflows with long text
5. **Font family via inline style** — `style={{ fontFamily: 'var(--font-sans)' }}` for Fabio XM
6. **Entrance animation stagger** — increment `-a-N` per element group, not per individual element
7. **Images**: `rounded-[var(--radius-component-md,12px)]`, lazy loading (except hero which is eager)
