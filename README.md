# Caio Ogata — Personal Brand Monorepo

One repository for the whole personal brand. Five pillars, each self-contained.

| Pillar | What lives here |
|--------|-----------------|
| [`site/`](site/) | The portfolio website — Next.js 15. Run builds from inside this folder. |
| [`branding/`](branding/) | Visual identity: logo, typography, color, photography, brand guidelines. |
| [`content/`](content/) | Editorial production: YouTube videos, reels, IG posts, articles. |
| [`career/`](career/) | Job search: CVs, cover letters, application tracker. |
| [`strategy/`](strategy/) | Cross-pillar planning and brand roadmap. |
| `.archive/` | Frozen legacy assets. Not referenced by any build. |

## Working here

- The site is the only thing that builds: `cd site && pnpm install && pnpm dev`.
- Each pillar has a `README.md` (start here) and a `CONTEXT.md` (working detail).
- Content naming convention: `YYYY-MM-{kebab-slug}`.

See [`CLAUDE.md`](CLAUDE.md) for the agent routing map.
