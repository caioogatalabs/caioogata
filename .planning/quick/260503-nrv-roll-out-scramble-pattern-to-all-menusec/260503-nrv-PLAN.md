---
phase: 260503-nrv
plan: quick
type: execute
wave: 1
depends_on: []
files_modified:
  - src/components/motion/ScrambledLabel.tsx
  - src/components/sections/v2/MenuSection.tsx
  - src/components/sections/v2/ExperienceSection.tsx
  - src/components/sections/v2/StickyLogoBar.tsx
  - src/components/sections/v2/ProjectCard.tsx
  - src/components/sections/v2/ContactOverlay.tsx
  - src/components/sections/v2/FloatingContactButton.tsx
  - src/components/sections/v2/ContactForm.tsx
  - src/app/dev/buttons/page.tsx
autonomous: false
requirements:
  - SCRAMBLED-01 — Extract `<ScrambledLabel>` component to `src/components/motion/ScrambledLabel.tsx` mirroring the inline pilot pattern verbatim (resolved chars in font-mono, scrambling tail in font-sans, plain string when not active or fully resolved)
  - SCRAMBLED-02 — Component signature: `<ScrambledLabel text={string} active={boolean} />` — internally calls useScramble(text, active) with default opts, returns a `<>` fragment of two `<span>`s during scramble or the bare text when settled
  - SCRAMBLED-03 — One hook instance per `<ScrambledLabel>` mount (per-row hooks via component, NOT a top-level hoisted call). At rest active=false, no work; only the actively-highlighted row pays the interval cost.
  - MENU-01 — Refactor MenuSection.tsx to use `<ScrambledLabel>` for ALL filteredItems (not just index 0). Drop the `firstItem`/`firstItemHighlighted`/`firstItemScramble` top-level scramble logic — becomes redundant.
  - MENU-02 — Each row's two `/{label}` renderings (rest line + .type-overlay-hover overlay) get `<ScrambledLabel text={item.label} active={isHighlighted} />`. Both spans share the SAME visible scramble state (one component instance per row drives both — see implementation note).
  - EXP-01 — Apply `<ScrambledLabel>` to ExperienceSection rows. Both `job.company` masked-swap text spans (rest + overlay) and the `job.title` masked-swap text spans (rest + overlay) receive the component, driven by `showLargeText` (the same boolean that drives the existing typography swap).
  - EXP-02 — Mobile-only fallback rendering of `job.title` and `job.dateRange` (lines 335-367, the `md:hidden` block) stays plain text. Dates (font-mono col 2-3) stay plain. Only the company + title text-swap spans scramble — they are the visual focal points and parity with MenuSection.
  - BTN-01 — In every `.type-overlay-hover` overlay span on a button that has a React-tracked hover state, replace the static label text with `<ScrambledLabel text={label} active={isHovered} />`. Files in scope: StickyLogoBar.tsx, ProjectCard.tsx, ContactOverlay.tsx (Close pill+× group + SubmitButton + ClearButton + SubjectChip), FloatingContactButton.tsx, ContactForm.tsx (Submit + Clear + SubjectChip), src/app/dev/buttons/page.tsx (all Primary/Secondary Pill/Squared/IconOnly/Composition variants).
  - BTN-02 — For icon-only overlays (`×`, `+`, `→`) wrap them in `<ScrambledLabel>` too. The hook's whitespace-only handling preserves single-char text; the random char pool causes a brief 1-char scramble flicker — treat as desired effect (consistent pattern). If the executor finds a single-char scramble visually unpleasant in implementation/verification, document the decision and skip ICON overlays only (keep label overlays scrambled).
  - BTN-03 — Skip surfaces explicitly: (a) StickyHeader.tsx — verified NOT imported anywhere (legacy file, dead code); document as "skipped — dead code"; (b) SkillsBlock.tsx — uses `.type-overlay-hover` for skill-name + level-label hover swap, but the swap is driven by per-row `isHovered` state already; if the executor finds the swap is fast-fired during accordion sweep and scramble feels noisy, document as "skipped — accordion hover too transient". Verify before applying — if it reads cleanly, apply. SubjectChip in both ContactForm + ContactOverlay also has `.type-overlay-hover` overlays — APPLY (chip hover is deliberate, not transient).
  - DEFAULTS-01 — No new design decisions. Use default `useScramble` opts (stepMs 35, charPool 'ABC...!@#$%'). No per-surface timing variants.
  - COMMITS-01 — Atomic per-surface commits for clean revert: (1) extract ScrambledLabel, (2) MenuSection refactor, (3) ExperienceSection rollout, (4) button overlay rollout (StickyLogoBar/ProjectCard/ContactOverlay/FloatingContactButton/ContactForm), (5) dev/buttons playground (optional standalone). Squash if a surface ends up with zero changes after investigation. NEVER bundle MenuSection + Experience + buttons into one commit.
  - VERIFY-01 — `pnpm tsc --noEmit` exits 0 after every commit.
  - VERIFY-02 — Per-surface grep smoke checks (component imports, instance counts) defined in each task's <verify>.
  - GATE-01 — STOP after the buttons commit; the dev/buttons playground commit is OPTIONAL — do it iff the user has not flagged any issues with the production-surface rollout. Otherwise hand off to user-verify and let the user decide.
  - SCOPE-OUT-01 — Out of scope: changing scramble timing/charPool defaults, applying scramble to non-hover surfaces (h1s, body text, non-button links), migrating useScrollReveal/useScrollExpand to Motion's useScroll, Lenis tuning, AboutPinned/BioBlock/EducationBlock/ClientsBlock animation changes.

must_haves:
  truths:
    - "ScrambledLabel component file exists at src/components/motion/ScrambledLabel.tsx and exports the component"
    - "Hovering ANY MenuSection item triggers the scramble effect on its label, with the same typography contrast (resolved=mono, unresolved=sans) seen in the pilot"
    - "MenuSection's old firstItem/firstItemHighlighted/firstItemScramble top-level logic is removed (no longer present in the file)"
    - "Hovering or focusing any ExperienceSection row triggers scramble on company AND title text spans, in lockstep with the existing masked-swap"
    - "Hovering the StickyLogoBar `ask about` pill scrambles its label; the × icon scrambles too (or is documented as skipped per BTN-02)"
    - "Hovering ProjectCard's arrow → button overlay shows scramble"
    - "Hovering ContactOverlay's Close pill + × group scrambles the labels"
    - "Hovering FloatingContactButton's Contact/Close pill + +/× group scrambles the labels"
    - "Hovering ContactForm's Submit + Clear buttons scrambles their labels"
    - "Hovering dev/buttons playground variants scrambles their labels (last commit, optional)"
    - "pnpm tsc --noEmit exits 0 after each commit"
    - "All scramble surfaces use the SAME component (no inline duplication of useScramble + typography-swap rendering anywhere)"
    - "No regressions: rest-state visuals, vertical-translate masked swap, fill animations, color transitions all unchanged from before the rollout"
  artifacts:
    - path: "src/components/motion/ScrambledLabel.tsx"
      provides: "Reusable ScrambledLabel component — useScramble + typography-swap rendering encapsulated"
      contains: "export function ScrambledLabel"
    - path: "src/components/sections/v2/MenuSection.tsx"
      provides: "All filteredItems rows scramble on highlight (was: index 0 only); inline scramble plumbing replaced by ScrambledLabel"
      contains: "ScrambledLabel"
    - path: "src/components/sections/v2/ExperienceSection.tsx"
      provides: "All experience rows scramble company + title on highlight/expand"
      contains: "ScrambledLabel"
    - path: "src/components/sections/v2/StickyLogoBar.tsx"
      provides: "ask about pill + × icon overlays use ScrambledLabel"
      contains: "ScrambledLabel"
    - path: "src/components/sections/v2/ProjectCard.tsx"
      provides: "Arrow → button overlay uses ScrambledLabel"
      contains: "ScrambledLabel"
    - path: "src/components/sections/v2/ContactOverlay.tsx"
      provides: "Close pill + × button + SubmitButton + ClearButton + SubjectChip overlays use ScrambledLabel"
      contains: "ScrambledLabel"
    - path: "src/components/sections/v2/FloatingContactButton.tsx"
      provides: "Contact/Close pill + +/× icon overlays use ScrambledLabel"
      contains: "ScrambledLabel"
    - path: "src/components/sections/v2/ContactForm.tsx"
      provides: "Submit + Clear button overlays + SubjectChip overlay use ScrambledLabel"
      contains: "ScrambledLabel"
    - path: "src/app/dev/buttons/page.tsx"
      provides: "All Primary/Secondary Pill/Squared/IconOnly/Composition button overlays use ScrambledLabel"
      contains: "ScrambledLabel"
  key_links:
    - from: "src/components/motion/ScrambledLabel.tsx"
      to: "src/hooks/useScramble.ts"
      via: "internal hook call useScramble(text, active)"
      pattern: "useScramble\\("
    - from: "src/components/sections/v2/MenuSection.tsx"
      to: "src/components/motion/ScrambledLabel.tsx"
      via: "Replaces inline labelNode logic; rendered inside both rest + overlay spans of every row"
      pattern: "<ScrambledLabel"
    - from: "src/components/sections/v2/ExperienceSection.tsx"
      to: "src/components/motion/ScrambledLabel.tsx"
      via: "Wraps job.company + job.title text in masked-swap rest + overlay spans"
      pattern: "<ScrambledLabel"
    - from: "button overlay surfaces (StickyLogoBar, ProjectCard, ContactOverlay, FloatingContactButton, ContactForm, dev/buttons)"
      to: "src/components/motion/ScrambledLabel.tsx"
      via: "Wraps the static label text inside .type-overlay-hover spans, driven by existing per-button React hover state"
      pattern: "<ScrambledLabel.*active="
---

<objective>
Roll out the scramble hover pattern (commit c7514bd, approved by user) from the MenuSection-first-item pilot to ALL applicable hover surfaces:

1. **Extract `<ScrambledLabel>`** — port the inline pilot pattern (lines 117-132 of MenuSection.tsx) to a reusable component at `src/components/motion/ScrambledLabel.tsx`. Same logic, no behavior change.
2. **MenuSection** — all rows (drop the index-0 specialization).
3. **ExperienceSection** — company + title masked-swap spans on every row.
4. **Button overlays** — every `.type-overlay-hover` span on production buttons (StickyLogoBar, ProjectCard, ContactOverlay, FloatingContactButton, ContactForm).
5. **dev/buttons playground** — apply for consistency in the dev preview (optional last commit).

Locked design (per pilot c7514bd): resolved chars render in font-mono, unresolved tail in font-sans. Default useScramble opts (stepMs 35, charPool ABC...!@#$%). No per-surface timing variants.

Atomic commits per surface for clean revert. NEVER bundle surfaces.

Out of scope: changing scramble timing/charPool, applying to non-hover surfaces, migrating useScrollReveal/useScrollExpand, Lenis tuning, About-page block animation changes.

Output: 1 new component file, 8 modified files, 4-5 atomic commits, 1 visual validation gate.

Safety floor: commit c7514bd (post-pilot, pre-rollout) is the new rollback marker for this work. Pre-existing tag `pre-lenis-scramble` (f98294f) remains the floor for the entire scramble feature — do NOT touch it.
</objective>

<execution_context>
@$HOME/.claude/get-shit-done/workflows/execute-plan.md
@$HOME/.claude/get-shit-done/templates/summary.md
</execution_context>

<context>
@.planning/STATE.md
@./CLAUDE.md
@src/hooks/useScramble.ts
@src/components/sections/v2/MenuSection.tsx
@src/components/sections/v2/ExperienceSection.tsx
@src/components/sections/v2/StickyLogoBar.tsx
@src/components/sections/v2/ProjectCard.tsx
@src/components/sections/v2/ContactOverlay.tsx
@src/components/sections/v2/FloatingContactButton.tsx
@src/components/sections/v2/ContactForm.tsx
@src/components/sections/v2/about/SkillsBlock.tsx
@src/app/dev/buttons/page.tsx

<interfaces>
<!-- Existing primitives the new code integrates with. -->

useScramble (src/hooks/useScramble.ts) — current shipped contract (post-c7514bd):
```ts
export interface ScrambleResult {
  display: string   // current frame's display string (resolved + scrambling tail)
  revealed: number  // count of chars from left that have settled on text
}
export function useScramble(
  text: string,
  active: boolean,
  opts?: { stepMs?: number; charPool?: string }
): ScrambleResult
```
Defaults: stepMs 35, charPool 'ABCDEFGHIJKLMNOPQRSTUVWXYZ!@#$%'. Whitespace preserved. active=false snaps to text. Strict-mode safe (cleanup clears interval). DO NOT modify the hook in this rollout.

Pilot pattern (MenuSection.tsx lines 117-132 — port verbatim):
```tsx
const isScrambling =
  index === 0 &&
  firstItemHighlighted &&
  firstItemScramble.revealed < firstItemScramble.display.length
const labelNode: React.ReactNode = isScrambling ? (
  <>
    <span className="font-mono">
      {firstItemScramble.display.slice(0, firstItemScramble.revealed)}
    </span>
    <span className="font-sans">
      {firstItemScramble.display.slice(firstItemScramble.revealed)}
    </span>
  </>
) : (
  item.label
)
```

ScrambledLabel implementation contract (Task 1):
```tsx
'use client'
import { useScramble } from '@/hooks/useScramble'

interface ScrambledLabelProps {
  text: string
  active: boolean
}
export function ScrambledLabel({ text, active }: ScrambledLabelProps) {
  const { display, revealed } = useScramble(text, active)
  // Snap to plain text when not active OR when revealed has caught up to text length
  // (mirrors `isScrambling` derivation in pilot — avoids rendering empty <span>s post-settle).
  const scrambling = active && revealed < display.length
  if (!scrambling) return <>{text}</>
  return (
    <>
      <span className="font-mono">{display.slice(0, revealed)}</span>
      <span className="font-sans">{display.slice(revealed)}</span>
    </>
  )
}
```
Note: returns `<>{text}</>` (NOT a string) so consumers can render it as `{<ScrambledLabel ... />}` — JSX expression where a string would otherwise sit. The two `<span>`s during scramble preserve the typography-contrast effect from c7514bd.

WHY two-span fragment instead of single string: the typography swap (resolved=mono, unresolved=sans) is the locked design. Returning a single string would lose it. Per the user's locked decision, the typography swap is non-negotiable.

MenuSection row structure (current — post-c7514bd):
- Two `/{labelNode}` renderings on lines 221 + 233 — rest line span + .type-overlay-hover overlay span. Both render the SAME labelNode (a React.ReactNode that might be `item.label` or the two-span fragment). After refactor, both render `<ScrambledLabel text={item.label} active={isHighlighted} />`.
- Top-level `firstItem`, `firstItemHighlighted`, `firstItemScramble` (lines 74-80) — DELETE all three.
- `useScramble` import on line 8 — DELETE (no longer used at MenuSection level).
- The `isScrambling` / `labelNode` derivation inside the map (lines 118-133) — DELETE.

Per-row hook instances note: with N MenuSection items + ~M ExperienceSection rows + several buttons, every page mounts many `<ScrambledLabel>` instances each with its own `useScramble`. At rest, active=false, the hook's effect early-returns AND the interval is never set — zero cost. On hover, only the hovered row's interval runs. No perf concern.

ExperienceSection row structure (lines 88-447):
- Per row: `isHighlighted`, `isExpanded`, `showLargeText = isHighlighted || isExpanded` (line 100). USE `showLargeText` as the `active` flag for ScrambledLabel — both highlight AND expand should trigger scramble (matches the existing typography swap which also runs off `showLargeText`).
- Two text targets per row, each with rest + overlay span (4 total ScrambledLabel mounts per row):
  - job.company (line 254 rest, line 274 overlay) — desktop col 4-6
  - job.title (line 309 rest, line 329 overlay) — desktop col 7-12
- DO NOT touch:
  - The arrow → at line 197 (single char, kept plain — matches Menu's arrow which is also single-char, not scrambled)
  - The font-mono date label (lines 219, 365)
  - The mobile-only `md:hidden` title + date block (lines 335-367)

Button overlay structure (universal pattern):
- Each button has 2 spans: a "rest" span with the default label/icon, and an "overlay" span with `className="... type-overlay-hover"` containing the SAME label/icon.
- The overlay span shows on hover via `transform: translateY(100%→0)`.
- React state `[h, setH]` or named (`groupHovered`, `arrowHovered`, `submitHovered`, etc.) drives both spans.
- We replace the LITERAL TEXT inside the overlay span ONLY (the one with `type-overlay-hover` class). The rest span stays plain — it's not visible during the scramble window. Apply ScrambledLabel to the overlay span only, with `active={hoverState}`.

EXCEPTION — ContactOverlay close button success-state path: the rest span has `className="invisible"` and exists only for layout. The overlay span (line 171/200) is the sole visible label. Apply ScrambledLabel to the overlay span as in the universal pattern.

Files using `.type-overlay-hover` (verified by grep):
1. src/app/dev/buttons/page.tsx — all variants (Primary/Secondary Pill/Squared/IconOnly/Composition)
2. src/components/sections/v2/StickyLogoBar.tsx — ask about pill + × icon
3. src/components/sections/v2/ExperienceSection.tsx — covered by Task 3
4. src/components/sections/v2/ContactOverlay.tsx — Close pill + × icon + SubmitButton + ClearButton + SubjectChip
5. src/components/sections/v2/StickyHeader.tsx — DEAD CODE, NOT IMPORTED — SKIP
6. src/components/sections/v2/FloatingContactButton.tsx — Contact/Close pill + +/× icon
7. src/components/sections/v2/ProjectCard.tsx — arrow → icon
8. src/components/sections/v2/ContactForm.tsx — Submit + Clear + SubjectChip
9. src/components/sections/v2/MenuSection.tsx — covered by Task 2
10. src/components/sections/v2/about/SkillsBlock.tsx — APPLIES — see Task 4 instructions for skill-name + level-label hover swap

StickyHeader.tsx skip rationale: `grep -rn "StickyHeader" src/` returns ONLY the self-definition (`export function StickyHeader`) — no imports anywhere in the codebase. The README/CLAUDE.md confirms it's superseded by StickyLogoBar. Document as "skipped — dead code (not imported)" in the SUMMARY.

SkillsBlock note: The `.type-overlay-hover` overlay shows the skill name (1.25rem mono, line 240) and the level label (line 281). Both driven by `isHovered = hoveredSkill === skill.name`. The interaction is INTENTIONAL hover (not transient sweep) since the accordion exclusively expands ONE category at a time and skills only show on the open one. APPLY ScrambledLabel to BOTH overlay spans (skill name + level label). Active flag = `isHovered`.

Tailwind class purge note: ScrambledLabel renders `font-mono` and `font-sans` classes dynamically. Both classes are already actively used elsewhere in the codebase (MenuSection itself, ExperienceSection, etc.) so the purge keeps them. No `safelist` change required.
</interfaces>
</context>

<tasks>

<task type="auto" tdd="false">
  <name>Task 1: Extract ScrambledLabel component from MenuSection pilot</name>
  <files>src/components/motion/ScrambledLabel.tsx</files>
  <behavior>
    Create a NEW file `src/components/motion/ScrambledLabel.tsx`. Port the inline pilot pattern from MenuSection.tsx lines 117-132 verbatim — no behavior changes.

    Component contract:
    ```tsx
    'use client'
    import { useScramble } from '@/hooks/useScramble'

    interface ScrambledLabelProps {
      text: string
      active: boolean
    }

    /**
     * ScrambledLabel — character scramble reveal with typography swap.
     *
     * When `active` is true and the scramble has not yet settled, renders the
     * resolved (left) chars in font-mono and the still-scrambling (right) tail
     * in font-sans. When `active` is false OR the scramble has fully resolved,
     * renders the plain `text` string.
     *
     * Pattern locked by pilot commit c7514bd. Default useScramble opts (stepMs
     * 35, charPool ABC...!@#$%) — no per-surface variants.
     */
    export function ScrambledLabel({ text, active }: ScrambledLabelProps) {
      const { display, revealed } = useScramble(text, active)
      const scrambling = active && revealed < display.length
      if (!scrambling) return <>{text}</>
      return (
        <>
          <span className="font-mono">{display.slice(0, revealed)}</span>
          <span className="font-sans">{display.slice(revealed)}</span>
        </>
      )
    }
    ```

    Constraints:
    - DO add `'use client'` at the top — uses a client hook (useScramble), and consumers may be server components in the future even if today's call sites are all `'use client'`.
    - DO NOT pass any opts through — defaults only. If a future surface needs different timing, that's a separate change.
    - DO NOT export the props interface — internal-only typing. (If the executor finds a TS strict reason to export, document and proceed.)
    - File location: `src/components/motion/` to colocate with `SplitText.tsx` (the other text-reveal primitive). Per CLAUDE.md "Motion Text Reveal" section, motion/ is the established home for editorial text-reveal components.
    - DO NOT modify MenuSection.tsx in this task — that's Task 2's atomic change.
    - Verify the new file compiles: `pnpm tsc --noEmit` exits 0.
  </behavior>
  <action>
    Create the file at `src/components/motion/ScrambledLabel.tsx` with the implementation per &lt;behavior&gt;. Then commit:

    ```bash
    node "$HOME/.claude/get-shit-done/bin/gsd-tools.cjs" commit "refactor(quick-260503-nrv): extract ScrambledLabel from MenuSection pilot" --files src/components/motion/ScrambledLabel.tsx
    ```
  </action>
  <verify>
    <automated>cd /Users/caioogata/Projects/portolio-v1 && test -f src/components/motion/ScrambledLabel.tsx && grep -q "export function ScrambledLabel" src/components/motion/ScrambledLabel.tsx && grep -q "useScramble" src/components/motion/ScrambledLabel.tsx && grep -q "font-mono" src/components/motion/ScrambledLabel.tsx && grep -q "font-sans" src/components/motion/ScrambledLabel.tsx && grep -q "'use client'" src/components/motion/ScrambledLabel.tsx && pnpm tsc --noEmit && echo "PASS"</automated>
  </verify>
  <done>
    src/components/motion/ScrambledLabel.tsx exists, exports ScrambledLabel, references useScramble + font-mono + font-sans + 'use client'. pnpm tsc --noEmit exits 0. File compiles standalone (no consumers yet).
  </done>
</task>

<task type="auto" tdd="false">
  <name>Task 2: Apply ScrambledLabel to ALL MenuSection items</name>
  <files>src/components/sections/v2/MenuSection.tsx</files>
  <behavior>
    Refactor src/components/sections/v2/MenuSection.tsx to use `<ScrambledLabel>` for ALL filteredItems (not just index 0). Drop the top-level scramble plumbing.

    1. Imports — replace the line:
       ```ts
       import { useScramble } from '@/hooks/useScramble'
       ```
       with:
       ```ts
       import { ScrambledLabel } from '@/components/motion/ScrambledLabel'
       ```

    2. DELETE the top-level scramble plumbing block (currently lines 73-80 in the file, comment + 3 const declarations):
       ```tsx
       // Pilot: scramble the first menu item's label on highlight. Other items unchanged.
       // Hooks must be called unconditionally — call once at top level, then thread the
       // result into the row at index 0. Both rest + overlay spans render the resolved
       // half in mono and the scrambling tail in sans, so the typography contrast grows
       // left → right alongside the char reveal (visible even on short labels).
       const firstItem = filteredItems[0]
       const firstItemHighlighted = firstItem
         ? (keyboardSticky
             ? activeIndex === 0
             : hoveredIndex === 0 || (hoveredIndex === null && activeIndex === 0))
         : false
       const firstItemScramble = useScramble(firstItem?.label ?? '', firstItemHighlighted)
       ```
       After deletion, `keyboardSticky` (above) flows directly into `handleMouseMove` (below).

    3. Inside the row map (filteredItems.map at line 110), DELETE the `isScrambling` + `labelNode` derivation block (currently lines 118-133):
       ```tsx
       const isScrambling =
         index === 0 &&
         firstItemHighlighted &&
         firstItemScramble.revealed < firstItemScramble.display.length
       const labelNode: React.ReactNode = isScrambling ? (
         <>
           <span className="font-mono">
             {firstItemScramble.display.slice(0, firstItemScramble.revealed)}
           </span>
           <span className="font-sans">
             {firstItemScramble.display.slice(firstItemScramble.revealed)}
           </span>
         </>
       ) : (
         item.label
       )
       ```
       This derivation is now per-row inside the component.

    4. In the row's JSX, the two `/{labelNode}` renderings (lines 221 + 233 — rest line span and .type-overlay-hover overlay span) become:
       ```tsx
       /<ScrambledLabel text={item.label} active={isHighlighted} />
       ```
       Both spans get the SAME expression. Each rendered `<ScrambledLabel>` is its own component instance (React deduplication is fine — both mount and call useScramble independently with identical args, both settle simultaneously since useScramble is deterministic except for the random char pool which renders identically per frame for both since they share the same active flag and text — see implementation note below).

       IMPLEMENTATION NOTE: Two `<ScrambledLabel>` mounts per row (one in rest span, one in overlay) WILL run two independent setIntervals when active=true — they will produce DIFFERENT random tail characters frame-to-frame because each has its own Math.random() call. This is acceptable: the rest span is translateY(-100%) hidden during scramble (only the overlay is visible while highlighted), so the user only sees ONE scramble at a time. The "lockstep" requirement from the pilot was about visual coherence in the OVERLAY (which we still get from a single hook call inside that overlay's mount). The rest span's scramble is invisible during hover. If verification reveals visual issues (e.g. flicker on hover-out as both spans cross), document and consider hoisting back to a single hook call per row using a per-row `useScramble` call — but DO NOT premature-optimize. Try the simple approach first.

       Alternative single-hook-per-row pattern (apply IFF the dual-mount approach has visible artifacts):
       ```tsx
       // At top of map iteration body, after isHighlighted/isDimmed:
       // (each row gets one hook instance — N rows = N hooks, all idle when inactive)
       const labelNode = <ScrambledLabel text={item.label} active={isHighlighted} />
       ```
       Then both spans render `/{labelNode}` — IDENTICAL React element shared by both. Since React renders elements per-mount (not shared mounts), this still creates two `<ScrambledLabel>` instances. Same outcome as the inline approach. The ONLY way to truly share state is to call useScramble at the row level and pass {display, revealed} down — which is the original pilot pattern.

       DECISION: Default to the single-element-shared-via-labelNode approach (creates ONE element, React mounts it twice but the props are referentially equal per render). This is the same as inline `<ScrambledLabel ... />` in both spans. If artifacts appear, fall back to per-row useScramble + manual two-span fragment (matching pilot lines 117-132 but per-row).

       For this task, USE the inline approach (write `<ScrambledLabel text={item.label} active={isHighlighted} />` in both spans). It's the cleanest. Add a comment above the first usage:
       ```tsx
       {/* Scramble reveal — both rest and overlay spans mount their own ScrambledLabel.
           Only the overlay is visible during hover (rest is translateY-100% off-screen),
           so independent random tails are not user-visible. */}
       ```

    5. DO NOT touch:
       - The description span (item.description) — stays plain
       - The arrow span (single char →) — stays plain
       - The bar div, transitions, colors, dividers, KeyBadges, FloatingPreview, keyboard hints
       - useMenuNavigation, useInteractionMode, handleMouseMove, useInView

    6. Verify: `pnpm tsc --noEmit` exits 0. The file should be SHORTER than before (deleting more than adding).
  </behavior>
  <action>
    Edit src/components/sections/v2/MenuSection.tsx per &lt;behavior&gt;:
    - Replace useScramble import with ScrambledLabel import
    - Delete the firstItem/firstItemHighlighted/firstItemScramble block (and its 5-line comment header)
    - Delete the isScrambling/labelNode derivation block inside the map
    - Replace `/{labelNode}` (×2) with `/<ScrambledLabel text={item.label} active={isHighlighted} />`

    Then commit:
    ```bash
    node "$HOME/.claude/get-shit-done/bin/gsd-tools.cjs" commit "feat(quick-260503-nrv): apply ScrambledLabel to all MenuSection items" --files src/components/sections/v2/MenuSection.tsx
    ```
  </action>
  <verify>
    <automated>cd /Users/caioogata/Projects/portolio-v1 && grep -q "import { ScrambledLabel } from '@/components/motion/ScrambledLabel'" src/components/sections/v2/MenuSection.tsx && ! grep -q "import { useScramble }" src/components/sections/v2/MenuSection.tsx && ! grep -q "firstItemScramble" src/components/sections/v2/MenuSection.tsx && ! grep -q "firstItemHighlighted" src/components/sections/v2/MenuSection.tsx && ! grep -q "labelNode" src/components/sections/v2/MenuSection.tsx && test "$(grep -c "<ScrambledLabel" src/components/sections/v2/MenuSection.tsx)" -eq 2 && pnpm tsc --noEmit && echo "PASS"</automated>
  </verify>
  <done>
    MenuSection.tsx imports ScrambledLabel (not useScramble), no firstItemScramble / firstItemHighlighted / labelNode references remain, exactly 2 `<ScrambledLabel` element occurrences (one per text span — rest + overlay). pnpm tsc --noEmit exits 0.
  </done>
</task>

<task type="auto" tdd="false">
  <name>Task 3: Apply ScrambledLabel to ExperienceSection rows (company + title)</name>
  <files>src/components/sections/v2/ExperienceSection.tsx</files>
  <behavior>
    Edit src/components/sections/v2/ExperienceSection.tsx to apply `<ScrambledLabel>` to the masked-swap text spans on every row. Uses the existing `showLargeText` boolean (line 100, `isHighlighted || isExpanded`) as the active flag — matches the existing typography swap trigger.

    1. Add import at top alongside existing imports:
       ```ts
       import { ScrambledLabel } from '@/components/motion/ScrambledLabel'
       ```

    2. Inside the row map, find the FOUR `<span className="block truncate">` text renderings:
       - Line 254: `<span className="block truncate">{job.company}</span>` — rest line, company
       - Line 274: `<span className="block truncate">{job.company}</span>` — overlay (.type-overlay-hover), company
       - Line 309: `<span className="block truncate">{job.title}</span>` — rest line, title
       - Line 329: `<span className="block truncate">{job.title}</span>` — overlay (.type-overlay-hover), title

       Replace EACH with the ScrambledLabel-wrapped equivalent:
       ```tsx
       <span className="block truncate">
         <ScrambledLabel text={job.company} active={showLargeText} />
       </span>
       ```
       (For the two title occurrences, use `text={job.title}` instead.)

    3. DO NOT touch:
       - The arrow → on lines 197-198 (single-char, stays plain — parity with MenuSection arrow)
       - The font-mono date column (lines 218-220, 364-366) — stays plain
       - The mobile-only `md:hidden` block (lines 335-367) — stays plain text
       - The expand panel (description + achievements, lines 372-435) — body text, NOT in scope per requirement EXP-02
       - Bars, dividers, transitions, colors

    4. Verify: `pnpm tsc --noEmit` exits 0. Per-row, when `showLargeText` flips true on hover/focus or expand, BOTH the rest and overlay span text scramble (the rest span's scramble is hidden by translateY(-100%); the overlay span's scramble is what the user sees).

    5. Comment to add above the first `<ScrambledLabel>` insertion (just inside the company `<span className="relative block overflow-hidden">` wrapper at line 226):
       ```tsx
       {/* Scramble reveal — both rest and overlay spans mount ScrambledLabel.
           Only the overlay is visible during showLargeText (rest is translateY-100%),
           so independent random tails are not user-visible. */}
       ```

    Edge cases:
    - Very long titles (50+ chars) — scramble reveal time = N × 70ms. A 50-char title takes ~3.5s to fully resolve. The transition `transform 1s cubic-bezier(0.16,1,0.3,1)` finishes in 1s, so the slide-up settles BEFORE the scramble fully resolves on long titles. This is acceptable: the user sees the slide settle with scramble still finishing — matches the editorial reveal feel of the pilot.
    - Empty job.company / job.title — useScramble returns early (revealed=0=length=0), `scrambling` is false, ScrambledLabel renders `<>{''}</>`. No-op.
  </behavior>
  <action>
    Edit src/components/sections/v2/ExperienceSection.tsx per &lt;behavior&gt;:
    - Add `import { ScrambledLabel } from '@/components/motion/ScrambledLabel'`
    - Replace 4 `<span className="block truncate">{job.company OR job.title}</span>` with the ScrambledLabel-wrapped form
    - Add the explanatory comment above the first replacement

    Then commit:
    ```bash
    node "$HOME/.claude/get-shit-done/bin/gsd-tools.cjs" commit "feat(quick-260503-nrv): apply ScrambledLabel to ExperienceSection rows" --files src/components/sections/v2/ExperienceSection.tsx
    ```
  </action>
  <verify>
    <automated>cd /Users/caioogata/Projects/portolio-v1 && grep -q "import { ScrambledLabel } from '@/components/motion/ScrambledLabel'" src/components/sections/v2/ExperienceSection.tsx && test "$(grep -c "<ScrambledLabel" src/components/sections/v2/ExperienceSection.tsx)" -eq 4 && test "$(grep -c "text={job.company}" src/components/sections/v2/ExperienceSection.tsx)" -eq 2 && test "$(grep -c "text={job.title}" src/components/sections/v2/ExperienceSection.tsx)" -eq 2 && test "$(grep -c "active={showLargeText}" src/components/sections/v2/ExperienceSection.tsx)" -eq 4 && pnpm tsc --noEmit && echo "PASS"</automated>
  </verify>
  <done>
    ExperienceSection.tsx imports ScrambledLabel, has exactly 4 `<ScrambledLabel>` instances (2 company + 2 title), all driven by `active={showLargeText}`. Old plain `{job.company}` / `{job.title}` inside `<span className="block truncate">` no longer present in the masked-swap spans. pnpm tsc --noEmit exits 0.
  </done>
</task>

<task type="auto" tdd="false">
  <name>Task 4: Apply ScrambledLabel to button hover overlays + SkillsBlock</name>
  <files>src/components/sections/v2/StickyLogoBar.tsx, src/components/sections/v2/ProjectCard.tsx, src/components/sections/v2/ContactOverlay.tsx, src/components/sections/v2/FloatingContactButton.tsx, src/components/sections/v2/ContactForm.tsx, src/components/sections/v2/about/SkillsBlock.tsx</files>
  <behavior>
    Apply `<ScrambledLabel text={label} active={hoverState} />` to every `.type-overlay-hover` overlay span on production-surface buttons. The rest (non-overlay) span stays plain text — it's hidden during hover.

    UNIVERSAL PATTERN per file: import `ScrambledLabel`, then for each `.type-overlay-hover` span containing static label/icon text, wrap that text in `<ScrambledLabel text="..." active={hoverState} />`.

    Per-file edits:

    --- 4a. src/components/sections/v2/StickyLogoBar.tsx ---
    - Add `import { ScrambledLabel } from '@/components/motion/ScrambledLabel'`
    - Line 47-57 (ask about overlay): inside the `.type-overlay-hover` span, replace the literal text `ask about` with `<ScrambledLabel text="ask about" active={groupHovered} />`
    - Line 78-88 (× icon overlay): replace literal `×` with `<ScrambledLabel text="×" active={groupHovered} />`
    - Expected: 2 `<ScrambledLabel>` instances in this file.

    --- 4b. src/components/sections/v2/ProjectCard.tsx ---
    - Add the import.
    - Line 60-70 (arrow → overlay): replace literal `→` with `<ScrambledLabel text="→" active={arrowHovered} />`
    - Expected: 1 instance.

    --- 4c. src/components/sections/v2/ContactOverlay.tsx ---
    - Add the import.
    - 4 buttons + 1 sub-component with `.type-overlay-hover`:
      1. SubjectChip (line 71-84, inside `function SubjectChip`): overlay shows `{label}`. Replace with `<ScrambledLabel text={label} active={h} />`.
      2. Close pill in closeGroup (line 181-191): overlay shows literal `Close`. Replace with `<ScrambledLabel text="Close" active={groupHovered} />`.
      3. × icon button in closeGroup (line 210-220): overlay shows literal `×`. Replace with `<ScrambledLabel text="×" active={groupHovered} />`.
      4. SubmitButton component (line 454-466): overlay shows `{label}` prop. Replace with `<ScrambledLabel text={label} active={h} />`.
      5. ClearButton component (line 509-521): overlay shows literal `Clear`. Replace with `<ScrambledLabel text="Clear" active={h} />`.
    - Expected: 5 instances.

    --- 4d. src/components/sections/v2/FloatingContactButton.tsx ---
    - Add the import.
    - Line 134-143 (pill overlay): replace `{pillLabel}` with `<ScrambledLabel text={pillLabel} active={groupHovered} />`
    - Line 167-176 (square icon overlay): replace `{squareLabel}` with `<ScrambledLabel text={squareLabel} active={groupHovered} />`
    - Expected: 2 instances. NOTE: `pillLabel` and `squareLabel` flip values when `isOpen` changes — the scramble's `text` prop changes, and useScramble's effect deps include `text`, so it correctly resets and re-scrambles on the new label. Acceptable.

    --- 4e. src/components/sections/v2/ContactForm.tsx ---
    - Add the import.
    - SubjectChip overlay (line 73-87): replace `{label}` with `<ScrambledLabel text={label} active={h} />`
    - Submit button overlay (line 258-260): the JSX is dense — find the `.type-overlay-hover` span containing `{status === 'submitting' ? form.submitting : form.submitButton}`. Replace that expression with `<ScrambledLabel text={status === 'submitting' ? form.submitting : form.submitButton} active={submitHovered} />`.
    - Clear button overlay (line 274-276): the `.type-overlay-hover` span containing literal `Clear`. Replace with `<ScrambledLabel text="Clear" active={clearHovered} />`.
    - Expected: 3 instances.

    --- 4f. src/components/sections/v2/about/SkillsBlock.tsx ---
    - Add the import.
    - Skill name hover overlay (line 240-253, the `.type-overlay-hover` span containing `{skill.name}` inside an inner `<span className="block truncate">`): replace `{skill.name}` (in the inner span) with `<ScrambledLabel text={skill.name} active={isHovered} />`. Keep the wrapping `<span className="block truncate">` for layout.
    - Level label hover overlay (line 281-295, the `.type-overlay-hover` span at the bar's right edge): replace `{skill.level}` with `<ScrambledLabel text={skill.level} active={isHovered} />`.
    - Expected: 2 instances.

    --- 4g. src/components/sections/v2/StickyHeader.tsx ---
    - SKIP. Document in commit body: "Skipped StickyHeader.tsx — verified not imported anywhere (legacy file, dead code)."

    All 6 files in ONE commit per requirement COMMITS-01 (single "button overlay rollout" commit). Total expected `<ScrambledLabel>` instances added across these 6 files: 2 + 1 + 5 + 2 + 3 + 2 = 15.

    GLOBAL CONSTRAINTS:
    - DO NOT modify the rest (non-overlay) spans — only the spans with `className="... type-overlay-hover"`.
    - DO NOT change any timing, easing, transform, opacity, color, or className OTHER than the text content.
    - DO NOT touch SubmitButton's loading-state logic (`disabled={submitting}`, `disabled={status === 'submitting'}`) — only the overlay's text expression.
    - DO NOT add `'use client'` — every file in scope already has it.
    - For icon-only overlays (`×`, `+`, `→`): apply ScrambledLabel as designed (per BTN-02). Single-char scramble means the hook resolves in ~70ms (1 char × 2 stepMs × 35ms = 70ms). The visual effect is a brief 1-frame flicker — consistent pattern, treat as desired. If post-implementation visual review surfaces it as unpleasant, document the decision and roll back ICON-only application via a follow-up commit (do NOT mix that decision into this rollout).
    - SubjectChip's overlay shows the label only when `!selected && h`. The active prop should still be `h` (only meaningful when overlay is visible — useScramble harmlessly idles when active=false).

    Verify: `pnpm tsc --noEmit` exits 0. Smoke counts (per &lt;verify&gt;) confirm expected instance counts per file.
  </behavior>
  <action>
    Edit each of the 6 files per &lt;behavior&gt;. Each file gets the same import added + N text-content replacements. ONE commit covers all 6 files:

    ```bash
    node "$HOME/.claude/get-shit-done/bin/gsd-tools.cjs" commit "feat(quick-260503-nrv): apply ScrambledLabel to button hover overlays" --files src/components/sections/v2/StickyLogoBar.tsx src/components/sections/v2/ProjectCard.tsx src/components/sections/v2/ContactOverlay.tsx src/components/sections/v2/FloatingContactButton.tsx src/components/sections/v2/ContactForm.tsx src/components/sections/v2/about/SkillsBlock.tsx
    ```

    Commit body should note: "Skipped StickyHeader.tsx — not imported anywhere (legacy)."
  </action>
  <verify>
    <automated>cd /Users/caioogata/Projects/portolio-v1 && test "$(grep -c "<ScrambledLabel" src/components/sections/v2/StickyLogoBar.tsx)" -eq 2 && test "$(grep -c "<ScrambledLabel" src/components/sections/v2/ProjectCard.tsx)" -eq 1 && test "$(grep -c "<ScrambledLabel" src/components/sections/v2/ContactOverlay.tsx)" -eq 5 && test "$(grep -c "<ScrambledLabel" src/components/sections/v2/FloatingContactButton.tsx)" -eq 2 && test "$(grep -c "<ScrambledLabel" src/components/sections/v2/ContactForm.tsx)" -eq 3 && test "$(grep -c "<ScrambledLabel" src/components/sections/v2/about/SkillsBlock.tsx)" -eq 2 && grep -q "import { ScrambledLabel } from '@/components/motion/ScrambledLabel'" src/components/sections/v2/StickyLogoBar.tsx && grep -q "import { ScrambledLabel } from '@/components/motion/ScrambledLabel'" src/components/sections/v2/ProjectCard.tsx && grep -q "import { ScrambledLabel } from '@/components/motion/ScrambledLabel'" src/components/sections/v2/ContactOverlay.tsx && grep -q "import { ScrambledLabel } from '@/components/motion/ScrambledLabel'" src/components/sections/v2/FloatingContactButton.tsx && grep -q "import { ScrambledLabel } from '@/components/motion/ScrambledLabel'" src/components/sections/v2/ContactForm.tsx && grep -q "import { ScrambledLabel } from '@/components/motion/ScrambledLabel'" src/components/sections/v2/about/SkillsBlock.tsx && pnpm tsc --noEmit && echo "PASS"</automated>
  </verify>
  <done>
    All 6 files import ScrambledLabel. Instance counts match: StickyLogoBar=2, ProjectCard=1, ContactOverlay=5, FloatingContactButton=2, ContactForm=3, SkillsBlock=2 (total 15). pnpm tsc --noEmit exits 0. StickyHeader.tsx unchanged (skip documented in commit body).
  </done>
</task>

<task type="checkpoint:human-verify" gate="blocking">
  <name>Task 5: Visual validation — production surface scramble rollout</name>
  <files>(no files modified — visual verification only)</files>
  <action>
    Pause execution. Do not proceed to the optional dev/buttons playground commit (Task 6) until the user has visually approved the production-surface rollout. If approved, Task 6 may proceed; if any axis fails, the executor returns to the corresponding task to revise.
  </action>
  <verify>
    <automated>echo "MANUAL — see how-to-verify; user must approve before optional dev/buttons playground commit"</automated>
  </verify>
  <done>User types "approved" after the checks below pass. Otherwise the user describes which surface (Menu / Experience / StickyLogoBar / ProjectCard / ContactOverlay / FloatingContactButton / ContactForm / SkillsBlock) and which axis (timing / typography contrast / single-char flicker / regression) needs adjustment.</done>
  <what-built>
    - ScrambledLabel component at src/components/motion/ScrambledLabel.tsx — encapsulates useScramble + typography swap (mono/sans) per pilot c7514bd.
    - MenuSection: ALL items scramble on highlight (was: only first item).
    - ExperienceSection: company + title scramble on highlight/expand on every row.
    - 6 button-overlay surfaces (StickyLogoBar, ProjectCard, ContactOverlay, FloatingContactButton, ContactForm, SkillsBlock) — every `.type-overlay-hover` span scrambles its label on hover.
    - StickyHeader.tsx skipped (dead code, not imported).
  </what-built>
  <how-to-verify>
    1. Run `pnpm dev`. Open http://localhost:3000.

    2. **MenuSection — all rows**: Hover each menu row in turn (mouse + keyboard ↓↑). Expect every row's label to scramble on highlight, with resolved chars rendering in font-mono and the unresolved tail in font-sans, settling left-to-right over ~N×70ms (e.g. "experience" 10 chars ≈ 700ms). Hover-off snaps back to plain text instantly. Items 2..N should now match index 0's pilot behavior exactly.

    3. **MenuSection regression check**: The masked vertical text-swap (translateY -100%/0/100%), the yellow background bar (scaleX/scaleY/opacity), the arrow → reveal (width 0→2rem), the description's masked swap, color transitions, dividers — ALL unchanged. The FloatingPreview cursor-follow image still works. Keyboard navigation (↑↓/Enter/Esc, type-to-filter) still works.

    4. **Navigate to /experience**: Hover each experience row. Expect company + title to scramble in the overlay span (the larger mono text that slides up on hover). The yellow bar bleed, the arrow, the date (font-mono, plain), the slide-up should all behave as before. Click a row to EXPAND — `showLargeText` stays true while expanded, so the company + title remain in their scrambled-then-resolved state inside the expanded panel. The accordion expand grid trick, achievements layout, and reduced-motion behavior should be unchanged.

    5. **Navigate back to /. ProjectCard hover**: Each project card has an arrow → button bottom-right. Hover the arrow. Expect a brief single-char scramble (1-2 frames) then settle to →. If this looks like a flicker rather than an effect, document for the user and consider rolling back icon-only application in a follow-up.

    6. **StickyLogoBar (top-of-page CTA)**: Hover the "ask about" pill. Both the pill label AND the × icon (within the same `groupHovered` group) should scramble together (per the existing 0.1s composition delay on the icon). Visual: "ask about" reveals over ~9 chars × 70ms = 630ms; × is single-char ~70ms (effectively a flicker). Acceptable per BTN-02.

    7. **FloatingContactButton (FAB)**: Scroll past the StickyLogoBar's `ask about` to reveal the FAB at bottom-right. Hover the "Contact" pill — scrambles. Click to open ContactOverlay — the FAB morphs to "Close"; hover again — "Close" scrambles. The icon (+ ↔ ×) flickers like other single-char overlays. Per BTN-02.

    8. **ContactOverlay (open it via FAB or via menu Contact)**: Hover Submit, Clear, Close pill, × icon — all scramble. SubjectChip hover (on unselected chips) — chip label scrambles (label, e.g. "Job opportunity").

    9. **ContactForm (footer-embedded form, if reachable)**: Submit + Clear + SubjectChip hover scrambles. Same expectations as ContactOverlay.

    10. **/about — SkillsBlock**: Hover a category header to expand the accordion. Inside, hover any skill row. Expect the skill name to scramble in the mono overlay (1.25rem) AND the level label (Expert / Advanced / Proficient / Familiar) to scramble at the bar's right edge — both driven by the same `isHovered` state. The yellow bar bleed (0.6s ease-out), the level-mapped width (95/75/55/35%), the row-level hover swap timing should be unchanged. If the accordion sweep (mouseEnter → onOpen) hover-fires the scramble too aggressively as the user scans, document and consider rolling back SkillsBlock.

    11. **Reduced-motion check**: DevTools → Rendering → Emulate prefers-reduced-motion: reduce. Hard refresh. Hover any surface — useScramble hook does NOT internally check reduced-motion (per the pilot's deliberate scope choice), so scramble still fires. This is expected. The Lenis smooth scroll IS bypassed (via PageShell gate). If the user prefers scramble to also bypass under reduced-motion, that's a separate change to useScramble itself (out of scope here).

    12. **TypeScript + build**: Verify `pnpm tsc --noEmit` exits 0 (already verified per task — confirm again at the end).

    13. **No interval leaks**: Hover Menu row → off → on → off ~10 times rapidly. Hover ContactOverlay buttons rapidly. DevTools Performance → no growing timer count. The hook's cleanup (useScramble:80-86) clears the interval on unmount AND on active=false transition.

    14. **Atomic rollback test (optional sanity check)**: `git revert {Task 4 commit}` should restore all button overlays to plain text without affecting MenuSection or ExperienceSection. Then `git revert` it back. Each commit is independently reversible per requirement COMMITS-01.

    Acceptance criteria:
    - All MenuSection rows scramble on hover (regression-free for non-scramble visuals).
    - All ExperienceSection rows scramble company + title on hover/expand.
    - All listed button overlays scramble on hover.
    - SkillsBlock skill-name + level-label scramble (or document a rollback decision).
    - StickyHeader.tsx unchanged (dead code).
    - No interval leaks across rapid toggling.
    - pnpm tsc --noEmit exits 0.
    - Visual coherence: typography swap (mono = resolved, sans = unresolved) reads as the same effect across surfaces.

    If any axis fails:
    - Single-char icon scramble too noisy → revert ICON-only `<ScrambledLabel>` instances (×, +, →) in a follow-up commit; keep label-text scramble.
    - SkillsBlock accordion sweep too noisy → revert SkillsBlock changes only.
    - Specific surface visually broken → revert that surface's commit (or hunk within Task 4 commit) and re-plan.
    - Typography contrast unreadable on some surface → likely a CSS specificity issue with the wrapping `<span>` in the surface's overlay; investigate per-surface (likely fix: ensure no `font-mono`/`font-sans` class on a parent overrides the ScrambledLabel children).
  </how-to-verify>
  <resume-signal>
    Type "approved" if all surfaces pass. Otherwise describe: which surface (Menu / Experience / specific button), which axis (timing / typography / icon-flicker / regression), and any preferred rollback (e.g. "revert SkillsBlock only — accordion sweep too noisy"). On "approved", Task 6 (dev/buttons playground) MAY proceed.

    Rollback markers:
    - `c7514bd` — post-pilot, pre-rollout (this rollout's safety floor).
    - `pre-lenis-scramble` (f98294f) — entire scramble feature floor; do NOT touch.
  </resume-signal>
</task>

<task type="auto" tdd="false">
  <name>Task 6 (OPTIONAL): Apply ScrambledLabel to dev/buttons playground</name>
  <files>src/app/dev/buttons/page.tsx</files>
  <behavior>
    OPTIONAL — only proceed if Task 5 returned "approved" with no surface-level concerns. If the user flagged any production-surface issue, SKIP this task until that's resolved.

    Apply `<ScrambledLabel>` to all `.type-overlay-hover` overlay spans in the dev playground for visual consistency in development preview.

    1. Add `import { ScrambledLabel } from '@/components/motion/ScrambledLabel'`.

    2. Replace the literal text inside every `.type-overlay-hover` span with the wrapped form. The playground has these button variants (each appears once in the function definition, used multiple times in the JSX):
       - PrimaryPill (line 96): overlay shows `{label}` — replace with `<ScrambledLabel text={label} active={h} />`
       - PrimarySquared (line 113): same — `<ScrambledLabel text={label} active={h} />`
       - PrimaryIconOnly (line 130): overlay shows `{icon}` — replace with `<ScrambledLabel text={icon} active={h} />`
       - PrimaryComposition (line 148): TWO buttons sharing one `h` state. Outer button overlay shows `{label}`; inner button shows `{icon}`. Wrap both: `<ScrambledLabel text={label} active={h} />` and `<ScrambledLabel text={icon} active={h} />`.
       - SecondaryPill (line 184): `<ScrambledLabel text={label} active={h} />`
       - SecondarySquared (line 203): `<ScrambledLabel text={label} active={h} />`
       - SecondaryIconOnly (line 222): `<ScrambledLabel text={icon} active={h} />`
       - SecondaryComposition (line 243): outer label + inner `rotatedIcon`. The icon is conditionally `<span style={{transform: rotate}}>icon</span>` or just `icon` (string). For ScrambledLabel we need a string `text`, NOT a React node. So the inner button stays as `{rotatedIcon}` PLAIN inside the overlay — DOCUMENT in the file as: "Composition icon overlay stays plain (rotated `<span>` is not a string — ScrambledLabel takes string). Acceptable for dev playground." OR replace with `<ScrambledLabel text={icon} active={h} />` and accept that the ROTATION is lost in the overlay. The cleaner choice: keep the rotation, skip ScrambledLabel for SecondaryComposition's inner button. Apply to outer button (label) only.
       - Total instances expected: 1 (PrimaryPill) + 1 (PrimarySquared) + 1 (PrimaryIconOnly) + 2 (PrimaryComposition) + 1 (SecondaryPill) + 1 (SecondarySquared) + 1 (SecondaryIconOnly) + 1 (SecondaryComposition outer; inner skipped to preserve rotation) = 9

    3. The page renders ALL variants 3× (Dark / Light / Inverse themes). The component-level changes apply across themes — only 9 unique `<ScrambledLabel>` text occurrences in the file (the JSX usage doesn't add more — it just instantiates the components multiple times).

    4. Verify: `pnpm tsc --noEmit` exits 0. Open http://localhost:3000/dev/buttons in browser — every button overlay scrambles on hover (except SecondaryComposition icon, which keeps its rotation animation).

    5. Document in commit body: "SecondaryComposition icon overlay kept plain to preserve rotation animation — ScrambledLabel takes string, not ReactNode."
  </behavior>
  <action>
    Edit src/app/dev/buttons/page.tsx per &lt;behavior&gt;. Then commit:

    ```bash
    node "$HOME/.claude/get-shit-done/bin/gsd-tools.cjs" commit "feat(quick-260503-nrv): apply ScrambledLabel in dev/buttons playground" --files src/app/dev/buttons/page.tsx
    ```
  </action>
  <verify>
    <automated>cd /Users/caioogata/Projects/portolio-v1 && grep -q "import { ScrambledLabel } from '@/components/motion/ScrambledLabel'" src/app/dev/buttons/page.tsx && test "$(grep -c "<ScrambledLabel" src/app/dev/buttons/page.tsx)" -eq 9 && pnpm tsc --noEmit && echo "PASS"</automated>
  </verify>
  <done>
    src/app/dev/buttons/page.tsx imports ScrambledLabel and has exactly 9 `<ScrambledLabel>` instances. pnpm tsc --noEmit exits 0. Visual: hovering any variant in the playground (Dark/Light/Inverse) scrambles the label per the same pattern as production surfaces.
  </done>
</task>

</tasks>

<verification>
  - `pnpm tsc --noEmit` exits 0 after each commit (Task 1, Task 2, Task 3, Task 4, Task 6 if executed)
  - Task 1: src/components/motion/ScrambledLabel.tsx exists, exports ScrambledLabel, 'use client', font-mono + font-sans + useScramble references
  - Task 2: MenuSection.tsx imports ScrambledLabel (not useScramble), no firstItemScramble/firstItemHighlighted/labelNode references, exactly 2 `<ScrambledLabel>` instances
  - Task 3: ExperienceSection.tsx imports ScrambledLabel, exactly 4 `<ScrambledLabel>` instances (2 company + 2 title), all driven by `active={showLargeText}`
  - Task 4: 6 files import ScrambledLabel, instance counts: StickyLogoBar=2, ProjectCard=1, ContactOverlay=5, FloatingContactButton=2, ContactForm=3, SkillsBlock=2 (total 15)
  - Task 6 (optional): dev/buttons/page.tsx imports ScrambledLabel, 9 instances
  - StickyHeader.tsx UNCHANGED (dead code — skipped per BTN-03)
  - Manual: each surface (Menu / Experience / each button surface) scrambles correctly on hover with the typography swap (mono=resolved, sans=unresolved); regression-free for all non-scramble visuals
  - Manual: no interval leaks across rapid hover toggling
  - Manual: each commit is independently revertible (atomic per surface)
</verification>

<success_criteria>
  - ScrambledLabel is a single source of truth for the scramble + typography-swap pattern across the entire V2 surface area
  - MenuSection, ExperienceSection, and all production button overlays use the component — no inline duplication of the scramble plumbing remains anywhere
  - Default useScramble opts (stepMs 35, charPool ABC...!@#$%) used everywhere — no per-surface variants
  - 4-5 atomic commits land in order: extract → MenuSection → ExperienceSection → buttons → (optional) dev/buttons
  - Validation gate (Task 5) holds firm before optional Task 6 runs
  - Rollback markers preserved: c7514bd is the new safety floor for this rollout; pre-lenis-scramble (f98294f) untouched
  - No regressions: vertical-translate masked swap, fill animations, color transitions, accordion behavior, sticky header, FAB visibility, all unchanged
</success_criteria>

<output>
After Task 5 approval (and optional Task 6 commit), create the SUMMARY:

```
.planning/quick/260503-nrv-roll-out-scramble-pattern-to-all-menusec/260503-nrv-SUMMARY.md
```

SUMMARY should document:
- ScrambledLabel component contract (props, internal hook usage, two-span typography swap, plain-text settled state)
- Per-surface application: MenuSection (all rows), ExperienceSection (company+title, both rest+overlay spans), 6 button-overlay surfaces with instance counts, optional dev/buttons playground
- Out-of-scope confirmation: timing/charPool defaults unchanged, non-hover surfaces excluded, useScrollReveal/Expand migration deferred, Lenis tuning deferred, About-page block animations untouched
- Skipped surfaces: StickyHeader.tsx (dead code, not imported); document any post-implementation rollbacks (e.g. icon-only flicker rollback or SkillsBlock rollback)
- Rollback markers: c7514bd (this rollout's safety floor); pre-lenis-scramble (f98294f) (entire feature floor)
- Verification trail: per-task automated grep counts + pnpm tsc clean + per-surface visual checks
- Total instances: ScrambledLabel = 1 (Menu refactor uses 2) + 4 (Experience) + 15 (buttons) [+ 9 (dev playground if Task 6 done)] = 21 [or 30 with playground]
</output>
