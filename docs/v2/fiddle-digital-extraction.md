# Extraction: Fiddle.Digital

> Source: https://fiddle.digital + https://fiddle.digital/work
> Date: 2026-04-03
> Focus: Scroll behavior, loading/transitions, animations, responsiveness

## Summary

Fiddle.Digital uses a **zero-dependency CSS animation system** — no GSAP, no Lenis, no Locomotive Scroll. All motion is achieved through CSS transitions triggered by IntersectionObserver adding `-inview` classes. The result is a performant, maintainable system that delivers premium motion quality through carefully crafted easing curves and a disciplined stagger pattern. The custom cursor with project image previews is the signature interaction.

---

## 1. Scroll Behavior & Scroll-Triggered Effects

### Observations

**No smooth-scroll library.** Native browser scroll with `scroll-behavior: auto`. The perceived smoothness comes from the animation timing, not scroll hijacking.

**IntersectionObserver pattern:**
- Elements start with animation classes (`-a-to-top`, `-a-scale-in`, etc.) that set initial transform/opacity
- When element enters viewport, `-inview` class is added
- CSS transitions fire on the class change
- Animations are gated behind `html.-loaded.-ready` — nothing animates until the page is fully loaded

**Loading state sequence:**
```
html.-string          → Initial (fonts loading)
html.-string.-loaded  → Assets loaded
html.-string.-loaded.-ready → Ready to animate
```

Only after `-loaded.-ready` do the `-inview` transitions activate. This prevents animation jank during page load.

**No parallax.** No scroll-linked transforms or speed differentials. All scroll effects are binary (in view or not).

### Prompt-Ready Spec

Use IntersectionObserver to add an `-inview` class when elements enter the viewport (threshold ~15%). Gate all entrance animations behind a `-ready` class on `<html>` that's added after fonts and critical assets load. No smooth-scroll libraries — use native scroll. No parallax. Perceived smoothness comes from long-duration ease-out transitions (0.9s), not scroll manipulation.

---

## 2. Page Loading & Transitions

### Observations

**Page transitions (Nuxt):**
```css
/* Enter/Leave active state */
transition: opacity .6s var(--f-cubic), transform .6s var(--f-cubic);

/* Enter-from / Leave-to */
opacity: 0;
transform: translateY(2rem);
```

- Duration: **0.6s** for page transitions
- Both opacity and transform animate simultaneously
- Content slides up 2rem while fading in
- Easing: `--f-cubic: cubic-bezier(0.22, 0.31, 0, 1)` — heavy deceleration, content "lands" softly

**Loading sequence:**
1. Page shell renders (header persists — `position: fixed`)
2. Old page content fades out + translates down
3. New page content fades in + translates up from 2rem below
4. Entrance animations fire with stagger after content appears

### Prompt-Ready Spec

For Next.js App Router: implement page transitions using `framer-motion` `AnimatePresence` (or CSS-only with view transitions API). Duration: **600ms**. Easing: `cubic-bezier(0.22, 0.31, 0, 1)`. Enter animation: `opacity 0→1` + `translateY(32px→0)`. Exit animation: reverse. Header stays fixed during transition — only the main content area animates. After the page enters, fire section entrance animations with a 150ms base delay.

---

## 3. Animations

### 3.1 Easing Curves

The core of the system. All stored as CSS custom properties:

| Token | Value | Use |
|-------|-------|-----|
| `--f-cubic` | `cubic-bezier(0.22, 0.31, 0, 1)` | **Primary** — entrance animations, page transitions. Heavy deceleration, content "arrives" fast and settles slowly. |
| `--f-cubic-in` | `cubic-bezier(0.69, 0, 0, 1)` | Ease-in — for elements leaving or cursor image scale. |
| `--f-fast` | `cubic-bezier(0, 0.81, 0.35, 1)` | Fast ease-out — snappy micro-interactions. |
| `--f-smooth` | `cubic-bezier(0.5, 0, 0.3, 1)` | Smooth in-out — link underline animations. |
| `--f-smooth-alt` | `cubic-bezier(0.6, 0, 0.05, 1)` | Smoother variant. |
| `--f-8-bounce` | `linear(0, 1.32 3.8%, ...)` | 8-bounce spring — playful elements. |
| `--f-4-bounce` | `linear(0, 1.35 5%, ...)` | 4-bounce spring — moderate spring. |
| `--f-2-bounce` | `linear(0, 1.28 7%, ...)` | 2-bounce spring — subtle spring. |

**Key insight:** The `--f-cubic` curve (`0.22, 0.31, 0, 1`) is what gives the site its character. It's not a standard ease-out — it starts with moderate speed (0.22, 0.31), then decelerates aggressively to 0. Elements appear to "glide in and settle."

### 3.2 Entrance Animation Classes

All CSS-only, triggered by `-inview`:

| Class | Initial State | Duration | Effect |
|-------|--------------|----------|--------|
| `-a-to-top` | `translateY(4rem)` | 0.9s | Slides up from below |
| `-a-to-bottom` | `translateY(-4rem)` | 0.9s | Slides down from above |
| `-a-to-top100` | `translateY(100%)` | 0.9s | Full clip-reveal upward |
| `-a-to-bottom100` | `translateY(-100%)` | 0.9s | Full clip-reveal downward |
| `-a-scale-in` | `scale(0.5), opacity: 0` | 0.9s | Scales up + fades in |
| `-a-scale-out` | `scale(1.5), opacity: 0` | 0.9s | Scales down + fades in |
| `-a-streight` | `opacity: 0` | linear | Pure fade, no transform |
| `-a-to-top.-opacity` | `translateY(4rem), opacity: 0` | 0.9s | Slide + fade combined |

**In-view state:** All resolve to `transform: translateZ(0px)` (GPU-accelerated identity) with the stagger delay.

### 3.3 Stagger System

Pure CSS stagger using index classes:

```css
/* Base delay per index */
--t-delay: 0.07s;  /* 70ms between each element */
--t-modifier: 1;   /* Speed multiplier */

/* Applied per element */
.-a-0 { transition-delay: calc(var(--t-delay) * 0 * var(--t-modifier)); }
.-a-1 { transition-delay: calc(var(--t-delay) * 1 * var(--t-modifier)); }
.-a-2 { transition-delay: calc(var(--t-delay) * 2 * var(--t-modifier)); }
/* ... through -a-20 */
```

**Additional base offset:** `+ 0.15s` added to all stagger delays, so the first element starts at 150ms, not 0ms. This gives the page transition time to complete before content starts animating.

**Parent trigger variant:** `-a-p` on a parent means children animate when the *parent* gets `-inview`, not individually. Good for grouped content blocks.

### 3.4 Hover — Project List (Key Reference)

The /work page list is the most relevant pattern for the portfolio menu:

**Row hover behavior:**
1. Row has `::before` pseudo-element with `background-color: var(--c-black)` — creates the dark highlight
2. Non-hovered rows dim: text color transitions to `var(--c-grey-dark)` over `0.3s var(--f-cubic)`
3. Hovered row stays full color against the dark `::before` background

**Custom cursor with project images:**
- `position: fixed` element tracking mouse via CSS custom properties `--x` and `--y`
- Transform: `translate3d(calc(1px*var(--x) + 1rem), calc(1px*var(--y) + 1.5rem), 0)`
- **Skew based on velocity:** `skew(max(-30deg, min(30deg, -1deg * var(--x-lerp))), max(-30deg, min(30deg, -1deg * var(--y-lerp))))` — cursor tilts in the direction of mouse movement
- Contains all 18 project images (502×304px) in a grid, stacked. Active image shown based on hovered row index
- Image scale transition: `scale 0.3s cubic-bezier(0.69, 0, 0, 1)`
- `will-change: transform` on cursor for GPU acceleration
- `pointer-events: none` — cursor doesn't interfere with clicks
- `z-index: 100`

**Link underline animation:**
```css
background: linear-gradient(0deg, var(--c-black), var(--c-black)) no-repeat 100% 100% / 0 1px;
transition: background-size .45s var(--f-smooth);
/* On hover: */
background-size: 100% 1px;
```
Underline grows from right to left using background-size trick.

### 3.5 Button Hover

```css
.button .hover {
  opacity: 0;
  position: absolute;
  transform: translateY(200%) scale(1.2);
  transition: transform .9s var(--f-cubic);
}
```
Duplicate text element slides up from below on hover — text replacement effect.

### Prompt-Ready Spec

**Easing system:** Define 3 easing tokens as CSS custom properties:
- `--ease-out: cubic-bezier(0.22, 0.31, 0, 1)` — all entrance animations (0.9s)
- `--ease-in: cubic-bezier(0.69, 0, 0, 1)` — exit/leave animations
- `--ease-smooth: cubic-bezier(0.5, 0, 0.3, 1)` — micro-interactions (0.3-0.45s)

**Entrance system:** Create utility classes for entrance animations. Initial state set on the element, final state triggered by adding `-inview` class via IntersectionObserver. Duration: **0.9s** with `--ease-out`. Translation distance: **4rem** (64px). All transforms resolve to `translateZ(0)` for GPU compositing.

**Stagger:** Apply `transition-delay: calc(70ms * index)` via CSS classes or inline `style` attribute. Add 150ms base offset so animations start after page content settles. Support up to 20 indices.

**Menu hover:** On the list container `:hover`, dim all rows except the hovered one (color transition 0.3s). Show a floating preview element that follows the cursor with `position: fixed` + CSS custom properties updated via `mousemove` listener. Add velocity-based skew (clamp to +-30deg) for organic feel. Preview images: ~500px wide, aspect ratio ~5:3, with `scale 0.3s ease-in` on image swap.

---

## 4. Responsive Behavior

### Observations

**Breakpoints:**

| Breakpoint | Columns | Margin | Notes |
|-----------|---------|--------|-------|
| ≤321px | 6 | `calc(0.2rem * 2)` | Small phone |
| ≤1024px | 6 | `calc(0.2rem * 2)` | Mobile/tablet — main mobile breakpoint |
| ≥1024px | 14 | `calc(0.2rem * 4)` | Desktop — main desktop breakpoint |
| ≥1600px | 14 | `calc(0.2rem * 4)` | Large desktop |
| ≥1920px | 14 | `calc(0.2rem * 4)` | Ultra-wide |
| ≥2560px | 14 | `calc(0.2rem * 4)` | 4K |

Also uses `(pointer: fine)` for hover-capable devices.

**Grid system:**
- CSS Grid with `--g-columns` (6 mobile / 14 desktop)
- Gap: `0.2rem` consistent across all breakpoints
- Children use `--left` and `--width` custom properties for grid placement:
  ```css
  grid-column-start: var(--left, 1);
  grid-column-end: calc(var(--left, 1) + var(--width, 1));
  ```

**Typography scale:**
- Modular scale with ratio **1.333** (Perfect Fourth)
- Base: `--p: 1rem` (16px)
- Scale: `--mm` → `--m` → `--p` → `--h6` → `--h5` → `--h4` → `--h3` → `--h2` → `--h1`
- `--large: clamp(var(--p), calc(var(--h1) * 1.333 * 1.333), 9.3vw)` — fluid display size
- Font class swapping: elements get 3 size classes (e.g., `-h4 -mid-h5 -m-h6`) for desktop/mid/mobile

**Mobile adaptations:**
- Custom cursor: `display: none` on mobile
- Project thumbnails: shown **inline** within each row on mobile (visible by default). On desktop: hidden inline, shown via the custom cursor
- Header navigation: collapses to a horizontal scroll bar
- All hover interactions disabled (no `:hover` rules inside `max-width: 1024px`)

**Font:** KHTeka with `font-optical-sizing: auto`

### Prompt-Ready Spec

Use a single main breakpoint at **1024px** (mobile below, desktop above). Mobile: 4-6 column grid. Desktop: 12-14 column grid. Gap consistent across breakpoints. Use CSS custom properties for grid placement (`--left`, `--width`) so component layouts can be adjusted by changing variables, not rewriting grid rules.

Typography: use a modular scale (ratio 1.333 or similar) with CSS `calc()` chains. For display text, use `clamp()` for fluid sizing. Apply responsive font sizes via class swapping (3 classes per element: desktop, tablet, mobile) rather than media queries on each element.

Hide all hover/cursor enhancements below 1024px. On mobile, show preview images inline instead. Use `(pointer: fine)` media query to feature-detect hover capability rather than relying solely on viewport width.

---

## Cross-Domain Patterns

1. **Consistency through tokens:** Every timing, easing, and spacing value comes from a CSS custom property. This means changing `--f-cubic` updates the entire site's motion feel in one place.

2. **Progressive enhancement philosophy:** Desktop gets the rich cursor interaction + hover previews. Mobile gets the same content with inline images instead. The experience degrades gracefully, not differently.

3. **Animation gating:** The `-loaded.-ready` pattern prevents partial animations during load. Combined with the stagger system's 150ms base offset, content always appears choreographed, never janky.

4. **No JavaScript animation runtime:** All animation state is in CSS. JavaScript only does two things: (a) toggle classes via IntersectionObserver, (b) update CSS custom properties for cursor position. This makes the system extremely maintainable and performant.

5. **Velocity-reactive cursor:** The `--x-lerp` and `--y-lerp` values create organic movement by feeding mouse velocity into the cursor's `skew()` transform. This is the single most "alive" element on the site.

---

## Prompt-Ready Summary

Build a CSS-first animation system with no external dependencies. Define easing curves as CSS custom properties: primary `cubic-bezier(0.22, 0.31, 0, 1)` for 0.9s entrance animations, and `cubic-bezier(0.5, 0, 0.3, 1)` for 0.3-0.45s micro-interactions. Use IntersectionObserver to add `-inview` classes, triggering CSS transitions from offset positions (translateY 4rem or 100%) to identity. Stagger elements at 70ms intervals with 150ms base offset. Gate animations behind a ready state that fires after fonts/assets load.

For hover interactions: dim non-hovered siblings (color transition 0.3s), highlight the active item with a dark background. Show a floating image preview that tracks the cursor via CSS custom properties updated on `mousemove`. Add velocity-based skew (clamped +-30deg) for organic feel. Hide cursor interaction on mobile; show preview images inline instead.

Page transitions: 600ms, opacity + translateY(2rem), same primary easing curve. Header persists, only content area animates.

Single main breakpoint at 1024px. Fluid typography with modular scale (ratio 1.333). Use `clamp()` for display sizes. Grid via CSS custom properties for flexible column placement.
