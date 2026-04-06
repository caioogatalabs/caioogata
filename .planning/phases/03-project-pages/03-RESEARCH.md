# Phase 3: Project Pages - Research

**Researched:** 2026-04-06
**Domain:** Next.js 15 dynamic routes, component-based page composition, image galleries, inter-project navigation
**Confidence:** HIGH

## Summary

Phase 3 creates dedicated project pages at `/projects/[slug]` using Next.js 15 App Router dynamic routes with `generateStaticParams` for static export compatibility. The existing data model in `en.json` provides project content (title, description, role, technologies, impact, credits, links, images) but needs schema extensions to support three gallery types and a component-based block composition system. All building blocks -- Grid/GridItem, useScrollReveal, useInView, entrance animations, semantic tokens -- are already implemented from Phase 2.

The primary technical challenge is designing the content model extension that maps each project to an ordered list of "blocks" (hero, challenge/solution, gallery-1, gallery-2, gallery-3, info-block, credits) while keeping it maintainable in a JSON file. The secondary challenge is the Gallery 2 parallax float effect, which requires a new rAF-based hook similar to the existing FloatingPreview lerp pattern but driven by scroll position instead of cursor position.

**Primary recommendation:** Extend `ProjectItem` in `types.ts` with a `sections` array that defines block order and configuration per project. Each block type maps to a React component. The page route renders blocks in sequence from the data.

<user_constraints>
## User Constraints (from CONTEXT.md)

### Locked Decisions
- **D-01:** Component-based composition -- project pages are assembled from reusable block components, not a fixed template. Each project defines which blocks to use and in what order.
- **D-02:** Hero always leads with display text (title) + image(s): either full-width 12-col OR two images in 6-6 split.
- **D-03:** Hero metadata: data-stamp (PRJ_YEAR // NNN), role, and technologies displayed alongside the title -- consistent with Home card pattern.
- **D-04:** Below hero: challenge/solution structure (inspired by fiddle.digital/work/tarotoo), then big impact numbers when available. All structured on the 12-col grid.
- **D-05:** Gallery 1 -- Staggered grid: Mixed column spans (12, 6-6, 4-4-4) within the site's column system. Each image reveals with scroll-linked clip-path expansion (reuse useScrollReveal).
- **D-06:** Gallery 2 -- Feature list: Vertical stack in 3-6-3 grid layout. Feature/screen name on left (3-col), image centered (6-col), description on right (3-col). Scroll-reveal + parallax float on image.
- **D-07:** Gallery 3 -- Full detail: Generous showcase block (1+ viewport height). Large image with extended text description alongside. Editorial treatment.
- **D-08:** No lightbox/modal on image click -- images are large enough inline.
- **D-09:** Navigation bar below hero/intro AND at end of content. If one is sticky, a single sticky bar at top suffices.
- **D-10:** Back/Esc + arrow key navigation, consistent with Phase 2 keyboard nav (useMenuNavigation pattern).
- **D-11:** At last project, "next" becomes "Back to Home". At first project, "prev" is hidden or "Back to Home".
- **D-12:** Info block at bottom after galleries. Grid list (dark bar layout: Project, Client/Role, Technologies, Year, Links).
- **D-13:** Credits (team members with LinkedIn links) in footer section after info block.
- **D-14:** DEFERRED page transitions -- use same entrance system as Home (fade + slide-up, gated behind -loaded -ready).

### Claude's Discretion
- Content model extensions for 3 gallery types (how to specify which gallery type per image group in en.json)
- Responsive behavior of Gallery 2 (3-6-3) on mobile -- likely stacks vertically
- Exact parallax implementation for Gallery 2 image float (rAF approach similar to FloatingPreview)
- Static params generation from en.json project slugs

### Deferred Ideas (OUT OF SCOPE)
- Custom page transition (card morph, clip-path reveal)
- Video embeds in galleries -- start with static images only
- Per-project color theming (accent color per project)
</user_constraints>

<phase_requirements>
## Phase Requirements

| ID | Description | Research Support |
|----|-------------|------------------|
| PROJ-01 | Dedicated routes at `/projects/[slug]` with hero image and scroll layout | Dynamic route with `generateStaticParams`, hero block component, entrance animation system |
| PROJ-02 | Project content rendered from existing `en.json` data model | Extended `ProjectItem` type with `sections` array, block-to-component mapping |
| PROJ-03 | Image gallery with responsive grid layout (no canvas viewer) | Three gallery types (staggered, feature-list, full-detail) using Grid/GridItem + useScrollReveal |
</phase_requirements>

## Project Constraints (from CLAUDE.md)

- **Static export**: `output: 'export'` in production -- `generateStaticParams` is REQUIRED for dynamic `[slug]` routes
- **No WebGL**: CSS/JS animations only
- **CSS-first animation**: rAF only for scroll-linked effects and cursor-follow
- **12-column grid**: All layouts use column spans (6-6, 4-4-4, 3-6-3, 2-8-2)
- **Semantic tokens**: Always use `text-text-primary`, `bg-bg-surface-primary` etc. Never raw hex/oklch
- **Font family**: `style={{ fontFamily: 'var(--font-sans)' }}` for Fabio XM, `font-mono` for Cascadia Mono
- **Radius**: 12px for components, 999px for pills, 0px eliminated
- **Shadows**: None -- depth via tonal stacking only
- **prefers-reduced-motion**: All motion disabled
- **GridItem**: Static Tailwind class maps (not dynamic template literals)
- **Entrance system**: `-entrance -slide-up` triggered by `-inview` class, gated behind `html.-loaded.-ready`

## Standard Stack

### Core (already installed)
| Library | Purpose | Why Standard |
|---------|---------|--------------|
| Next.js 15 (App Router) | Dynamic routes, `generateStaticParams`, metadata API | Already in use |
| React 19 | Component rendering | Already in use |
| Tailwind CSS v4 | Styling with semantic tokens | Already in use |

### Supporting (already in project)
| Library | Purpose | When to Use |
|---------|---------|-------------|
| Grid/GridItem | 12-col responsive layout | All gallery layouts, hero, info block |
| useScrollReveal | Scroll-linked clip-path reveal | Gallery 1 images, Gallery 2 images |
| useInView | IntersectionObserver entrance trigger | Section-level entrance animations |
| useMenuNavigation | Keyboard nav (arrows/enter/esc) | Inter-project navigation (adapt) |

### No New Dependencies
This phase requires zero new npm packages. Everything builds on existing project infrastructure.

## Architecture Patterns

### New File Structure
```
src/app/projects/[slug]/
  page.tsx                              -> Dynamic route with generateStaticParams + metadata
src/components/sections/v2/project/
  ProjectPageShell.tsx                  -> Orchestrates blocks from sections data
  ProjectHero.tsx                       -> Hero: title, data-stamp, role, tech, image(s)
  ProjectChallenge.tsx                  -> Challenge/solution text block
  ProjectImpact.tsx                     -> Big impact numbers display
  ProjectGalleryStaggered.tsx           -> Gallery 1: mixed-span grid with scroll-reveal
  ProjectGalleryFeatureList.tsx         -> Gallery 2: 3-6-3 with parallax float
  ProjectGalleryFullDetail.tsx          -> Gallery 3: editorial showcase block
  ProjectInfoBlock.tsx                  -> Bottom info grid (dark bar)
  ProjectCredits.tsx                    -> Team credits with LinkedIn links
  ProjectNavigation.tsx                 -> Prev/Next navigation bar
src/hooks/
  useScrollParallax.ts                  -> New: scroll-driven parallax float for Gallery 2
```

### Pattern 1: generateStaticParams for Static Export

Next.js 15 with `output: 'export'` requires `generateStaticParams` for dynamic routes. All slugs must be known at build time.

```typescript
// src/app/projects/[slug]/page.tsx
import content from '@/content/en.json'

export function generateStaticParams() {
  return content.projects.items
    .filter((p) => !p.disabled)
    .map((p) => ({ slug: p.slug }))
}
```

**Confidence: HIGH** -- This is the standard Next.js 15 pattern for static export with dynamic routes. Already used conceptually in ProjectCard links.

### Pattern 2: Per-Page Metadata via generateMetadata

Next.js 15 metadata API supports dynamic metadata per route. Each project page gets unique OG tags.

```typescript
// src/app/projects/[slug]/page.tsx
import type { Metadata } from 'next'

export async function generateMetadata(
  { params }: { params: Promise<{ slug: string }> }
): Promise<Metadata> {
  const { slug } = await params
  const project = content.projects.items.find((p) => p.slug === slug)
  if (!project) return {}

  const firstImage = project.images.find((img) => img.src)
  return {
    title: `${project.title} - Caio Ogata`,
    description: project.description.slice(0, 160),
    openGraph: {
      title: `${project.title} - Caio Ogata`,
      description: project.description.slice(0, 160),
      images: firstImage?.src
        ? [{ url: `https://www.caioogata.com${firstImage.src}`, width: 1200, height: 630 }]
        : [],
      type: 'article',
    },
    twitter: {
      card: 'summary_large_image',
      title: `${project.title} - Caio Ogata`,
      images: firstImage?.src ? [`https://www.caioogata.com${firstImage.src}`] : [],
    },
  }
}
```

**IMPORTANT: Next.js 15 breaking change** -- `params` is now a Promise and must be awaited. This differs from Next.js 14 where params was a plain object. The `await params` pattern is required.

**Confidence: HIGH** -- Standard Next.js 15 metadata API pattern.

### Pattern 3: Component-Based Block Composition

Each project defines an ordered list of sections. The page shell maps section types to components.

```typescript
// Recommended data model extension
interface ProjectSection {
  type: 'hero' | 'challenge' | 'impact' | 'gallery-staggered' | 'gallery-feature-list' | 'gallery-full-detail'
  // type-specific data varies
  content?: {
    heading?: string
    body?: string
    // ... varies by type
  }
  images?: ProjectSectionImage[]
  layout?: string  // e.g., '12' | '6-6' | '4-4-4' for gallery-staggered rows
}

interface ProjectSectionImage {
  src: string
  title: string
  description?: string  // for Gallery 2 feature descriptions
  featureName?: string  // for Gallery 2 left-column label
}
```

The page shell renders:
```typescript
function ProjectPageShell({ project }: { project: ProjectItem }) {
  return (
    <>
      {project.sections.map((section, i) => {
        switch (section.type) {
          case 'hero': return <ProjectHero key={i} project={project} section={section} />
          case 'challenge': return <ProjectChallenge key={i} section={section} />
          case 'gallery-staggered': return <ProjectGalleryStaggered key={i} section={section} />
          // ...
        }
      })}
      <ProjectInfoBlock project={project} />
      <ProjectCredits project={project} />
      <ProjectNavigation currentSlug={project.slug} />
    </>
  )
}
```

**Confidence: HIGH** -- Standard composition pattern. The info block, credits, and navigation are always present (not configurable per project).

### Pattern 4: Scroll-Driven Parallax Float (Gallery 2)

A new hook for subtle vertical parallax on Gallery 2 images. Similar to useScrollReveal but produces a translateY offset instead of clip-path.

```typescript
// src/hooks/useScrollParallax.ts
export function useScrollParallax({ factor = 0.1 } = {}) {
  const ref = useRef<HTMLElement>(null)
  const [transform, setTransform] = useState('translateY(0px)')
  const tickingRef = useRef(false)

  const update = useCallback(() => {
    const el = ref.current
    if (!el) return
    const rect = el.getBoundingClientRect()
    const vh = window.innerHeight
    // Center of element relative to viewport center
    const center = rect.top + rect.height / 2 - vh / 2
    const offset = center * factor * -1
    setTransform(`translateY(${offset}px)`)
    tickingRef.current = false
  }, [factor])

  useEffect(() => {
    // Check reduced motion, add scroll listener (same pattern as useScrollReveal)
    // ...
  }, [update])

  return { ref, transform }
}
```

The image container has `overflow: hidden` and the image inside uses the transform. This creates a subtle "float" as the user scrolls -- the image drifts slightly within its frame.

**Confidence: HIGH** -- Direct adaptation of the existing useScrollReveal pattern.

### Pattern 5: Inter-Project Navigation

Projects array from `en.json` defines order. Navigation component computes prev/next.

```typescript
const enabledProjects = content.projects.items.filter(p => !p.disabled)
const currentIndex = enabledProjects.findIndex(p => p.slug === currentSlug)
const prev = currentIndex > 0 ? enabledProjects[currentIndex - 1] : null
const next = currentIndex < enabledProjects.length - 1 ? enabledProjects[currentIndex + 1] : null
// D-11: At boundaries, link goes to Home instead of looping
```

Keyboard navigation uses a simplified version of useMenuNavigation -- only Left/Right arrows + Escape (back to Home).

**Confidence: HIGH** -- Straightforward array navigation.

### Anti-Patterns to Avoid
- **Dynamic template literals for Tailwind spans:** Always use the static MOBILE_SPAN/TABLET_SPAN/DESKTOP_SPAN maps from Grid.tsx
- **Server-side features in pages:** Static export means no `cookies()`, `headers()`, or server actions in page components
- **Hardcoded colors:** Always use semantic tokens. Even in the info block dark bar, use `data-theme` attributes
- **Custom scroll libraries:** No Lenis, Locomotive, or smooth-scroll. Native scroll only.

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Scroll-linked reveal | Custom IntersectionObserver per image | `useScrollReveal` hook | Already tested, handles reduced-motion, rAF-throttled |
| Entrance animations | JS-driven opacity/transform | CSS `-entrance -slide-up` + `-inview` class | Established system from Phase 2, stagger delays included |
| 12-col grid | Custom CSS grid per component | `Grid` + `GridItem` components | Static class maps, responsive breakpoints handled |
| Keyboard navigation | Manual event listeners | Adapt `useMenuNavigation` | Handles arrow keys, escape, focus management |
| Section theming | Manual color overrides | `data-theme="light"` attribute on container | Semantic tokens remap automatically |

## Common Pitfalls

### Pitfall 1: Missing generateStaticParams
**What goes wrong:** Build fails with "Page with dynamic route is not generating static params"
**Why it happens:** `output: 'export'` requires all dynamic routes to declare their params at build time
**How to avoid:** Always export `generateStaticParams` from `page.tsx` in `[slug]` directory
**Warning signs:** Build errors mentioning "dynamic page" or "static params"

### Pitfall 2: Next.js 15 Params as Promise
**What goes wrong:** Runtime error accessing `params.slug` directly
**Why it happens:** Next.js 15 changed `params` to be async (Promise-based) in `generateMetadata` and page components
**How to avoid:** Always `const { slug } = await params` before accessing slug
**Warning signs:** TypeScript error about Promise type, runtime "params is a Promise" error

### Pitfall 3: Tailwind Dynamic Class Purging
**What goes wrong:** Grid column classes don't render (invisible layout)
**Why it happens:** Template literal class names like `col-span-${n}` are purged by Tailwind
**How to avoid:** Use GridItem component with its static MOBILE_SPAN/TABLET_SPAN/DESKTOP_SPAN maps. Never construct Tailwind classes dynamically.
**Warning signs:** Missing columns, elements at wrong widths

### Pitfall 4: Static Export with API Routes
**What goes wrong:** OG image generation that depends on server-side rendering won't work
**Why it happens:** `output: 'export'` generates HTML at build time only
**How to avoid:** Use static OG images from `public/projects/{slug}/` directory. The `generateMetadata` approach with existing WebP images is sufficient.
**Warning signs:** 404 on OG image URLs in social previews

### Pitfall 5: Image Paths in Static Export
**What goes wrong:** Images 404 after deployment
**Why it happens:** Relative paths or missing leading `/` in image src
**How to avoid:** All image paths start with `/projects/` (matching `public/projects/` directory). Use `next/image` with `unoptimized: true` (already configured) or plain `<img>` tags.
**Warning signs:** Broken images in production but working in dev

### Pitfall 6: Gallery Staggered Grid Row Configuration
**What goes wrong:** Each project needs different image arrangements (some full-width, some 6-6, some 4-4-4)
**Why it happens:** Gallery 1 is not a uniform grid -- it's a composed layout with intentional size differences
**How to avoid:** Model staggered gallery rows in en.json as arrays with explicit span configurations per row, e.g. `rows: [{ spans: [12] }, { spans: [6, 6] }, { spans: [4, 4, 4] }]`
**Warning signs:** All images same size, monotonous grid

## Code Examples

### Dynamic Route Page Component
```typescript
// src/app/projects/[slug]/page.tsx
import content from '@/content/en.json'
import type { Content } from '@/content/types'
import { ProjectPageShell } from '@/components/sections/v2/project/ProjectPageShell'
import { notFound } from 'next/navigation'

const typedContent = content as unknown as Content

export function generateStaticParams() {
  return typedContent.projects.items
    .filter((p) => !p.disabled)
    .map((p) => ({ slug: p.slug }))
}

export default async function ProjectPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const project = typedContent.projects.items.find((p) => p.slug === slug)
  if (!project || project.disabled) notFound()

  return (
    <main id="main-content">
      <ProjectPageShell project={project} />
    </main>
  )
}
```

### Gallery 2 Feature List Row
```typescript
// Single feature row in 3-6-3 layout
<Grid>
  <GridItem span={3} tabletSpan={8} mobileSpan={4}>
    <p className="font-mono text-sm text-text-secondary uppercase tracking-wider">
      {feature.name}
    </p>
  </GridItem>
  <GridItem span={6} tabletSpan={8} mobileSpan={4}>
    <div className="overflow-hidden rounded-[12px]">
      <img
        ref={parallaxRef}
        src={feature.image.src}
        alt={feature.image.title}
        style={{ transform: parallaxTransform }}
        className="w-full h-auto transition-transform duration-0"
      />
    </div>
  </GridItem>
  <GridItem span={3} tabletSpan={8} mobileSpan={4}>
    <p className="text-sm text-text-secondary">
      {feature.description}
    </p>
  </GridItem>
</Grid>
```

Note: On mobile, Gallery 2 stacks vertically -- all three columns become `mobileSpan={4}` (full width). Feature name above image, description below.

### Inter-Project Navigation Bar
```typescript
<nav className="flex items-center justify-between px-5 md:px-8 lg:px-16 py-6 border-t border-border-primary">
  {prev ? (
    <a href={`/projects/${prev.slug}`} className="font-mono text-sm text-text-secondary hover:text-text-primary transition-colors">
      <span aria-hidden="true">&larr;</span> {prev.title}
    </a>
  ) : (
    <a href="/" className="font-mono text-sm text-text-secondary hover:text-text-primary transition-colors">
      <span aria-hidden="true">&larr;</span> Back to Home
    </a>
  )}
  {next ? (
    <a href={`/projects/${next.slug}`} className="font-mono text-sm text-text-secondary hover:text-text-primary transition-colors">
      {next.title} <span aria-hidden="true">&rarr;</span>
    </a>
  ) : (
    <a href="/" className="font-mono text-sm text-text-secondary hover:text-text-primary transition-colors">
      Back to Home <span aria-hidden="true">&rarr;</span>
    </a>
  )}
</nav>
```

## Content Model Extension Recommendation

The current `ProjectItem` type needs extension. Recommended approach:

### New Types (add to types.ts)

```typescript
// Gallery row configuration for staggered grid
interface GalleryRow {
  spans: number[]  // e.g., [12] or [6, 6] or [4, 4, 4]
  images: string[] // indices into section's images array, or direct src paths
}

// A composable section within a project page
interface ProjectSection {
  type: 'hero' | 'challenge' | 'impact' | 'gallery-staggered' | 'gallery-feature-list' | 'gallery-full-detail'
  heading?: string
  body?: string
  // For challenge type: separate challenge + solution text
  challenge?: string
  solution?: string
  // For impact type
  stats?: Array<{ value: string; label: string }>
  // For gallery-staggered
  rows?: GalleryRow[]
  // For gallery-feature-list
  features?: Array<{
    name: string
    image: ProjectImage
    description: string
  }>
  // For gallery-full-detail
  image?: ProjectImage
  description?: string
}

// Extended ProjectItem (add to existing)
interface ProjectItem {
  // ... existing fields stay
  sections?: ProjectSection[]  // ordered list of blocks
  year?: string                // explicit year for data-stamp (currently hardcoded in yearMap)
}
```

### en.json Extension Pattern

```json
{
  "title": "Azion Website & Brand Expansion",
  "slug": "azion-website",
  "year": "2022",
  "sections": [
    {
      "type": "hero",
      "body": "A brand adaptation that evolved Azion's digital presence..."
    },
    {
      "type": "challenge",
      "challenge": "Azion needed to expand its visual identity without breaking...",
      "solution": "We evolved the existing system by introducing..."
    },
    {
      "type": "impact",
      "stats": [
        { "value": "100+", "label": "edge locations" },
        { "value": "20k+", "label": "hosted applications" }
      ]
    },
    {
      "type": "gallery-staggered",
      "rows": [
        { "spans": [12], "images": ["/projects/azion-website/home-en-hero.webp"] },
        { "spans": [6, 6], "images": ["/projects/azion-website/home-reliable-zoom.webp", "/projects/azion-website/home-products-menu-zoom.webp"] },
        { "spans": [4, 4, 4], "images": ["/projects/azion-website/functions-hero-zoom.webp", "/projects/azion-website/cache-hero.webp", "/projects/azion-website/marketplace-hero.webp"] }
      ]
    },
    {
      "type": "gallery-feature-list",
      "features": [
        {
          "name": "Product Navigation",
          "image": { "src": "/projects/azion-website/home-products-menu-zoom.webp", "title": "Menu Open" },
          "description": "Mega-menu revealing product categories..."
        }
      ]
    }
  ]
}
```

**Key insight:** The `images` array on `ProjectItem` can remain for backward compatibility (Home page ProjectCard thumbnail, OG image selection), while `sections` provides the structured layout for the project page.

## Inventory of Existing Project Assets

| Project Slug | Images Available | Videos | Figma Embeds | Disabled |
|-------------|-----------------|--------|--------------|----------|
| azion-website | 10 webp | 0 | 1 | No |
| azion-console-kit | 2 webp | 1 YouTube | 2 | No |
| azion-design-system | 0 webp | 0 | 2 Figma only | No |
| azion-brand-system | 20 webp | 0 | 0 | No |
| huia | 4 webp | 7 videos | 0 | No |
| brand-oboticario | 0 | 0 | 0 | Yes (disabled) |
| product-petrobras | 0 | 0 | 0 | Yes (disabled) |

**Note:** D-14 defers video embeds -- start with static images only. Projects with only Figma embeds (azion-design-system) will need placeholder handling or simplified gallery layouts.

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| `params: { slug: string }` | `params: Promise<{ slug: string }>` | Next.js 15 | Must await params in page components and generateMetadata |
| `getStaticPaths` | `generateStaticParams` | Next.js 13+ (App Router) | Simpler API, returns array of param objects |
| Metadata in `<Head>` | `generateMetadata` export | Next.js 13+ | Type-safe metadata, async capable |

## Open Questions

1. **Challenge/solution content source**
   - What we know: D-04 specifies challenge/solution structure. Current `en.json` only has `description` and `impact` fields.
   - What's unclear: Whether to write new challenge/solution text per project or derive from existing description.
   - Recommendation: Add `challenge` and `solution` fields to the `sections` data. Content authoring happens during implementation -- planner should scope a content-writing task.

2. **Azion Design System gallery**
   - What we know: This project has zero webp images -- only 2 Figma embeds.
   - What's unclear: Whether to embed Figma iframes (D-14 defers video but doesn't mention Figma), create screenshots, or skip gallery for this project.
   - Recommendation: For Phase 3 launch, treat Figma embeds as a future enhancement. Use a simplified layout with the project description as the primary content. The `disabled` pattern already exists for placeholder projects.

3. **Hero image selection**
   - What we know: D-02 says hero leads with image(s), either 12-col or 6-6 split.
   - What's unclear: Which image(s) per project are the hero images.
   - Recommendation: Add a `heroImages` field or use the first 1-2 images from the hero section definition. Let the sections data control this.

## Sources

### Primary (HIGH confidence)
- `src/content/types.ts` -- Current TypeScript types for ProjectItem, ProjectImage, ProjectCredit
- `src/content/en.json` -- Current content data model with 7 projects (5 enabled, 2 disabled)
- `src/hooks/useScrollReveal.ts` -- Existing scroll-linked clip-path reveal pattern
- `src/hooks/useMenuNavigation.ts` -- Existing keyboard navigation pattern
- `src/components/layout/Grid.tsx` -- 12-col grid with static Tailwind class maps
- `src/app/layout.tsx` -- Metadata pattern, Schema.org JSON-LD pattern
- `next.config.ts` -- Current config (images.unoptimized: true, no output: 'export' yet in dev)
- `docs/v2/fiddle-digital-extraction.md` -- Animation system reference

### Secondary (MEDIUM confidence)
- Next.js 15 App Router dynamic routes documentation -- `generateStaticParams` and `generateMetadata` patterns verified against project's existing Next.js 15 setup

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH -- zero new dependencies, everything builds on Phase 2
- Architecture: HIGH -- patterns are direct extensions of existing code (Grid, useScrollReveal, entrance system)
- Content model: HIGH -- straightforward JSON schema extension, types already defined
- Gallery parallax: HIGH -- adaptation of existing rAF patterns (FloatingPreview, useScrollReveal)
- Pitfalls: HIGH -- all identified from direct codebase analysis and Next.js 15 known changes

**Research date:** 2026-04-06
**Valid until:** 2026-05-06 (stable -- no fast-moving dependencies)
