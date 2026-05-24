---
phase: 260429-thh
plan: quick
type: execute
wave: 1
depends_on: []
files_modified:
  - src/app/globals.css
  - src/components/sections/v2/about/BioBlock.tsx
  - src/components/sections/v2/about/SkillsBlock.tsx
  - src/components/sections/v2/about/ClientsBlock.tsx
  - src/components/sections/v2/about/EducationBlock.tsx
autonomous: false
requirements:
  - REVEAL-01 — Add `-mask-down` (clip-path top→bottom) entrance variant
  - REVEAL-02 — Add `-mask-right` (clip-path left→right) entrance variant for numerals
  - REVEAL-03 — Add `-line-x` (scaleX from left) entrance variant for divider rules
  - REVEAL-04 — Add `.-flow` modifier that overrides `-a-N` stagger to reading cadence (~150–180ms)
  - REVEAL-05 — Apply layered reveal (frame → title → body) on BioBlock body paragraphs + final quote (mask-down + .-flow)
  - REVEAL-06 — Apply Camada 1 (mask-right on numeral) on all four /about blocks (Bio, Skills, Clients, Education)
  - REVEAL-07 — Apply mask-down on ClientsBlock short description (single body paragraph case)
  - REVEAL-08 — Keep grid-rhythm (`-slide-up -a-N` @ 70ms) on Skills accordion rows, Clients logo grid, Education timeline rows
  - REVEAL-09 — Honour `prefers-reduced-motion` (no transition, final state)
  - REVEAL-10 — IntroSection + AboutPinned remain untouched

must_haves:
  truths:
    - "On /about scroll, BioBlock numeral '1.1 / Bio' enters via left→right clip-path reveal (not slide-up)"
    - "BioBlock middle paragraphs and final quote enter via top→bottom mask reveal, paced ~150–180ms apart (reading cadence, not 70ms grid cadence)"
    - "ClientsBlock numeral '1.3 / Notable Clients' uses mask-right; the short description below uses mask-down"
    - "Skills + Clients + Education list-rows still enter with the existing -slide-up -a-N 70ms grid rhythm (untouched)"
    - "SkillsBlock and EducationBlock numerals (1.2, 1.4) reveal via mask-right before their lists begin"
    - "With prefers-reduced-motion: reduce, all entrance content is visible at final state with no transition"
    - "IntroSection (home) and AboutPinned (sticky video) are unchanged — no regressions"
  artifacts:
    - path: "src/app/globals.css"
      provides: "New `-mask-down`, `-mask-right`, `-line-x` entrance variants + `.-flow` stagger override + `--ease-fiddle` token"
      contains: "-entrance.-mask-down"
    - path: "src/components/sections/v2/about/BioBlock.tsx"
      provides: "Mask-right numeral, .-flow body paragraphs with -mask-down, mask-down final quote"
    - path: "src/components/sections/v2/about/SkillsBlock.tsx"
      provides: "Mask-right numeral; accordion rows keep -slide-up"
    - path: "src/components/sections/v2/about/ClientsBlock.tsx"
      provides: "Mask-right numeral, mask-down short description; logo grid keeps -fade"
    - path: "src/components/sections/v2/about/EducationBlock.tsx"
      provides: "Mask-right numeral; timeline rows keep -slide-up"
  key_links:
    - from: "src/components/sections/v2/about/BioBlock.tsx"
      to: "src/app/globals.css"
      via: ".-entrance.-mask-down + .-flow > .-entrance.-a-N classes"
      pattern: "-entrance -mask-down|-flow"
    - from: "src/hooks/useInView.ts"
      to: "all four about blocks"
      via: ".-inview class added to root, descendants with .-entrance variants activate"
      pattern: "-inview"
---

<objective>
Implement a layered content-reveal system on /about as the site standard:
  - Camada 1 (numeral frame): `-entrance -mask-right -a-0` reveals "1.1 / Bio", "1.2 / Skills", "1.3 / Notable Clients", "1.4 / Education" via clip-path left→right
  - Camada 2 (title): N/A in /about — these blocks have no `<h2>` title; the numeral IS the head of the entrance
  - Camada 3 (reading body): `-entrance -mask-down` on body paragraphs (BioBlock middle paragraphs + final quote, ClientsBlock short description), wrapped in a `.-flow` parent that overrides `-a-N` to a reading cadence (~150–180ms) instead of the 70ms grid cadence
  - Lists/cards (Skills accordion rows, Clients logo wall, Education timeline rows) KEEP existing `-entrance -slide-up -a-N` 70ms grid rhythm — they are NOT reading body, they are grid rhythm

Out of scope: IntroSection.tsx, AboutPinned.tsx, /experience, /projects/*, footer, menu. After validation, this pattern will be replicated to /experience and /projects.

Purpose: BioBlock + downstream blocks currently "estouram" — every `<p>` slides up at once via 70ms stagger. That cadence works for grids/cards but feels abrupt for editorial body content. We need a reading-paced layered reveal that feels like opening a printed document, not a slot-machine.

Output: One CSS infrastructure update (globals.css) + four /about block components updated. Visual checkpoint before replication.
</objective>

<execution_context>
@$HOME/.claude/get-shit-done/workflows/execute-plan.md
@$HOME/.claude/get-shit-done/templates/summary.md
</execution_context>

<context>
@.planning/STATE.md
@./CLAUDE.md
@src/app/globals.css
@src/tokens/semantic.css
@src/hooks/useInView.ts
@src/components/sections/v2/about/BioBlock.tsx
@src/components/sections/v2/about/SkillsBlock.tsx
@src/components/sections/v2/about/ClientsBlock.tsx
@src/components/sections/v2/about/EducationBlock.tsx

<interfaces>
<!-- Existing animation infrastructure that the new variants must integrate with. Extracted from src/app/globals.css. -->

Existing easing tokens (in :root, line ~210):
```css
--ease-out:    cubic-bezier(0.22, 0.31, 0, 1);
--ease-in:     cubic-bezier(0.69, 0, 0, 1);
--ease-smooth: cubic-bezier(0.5, 0, 0.3, 1);
```
Note: `--ease-fiddle: cubic-bezier(0.16, 1, 0.3, 1)` does NOT exist yet. Add it.

Existing loading gate (line ~217):
```css
html:not(.-ready) .-entrance {
  opacity: 0 !important;
  transform: none !important;
  transition: none !important;
}
```
Note: this gate uses `transform: none` and zeroes opacity/transition. For `-mask-down` and `-mask-right` we ALSO need `clip-path: inset(...)` to be the pre-loaded state. Since the rule already sets `transition: none`, the variant's clip-path will sit at its declared default until `.-ready` releases — this is correct behaviour (no flash, no transition, instant final-state on .-loaded.-ready .-inview).

Existing entrance variants (line ~224 onward):
```css
.-entrance.-slide-up { opacity: 0; transform: translateY(4rem); transition: opacity 0.9s var(--ease-out), transform 0.9s var(--ease-out); }
.-entrance.-slide-up.-inview,
.-inview > .-entrance.-slide-up,
.-inview .-entrance.-slide-up { opacity: 1; transform: translateY(0); }
```
The new `-mask-down` / `-mask-right` / `-line-x` variants follow the SAME triple-selector pattern (self-inview OR parent-inview OR ancestor-inview).

Existing stagger map (line ~274):
```css
.-a-0  { transition-delay: 150ms; }
.-a-1  { transition-delay: 220ms; }
... (70ms increments through .-a-20 at 1550ms)
```
New `.-flow` modifier OVERRIDES this map for descendants only — the global `-a-N` map remains the grid cadence.

Existing global reduced-motion (line ~94 in globals.css):
```css
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    transition-duration: 0.01ms !important;
    ...
  }
}
```
This already collapses all transitions. New variants automatically inherit this. No additional override needed unless we want to also force `clip-path: inset(0)` final state regardless of `-inview` (we do — defensive).

useInView (src/hooks/useInView.ts):
```typescript
export function useInView(options?: { threshold?: number, rootMargin?: string, once?: boolean })
  : RefObject<HTMLElement>
```
Adds `-inview` class on the observed element when 10% intersects (default). Descendant CSS `.-inview .-entrance.{variant}` activates the variant. All four about blocks already wire `useInView` to their root container — verified.
</interfaces>
</context>

<tasks>

<task type="auto" tdd="false">
  <name>Task 1: Extend animation system in globals.css with mask-down / mask-right / line-x variants and .-flow stagger override</name>
  <files>src/app/globals.css</files>
  <behavior>
    Read globals.css. The V2 Animation System block starts at line 209 (`/* ═══ V2 Animation System ═══ */`).

    Add the following AFTER the existing `:root { --ease-out... }` block (line ~214), BEFORE the loading gate:

    ```css
    :root {
      --ease-fiddle: cubic-bezier(0.16, 1, 0.3, 1);
    }
    ```
    (Append this declaration to the existing `:root` block at line ~210 instead of duplicating the selector.)

    Add the following AFTER the existing `.-entrance.-fade` block (line ~258), BEFORE `/* Page enter */`:

    ```css
    /* Entrance: mask down — clip-path top→bottom reveal + small lift. Used for body paragraphs / titles. */
    .-entrance.-mask-down {
      opacity: 1;
      clip-path: inset(0 0 100% 0);
      transform: translateY(6px);
      transition: clip-path 0.9s var(--ease-fiddle), transform 0.9s var(--ease-fiddle);
    }
    .-entrance.-mask-down.-inview,
    .-inview > .-entrance.-mask-down,
    .-inview .-entrance.-mask-down {
      clip-path: inset(0);
      transform: translateY(0);
    }

    /* Entrance: mask right — clip-path left→right reveal. Used for numerals / kickers. */
    .-entrance.-mask-right {
      opacity: 1;
      clip-path: inset(0 100% 0 0);
      transition: clip-path 0.6s var(--ease-fiddle);
    }
    .-entrance.-mask-right.-inview,
    .-inview > .-entrance.-mask-right,
    .-inview .-entrance.-mask-right {
      clip-path: inset(0);
    }

    /* Entrance: scaleX line — for top-section divider rules (transform-origin: left). */
    .-entrance.-line-x {
      opacity: 1;
      transform: scaleX(0);
      transform-origin: left center;
      transition: transform 0.5s var(--ease-fiddle);
    }
    .-entrance.-line-x.-inview,
    .-inview > .-entrance.-line-x,
    .-inview .-entrance.-line-x {
      transform: scaleX(1);
    }
    ```

    Then, AFTER the existing stagger map ending at `.-a-20 { transition-delay: 1550ms; }` (line ~294), add the reading-cadence override:

    ```css
    /* Reading-flow stagger override — replaces 70ms grid cadence with reading pace.
       Apply `.-flow` to a parent of `.-entrance` body content (e.g. wrapper around <p> stack).
       Descendants with `-a-N` get reading-paced delays (~150–180ms increments) instead of the global 70ms. */
    .-flow > .-entrance.-a-0,  .-flow .-entrance.-a-0  { transition-delay: 0ms; }
    .-flow > .-entrance.-a-1,  .-flow .-entrance.-a-1  { transition-delay: 180ms; }
    .-flow > .-entrance.-a-2,  .-flow .-entrance.-a-2  { transition-delay: 350ms; }
    .-flow > .-entrance.-a-3,  .-flow .-entrance.-a-3  { transition-delay: 510ms; }
    .-flow > .-entrance.-a-4,  .-flow .-entrance.-a-4  { transition-delay: 660ms; }
    .-flow > .-entrance.-a-5,  .-flow .-entrance.-a-5  { transition-delay: 800ms; }
    .-flow > .-entrance.-a-6,  .-flow .-entrance.-a-6  { transition-delay: 930ms; }
    .-flow > .-entrance.-a-7,  .-flow .-entrance.-a-7  { transition-delay: 1050ms; }
    .-flow > .-entrance.-a-8,  .-flow .-entrance.-a-8  { transition-delay: 1160ms; }
    .-flow > .-entrance.-a-9,  .-flow .-entrance.-a-9  { transition-delay: 1260ms; }
    .-flow > .-entrance.-a-10, .-flow .-entrance.-a-10 { transition-delay: 1350ms; }
    ```

    Finally, add a defensive reduced-motion block (the global one at line ~94 already zeroes transition-duration to 0.01ms which is sufficient, but force final-state to avoid any clip-path/transform residue):

    ```css
    @media (prefers-reduced-motion: reduce) {
      .-entrance.-mask-down,
      .-entrance.-mask-right,
      .-entrance.-line-x {
        clip-path: inset(0) !important;
        transform: none !important;
      }
    }
    ```

    DO NOT modify the existing `--ease-out`, `-slide-up`, `-scale-in`, `-fade`, `-page-enter`, or `-a-0..-a-20` rules. DO NOT remove the existing global reduced-motion block.

    Verify: grep confirms all 4 new selector groups present.
  </behavior>
  <action>
    Open src/app/globals.css. Locate the V2 Animation System block (line ~209). Apply edits as described in &lt;behavior&gt;:
    1. Add `--ease-fiddle: cubic-bezier(0.16, 1, 0.3, 1);` inside the existing `:root` declaration at line ~210
    2. Insert `.-mask-down`, `.-mask-right`, `.-line-x` variant blocks after `.-fade` (line ~258)
    3. Insert `.-flow` stagger override after `.-a-20` (line ~294)
    4. Append a defensive `@media (prefers-reduced-motion: reduce)` block forcing `clip-path: inset(0)` and `transform: none` for the new variants

    No JS/TSX changes in this task. Pure CSS extension.
  </action>
  <verify>
    <automated>cd /Users/caioogata/Projects/portolio-v1 &amp;&amp; grep -E "(-mask-down|-mask-right|-line-x|--ease-fiddle|\.-flow .-entrance)" src/app/globals.css | wc -l | awk '{ if ($1 &gt;= 12) print "PASS"; else print "FAIL: only " $1 " matches" }' &amp;&amp; pnpm tsc --noEmit</automated>
  </verify>
  <done>
    grep finds at least 12 occurrences (4 selector groups × ~3 lines each + token + flow rules), pnpm tsc --noEmit exits 0, no existing rules removed/altered.
  </done>
</task>

<task type="auto" tdd="false">
  <name>Task 2: Apply layered reveal pattern to BioBlock + SkillsBlock + ClientsBlock + EducationBlock</name>
  <files>src/components/sections/v2/about/BioBlock.tsx, src/components/sections/v2/about/SkillsBlock.tsx, src/components/sections/v2/about/ClientsBlock.tsx, src/components/sections/v2/about/EducationBlock.tsx</files>
  <behavior>
    For each of the four blocks, the section numeral label gets `-entrance -mask-right -a-0`. The reading body (where it exists) gets `-mask-down` paragraphs inside a `.-flow` parent. Lists/cards keep their existing `-slide-up -a-N` 70ms grid rhythm (no change). All blocks already wire `useInView` to their root content `<div>` — that ref provides the `-inview` class for descendants.

    --- BioBlock.tsx ---
    Existing label (line 42-44):
    ```jsx
    <span className="font-mono text-xs uppercase tracking-[0.88px] text-text-tertiary">
      1.1 / Bio
    </span>
    ```
    Change to:
    ```jsx
    <span className="-entrance -mask-right -a-0 inline-block font-mono text-xs uppercase tracking-[0.88px] text-text-tertiary">
      1.1 / Bio
    </span>
    ```
    (`inline-block` is required — clip-path on inline elements is unreliable.)

    Body paragraphs wrapper (line 75 — `<div className="flex flex-col gap-6">`):
    Add `.-flow` to enable reading cadence on its descendants. Change paragraph variant from `-slide-up` to `-mask-down`. Index unchanged. Keep `Math.min(i, 19)` cap (we only have flow stagger up to -a-10 but capping at 19 is harmless — anything beyond -a-10 falls back to grid cadence, which for a single block is fine):

    ```jsx
    <div className="flex flex-col gap-6 -flow">
      {middleParagraphs.map((paragraph, i) => (
        <p
          key={i}
          className={`-entrance -mask-down -a-${Math.min(i, 10)} text-[24px] font-semibold leading-[1.3] text-text-secondary`}
          style={{ fontFamily: 'var(--font-sans)' }}
        >
          {paragraph}
        </p>
      ))}
    </div>
    ```
    Note: cap at 10 (not 19) because `.-flow` map ends at `-a-10`. Anything beyond falls back to global 70ms cadence which would feel jarring inside a flow group — but BioBlock has at most 4–5 middle paragraphs in current copy, so cap at 10 is generous.

    Final quote (line 91-105) — currently `-entrance -slide-up -a-${...}` outside the body wrapper. Wrap it in its own `.-flow` so its mask-down still uses reading cadence (single child, so just `-a-0` is enough). Or keep it outside flow and use `-a-0` of the global map (would give 150ms delay). Decision: place final quote AT INDEX `middleParagraphs.length` INSIDE the same `.-flow` wrapper for continuity — replace the existing flex column with a flex column that includes the final quote at the end:

    Actually, the current structure has `finalQuote` rendered OUTSIDE the GridItem (full-width). We MUST keep that layout (full 12 cols vs cols 5-12). So treat finalQuote as its own flow group:

    ```jsx
    {finalQuote &amp;&amp; (
      <div className="-flow mt-16 md:mt-20">
        <p
          className="-entrance -mask-down -a-0 text-text-secondary"
          style={{
            fontFamily: 'var(--font-sans)',
            fontSize: '3rem',
            lineHeight: 1.15,
            letterSpacing: '-0.96px',
            fontWeight: 400,
            textIndent: '8em',
          }}
        >
          {finalQuote}
        </p>
      </div>
    )}
    ```
    Remove the previous `mt-16 md:mt-20` from the `<p>` (moved to the wrapper) and remove `-slide-up -a-${...}`.

    --- SkillsBlock.tsx ---
    Label (line 53-55):
    ```jsx
    <span className="-entrance -mask-right -a-0 inline-block font-mono text-xs uppercase tracking-[0.88px] text-text-tertiary">
      1.2 / Skills
    </span>
    ```
    Accordion category rows (line 76-79 — `<div className={\`-entrance -slide-up -a-${stagger} border-t border-border-secondary\`}>`):
    NO CHANGE. Keep `-slide-up -a-N` 70ms cadence — these are list-rhythm, not reading-rhythm.

    --- ClientsBlock.tsx ---
    Label (line 55-57):
    ```jsx
    <span className="-entrance -mask-right -a-0 inline-block font-mono text-xs uppercase tracking-[0.88px] text-text-tertiary">
      1.3 / Notable Clients
    </span>
    ```
    Short description (line 65-75 — currently `<p className="-entrance -slide-up -a-0 ...">`):
    Wrap the GridItem's `<p>` in a `.-flow` div, change variant to `-mask-down`. Note: there's only ONE `<p>` here so `.-flow` + `-a-0` (= 0ms delay) is appropriate. We want the description to enter promptly AFTER the numeral mask-right (which has its own 0ms delay but completes in 0.6s, so the description's clip-path will still feel layered against the numeral's reveal timing):
    ```jsx
    <div className="-flow">
      <p
        className="-entrance -mask-down -a-1 text-text-secondary"
        style={{
          fontFamily: 'var(--font-sans)',
          fontSize: '2.25rem',
          lineHeight: 1.25,
          letterSpacing: '-0.36px',
          fontWeight: 700,
        }}
      >
        {shortDescription}
      </p>
    </div>
    ```
    `-a-1` (180ms in flow map) — comes in slightly AFTER the numeral, reinforcing the layered cadence.

    Logo grid items (line 86-90 — `<div className={\`-entrance -fade -a-${stagger} ...\`}>`):
    NO CHANGE. Keep `-fade -a-N` 70ms cadence — logos are grid-rhythm.

    --- EducationBlock.tsx ---
    Label (line 48-50):
    ```jsx
    <span className="-entrance -mask-right -a-0 inline-block font-mono text-xs uppercase tracking-[0.88px] text-text-tertiary">
      1.4 / Education
    </span>
    ```
    Timeline rows (line 64-66 — `<div className={\`-entrance -slide-up -a-${stagger} flex gap-5 ...\`}>`):
    NO CHANGE. Keep `-slide-up -a-N` 70ms cadence — timeline is list-rhythm.

    Out of scope reminder: Do NOT touch SectionDivider.tsx, AboutPinned.tsx, IntroSection.tsx, or AboutSection.tsx. Do NOT touch the SkillsBlock accordion internals (bar/level/name swap).
  </behavior>
  <action>
    Edit four files. For each numeral label `<span>`, prepend `-entrance -mask-right -a-0 inline-block` to className. For BioBlock: add `.-flow` to the body paragraph wrapper, switch paragraph variant to `-mask-down`, cap stagger index at 10 (not 19); wrap finalQuote in its own `.-flow` div with `-mask-down -a-0`, move `mt-16 md:mt-20` to the wrapper. For ClientsBlock: wrap shortDescription `<p>` in a `.-flow` div, switch to `-mask-down -a-1`. For SkillsBlock and EducationBlock: ONLY the numeral change — leave list rows untouched.

    DO NOT modify SkillsBlock accordion bar/swap logic, EducationBlock timeline structure, ClientsBlock CLIENT_LOGOS/grid, BioBlock Core Expertise list. DO NOT touch SectionDivider, AboutPinned, IntroSection, AboutSection.
  </action>
  <verify>
    <automated>cd /Users/caioogata/Projects/portolio-v1 &amp;&amp; \
      grep -c "\-entrance \-mask-right" src/components/sections/v2/about/BioBlock.tsx src/components/sections/v2/about/SkillsBlock.tsx src/components/sections/v2/about/ClientsBlock.tsx src/components/sections/v2/about/EducationBlock.tsx | tee /dev/stderr | awk -F: '{ if ($2 != 1) { print "FAIL: " $0; exit 1 } } END { print "PASS: numerals updated" }' &amp;&amp; \
      grep -c "\-entrance \-mask-down" src/components/sections/v2/about/BioBlock.tsx src/components/sections/v2/about/ClientsBlock.tsx | tee /dev/stderr &amp;&amp; \
      grep -c "\-flow" src/components/sections/v2/about/BioBlock.tsx src/components/sections/v2/about/ClientsBlock.tsx | tee /dev/stderr &amp;&amp; \
      grep -c "\-entrance \-slide-up" src/components/sections/v2/about/SkillsBlock.tsx src/components/sections/v2/about/EducationBlock.tsx | tee /dev/stderr &amp;&amp; \
      pnpm tsc --noEmit</automated>
  </verify>
  <done>
    Every block has exactly one `-entrance -mask-right` (numeral). BioBlock has ≥2 `-mask-down` (middle paragraphs + final quote) and ≥2 `-flow` (body wrapper + finalQuote wrapper). ClientsBlock has 1 `-mask-down` and 1 `-flow`. SkillsBlock and EducationBlock retain their existing `-slide-up` rows. pnpm tsc --noEmit exits 0.
  </done>
</task>

<task type="checkpoint:human-verify" gate="blocking">
  <name>Task 3: Visual validation — /about layered reveal cadence</name>
  <files>(no files modified — visual verification only)</files>
  <action>
    Pause execution. Do not proceed to commit until the user has visually confirmed the layered reveal on /about behaves as expected. See &lt;how-to-verify&gt; for steps.
  </action>
  <verify>
    <automated>echo "MANUAL — see how-to-verify; user must approve before commit"</automated>
  </verify>
  <done>User types "approved" after visual verification passes (cadence is editorial, lists keep grid rhythm, reduced-motion collapses correctly, IntroSection + AboutPinned untouched).</done>
  <what-built>
    CSS infrastructure in globals.css (4 new entrance variants + `--ease-fiddle` token + `.-flow` stagger override) + applied in 4 about blocks. /about should now feel like an editorial document opening in layers, NOT a slot-machine of simultaneous slide-ups.
  </what-built>
  <how-to-verify>
    1. Run `pnpm dev` (or use the dev server already running).
    2. Open http://localhost:3000/about (use Chromium via Playwright MCP per project convention if doing automated capture).
    3. Refresh and scroll slowly through each block. For EACH of the 4 blocks (Bio, Skills, Notable Clients, Education) observe at viewport entry:
       - Numeral "1.X / [Label]" reveals via clip-path LEFT→RIGHT (not slide-up). Should feel like a typewriter pass for the label.
       - For Bio specifically: middle paragraphs (24px semibold) appear ONE AT A TIME via top→bottom mask, paced ~150–180ms apart. By the time paragraph N finishes its mask, paragraph N+1 starts. NO simultaneous explosion.
       - For Bio final quote (full-width, 48px italic-feel): same top→bottom mask, single beat after the column paragraphs.
       - For Notable Clients: numeral mask-right → short description (36px Bold) mask-down a beat later.
       - For Skills + Education: numeral mask-right → list rows enter with the existing fast 70ms grid cadence (UNCHANGED — verify nothing broke).
    4. Open DevTools → Rendering → Emulate CSS media feature `prefers-reduced-motion: reduce`. Refresh /about. ALL content should appear at final state instantly with no transition / no clip-path animation. Numerals visible, paragraphs visible, no cumulative delay.
    5. Verify untouched: Home page (/) hero entrance still fires (welcome bar, sticky logo, headline) with original cadence — IntroSection unchanged. /about's AboutPinned video + first paragraph (sticky 400vh hero) still works with scroll-linked progress — unchanged.
    6. Inspect element on a numeral: DOM has `-entrance -mask-right -a-0 inline-block`. Inspect on a Bio middle paragraph: DOM has `-entrance -mask-down -a-N` and parent has `-flow`.

    Reading-pace acceptance criterion: by the time the FIRST paragraph finishes its mask-down (~0.9s + 0ms delay = 900ms after `-inview`), the SECOND paragraph (a-1, 180ms delay) is mid-mask. Reader's eye naturally tracks downward. NOT "everything appears at once."

    Visual capture (recommended): take screenshot or short Playwright video of /about scrolled into BioBlock and Notable Clients to attach to the verify report.
  </how-to-verify>
  <resume-signal>
    Type "approved" if cadence feels right and untouched areas are preserved. Otherwise describe: which block, what timing felt off (too fast / too slow / out of order), and whether reduced-motion correctly collapsed.

    On "approved", proceed to commit. After commit, the user is expected to run a follow-up quick task to replicate this pattern to /experience and /projects.
  </resume-signal>
</task>

</tasks>

<verification>
  - `pnpm tsc --noEmit` exits 0 (run after Task 1 and Task 2)
  - grep confirms new CSS variants and `--ease-fiddle` token present in globals.css
  - grep confirms each of the 4 about blocks contains `-entrance -mask-right` exactly once on its numeral label
  - grep confirms BioBlock + ClientsBlock contain `-mask-down` and `.-flow`
  - grep confirms SkillsBlock + EducationBlock retain `-entrance -slide-up` on list rows (no regression)
  - Manual: /about reveal cadence matches reading pace; reduced-motion collapses all clip-path animations
  - Manual: Home / and AboutPinned untouched
</verification>

<success_criteria>
  - Layered reveal system is live as a SITE STANDARD (CSS in globals.css), not a one-off animation
  - /about feels editorial, not slot-machine
  - Lists / grids / timelines retain their snappy grid rhythm
  - Pattern is documented as `-mask-down`, `-mask-right`, `-line-x`, `.-flow` modifier — ready to be applied to /experience and /projects in the next quick task
  - Zero regressions on Home, IntroSection, AboutPinned, SkillsBlock accordion internals, ClientsBlock logo grid, EducationBlock timeline rows
</success_criteria>

<output>
After Task 3 approval, commit:
```bash
node "$HOME/.claude/get-shit-done/bin/gsd-tools.cjs" commit "feat(quick-260429-thh): layered content reveal on /about (mask-down + .-flow)" --files src/app/globals.css src/components/sections/v2/about/BioBlock.tsx src/components/sections/v2/about/SkillsBlock.tsx src/components/sections/v2/about/ClientsBlock.tsx src/components/sections/v2/about/EducationBlock.tsx
```

Then create `.planning/quick/260429-thh-content-reveal-pattern-on-about-mask-dow/260429-thh-SUMMARY.md` documenting:
- New CSS primitives (`-mask-down`, `-mask-right`, `-line-x`, `.-flow`, `--ease-fiddle`)
- Application table (which block got which variant)
- Out-of-scope confirmation (IntroSection, AboutPinned untouched)
- Next step: replicate to /experience + /projects
</output>
