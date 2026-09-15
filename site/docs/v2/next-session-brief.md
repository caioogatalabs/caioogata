# Brief — machine-facing text and the Portuguese site

Handoff for a fresh session. Written 2026-09-15 from an audit of the live site.

Everything here was measured, not assumed. Where a number appears, it came from
`curl`-ing the running dev server or from reading the file.

---

## Where things stand

The UI copy rewrite is **done and approved by Caio**. `en.json` carries the new
positioning on the home, /about, /experience, the five projects, /philosophy and contact.

Nothing machine-facing was touched. That left the site in a worse state than being
uniformly out of date: **the `/llms*.txt` corpus now contradicts itself**, because
`markdown-generator.ts` imports `en.json` for some fields and hardcodes prose for others.

## The canonical sources, in order of authority

| File | Holds |
|---|---|
| `branding/voice/who-is-caio.md` | Canonical facts, employment table, safe numbers. **Its bio is now older than the site** — see item 5. |
| `branding/voice/voice-and-tone.md` | Register, 25-word sentence limit, banned-word list |
| `site/docs/v2/content-ui-copy.md` | The approved UI copy, string by string |
| `site/docs/v2/content-rewrite-plan.md` | The field-by-field map and the original audit |

Decisions already made, do not reopen: **third person**, **freelance rather than a job
hunt** (Caio, 2026-09-12), **the UI copy is approved** (Caio, 2026-09-15).

---

## 1. `src/lib/markdown-generator.ts` — 690 lines

The most damage for the least work. It builds `/llms.txt`, `/llms-full.txt`,
`/llms-pt.txt` and the 14 per-project routes under `/llms/projects/`. These are exactly
what the footer's five assistant tiles point at.

Measured on the live server:

| | `/llms-full.txt` | `/llms.txt` | `/llms-pt.txt` |
|---|---|---|---|
| size | 40 KB | 3.6 KB | 41 KB |
| "Creative Designer who learned to build" | 2 | 0 | 0 |
| "Cinema and photography came first" | 1 | 0 | 0 |
| **"Design Director"** | **12** | 3 | 11 |
| "design systems" | 9 | 2 | 11 |
| "developer experience" | 7 | 0 | 13 |
| "actively seeking" | 1 | 1 | 0 |
| "born June 1984" | 1 | 1 | 0 |
| "15+ years" | 1 | 1 | 0 |

So one document tells an assistant that Caio is a freelance Creative Designer *and* a
Design Director hunting for a job, with his birth year attached.

To do:

- **Remove the birth date entirely.** `who-is-caio.md` says *"internal only, never publish
  age or birth year."* It appears as `born June 1984` in four places plus a live age
  computed from `new Date(1984, 5, 23)` at the top of the file.
- **Drop the candidacy paragraph.** *"is actively seeking design leadership roles (Head of
  Design, VP, Director), senior IC positions… Available remote, hybrid, or open to
  relocation."* The offer is freelance now.
- **Retitle.** The document is headed `# Caio Ogata — Design Director`.
- **Read from `en.json` wherever prose is hardcoded.** It already imports the content file
  and references it 34 times; the hybrid state exists because the rest is inline.
- `src/lib/case-study-generator.ts` has the same problem on a smaller scale — 9 hits.

## 2. Metadata and structured data

Five files, small edits, and it is what Google, LinkedIn and link previews read.

| File | What is wrong |
|---|---|
| `src/app/layout.tsx` | `title`, `description`, `keywords`, OpenGraph, Twitter, and the `Person` JSON-LD carrying `jobTitle: 'Design Director'` and `birthDate: '1984-06'` |
| `src/app/page.tsx` | home `structuredData`, `jobTitle: 'Design Director'` |
| `src/app/about/page.tsx` | "Design engineering leader bridging brand strategy…" |
| `src/app/experience/page.tsx` | "15+ years of design engineering practice across 6 companies, 2 executive roles" — the three numbers the page itself no longer shows |
| `src/app/projects/page.tsx` | "Selected design engineering work across design systems…" |

`src/app/philosophy/page.tsx` is already fine.

## 3. Portuguese — translation and a switcher

Two jobs that have to be done together.

**The content file is entirely behind.** `pt-br.json` still reads `Diretor de Design ·
Design Systems & Developer Experience · Design Engineering`, a four-paragraph bio against
the English seven, and the three wrong stat values (`15+ anos`, `6 empresas`, `2 cargos
executivos`).

**The structures have also diverged.** 172 keys in `en.json`, 161 in `pt-br.json`. Eleven
keys exist only in English, including `projects.items[].sections[]`, `projects.items[].year`
and the whole `collaborationContext` block. One key exists only in Portuguese:
`contact.form.subjectOptions.job`, which was deliberately removed from English when the
offer became freelance. Reconcile the shape, do not only translate the strings.

**Nothing on the site can reach it.** `LanguageProvider` exists and imports both files, but
**no component consumes it** — every component imports `en.json` directly. So the Portuguese
content is invisible on the site today while being fully live at `/llms-pt.txt`, which is
the file a Brazilian client's assistant would read.

Building the switcher therefore means wiring the provider through the components as well as
adding the control.

**Open decision for Caio: where the control goes.** The header is six slots on the 12-column
grid (3 / 1 / 2 / 2 / 1 / 3) and every one is occupied — welcome, version, location, menu,
`Worldwide / Freelancer`, availability. There is no free slot, so something moves, shares a
slot, or the control lands somewhere else entirely.

**A translation note, not a mechanical one.** The approved English romanticises through
specificity, and the base document says the Portuguese is *"a translation, not a separate
text."* Sentences like *"Advertising was where the looking became work"* will not survive a
literal pass.

## 4. Leftovers in `en.json`

Fifteen minutes. Only the second is a real miss.

| Where | What |
|---|---|
| `experience.jobs[2].achievements[0]` | "…UX Research, and Design Systems" — the rewrite covered `description` but not `achievements` |
| `education.additional[1].note` | The Memorisely course description. It is a course name; decide whether it counts |
| `projects.items[3].technologies` | The Brand System's technical list |
| `experience.jobs[0].title`, `projects.items[1].role` | "Developer Experience Director" — a job title, leave it |
| `experience.hero.stats` | Still present, no longer rendered. The `/llms*.txt` corpus reads it, so fix the values or drop both together |

## 5. `who-is-caio.md` is behind the site

It holds the bio approved on 2026-09-10; the site holds the rewrite Caio directed on
2026-09-14, which supersedes it. The base is the stated source of truth, so leaving it
stale is the exact drift this work set out to end. Fold the current `about.bio` back in,
and note the date and the direction that produced it.

While there: its own "still to propagate" note is stale in one line — the Huia coordinator
dates in `en.json` were fixed in commit `0e1450e`.

---

## Explicitly out of scope

**`career/`.** Twenty files say "Design Director" and that is correct — the voice guide
puts credential vocabulary there, and a CV is written for a recruiter. Caio confirmed on
2026-09-15 that it stays.

Verified: **nothing under `site/` reads anything from `career/`**, so it cannot leak into
the site. If that ever changes, it becomes a defect.

`branding/templates/commercial/institutional.json` is COLab — a different brand, in
Portuguese, first person plural. Not this pillar.

Two factual drifts in `career/` were found and are worth fixing whenever those files are
next touched, though they do not affect the site. Against the canonical table (2013–2015
coordinator, 2015–2021 partner): `cv-base.md` shows only 2015–2021, dropping two years;
`linkedin-apply/profile.py` shows 2013–2021 as a single role.

---

## Working notes

- **Other sessions edit this repo at the same time.** Check `git status` before staging and
  commit only your own files. Recent commits from another session swept up uncommitted work
  from this one.
- **Do not run `npm run build` while the dev server is up.** They share `.next` and the dev
  server starts returning 500. Stop dev, build, restart dev.
- **Lenis owns scrolling.** `window.scrollTo` does nothing from the console; use real wheel
  input when testing scroll behaviour.
- **The `wip:` prefixes can now be settled.** They were used because asking for a commit is
  not approval. Caio approved the UI copy on 2026-09-15, so the content commits can be
  rewritten in a rebase.

## Still open, carried forward

- **Photography direction — Advanced**, in the about skills. Every other entry traces to a
  job, project, course or tool. This one traces to `quickFacts`, where photography is a
  hobby. Asserted, not sourced.
- **Two email addresses.** `contact.email` is `caioogata.labs@gmail.com`; the footer renders
  `contato@caioogata.com`, from the Figma.
- **`/experience` pacing.** Rows open on scroll, but measured at 1046px of viewport the
  whole list is 892px, leaving 74px of scroll per row. Without pinning the list,
  scroll-per-row equals row height, and the row is 65px.
- **`/projects` and `/philosophy` have no entry in the header menu.**
- **Portfolio composition.** Four of the five published projects are Azion.
