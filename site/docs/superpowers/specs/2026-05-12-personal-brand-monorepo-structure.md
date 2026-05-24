# Personal Brand Monorepo — Folder Structure

**Date:** 2026-05-12
**Revised:** 2026-05-21 — orientation-file model reworked to follow the Cliefnotes "Folder Architecture" method (lessons 1.2 and 3.3): root `CLAUDE.md` as a routing map, per-pillar `CONTEXT.md` as agent working context, per-pillar `README.md` as human orientation.
**Scope:** Reorganize `~/Projects/portolio-v1/` from a single-purpose Next.js portfolio into a single-repo personal brand monorepo housing five pillars: site, branding, content, career, strategy. No pnpm workspaces — flat folder structure, single build target (the site).
**Out of scope:** Migrating sibling projects in `~/Projects/` (Lukso, newtech, running, etc.) into this repo. Renaming the GitHub repo. Setting up Vercel re-routing or DNS changes. Splitting the 24KB `site/CLAUDE.md` into a routing file + `CONTEXT.md` (tracked as a follow-up — see below).

## Goals

1. Stop the mess: 50+ loose `.png` screenshots, 3 `.next.bak.*` folders, abandoned `.docx` files, and one-off folders (`crop-examples/`, `about-refs/`, `font-test/`) currently live at the repo root.
2. Give each brand activity (site, identity, content production, job search, strategy) a clear home with predictable conventions.
3. Make the structure resilient to growth — adding a new YouTube video, a new CV variant, or a new brand asset should have an obvious destination with zero ambiguity.
4. Preserve git history via `git mv` where possible.
5. Don't break the site build, GSD workflow, or Vercel deploy in the migration.

## Non-goals

- Becoming a "real" monorepo (pnpm workspaces, turborepo, multi-app build graph). Explicitly rejected — the user picked "repo único organizado por pastas".
- Cleaning up the *content* of legacy docs (PRD.md, CONTENT.md, etc.). They get archived, not rewritten.
- Solving content distribution workflow (where reels actually get uploaded). This spec only addresses where the source files live.

## Top-level structure

```
portolio-v1/                  # Repo name kept; rename is optional and out of scope here
├── site/                     # Next.js app — all current build code moves here
├── branding/                 # Visual identity source-of-truth
├── content/                  # Editorial/social production, by format
├── career/                   # Job search artifacts
├── strategy/                 # Cross-pillar planning docs
├── .archive/                 # Frozen legacy assets, never referenced by build
├── CLAUDE.md                 # The MAP: routing table + naming conventions. < 50 lines. No brain dump.
├── README.md                 # Human-facing map of the repo
└── .gitignore                # Updated: ignore site/.next, site/node_modules, .playwright-mcp/
```

### Orientation-file model (Cliefnotes method)

Three file roles, each doing only its job — `map / rooms / tools`:

| File | Where | Role | Audience | Rule |
|---|---|---|---|---|
| `CLAUDE.md` | root (+ `site/`) | **Map** — routing table: which task → which pillar → what to read | Agent (auto-loaded) | < 50 lines. Routing + naming only. Never a brief. |
| `CONTEXT.md` | one per pillar | **Room** — working context: what the pillar's work is, conventions, what good looks like, what to avoid | Agent (loaded on entry) | 80% about the work, 20% behavior. Has `updated:` frontmatter. |
| `README.md` | root + one per pillar | **Front door** — human orientation: what this is, what lives here | Human (GitHub renders it) | Short. Points at `CONTEXT.md` for the working detail. |

Every pillar gets **both** a `README.md` (human) and a `CONTEXT.md` (agent). The root `CLAUDE.md` carries the routing table so the agent never guesses which pillar a task belongs to.

**Root `CLAUDE.md` routing table:**

```
| Task                                  | Go to       | Read                    |
|----------------------------------------|-------------|-------------------------|
| Site code, build, design system, GSD   | site/       | site/CLAUDE.md          |
| Logo, fonts, color, brand guidelines   | branding/   | branding/CONTEXT.md     |
| YouTube, reels, IG posts, articles     | content/    | content/CONTEXT.md      |
| CVs, cover letters, job applications   | career/     | career/CONTEXT.md       |
| Cross-pillar planning, brand roadmap   | strategy/   | strategy/CONTEXT.md     |
```

## Pillar 1 — `site/`

Houses the existing Next.js 15 app. No internal reorganization — only moves.

```
site/
├── src/
├── public/
├── scripts/
├── .githooks/
├── .planning/                # GSD workflow state — moves here from repo root
├── docs/
│   ├── v2/                   # V2 design specs (existing)
│   ├── superpowers/          # Brainstorm/spec/plan docs (existing)
│   ├── llm-content-strategy.md
│   └── agent-driven-development-case.md
│   # extraction-webflow-design-composition.md moves to content/articles/ instead — it's a publishable case study, not site planning
├── package.json
├── next.config.mjs
├── tsconfig.json
├── postcss.config.mjs
├── next-env.d.ts
├── pnpm-lock.yaml
├── node_modules/             # .gitignored
├── .next/                    # .gitignored
├── CLAUDE.md                 # Current 24KB CLAUDE.md moves here; root CLAUDE.md becomes a short map
├── README.md
├── PROJECTS-GUIDE.md
├── LLMS-TXT-EXAMPLE.md
└── LLMS-TXT-UPDATE.md
```

**Operational implications:**
- `pnpm dev`, `pnpm build`, `pnpm lint` run from `site/`, not repo root.
- Vercel project settings: **Root Directory = `site`**. Must be set before next deploy.
- GSD commands (`/gsd:*`) run from `site/` since `.planning/` lives there.
- The `@/*` path alias in `tsconfig.json` continues to resolve correctly because `tsconfig.json` moves alongside `src/`.

## Pillar 2 — `branding/`

Source-of-truth for visual identity. Distinct from `content/` — branding is the *system*, content is the *output*.

```
branding/
├── logo/                     # Caio Ogata mark in all formats
│   ├── monogram-co.svg
│   ├── wordmark.svg
│   ├── lockups/              # Combined mark + wordmark variants
│   └── exports/              # PNG exports at standard sizes (256, 512, 1024, 2048)
├── typography/
│   ├── epilogue/             # Production sans (already in use)
│   ├── jetbrains-mono/       # Production mono (already in use)
│   └── candidates/           # font-test/ moves here — Pexel Grotesk, Fabio XM, Switzer, Freizeit100
├── color/                    # Palette source files, token exports
│   ├── tokens.json           # Mirrors site/src/tokens/primitives.css
│   └── palette.md            # Human-readable palette doc with usage rules
├── photography/              # Official headshot + variants
│   └── caio-ogata-profile.webp
├── moodboard/                # Reference captures, inspiration
│   └── about-refs/           # Moves from repo root about-refs/
├── templates/                # IG post template, YT thumbnail template, deck cover — added as created
│   └── .gitkeep              # Empty at start; full tree created now per build decision
├── BRAND.md                  # Voice, tone, do/don't, written brand guidelines (content, not meta)
├── CONTEXT.md                # Agent working context for branding work
└── README.md                 # Human front door
```

## Pillar 3 — `content/`

Editorial production, organized by format. Each piece is a self-contained folder with date-prefixed slug for chronological listing.

```
content/
├── videos/                   # YouTube long-form
│   └── YYYY-MM-{slug}/
│       ├── script.md
│       ├── shotlist.md
│       ├── assets/           # b-roll, screen recordings, captures
│       ├── thumbnails/
│       └── publish.md        # title, description, tags, YT URL after publish
├── reels/                    # IG/TikTok shorts (vertical)
│   └── YYYY-MM-{slug}/
│       ├── script.md
│       ├── assets/
│       └── publish.md
├── posts/                    # IG carousels, threads, single posts
│   └── YYYY-MM-{slug}/
│       ├── copy.md
│       ├── carousel-frames/  # Numbered: 1.png, 2.png, …
│       └── publish.md
├── articles/                 # Long-form written, pre-publish drafts and case studies
│   └── YYYY-MM-{slug}.md     # Single-file pieces; folder only if assets exist
├── CONTEXT.md                # Agent working context: slug convention, publish.md flow, what good looks like
└── README.md                 # Human front door
```

Each format subfolder (`videos/`, `reels/`, `posts/`, `articles/`) is created now with a `.gitkeep` so the full tree is visible from day one (per the build decision), even before the first piece exists.

**Slug convention:** `YYYY-MM-{kebab-topic}` — date prefix gives chronological `ls`, kebab is human-readable. Year and month only (not full date) keep names short; if two pieces in the same month would collide, add `-v2` or differentiate the slug.

**`publish.md` template** (lives in each piece folder):
```md
status: draft | scheduled | published
url:
published_at:
hook:
caption:
tags:
metrics: (filled post-launch)
```

## Pillar 4 — `career/`

Job search 2026 and ongoing.

```
career/
├── cv/                       # All CV variants and base
│   ├── cv-base.{md,docx,html}
│   ├── cv-{company}.{md,docx,html}
│   └── caioogata-cv-02.26.pdf
├── covers/                   # Cover letters, one per company
│   └── cover-{company}.{md,docx}
├── tracker/
│   └── job-search-2026.csv
├── briefs/                   # Strategy docs for the search
│   ├── job-search-content-brief.md
│   └── target-companies.md   # (future) prioritized targets
├── outreach/                 # Message templates, follow-up scripts
│   └── .gitkeep              # Empty at start
├── CONTEXT.md                # Agent working context for job-search work
└── README.md                 # Human front door
```

## Pillar 5 — `strategy/`

Cross-pillar planning. Empty of working docs at start — `CONTEXT.md` exists to explain the intent so it doesn't become a dumping ground.

```
strategy/
├── CONTEXT.md                # Agent working context: when something belongs here vs. in a pillar
└── README.md                 # Human front door
# brand-voice.md, content-calendar.md, roadmaps — created when the first real cross-pillar doc exists
```

## `.archive/` — frozen legacy

```
.archive/
├── next-builds/              # .next.bak.1777382724, .next.bak.broken-1777741099, .next.bak.epilogue-1777422548
├── screenshots/              # All loose *.png and *.jpeg from repo root
├── crop-examples/            # Existing crop-examples/ folder
├── legacy-docs/              # PRD.md, RECRUITER-FAQ.md, TECHNICAL-SPEC.md, CONTENT.md (V1, superseded by docs/v2/)
└── README.md                 # Explicit note: nothing in here is referenced by build; safe to delete after 6 months
```

The `.` prefix hides it from default `ls`, keeps it out of normal view without `.gitignore`-ing it (we want it in the repo as a safety net during the transition).

## Migration table

| Origin (current path) | Destination | Method |
|---|---|---|
| `src/`, `public/`, `scripts/`, `.githooks/` | `site/{...}` | `git mv` |
| `package.json`, `pnpm-lock.yaml`, `next.config.mjs`, `tsconfig.json`, `postcss.config.mjs`, `next-env.d.ts` | `site/{...}` | `git mv` |
| `node_modules/`, `.next/` | `site/{...}` (regenerate; not git-tracked) | reinstall after move |
| `.planning/` | `site/.planning/` | `git mv` |
| `docs/v2/`, `docs/superpowers/`, `docs/llm-content-strategy.md`, `docs/agent-driven-development-case.md` | `site/docs/{...}` | `git mv` |
| `docs/extraction-webflow-design-composition.md` | `content/articles/2026-04-extraction-webflow-design-composition.md` | `git mv` + rename |
| `CLAUDE.md` (current 24KB) | `site/CLAUDE.md` | `git mv` |
| `README.md`, `PROJECTS-GUIDE.md`, `LLMS-TXT-EXAMPLE.md`, `LLMS-TXT-UPDATE.md` | `site/{...}` | `git mv` |
| `font-test/` | `branding/typography/candidates/` | `git mv` |
| `about-refs/` | `branding/moodboard/about-refs/` | `git mv` |
| `public/caio-ogata-profile.webp` (also kept in site/public) | `branding/photography/` (canonical copy) | `cp` — site keeps its own |
| `docs/covers/` | `career/covers/` | `git mv` |
| `docs/cv/` | `career/cv/` | `git mv` |
| `docs/caioogata-cv-02.26.pdf` | `career/cv/caioogata-cv-02.26.pdf` | `git mv` |
| `docs/job-search-2026.csv` | `career/tracker/job-search-2026.csv` | `git mv` |
| `docs/job-search-content-brief.md` | `career/briefs/job-search-content-brief.md` | `git mv` |
| `.next.bak.1777382724/`, `.next.bak.broken-1777741099/`, `.next.bak.epilogue-1777422548/` | `.archive/next-builds/` | `git mv` (if tracked) or move + ensure `.gitignore` |
| All root-level `*.png` and `*.jpeg` (footer-*, hero-*, herbalife-*, philosophy-*, intro-*, our-project-*, overlay-*, home-*, cmp-*, alphamark-*, internal-*) | `.archive/screenshots/` | `git mv` |
| `crop-examples/` | `.archive/crop-examples/` | `git mv` |
| `PRD.md`, `RECRUITER-FAQ.md`, `TECHNICAL-SPEC.md`, `CONTENT.md` | `.archive/legacy-docs/` | `git mv` |
| `.playwright-mcp/` | (delete + add to `.gitignore`) | `rm -rf` + edit `.gitignore` |
| `index.tsx`, `nul` at root | inspect, then likely delete | manual review |
| `.env.local` | `site/.env.local` | `mv` (not tracked, no git history concern) |

**All AI tool dotfiles at root** (`.adal/`, `.agent/`, `.augment/`, `.cline/`, `.codebuddy/`, `.commandcode/`, `.continue/`, `.crush/`, `.cursor/`, `.factory/`, `.goose/`, `.iflow/`, `.junie/`, `.kilocode/`, `.kiro/`, `.kode/`, `.mcpjam/`, `.mux/`, `.neovate/`, `.openhands/`, `.pi/`, `.pochi/`, `.qoder/`, `.qwen/`, `.roo/`, `.trae/`, `.vibe/`, `.windsurf/`, `.zencoder/`): leave at root. They're per-user IDE config and harmless. Optionally `.gitignore` later.

## New files to create

**Root level:**
1. **Root `CLAUDE.md`** — the MAP. < 50 lines. Contains: one-line identity, the five-pillar list, the routing table (see Orientation-file model above), and the global naming convention (`YYYY-MM-{kebab-slug}`). No project brief, no style guide — that is Mistake 1.
2. **Root `README.md`** — human-facing pillar map.

**Per pillar — every pillar gets both files:**
3. **`{pillar}/CONTEXT.md`** — agent working context. Structure: `updated:` frontmatter line, what the pillar's work is, conventions, what good output looks like, what to avoid. 80% about the work, 20% behavior (Mistake 4). One screen max.
4. **`{pillar}/README.md`** — human front door. Short: what the pillar is, what lives here / what does NOT, pointer to `CONTEXT.md`.
   - Applies to: `branding/`, `content/`, `career/`, `strategy/`. (`site/` keeps its existing `CLAUDE.md` + `README.md`.)
5. **`branding/BRAND.md`** — placeholder: "voice, tone, do/don't — to be filled". This is brand *content*, distinct from `CONTEXT.md` (agent meta).
6. **`.archive/README.md`** — "Frozen. Not referenced by build. Safe to delete after 6 months."

**`.gitkeep` files** — in every empty leaf folder so the full tree is committed now (per the build decision): `branding/templates/`, `content/{videos,reels,posts,articles}/`, `career/outreach/`, and any others created empty.

**Updated `.gitignore`** — add `site/.next/`, `site/node_modules/`, `.playwright-mcp/`.

## Cliefnotes "Folder Architecture" — mistake check

The structure was audited against the 7 common mistakes from Cliefnotes lesson 3.3:

| Mistake | Status in this spec |
|---|---|
| 1. `CLAUDE.md` too long (it's a routing file) | Root `CLAUDE.md` capped at < 50 lines — routing table only. **`site/CLAUDE.md` (24KB) still violates this** — see follow-ups. |
| 2. Skipping the routing table | Routing table is mandatory in root `CLAUDE.md` (3 columns: task / go to / read). |
| 3. Too many workspaces | 5 pillars. Each is a genuinely distinct mental mode (build / design / create / job-hunt / plan). `strategy/` is the thinnest — `CONTEXT.md` guards it from becoming a dump. |
| 4. Context files about the AI, not the work | `CONTEXT.md` standard: 80% work, 20% behavior. |
| 5. Never updating context files | `CONTEXT.md` carries an `updated:` frontmatter line. |
| 6. Everything flat in one folder | The whole point — root drops from ~120 entries to ~8. |
| 7. Building the whole system before using it | **Partial deviation, by user choice.** Full tree is created upfront (with `.gitkeep`) for predictability. Risk: empty folders may not match real use. Mitigated by each folder having a `CONTEXT.md`/`README.md` stating its purpose. Re-evaluate at the 3-month follow-up. |

## Risks and mitigations

| Risk | Likelihood | Mitigation |
|---|---|---|
| Vercel build breaks because Root Directory still points at repo root | High | Update Vercel project settings to `Root Directory = site` BEFORE pushing the migration commit |
| GSD commands fail because `.planning/` moved | Medium | Run `/gsd:health` from `site/` after migration to validate; document the new working dir in `site/CLAUDE.md` |
| Git history harder to follow for moved files | Low | Accept — `git log --follow <path>` works for individual files. The reorganization happens in a single commit so the move is easy to identify in `git log`. |
| Imports break because of relative path changes | Very low | `@/` alias resolves via `tsconfig.json` which moves with `src/`. Relative paths within `src/` are unaffected. Test by running `pnpm build` after the move. |
| LLM routes (`/llms.txt`, `/llms-full.txt`) break because of moved content references | Low | Routes read from `src/content/` which moves intact. No external references to docs/. Verify by running the site and curl-ing the routes. |
| The `.archive/` folder bloats git LFS / repo size | Low-Medium | Tracked PNGs go into `.archive/screenshots/`. Already in repo, so no new bloat. If size becomes an issue, follow up with `git filter-repo` to excise — but not in this scope. |

## Validation checklist

After migration, all of the following must be true:

- [ ] `cd site && pnpm install && pnpm dev` boots the site at `localhost:3000` without errors
- [ ] `cd site && pnpm build` completes with the same output count as before (page count, bundle sizes within ±5%)
- [ ] Visiting `/llms.txt`, `/llms-full.txt`, `/llms/projects/{any-slug}.txt` returns valid markdown
- [ ] `/gsd:health` from `site/` reports planning structure intact
- [ ] Repo root `ls` shows only: `site/`, `branding/`, `content/`, `career/`, `strategy/`, `.archive/`, `CLAUDE.md`, `README.md`, `.git/`, `.gitignore`, plus the unmoved AI tool dotfiles
- [ ] Root `CLAUDE.md` is under 50 lines and contains the routing table
- [ ] `branding/`, `content/`, `career/`, `strategy/` each have both a `README.md` and a `CONTEXT.md`
- [ ] Vercel preview deploy of the migration branch succeeds
- [ ] No file referenced by `site/src/**` lives outside `site/` (grep for any path like `../../docs/` or `../about-refs/`)

## Open follow-ups (post-migration)

- **Split `site/CLAUDE.md` (24KB).** It currently violates Cliefnotes Mistake 1 — a routing file carrying 24KB of design-system, animation, and token rules. Follow-up: shrink `site/CLAUDE.md` to a routing map and move the technical rules into one or more `CONTEXT.md` files next to the code they govern (e.g. `site/src/components/CONTEXT.md`). Deliberately deferred — keeps this migration single-purpose (which is Mistake 7's lesson).
- Decide whether to rename the GitHub repo (`portolio-v1` → `caioogata` or similar).
- Decide whether to extract `branding/` into its own repo if it grows or needs to be shared with external collaborators (designer, agency).
- Set up a content-publish workflow: when a piece in `content/{format}/{slug}/publish.md` goes from `status: draft` to `published`, optionally trigger an entry on the site (out of scope for this spec).
- Evaluate after 3 months whether the upfront-built empty folders (`strategy/`, content format folders, `branding/templates/`) match real use, or should be pruned (Cliefnotes Mistake 7 re-check).
