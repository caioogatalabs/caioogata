---
phase: quick
plan: 260415-qcl
subsystem: layout/grid
tags: [react-19, typescript, build-fix, vercel]
one_liner: "Remove unused polymorphic `as` prop from Grid/GridItem to unblock React 19 + Vercel v2 preview build"
requires: []
provides:
  - "Grid + GridItem typed against HTMLDivElement (no polymorphic ElementType)"
  - "pnpm build passing under React 19 strict types"
affects:
  - "src/components/layout/Grid.tsx"
tech_added: []
patterns:
  - "YAGNI: drop unused polymorphic API rather than band-aid `any` cast"
  - "Forward refs typed to concrete HTMLDivElement"
key_files_created: []
key_files_modified:
  - src/components/layout/Grid.tsx
decisions:
  - "Hardcode <div> instead of refactoring to React 19 polymorphic helper — no call site uses `as=` or `ref`"
  - "Relax `children` to optional on GridProps/GridItemProps so spacer <GridItem /> usages type-check"
metrics:
  duration_min: ~5
  tasks_completed: 2
  files_modified: 1
completed: 2026-04-15
---

# Quick 260415-qcl: Fix Grid polymorphic type error (React 19) Summary

## Objective

Unblock the Vercel preview deploy on branch `v2` by fixing a React 19 TypeScript error in `src/components/layout/Grid.tsx`. The original code used a polymorphic `as?: ElementType` prop against `HTMLAttributes<HTMLElement>` + `forwardRef<HTMLElement>`, which under React 19's stricter `ElementType` resolves `children` to `never` for void elements (img/br/input), producing a TS error at `<Tag>{children}</Tag>`.

Since no call site uses `as=` or `ref` on Grid/GridItem (YAGNI per CLAUDE.md), the fix is to hardcode `<div>` and type the refs as `HTMLDivElement`.

## Changes

### `src/components/layout/Grid.tsx` (commit `197a08f`)

1. Removed `ElementType` import.
2. `GridProps`: `HTMLAttributes<HTMLElement>` → `HTMLAttributes<HTMLDivElement>`, removed `as?: ElementType`, relaxed `children` to optional.
3. `GridItemProps`: same three changes.
4. `Grid`: `forwardRef<HTMLElement, …>` → `forwardRef<HTMLDivElement, …>`, removed `as: Tag = 'div'` destructure, replaced `<Tag>…</Tag>` with `<div>…</div>`.
5. `GridItem`: same four changes as `Grid`.

Net diff: `1 file changed, 13 insertions(+), 15 deletions(-)`.

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 1 - Bug / Rule 3 - Blocker] Relaxed `children` to optional on Grid/GridItem props**

- **Found during:** Task 1 `pnpm build` verification.
- **Issue:** With the polymorphic `ElementType` bug removed, a previously-masked latent type error surfaced: `ProjectImpact.tsx:40` uses `<GridItem span={3} … />` as a self-closing spacer, but `GridItemProps.children` was declared required (`children: ReactNode`). Under React 19 + Next 15 type-check, this failed:
  > Property 'children' is missing in type '{ … }' but required in type 'GridItemProps'.
- **Fix:** Changed `children: ReactNode` → `children?: ReactNode` on both `GridProps` and `GridItemProps`. This matches the intent (spacer `<GridItem />` is a legitimate pattern) and the behavior of the underlying `HTMLAttributes`.
- **Files modified:** `src/components/layout/Grid.tsx` (already in-scope for this plan).
- **Commit:** `197a08f` (rolled into the same Task 1 commit since it's the same file and the same root cause — React 19 strict typing on Grid).
- **Rationale:** The plan's success criteria explicitly require `pnpm build` to pass locally. This was the only remaining blocker after the `as` prop removal, and it's directly within the scope of `Grid.tsx`. No band-aid; the fix matches actual usage.

## Verification Results

### Automated

- **`pnpm build`** — PASS. Compiled successfully in 1.58s, types validated, 26/26 static pages generated, postbuild webpack patch ran.
- **`grep -n "ElementType\|as?:" src/components/layout/Grid.tsx`** — 0 matches (confirmed).
- **`grep -n "HTMLDivElement" src/components/layout/Grid.tsx`** — 2 matches at both `forwardRef` call sites (confirmed).

### Call-site impact

Zero changes required at any call site. All six verified consumers (`ProjectHero`, `ProjectChallenge`, `ProjectImpact`, `ProjectInfoBlock`, `ProjectGalleryFeatureList`, `ProjectGalleryFullDetail`) compile and render identically — rendered DOM is unchanged (`<div>` → `<div>`).

## Commits

| Task | Description | Commit |
| ---- | ----------- | ------ |
| 1+2  | fix(grid): remove unused polymorphic `as` prop for React 19 compat | `197a08f` |

Tasks 1 and 2 were combined into a single commit because the plan's Task 2 specified committing only `src/components/layout/Grid.tsx` (the single file touched in Task 1), with no intermediate verification artifact. Pushed to `origin/v2` successfully:

```
To github.com:caioogatalabs/caioogata.git
   1a23809..197a08f  v2 -> v2
```

Vercel will pick up the push and retrigger the preview deploy automatically.

## Success Criteria

- [x] TypeScript build passes locally (`pnpm build`)
- [x] Grid.tsx has no polymorphic `as` API, no `ElementType` import
- [x] Commit pushed to `origin/v2` (`197a08f`)
- [ ] Vercel preview deploy for `v2` succeeds on next build (not gating — monitor externally)
- [x] Zero changes to any call site — rendered DOM identical

## Self-Check: PASSED

- FOUND: `src/components/layout/Grid.tsx` (modified)
- FOUND: `.planning/quick/260415-qcl-fix-grid-polymorphic-type-error-react-19/260415-qcl-SUMMARY.md` (this file)
- FOUND: commit `197a08f` in `git log`
- FOUND: `HTMLDivElement` appears 2x in Grid.tsx
- CONFIRMED: no `ElementType` or `as?:` in Grid.tsx
- CONFIRMED: `pnpm build` exits 0
