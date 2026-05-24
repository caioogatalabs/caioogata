---
status: testing
phase: 03-project-pages
source: [03-01-SUMMARY.md, 03-02-SUMMARY.md, 03-03-SUMMARY.md]
started: 2026-04-06T15:30:00Z
updated: 2026-04-06T15:30:00Z
---

## Current Test

number: 1
name: Project Page Route & Shell
expected: |
  Navigate to `/projects/azion-website`. Page loads with project content visible — title, images, and sections rendered from `en.json` data. No 404 or blank page. URL stays at `/projects/azion-website`.
awaiting: user response

## Tests

### 1. Project Page Route & Shell
expected: Navigate to `/projects/azion-website`. Page loads with project content visible — title, images, and sections rendered. No 404 or blank page.
result: [pending]

### 2. Hero Block Display
expected: Hero shows project title in large display text (Fabio XM), data-stamp (PRJ_2022 // 001 format), role, technologies, and hero image(s). Images have 12px rounded corners.
result: [pending]

### 3. Challenge/Solution Section
expected: Below hero, a challenge/solution text block appears with heading + body layout. Challenge and Solution are separate sections with headings.
result: [pending]

### 4. Impact Stats Display
expected: Impact numbers display in large brand-colored text with labels below. Stats are arranged in columns (2 stats = 6-6 split, 3 = 4-4-4).
result: [pending]

### 5. Gallery Staggered Grid (Scroll Reveal)
expected: Image gallery with mixed column sizes (full-width, 6-6 split, 4-4-4). Images reveal with scroll-linked clip-path animation as you scroll down.
result: [pending]

### 6. Gallery Feature List (Parallax Float)
expected: Vertical list with feature name on left (3-col), image in center (6-col), description on right (3-col). Center image has subtle parallax float effect on scroll.
result: [pending]

### 7. Info Block (Dark Bar Metadata)
expected: At bottom of project, a dark bar section shows: Project name, Client/Role, Technologies, Year, Links in a grid layout. Links open in new tab.
result: [pending]

### 8. Credits Section
expected: Below info block, team credits listed with names linking to LinkedIn profiles. Only visible on projects that have credits data (e.g., huia).
result: [pending]

### 9. Inter-Project Navigation
expected: Navigation bar with prev/next project links appears below hero AND at the end of content. At last project, "next" becomes "Back to Home". At first project, "prev" is "Back to Home" or hidden.
result: [pending]

### 10. Keyboard Navigation
expected: Arrow keys (Left/Right) navigate between projects. Escape goes back to Home. Arrow keys do NOT interfere when typing in form inputs (e.g., contact form).
result: [pending]

### 11. Entrance Animations
expected: Page content appears with entrance animations (fade + slide-up) as sections come into viewport. Animations stagger naturally.
result: [pending]

### 12. OG Metadata
expected: Check page source or dev tools — each project page has unique `<title>`, `og:title`, `og:description`, and `og:image` tags matching the project content.
result: [pending]

## Summary

total: 12
passed: 0
issues: 0
pending: 12
skipped: 0
blocked: 0

## Gaps

[none yet]
