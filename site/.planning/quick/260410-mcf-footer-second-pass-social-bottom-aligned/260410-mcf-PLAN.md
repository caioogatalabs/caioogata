---
quick_id: 260410-mcf
type: execute
wave: 1
depends_on: []
files_modified:
  - src/components/sections/v2/FooterSection.tsx
autonomous: false
requirements:
  - QUICK-260410-mcf
must_haves:
  truths:
    - "Bottom row contains ONLY tech tags + copyright (left); Contact CTA is gone from bottom row"
    - "Right column (col-span-6) renders a grey light-themed card with rounded-12 containing both the form area AND the pill+icon CTA group"
    - "Collapsed state: card visually shrinks to just the CTA button height (form area max-height=0), CTA pinned to bottom-right"
    - "Expanded state: form is visible above the CTA; form grows upward from the button, button stays pinned at bottom of card"
    - "Left column (col-span-6) uses flex-col justify-end so social links stick to the bottom of the column, aligning visually with the CTA button on the right"
    - "Social links fade in only when expanded (existing behavior preserved)"
    - "All existing behaviors preserved: auto-expand-on-scroll-to-bottom, open-contact event, groupHovered stagger (+0.1s icon), both buttons toggle, aria-expanded/aria-controls/aria-label, prefers-reduced-motion"
    - "ContactForm.tsx is NOT modified"
  artifacts:
    - path: "src/components/sections/v2/FooterSection.tsx"
      provides: "Restructured footer: grey card holds form + CTA, social links bottom-aligned, bottom row is tags + copyright only"
  key_links:
    - from: "FooterSection grey card"
      to: "form max-height animation"
      via: "max-height transition on form wrapper (NOT on whole card)"
      pattern: "maxHeight.*scrollHeight"
    - from: "FooterSection card layout"
      to: "button anchored at bottom"
      via: "flex-col with form first + button last (button is last child = naturally at bottom as form collapses)"
      pattern: "flex-col"
---

<objective>
Second pass on FooterSection. Relocate the Contact pill+icon CTA from the bottom row INTO the grey right-column card (anchored at card bottom). Collapse/expand animates the form area growing upward from the button. Bottom-align social links in the left column so they sit visually near the CTA. Bottom row keeps only tags + copyright.

Purpose: Create a tighter, more intentional footer composition where the CTA lives inside its contextual card and the form visibly expands from the button upward — reinforcing the button as the anchor point for the interaction.

Output: Updated `src/components/sections/v2/FooterSection.tsx`.
</objective>

<context>
@./CLAUDE.md
@src/components/sections/v2/FooterSection.tsx
@src/components/sections/v2/IntroSection.tsx

<interfaces>
<!-- Current FooterSection structure (from first pass) -->
<!-- SocialLink, SecondaryFill, SOCIAL_ICONS, EASE, TECH_TAGS, EXPAND_CONTENT_ID all remain as-is -->
<!-- ContactForm is imported and used unchanged -->
<!-- State: isExpanded, groupHovered, contentRef, footerRef, hasAutoExpanded, prefersReducedMotion, sectionRef -->
<!-- toggleExpanded() flips isExpanded -->
<!-- transitionDuration already derived from prefersReducedMotion -->
</interfaces>
</context>

<tasks>

<task type="auto">
  <name>Task 1: Restructure FooterSection — relocate CTA into grey card, bottom-align social links</name>
  <files>src/components/sections/v2/FooterSection.tsx</files>
  <action>
Refactor the JSX inside `<footer>` (everything after the useEffects — lines ~188-329). Keep all hooks, state, constants, and helper components (SocialLink, SecondaryFill, SOCIAL_ICONS, EASE) exactly as they are. Do NOT touch ContactForm.tsx.

**New structure:**

```tsx
<footer ...>
  {/* Main 6-6 grid — ALWAYS rendered, no outer max-height wrapper */}
  <div className="grid grid-cols-12 gap-4 md:gap-5 pb-8">

    {/* LEFT COL: social links bottom-aligned */}
    <div className="col-span-12 md:col-span-6 flex flex-col justify-end gap-1">
      {/* Social links wrapper — fade in only when expanded (preserve current behavior) */}
      <div
        style={{
          opacity: isExpanded ? 1 : 0,
          transition: `opacity ${transitionDuration}`,
          pointerEvents: isExpanded ? 'auto' : 'none',
        }}
      >
        {content.contact.links.map((link) => (
          <SocialLink key={link.label} label={link.label} url={link.url} />
        ))}
      </div>
    </div>

    {/* RIGHT COL: grey card containing form (collapsible) + CTA (always visible, bottom) */}
    <div
      className="col-span-12 md:col-span-6 bg-bg-surface-tertiary rounded-[12px] p-5 md:p-8 flex flex-col gap-5"
      data-theme="light"
    >
      {/* Form wrapper — max-height animates, button stays below */}
      <div
        id={EXPAND_CONTENT_ID}
        ref={contentRef}
        style={{
          maxHeight: isExpanded ? contentRef.current?.scrollHeight ?? 2000 : 0,
          opacity: isExpanded ? 1 : 0,
          overflow: 'hidden',
          transition: `max-height ${transitionDuration}, opacity ${transitionDuration}`,
        }}
      >
        <ContactForm />
      </div>

      {/* CTA group — pill + square icon, always visible, anchored at bottom of card */}
      <div
        className="flex items-center gap-0.5 self-end"
        onMouseEnter={() => setGroupHovered(true)}
        onMouseLeave={() => setGroupHovered(false)}
      >
        {/* ...existing pill button JSX unchanged (lines 249-285)... */}
        {/* ...existing square icon button JSX unchanged (lines 288-325)... */}
      </div>
    </div>
  </div>

  {/* BOTTOM ROW: tags + copyright ONLY (CTA removed) */}
  <div className="flex items-center justify-between pt-2">
    <div className="flex items-center gap-3">
      {TECH_TAGS.map((tag) => (
        <span key={tag} className="inline-flex items-center justify-center border border-border-primary text-xs text-text-secondary font-mono px-3 py-1.5 rounded-[12px]">
          {tag}
        </span>
      ))}
      <span className="text-xs text-text-tertiary font-mono">
        &copy; 2026 Caio Ogata
      </span>
    </div>
  </div>
</footer>
```

**Key implementation rules:**

1. **Grey card is ALWAYS rendered.** No outer max-height wrapper around the whole 6-6 grid. Remove the previous wrapper `<div id={EXPAND_CONTENT_ID} style={{ maxHeight: ... }}>` that wrapped the grid — max-height moves INTO the form wrapper inside the card.

2. **`id={EXPAND_CONTENT_ID}` and `ref={contentRef}` move to the FORM wrapper** inside the card (so `scrollHeight` measures the form, not the whole grid). `aria-controls` on both CTA buttons still points to `EXPAND_CONTENT_ID`. Correct — it now controls the form wrapper directly.

3. **Card uses `flex flex-col gap-5`.** Form is the FIRST child, CTA group is the LAST child. When form collapses to max-height=0, the CTA naturally sits at the bottom of the card (card shrinks to ~just the CTA button padding). When expanded, the form takes space above the button.

4. **CTA group uses `self-end`** to right-align inside the card's flex column (matching IntroSection's right-aligned CTA group pattern).

5. **Pill + square icon JSX is UNCHANGED** — copy the entire existing `<div className="flex items-center gap-0.5" onMouseEnter...>` block including both `<button>` elements (pill + square icon) VERBATIM from the current bottom row. Do not touch: hover timings, font swap, EASE references, isExpanded text ("Contact"/"Close"), isExpanded icon ("+"/"×"), aria attributes. Button styling stays yellow (`bg-fill-primary` + `text-on-primary`) — user said "depois olhamos".

6. **Left column `justify-end`** pushes social links to the bottom of the 6-col box so they align visually with the CTA button on the right. The social links wrapper preserves the existing fade-in-on-expand behavior via opacity + pointer-events.

7. **Bottom row no longer contains the CTA group.** Delete the entire `<div className="flex items-center gap-0.5" onMouseEnter={() => setGroupHovered(true)}...>` block from the bottom row after copying it into the card. Bottom row becomes just the tags+copyright div, with `justify-between` replaced naturally (keep `justify-between` if it reads fine, or switch to nothing — the left div is the only child now). Use `<div className="flex items-center pt-2">` with just the inner tags div, OR keep `justify-between` with a placeholder. Cleaner: drop `justify-between`, keep `flex items-center pt-2`.

8. **Preserve ALL hooks and effects** exactly: useInView, useEffect for prefersReducedMotion, useEffect for 'open-contact' listener, useEffect for auto-expand-on-scroll, toggleExpanded, transitionDuration derivation, footerRef callback ref merging with sectionRef. None of these change.

9. **prefers-reduced-motion**: already handled via `transitionDuration`. The form wrapper's max-height + opacity transitions both use `transitionDuration`, so reduced motion auto-applies (0.01s).

10. **Type safety**: `contentRef.current?.scrollHeight ?? 2000` — keep the nullish fallback exactly as in the current code.

**What to DELETE:**
- The outer `<div id={EXPAND_CONTENT_ID} style={{ maxHeight... }}>` wrapping the 6-6 grid (replaced by always-rendered grid)
- The CTA group `<div className="flex items-center gap-0.5" onMouseEnter...>` from inside the bottom row (moved into the card)
- The `justify-between` on the bottom row (only tags remain)

**What to KEEP verbatim:**
- SocialLink component (entire function, lines 62-143)
- SecondaryFill component (lines 46-60)
- SOCIAL_ICONS map, EASE, TECH_TAGS, EXPAND_CONTENT_ID constants
- All hooks, effects, refs, state
- Both CTA button JSX blocks (pill + square icon) with all their inline style timings
- ContactForm import and usage (`<ContactForm />`)
  </action>
  <verify>
    <automated>pnpm exec tsc --noEmit && pnpm exec next lint src/components/sections/v2/FooterSection.tsx</automated>
  </verify>
  <done>
- FooterSection.tsx typechecks and lints clean
- Bottom row contains only tags + copyright (grep confirms no `onMouseEnter={() => setGroupHovered` inside bottom row — it's inside the card)
- Right column div has `bg-bg-surface-tertiary`, `data-theme="light"`, `flex flex-col`, and contains BOTH the form wrapper AND the CTA group
- `id={EXPAND_CONTENT_ID}` is on the form wrapper inside the card (not on outer grid wrapper)
- Left column uses `flex flex-col justify-end`
- ContactForm.tsx is unchanged (git diff empty for that file)
  </done>
</task>

<task type="checkpoint:human-verify" gate="blocking">
  <name>Task 2: Visual verification</name>
  <what-built>FooterSection restructured: grey card now holds form + CTA (pill+icon), form expands upward from button, social links bottom-aligned in left column, bottom row is tags + copyright only.</what-built>
  <how-to-verify>
1. Run `pnpm dev` and scroll to the footer.
2. **Collapsed state (default):**
   - Right column shows a small grey pill/bubble containing ONLY the Contact pill+icon CTA, anchored bottom-right.
   - Left column is empty (or social links hidden via opacity 0).
   - Bottom row shows tech tags (Next.js, React, Tailwind, Vercel) + copyright on the left. No CTA on the right.
3. **Expand interaction:**
   - Click the Contact pill (or the `+` square icon). Form grows UPWARD from the button — button stays pinned at the bottom of the card, form appears above it.
   - Social links fade in on the left, bottom-aligned so they sit visually near the button on the right.
   - Pill text swaps "Contact" → "Close", icon swaps `+` → `×`.
4. **Hover interaction on the CTA group:**
   - Hovering either the pill or the square icon triggers the group hover — both get Pexel Grotesk 1.5rem text swap with +0.1s stagger on the icon.
5. **Collapse:** Click "Close" or `×` — form collapses upward into button, social links fade out.
6. **Auto-expand:** Scroll to the very bottom of the page — footer should auto-expand after ~300ms.
7. **`open-contact` event:** In devtools console, run `window.dispatchEvent(new Event('open-contact'))` — footer expands and scrolls into view.
8. **Reduced motion:** Enable OS reduced motion preference, reload, toggle expand — transitions should be instant (0.01s).
9. **Accessibility:** Tab to the pill button — `aria-expanded` reflects state, `aria-controls` points to the form wrapper id. Screen reader announces "Contact form" / "Close contact form" on the square icon.
10. **ContactForm untouched:** `git diff src/components/sections/v2/ContactForm.tsx` shows no changes.
  </how-to-verify>
  <resume-signal>Type "approved" or describe any visual/behavioral issues to fix.</resume-signal>
</task>

</tasks>

<verification>
- `pnpm exec tsc --noEmit` passes
- `pnpm exec next lint src/components/sections/v2/FooterSection.tsx` passes
- Visual checkpoint approved by user
- `git diff src/components/sections/v2/ContactForm.tsx` is empty
</verification>

<success_criteria>
- Grey card in right column contains form (top, collapsible) + CTA group (bottom, always visible)
- Form expand animates upward from the button via max-height on form wrapper
- Social links bottom-aligned in left column (justify-end), fade in only when expanded
- Bottom row contains only tech tags + copyright
- All existing behaviors preserved: auto-expand-on-scroll, open-contact event, group hover stagger, keyboard parity, aria attributes, prefers-reduced-motion
- ContactForm.tsx unchanged
- Button colors unchanged (still yellow) — user will tweak in follow-up
</success_criteria>

<output>
After completion, create `.planning/quick/260410-mcf-footer-second-pass-social-bottom-aligned/260410-mcf-SUMMARY.md` documenting:
- Files modified (just FooterSection.tsx)
- Structural before/after (bottom row → card relocation)
- Any deviations from the plan
- Follow-up: button color tweak to match grey card (user said "depois olhamos")
</output>
