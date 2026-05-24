# Caio Ogata — Personal Brand Monorepo

Single git repo, five pillars, no pnpm workspaces. The only build target is `site/`.

## Pillars

- `site/` — the portfolio website (Next.js 15)
- `branding/` — visual identity: logo, typography, color, photography, guidelines
- `content/` — editorial production: YouTube, reels, IG posts, articles
- `career/` — job search: CVs, cover letters, application tracker
- `strategy/` — cross-pillar planning and brand roadmap
- `.archive/` — frozen legacy assets, not referenced by any build

## Routing

| Task | Go to | Read |
|------|-------|------|
| Site code, build, design system, GSD | `site/` | `site/CLAUDE.md` |
| Logo, fonts, color, brand guidelines | `branding/` | `branding/CONTEXT.md` |
| YouTube, reels, IG posts, articles | `content/` | `content/CONTEXT.md` |
| CVs, cover letters, job applications | `career/` | `career/CONTEXT.md` |
| Cross-pillar planning, brand roadmap | `strategy/` | `strategy/CONTEXT.md` |

## Conventions

- Content pieces use date-prefixed slugs: `YYYY-MM-{kebab-slug}`.
- Run all site build commands from `site/` (`cd site && pnpm dev`).
- Each pillar has a `README.md` (human orientation) and a `CONTEXT.md` (agent working context). Read the pillar's `CONTEXT.md` before working in it.
