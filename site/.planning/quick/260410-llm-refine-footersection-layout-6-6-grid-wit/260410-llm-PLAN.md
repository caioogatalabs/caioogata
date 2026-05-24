---
phase: quick
plan: 260410-llm
type: execute
wave: 1
depends_on: []
files_modified:
  - src/components/sections/v2/FooterSection.tsx
autonomous: false
requirements:
  - QUICK-260410-llm
must_haves:
  truths:
    - "Collapsed footer shows only the bottom row on the dark footer background (no grey card, no social links visible)"
    - "Clicking either the Contact pill or the + icon expands the footer"
    - "When expanded, a 6-6 grid appears: left column is social links on dark bg, right column is a grey rounded-12 card containing only the ContactForm"
    - "When expanded, the pill label swaps Contact -> Close and the square icon swaps + -> ×"
    - "Pill and square icon share a single groupHovered state; both animate on hover over either one; icon hover text has +0.1s delay"
    - "Scrolling to the bottom of the page auto-expands the footer exactly once (existing behavior preserved)"
    - "The open-contact window event still expands the footer and scrolls it into view"
    - "prefers-reduced-motion still collapses the max-height transition to 0.01s"
  artifacts:
    - path: "src/components/sections/v2/FooterSection.tsx"
      provides: "Refactored footer with 6-6 grid (social | grey form card), grouped Contact pill + icon toggle"
      contains: "grid-cols-12, data-theme=\"light\", groupHovered, isExpanded"
  key_links:
    - from: "FooterSection pill button onClick"
      to: "toggleExpanded"
      via: "onClick handler"
      pattern: "onClick=\\{toggleExpanded\\}"
    - from: "FooterSection square icon button onClick"
      to: "toggleExpanded"
      via: "onClick handler"
      pattern: "onClick=\\{toggleExpanded\\}"
    - from: "FooterSection grey card wrapper"
      to: "semantic light-theme tokens"
      via: "data-theme attribute"
      pattern: "data-theme=\"light\""
    - from: "FooterSection expandable wrapper"
      to: "max-height animation based on contentRef.scrollHeight"
      via: "inline style"
      pattern: "maxHeight: isExpanded"
---

<objective>
Refactor `FooterSection.tsx` so the footer matches the agreed structure:

- **Collapsed state:** only the bottom row is visible, sitting directly on the dark footer background. No grey card, no social links.
- **Expanded state:** a 6-6 grid appears above the bottom row. Left column (col-span-6) holds the social links on the dark footer background. Right column (col-span-6) is a grey, `rounded-12`, `data-theme="light"` card containing only the `ContactForm`.
- **Bottom row:** stays full-width on dark background, showing tags + copyright on the left and a grouped Contact pill + square icon on the right, matching the IntroSection pattern.
- **Grouped CTA:** pill ("Contact"/"Close", `rounded-full h-12 px-8`) + square icon ("+"/"×", `size-12 rounded-[12px]`), both `bg-bg-fill-primary`, wrapped in a flex container with `gap-0.5`, shared `groupHovered` state, icon hover text has +0.1s delay. Clicking either element toggles `isExpanded`.

Purpose: Visually separate the form (treated as a distinct surface) from the social links and bottom metadata, and upgrade the CTA to match the IntroSection pill+icon pattern for consistency.

Output: Single updated file `src/components/sections/v2/FooterSection.tsx`. `ContactForm.tsx` is NOT modified.
</objective>

<execution_context>
@$HOME/.claude/get-shit-done/workflows/execute-plan.md
@$HOME/.claude/get-shit-done/templates/summary.md
</execution_context>

<context>
@./CLAUDE.md
@src/components/sections/v2/FooterSection.tsx
@src/components/sections/v2/IntroSection.tsx
@src/components/sections/v2/ContactForm.tsx

<interfaces>
<!-- Key patterns the executor needs. Extracted from the files above. -->

Current FooterSection.tsx (src/components/sections/v2/FooterSection.tsx):
- Exports: `FooterSection()` (named, default-less)
- Local helpers: `SOCIAL_ICONS` map, `SecondaryFill`, `SocialLink`, `EASE` const, `TECH_TAGS`, `EXPAND_CONTENT_ID`
- State: `isExpanded`, `contactHovered`, refs `contentRef`, `footerRef`, `hasAutoExpanded`, `prefersReducedMotion`
- Effects: reduced-motion detection, `open-contact` window event, scroll-to-bottom auto-expand
- `toggleExpanded = () => setIsExpanded(prev => !prev)` — KEEP
- `transitionDuration` derived from reduced-motion — KEEP
- ContactForm is imported and rendered as `<ContactForm />` (no props)

Current outer structure that must be REPLACED:
```tsx
<footer ... className="-entrance -slide-up -a-0 px-5 md:px-8 lg:px-16 py-8">
  <div className="bg-bg-surface-tertiary rounded-[12px]" data-theme="light">
    <div id={EXPAND_CONTENT_ID} style={{maxHeight: ..., transition: ..., overflow: 'hidden'}}>
      <div ref={contentRef} className="p-5 md:p-8 grid grid-cols-4 gap-4 md:grid-cols-8 md:gap-5 lg:grid-cols-12">
        <div className="col-span-4 md:col-span-2 lg:col-span-3 flex flex-col gap-1">
          {content.contact.links.map(...)}
        </div>
        <ContactForm />
      </div>
    </div>
    <div className="px-5 md:px-8 py-5 md:py-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">...tags + copyright...</div>
        <button ...Contact button... />
      </div>
    </div>
  </div>
</footer>
```

Target outer structure:
```tsx
<footer ref={...} aria-label="Footer" data-section-id="footer"
        className="-entrance -slide-up -a-0 px-5 md:px-8 lg:px-16 py-8">
  {/* Expandable 6-6 grid */}
  <div id={EXPAND_CONTENT_ID}
       style={{maxHeight: isExpanded ? contentRef.current?.scrollHeight ?? 2000 : 0,
               transition: `max-height ${transitionDuration}`,
               overflow: 'hidden'}}>
    <div ref={contentRef} className="grid grid-cols-12 gap-4 md:gap-5 pb-8">
      {/* Left: social links on dark bg */}
      <div className="col-span-12 md:col-span-6 flex flex-col gap-1">
        {content.contact.links.map((link) => (
          <SocialLink key={link.label} label={link.label} url={link.url} />
        ))}
      </div>
      {/* Right: grey form card (data-theme light, rounded-12 all 4 corners) */}
      <div className="col-span-12 md:col-span-6 bg-bg-surface-tertiary rounded-[12px] p-5 md:p-8"
           data-theme="light">
        <ContactForm />
      </div>
    </div>
  </div>

  {/* Bottom row — full width on dark bg, NO theme override */}
  <div className="flex items-center justify-between pt-2">
    <div className="flex items-center gap-3">
      {TECH_TAGS.map(tag => <span ...>{tag}</span>)}
      <span className="text-xs text-text-tertiary font-mono">&copy; 2026 Caio Ogata</span>
    </div>
    {/* Grouped Contact pill + square icon */}
    <div className="flex items-center gap-0.5"
         onMouseEnter={() => setGroupHovered(true)}
         onMouseLeave={() => setGroupHovered(false)}>
      <button type="button" onClick={toggleExpanded}
              aria-expanded={isExpanded} aria-controls={EXPAND_CONTENT_ID}
              className="relative inline-flex items-center justify-center h-12 rounded-full bg-bg-fill-primary text-text-on-primary px-8 overflow-hidden transition-colors duration-300 hover:bg-bg-fill-primary-hover">
        {/* Default text Fabio XM + hover text Pexel Grotesk, masked vertical swap, NO delay */}
        ... {isExpanded ? 'Close' : 'Contact'} ...
      </button>
      <button type="button" onClick={toggleExpanded}
              aria-label={isExpanded ? 'Close contact' : 'Open contact'}
              className="relative flex items-center justify-center size-12 rounded-[12px] bg-bg-fill-primary text-text-on-primary overflow-hidden transition-colors duration-300 hover:bg-bg-fill-primary-hover">
        {/* Default icon Fabio XM + hover icon Pexel Grotesk, masked vertical swap, +0.1s delay on hover */}
        ... {isExpanded ? '×' : '+'} ...
      </button>
    </div>
  </div>
</footer>
```

IntroSection grouped CTA reference (src/components/sections/v2/IntroSection.tsx lines 57-131):
- Flex wrapper: `className="flex items-center gap-0.5"` with `onMouseEnter/Leave` toggling `groupHovered`
- Pill: `h-12 rounded-full bg-bg-fill-primary text-text-on-primary px-8`
  - Default span: `text-base font-medium` Fabio XM, translateY(0→-100%) on hover, transition 1s cubic-bezier(0.16,1,0.3,1) with 0.06s exit delay
  - Hover span: Pexel Grotesk 1.5rem, translateY(100%→0) on hover, same timing
- Square icon: `size-12 rounded-[12px] bg-bg-fill-primary text-text-on-primary`
  - Default span: `text-lg` Fabio XM, +0.1s delay on hover transition
  - Hover span: Pexel Grotesk 1.5rem, +0.1s delay on hover transition
- Exact transition strings to copy:
  - Pill default span hover=true: `'transform 1s cubic-bezier(0.16,1,0.3,1), opacity 0.3s cubic-bezier(0.16,1,0.3,1)'`
  - Pill default span hover=false: `'transform 1s cubic-bezier(0.16,1,0.3,1) 0.06s, opacity 0.3s cubic-bezier(0.16,1,0.3,1) 0.06s'`
  - Pill hover span hover=true: same as default hover=true
  - Pill hover span hover=false: same as default hover=false
  - Icon default span hover=true: `'transform 1s cubic-bezier(0.16,1,0.3,1) 0.1s, opacity 0.3s cubic-bezier(0.16,1,0.3,1) 0.1s'`
  - Icon default span hover=false: `'transform 1s cubic-bezier(0.16,1,0.3,1), opacity 0.3s cubic-bezier(0.16,1,0.3,1)'`
  - Icon hover span hover=true: same as icon default hover=true (+0.1s)
  - Icon hover span hover=false: same as icon default hover=false
</interfaces>
</context>

<tasks>

<task type="auto">
  <name>Task 1: Refactor FooterSection structure and CTA group</name>
  <files>src/components/sections/v2/FooterSection.tsx</files>
  <action>
Rewrite `FooterSection()` in `src/components/sections/v2/FooterSection.tsx` to match the target structure in the `<interfaces>` block. Keep ALL existing top-of-file helpers untouched: `TECH_TAGS`, `EXPAND_CONTENT_ID`, `SOCIAL_ICONS`, `EASE`, `SecondaryFill`, `SocialLink`. Do not edit `ContactForm.tsx`.

Inside the component:

1. **State:** Replace `contactHovered` with `groupHovered` (same `useState(false)`). Keep `isExpanded`, `contentRef`, `footerRef`, `hasAutoExpanded`, `prefersReducedMotion`, `sectionRef` exactly as they are. Keep `toggleExpanded`, `transitionDuration`, and all three `useEffect` hooks (reduced-motion detection, `open-contact` listener, scroll-to-bottom auto-expand) byte-for-byte.

2. **Remove the outer grey wrapper:** Delete `<div className="bg-bg-surface-tertiary rounded-[12px]" data-theme="light">` around the whole footer. The `<footer>` element's existing className stays: `"-entrance -slide-up -a-0 px-5 md:px-8 lg:px-16 py-8"` (NO `data-theme` on footer root — per user decision D-1/D-2 the footer bg stays dark by default tokens).

3. **Expandable wrapper (unchanged mechanics):** Keep the div with `id={EXPAND_CONTENT_ID}` and the inline `style={{ maxHeight: isExpanded ? contentRef.current?.scrollHeight ?? 2000 : 0, transition: \`max-height ${transitionDuration}\`, overflow: 'hidden' }}`. This preserves reduced-motion behavior.

4. **Inside the expandable wrapper — new 6-6 grid** (replaces the current 4/8/12-col grid):
   ```tsx
   <div ref={contentRef} className="grid grid-cols-12 gap-4 md:gap-5 pb-8">
     {/* Left col: social links on dark bg */}
     <div className="col-span-12 md:col-span-6 flex flex-col gap-1">
       {content.contact.links.map((link) => (
         <SocialLink key={link.label} label={link.label} url={link.url} />
       ))}
     </div>
     {/* Right col: grey card (light theme), rounded-12 all 4 corners, contains ONLY ContactForm */}
     <div
       className="col-span-12 md:col-span-6 bg-bg-surface-tertiary rounded-[12px] p-5 md:p-8"
       data-theme="light"
     >
       <ContactForm />
     </div>
   </div>
   ```
   Notes:
   - `data-theme="light"` lives ONLY on the right-column card (per user decision D-1, D-6). The SocialLink column inherits dark tokens from the footer root — no theme override, so social links render with the existing `text-text-secondary` / `border-border-primary` they already use.
   - The right card uses `rounded-[12px]` on all 4 corners (D-6).
   - ContactForm already has `col-span-4 md:col-span-6 lg:col-span-9` on its own `<form>` element. That's fine — inside the grey card it will just fill available width. Do NOT modify ContactForm. If the ContactForm `col-span-*` classes cause issues because the card is not a grid, it will still render (col-span outside grid context is a no-op); no changes needed.

5. **Bottom row — OUTSIDE the expandable wrapper, sibling of it**, on dark bg (no grey, no theme override). Replace the current `<div className="px-5 md:px-8 py-5 md:py-6">` bottom row with:
   ```tsx
   <div className="flex items-center justify-between pt-2">
     <div className="flex items-center gap-3">
       {TECH_TAGS.map((tag) => (
         <span
           key={tag}
           className="inline-flex items-center justify-center border border-border-primary text-xs text-text-secondary font-mono px-3 py-1.5 rounded-[12px]"
         >
           {tag}
         </span>
       ))}
       <span className="text-xs text-text-tertiary font-mono">&copy; 2026 Caio Ogata</span>
     </div>

     {/* Grouped Contact pill + icon — matches IntroSection.tsx lines 57-131 */}
     <div
       className="flex items-center gap-0.5"
       onMouseEnter={() => setGroupHovered(true)}
       onMouseLeave={() => setGroupHovered(false)}
     >
       {/* Pill */}
       <button
         type="button"
         onClick={toggleExpanded}
         aria-expanded={isExpanded}
         aria-controls={EXPAND_CONTENT_ID}
         className="relative inline-flex items-center justify-center h-12 rounded-full bg-bg-fill-primary text-text-on-primary px-8 overflow-hidden transition-colors duration-300 hover:bg-bg-fill-primary-hover"
       >
         {/* Default — Fabio XM */}
         <span
           className="block text-base font-medium"
           style={{
             fontFamily: 'var(--font-sans)',
             transform: groupHovered ? 'translateY(-100%)' : 'translateY(0)',
             opacity: groupHovered ? 0 : 1,
             transition: groupHovered
               ? 'transform 1s cubic-bezier(0.16,1,0.3,1), opacity 0.3s cubic-bezier(0.16,1,0.3,1)'
               : 'transform 1s cubic-bezier(0.16,1,0.3,1) 0.06s, opacity 0.3s cubic-bezier(0.16,1,0.3,1) 0.06s',
           }}
         >
           {isExpanded ? 'Close' : 'Contact'}
         </span>
         {/* Hover — Pexel Grotesk */}
         <span
           className="absolute inset-0 flex items-center justify-center font-normal"
           style={{
             fontFamily: "'Pexel Grotesk', var(--font-sans)",
             fontSize: '1.5rem',
             transform: groupHovered ? 'translateY(0)' : 'translateY(100%)',
             opacity: groupHovered ? 1 : 0,
             transition: groupHovered
               ? 'transform 1s cubic-bezier(0.16,1,0.3,1), opacity 0.3s cubic-bezier(0.16,1,0.3,1)'
               : 'transform 1s cubic-bezier(0.16,1,0.3,1) 0.06s, opacity 0.3s cubic-bezier(0.16,1,0.3,1) 0.06s',
           }}
         >
           {isExpanded ? 'Close' : 'Contact'}
         </span>
       </button>

       {/* Square icon — also toggles expand */}
       <button
         type="button"
         onClick={toggleExpanded}
         aria-label={isExpanded ? 'Close contact form' : 'Open contact form'}
         aria-expanded={isExpanded}
         aria-controls={EXPAND_CONTENT_ID}
         className="relative flex items-center justify-center size-12 rounded-[12px] bg-bg-fill-primary text-text-on-primary overflow-hidden transition-colors duration-300 hover:bg-bg-fill-primary-hover"
       >
         {/* Default — Fabio XM */}
         <span
           className="block text-lg"
           style={{
             fontFamily: 'var(--font-sans)',
             transform: groupHovered ? 'translateY(-100%)' : 'translateY(0)',
             opacity: groupHovered ? 0 : 1,
             transition: groupHovered
               ? 'transform 1s cubic-bezier(0.16,1,0.3,1) 0.1s, opacity 0.3s cubic-bezier(0.16,1,0.3,1) 0.1s'
               : 'transform 1s cubic-bezier(0.16,1,0.3,1), opacity 0.3s cubic-bezier(0.16,1,0.3,1)',
           }}
         >
           {isExpanded ? '×' : '+'}
         </span>
         {/* Hover — Pexel Grotesk */}
         <span
           className="absolute inset-0 flex items-center justify-center"
           style={{
             fontFamily: "'Pexel Grotesk', var(--font-sans)",
             fontSize: '1.5rem',
             transform: groupHovered ? 'translateY(0)' : 'translateY(100%)',
             opacity: groupHovered ? 1 : 0,
             transition: groupHovered
               ? 'transform 1s cubic-bezier(0.16,1,0.3,1) 0.1s, opacity 0.3s cubic-bezier(0.16,1,0.3,1) 0.1s'
               : 'transform 1s cubic-bezier(0.16,1,0.3,1), opacity 0.3s cubic-bezier(0.16,1,0.3,1)',
           }}
         >
           {isExpanded ? '×' : '+'}
         </span>
       </button>
     </div>
   </div>
   ```

6. **Collapsed state verification:** Because the 6-6 grid lives inside the `maxHeight: 0` wrapper, when `isExpanded === false` it collapses to height 0 and is invisible (user decision D-2: social links only visible when expanded, grey card not visible at all). Do not add separate conditional rendering — the existing max-height mechanism handles it.

7. **Imports and symbols:** `useState`, `useEffect`, `useRef` from react; `useInView` from `@/hooks/useInView`; `ContactForm` from `@/components/sections/v2/ContactForm`; `content` from `@/content/en.json`. All already imported — no import changes needed. Remove any now-unused local state (`contactHovered`) and add `groupHovered`.

8. **Do NOT touch:** `ContactForm.tsx`, the `SocialLink`/`SecondaryFill` helpers, `TECH_TAGS`, `EXPAND_CONTENT_ID`, `SOCIAL_ICONS`, any other file.

Per user decisions D-1..D-8 — all locked, implement exactly as specified. Per D-7/D-8 the auto-expand-on-scroll and `open-contact` event listener effects are preserved unchanged.
  </action>
  <verify>
    <automated>pnpm exec tsc --noEmit 2>&1 | tail -30 && pnpm exec next lint --file src/components/sections/v2/FooterSection.tsx 2>&1 | tail -20</automated>
  </verify>
  <done>
- `src/components/sections/v2/FooterSection.tsx` compiles with no TS errors and no new lint errors.
- File contains exactly one `grid grid-cols-12` inside the expandable wrapper with two `col-span-12 md:col-span-6` children.
- `data-theme="light"` appears exactly once, on the right-column grey card div (not on the `<footer>` or the outer wrapper).
- `bg-bg-surface-tertiary rounded-[12px]` appears on the right-column card only.
- Exactly two buttons wire `onClick={toggleExpanded}` inside the bottom-row grouped CTA wrapper.
- Grouped CTA wrapper has `onMouseEnter`/`onMouseLeave` setting a single `groupHovered` state that drives both pill and icon transforms.
- Square icon hover transitions include `0.1s` delay on the `groupHovered === true` branch only (not on the false/exit branch), matching IntroSection.
- Pill text renders `Contact` when `!isExpanded` and `Close` when `isExpanded`; icon renders `+` / `×`.
- `ContactForm.tsx` is unchanged (`git diff src/components/sections/v2/ContactForm.tsx` empty).
- `useEffect` hooks for `open-contact`, scroll-to-bottom auto-expand, and reduced-motion detection are byte-for-byte identical to the current implementation.
  </done>
</task>

<task type="checkpoint:human-verify" gate="blocking">
  <what-built>
Refactored `FooterSection.tsx`:
- Outer grey wrapper removed; footer sits on dark bg.
- Expandable area: 6-6 grid with social links (left, dark bg) and grey `data-theme="light"` rounded-12 card (right) containing the `ContactForm`.
- Bottom row: tags + copyright left, grouped Contact pill + square icon right (matches IntroSection pattern).
- Both pill and icon toggle expand on click; shared `groupHovered` drives hover animations; icon hover has +0.1s delay.
- Auto-expand on scroll-to-bottom and `open-contact` event preserved.
  </what-built>
  <how-to-verify>
1. Run `pnpm dev` and open http://localhost:3000 (or current dev port).
2. Scroll near the footer but NOT all the way to the bottom. Confirm:
   - Only the bottom row is visible: tags + copyright left, Contact pill + `+` square right.
   - No grey card, no social links, no visible expandable area.
   - Footer background is dark (matches page background), not grey.
3. Hover over the Contact pill. Confirm:
   - Both the pill label AND the `+` icon animate together (Fabio XM → Pexel Grotesk 1.5rem swap).
   - Icon animation starts ~100ms after pill (noticeable stagger).
4. Hover over the `+` square icon. Confirm the same grouped animation fires (pill + icon together).
5. Click the Contact pill. Confirm:
   - Footer expands smoothly (max-height transition).
   - 6-6 grid appears: social links (LinkedIn, GitHub, etc.) on left on dark bg, grey rounded card with the contact form on right.
   - Pill text swaps to "Close", square icon swaps to "×".
6. Click the `×` square icon. Confirm the footer collapses back.
7. Click pill or icon again to re-expand, then scroll the page to the very bottom. Confirm auto-expand still works (collapse first, reload, scroll to bottom — should auto-expand once).
8. From another section, trigger the `open-contact` event (e.g. a "Contact" link in the menu if present). Confirm the footer expands and scrolls into view.
9. Keyboard: Tab to the Contact pill, press Enter — should expand. Tab to the square icon, press Enter — should also toggle.
10. Visual regression: confirm the grey card has rounded-12 on all 4 corners (not just 2) and contains only the form — no social links inside it.
11. (Optional) Enable `prefers-reduced-motion: reduce` in DevTools rendering panel and re-toggle — expand/collapse should be instant (~0.01s).
  </how-to-verify>
  <resume-signal>Type "approved" or describe issues found</resume-signal>
</task>

</tasks>

<verification>
- TypeScript: `pnpm exec tsc --noEmit` clean.
- Lint: `pnpm exec next lint --file src/components/sections/v2/FooterSection.tsx` clean.
- Git diff scope: only `src/components/sections/v2/FooterSection.tsx` modified.
- Manual: human-verify checkpoint passes.
</verification>

<success_criteria>
- Footer collapses to bottom row only on dark bg.
- Footer expands to show 6-6 grid with social (dark) + form (grey card).
- Pill and square icon share hover state and both trigger expand on click.
- Contact ↔ Close text swap and + ↔ × icon swap work correctly.
- Auto-expand-on-scroll and `open-contact` event still work.
- `ContactForm.tsx` not modified.
- `prefers-reduced-motion` still honored.
</success_criteria>

<output>
After completion, create `.planning/quick/260410-llm-refine-footersection-layout-6-6-grid-wit/260410-llm-SUMMARY.md`
</output>
