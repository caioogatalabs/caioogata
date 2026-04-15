---
phase: quick
plan: 260415-qcl
type: execute
wave: 1
depends_on: []
files_modified:
  - src/components/layout/Grid.tsx
autonomous: true
requirements:
  - QCL-260415-01
must_haves:
  truths:
    - "pnpm build completes without TypeScript errors"
    - "Grid and GridItem render as plain divs at all existing call sites"
    - "Vercel preview deploy for branch v2 succeeds after push"
  artifacts:
    - path: "src/components/layout/Grid.tsx"
      provides: "Grid + GridItem div wrappers (no polymorphic as prop)"
      contains: "forwardRef<HTMLDivElement"
  key_links:
    - from: "src/components/layout/Grid.tsx"
      to: "React 19 type system"
      via: "HTMLDivElement ref + hardcoded div element"
      pattern: "forwardRef<HTMLDivElement"
---

<objective>
Fix the Vercel preview deploy failure on branch `v2` caused by a React 19 TypeScript error in `Grid.tsx`. Remove the unused polymorphic `as` prop (YAGNI) so the component compiles cleanly under React 19's stricter `ElementType`.

Purpose: Unblock V2 preview deploy. No call site uses `as=` or `ref`, so removing the polymorphic API has zero blast radius and aligns with CLAUDE.md's "don't design for hypothetical future requirements."

Output: A Grid.tsx that hardcodes `'div'`, uses `HTMLDivElement` in `forwardRef`, and no longer imports `ElementType`. A successful `pnpm build` locally and a pushed commit on `v2` that retriggers Vercel.
</objective>

<execution_context>
@$HOME/.claude/get-shit-done/workflows/execute-plan.md
</execution_context>

<context>
@./CLAUDE.md
@src/components/layout/Grid.tsx

<interfaces>
<!-- Current Grid.tsx exports (from the file being edited). -->
<!-- Executor should preserve the public call-site shape: <Grid className=...> and <GridItem span={n} tabletSpan={n} mobileSpan={n} className=... style=...>. -->

```typescript
// Before (broken under React 19)
interface GridProps extends HTMLAttributes<HTMLElement> {
  as?: ElementType          // ← remove
  children: ReactNode
}
export const Grid = forwardRef<HTMLElement, GridProps>(...)
//                              ^^^^^^^^^^^ ← change to HTMLDivElement

interface GridItemProps extends HTMLAttributes<HTMLElement> {
  as?: ElementType          // ← remove
  span?: number
  tabletSpan?: number
  mobileSpan?: number
  children: ReactNode
}
export const GridItem = forwardRef<HTMLElement, GridItemProps>(...)
//                                  ^^^^^^^^^^^ ← change to HTMLDivElement
```

Call sites (verified — none use `as=` or `ref`):
- src/components/sections/v2/project/ProjectHero.tsx
- src/components/sections/v2/project/ProjectChallenge.tsx
- src/components/sections/v2/project/ProjectImpact.tsx
- src/components/sections/v2/project/ProjectInfoBlock.tsx
- src/components/sections/v2/project/ProjectGalleryFeatureList.tsx
- src/components/sections/v2/project/ProjectGalleryFullDetail.tsx
</interfaces>
</context>

<tasks>

<task type="auto">
  <name>Task 1: Remove polymorphic `as` prop from Grid and GridItem</name>
  <files>src/components/layout/Grid.tsx</files>
  <action>
Edit `src/components/layout/Grid.tsx` to eliminate the React 19 `ElementType` / `children: never` intersection error. Make exactly these changes and nothing else:

1. Update the import on line 2:
   - Before: `import { forwardRef, type ElementType, type ReactNode, type HTMLAttributes } from 'react'`
   - After:  `import { forwardRef, type ReactNode, type HTMLAttributes } from 'react'`

2. `GridProps` interface (lines 4-7):
   - Change `extends HTMLAttributes<HTMLElement>` → `extends HTMLAttributes<HTMLDivElement>`
   - Remove the `as?: ElementType` line.

3. `GridItemProps` interface (lines 9-15):
   - Change `extends HTMLAttributes<HTMLElement>` → `extends HTMLAttributes<HTMLDivElement>`
   - Remove the `as?: ElementType` line.

4. `Grid` forwardRef (lines 31-44):
   - Change `forwardRef<HTMLElement, GridProps>` → `forwardRef<HTMLDivElement, GridProps>`
   - Remove `as: Tag = 'div',` from the destructured props.
   - Replace `<Tag ... >{children}</Tag>` with `<div ... >{children}</div>` (both opening and closing).

5. `GridItem` forwardRef (lines 46-66):
   - Change `forwardRef<HTMLElement, GridItemProps>` → `forwardRef<HTMLDivElement, GridItemProps>`
   - Remove `as: Tag = 'div',` from the destructured props.
   - Replace `<Tag ... >{children}</Tag>` with `<div ... >{children}</div>` (both opening and closing).

Do NOT touch the `MOBILE_SPAN` / `TABLET_SPAN` / `DESKTOP_SPAN` maps, the className composition, or the `forwardRef` display names. Do NOT add JSDoc or reformat unrelated code. Rationale: CLAUDE.md requires minimal-scope fixes; no call site uses `as=` or `ref`, so removing the unused polymorphism is the root-cause fix (not a band-aid `any` cast).
  </action>
  <verify>
    <automated>pnpm build 2>&1 | tail -40</automated>
  </verify>
  <done>
`pnpm build` completes successfully with no TypeScript errors. `src/components/layout/Grid.tsx` no longer imports `ElementType`, no longer declares `as?:`, and both `forwardRef` calls use `HTMLDivElement`. Rendered output is `<div>` at both components.
  </done>
</task>

<task type="auto">
  <name>Task 2: Commit and push to v2 to retrigger Vercel preview</name>
  <files>(git only)</files>
  <action>
After Task 1's build succeeds, stage and commit only `src/components/layout/Grid.tsx`, then push to origin/v2 to retrigger the Vercel preview deploy.

Commands (run in order from repo root `/Users/caioogata/Projects/portolio-v1`):

```bash
git add src/components/layout/Grid.tsx
git commit -m "$(cat <<'EOF'
fix(grid): remove unused polymorphic `as` prop for React 19 compat

React 19's stricter ElementType intersects children with `never` for void
elements (img/br/input), producing a TS error on <Tag>{children}</Tag>.
No call site uses `as=` or `ref` on Grid/GridItem, so hardcode `div` and
switch forwardRef to HTMLDivElement. YAGNI per CLAUDE.md.

Fixes Vercel preview deploy failure on branch v2.
EOF
)"
git push origin v2
```

Do NOT use `--no-verify`. Do NOT amend a previous commit. Do NOT force push. If the pre-commit hook fails, fix the issue and create a new commit.
  </action>
  <verify>
    <automated>git log -1 --oneline && git status --short</automated>
  </verify>
  <done>
New commit exists on `v2` touching only `src/components/layout/Grid.tsx`. `git status` is clean. `git push` output confirms the commit was pushed to `origin/v2`. Vercel will pick it up automatically.
  </done>
</task>

</tasks>

<verification>
- `pnpm build` exits 0 with no TypeScript errors
- `grep -n "ElementType\|as?:" src/components/layout/Grid.tsx` returns nothing
- `grep -n "HTMLDivElement" src/components/layout/Grid.tsx` returns 2 matches (Grid + GridItem forwardRef)
- New commit is present on local and remote `v2` branch
</verification>

<success_criteria>
- TypeScript build passes locally (`pnpm build`)
- Grid.tsx has no polymorphic `as` API, no `ElementType` import
- Commit pushed to `origin/v2`
- Vercel preview deploy for `v2` succeeds on next build (monitor, but not gating this plan)
- Zero changes to any call site — rendered DOM identical
</success_criteria>

<output>
After completion, create `.planning/quick/260415-qcl-fix-grid-polymorphic-type-error-react-19/260415-qcl-SUMMARY.md` summarizing the fix, the 6 modified lines, the build result, and the pushed commit SHA.
</output>
