# Content rewrite — from the brand base to the site

Plan for landing the approved personal-brand copy on `caioogata.com`.

**Source of truth:** [`branding/voice/who-is-caio.md`](../../../branding/voice/who-is-caio.md)
— bio approved by Caio on 2026-09-10 — and
[`branding/voice/voice-and-tone.md`](../../../branding/voice/voice-and-tone.md) for register
and the banned-word list. Where this file and those disagree, those win.

**Status:** nothing has landed. The base document says so itself, and it is still true. The
home hero and footer were rebuilt to the new positioning in September 2026; every other
surface still carries the recruiter-facing text written for V1.

Copy marked **APPROVED** is final and lifts verbatim from the base document. Copy marked
**PROPOSED** is written here against the canonical facts and the voice guide, and needs
Caio's call before it ships.

---

## 0. What is leaking right now

Three of these are live, machine-readable, and say the opposite of the approved positioning.
They are first because they cost nothing to fix and because they are the surfaces Caio does
not see while browsing his own site.

### 0.1 The birth date is published

`who-is-caio.md` is unambiguous: *"Born 1984 — internal only, never publish age or birth
year."* It is published in three places:

| File | What it does |
|---|---|
| `src/app/layout.tsx:81` | `birthDate: '1984-06'` in the Person JSON-LD — read by Google |
| `src/lib/markdown-generator.ts` | `born June 1984` in 4 places, plus a live age computed from `new Date(1984, 5, 23)` |
| `src/content/en.json` · `pt-br.json` | `quickFacts.Born` — **dormant**, no component renders it |

Only the first two are actually served. The `quickFacts` block is dead weight in the content
file and should go with the rest of the unrendered blocks (§4).

### 0.2 The AI answer contradicts the site

`markdown-generator.ts` produces `/llms.txt`, `/llms-full.txt` and `/llms-pt.txt` — the exact
files the footer's five assistant tiles point at. It opens:

> Caio Ogata (born June 1984, Porto Alegre, Brazil) **is actively seeking design leadership
> roles** (Head of Design, VP, Director), senior IC positions, partner/co-founder
> opportunities, or consulting engagements. Available remote, hybrid, or open to relocation.

And titles the document **"Caio Ogata — Design Director"**.

So a visitor who clicks "Ask AI about Caio" — the feature built into the hero and the footer —
gets told he is job-hunting, under a title the brand replaced, with his birth year attached.
This is the single highest-impact fix on the list.

### 0.3 The metadata still sells a Design Director

| Where | Current |
|---|---|
| `layout.tsx` `title` | `Caio Ogata - Design Director \| Systems, DevEx & Engineering` |
| `layout.tsx` `description` | `Design Director specializing in design systems, DevEx, and product engineering…` |
| `layout.tsx` `keywords` | `Design Director`, `DevEx`, `Design Engineering`, … |
| `layout.tsx` JSON-LD | `jobTitle: 'Design Director'` |
| `about/page.tsx` | `Design engineering leader bridging brand strategy…` |
| `projects/page.tsx` | `Selected design engineering work across design systems…` |
| `experience/page.tsx` | `15+ years of design engineering practice across 6 companies…` |
| `philosophy/page.tsx` | already fine — it is about falling and iterating |

Four of the five descriptions lead with vocabulary the voice guide bans on this domain:
`design systems`, `developer experience`, `design engineering`.

---

## 1. The offer: freelance, not a job hunt

**Decided by Caio, 2026-09-12.** The site sells creative work directly. The base document
already ends the history with *"Now he works for himself."*

Three blocks still read as a candidacy and have to change or go:

- **`lookingFor`** — *"exploring opportunities in design leadership… Open to CLT, PJ…
  Startup, big tech, or agency… decision-making positions at large companies."* Unrendered
  today. Delete rather than rewrite: a freelance site does not carry a wish list of
  employment types.
- **`contact.description`** — *"I'm currently exploring opportunities in design leadership…
  Open to remote, hybrid, or relocation for the right role."* Rendered by `ContactOverlay`,
  which is currently unmounted. Rewrite for a client enquiry.
- **`contact.form.subjectOptions.job`** — a "Job Opportunity" option in the contact form.
  Drop it; keep `freelance`, `feedback`, `other`.

The hero's `<> Available October 2026` reads correctly under this decision — it is a
calendar, not a notice period. Nothing to change there.

---

## 2. Field-by-field map

### 2.1 `hero` — APPROVED

| Key | Current | New |
|---|---|---|
| `tagline` | `Design Director · Design Systems & Developer Experience · Design Engineering` | `Creative Designer who learned to build.` |
| `tagline2` | `Bridging brand strategy, product craft, and technical implementation.` | `Twenty years in advertising, fifteen in interfaces, and a self-taught path into code.` |
| `summary` | 68 words, first person, opens on *"the intersection of design systems…"* | The **Short bio**, 44 words, third person |
| `location` | `Based in Porto Alegre, Brazil \| Open to remote, hybrid & relocation opportunities` | `Porto Alegre, Brazil` — the availability line belongs to the header, not here |

The base document names this replacement explicitly: the old tagline is *"three disciplines
separated by dots. A filing label, not a sentence."*

`IntroSection.tsx` currently hardcodes the headline and the bio rather than reading `hero`.
Landing this copy means pointing the component back at the content file, or the two will
drift again.

### 2.2 `about.bio` — APPROVED

Replace the whole field with the **Full bio, 262 words**, verbatim.

What changes structurally: the current bio opens on *"design systems, developer experience,
and product engineering"* and reaches the advertising background in paragraph three, as
context. The approved bio inverts that — identity and working method first, then where the
craft comes from, then the record, and a closing paragraph that says what the reader gets.
First person becomes third.

One correctness gain, not just a tone gain. The current text reads:

> End-to-end ownership, from design system to shipped production code: 6,000+ commits, 34+
> contributors.

`who-is-caio.md` settles this: *"Console Kit — built under Caio's leadership, by the product
design team he assembled. Not his personal code. He **led** it, the team **built** it."* The
current sentence claims authorship the facts do not support. The approved bio drops the
Console Kit entirely and the base document calls it *proof, never authorship*.

### 2.3 `about.headline` — PROPOSED

Current: `Bridging brand strategy, product craft and technical workflow` — three banned terms
in eight words.

There is no approved headline for `/about`. Two options, both derived from approved material:

- Reuse the line: `Creative Designer who learned to build.` — consistent, but repeats the
  home verbatim one click later.
- Take the closing idea of the approved bio: `Most people do one part of this. Caio does the
  span.`

### 2.4 `about.expertise` — PROPOSED

The list is the first thing a reader hits after the bio, and every item is written for a
design audience. Current, in order:

1. Design Systems Architecture & Implementation
2. Developer Experience (DevEx) & Design Engineering
3. End-to-end Product Ownership (concept → production)
4. Brand Strategy & Creative Direction
5. Design Team Leadership & Organizational Design
6. Cross-functional Collaboration
7. UI/UX Design & Interaction Design

Items 1 and 2 are the two most-banned phrases on the list, and they open it. Proposed
replacement, reordered so creative direction leads and the code is the last claim, not the
first:

1. Creative direction
2. Brand and visual identity
3. Interface and interaction design
4. Motion, built in the browser
5. Front-end that ships
6. Design systems and component libraries
7. Building and leading design teams

### 2.5 `experience.hero` — PROPOSED, and the numbers are wrong

**Headline.** Current: *"Design Engineering as a practice: where brand rigor, product
thinking, and shipped code occupy the same role."* Three banned terms, and it is the sentence
furthest from the new positioning anywhere on the site.

**Stats.** All three cards are factually wrong against the canonical table:

| Card | Says | Canon | Note |
|---|---|---|---|
| years | `15+` | 20+ total, 15 in UI | Undersells, and contradicts the home's "twenty years" |
| companies | `6` | 9 distinct, 12 roles | The rendered list shows 12 rows |
| executive roles | `2` | 3 directorships at Azion, plus partner at Huia | |

Beyond being wrong, the cards count **employers** — a recruiter's unit. Proposed, counting
work instead, all three from "numbers that are safe to use" in the base:

| Value | Label |
|---|---|
| `20+` | years |
| `40+` | projects led |
| `0→14` | design org built |

### 2.6 `projects` — PROPOSED, composition before copy

Five published projects: four are Azion, one is Huia. A Creative Designer whose published
work is 80% one B2B infrastructure client reads as a platform specialist — the portfolio
argues against the headline.

The material to fix it already exists and is approved: *"He led creative direction on 40+
digital projects for Petrobras, O Boticário, Tramontina, Sicredi, Aché, and international
work through Mondelez brands — Lacta, Bis, Toblerone, Oreo. The work ran on WebGL, facial
recognition and experimental techniques, years before they were common."*

That is currently compressed into one entry, `huia`, ranked last by year (2013). Options:

- Split `huia` into two or three real cases — the WebGL work, the facial-recognition work,
  the O Boticário campaign run — so the creative half of the record has the same weight as
  the Azion half.
- Or keep one Huia entry and reorder the list so it does not open with four consecutive
  Azion projects.

Every `description`, `challenge` and `impact` field also needs a voice pass: `headless
architecture`, `design tokens`, `end-to-end`, `token-based foundations` all fail the guide.

**Housekeeping:** two disabled entries have slugs that do not match their titles —
`brand-oboticario` is titled *"Azion CLI (coming soon)"* and `product-petrobras` is titled
*"Labs (coming soon)"*. Leftovers. Either restore the O Boticário and Petrobras cases under
their real slugs — which §2.6 argues for anyway — or delete both.

### 2.7 `philosophy` — no copy change, a placement decision

The judo and skateboarding material is the strongest human asset the brand owns. The base
document deliberately keeps it out of the bio — *"it reads as philosophy, and the bio has to
sell"* — and says it *"belongs somewhere on the site."*

It already has a page. That page has no entry in the header menu, which carries four labels:
`intro`, `about`, `experience`, `contact`. `/philosophy` and `/projects` are both
unreachable from the nav. Decision needed, not copy.

### 2.8 `clients` — PROPOSED

Sixteen brands, including Petrobras, O Boticário, Itaú, Lacta, Fila and Novartis. Rendered as
a logo wall on `/about` with a one-line caption. For a creative positioning this is the
densest proof on the site and it says nothing about what was done.

Proposal: each logo carries the work, not just the mark. The base document already supplies
the pairing for the Huia-era clients.

---

## 3. Code that carries copy

These are not content-file edits and need their own pass.

| File | What it holds |
|---|---|
| `src/lib/markdown-generator.ts` (690 lines) | The entire `/llms*.txt` corpus. Birth date, "actively seeking", "Design Director" title, project blurbs in banned vocabulary. Biggest single body of off-brand text on the site. |
| `src/app/layout.tsx` | Metadata, keywords, OpenGraph, Person JSON-LD |
| `src/app/*/page.tsx` | Four per-page descriptions |
| `src/components/sections/v2/IntroSection.tsx` | Headline and bio hardcoded, not read from `en.json` |
| `src/content/pt-br.json` | The PT translation, which lags the EN file |

---

## 4. Dead content

Unrendered by any component. Carried in `en.json` and `pt-br.json`, and in the `/llms*.txt`
corpus, where the assistants still read them:

`quickFacts` · `lifestyle` · `workingStyle` · `lookingFor` · `collaborationContext`

`quickFacts` is the one that matters — it holds the birth date, MBTI and DISC results. The
rest is V1 recruiter material. Decide per block: delete, or keep out of the site but inside
`career/`, where the credential register is the right one.

---

## 5. Open decisions

Things this plan cannot settle on its own.

1. **Proof that he codes.** Raised in the base document and unresolved: the positioning says
   he writes code, and the flagship artefact is team-built. The base suggests this site is
   the honest candidate — *"a client can look at the thing while reading about it."* Where
   does that land on the page?
2. **`/about` headline** — §2.3, two options.
3. **Portfolio composition** — §2.6, split Huia or reorder.
4. **`/philosophy` and `/projects` in the menu** — §2.7.
5. **What happens to the dead blocks** — §4.
6. **PT translation** — the base is written English-first and says the PT version is a
   translation. Nobody has written it.

---

## 6. Order of work

1. **§0** — birth date out of the JSON-LD and the generator; `/llms*.txt` rewritten off the
   approved bio; metadata and the four page descriptions. Live, machine-read, and currently
   wrong.
2. **§2.1 + §2.2** — hero and bio. Approved copy, lifts verbatim.
3. **§1** — the three candidacy blocks.
4. **§2.5** — the experience numbers. Wrong facts, cheap fix.
5. **§2.3, §2.4** — the proposed copy, once approved.
6. **§2.6** — portfolio composition. The largest job, and it needs new case material.
7. **§2.8, §2.7** — clients and philosophy placement.
8. **`pt-br.json`** — last, once EN is settled.
