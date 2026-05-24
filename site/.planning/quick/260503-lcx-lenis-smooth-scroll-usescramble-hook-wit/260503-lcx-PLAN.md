---
phase: 260503-lcx
plan: quick
type: execute
wave: 1
depends_on: []
files_modified:
  - package.json
  - pnpm-lock.yaml
  - src/components/layout/PageShell.tsx
  - src/hooks/useScramble.ts
  - src/components/sections/v2/MenuSection.tsx
autonomous: false
requirements:
  - LENIS-01 — Install Lenis as the only new dependency (no GSAP, no paid libraries)
  - LENIS-02 — Mount Lenis in PageShell.tsx via useEffect with default lerp 0.1, smoothWheel true
  - LENIS-03 — Skip Lenis instantiation entirely when prefers-reduced-motion: reduce matches at mount
  - LENIS-04 — Proper cleanup: cancelAnimationFrame on the rAF id + lenis.destroy()
  - SCRAMBLE-01 — Create useScramble hook at src/hooks/useScramble.ts (project hook convention)
  - SCRAMBLE-02 — Hook signature: useScramble(text: string, active: boolean, opts?: { stepMs?: number, charPool?: string }): string
  - SCRAMBLE-03 — Defaults: stepMs 26ms, charPool 'ABCDEFGHIJKLMNOPQRSTUVWXYZ!@#$%'
  - SCRAMBLE-04 — When active flips to false, immediately reset display to text; when active flips back to true, restart the scramble cycle
  - SCRAMBLE-05 — Hook MUST clean up its interval on unmount AND on active=false; React 19 strict-mode double-invoke must not leak intervals
  - SCRAMBLE-06 — Hook MUST NOT mutate the text prop — return value only
  - PILOT-01 — Validation pilot: apply useScramble to FIRST MenuSection item ONLY (filteredItems[0])
  - PILOT-02 — Use the existing isHighlighted boolean as the active flag
  - PILOT-03 — Replace BOTH renderings of item.label in the first row: small font-sans label span (~line 191) AND large font-mono hover overlay span (~line 203)
  - PILOT-04 — Remaining menu items render unchanged (regression-free)
  - GATE-01 — STOP after Task 3 commit; do not replicate to other items, ExperienceSection, or button overlays — that is a separate quick task

must_haves:
  truths:
    - "Page scrolls feel smoothly damped on desktop (mouse wheel + trackpad) — Lenis is active"
    - "With prefers-reduced-motion: reduce, scrolling is the browser's native scroll — Lenis is NOT instantiated"
    - "Hovering the FIRST menu item triggers a character scramble effect on its label (both the resting font-sans line and the font-mono hover overlay show the scrambling characters in sync)"
    - "Hovering items 2..N renders identically to before this change — no scramble"
    - "Moving the cursor away from the first item resets the label to the original text immediately (no in-flight scramble residue)"
    - "useScramble hook file exists at src/hooks/useScramble.ts and exports useScramble"
    - "pnpm tsc --noEmit exits 0 after each task"
    - "No runaway interval leaks under React 19 strict-mode double-invoke (verified by repeated active toggles)"
  artifacts:
    - path: "package.json"
      provides: "lenis dependency added (latest stable)"
      contains: "\"lenis\""
    - path: "src/components/layout/PageShell.tsx"
      provides: "Lenis instantiation + rAF loop + cleanup, gated by prefers-reduced-motion"
      contains: "import Lenis"
    - path: "src/hooks/useScramble.ts"
      provides: "useScramble(text, active, opts?) => string — hand-rolled, zero deps, interval-based reveal animation"
      contains: "export function useScramble"
    - path: "src/components/sections/v2/MenuSection.tsx"
      provides: "Pilot integration: first row's label uses scrambled output for both rest and overlay spans"
      contains: "useScramble"
  key_links:
    - from: "src/components/layout/PageShell.tsx"
      to: "lenis"
      via: "useEffect dynamic instantiation + rAF + destroy on cleanup"
      pattern: "new Lenis"
    - from: "src/components/sections/v2/MenuSection.tsx"
      to: "src/hooks/useScramble.ts"
      via: "useScramble(filteredItems[0].label, isHighlighted) called once at the top of the row map for index 0"
      pattern: "useScramble\\("
---

<objective>
Two infrastructure pieces + one validation pilot:

1. **Lenis smooth scroll** mounted at the app root (PageShell.tsx) with default damping (lerp 0.1, smoothWheel true). Skipped entirely under prefers-reduced-motion.
2. **useScramble** — a hand-rolled React hook (zero deps) that returns a scrambling display string for a given text while an `active` flag is true. Lives at `src/hooks/useScramble.ts` per project convention.
3. **Validation pilot** — apply useScramble to the FIRST MenuSection item ONLY. The user will manually validate feel/timing before approving full rollout to all menu items, ExperienceSection rows, and `.type-overlay-hover` button text in a separate quick task.

Out of scope (do NOT plan or implement): replicating scramble to remaining menu items, ExperienceSection scramble, button hover scramble (`.type-overlay-hover`), Lenis scrollTo helpers, page-transition scroll restoration, migrating useScrollReveal/useScrollExpand to Motion's useScroll.

Purpose: Establish a single damped-scroll baseline + a reusable scramble primitive. Pilot on one row keeps risk low — if the scramble feel is wrong (too fast, too slow, wrong char pool), only one site needs adjustment before broader application.

Output: 1 dependency added, 1 hook file created, 2 components modified, 3 atomic commits, 1 visual validation gate before user approves rollout.
</objective>

<execution_context>
@$HOME/.claude/get-shit-done/workflows/execute-plan.md
@$HOME/.claude/get-shit-done/templates/summary.md
</execution_context>

<context>
@.planning/STATE.md
@./CLAUDE.md
@src/components/layout/PageShell.tsx
@src/components/sections/v2/MenuSection.tsx
@src/content/types.ts
@package.json

<interfaces>
<!-- Existing infrastructure the new code must integrate with. -->

PageShell (src/components/layout/PageShell.tsx) — already 'use client', renders IntroSection + MenuSection + ProjectsGrid. Hooks: useFontReady. SAFE to add Lenis useEffect at the top of the component body before the return.

MenuItem type (src/content/types.ts:150-154):
```typescript
export interface MenuItem {
  key: string
  label: string
  description?: string
}
```
The pilot reads `filteredItems[0].label` (a string) and feeds it to useScramble. `label` is already used in two spots inside the row map (lines 191, 203) — both must receive the scrambled output for index 0.

MenuSection row structure (lines 96-254 — the .map):
- Each row computes `isHighlighted` (boolean, line 100-102) — this is the active flag for scramble.
- Two text spots render `/{item.label}`:
  - Line 191 — small font-sans, resting state, color animates between primary/inverse
  - Line 203 — small font-sans (also `/{item.label}`) inside `.type-overlay-hover` (font-mono via the utility), translateY(100%→0) on highlight
- Both spots must show the same scrambled string at the same moment for visual coherence — they are layered (one slides up, one slides in from below). They must NOT scramble independently; one shared `useScramble(...)` call drives both.

Other hooks in src/hooks/ — naming + export convention:
- useInView.ts: `export function useInView(options?): RefObject<HTMLElement>`
- useFontReady.ts: `export function useFontReady(): void`
- useScrollReveal.ts / useScrollExpand.ts: rAF + state pattern, return objects
- useMenuNavigation.ts: returns object of state + handlers

Match this pattern: `export function useScramble(text, active, opts?): string` with named export, pure return value.

Lenis package — new dependency. Install with `pnpm add lenis`. The library exports a default class Lenis. Standard mount pattern (from Lenis README):
```ts
const lenis = new Lenis({ lerp: 0.1, smoothWheel: true })
function raf(time: number) { lenis.raf(time); rafId = requestAnimationFrame(raf) }
let rafId = requestAnimationFrame(raf)
// cleanup: cancelAnimationFrame(rafId); lenis.destroy()
```

Reduced-motion gate (one-time check at mount, no subscription needed):
```ts
if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
```
</interfaces>
</context>

<tasks>

<task type="auto" tdd="false">
  <name>Task 1: Install Lenis and mount in PageShell with reduced-motion gate</name>
  <files>package.json, pnpm-lock.yaml, src/components/layout/PageShell.tsx</files>
  <behavior>
    1. Install Lenis as a runtime dependency: `pnpm add lenis`. This updates package.json (under `dependencies`) and pnpm-lock.yaml. Confirm package.json contains `"lenis"` and version is the latest stable (no version pinning unless install fails).
    2. Edit src/components/layout/PageShell.tsx. Add at the top of the file alongside existing imports:
       ```ts
       import { useEffect } from 'react'
       import Lenis from 'lenis'
       ```
       (Note: `useEffect` is currently NOT imported in PageShell.tsx — verify and add to the existing react import line if any other react import exists, or add a new import.)
    3. Inside the PageShell component, BEFORE the existing `useFontReady()` call, add the Lenis effect:
       ```ts
       useEffect(() => {
         // SSR guard — useEffect already only runs on client, but matchMedia needs window.
         if (typeof window === 'undefined') return

         // Reduced-motion: skip Lenis entirely (one-time check at mount; static export, no need to subscribe).
         if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

         const lenis = new Lenis({ lerp: 0.1, smoothWheel: true })
         let rafId = 0
         const raf = (time: number) => {
           lenis.raf(time)
           rafId = requestAnimationFrame(raf)
         }
         rafId = requestAnimationFrame(raf)

         return () => {
           cancelAnimationFrame(rafId)
           lenis.destroy()
         }
       }, [])
       ```
    4. Do NOT add a Lenis stylesheet import (Lenis works without its CSS in this configuration; if scroll feels janky, we'll address in a follow-up). Do NOT add scrollTo helpers, anchor handlers, or any other Lenis API surface — only the basic damped scroll loop.
    5. Do NOT touch IntroSection, MenuSection, or ProjectsGrid in this task.

    Defensive notes:
    - `'use client'` is already present at line 1 — keep it.
    - The existing `useFontReady()` call stays unchanged.
    - React 19 strict-mode double-invokes useEffect in dev. The cleanup correctly cancels the rAF and destroys the lenis instance, so the second invoke creates a fresh pair — no leak. Verify by hard refresh + scrolling: smoothness should not stutter.
  </behavior>
  <action>
    Run `pnpm add lenis`. Then edit src/components/layout/PageShell.tsx to add the Lenis useEffect block per &lt;behavior&gt;. Commit with message:

    `feat(quick-260503-lcx): add Lenis smooth scroll in PageShell`

    Use the gsd-tools commit helper:
    ```bash
    node "$HOME/.claude/get-shit-done/bin/gsd-tools.cjs" commit "feat(quick-260503-lcx): add Lenis smooth scroll in PageShell" --files package.json pnpm-lock.yaml src/components/layout/PageShell.tsx
    ```
  </action>
  <verify>
    <automated>cd /Users/caioogata/Projects/portolio-v1 && grep -q '"lenis"' package.json && grep -q "import Lenis from 'lenis'" src/components/layout/PageShell.tsx && grep -q "new Lenis" src/components/layout/PageShell.tsx && grep -q "prefers-reduced-motion: reduce" src/components/layout/PageShell.tsx && grep -q "lenis.destroy" src/components/layout/PageShell.tsx && grep -q "cancelAnimationFrame" src/components/layout/PageShell.tsx && pnpm tsc --noEmit && echo "PASS"</automated>
  </verify>
  <done>
    package.json contains "lenis" dependency, pnpm-lock.yaml updated, PageShell.tsx imports Lenis + useEffect, has reduced-motion gate, has cleanup with cancelAnimationFrame + lenis.destroy(), pnpm tsc --noEmit exits 0. (Smoothness perception is human-verified separately during Task 3.)
  </done>
</task>

<task type="auto" tdd="false">
  <name>Task 2: Create useScramble hook (hand-rolled, zero deps)</name>
  <files>src/hooks/useScramble.ts</files>
  <behavior>
    Create a NEW file: `src/hooks/useScramble.ts`. Pure React hook, no external deps.

    Signature:
    ```ts
    export function useScramble(
      text: string,
      active: boolean,
      opts?: { stepMs?: number; charPool?: string }
    ): string
    ```

    Behavior contract:
    - When `active === true`: return a string that progressively reveals `text` from left to right. Characters not yet revealed are random picks from `charPool` (re-rolled every step). Characters already revealed render their final value. Step interval = `stepMs` (default 26).
    - When `active === false`: return `text` immediately (no animation, no in-flight scramble residue). Any running interval must be cleared synchronously.
    - On unmount: clear interval. No leaks.
    - When `text` prop changes mid-animation: restart from step 0 if `active` is true; otherwise just return the new text.
    - When `active` flips from false → true: start a fresh scramble cycle from step 0.
    - Whitespace handling: spaces in `text` should remain spaces in the output (don't randomize spaces). Otherwise the visual reads as a scrambled block.

    Defaults:
    - `stepMs: 26` — matches the alphamark observed timing.
    - `charPool: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ!@#$%'`

    Implementation skeleton (executor: adapt as needed; this is pseudocode for the contract):
    ```ts
    import { useEffect, useRef, useState } from 'react'

    const DEFAULT_POOL = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ!@#$%'
    const DEFAULT_STEP_MS = 26

    export function useScramble(
      text: string,
      active: boolean,
      opts?: { stepMs?: number; charPool?: string }
    ): string {
      const stepMs = opts?.stepMs ?? DEFAULT_STEP_MS
      const charPool = opts?.charPool ?? DEFAULT_POOL
      const [display, setDisplay] = useState(text)
      const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)

      useEffect(() => {
        // Always clear any existing interval before deciding what to do.
        if (intervalRef.current) {
          clearInterval(intervalRef.current)
          intervalRef.current = null
        }

        if (!active) {
          setDisplay(text)
          return
        }

        // active=true → run the scramble cycle.
        let step = 0
        const total = text.length
        // Tune: reveal one character per N steps. With stepMs=26 and revealEvery=2, a 10-char label settles in ~520ms.
        const revealEvery = 2

        const tick = () => {
          const revealed = Math.min(total, Math.floor(step / revealEvery))
          let out = ''
          for (let i = 0; i < total; i++) {
            const ch = text[i]
            if (i < revealed || ch === ' ') {
              out += ch
            } else {
              out += charPool[Math.floor(Math.random() * charPool.length)]
            }
          }
          setDisplay(out)
          step++
          if (revealed >= total) {
            // settle on final text and stop
            setDisplay(text)
            if (intervalRef.current) {
              clearInterval(intervalRef.current)
              intervalRef.current = null
            }
          }
        }

        // Fire one tick immediately so the user sees scramble on the first frame, not after stepMs delay.
        tick()
        intervalRef.current = setInterval(tick, stepMs)

        return () => {
          if (intervalRef.current) {
            clearInterval(intervalRef.current)
            intervalRef.current = null
          }
        }
      }, [text, active, stepMs, charPool])

      return display
    }
    ```

    Constraints:
    - DO NOT mutate the `text` prop.
    - DO NOT use `setTimeout` recursion (harder to cancel cleanly under strict-mode); `setInterval` + ref-based cleanup is correct here.
    - DO use `useRef` for the interval handle so a re-render does not lose the reference.
    - DO include `text`, `active`, `stepMs`, `charPool` in the effect deps array — the effect must restart when any of them changes.
    - TypeScript: file must type-check with strict (no `any`). Use `ReturnType<typeof setInterval>` for the interval handle (works in both browser and node typings).

    Verify the hook does NOT break under React 19 strict-mode by mentally tracing: mount → effect runs (starts interval) → cleanup runs (clears interval) → effect runs again (starts fresh interval). No two intervals coexist.
  </behavior>
  <action>
    Create src/hooks/useScramble.ts with the implementation per &lt;behavior&gt;. Then commit:

    ```bash
    node "$HOME/.claude/get-shit-done/bin/gsd-tools.cjs" commit "feat(quick-260503-lcx): useScramble hook (hand-rolled, no deps)" --files src/hooks/useScramble.ts
    ```
  </action>
  <verify>
    <automated>cd /Users/caioogata/Projects/portolio-v1 && test -f src/hooks/useScramble.ts && grep -q "export function useScramble" src/hooks/useScramble.ts && grep -q "stepMs" src/hooks/useScramble.ts && grep -q "charPool" src/hooks/useScramble.ts && grep -q "clearInterval" src/hooks/useScramble.ts && pnpm tsc --noEmit && echo "PASS"</automated>
  </verify>
  <done>
    src/hooks/useScramble.ts exists, exports useScramble, references stepMs/charPool/clearInterval. pnpm tsc --noEmit exits 0. Hook signature matches `(text: string, active: boolean, opts?: { stepMs?: number, charPool?: string }): string`.
  </done>
</task>

<task type="auto" tdd="false">
  <name>Task 3: Apply useScramble to first MenuSection item (validation pilot)</name>
  <files>src/components/sections/v2/MenuSection.tsx</files>
  <behavior>
    Edit src/components/sections/v2/MenuSection.tsx to apply useScramble ONLY to the first menu row (index 0). Items at index 1..N render exactly as today.

    1. Add import at the top alongside existing hook imports:
       ```ts
       import { useScramble } from '@/hooks/useScramble'
       ```

    2. Inside the `filteredItems.map((item, index) => { ... })` block (line 96), at the very TOP of the iteration (before computing `isHighlighted`), compute the scrambled display string for index 0 only. React requires hooks to be called in a stable order, so call `useScramble` UNCONDITIONALLY but only feed it the active flag for the first row. The cleanest pattern: hoist the first row's hook OUTSIDE the map.

       Replace the current map approach with:
       ```tsx
       // Pilot: scramble the first menu item's label on highlight. Other items unchanged.
       // Hooks must be called unconditionally — call once at top level, then thread the result into the row at index 0.
       const firstItem = filteredItems[0]
       const firstItemHighlighted = firstItem
         ? (keyboardSticky
             ? activeIndex === 0
             : hoveredIndex === 0 || (hoveredIndex === null && activeIndex === 0))
         : false
       const firstItemScrambledLabel = useScramble(firstItem?.label ?? '', firstItemHighlighted)
       ```

       Place this block AFTER the existing `useInteractionMode()` + `keyboardSticky` derivation (line 65-66) and BEFORE `handleMouseMove` (line 68), so all hook calls precede the JSX. This keeps hook ordering stable across renders even if `filteredItems` changes (the hook is always called once per render).

    3. Inside the row map, for index 0 ONLY, render `firstItemScrambledLabel` instead of `item.label` in BOTH spans. The cleanest expression:
       ```tsx
       const labelText = index === 0 ? firstItemScrambledLabel : item.label
       ```
       Place this at the top of the iteration body (right after computing `isHighlighted` and `isDimmed`).

       Then update the two `/{item.label}` renderings (lines 191 and 203) to `/{labelText}`. Both spans receive the same value — the resting state and the hover overlay scramble in lockstep.

    4. Do NOT change the description, the arrow span, the bar, or any styling. Do NOT change anything else in the file. Do NOT touch the keyboard nav, the floating preview, or the keyboard hints footer.

    5. Edge case: if `filteredItems` is empty (type-to-filter with no match), `firstItem` is undefined; `useScramble('', false)` returns `''`. The map body is also empty. Safe.

    6. Edge case: if the user scrambles the input filter (type-to-filter), the first remaining item becomes the new index 0 and gets scramble on hover — this is acceptable behavior for the pilot.

    7. After editing, run pnpm tsc --noEmit and confirm no errors.

    DO NOT touch:
    - IntroSection.tsx
    - ExperienceSection.tsx
    - Any button overlay / .type-overlay-hover spans
    - Other rows in MenuSection
  </behavior>
  <action>
    Edit src/components/sections/v2/MenuSection.tsx per &lt;behavior&gt;:
    1. Add `import { useScramble } from '@/hooks/useScramble'` at the top.
    2. After `keyboardSticky` derivation (line ~66), add the firstItem / firstItemHighlighted / firstItemScrambledLabel block.
    3. Inside the row map, compute `const labelText = index === 0 ? firstItemScrambledLabel : item.label` after `isHighlighted`/`isDimmed`.
    4. Replace BOTH `/{item.label}` renderings (line 191 and line 203) with `/{labelText}`.

    Then commit:
    ```bash
    node "$HOME/.claude/get-shit-done/bin/gsd-tools.cjs" commit "feat(quick-260503-lcx): apply useScramble to first MenuSection item (pilot)" --files src/components/sections/v2/MenuSection.tsx
    ```

    After commit, STOP. Do not proceed to replicate to other items, ExperienceSection, or button overlays. Hand off to Task 4 (visual validation gate) for user approval.
  </action>
  <verify>
    <automated>cd /Users/caioogata/Projects/portolio-v1 && grep -q "import { useScramble } from '@/hooks/useScramble'" src/components/sections/v2/MenuSection.tsx && grep -q "firstItemScrambledLabel" src/components/sections/v2/MenuSection.tsx && grep -q "const labelText = index === 0" src/components/sections/v2/MenuSection.tsx && test "$(grep -c "/{labelText}" src/components/sections/v2/MenuSection.tsx)" -eq 2 && test "$(grep -c "/{item.label}" src/components/sections/v2/MenuSection.tsx)" -eq 0 && pnpm tsc --noEmit && echo "PASS"</automated>
  </verify>
  <done>
    MenuSection.tsx imports useScramble, defines firstItemScrambledLabel via hook call at component top, computes labelText conditionally on index === 0, renders /{labelText} in both rest and overlay spans (count=2), no remaining /{item.label} occurrences. pnpm tsc --noEmit exits 0.
  </done>
</task>

<task type="checkpoint:human-verify" gate="blocking">
  <name>Task 4: Visual validation — Lenis smoothness + first-item scramble pilot</name>
  <files>(no files modified — visual verification only)</files>
  <action>
    Pause execution. Do not proceed to replicate to remaining items, ExperienceSection, or button overlays until the user has visually approved the pilot. See &lt;how-to-verify&gt; for steps. The full rollout is a separate quick task scheduled AFTER this approval.
  </action>
  <verify>
    <automated>echo "MANUAL — see how-to-verify; user must approve before broader rollout"</automated>
  </verify>
  <done>User types "approved" after the four checks below pass. Otherwise the user describes which axis (Lenis feel / scramble timing / scramble char pool / overlap behaviour) needs adjustment, and the executor returns to the corresponding task to tune.</done>
  <what-built>
    - Lenis smooth scroll mounted at PageShell (lerp 0.1, smoothWheel true), skipped under prefers-reduced-motion.
    - useScramble hook at src/hooks/useScramble.ts — hand-rolled, zero deps, 26ms step, ABC...!@#$% pool.
    - First MenuSection row's label scrambles on hover; other rows unchanged.
  </what-built>
  <how-to-verify>
    1. Run `pnpm dev` (or use the existing dev server). Open http://localhost:3000.

    2. **Lenis smoothness**: Scroll the home page with mouse wheel and trackpad. Expect a noticeably damped feel — momentum carries past the wheel input, decelerates smoothly. Compare against `git stash` (or hard reset to commit pre-lenis-scramble) for an A/B if needed. There should be NO scroll jank, NO stutter, NO conflict with the IntersectionObserver-driven entrance animations on `-inview`. AboutPinned (sticky 400vh hero on /about) and ExperienceHero (sticky 400vh hero on /experience) should still pin correctly — Lenis is non-disruptive.

    3. **Reduced-motion gate**: Open DevTools → Rendering → Emulate CSS media feature `prefers-reduced-motion: reduce`. Hard refresh (Cmd-Shift-R). Scroll. Expect NATIVE browser scroll (instant, no damping). In the Console, type `document.querySelector('html').classList` and verify no Lenis-injected classes (e.g. `.lenis`, `.lenis-smooth`) — Lenis was never instantiated. (The library normally adds these classes to html on instantiation; their absence confirms the gate worked.)

    4. **Scramble pilot — first item only**: Disable reduced-motion emulation. On the home page, hover the FIRST menu item (first row in MenuSection — the topmost `/label`). Expect:
       - The label characters scramble briefly (random uppercase + symbols), then settle on the original label as it reveals left-to-right over ~500-600ms.
       - The font-mono hover overlay (visible on highlight) shows the SAME scrambled string at the SAME moment as the resting font-sans line — they are perfectly in sync (both pull from the single useScramble call).
       - When the cursor moves OFF the row, the label snaps back to the original text instantly (no in-flight scramble residue).
       - Hover BACK ON: scramble cycle restarts cleanly from step 0.
       - Use keyboard nav (↓ from no selection, or ↑↓ to land on the first item): the scramble should fire identically — the `active` flag derives from `isHighlighted`, not from mouse-vs-keyboard.

    5. **Other items unchanged**: Hover items 2..N. The label should render normally (no scramble). The resting line + overlay still cross-fade vertically (the existing masked-text-swap behaviour), but text is the literal label string — no random chars. This is the regression check.

    6. **No interval leaks**: Hover the first item, move off, hover back, move off — repeat ~10 times rapidly. Open DevTools Performance tab and record briefly. Expect no growing list of active timers. (If the hook leaks, repeated toggling would accumulate intervals — the cleanup contract prevents this.)

    7. **DOM inspection**: Right-click the first menu row's label, Inspect. The `<span class="block truncate">` content should change frame-to-frame on hover (DevTools live-updates). On hover-off, content stabilizes to the original label.

    Acceptance criteria:
    - Smooth scroll feels improved (subjective, but distinct from native).
    - Reduced-motion fully bypasses Lenis.
    - First-row label scrambles ON hover, settles cleanly, resets on hover-off.
    - Both spans (rest + overlay) scramble in lockstep.
    - Items 2..N are unchanged.
    - No timer leak across rapid toggles.
    - pnpm tsc --noEmit exits 0 (already verified per task — confirm again at the end).

    Visual capture: optional Playwright screenshot of the first row mid-scramble for the SUMMARY.

    If any axis fails:
    - Lenis feel wrong → revert to default (no tuning yet — flag for follow-up).
    - Scramble too fast / too slow → adjust `stepMs` default in useScramble.ts (e.g. 22-32ms).
    - Char pool reads wrong → adjust DEFAULT_POOL.
    - Spans desync → confirm BOTH `/{labelText}` references resolved to the same variable (not one to scrambled, one to original).
  </how-to-verify>
  <resume-signal>
    Type "approved" if all four axes pass. Otherwise describe: which axis (Lenis feel / scramble timing / scramble char pool / span sync), what felt off (faster / slower / different chars / desynced), and any preference (e.g. "scramble too aggressive — try stepMs=40").

    On "approved", the next quick task will replicate scramble to the remaining MenuSection items, ExperienceSection rows, and button hover overlays. The rollback marker `pre-lenis-scramble` at commit f98294f remains as the safety net for the entire pilot range.
  </resume-signal>
</task>

</tasks>

<verification>
  - `pnpm tsc --noEmit` exits 0 after Task 1, Task 2, and Task 3
  - grep confirms `lenis` in package.json + `import Lenis` + `new Lenis` + reduced-motion gate + `lenis.destroy` + `cancelAnimationFrame` in PageShell.tsx
  - grep confirms src/hooks/useScramble.ts exists, exports useScramble, handles stepMs/charPool/clearInterval
  - grep confirms MenuSection.tsx imports useScramble, defines firstItemScrambledLabel, has labelText derivation, renders /{labelText} exactly twice and /{item.label} zero times
  - Manual: home-page scroll feels damped; reduced-motion bypasses Lenis cleanly
  - Manual: first menu row scrambles on hover (mouse + keyboard), other rows unchanged, no timer leaks across rapid toggles
  - Manual: AboutPinned + ExperienceHero sticky hero pins still work (no regression)
</verification>

<success_criteria>
  - Lenis smooth scroll is the new baseline on home (and all routes mounted under PageShell — confirm: PageShell only renders home; /about, /experience, /projects/* render via their own page components, so Lenis currently scopes to home only — this is acceptable for the pilot. Broader mounting decision deferred to follow-up.)
  - useScramble is a reusable hook with a clean signature (text, active, opts?) → string, ready to be applied to remaining menu items, ExperienceSection rows, and `.type-overlay-hover` button text
  - First MenuSection row scrambles on highlight in both the resting line and the hover overlay, in lockstep
  - Other rows are regression-free
  - Reduced-motion fully bypasses Lenis (instantiation never happens) and natively collapses scramble feel via the hook's interval being clearable instantly on active=false (the hook itself does NOT explicitly check prefers-reduced-motion — that is a deliberate scope choice for this pilot; can be added in the rollout task if needed)
  - Three atomic commits land in order: Lenis → useScramble → pilot wire-up
  - Validation gate (Task 4) holds firm — no automatic rollout to other items
</success_criteria>

<output>
After Task 4 approval, no additional commit is needed (Tasks 1-3 already committed individually). Create the SUMMARY:

```bash
# SUMMARY path
.planning/quick/260503-lcx-lenis-smooth-scroll-usescramble-hook-wit/260503-lcx-SUMMARY.md
```

SUMMARY should document:
- Lenis configuration (lerp 0.1, smoothWheel true, reduced-motion gate, cleanup)
- useScramble hook contract (signature, defaults, active=false reset behavior, no leaks)
- Pilot integration site (MenuSection first row, both rest + overlay spans, hooks-at-top-level pattern)
- Out-of-scope confirmation (other menu items, ExperienceSection, button overlays — all deferred to follow-up)
- Rollback marker reference: tag `pre-lenis-scramble` at commit f98294f
- Next step: separate quick task to replicate scramble to remaining call sites (after user approval)
</output>
