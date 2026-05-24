---
phase: 260429-tgx
plan: quick
type: execute
wave: 1
depends_on: []
files_modified:
  - src/components/sections/v2/ContactOverlay.tsx
  - src/components/sections/v2/FloatingContactButton.tsx
  - src/components/sections/v2/StickyLogoBar.tsx
  - src/components/sections/v2/FooterSection.tsx
  - src/components/layout/PageShell.tsx
autonomous: false
requirements:
  - QUICK-260429-tgx
must_haves:
  truths:
    - "Footer base (tags + © + Contact pill) stays at the bottom of the home page; clicking Contact dispatches `open-contact` and opens the overlay (no inline expand)."
    - "ContactOverlay floats at bottom-right (50% width × 80% height on lg, full-viewport with 16px margins on mobile), yellow brand fill (data-theme=\"inverse\"), 12px radius, no backdrop, no scroll lock — body keeps scrolling."
    - "Overlay opens via three triggers: footer Contact button, FloatingContactButton FAB, and existing `open-contact` window CustomEvent (reused from MenuSection.tsx)."
    - "FloatingContactButton appears (fade + slide-in) only when the StickyLogoBar's `ask about` CTA leaves the viewport, and disappears when it returns."
    - "Overlay closes via Escape key, the bottom-right Close pill + × button, and (for parity) any external dispatch of a `close-contact` event."
    - "Overlay form posts via Resend `/api/contact` (existing useContactForm wiring), with Name+Email stacked, Subject chips, full-width Message textarea (NO FormLog), Send Message + Clear buttons, and a vertical Social links list (LinkedIn / GitHub / Instagram / YouTube each with `↗`)."
    - "All interactions respect `prefers-reduced-motion` (instant open/close, no slide/fade)."
  artifacts:
    - path: "src/components/sections/v2/ContactOverlay.tsx"
      provides: "New floating contact overlay (50%×80% lg / full-vp mobile, inverse theme, internal form)"
    - path: "src/components/sections/v2/FloatingContactButton.tsx"
      provides: "FAB that materializes when the `ask about` CTA leaves viewport; dispatches open-contact"
    - path: "src/components/sections/v2/StickyLogoBar.tsx"
      provides: "Adds `data-share-with-ai` data attribute (or stable id) on the `ask about` <a> so the FAB IntersectionObserver can target it"
    - path: "src/components/sections/v2/FooterSection.tsx"
      provides: "Slim footer: tags + © left, Contact pill+× right; Contact dispatches `open-contact`; ContactForm/social-list/expand state removed"
    - path: "src/components/layout/PageShell.tsx"
      provides: "Mounts <ContactOverlay /> and <FloatingContactButton /> as fixed siblings at the root"
  key_links:
    - from: "src/components/sections/v2/PageShell.tsx (rendered <ContactOverlay/> + <FloatingContactButton/>)"
      to: "open-contact / close-contact CustomEvent listeners"
      via: "window event dispatch (same pattern as MenuSection.tsx line 35)"
      pattern: "window\\.(addEventListener|dispatchEvent).*open-contact"
    - from: "src/components/sections/v2/FloatingContactButton.tsx"
      to: "[data-share-with-ai] element inside StickyLogoBar"
      via: "IntersectionObserver watching the `ask about` anchor; FAB visible iff target NOT intersecting"
      pattern: "IntersectionObserver.*data-share-with-ai"
    - from: "src/components/sections/v2/ContactOverlay.tsx form submit"
      to: "/api/contact (Resend)"
      via: "useContactForm hook (existing)"
      pattern: "useContactForm"
---

<objective>
Convert the V2 footer's inline-expand contact form into a floating overlay that hovers the bottom-right of the viewport, anchored at the PageShell layer (so it works across the home page). Footer shrinks to a normal base bar (tags + © + Contact pill). Add a Floating Contact FAB that surfaces only after the StickyLogoBar's `ask about` CTA scrolls out of view, giving the page a persistent contact entry point without occupying the hero.

Purpose: The current inline expansion forces the page to grow downward and visually duplicates the contact entry point. The new overlay matches the updated Figma node 826:303 — yellow brand fill, body keeps scrolling, no backdrop — and matches modern portfolio conventions while preserving keyboard parity and reduced-motion support.

Output:
- Two new components: `ContactOverlay.tsx`, `FloatingContactButton.tsx`
- StickyLogoBar gains a stable `data-share-with-ai` hook on the `ask about` anchor
- FooterSection becomes a non-expanding footer (Contact button just dispatches `open-contact`)
- PageShell mounts the overlay + FAB at root
</objective>

<execution_context>
@$HOME/.claude/get-shit-done/workflows/execute-plan.md
@$HOME/.claude/get-shit-done/templates/summary.md
</execution_context>

<context>
@./CLAUDE.md
@.planning/STATE.md
@src/components/sections/v2/FooterSection.tsx
@src/components/sections/v2/ContactForm.tsx
@src/components/sections/v2/StickyLogoBar.tsx
@src/components/sections/v2/IntroSection.tsx
@src/components/sections/v2/MenuSection.tsx
@src/components/layout/PageShell.tsx
@src/hooks/useInView.ts
@src/hooks/useContactForm.ts
@src/content/en.json

<interfaces>
<!-- Key contracts the executor needs. Pulled directly so no codebase scavenging. -->

From src/hooks/useContactForm.ts (existing — DO NOT modify):
The hook returns: { values, errors, status, focusedField, hasInteracted, submitCount, handleChange, handleBlur, handleFocus, handleSubmit, resetForm }.
Status values: 'idle' | 'submitting' | 'success' | 'error'.
ContactOverlay reuses this hook directly — no new submit wiring required.

From src/content/en.json (`contact` block, lines ~1830-1898):
- contact.email: string
- contact.links: { label: 'LinkedIn'|'GitHub'|'Instagram'|'YouTube'|'Twitch'; url: string }[]  // overlay shows first 4 (drop Twitch per spec)
- contact.form.{nameLabel,namePlaceholder,emailLabel,emailPlaceholder,subjectLabel,subjectOptions,messagePlaceholder,submitButton,submitting,validation,error,errorRetry,success,successDetail}

Existing event channel (reuse, do NOT rename):
```ts
// MenuSection.tsx:35 — already dispatches:
window.dispatchEvent(new CustomEvent('open-contact'))
```
ContactOverlay should listen to BOTH 'open-contact' (open) and 'close-contact' (close) on window.

Existing easings (CLAUDE.md "Animation System"):
- EASE = cubic-bezier(0.16, 1, 0.3, 1)        // primary fiddle easing for entry/exit
- EASE_OUT = cubic-bezier(0.22, 0.31, 0, 1)   // entrance token

Existing icon set (FooterSection.tsx lines 11-42): SOCIAL_ICONS map for LinkedIn/GitHub/Instagram/YouTube/Twitch — copy the constant into ContactOverlay (do not import from FooterSection — FooterSection is being slimmed and may drop social icons entirely; keeping the constant local to ContactOverlay decouples them).

Existing button hover patterns (CLAUDE.md "Button Hover Patterns"):
- Primary (yellow pill): font swap only (Epilogue → JetBrains Mono via .type-overlay-hover), 1s EASE, 0.06s exit delay
- Secondary (outline): expanding fill from translateY(100%)→0 over 0.2s + masked text swap, color via React state. Tokens: bg-fill-outline-hover + text-on-outline-hover.

Existing semantic tokens (DO NOT use raw hex):
- bg-bg-fill-primary (yellow), text-text-on-primary
- bg-bg-surface-secondary, bg-bg-surface-tertiary, border-border-primary
- text-text-primary, text-text-secondary, text-text-tertiary
- text-text-on-outline-hover, bg-bg-fill-outline-hover
- data-theme="inverse" on a wrapper auto-remaps text-text-primary etc. for the yellow surface
</interfaces>
</context>

<tasks>

<task type="auto">
  <name>Task 1: Build ContactOverlay component (new) + add data hook to StickyLogoBar</name>
  <files>src/components/sections/v2/ContactOverlay.tsx, src/components/sections/v2/StickyLogoBar.tsx</files>
  <action>
    1) Create `src/components/sections/v2/ContactOverlay.tsx` ('use client'):
       - State: `const [isOpen, setIsOpen] = useState(false)`; `const [isMounted, setIsMounted] = useState(false)` (controls 2-frame mount→animate gate, mirroring FooterSection.tsx lines 161-172).
       - Listen on window for `open-contact` (→ open) and `close-contact` (→ close). Cleanup on unmount.
       - Listen for Escape key when `isOpen` (mirror FooterSection.tsx lines 197-204).
       - Reduced-motion gate via `useRef(window.matchMedia('(prefers-reduced-motion: reduce)').matches)` inside useEffect (same pattern as FooterSection.tsx).
       - DO NOT scrollIntoView, DO NOT lock body scroll, DO NOT render any backdrop.
       - Container shape (using semantic tokens — no raw hex):
         ```jsx
         <div
           data-theme="inverse"
           role="dialog"
           aria-modal="false"            {/* explicit: NOT modal — body scroll preserved */}
           aria-label="Contact form"
           className="fixed z-[80] bg-bg-fill-primary text-text-on-primary rounded-[12px]
                      bottom-4 right-4 left-4
                      lg:bottom-6 lg:right-6 lg:left-auto
                      lg:w-[50vw] lg:h-[80vh]
                      h-[calc(100vh-32px)]
                      flex flex-col"
           style={{
             transform: isOpen ? 'translateY(0) scale(1)' : 'translateY(20px) scale(0.98)',
             opacity: isOpen ? 1 : 0,
             pointerEvents: isOpen ? 'auto' : 'none',
             transformOrigin: 'bottom right',
             transition: reduced
               ? 'none'
               : `transform 0.5s cubic-bezier(0.22,0.31,0,1), opacity 0.3s cubic-bezier(0.16,1,0.3,1)`,
           }}
         />
         ```
         Notes: `data-theme="inverse"` (per CLAUDE.md "Section Theming") remaps tokens automatically — no hardcoded inverted colors. Mobile: 16px margins (left-4 right-4 bottom-4) + rounded-[12px] gives the "overlay not page" feeling. Container is `overflow-hidden` ONLY on the rounded card itself (NOT on the page), with internal `overflow-y-auto` on the form scroll region so long content scrolls inside the card.
       - Internal layout (top-to-bottom inside the card, with internal scroll for the form region):
         a. Header strip (sticky inside the card): heading "Get in touch" using `style={{ fontFamily: 'var(--font-sans)' }}`, sized like the home headline (clamp 1.5rem-2.5rem) — pull from `content.contact.heading`.
         b. Two-column body on lg, single-column on mobile:
            - Left column (form, ~70% on lg): Name input row + Email input row (stacked, full-width, NOT side-by-side) — both with bordered cells like the existing ContactForm name/email pattern. Subject chips (reuse SubjectChip pattern — duplicate inline; do NOT import from ContactForm). Full-width Message <textarea> (NO FormLog, NO right-side log column). Send Message (yellow on inverse → use bg-bg-fill-primary-hover or border-border-primary outlined-on-inverse — pick the secondary outlined pattern with rounded-full radius matching the existing Submit button at ContactForm.tsx lines 246-261) + Clear button (outlined, rounded-[12px]) at the bottom of the form column.
            - Right column (links, ~30% on lg, below the form on mobile): vertical list of social links — LinkedIn, GitHub, Instagram, YouTube (drop Twitch per spec). Each row: full-width row showing label on the left and `↗` (U+2197) glyph on the right, styled as a borderless or thin-bordered list (mono uppercase tracking, hover swaps text color via `text-text-on-outline-hover`). Use `target="_blank" rel="noopener noreferrer"`.
         c. Footer-of-card row (bottom-right): Close pill button + square × icon button as a paired group (mirror FooterSection.tsx ctaGroup at lines 222-347 but always shows "Close" / "×" — no toggle). Clicking either calls the local close handler.
       - Reuse `useContactForm(form.validation)` from `@/hooks/useContactForm` exactly as ContactForm.tsx does. Do NOT re-implement validation. Render `status === 'success'` state by replacing the form with `content.contact.form.success` + `successDetail` heading + a Close button (matches existing success pattern if any; otherwise a clean 2-line success card is fine).
       - Local SOCIAL_ICONS map (LinkedIn / GitHub / Instagram / YouTube only) — copy from FooterSection.tsx lines 11-42, drop Twitch.
       - Easing constants at top of file: `const EASE = 'cubic-bezier(0.16,1,0.3,1)'`, `const EASE_OUT = 'cubic-bezier(0.22,0.31,0,1)'`.
       - When closing (Esc, × or Close click): set `isOpen = false`. The card's transition handles the exit; no need to unmount — keep DOM mounted for re-open speed (pointer-events:none + opacity:0 prevents tab focus when closed). After exit transition completes, optionally call `resetForm()` if `status !== 'submitting'` (use a setTimeout matching transition duration).
       - Keyboard parity: confirm tab order flows naturally through inputs → chips → textarea → submit → clear → social links → close pill → close ×. No focus trap (since aria-modal="false" + body scrollable means this is non-modal).

    2) Edit `src/components/sections/v2/StickyLogoBar.tsx`:
       - Add `data-share-with-ai` attribute to the `<a href="/llms.txt">` element (line 28-31). This is the IntersectionObserver target the FAB watches.
       - No other changes — keep all existing classes, transitions, and label markup intact.
       - Diff is intentionally minimal: a single attribute add.
  </action>
  <verify>
    <automated>pnpm tsc --noEmit</automated>
  </verify>
  <done>
    - `ContactOverlay.tsx` exists, renders nothing visible until `open-contact` is dispatched, then animates in from bottom-right, listens to Escape + `close-contact`.
    - StickyLogoBar's `ask about` anchor has `data-share-with-ai` attribute.
    - `pnpm tsc --noEmit` exits 0.
    - No raw hex colors, no shadows, all radii are 12px (card) or 999px (pills), data-theme="inverse" on the card wrapper.
  </done>
</task>

<task type="auto">
  <name>Task 2: Build FloatingContactButton (FAB) and slim FooterSection + mount both in PageShell</name>
  <files>src/components/sections/v2/FloatingContactButton.tsx, src/components/sections/v2/FooterSection.tsx, src/components/layout/PageShell.tsx</files>
  <action>
    1) Create `src/components/sections/v2/FloatingContactButton.tsx` ('use client'):
       - Watch `[data-share-with-ai]` (the StickyLogoBar's `ask about` anchor) via IntersectionObserver. The FAB is `visible` ⇔ target is NOT intersecting. Initial state: hidden (because the target is in view at page load).
       - Implementation sketch:
         ```ts
         const [visible, setVisible] = useState(false)
         useEffect(() => {
           const target = document.querySelector('[data-share-with-ai]')
           if (!target) return
           const obs = new IntersectionObserver(([entry]) => {
             setVisible(!entry.isIntersecting)
           }, { threshold: 0, rootMargin: '0px 0px -10% 0px' })  // small bottom margin so FAB shows just before target fully exits top
           obs.observe(target)
           return () => obs.disconnect()
         }, [])
         ```
         Note: Cannot reuse `useInView` directly because that hook attaches to a ref the component itself owns; the FAB needs to observe an external element. Inline observer is correct here.
       - Render a fixed bottom-right pill+icon group (mirror StickyLogoBar's primary CTA at lines 28-88, but the label is "Contact" and the click handler dispatches `window.dispatchEvent(new CustomEvent('open-contact'))` — NOT a link to /llms.txt):
         - Container: `fixed bottom-4 right-4 lg:bottom-6 lg:right-6 z-[70]` (z below overlay's 80, above page).
         - Pill button: `bg-bg-fill-primary text-text-on-primary rounded-full px-8 h-12` with the same masked vertical text-swap on hover via `.type-overlay-hover` (Epilogue → mono).
         - Icon square: `bg-bg-fill-primary text-text-on-primary rounded-[12px] size-12` showing a "+" glyph (or arrow → if the design uses it; "+" matches FooterSection's existing CTA group and is consistent with the Contact pattern).
         - Both buttons share a single `groupHovered` state for synchronized hover (same as StickyLogoBar lines 23-27).
       - Visibility transitions:
         ```jsx
         style={{
           transform: visible ? 'translateY(0)' : 'translateY(120%)',
           opacity: visible ? 1 : 0,
           pointerEvents: visible ? 'auto' : 'none',
           transition: reduced
             ? 'none'
             : `transform 0.5s cubic-bezier(0.22,0.31,0,1), opacity 0.3s cubic-bezier(0.16,1,0.3,1)`,
         }}
         ```
       - Reduced-motion: same useRef pattern as ContactOverlay.
       - Clicking either button: `window.dispatchEvent(new CustomEvent('open-contact'))`.
       - aria: pill has `aria-label="Open contact form"`; square has `aria-label="Open contact form"`.

    2) Refactor `src/components/sections/v2/FooterSection.tsx` — slim it down:
       - DELETE all of: ContactForm import, FormLog usage (already not directly imported here, but verify), the SocialLink helper, SecondaryFill helper, SOCIAL_ICONS map, all open/close state (`isOpen`, `isExpanded`, `showContent`, `groupHovered`), `openDrawer`/`closeDrawer`/`toggleDrawer` callbacks, the `open-contact` event listener, the Escape key listener, the scrollIntoView effect, the entire grey-card right-half block.
       - REPLACE the `<footer>` body with a single bottom row, full width:
         - Layout: `flex items-center justify-between gap-4 flex-wrap`
         - Left side: tags row (Next.js / React / Tailwind / Vercel pills — keep TECH_TAGS const) followed by `© 2026 Caio Ogata` mono stamp. Same styling as the existing tags+copyright block at lines 384-396.
         - Right side: `ctaGroup` (Contact pill + + square). Click handler on BOTH buttons: `window.dispatchEvent(new CustomEvent('open-contact'))` (no local toggle state). Keep the masked text-swap hover; drop the open/close state machinery — it's now ALWAYS in the "Contact" + "+" state. Use a simple `groupHovered` boolean for hover.
       - Keep `useInView` for the entrance animation and the `-entrance -slide-up -a-0` classes.
       - Outer footer: `px-5 md:px-8 lg:px-16 pt-32 md:pt-40 pb-8` (was pt-[400px], now reduced — there's no longer a giant card occupying space, so the visual hero spacing is lower; keep it generous but not 400px).
       - Result: file shrinks from ~419 lines to ~80 lines. No mobile/desktop branching beyond `md:` / `lg:` text and padding utilities.

    3) Edit `src/components/layout/PageShell.tsx`:
       - Add imports for `ContactOverlay` and `FloatingContactButton` from `@/components/sections/v2/`.
       - Render BOTH at the END of the fragment, AFTER `<ProjectsGrid />`:
         ```tsx
         return (
           <>
             <IntroSection />
             <MenuSection content={typedContent.menu} />
             <ProjectsGrid />
             <FloatingContactButton />
             <ContactOverlay />
           </>
         )
         ```
       - Note: PageShell does not currently render FooterSection — verify whether the home page imports the footer elsewhere (likely src/app/page.tsx). If FooterSection is mounted by the page (not PageShell), leave PageShell alone for the footer; the overlay + FAB still mount here. Add a comment in PageShell noting the overlay is intentionally root-level for fixed-position correctness across all home sections.
       - If FooterSection IS rendered inside PageShell (verify by re-reading PageShell.tsx — current Read shows only Intro/Menu/Projects), add `<FooterSection />` after ProjectsGrid and before the new components in the same fragment to preserve current layout. (Decision logged in task action: do not add FooterSection if it's already mounted by page.tsx.)
  </action>
  <verify>
    <automated>pnpm tsc --noEmit</automated>
  </verify>
  <done>
    - `FloatingContactButton.tsx` exists and observes `[data-share-with-ai]`; visible iff target out of viewport.
    - `FooterSection.tsx` is slim (~80 lines), no ContactForm import, no expand state — Contact button just dispatches `open-contact`.
    - `PageShell.tsx` mounts `<ContactOverlay />` and `<FloatingContactButton />` as root siblings.
    - `pnpm tsc --noEmit` exits 0.
    - `pnpm lint` (if configured) does not regress.
    - No removal of ContactForm.tsx, FormLog.tsx, useContactForm.ts — those stay as the underlying form primitives the overlay reuses.
  </done>
</task>

<task type="checkpoint:human-verify" gate="blocking">
  <name>Task 3: Manual scroll + interaction verification (browser)</name>
  <what-built>
    - ContactOverlay floating bottom-right (50% × 80% on desktop, full-viewport with 16px margins on mobile).
    - FloatingContactButton FAB that surfaces when StickyLogoBar's `ask about` CTA leaves the viewport.
    - Slim FooterSection (tags + © + Contact pill, no expand).
    - Three open paths: footer Contact button, FAB, programmatic `open-contact` event (e.g. from MenuSection).
  </what-built>
  <how-to-verify>
    Run `pnpm dev` and visit http://localhost:3000:

    1. **Initial state (top of page):**
       - StickyLogoBar's yellow `ask about` CTA visible top-right.
       - FAB NOT visible (target is in viewport).
       - Footer (at the bottom of the page when scrolled all the way down) shows tags + © + Contact pill.
       - No overlay visible.

    2. **Scroll down:**
       - When `ask about` CTA scrolls out of view (around top of MenuSection), FAB animates in from bottom-right (slide-up + fade).
       - Body keeps scrolling normally — no scroll lock.

    3. **Scroll back up:**
       - As `ask about` CTA re-enters viewport, FAB animates out (slide-down + fade).

    4. **Open via FAB (mid-page):**
       - Click FAB pill (or +). Overlay animates in from bottom-right (50%×80% on desktop).
       - **No backdrop appears.** Body still scrolls behind the overlay (try scrolling the page while overlay is open — it should work).
       - Overlay has yellow brand fill, 12px radius, no shadow.

    5. **Open via footer Contact (bottom of page):**
       - Scroll to bottom; click footer Contact pill or +. Same overlay opens.

    6. **Open via existing channel (Menu):**
       - From MenuSection, navigate to Contact item and press Enter. Same overlay opens (the existing `open-contact` dispatch from MenuSection.tsx:35 still works).

    7. **Form interaction:**
       - Fill Name, Email, pick a Subject chip, type a Message.
       - Submit — should POST to /api/contact (Resend); confirm via Network tab. Successful response shows the success state inside the card.
       - Clear button resets the form.
       - NO FormLog column visible (per spec).

    8. **Social links:**
       - Right column shows LinkedIn / GitHub / Instagram / YouTube as a vertical list, each with `↗` glyph at the right.
       - Hover swaps colors via the secondary fill pattern.
       - Click opens new tab.

    9. **Close paths:**
       - Press Escape → overlay closes.
       - Click "Close" pill at bottom-right of card → overlay closes.
       - Click × icon → overlay closes.

    10. **Mobile (resize to <768px):**
        - Overlay becomes full-viewport with 16px margins on all four sides, still 12px rounded corners, still no backdrop.

    11. **Reduced motion:**
        - Toggle macOS Reduce Motion in System Settings → Accessibility → Display.
        - Reload, repeat steps 4-9: overlay and FAB appear/disappear instantly (no transitions), no jank.

    12. **Keyboard parity:**
        - Tab through the page; FAB is focusable when visible; tabbing into the overlay walks Name → Email → chips → textarea → Send → Clear → social links → Close → ×.
  </how-to-verify>
  <resume-signal>Type "approved" to commit, or list issues for revision.</resume-signal>
</task>

</tasks>

<verification>
1. `pnpm tsc --noEmit` exits 0 (run after each code task).
2. Manual verification checklist (Task 3) all pass.
3. No raw hex colors introduced in any new file.
4. No shadows introduced (depth via tonal stacking only — yellow inverse surface is enough).
5. All radii are 12px (card, square buttons), 999px (pills), or 0px (intentionally unused).
6. ContactForm.tsx and FormLog.tsx are NOT modified — they remain the V2 primitives used by the now-unused inline expand path. (They could be deleted in a follow-up if no other call-site uses them.)
</verification>

<success_criteria>
- Footer is a normal bottom-of-page bar — tags + © + Contact pill, no expansion, no card.
- ContactOverlay opens from three triggers (footer, FAB, programmatic `open-contact`).
- ContactOverlay sits bottom-right (50%×80% lg / full-vp mobile + margins), yellow inverse theme, no backdrop, body scrolls underneath.
- FAB visibility is bound to StickyLogoBar's `ask about` CTA viewport status via IntersectionObserver.
- All transitions use the project's CSS easing tokens; reduced-motion disables them.
- Keyboard parity: Escape closes; tab order is natural; no focus trap (non-modal).
- `pnpm tsc --noEmit` exits 0.
</success_criteria>

<output>
After completion, create `.planning/quick/260429-tgx-convert-footer-contact-form-from-inline-/260429-tgx-SUMMARY.md` with:
- Files modified + line counts before/after for FooterSection.
- Two new components' purposes + the IntersectionObserver target contract.
- Any decisions taken under discretion (e.g. FAB icon choice +/→, overlay height fallback on short viewports).
- Status of `pnpm tsc --noEmit` and any blockers (e.g. pre-existing WasmHash cache corruption — surface, do not auto-fix).
</output>
