<!-- GSD:project-start source:PROJECT.md -->
## Project

**Portfolio V2 — Caio Ogata**

Evolution of caioogata.com portfolio from V1 (CLI-inspired monospace) to V2 (Architectural Brutalism). Same content, same tone, but with refined typography (Fabio XM), brutalista/minimalist aesthetic, rich micro-interactions, dedicated project pages, and a token-first design system. Target: design directors, engineering managers, and recruiters evaluating senior design/engineering leadership.

**Core Value:** The portfolio must communicate design engineering credibility through its own craft — the UI itself is the strongest portfolio piece.

### Constraints

- **Stack**: Next.js 15 (App Router) + React 19 + Tailwind v4 + pnpm + Vercel
- **Export**: Static export in production (`output: 'export'`) — no server-side features in pages
- **Performance**: No WebGL, CSS/JS animations only, `prefers-reduced-motion` respected
- **Font**: Fabio XM is trial version — display use only, verify license before production
- **Grid**: 12-column system, all layouts use column spans (6-6, 4-4-4, 3-6-3, 2-8-2)
- **Radius**: 12px default for components, 999px for pill buttons, 0px eliminated
- **Shadows**: None — depth via tonal stacking only (Design.md rule)
- **Color**: 60-30-10 distribution — neutrals 60%, surfaces 30%, brand/accent 10%
<!-- GSD:project-end -->

<!-- GSD:stack-start source:STACK.md -->
## Technology Stack

Technology stack not yet documented. Will populate after codebase mapping or first phase.
<!-- GSD:stack-end -->

<!-- GSD:conventions-start source:CONVENTIONS.md -->
## Conventions

Conventions not yet established. Will populate as patterns emerge during development.
<!-- GSD:conventions-end -->

<!-- GSD:architecture-start source:ARCHITECTURE.md -->
## Architecture

Architecture not yet mapped. Follow existing patterns found in the codebase.
<!-- GSD:architecture-end -->

<!-- GSD:workflow-start source:GSD defaults -->
## GSD Workflow Enforcement

Before using Edit, Write, or other file-changing tools, start work through a GSD command so planning artifacts and execution context stay in sync.

Use these entry points:
- `/gsd:quick` for small fixes, doc updates, and ad-hoc tasks
- `/gsd:debug` for investigation and bug fixing
- `/gsd:execute-phase` for planned phase work

Do not make direct repo edits outside a GSD workflow unless the user explicitly asks to bypass it.
<!-- GSD:workflow-end -->



<!-- GSD:profile-start -->
## Developer Profile

> Profile not yet configured. Run `/gsd:profile-user` to generate your developer profile.
> This section is managed by `generate-claude-profile` -- do not edit manually.
<!-- GSD:profile-end -->
