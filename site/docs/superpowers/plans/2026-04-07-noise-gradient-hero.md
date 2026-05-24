# Noise Gradient Hero Background — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a 3D Perlin noise gradient background behind project hero images that expands via scroll-linked clip-path animation, using per-project colors from content JSON.

**Architecture:** R3F Canvas (lazy loaded, SSR-off) renders a low-poly plane with a custom ShaderMaterial. A `useScrollExpand` hook drives clip-path polygon interpolation on the canvas wrapper. The `ProjectHeroImage` component conditionally renders the gradient when a project has `colors` defined.

**Tech Stack:** Three.js, @react-three/fiber, GLSL (Classic Perlin Noise), next/dynamic

---

## File Map

| Action | File | Responsibility |
|--------|------|----------------|
| Create | `src/components/three/shaders/noise.glsl.ts` | GLSL vertex + fragment shaders as TS template literals |
| Create | `src/components/three/NoiseGradient.tsx` | R3F mesh with ShaderMaterial |
| Create | `src/components/three/NoiseGradientCanvas.tsx` | R3F Canvas wrapper, lazy-loaded |
| Create | `src/hooks/useScrollExpand.ts` | Scroll-linked polygon clip-path expand |
| Modify | `src/content/types.ts:125-140` | Add `colors?: [string, string, string]` to `ProjectItem` |
| Modify | `src/content/en.json:532+` | Add `colors` to first project for testing |
| Modify | `src/components/sections/v2/project/ProjectHero.tsx:57-78` | Conditional noise gradient + 9-col image layout |

---

### Task 1: Install Dependencies

**Files:**
- Modify: `package.json`

- [ ] **Step 1: Install three and R3F**

```bash
cd /Users/caioogata/Projects/portolio-v1
pnpm add three @react-three/fiber
pnpm add -D @types/three
```

- [ ] **Step 2: Verify install**

```bash
cd /Users/caioogata/Projects/portolio-v1
pnpm ls three @react-three/fiber @types/three
```

Expected: All three packages listed with versions.

- [ ] **Step 3: Commit**

```bash
git add package.json pnpm-lock.yaml
git commit -m "chore: add three.js and react-three-fiber dependencies"
```

---

### Task 2: Add `colors` to Data Model

**Files:**
- Modify: `src/content/types.ts:125-140`
- Modify: `src/content/en.json` (first project entry)

- [ ] **Step 1: Add `colors` field to `ProjectItem` interface**

In `src/content/types.ts`, add `colors` to `ProjectItem` after `year`:

```typescript
export interface ProjectItem {
  title: string
  slug: string
  description: string
  role?: string
  technologies?: string
  impact?: string
  caseStudyUrl?: string
  credits?: ProjectCredit[]
  links?: ProjectLink[]
  images: ProjectImage[]
  gridLayout?: 'default' | 'large-only'
  disabled?: boolean
  sections?: ProjectSection[]
  year?: string
  colors?: [string, string, string]
}
```

- [ ] **Step 2: Add test colors to first project (Azion Website)**

In `src/content/en.json`, add `colors` to the Azion Website project entry (the first item in `projects.items`). Add it after the `"year": "2022"` line:

```json
"colors": ["#F3652B", "#1E1E1E", "#FF8A5C"],
```

- [ ] **Step 3: Verify build**

```bash
cd /Users/caioogata/Projects/portolio-v1
pnpm build 2>&1 | tail -5
```

Expected: Build succeeds (unused field doesn't break anything).

- [ ] **Step 4: Commit**

```bash
git add src/content/types.ts src/content/en.json
git commit -m "feat: add colors field to ProjectItem for noise gradient"
```

---

### Task 3: GLSL Shaders

**Files:**
- Create: `src/components/three/shaders/noise.glsl.ts`

- [ ] **Step 1: Create shader file with Perlin noise + vertex/fragment**

Create `src/components/three/shaders/noise.glsl.ts`:

```typescript
/**
 * Classic 3D Perlin Noise — adapted from glsl-noise/classic/3d
 * Vertex shader displaces along normal; fragment maps 3 colors by world position.
 */

const perlinNoise = /* glsl */ `
vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
vec4 mod289(vec4 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
vec4 permute(vec4 x) { return mod289(((x * 34.0) + 1.0) * x); }
vec4 taylorInvSqrt(vec4 r) { return 1.79284291400159 - 0.85373472095314 * r; }
vec3 fade(vec3 t) { return t * t * t * (t * (t * 6.0 - 15.0) + 10.0); }

float cnoise(vec3 P) {
  vec3 Pi0 = floor(P);
  vec3 Pi1 = Pi0 + vec3(1.0);
  Pi0 = mod289(Pi0);
  Pi1 = mod289(Pi1);
  vec3 Pf0 = fract(P);
  vec3 Pf1 = Pf0 - vec3(1.0);

  vec4 ix = vec4(Pi0.x, Pi1.x, Pi0.x, Pi1.x);
  vec4 iy = vec4(Pi0.yy, Pi1.yy);
  vec4 iz0 = Pi0.zzzz;
  vec4 iz1 = Pi1.zzzz;

  vec4 ixy = permute(permute(ix) + iy);
  vec4 ixy0 = permute(ixy + iz0);
  vec4 ixy1 = permute(ixy + iz1);

  vec4 gx0 = ixy0 * (1.0 / 7.0);
  vec4 gy0 = fract(floor(gx0) * (1.0 / 7.0)) - 0.5;
  gx0 = fract(gx0);
  vec4 gz0 = vec4(0.5) - abs(gx0) - abs(gy0);
  vec4 sz0 = step(gz0, vec4(0.0));
  gx0 -= sz0 * (step(0.0, gx0) - 0.5);
  gy0 -= sz0 * (step(0.0, gy0) - 0.5);

  vec4 gx1 = ixy1 * (1.0 / 7.0);
  vec4 gy1 = fract(floor(gx1) * (1.0 / 7.0)) - 0.5;
  gx1 = fract(gx1);
  vec4 gz1 = vec4(0.5) - abs(gx1) - abs(gy1);
  vec4 sz1 = step(gz1, vec4(0.0));
  gx1 -= sz1 * (step(0.0, gx1) - 0.5);
  gy1 -= sz1 * (step(0.0, gy1) - 0.5);

  vec3 g000 = vec3(gx0.x, gy0.x, gz0.x);
  vec3 g100 = vec3(gx0.y, gy0.y, gz0.y);
  vec3 g010 = vec3(gx0.z, gy0.z, gz0.z);
  vec3 g110 = vec3(gx0.w, gy0.w, gz0.w);
  vec3 g001 = vec3(gx1.x, gy1.x, gz1.x);
  vec3 g101 = vec3(gx1.y, gy1.y, gz1.y);
  vec3 g011 = vec3(gx1.z, gy1.z, gz1.z);
  vec3 g111 = vec3(gx1.w, gy1.w, gz1.w);

  vec4 norm0 = taylorInvSqrt(vec4(dot(g000,g000), dot(g010,g010), dot(g100,g100), dot(g110,g110)));
  g000 *= norm0.x; g010 *= norm0.y; g100 *= norm0.z; g110 *= norm0.w;
  vec4 norm1 = taylorInvSqrt(vec4(dot(g001,g001), dot(g011,g011), dot(g101,g101), dot(g111,g111)));
  g001 *= norm1.x; g011 *= norm1.y; g101 *= norm1.z; g111 *= norm1.w;

  float n000 = dot(g000, Pf0);
  float n100 = dot(g100, vec3(Pf1.x, Pf0.yz));
  float n010 = dot(g010, vec3(Pf0.x, Pf1.y, Pf0.z));
  float n110 = dot(g110, vec3(Pf1.xy, Pf0.z));
  float n001 = dot(g001, vec3(Pf0.xy, Pf1.z));
  float n101 = dot(g101, vec3(Pf1.x, Pf0.y, Pf1.z));
  float n011 = dot(g011, vec3(Pf0.x, Pf1.yz));
  float n111 = dot(g111, Pf1);

  vec3 fade_xyz = fade(Pf0);
  vec4 n_z = mix(vec4(n000, n100, n010, n110), vec4(n001, n101, n011, n111), fade_xyz.z);
  vec2 n_yz = mix(n_z.xy, n_z.zw, fade_xyz.y);
  float n_xyz = mix(n_yz.x, n_yz.y, fade_xyz.x);
  return 2.2 * n_xyz;
}
`

export const vertexShader = /* glsl */ `
${perlinNoise}

uniform float uTime;
uniform float uNoiseDensity;
uniform float uNoiseStrength;

varying vec3 vPos;

void main() {
  float t = uTime;
  float distortion = cnoise(position * uNoiseDensity + t) * uNoiseStrength;
  vec3 pos = position + normal * distortion;
  vPos = pos;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
}
`

export const fragmentShader = /* glsl */ `
uniform float uC1r; uniform float uC1g; uniform float uC1b;
uniform float uC2r; uniform float uC2g; uniform float uC2b;
uniform float uC3r; uniform float uC3g; uniform float uC3b;

varying vec3 vPos;

void main() {
  vec3 color1 = vec3(uC1r, uC1g, uC1b);
  vec3 color2 = vec3(uC2r, uC2g, uC2b);
  vec3 color3 = vec3(uC3r, uC3g, uC3b);

  float x = smoothstep(-5.0, 5.0, vPos.x);
  float z = clamp(vPos.z / 0.5, 0.0, 1.0);

  vec3 color = mix(mix(color1, color2, x), color3, z);
  gl_FragColor = vec4(color, 1.0);
}
`
```

- [ ] **Step 2: Commit**

```bash
git add src/components/three/shaders/noise.glsl.ts
git commit -m "feat: add GLSL Perlin noise vertex/fragment shaders"
```

---

### Task 4: NoiseGradient Mesh Component

**Files:**
- Create: `src/components/three/NoiseGradient.tsx`

- [ ] **Step 1: Create the R3F mesh component**

Create `src/components/three/NoiseGradient.tsx`:

```tsx
'use client'

import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { vertexShader, fragmentShader } from './shaders/noise.glsl'

interface NoiseGradientProps {
  colors: [string, string, string]
  speed?: number
  paused?: boolean
}

function hexToRgb(hex: string): [number, number, number] {
  const r = parseInt(hex.slice(1, 3), 16) / 255
  const g = parseInt(hex.slice(3, 5), 16) / 255
  const b = parseInt(hex.slice(5, 7), 16) / 255
  return [r, g, b]
}

export function NoiseGradient({ colors, speed = 0.15, paused = false }: NoiseGradientProps) {
  const materialRef = useRef<THREE.ShaderMaterial>(null)

  const uniforms = useMemo(() => {
    const [c1, c2, c3] = colors.map(hexToRgb)
    return {
      uTime: { value: 0 },
      uNoiseDensity: { value: 1.5 },
      uNoiseStrength: { value: 0.3 },
      uC1r: { value: c1[0] }, uC1g: { value: c1[1] }, uC1b: { value: c1[2] },
      uC2r: { value: c2[0] }, uC2g: { value: c2[1] }, uC2b: { value: c2[2] },
      uC3r: { value: c3[0] }, uC3g: { value: c3[1] }, uC3b: { value: c3[2] },
    }
  }, [colors])

  useFrame((_, delta) => {
    if (materialRef.current && !paused) {
      materialRef.current.uniforms.uTime.value += delta * speed
    }
  })

  return (
    <mesh>
      <planeGeometry args={[10, 6, 48, 48]} />
      <shaderMaterial
        ref={materialRef}
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        uniforms={uniforms}
        side={THREE.DoubleSide}
      />
    </mesh>
  )
}
```

- [ ] **Step 2: Commit**

```bash
git add src/components/three/NoiseGradient.tsx
git commit -m "feat: add NoiseGradient R3F mesh component"
```

---

### Task 5: NoiseGradientCanvas Wrapper

**Files:**
- Create: `src/components/three/NoiseGradientCanvas.tsx`

- [ ] **Step 1: Create the lazy-loaded Canvas wrapper**

Create `src/components/three/NoiseGradientCanvas.tsx`:

```tsx
'use client'

import { useState, useEffect } from 'react'
import { Canvas } from '@react-three/fiber'
import { NoiseGradient } from './NoiseGradient'

interface NoiseGradientCanvasProps {
  colors: [string, string, string]
  speed?: number
  className?: string
  style?: React.CSSProperties
}

export function NoiseGradientCanvas({ colors, speed, className, style }: NoiseGradientCanvasProps) {
  const [reducedMotion, setReducedMotion] = useState(false)

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
    setReducedMotion(mq.matches)
    const handler = (e: MediaQueryListEvent) => setReducedMotion(e.matches)
    mq.addEventListener('change', handler)
    return () => mq.removeEventListener('change', handler)
  }, [])

  return (
    <div className={className} style={style}>
      <Canvas
        dpr={1}
        frameloop={reducedMotion ? 'demand' : 'always'}
        orthographic
        camera={{ zoom: 80, position: [0, 0, 5] }}
        gl={{ antialias: false, alpha: false }}
        style={{ width: '100%', height: '100%' }}
      >
        <NoiseGradient colors={colors} speed={speed} paused={reducedMotion} />
      </Canvas>
    </div>
  )
}
```

- [ ] **Step 2: Commit**

```bash
git add src/components/three/NoiseGradientCanvas.tsx
git commit -m "feat: add NoiseGradientCanvas with reduced-motion support"
```

---

### Task 6: useScrollExpand Hook

**Files:**
- Create: `src/hooks/useScrollExpand.ts`

- [ ] **Step 1: Create the scroll-linked polygon expand hook**

Create `src/hooks/useScrollExpand.ts`. This follows the same rAF + scroll pattern as the existing `useScrollReveal` hook, but outputs a polygon clip-path that expands from center-bottom to full rect:

```typescript
'use client'

import { useEffect, useRef, useState, useCallback } from 'react'

export function useScrollExpand({
  startFraction = 0.85,
  endFraction = 0.3,
} = {}) {
  const ref = useRef<HTMLElement>(null)
  const [clipPath, setClipPath] = useState('polygon(50% 100%, 50% 100%, 50% 100%, 50% 100%)')
  const [opacity, setOpacity] = useState(0)
  const tickingRef = useRef(false)

  const update = useCallback(() => {
    const el = ref.current
    if (!el) return

    const rect = el.getBoundingClientRect()
    const vh = window.innerHeight

    const start = vh * startFraction
    const end = vh * endFraction
    const progress = 1 - (rect.top - end) / (start - end)
    const p = Math.max(0, Math.min(1, progress))

    const tl = `${50 - 50 * p}% ${100 - 100 * p}%`
    const tr = `${50 + 50 * p}% ${100 - 100 * p}%`
    const br = `${50 + 50 * p}% 100%`
    const bl = `${50 - 50 * p}% 100%`

    setClipPath(`polygon(${tl}, ${tr}, ${br}, ${bl})`)
    setOpacity(p)
    tickingRef.current = false
  }, [startFraction, endFraction])

  useEffect(() => {
    const el = ref.current
    if (!el) return

    const prefersReduced = window.matchMedia(
      '(prefers-reduced-motion: reduce)'
    ).matches

    if (prefersReduced) {
      setClipPath('polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)')
      setOpacity(1)
      return
    }

    const onScroll = () => {
      if (!tickingRef.current) {
        tickingRef.current = true
        requestAnimationFrame(update)
      }
    }

    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll, { passive: true })
    update()

    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
    }
  }, [update])

  return { ref, clipPath, opacity }
}
```

- [ ] **Step 2: Commit**

```bash
git add src/hooks/useScrollExpand.ts
git commit -m "feat: add useScrollExpand hook for polygon clip-path reveal"
```

---

### Task 7: Integrate into ProjectHeroImage

**Files:**
- Modify: `src/components/sections/v2/project/ProjectHero.tsx:57-78`

- [ ] **Step 1: Update ProjectHeroImage with conditional noise gradient**

Replace the `ProjectHeroImage` function (lines 57-78) in `src/components/sections/v2/project/ProjectHero.tsx`. The full updated file should be:

```tsx
'use client'

import { useInView } from '@/hooks/useInView'
import { useScrollExpand } from '@/hooks/useScrollExpand'
import { Grid, GridItem } from '@/components/layout/Grid'
import dynamic from 'next/dynamic'
import type { ProjectItem, ProjectSection } from '@/content/types'

const NoiseGradientCanvas = dynamic(
  () => import('@/components/three/NoiseGradientCanvas').then(mod => ({ default: mod.NoiseGradientCanvas })),
  { ssr: false }
)

interface ProjectHeroProps {
  project: ProjectItem
  section: ProjectSection
  index: number
}

export function ProjectHero({ project, section, index }: ProjectHeroProps) {
  const sectionRef = useInView()

  return (
    <section
      ref={sectionRef as React.RefObject<HTMLElement>}
      className="pt-20 pb-8"
    >
      <h1 className="sr-only">{project.title}</h1>

      <Grid>
        <GridItem span={12} tabletSpan={8} mobileSpan={4}>
          <span className="block font-mono text-xs uppercase tracking-[0.88px] text-text-tertiary mb-6 -entrance -fade -a-0">
            PRJ_{project.year} // {String(index + 1).padStart(3, '0')}
          </span>
        </GridItem>

        {/* Technologies left (4-col) + description right (8-col) */}
        <GridItem span={4} tabletSpan={8} mobileSpan={4}>
          {project.technologies && (
            <p
              className="text-[14px] font-medium leading-[1.5] uppercase tracking-[1.12px] text-text-tertiary -entrance -fade -a-1"
              style={{ fontFamily: 'var(--font-sans)' }}
            >
              {project.technologies}
            </p>
          )}
        </GridItem>
        <GridItem span={8} tabletSpan={8} mobileSpan={4}>
          {section.body && (
            <p
              className="text-[48px] leading-[1.15] tracking-[-0.96px] text-text-primary -entrance -fade -a-1"
              style={{ fontFamily: 'var(--font-sans)' }}
            >
              {section.body}
            </p>
          )}
        </GridItem>
      </Grid>
    </section>
  )
}

/** Hero image rendered separately — shell places navbar between text and image */
export function ProjectHeroImage({ project }: { project: ProjectItem }) {
  const imageRef = useInView()
  const { ref: expandRef, clipPath, opacity } = useScrollExpand()
  const heroImage = project.images[0]
  if (!heroImage) return null

  const hasGradient = !!project.colors

  return (
    <section ref={imageRef as React.RefObject<HTMLElement>} className="pb-16">
      <Grid>
        <GridItem span={12} tabletSpan={8} mobileSpan={4} className="-entrance -scale-in -a-2">
          {hasGradient ? (
            <div
              ref={expandRef as React.RefObject<HTMLDivElement>}
              className="relative overflow-hidden rounded-[var(--radius-component-md,12px)]"
            >
              {/* Noise gradient background — scroll-expand via clip-path */}
              <NoiseGradientCanvas
                colors={project.colors!}
                className="absolute inset-0 z-0"
                style={{ clipPath, opacity }}
              />
              {/* Hero image — 9/12 cols centered */}
              <div className="relative z-10 mx-auto w-[75%] py-[4%]">
                <div className="overflow-hidden rounded-[var(--radius-component-md,12px)]">
                  <img
                    src={heroImage.src}
                    alt={heroImage.title}
                    loading="eager"
                    className="w-full h-auto"
                  />
                </div>
              </div>
            </div>
          ) : (
            <div className="overflow-hidden rounded-[var(--radius-component-md,12px)]">
              <img
                src={heroImage.src}
                alt={heroImage.title}
                loading="eager"
                className="w-full h-auto"
              />
            </div>
          )}
        </GridItem>
      </Grid>
    </section>
  )
}
```

- [ ] **Step 2: Run dev server and verify visually**

```bash
cd /Users/caioogata/Projects/portolio-v1
pnpm dev
```

Open `http://localhost:3000/projects/azion-website` in browser. Verify:
1. Noise gradient canvas renders behind the hero image
2. Image is centered at ~75% width
3. Gradient peeks out on sides and top/bottom
4. Scrolling expands the gradient from center-bottom to full rect
5. Gradient has subtle breathing animation

- [ ] **Step 3: Verify backward compatibility**

Open a project without `colors` defined (e.g., `http://localhost:3000/projects/azion-console-kit`). Verify the hero image renders full-width at 12 columns, no canvas, no changes from current behavior.

- [ ] **Step 4: Commit**

```bash
git add src/components/sections/v2/project/ProjectHero.tsx
git commit -m "feat: integrate noise gradient background into ProjectHeroImage"
```

---

### Task 8: Build Verification

- [ ] **Step 1: Run production build**

```bash
cd /Users/caioogata/Projects/portolio-v1
pnpm build 2>&1 | tail -20
```

Expected: Build succeeds. The `next/dynamic` with `ssr: false` ensures Three.js doesn't break static export.

- [ ] **Step 2: Fix any build issues**

If Three.js causes SSR issues, verify that:
- `NoiseGradientCanvas` is only imported via `next/dynamic` with `{ ssr: false }`
- No direct imports of `three` or `@react-three/fiber` in any server component
- The `'use client'` directive is present on all three/* components

- [ ] **Step 3: Commit any fixes if needed**
