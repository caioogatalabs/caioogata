# Design System Strategy: Architectural Brutalism

## 1. Overview & Creative North Star: "The Digital Blueprint"
This design system is built on the principles of **Architectural Brutalism**. It rejects the soft, consumer-grade "friendliness" of modern web templates in favor of a raw, intentional, and high-impact editorial experience.

The **Creative North Star** is "The Digital Blueprint." Think of the UI as a technical drawing—unapologetic about its structure, high in contrast, and utilizing monochromatic depth to guide the eye. We achieve a premium feel not through decoration, but through extreme precision in typography and the courageous use of negative space. By removing all border radii and shadows, we lean into a "Hard Edge" aesthetic that feels both archival and futuristic.

---

## 2. Colors: High-Voltage Contrast
The palette is dominated by a near-black foundation and a high-energy primary yellow. This isn't a "warm" yellow; it is a functional, cautionary, and bold signal.

### Core Palette
- **Primary (`#FAEA4D`):** Use sparingly for high-impact calls to action, active states, and critical headlines.
- **Secondary (`#618985`):** A sophisticated accent for less prominent UI elements, subtle highlights, or as a secondary action indicator.
- **Tertiary (`#618985`):** An additional accent color for highlights, badges, or decorative elements.
- **Neutral (`#121212`):** The canvas. A deep, solid charcoal that provides the necessary depth for the yellow and other colors to vibrate.

### The "No-Line" Rule
Traditional 1px borders are strictly prohibited for sectioning. Use **Block Segmentation** instead. If you need to separate the "About" section from the "Project" section, shift the background color from `surface` to `surface_container_low`. The edge where two different tonal blocks meet is the only "line" required.

### Section Theming (`data-theme`)
Sections can override the default dark palette by adding `data-theme` to their container. All semantic tokens inside inherit the override — no manual color swaps needed.

- **Dark (default):** Near-black canvas, light text, subtle borders.
- **Light (grey-based):** Background is `neutral-200` (0.65 lightness), NOT white. Text goes dark (`neutral-800`/`600`/`500`), borders go dark (`neutral-600`). Used for: Footer.
- **Inverse (brand):** Yellow `brand-400` background, dark brand text. Used for: hero sections on brand bg.

The yellow primary button (`bg-fill-primary` + `text-on-primary`) must remain stable across all three themes — only the Inverse theme overrides it to match the brand bg.

### Signature Textures & Gradients
While the aesthetic is raw, we avoid "flatness" by using technical gradients. Use a subtle linear gradient on primary CTAs (from `primary_fixed` to `primary_fixed_dim`) to give the yellow a metallic, industrial sheen.

---

## 3. Typography: Monospaced Authority
The typography is the voice of the brand. It should feel like a technical manual crossed with a high-end fashion magazine.

- **Display & Headlines (Space Grotesk):** These fonts carry the "brutalist" weight. Use `display-lg` (3.5rem) with tight letter-spacing for a massive, architectural presence. Headlines should feel like they are "stamped" onto the page.
- **Body & Titles (Inter):** For long-form reading, we switch to a clean, high-legibility sans-serif. This provides a necessary "quiet" contrast to the loud monospaced headlines.
- **Labels (Space Grotesk):** Small labels (`label-sm`) should always be in uppercase with increased letter-spacing to mimic engineering blueprints.

---

## 4. Elevation & Depth: Tonal Layering
In this design system, "up" does not mean "closer to the light source"—it means "more intense." We do not use shadows; we use **Tonal Stacking**.

- **The Layering Principle:** To create a card or a modal, place a `surface_container_highest` block on top of a `surface` background. The 0px radius ensures the corners are sharp, creating a "cut-out" effect.
- **Glassmorphism:** For floating navigation or overlays, use the `surface_bright` token at 60% opacity with a heavy `backdrop-blur` (20px+). This creates a "frosted" industrial glass effect that feels premium and intentional.
- **The "Ghost Border" Fallback:** If a layout feels too muddy, use the `outline_variant` at 15% opacity. It should be felt rather than seen—a ghost of a line that suggests a boundary without creating a hard visual break.

---

## 5. Components: Hard-Edge Primitives

### Buttons
- **Primary:** Background `fill-primary` (yellow), Label `on-primary`, pill (999px) or squared (12px) radius.
- **Secondary:** Transparent background, `border-primary` outline, `text-secondary` label.
- **Icon Only:** Same as above but `size-12` square, single icon character.
- **Composition:** Button + IconOnly side by side, `gap-0.5`, group hover activates both.

**Hover — Primary:** Masked vertical text swap — Fabio XM exits up, Pexel Grotesk 1.5rem enters from below. 1s `cubic-bezier(0.16,1,0.3,1)`. Composition icon delays +0.1s.

**Hover — Secondary:** Three-phase sequence:
1. Fill reveal: `bg-fill-outline-hover` rises from bottom (`translateY`), 0.2s, `overflow-hidden`.
2. Default text exits up: 0.4s at 0.05s delay.
3. Hover text (Pexel Grotesk 1.5rem) enters from below: 1s at 0.1s delay.
Color controlled via state, not CSS `:hover` — enables composition group hover. Fill tokens invert per theme (dark=light fill, light=dark fill).

### Input Fields
- **Styling:** Underline-only or solid block backgrounds (`surface_container_high`).
- **Focus State:** The entire background of the input shifts to `primary` yellow, with text switching to `on_primary`. This "Flash" state is a hallmark of the brutalist style.

### Cards & Lists
- **Rule:** Forbid divider lines.
- **Execution:** Use the Spacing Scale (64px, 128px) to separate list items. A list of projects should rely on the rhythm of large typography and image blocks rather than thin gray lines.

### Signature Component: The "Data-Stamp"
Every image or major section should be accompanied by a small `label-sm` technical data point (e.g., "PRJ_2024 // 001") in the corner of the container to reinforce the architectural blueprint theme.

---

## 6. Do’s and Don’ts

### Do:
- **Embrace Asymmetry:** Align a headline to the far left and the body text to a 60% offset grid.
- **Use Massive Scale:** Don't be afraid of a headline that takes up 50% of the viewport height.
- **Respect the 0px Radius:** Every corner must be sharp. This is non-negotiable for maintaining the architectural feel.

### Don’t:
- **Don’t Use Shadows:** Not even "soft" ones. Depth is achieved through color, not light simulation.
- **Don’t Use "Safe" Spacing:** Avoid 16px or 24px margins. The general spacing should be Normal (default). Use 0px (touching) or 80px+ (distant) for extreme tension where appropriate, but the foundational spacing system is normal.
- **Don’t Use Rounded Icons:** Icons must be sharp, stroke-based, and follow the same geometric rigidity as the typography.