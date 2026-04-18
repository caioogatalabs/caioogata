# Phase 4: Core Content Sections - Discussion Log

> **Audit trail only.** Do not use as input to planning, research, or execution agents.
> Decisions are captured in CONTEXT.md — this log preserves the alternatives considered.

**Date:** 2026-04-18
**Phase:** 04-core-content-sections
**Areas discussed:** About layout, Experience expand mechanism, Skills visual treatment, Section ordering & theming
**Mode:** --auto (recommended defaults selected)

---

## About Layout

| Option | Description | Selected |
|--------|-------------|----------|
| 4-8 grid (heading+expertise left, bio right) | Asymmetric layout matching Design.md principles | ✓ |
| 6-6 grid (equal columns) | Balanced but less editorial |  |
| Full-width stacked | Simple but loses grid identity |  |

**User's choice:** [auto] 4-8 grid (recommended default)
**Notes:** Pull quotes as display-sm with tonal shift bg. Expertise as label-sm uppercase vertical list. Discussed and agreed in pre-discussion planning session with user.

---

## Experience Expand Mechanism

| Option | Description | Selected |
|--------|-------------|----------|
| Accordion inline (CSS grid-rows) | Maintains vertical flow, mobile-friendly, CSS-only | ✓ |
| Lateral panel | Side panel with details — breaks grid on mobile |  |
| Modal overlay | Full detail view — disrupts reading flow |  |

**User's choice:** [auto] Accordion inline (recommended default). User explicitly agreed to this approach in the pre-discussion planning session: "Recomendo accordion inline (não panel lateral)."
**Notes:** 3-6-3 collapsed, 3-9 expanded. Career grouping for Azion's 3 roles. Compact rows for minor roles without achievements.

---

## Skills Visual Treatment

| Option | Description | Selected |
|--------|-------------|----------|
| Dot system (●●●●/●●●○/●●○○/●○○○) | Minimal, brutalista, monochrome | ✓ |
| Progress bars | Dashboard-like, too corporate |  |
| Text labels (EXPERT/ADV/PROF) | Blueprint-style but less scannable |  |
| Tags/pills | Modern but loses hierarchy |  |

**User's choice:** [auto] Dot system (recommended default). User proposed this in pre-discussion: "dot system... minimal, brutalista, sem color coding desnecessário."
**Notes:** 4-4-4 grid, heading-sm uppercase category titles. Alternative: text labels — to be decided during visual implementation.

---

## Section Ordering & Theming

| Option | Description | Selected |
|--------|-------------|----------|
| About(dark) → Experience(light) → Skills(dark) | Tonal rhythm via "No-Line Rule" | ✓ |
| All dark | Uniform but loses section separation |  |
| Alternating with inverse (yellow) | Too much brand color on content sections |  |

**User's choice:** [auto] Tonal rhythm dark→light→dark (recommended default)
**Notes:** Sections placed between ProjectsGrid and Footer in PageShell. Each gets an id for future scroll-to-section.

---

## Claude's Discretion

- Pull quote text selection from bio
- Responsive grid stacking behavior
- Azion career grouping exact visual treatment
- Content type extensions if needed

## Deferred Ideas

- Menu scroll-to-section → Phase 5
- Light mode → post-launch
- i18n → post-launch
