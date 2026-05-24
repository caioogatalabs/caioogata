# Personal Brand Monorepo Restructure — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Reorganize the `portolio-v1` repo from a single Next.js app into a five-pillar personal brand monorepo (`site/`, `branding/`, `content/`, `career/`, `strategy/`) without breaking the site build, Vercel deploy, or GSD workflow.

**Architecture:** Single git repo, no pnpm workspaces. All current app code moves into `site/`. Brand assets, content production, job-search artifacts, and planning each get a top-level pillar folder. Legacy cruft is frozen in `.archive/`. Orientation follows the Cliefnotes "Folder Architecture" method: root `CLAUDE.md` is a routing map; each pillar has a `CONTEXT.md` (agent working context) and `README.md` (human front door).

**Tech Stack:** git, bash, Next.js 15 / pnpm (build verification only).

**Source spec:** `docs/superpowers/specs/2026-05-12-personal-brand-monorepo-structure.md` (moves to `site/docs/superpowers/specs/` during Task 2).

**Note on file moves:** Many target files are untracked (`.next.bak.*`, loose PNGs, `docs/cv/`, `docs/covers/`, `font-test/`, `about-refs/`, `crop-examples/`); some are tracked (`src/`, `package.json`, `index.tsx`). `git mv` fails on untracked files, so this plan uses plain `mv` followed by `git add -A <paths>`. Git detects renames at diff/log time, so history is preserved for tracked files.

**Note on commits:** One commit per task (frequent commits, safe bisect). The branch is squash-merged at PR time, satisfying the spec's "single commit in git log" intent.

**Note on the plan file:** This plan lives in `docs/superpowers/plans/` and is moved into `site/docs/superpowers/plans/` during Task 2. The executor loads it into context at start; the mid-run move does not interrupt execution. After Task 2, reference it at the new path.

---

## File structure (target)

```
portolio-v1/
├── site/          # Next.js app + its docs + .planning (GSD)
├── branding/      # logo, typography, color, photography, moodboard, templates, BRAND.md
├── content/       # videos/, reels/, posts/, articles/
├── career/        # cv/, covers/, tracker/, briefs/, outreach/
├── strategy/      # cross-pillar planning (CONTEXT.md + README.md only at start)
├── .archive/      # next-builds/, screenshots/, crop-examples/, legacy-docs/
├── CLAUDE.md      # routing map (< 50 lines)
├── README.md      # human pillar map
└── .gitignore     # updated
```

---

## Task 1: Branch and capture build baseline

**Files:**
- Create: `/tmp/monorepo-baseline.txt` (scratch, not committed)

- [ ] **Step 1: Create the restructure branch**

Run:
```bash
git checkout -b chore/monorepo-restructure
```
Expected: `Switched to a new branch 'chore/monorepo-restructure'`

- [ ] **Step 2: Confirm a clean-enough starting point**

Run:
```bash
git status --short | grep -v '^??' || echo "no tracked modifications"
```
Expected: only `docs/job-search-2026.csv` may show as modified (`M`), or "no tracked modifications". Untracked (`??`) entries are fine — they are migration inputs.

- [ ] **Step 3: Capture the build baseline**

Run:
```bash
pnpm build 2>&1 | tee /tmp/monorepo-baseline.txt | tail -40
```
Expected: build completes successfully. The route list and page count are saved to `/tmp/monorepo-baseline.txt` for comparison in Task 3.

- [ ] **Step 4: Record the route count**

Run:
```bash
grep -cE '^\s*[┌├└]\s*(○|●|ƒ|λ)' /tmp/monorepo-baseline.txt || grep -c '/' /tmp/monorepo-baseline.txt
```
Expected: a number (the count of generated routes). Note it — Task 3 must match it.

- [ ] **Step 5: Commit (branch marker only — nothing to commit yet)**

No commit. Proceed to Task 2.

---

## Task 2: Create `site/` and move all app code into it

**Files:**
- Create: `site/`
- Move into `site/`: `src/`, `public/`, `scripts/`, `.githooks/`, `.planning/`, `package.json`, `pnpm-lock.yaml`, `next.config.mjs`, `tsconfig.json`, `postcss.config.mjs`, `next-env.d.ts`, `vercel.json`, `.npmrc`, `CLAUDE.md`, `README.md`, `PROJECTS-GUIDE.md`, `LLMS-TXT-EXAMPLE.md`, `LLMS-TXT-UPDATE.md`, `.env.local`
- Move into `site/docs/`: `docs/v2/`, `docs/superpowers/`, `docs/llm-content-strategy.md`, `docs/agent-driven-development-case.md`
- Delete: `.next/`, `node_modules/`, `tsconfig.tsbuildinfo` (regenerated in Task 3)
- Leave at root (not part of the move): `skills-lock.json` — AI-tooling state, treated like the AI tool dotfiles.

- [ ] **Step 1: Create the `site/` folder and its `docs/` subfolder**

Run:
```bash
mkdir -p site/docs
```

- [ ] **Step 2: Move app code, config, and root docs into `site/`**

Run:
```bash
mv src public scripts .githooks .planning site/
mv package.json pnpm-lock.yaml next.config.mjs tsconfig.json postcss.config.mjs next-env.d.ts vercel.json .npmrc site/
mv CLAUDE.md README.md PROJECTS-GUIDE.md LLMS-TXT-EXAMPLE.md LLMS-TXT-UPDATE.md site/
mv .env.local site/
```
Expected: no output, no errors. (`vercel.json` must move so Vercel finds it once Root Directory is set to `site`; `.npmrc` carries the pnpm/corepack pin.)

- [ ] **Step 3: Move site-bound docs into `site/docs/`**

Run:
```bash
mv docs/v2 docs/superpowers site/docs/
mv docs/llm-content-strategy.md docs/agent-driven-development-case.md site/docs/
```
Expected: no output. `docs/` still contains `cv/`, `covers/`, `caioogata-cv-02.26.pdf`, `job-search-2026.csv`, `job-search-content-brief.md`, `extraction-webflow-design-composition.md` — those move in Tasks 5 and 6.

- [ ] **Step 4: Remove regenerable build artifacts**

Run:
```bash
rm -rf .next node_modules site/.next site/node_modules tsconfig.tsbuildinfo site/tsconfig.tsbuildinfo
```
Expected: no output. (`.next.bak.*` are NOT touched here — they move to `.archive/` in Task 8. `tsconfig.tsbuildinfo` is a gitignored TS cache, regenerated on build.)

- [ ] **Step 5: Stage the moves**

Run:
```bash
git add -A site/ src public scripts .githooks .planning package.json pnpm-lock.yaml next.config.mjs tsconfig.json postcss.config.mjs vercel.json .npmrc CLAUDE.md README.md PROJECTS-GUIDE.md LLMS-TXT-EXAMPLE.md LLMS-TXT-UPDATE.md docs/v2 docs/superpowers docs/llm-content-strategy.md
git status --short | head -20
```
Expected: staged entries show renames (`R`) for tracked files moving into `site/`. This pathspec is deliberate: it names only `site/` (new content) plus the tracked source paths whose deletion must be staged. `next-env.d.ts` is omitted (it is gitignored — Next regenerates it). `docs/cv/`, `docs/covers/`, `docs/agent-driven-development-case.md`, and `docs/extraction-webflow-design-composition.md` are NOT staged here — they are untracked and move in Tasks 5–6.

- [ ] **Step 6: Commit**

Run:
```bash
git commit -m "chore(monorepo): move Next.js app into site/"
```
Expected: commit succeeds.

---

## Task 3: Verify the site builds from `site/`

**Files:** none created — verification only.

- [ ] **Step 1: Reinstall dependencies inside `site/`**

Run:
```bash
cd site && pnpm install
```
Expected: install completes, `site/node_modules/` created.

- [ ] **Step 2: Build from `site/`**

Run:
```bash
cd site && pnpm build 2>&1 | tee /tmp/monorepo-after.txt | tail -40
```
Expected: build completes successfully.

- [ ] **Step 3: Compare route count to the baseline**

Run:
```bash
diff <(grep -oE '/[a-z0-9/_-]*' /tmp/monorepo-baseline.txt | sort -u) <(grep -oE '/[a-z0-9/_-]*' /tmp/monorepo-after.txt | sort -u) && echo "ROUTES MATCH"
```
Expected: `ROUTES MATCH` (no diff). If routes differ, STOP — a path reference broke; investigate before continuing.

- [ ] **Step 4: Boot the dev server and check the homepage**

Run:
```bash
cd site && (pnpm dev &) && sleep 8 && curl -s -o /dev/null -w "%{http_code}" http://localhost:3000/ && pkill -f "next dev"
```
Expected: `200`.

- [ ] **Step 5: Verify LLM routes still resolve**

Run:
```bash
cd site && (pnpm dev &) && sleep 8 && for r in /llms.txt /llms-full.txt; do echo -n "$r "; curl -s -o /dev/null -w "%{http_code}\n" "http://localhost:3000$r"; done && pkill -f "next dev"
```
Expected: each route returns `200`.

- [ ] **Step 6: Commit (no changes — verification gate)**

No commit. If all steps passed, proceed. If any failed, fix before Task 4.

---

## Task 4: Create `branding/` and migrate identity assets

**Files:**
- Create: `branding/logo/lockups/`, `branding/logo/exports/`, `branding/typography/epilogue/`, `branding/typography/jetbrains-mono/`, `branding/typography/candidates/`, `branding/color/`, `branding/photography/`, `branding/moodboard/`, `branding/templates/`
- Move: `font-test/` → `branding/typography/candidates/`, `about-refs/` → `branding/moodboard/about-refs/`, `stitch-snapshot.md` → `branding/moodboard/`
- Copy: `site/public/caio-ogata-profile.webp` → `branding/photography/`

- [ ] **Step 1: Create the branding folder tree**

Run:
```bash
mkdir -p branding/logo/lockups branding/logo/exports branding/typography/epilogue branding/typography/jetbrains-mono branding/typography/candidates branding/color branding/photography branding/moodboard branding/templates
```

- [ ] **Step 2: Move font candidates and moodboard references**

Run:
```bash
mv font-test/* branding/typography/candidates/ && rmdir font-test
mv about-refs branding/moodboard/about-refs
mv stitch-snapshot.md branding/moodboard/stitch-snapshot.md
```
Expected: no output. `font-test/`, `about-refs/`, and `stitch-snapshot.md` no longer exist at root.

- [ ] **Step 3: Copy the official headshot (site keeps its own copy)**

Run:
```bash
cp site/public/caio-ogata-profile.webp branding/photography/caio-ogata-profile.webp
```
Expected: file copied; `site/public/caio-ogata-profile.webp` still exists.

- [ ] **Step 4: Keep empty leaf folders in git**

Run:
```bash
touch branding/logo/lockups/.gitkeep branding/logo/exports/.gitkeep branding/typography/epilogue/.gitkeep branding/typography/jetbrains-mono/.gitkeep branding/color/.gitkeep branding/templates/.gitkeep
```
Expected: no output. (Per the build decision, the full tree is committed now even where empty.)

- [ ] **Step 5: Stage and commit**

Run:
```bash
git add -A branding/
git commit -m "chore(monorepo): add branding/ pillar and migrate identity assets"
```
Expected: commit succeeds. (`font-test/` and `about-refs/` were untracked, so their disappearance needs no staging — `git add -A branding/` captures the assets at their new home.)

---

## Task 5: Create `content/` and migrate the one existing article

**Files:**
- Create: `content/videos/`, `content/reels/`, `content/posts/`, `content/articles/`
- Move: `docs/extraction-webflow-design-composition.md` → `content/articles/2026-04-extraction-webflow-design-composition.md`

- [ ] **Step 1: Create the content folder tree**

Run:
```bash
mkdir -p content/videos content/reels content/posts content/articles
```

- [ ] **Step 2: Move the existing article with a date-prefixed slug**

Run:
```bash
mv docs/extraction-webflow-design-composition.md content/articles/2026-04-extraction-webflow-design-composition.md
```
Expected: no output.

- [ ] **Step 3: Keep empty format folders in git**

Run:
```bash
touch content/videos/.gitkeep content/reels/.gitkeep content/posts/.gitkeep
```
Expected: no output. (`content/articles/` already has a real file, so it needs no `.gitkeep`.)

- [ ] **Step 4: Stage and commit**

Run:
```bash
git add -A content/
git commit -m "chore(monorepo): add content/ pillar and migrate webflow article"
```
Expected: commit succeeds. (`docs/extraction-webflow-design-composition.md` was untracked, so only the new `content/` location needs staging.)

---

## Task 6: Create `career/` and migrate job-search artifacts

**Files:**
- Create: `career/cv/`, `career/covers/`, `career/tracker/`, `career/briefs/`, `career/outreach/`
- Move: `docs/cv/` → `career/cv/`, `docs/covers/` → `career/covers/`, `docs/caioogata-cv-02.26.pdf` → `career/cv/`, `docs/job-search-2026.csv` → `career/tracker/`, `docs/job-search-content-brief.md` → `career/briefs/`
- Remove: `docs/` (empty after this task)

- [ ] **Step 1: Create the career folder tree**

Run:
```bash
mkdir -p career/cv career/covers career/tracker career/briefs career/outreach
```

- [ ] **Step 2: Move CVs and cover letters**

Run:
```bash
mv docs/cv/* career/cv/ && rmdir docs/cv
mv docs/covers/* career/covers/ && rmdir docs/covers
mv docs/caioogata-cv-02.26.pdf career/cv/
```
Expected: no output.

- [ ] **Step 3: Move tracker and brief**

Run:
```bash
mv docs/job-search-2026.csv career/tracker/
mv docs/job-search-content-brief.md career/briefs/
```
Expected: no output.

- [ ] **Step 4: Remove the now-empty `docs/` folder**

Run:
```bash
rmdir docs && echo "docs/ removed"
```
Expected: `docs/ removed`. If `rmdir` fails, `docs/` still has files — run `ls -la docs/` and move the stragglers to their correct pillar before retrying.

- [ ] **Step 5: Keep the empty outreach folder in git**

Run:
```bash
touch career/outreach/.gitkeep
```

- [ ] **Step 6: Stage and commit**

Run:
```bash
git add -A career/ docs/job-search-2026.csv
git commit -m "chore(monorepo): add career/ pillar and migrate job-search artifacts"
```
Expected: commit succeeds. (`docs/job-search-2026.csv` is the only tracked file among the job-search artifacts — naming it stages its deletion from `docs/`. The rest were untracked; `git add -A career/` captures them at their new home.)

---

## Task 7: Create `strategy/` pillar

**Files:**
- Create: `strategy/` (only the orientation files added in Task 10 — no working docs yet)

- [ ] **Step 1: Create the strategy folder**

Run:
```bash
mkdir -p strategy
```

- [ ] **Step 2: Keep the folder in git until Task 10 adds its orientation files**

Run:
```bash
touch strategy/.gitkeep
```
Expected: no output. (`.gitkeep` is deleted in Task 10 once `CONTEXT.md`/`README.md` exist.)

- [ ] **Step 3: Stage and commit**

Run:
```bash
git add -A strategy/
git commit -m "chore(monorepo): add strategy/ pillar"
```
Expected: commit succeeds.

---

## Task 8: Create `.archive/`, freeze legacy cruft, and clean loose files

**Files:**
- Create: `.archive/next-builds/`, `.archive/screenshots/`, `.archive/crop-examples/`, `.archive/legacy-docs/`
- Move: `.next.bak.*` → `.archive/next-builds/`, all loose root `*.png`/`*.jpeg` → `.archive/screenshots/`, `crop-examples/` → `.archive/`, `PRD.md`/`RECRUITER-FAQ.md`/`TECHNICAL-SPEC.md`/`CONTENT.md` → `.archive/legacy-docs/`
- Delete: `index.tsx` (tracked dead stub), `nul` (0-byte Windows artifact), `.playwright-mcp/`
- Modify: `.gitignore`

- [ ] **Step 1: Create the archive folder tree**

Run:
```bash
mkdir -p .archive/next-builds .archive/screenshots .archive/crop-examples .archive/legacy-docs
```

- [ ] **Step 2: Freeze old build backups**

Run:
```bash
mv .next.bak.* .archive/next-builds/
```
Expected: no output.

- [ ] **Step 3: Freeze loose screenshots**

Run:
```bash
mv ./*.png ./*.jpeg ./*.jpg .archive/screenshots/ 2>/dev/null; echo "done"
```
Expected: `done`. All loose image files at the repo root move; `2>/dev/null` swallows the harmless "no match" if a glob is empty.

- [ ] **Step 4: Freeze crop examples and legacy V1 docs**

Run:
```bash
mv crop-examples/* .archive/crop-examples/ && rmdir crop-examples
mv PRD.md RECRUITER-FAQ.md TECHNICAL-SPEC.md CONTENT.md .archive/legacy-docs/
```
Expected: no output.

- [ ] **Step 5: Delete dead files**

Run:
```bash
git rm index.tsx
rm -f nul
rm -rf .playwright-mcp
```
Expected: `git rm` reports `rm 'index.tsx'`. (`index.tsx` is an 8-line "Portfolio v1" stub superseded by `site/src/`; `nul` is a 0-byte Windows redirect artifact; `.playwright-mcp/` is regenerable tool output.)

- [ ] **Step 6: Update `.gitignore`**

The existing `.gitignore` already covers root `node_modules`, `.next`, `.env*`, `nul`, and the AI tool dotfiles. It needs additions for the new `site/` location and Playwright scratch output. Append exactly this block to the END of `.gitignore`:

```gitignore

# Monorepo: site/ build artifacts (root patterns above no longer match the moved app)
/site/node_modules
/site/.next/
/site/out/

# Playwright MCP scratch output
.playwright-mcp/
```

Do not remove the existing lines — the stale root `/node_modules` and `/.next/` patterns are harmless.

- [ ] **Step 7: Stage and commit**

Run:
```bash
git add -A .archive/ .gitignore PRD.md CONTENT.md RECRUITER-FAQ.md TECHNICAL-SPEC.md
git commit -m "chore(monorepo): freeze legacy assets in .archive/ and clean loose files"
```
Expected: commit succeeds. (`index.tsx` was already staged for deletion by `git rm` in Step 5. `PRD.md`/`CONTENT.md`/`RECRUITER-FAQ.md`/`TECHNICAL-SPEC.md` are tracked — naming them stages their deletion from root, paired with their new `.archive/legacy-docs/` location. The `.next.bak.*`, loose images, and `crop-examples/` were untracked, so `git add -A .archive/` captures them with no source-side staging needed. `.playwright-mcp/` and `nul` were never tracked — nothing to stage.)

- [ ] **Step 8: Confirm the repo root is clean**

Run:
```bash
ls -1 | grep -v -E '^(site|branding|content|career|strategy)$'
```
Expected: shows only non-pillar entries — there should be NO loose `.png`, `.docx`, `.md` (except none), `.next.bak.*`, `crop-examples`, `font-test`, `about-refs`, `docs`, or `index.tsx`. Hidden files (`.archive`, `.git`, `.gitignore`, AI tool dotfiles) are expected.

---

## Task 9: Create root orientation files

**Files:**
- Create: `CLAUDE.md`, `README.md`

- [ ] **Step 1: Create the root `CLAUDE.md` routing map**

Create `CLAUDE.md` with exactly this content:

```markdown
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
```

- [ ] **Step 2: Create the root `README.md`**

Create `README.md` with exactly this content:

```markdown
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
```

- [ ] **Step 3: Verify `CLAUDE.md` length**

Run:
```bash
wc -l CLAUDE.md
```
Expected: under 50 lines.

- [ ] **Step 4: Stage and commit**

Run:
```bash
git add CLAUDE.md README.md
git commit -m "chore(monorepo): add root routing map and README"
```
Expected: commit succeeds.

---

## Task 10: Create per-pillar orientation files

**Files:**
- Create: `branding/README.md`, `branding/CONTEXT.md`, `branding/BRAND.md`, `content/README.md`, `content/CONTEXT.md`, `career/README.md`, `career/CONTEXT.md`, `strategy/README.md`, `strategy/CONTEXT.md`, `.archive/README.md`
- Delete: `strategy/.gitkeep`

- [ ] **Step 1: Create `branding/README.md`**

Create `branding/README.md` with exactly this content:

```markdown
# branding/

Caio Ogata's visual identity system — the source of truth for the brand's look.

## What lives here
Logo files, typography, color tokens, official photography, moodboards, reusable templates, and the written brand guidelines (`BRAND.md`).

## What does NOT live here
Published content (that's `content/`). Site code (that's `site/`). The site consumes *copies* of these assets — this folder is the canonical source.

See [`CONTEXT.md`](CONTEXT.md) for working conventions.
```

- [ ] **Step 2: Create `branding/CONTEXT.md`**

Create `branding/CONTEXT.md` with exactly this content:

```markdown
---
pillar: branding
purpose: Visual identity system — logo, type, color, photography, guidelines
updated: 2026-05-21
---

# Branding — working context

## The work
Maintain and evolve the Caio Ogata visual identity. This pillar holds the *system* (reusable identity assets), never published output.

## Structure
- `logo/` — monogram, wordmark, lockups, PNG exports
- `typography/` — production fonts (`epilogue/`, `jetbrains-mono/`) and `candidates/` under evaluation
- `color/` — palette source and token exports (mirror `site/src/tokens/primitives.css`)
- `photography/` — official headshot and variants
- `moodboard/` — reference captures and inspiration
- `templates/` — reusable IG post / YT thumbnail / deck templates
- `BRAND.md` — voice, tone, do/don't

## What good looks like
Every brand asset has one canonical home here. When the site needs an asset, it gets a copy — the original stays in `branding/`.

## What to avoid
- Don't store published pieces here — those belong in `content/`.
- Don't diverge `color/` from the site tokens; they must stay in sync.
- Don't introduce a brand asset without also noting its usage rule in `BRAND.md`.
```

- [ ] **Step 3: Create `branding/BRAND.md`**

Create `branding/BRAND.md` with exactly this content:

```markdown
# Brand Guidelines — Caio Ogata

> Working document. Fill each section as the brand is defined.

## Voice
_How the brand sounds in writing. To be defined._

## Tone
_How voice shifts by context (site vs. reel vs. cover letter). To be defined._

## Do
- _e.g. lead with craft, show the work._

## Don't
- _e.g. no marketing hyperbole, no buzzwords._

## Examples
_Links to pieces that exemplify the brand once they exist._
```

- [ ] **Step 4: Create `content/README.md`**

Create `content/README.md` with exactly this content:

```markdown
# content/

Editorial production for the personal brand — everything made to be published.

## What lives here
Scripts, copy, raw assets, thumbnails, and per-piece metadata for videos, reels, posts, and articles.

## What does NOT live here
Reusable brand assets (that's `branding/`). Planning and calendars (that's `strategy/`).

## Structure
- `videos/` — YouTube long-form
- `reels/` — IG / TikTok shorts
- `posts/` — IG carousels, threads, single posts
- `articles/` — long-form written pieces

See [`CONTEXT.md`](CONTEXT.md) for the naming convention and per-piece workflow.
```

- [ ] **Step 5: Create `content/CONTEXT.md`**

Create `content/CONTEXT.md` with exactly this content:

```markdown
---
pillar: content
purpose: Editorial production — videos, reels, posts, articles
updated: 2026-05-21
---

# Content — working context

## The work
Produce content for publication. Each piece is a self-contained folder; articles may be a single file.

## Naming
Date-prefixed slug: `YYYY-MM-{kebab-topic}`. The date prefix keeps `ls` chronological. If two pieces collide in a month, differentiate the slug (e.g. `-part-2`).

## Per-piece structure
- `videos/{slug}/` — `script.md`, `shotlist.md`, `assets/`, `thumbnails/`, `publish.md`
- `reels/{slug}/` — `script.md`, `assets/`, `publish.md`
- `posts/{slug}/` — `copy.md`, `carousel-frames/`, `publish.md`
- `articles/{slug}.md` — single file; promote to a folder only if it gains assets

## `publish.md` template
Every piece carries a `publish.md`:

    status: draft | scheduled | published
    url:
    published_at:
    hook:
    caption:
    tags:
    metrics: (filled post-launch)

## What to avoid
- Don't create a format folder's piece without a `publish.md`.
- Don't store reusable identity assets here — link to `branding/` instead.
```

- [ ] **Step 6: Create `career/README.md`**

Create `career/README.md` with exactly this content:

```markdown
# career/

Job search artifacts — 2026 and ongoing.

## What lives here
CVs, cover letters, the application tracker, search briefs, and outreach templates.

## What does NOT live here
Portfolio case studies (those are `content/` or the site). Brand assets (`branding/`).

## Structure
- `cv/` — base CV and per-company variants
- `covers/` — cover letters, one per company
- `tracker/` — application tracking spreadsheet
- `briefs/` — search strategy, target companies, positioning
- `outreach/` — message and follow-up templates

See [`CONTEXT.md`](CONTEXT.md) for conventions.
```

- [ ] **Step 7: Create `career/CONTEXT.md`**

Create `career/CONTEXT.md` with exactly this content:

```markdown
---
pillar: career
purpose: Job search — CVs, cover letters, tracker, outreach
updated: 2026-05-21
---

# Career — working context

## The work
Run the job search: tailor CVs and cover letters per company, track applications, maintain outreach.

## Conventions
- CV variants: `cv-{company}.{md,docx,html}`; the untargeted base is `cv-base.*`.
- Cover letters: `cover-{company}.{md,docx}`, one per company.
- The tracker (`tracker/job-search-2026.csv`) is the single source of application status.

## Context to honor
- Brazil PJ roles usually sit below the salary target — flag salary risk on domestic PJ listings.
- Relocation to USA/EU is on the table for a strong opportunity; large-cap visa sponsors are first-class targets.

## What to avoid
- Don't let CV variants drift from `cv-base.*` on shared facts (dates, titles) — fix the base, then re-derive.
- Don't track application status anywhere but the tracker.
```

- [ ] **Step 8: Create `strategy/README.md`**

Create `strategy/README.md` with exactly this content:

```markdown
# strategy/

Cross-pillar planning — the brand's direction, not any single pillar's output.

## What lives here
Documents that span more than one pillar: brand voice that governs both site and content, a content calendar, quarterly roadmaps.

## What does NOT live here
Anything that belongs to one pillar. Site planning → `site/`. Content scripts → `content/`. Search briefs → `career/`. If a doc has one obvious pillar, it goes there, not here.

See [`CONTEXT.md`](CONTEXT.md) for the test of what belongs here.
```

- [ ] **Step 9: Create `strategy/CONTEXT.md`**

Create `strategy/CONTEXT.md` with exactly this content:

```markdown
---
pillar: strategy
purpose: Cross-pillar planning and brand roadmap
updated: 2026-05-21
---

# Strategy — working context

## The work
Hold planning that genuinely spans pillars. This folder starts empty of working docs on purpose.

## The test
Before adding a doc here, ask: "Does this govern two or more pillars?" If it has one obvious home pillar, it goes there. Only truly cross-cutting docs (brand voice, content calendar, quarterly roadmap) belong here.

## What to avoid
- Don't use this as a catch-all inbox. A doc with one clear pillar is misfiled here.
- Don't create speculative roadmap files — add one when there is real planning to record.
```

- [ ] **Step 10: Create `.archive/README.md`**

Create `.archive/README.md` with exactly this content:

```markdown
# .archive/

Frozen legacy assets. **Nothing here is referenced by any build.**

## Contents
- `next-builds/` — old `.next.bak.*` build backups
- `screenshots/` — loose PNG/JPEG screenshots from the old repo root
- `crop-examples/` — one-off image crops
- `legacy-docs/` — V1 docs superseded by `site/docs/v2/` (PRD, RECRUITER-FAQ, TECHNICAL-SPEC, CONTENT)

## Lifecycle
This is a transitional safety net. Safe to delete entirely once the restructure has settled — review around 2026-11.
```

- [ ] **Step 11: Remove the strategy placeholder**

Run:
```bash
rm strategy/.gitkeep
```
Expected: no output. `strategy/` now holds `README.md` + `CONTEXT.md`, so the `.gitkeep` is no longer needed.

- [ ] **Step 12: Stage and commit**

Run:
```bash
git add -A branding/ content/ career/ strategy/ .archive/
git commit -m "chore(monorepo): add per-pillar README and CONTEXT orientation files"
```
Expected: commit succeeds.

---

## Task 11: Final validation

**Files:** none — verification only.

- [ ] **Step 1: Confirm the repo root structure**

Run:
```bash
ls -1 && echo "--- hidden ---" && ls -1d .archive .gitignore
```
Expected: visible entries are the five pillars `branding`, `career`, `content`, `site`, `strategy`, plus `README.md`, `CLAUDE.md`, and `skills-lock.json` (intentionally left at root). `.archive` and `.gitignore` exist. No loose `.png`, `docs/`, `font-test`, `about-refs`, `crop-examples`, `index.tsx`, `nul`, `vercel.json`, or `.npmrc` remain at root.

- [ ] **Step 2: Confirm every pillar has both orientation files**

Run:
```bash
for p in branding content career strategy; do for f in README.md CONTEXT.md; do test -f "$p/$f" && echo "OK $p/$f" || echo "MISSING $p/$f"; done; done
```
Expected: eight `OK` lines, zero `MISSING`.

- [ ] **Step 3: Confirm the site still builds**

Run:
```bash
cd site && pnpm build 2>&1 | tail -20
```
Expected: build completes successfully.

- [ ] **Step 4: Confirm LLM routes and homepage**

Run:
```bash
cd site && (pnpm dev &) && sleep 8 && for r in / /llms.txt /llms-full.txt; do echo -n "$r "; curl -s -o /dev/null -w "%{http_code}\n" "http://localhost:3000$r"; done && pkill -f "next dev"
```
Expected: each route returns `200`.

- [ ] **Step 5: Confirm GSD planning survived the move**

Run:
```bash
test -f site/.planning/STATE.md && test -d site/.planning/phases && echo "GSD planning intact at site/.planning/"
```
Expected: `GSD planning intact at site/.planning/`. (Run `/gsd:health` from `site/` separately to confirm command wiring.)

- [ ] **Step 6: Confirm no site file references a path outside `site/`**

Run:
```bash
cd site && grep -rEn "\.\./\.\./(docs|about-refs|crop-examples|font-test)" src/ 2>/dev/null && echo "FOUND BAD REFS — investigate" || echo "no external path references"
```
Expected: `no external path references`.

- [ ] **Step 7: Final commit (if any verification produced changes)**

Run:
```bash
git status --short
```
Expected: clean working tree. If anything is uncommitted, review and commit with `git commit -m "chore(monorepo): finalize restructure"`.

---

## Post-execution (manual — not automated by this plan)

These require human action and are intentionally outside the plan:

1. **Vercel** — set the project's **Root Directory** to `site` before the next deploy, or the build will fail. Do this in the Vercel dashboard before merging.
2. **PR** — open a PR from `chore/monorepo-restructure`; squash-merge to land the restructure as one commit in `v2`'s history.
3. **`/gsd:health`** — run from inside `site/` to confirm GSD command wiring after the `.planning/` move.
4. **Follow-up (separate task):** split the 24KB `site/CLAUDE.md` into a routing file + `CONTEXT.md` files — it currently violates the Cliefnotes "routing file" rule. Tracked in the spec's follow-ups.

---

## Spec coverage check

- Top-level 5 pillars + `.archive/` → Tasks 4–8.
- `site/` move incl. `.planning/`, `docs/`, config → Task 2; verified Task 3.
- Orientation-file model (root `CLAUDE.md` routing table, per-pillar `CONTEXT.md` + `README.md`) → Tasks 9–10.
- Migration table rows → Tasks 2, 4, 5, 6, 8 (every row mapped).
- `index.tsx` / `nul` decisive disposition (delete) → Task 8 Step 5.
- `.gitignore` update → Task 8 Step 6.
- Validation checklist from spec → Tasks 3 and 11.
- `site/CLAUDE.md` split deferred → Post-execution item 4.
- Vercel Root Directory risk → Post-execution item 1.
```
