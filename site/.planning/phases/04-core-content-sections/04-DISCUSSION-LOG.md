# Phase 4: Core Content Sections - Discussion Log

> **Audit trail only.** Do not use as input to planning, research, or execution agents.
> Decisions are captured in CONTEXT.md — this log preserves the alternatives considered.

**Date:** 2026-04-18
**Phase:** 04-core-content-sections
**Areas discussed:** Experience Section, About Section, Skills Section
**Context:** Update session — previous implementation was reverted, user revisiting decisions before re-execution.

---

## Session 1 (auto mode) — Initial context capture

Original decisions D-01 through D-23 were auto-selected. See git history for the original discussion log.

---

## Session 2 (interactive) — Revision after revert

### Experience Section

#### Layout/Grid

| Option | Description | Selected |
|--------|-------------|----------|
| Full-width rows | Date + company + title in a single horizontal line, no rigid grid splits | |
| 2-10 grid | Narrow left column for date, wide right for company + title + expand | |
| Stacked rows | Company/title on one line, date below in smaller text | |
| Other (user) | Menu-style rows with 3-3-3-3 grid, fiddle hover pattern, 6-6 expanded content | ✓ |

**User's choice:** Full rethink — Experience rows should follow the MenuSection hover pattern (yellow bar, masked text swap, display arrow). Rows in 3-3-3-3 grid (Date | Company | Title | Arrow). On click/enter, row expands to reveal content in 6-6 layout (description left, achievements right). Expanded row stays in brand yellow.

#### Row Columns

| Option | Description | Selected |
|--------|-------------|----------|
| Date, Company, Title, Location | Classic CV layout — 4 equal data columns | |
| Date, Company, Title, Arrow/Indicator | 3 data columns + visual expand indicator | ✓ |
| Date, Company+Title, Description, Arrow | Company and title merged, short description teaser | |

**User's choice:** Date | Company | Title | Arrow/Indicator

#### Hero

| Option | Description | Selected |
|--------|-------------|----------|
| Section title + subtitle | Large heading with brief subtitle line | |
| Section title + stats | Large heading plus key numbers (years, companies, roles) | ✓ |
| Full hero with image/gradient | Background treatment with section title overlaid | |

**User's choice:** Section title + stats

#### Active Color

| Option | Description | Selected |
|--------|-------------|----------|
| Brand yellow (bg-fill-primary) | Same yellow as menu hover bar | ✓ |
| A green accent | New green color | |
| Surface secondary tint | Subtle tonal shift | |

**User's choice:** Brand yellow — consistent with existing interaction language

#### Azion Grouping

| Option | Description | Selected |
|--------|-------------|----------|
| Nested/indented rows | Azion parent row with 3 expandable sub-roles | |
| Sequential with visual link | 3 separate rows connected by left accent line | |
| No special grouping | All 12 roles treated equally | ✓ |

**User's choice:** No special grouping — dates and company name tell the progression story naturally

---

### About Section

#### Direction

| Option | Description | Selected |
|--------|-------------|----------|
| Magazine editorial | Large typographic treatment, bio as statement piece | |
| Data terminal | Structured like system profile, blueprint aesthetic | |
| Split narrative | Two zones: personal identity + professional credentials | |
| Other (user) | Scroll-driven frame-by-frame video hero + editorial content below | ✓ |

**User's choice:** Hero with scroll-driven frame-by-frame video (person walking under bridge = "bridging" narrative). Content composed over video like Monolith Constructions reference. Below the video: 6-6 grid with left empty, content in right column only.

#### Frame Technology

| Option | Description | Selected |
|--------|-------------|----------|
| Canvas + image sequence | Extract frames to WebP, draw to canvas on scroll | ✓ |
| CSS scroll-timeline + video | Native API to scrub mp4 directly | |
| Reduced frame set + crossfade | ~60 key frames with crossfade | |

**User's choice:** Canvas + image sequence (Apple-style approach)

#### Content Over Video

| Option | Description | Selected |
|--------|-------------|----------|
| Other (user) | Headline "Bridging brand..." + core expertise list, then main content after | ✓ |

**User's choice:** Headline + core expertise overlaid on video. Main content appears after video scroll zone completes.

#### Post-Hero Layout

| Option | Description | Selected |
|--------|-------------|----------|
| Keep 4-8 layout | Original About decisions | |
| Full-width editorial | Bio as wide column statement | |
| 6-6 split | More balanced split | |
| Other (user) | 6-6 with left empty, content only in right column | ✓ |

**User's choice:** 6-6 grid, left column empty, content scrolls only in the right block. Asymmetric editorial.

---

### Skills Section

#### Changes Needed

| Option | Description | Selected |
|--------|-------------|----------|
| Layout/grid | Grid or category arrangement | ✓ |
| Level indicators | Dot system or proficiency display | ✓ |
| Needs a hero too | Display heading + stats pattern | ✓ |
| Complete rethink | New direction entirely | |

#### Grid Layout

| Option | Description | Selected |
|--------|-------------|----------|
| 6-6 (2 per row) | Two wider columns, 3 rows | |
| 3-3-3-3 (4 per row) | Compact, data-dense | |
| Full-width list | Each category as full-width row | |
| Other (user) | 6-6 with skills left and projects right, connected by SVG lines | ✓ |

**User's choice:** 6-6 grid — skills on left, projects/cases on right. SVG connecting lines between skills and projects (Nike "Articulated Speed" reference). Bidirectional hover highlighting.

#### Level Indicators

| Option | Description | Selected |
|--------|-------------|----------|
| Other (user) | Progress bar over divider + text label below | ✓ |

**User's choice:** Text label below the divider between skills. Thicker bar overlaying the divider as a progress bar showing proficiency level (like V1 but refined). Divider = track, bar = fill.

#### Connecting Lines

| Option | Description | Selected |
|--------|-------------|----------|
| Highlight on hover | Hovering highlights lines + connected items, others dim | ✓ |
| Always visible, static | No interaction | |
| Draw on scroll | Lines draw on scroll entry, then highlight on hover | |

#### Bidirectionality

| Option | Description | Selected |
|--------|-------------|----------|
| Yes, bidirectional | Hover skill → see projects. Hover project → see skills. | ✓ |
| Skills only | Only hovering skills highlights connections | |

---

## Claude's Discretion

- Frame extraction tooling and optimization (number of frames, compression)
- Scroll-to-frame mapping curve
- SVG line rendering approach (bezier vs straight)
- Responsive simplification for mobile (skills map, experience grid)
- Skill-to-project data structure location
- Hero stats exact content
- Video-to-content transition

## Deferred Ideas

- Clickable project links in Skills map navigating to project pages — Phase 5 or post-launch
