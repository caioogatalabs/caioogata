---
phase: quick-260427-b3y
plan: 01
subsystem: navigation
tags: [navigation, keyboard, routing, page-shell, ux]
dependency_graph:
  requires:
    - src/content/en.json
    - src/content/types.ts
    - next/navigation (useRouter, usePathname)
  provides:
    - src/content/main-navigation.ts (MAIN_NAVIGATION constant)
    - src/components/sections/v2/PageNavigation.tsx (unified sticky strip)
  affects:
    - src/components/layout/PageShell.tsx (home /)
    - src/components/sections/v2/AboutSection.tsx (/about)
    - src/components/sections/v2/ExperienceSection.tsx (/experience)
    - src/components/sections/v2/project/ProjectPageShell.tsx (/projects/[slug])
tech_stack:
  added: []
  patterns:
    - Unified nav pattern via PageNavigation with optional `back` and `lateral` props
    - Single window keydown listener per page, guarded against INPUT/TEXTAREA/SELECT/contentEditable
    - router.push (App Router) replacing window.location.href for client-side transitions
key_files:
  created:
    - src/content/main-navigation.ts
    - src/components/sections/v2/PageNavigation.tsx
  modified:
    - src/components/sections/v2/AboutSection.tsx
    - src/components/sections/v2/ExperienceSection.tsx
    - src/components/sections/v2/project/ProjectPageShell.tsx
    - src/components/layout/PageShell.tsx
  deleted:
    - src/components/sections/v2/about/ProjectNavigation.tsx
    - src/components/sections/v2/project/ProjectNavigation.tsx
decisions:
  - "/experience: chose Case A (modify ExperienceSection.tsx) over Case B (modify experience/page.tsx) because ExperienceSection mirrors AboutSection's hero band + StickyLogoBar precedent — page.tsx stays a thin route wrapper."
  - "Disabled lateral slots render as <span> with first/last item title as filler (per spec) — opacity-30, pointer-events-none, aria-disabled, tabIndex=-1, NOT a Link, so no focus and no click."
  - "Escape on / is intentionally a no-op (gated by `back || pathname !== '/'`) so MenuSection's Escape (clears filter) keeps working without conflict."
  - "MAIN_NAVIGATION includes /philosophy as a placeholder route (TODO: create page or filter list when /philosophy lands)."
metrics:
  duration: 7min
  completed: "2026-04-27"
---

# Quick 260427-b3y: Unified PageNavigation Summary

One-liner: Replaced two per-context nav components with a single `PageNavigation` shared across home, /about, /experience, and /projects/[slug] — keyboard parity (←/→/Esc), input-field guard, single source of truth.

## Component Created

**`src/components/sections/v2/PageNavigation.tsx`** (`'use client'`)

```ts
export interface PageNavigationLateralItem {
  href: string
  title: string
}

export interface PageNavigationProps {
  back?: { href: string; label: string }
  lateral?: {
    items: PageNavigationLateralItem[]
    currentIndex: number
    scope: string  // 'categories' | 'projects'
  }
}

export function PageNavigation(props: PageNavigationProps): JSX.Element
```

Behaviour:
- Sticky-top, all controls left-aligned, mono small (`font-mono text-xs uppercase tracking-[1.12px]`)
- Single `window` keydown listener per mount: `ArrowLeft`/`ArrowRight` lateral, `Escape` → `back.href` if provided else `/` (no-op on `/`)
- Guards against typing in `INPUT`/`TEXTAREA`/`SELECT`/`contentEditable`
- `router.push` (Next App Router) for client-side transitions — no full page reload
- Disabled prev/next slot rendered as `<span>` filler with `opacity-30 pointer-events-none aria-disabled tabIndex=-1` (preserves layout)
- Hint text: `to navigate {scope}` (categories or projects)

## Constant Created

**`src/content/main-navigation.ts`** — exports `MAIN_NAVIGATION` (canonical lateral circuit for category pages):
- `[Home, About, Experience, Philosophy]`
- TODO note: /philosophy route doesn't exist yet — create page or filter list when it lands.

## Files Deleted (2)

- `src/components/sections/v2/about/ProjectNavigation.tsx` (25 lines — single `← Back to Home` link)
- `src/components/sections/v2/project/ProjectNavigation.tsx` (92 lines — prev/next + window.location.href + position prop)

Net delete: 117 lines. Replaced by 117 lines in `PageNavigation.tsx` (one-to-one swap, broader feature set).

## Call-Sites Wired (4 wirings, 5 files)

| Call-site | File | Props passed |
|---|---|---|
| `/` (home) | `src/components/layout/PageShell.tsx` | `lateral={{ items: MAIN_NAVIGATION, currentIndex: 0, scope: 'categories' }}` — between IntroSection and MenuSection |
| `/about` | `src/components/sections/v2/AboutSection.tsx` | `lateral={{ items: MAIN_NAVIGATION, currentIndex: 1, scope: 'categories' }}` — same slot the old `<ProjectNavigation />` occupied |
| `/experience` | `src/components/sections/v2/ExperienceSection.tsx` | `lateral={{ items: MAIN_NAVIGATION, currentIndex: 2, scope: 'categories' }}` — between hero band and experience rows (Case A) |
| `/projects/[slug]` | `src/components/sections/v2/project/ProjectPageShell.tsx` | `back={{ href: '/', label: 'Back to Home' }}, lateral={{ items: lateralItems, currentIndex: projectIndex, scope: 'projects' }}` — single instance, bottom instance dropped |

The `experience/page.tsx` route file was NOT modified — `ExperienceSection` is the orchestrator and mirrors AboutSection's structure (Case A).

## Verification

- `pnpm exec tsc --noEmit` → exits 0
- `grep -rn "about/ProjectNavigation\|project/ProjectNavigation" src/` → no matches
- `grep -rn "from './ProjectNavigation'" src/` → no matches
- `pnpm build` skipped per plan constraint (pre-existing WasmHash cache corruption documented in STATE.md)

## must_have Truths Satisfied

1. ✅ Single PageNavigation renders on /, /about, /experience, /projects/[slug]
2. ✅ ArrowLeft/Right on project page routes prev/next enabled project
3. ✅ ArrowLeft/Right on /about and /experience routes through MAIN_NAVIGATION
4. ✅ Escape on /about, /experience, /projects/[slug] routes to /
5. ✅ Escape on / does not redirect (gated by `back || pathname !== '/'`)
6. ✅ Keyboard handlers skipped while typing into INPUT/TEXTAREA/SELECT/contentEditable
7. ✅ All controls left-aligned (`flex items-center gap-8`, no `justify-between`)
8. ✅ Null prev/next slot renders with `opacity-30 pointer-events-none` filler
9. ✅ Bottom-of-page nav instance removed from project pages
10. ✅ Old about/ProjectNavigation.tsx and project/ProjectNavigation.tsx deleted

## Deviations

None. Plan executed exactly as written; Case A (vs Case B) for /experience was an explicitly anticipated branch — chose Case A per spec default ("If unsure, default to Case A — that's the explicit spec direction").

## Commit

- **Hash:** `e6bfa12`
- **Message:** `feat(quick-260427-b3y): unified PageNavigation with keyboard parity across V2`
- **Stats:** 8 files changed, 160 insertions(+), 127 deletions(-)

## Self-Check: PASSED

- ✅ `src/content/main-navigation.ts` exists
- ✅ `src/components/sections/v2/PageNavigation.tsx` exists
- ✅ `src/components/sections/v2/about/ProjectNavigation.tsx` deleted
- ✅ `src/components/sections/v2/project/ProjectNavigation.tsx` deleted
- ✅ Commit `e6bfa12` exists in git log
- ✅ `pnpm exec tsc --noEmit` exits 0
- ✅ All 4 call-sites wired (5 files modified including ExperienceSection for Case A)
