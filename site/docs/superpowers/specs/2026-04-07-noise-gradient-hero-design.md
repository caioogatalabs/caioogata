# Noise Gradient Hero Background

## Summary

Add a 3D noise gradient background behind project hero images. The gradient uses per-project colors, expands via scroll-linked clip-path animation (fiddle.digital reference), and breathes subtly via Perlin noise vertex displacement. Powered by React Three Fiber with a minimal ShaderMaterial (no PBR).

## Layout

The `ProjectHeroImage` changes from 12-col full-bleed image to a layered composition:

- **Outer container**: 12 columns, `overflow-hidden`, `rounded-12px`, `position: relative`
- **Noise canvas**: `position: absolute`, `inset: 0`, `z-0`, clip-path animated by scroll progress
- **Image**: 9 columns centered (`width: 75%`, `mx-auto`), `z-10`, `relative`, `rounded-12px`

The gradient peeks out on the sides (~1.5 col each) and top/bottom depending on image aspect ratio.

## Data Model

Add optional `colors` field to `ProjectItem` in `src/content/types.ts`:

```typescript
export interface ProjectItem {
  // ...existing fields
  colors?: [string, string, string]  // 3 hex colors for noise gradient
}
```

When `colors` is undefined, no canvas renders and image stays at 12 columns (backward compatible).

Example in `en.json` for Azion:
```json
"colors": ["#F3652B", "#1E1E1E", "#FF8A5C"]
```

## Entrance Animation (scroll-linked expand)

Reference: fiddle.digital/work/the-os-agency `.preview-bg` behavior.

The noise gradient canvas container expands from a collapsed point to full rect, driven by scroll progress.

### Scroll progress mapping

Uses the same rAF + scroll position pattern as the existing `useScrollReveal` hook:
- `startFraction: 0.85` (viewport Y where reveal begins)
- `endFraction: 0.3` (where it completes)
- Progress 0 → 1 mapped linearly between these fractions

### Clip-path interpolation

```
progress 0:  clip-path: polygon(50% 100%, 50% 100%, 50% 100%, 50% 100%)  // collapsed point
progress 1:  clip-path: polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)      // full rect
```

Four polygon points interpolated with progress `p`:
- Top-left: `(50 - 50*p)% (100 - 100*p)%`
- Top-right: `(50 + 50*p)% (100 - 100*p)%`
- Bottom-right: `(50 + 50*p)% 100%`
- Bottom-left: `(50 - 50*p)% 100%`

Combined with `opacity: p` for simultaneous fade-in.

### Sequencing with existing entrance

The image keeps its existing `-entrance -scale-in -a-2` (IntersectionObserver, one-shot). The noise gradient expand is continuous scroll-linked. This creates a layered entrance: image pops in, background expands behind it as user scrolls.

## Components

### `NoiseGradient` — `src/components/three/NoiseGradient.tsx`

The 3D mesh with shader.

**Props:**
```typescript
interface NoiseGradientProps {
  colors: [string, string, string]
  speed?: number  // default 0.15
}
```

**Internals:**
- Geometry: `planeGeometry(10, 6, 48, 48)` — 2,304 vertices
- Material: `THREE.ShaderMaterial` (not Physical/Standard)
- Vertex shader: Classic Perlin noise (inlined), displaces position along normal
- Fragment shader: `mix(mix(color1, color2, smoothstep(x)), color3, z)` — no lighting
- Animation: `useFrame` increments `uTime` by `delta * speed`
- `prefers-reduced-motion`: detects via `matchMedia`, stops animation loop, renders 1 static frame

**Uniforms:**
- `uTime: float` — elapsed time
- `uSpeed: float` — time multiplier (0.15)
- `uNoiseDensity: float` — noise coordinate scale (1.5)
- `uNoiseStrength: float` — displacement amplitude (0.3)
- `uC1r/g/b, uC2r/g/b, uC3r/g/b: float` — 3 colors as normalized RGB

### `NoiseGradientCanvas` — `src/components/three/NoiseGradientCanvas.tsx`

The R3F canvas wrapper. Lazy loaded via `next/dynamic` with `ssr: false`.

**Setup:**
- `<Canvas>` with `dpr={1}` (no retina needed for noise)
- Orthographic camera, fixed position (no controls, no interaction)
- No lights, no environment, no post-processing
- `frameloop="always"` (switches to `"never"` when reduced-motion)

### `ProjectHeroImage` — modified

Updated to conditionally render the noise gradient behind the image.

**Changes:**
- If `project.colors` exists: wrap in relative container, render `NoiseGradientCanvas` as absolute background, image at 75% width centered
- If no `colors`: current behavior unchanged (12-col full-bleed)
- New hook call for scroll-linked clip-path on the canvas wrapper

## Performance Budget

| Metric | shadergradient.co | This implementation |
|---|---|---|
| Vertices | 36,864 | 2,304 (16x less) |
| Material | MeshPhysicalMaterial + PBR | ShaderMaterial (raw) |
| Lighting passes | 3+ | 0 |
| Bundle addition | ~180KB | ~120KB (three tree-shaken) |
| Canvas DPR | device default | 1 (fixed) |
| GPU cost/frame | High | Minimal |

## Dependencies to Add

```
pnpm add three @react-three/fiber
pnpm add -D @types/three
```

## File Structure

```
src/components/three/
  NoiseGradient.tsx          — shader mesh component
  NoiseGradientCanvas.tsx    — R3F canvas wrapper (lazy loaded)
  shaders/
    noise.glsl.ts            — Perlin noise + vertex/fragment as template literals
src/hooks/
  useScrollExpand.ts         — scroll-linked clip-path polygon expand
```

## Reduced Motion

- `matchMedia('(prefers-reduced-motion: reduce)')` detected in `NoiseGradientCanvas`
- Canvas renders 1 frame then sets `frameloop="never"`
- Clip-path set to fully expanded (no scroll animation)
- Opacity set to 1

## Out of Scope

- Glass/cosmic shader variants
- Camera controls or user interaction with the gradient
- Post-processing (bloom, DOF)
- Environment maps or HDR lighting
- Gradient on sections other than project hero
