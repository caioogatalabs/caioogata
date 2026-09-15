# UI copy — every string a reader sees

The written text for `caioogata.com`. This is copy, not a description of copy: what is here
is meant to be read, approved, and then moved into `src/content/en.json` as-is.

Companion to [`content-rewrite-plan.md`](content-rewrite-plan.md), which maps *where* each
string lives and in what order to land it. Machine-facing text — `/llms*.txt`, metadata,
JSON-LD — is a separate document and comes after this one.

**Derived from** [`branding/voice/who-is-caio.md`](../../../branding/voice/who-is-caio.md)
(canonical facts, approved bio) and
[`branding/voice/voice-and-tone.md`](../../../branding/voice/voice-and-tone.md) (register,
sentence length, banned words).

| Mark | Meaning |
|---|---|
| **APPROVED** | Lifts verbatim from the base document. Caio approved it on 2026-09-10. |
| **PROPOSED** | Written here. Needs Caio's call before it ships. |

**The rules this copy is written against.** Third person. The reader is a possible client,
often not a designer and often not technical. Sentences under 25 words. Active voice. No
`design systems`, `developer experience`, `design engineering`, `end-to-end ownership`, `at
the intersection of`, `innovative`, `seamless`, `robust`. Concrete beats vague, every time.

Proper nouns are exempt: *Azion Design System* is the name of a thing, not a description.

---

## 1. Home

### Headline — APPROVED

> Creative Designer
> who learned to build.

### Short bio — APPROVED

Rendered in the hero, right column.

> Caio Ogata is a Creative Designer who learned to build. Twenty years in advertising,
> fifteen in interfaces, and a self-taught path into code. Based in Porto Alegre, he works
> across brand, interface and the code underneath — and takes it from idea to production.

### Header and footer chrome — no change

`Welcome to caioogata portfolio` · `Porto Alegre, Brazil` · `Worldwide / Freelancer` ·
`<> Available October 2026` · `Ask AI about Caio` · `scroll down` · `scroll up` ·
`© 2026 All Rights Reserved`

Already plain, already on-brand. The availability line reads as a calendar under the
freelance decision, which is what it should be.

---

## 2. About

### Headline — PROPOSED

Current: *Bridging brand strategy, product craft and technical workflow* — three banned
terms in eight words.

**Recommended.** The closing idea of the approved bio, which is the one sentence in it that
says what the reader gets:

> Most people do one part of this. Caio does the span.

**Alternative.** Reuse the line from the home. Consistent, but the reader just read it one
click ago:

> Creative Designer who learned to build.

### Bio — REWRITTEN 2026-09-14, supersedes the approved version

Caio directed this rewrite on 2026-09-14, against
[juanmoraromero.com/about](https://www.juanmoraromero.com/about) as a reference. The brief
was to romanticise — which that reference does through specificity, not adjectives
(*"colour, shape, and technology have pulled at me with the same force"*).

Six changes he asked for:

1. Drop *in Porto Alegre, Brazil* from the opening — the header carries the location already.
2. Keep the scale (art director → interfaces → self-taught developer) but give it an origin:
   photography and cinema came first, and led him to advertising.
3. The creativity-and-technology paragraph says **everything has a function**. The old
   *"not decoration added to a finished layout"* was the cliché version of the same idea.
4. The advertising paragraph gains *several years in agencies* before Miami Ad School.
5. Huia stops being a run of job titles. It becomes where art direction met technology —
   experiments, building to find out, machine learning years before it was ordinary.
6. Azion carries leadership and operation, and what sitting next to engineering taught him.

> Caio Ogata is a Creative Designer. A former art director with a background in user interfaces and a self-taught path into development.
>
> It began with photography and cinema. He wanted to know why one frame moves you and the next one does not. Advertising was where that question became work.
>
> His work mixes creativity and technology. Nothing on a screen is there by accident. Type, grid, motion and interaction are all doing a job, and they get decided together. He designs the experience and writes the code that makes it behave.
>
> The craft comes from advertising. Several years in agencies as an art director, then a specialisation at Miami Ad School in São Paulo. The discipline there is making an idea land in a single look.
>
> Huia is where the two halves met. He joined the creative technology studio in 2013 and stayed eight years, six of them as partner. The brief was rarely a layout. It was a question: can this be built? The answers ran on WebGL, facial recognition and machine learning, years before any of that was ordinary. He led creative direction for Petrobras, O Boticário, Tramontina, Sicredi and Mondelez brands. He also picked up the habit he still works by — build a rough one early and look at it.
>
> Azion Technologies hired him to build a design operation from nothing, inside a company of engineers. He grew it to fourteen people across five disciplines. Four years, three roles: design, then brand, then the tools engineers use. Sitting that close to engineering taught him the other half of the job. How software actually ships, what a component costs, why an engineer says no. He ended with the whole user-facing layer: console, CLI, developer tools, website and documentation.
>
> Most people who do this work do one part of it. Caio does the span. The idea, the way it looks, and the thing that actually runs. For a client that means one person from start to finish.

**329 words**, against the 230–280 band the base document set from the reference sites. Over
by design: the brief was more information, not less. Longest sentence is 20 words, inside the
guide's limit. No banned terms.

**It resolves the ⚠ flagged above.** The old paragraph five read *"across product design,
creative, design ops, research and design systems… he moved through brand and then developer
experience."* The rewrite says *fourteen people across five disciplines* and *then the tools
engineers use*, so the contradiction between the two brand documents disappears rather than
needing a ruling.

**`who-is-caio.md` is now behind the site.** That file is the source of truth and holds the
version approved on 2026-09-10. It needs this text folded in once Caio has read it on screen
— otherwise the base and the site have drifted, which is the exact failure this whole
exercise set out to fix.

### Core Expertise — PROPOSED

Seven items, the first thing after the bio. Current list opens on the two most-banned
phrases on the site.

| # | Current | New |
|---|---|---|
| 1 | Design Systems Architecture & Implementation | Creative direction |
| 2 | Developer Experience (DevEx) & Design Engineering | Brand and visual identity |
| 3 | End-to-end Product Ownership (concept → production) | Interface and interaction design |
| 4 | Brand Strategy & Creative Direction | Motion, built in the browser |
| 5 | Design Team Leadership & Organizational Design | Front-end that ships to production |
| 6 | Cross-functional Collaboration (Design + Engineering) | Reusable component libraries |
| 7 | UI/UX Design & Interaction Design | Building and leading design teams |

Reordered so creative direction leads and the code is the fifth claim, not the first. The
order carries the argument: he is a designer who also builds, not an engineer who also
designs.

### Notable Clients — PROPOSED

Sixteen logos with a one-line caption. For a creative positioning this is the densest proof
on the site, and it currently says nothing about what was done.

**Short caption** (keep as is):

> Two decades of work for brands across Brazil and beyond.

**Long description** (replaces the current one):

> Twenty years of brand and product work for companies most Brazilians already use.
> Petrobras, O Boticário, Itaú, Tramontina, Sicredi. International work through Mondelez —
> Lacta, Bis, Toblerone, Oreo. Campaigns, identities, interfaces, and the sites that carry
> them.

### Skills — PROPOSED, rebuilt

**Revised 2026-09-14.** The first pass renamed the six category labels and left the items
inside untouched, which broke them: *Brand and identity* held nothing but component-library
work, and *Creative direction* contained an item called *Creative Direction*. Renaming a
label without reading what sits under it is how a list starts lying about itself.

Rebuilt below. Levels carry over where the skill carried over.

**Creative direction** — the craft, and where the record starts. Art direction opens it: he
trained as one, held the title at three agencies, and specialised at Miami Ad School.

| Skill | Level |
|---|---|
| Art direction | Expert |
| Product design | Expert |
| Interface design | Expert |
| User experience | Expert |
| Interaction design | Advanced |
| Motion design | Advanced |
| Typography | Advanced |
| Photography direction | Advanced |

**Brand and identity system** — brand plus the system that carries it. Brand strategy moves
in from creative direction, where it never belonged.

| Skill | Level |
|---|---|
| Visual identity | Expert |
| Component libraries | Expert |
| Design tokens | Expert |
| Brand strategy | Advanced |
| Voice and tone | Advanced |
| Illustration and iconography | Advanced |
| Atomic design | Advanced |
| Accessibility / WCAG | Advanced |

**Interface and code** — design-to-code workflows move in from the old design-system group,
which is where that skill actually lives.

| Skill | Level |
|---|---|
| Design-to-code workflows | Expert |
| TypeScript / JavaScript | Advanced |
| HTML / CSS | Advanced |
| Semantic HTML | Advanced |
| Vue 3 | Advanced |
| UI engineering | Advanced |
| Vite | Proficient |
| Git / version control | Proficient |

**Working with AI** — two near-duplicates merged (*LLM collaboration & prototyping* and
*AI-assisted prototyping* were the same claim twice). MCP work added: it is the 2026 course
in the education list.

| Skill | Level |
|---|---|
| Cursor | Expert |
| Claude Code | Expert |
| Prototyping with LLMs | Advanced |
| Design-to-code with MCP | Advanced |
| Research and analysis | Advanced |
| Image and video generation | Advanced |

**Tools** — tools only. Storybook and Figma Variables move in from the groups where they were
listed as disciplines.

| Skill | Level |
|---|---|
| Figma | Expert |
| Adobe Creative Suite | Expert |
| Figma Variables & Token Studio | Advanced |
| Framer | Advanced |
| VS Code | Advanced |
| Google AI Studio | Advanced |
| Storybook | Proficient |
| Remotion | Proficient |
| n8n | Proficient |
| VEO | Familiar |

**How he works** — method and practice. Design operations and leading teams move in; neither
is creative direction.

| Skill | Level |
|---|---|
| Design sprint | Expert |
| Leading design teams | Expert |
| Design thinking | Expert |
| Product discovery | Advanced |
| UX research | Advanced |
| Design operations | Advanced |
| Agile / Scrum / Kanban | Advanced |

#### What was dropped, and why

| Item | Reason |
|---|---|
| `Creative Direction` | Sat inside a category of the same name |
| `Developer Experience (DevEx)` | A job title, not a skill — and a banned term here. The record carries it on /experience |
| `OKR-driven data analysis` | Filed under AI, where it is not an AI skill. Recruiter vocabulary |
| `AI-assisted prototyping` | Duplicate of `LLM collaboration & prototyping` |
| `Design Systems Architecture` | Replaced by `Component libraries`, which says the same thing without the banned phrase |
| `UI/UX Design` | Split into `Interface design` and `User experience` |

#### ⚠ One level needs Caio's call

**Photography direction — Advanced.** Every other entry traces to something in the record: a
job title, a project, a course, a named tool. This one does not. The only evidence in the
content is `quickFacts`, where photography appears as a hobby alongside cinema. Directing
photography is ordinary art-director work and the claim is plausible, but it is asserted
here, not sourced. Confirm the level or cut the item.

---

## 3. Experience

### Headline — PROPOSED

Current: *Design Engineering as a practice: where brand rigor, product thinking, and shipped
code occupy the same role.* Three banned terms, and the sentence furthest from the new
positioning anywhere on the site.

> Advertising, then a studio, then product. Each step closer to the thing that ships.

### The three numbers — PROPOSED, and the current ones are wrong

| Card | Says now | Canon | Problem |
|---|---|---|---|
| years | `15+` | 20+ total, 15 in UI | Undersells, and contradicts the home's "twenty years" |
| companies | `6` | 9 distinct, 12 roles | The rendered list shows 12 rows |
| executive roles | `2` | 3 directorships at Azion, plus partner at Huia | |

They also count **employers**, which is a recruiter's unit. A client does not care how many
companies he passed through; they care how much work he has run. All three values below come
from "numbers that are safe to use" in the base document.

| Value | Label |
|---|---|
| `20+` | years |
| `40+` | projects led |
| `0→14` | design org built |

### The twelve roles — PROPOSED

Job titles stay: they are what the record says. The descriptions are rewritten plain.

**2024–2025 · Azion Technologies · Developer Experience Director**
> Took over every interface a customer or an engineer touches: console, command line, tools,
> documentation. Kept brand oversight alongside it.

**2023–2024 · Azion Technologies · Brand Experience Director**
> Ran brand across the whole company after leading the rebrand — product screens,
> documentation, marketing, launches and events.

**2021–2023 · Azion Technologies · Design Director**
> Hired to build a design operation from nothing, inside an engineering company. Grew it to
> fourteen people across five disciplines, and published azion.design.

**2015–2021 · Huia (acquired by Stefanini) · Partner, Head of Creative Technology**
> Made partner two years after joining. Led the design and UX teams while the studio grew to
> around forty people, up to the Stefanini acquisition.

**2013–2015 · Huia · Production Designer & Creative Coordinator**
> Ran the art, motion and video squads. Led creative direction on 40+ projects for O
> Boticário, Petrobras, Tramontina and Mondelez brands.

**2012 · W3haus · Art Director**
> Art direction for O Boticário's retail displays, plus campaign work for Lacta, Toblerone,
> Petrobras and Fila.

**2010–2012 · Post Digital · Creative Manager**
> First designer at a two-month-old startup. Left having run design on around forty projects
> — software screens, iPad work, e-commerce, interactive TV.

**2007–2008 · Oz Propaganda · Art Director**
> Concepts, art direction and print for healthcare and education clients in Londrina.

**2007–2008 · Dispert Propaganda e Marketing · Art Director**
> Retail advertising in every format — print, point of sale, logos, radio scripts, TV spots.

**2005–2006 · Agência Ativa · Creative**
> Campaign creative for local advertising accounts.

**2004–2005 · Holos Sistema de Ensino · Layout Designer**
> Editorial layout for school workbooks. Drew the graphs and equations, prepared the files
> for print.

**2002–2003 · PB.com · Intern**
> First job. Web design at the local internet provider.

---

## 4. Projects

### Composition — a decision before any copy

Five published projects. Four are Azion. A Creative Designer whose published work is 80% one
infrastructure client reads as a platform specialist — the portfolio argues against the
headline it sits under.

The material to fix it is in the base document and approved: *40+ digital projects led at
Huia, for Petrobras, O Boticário, Tramontina, Sicredi, Aché and Mondelez brands — WebGL,
facial recognition, experimental techniques years before they were common.* All of it is
compressed into one entry, ranked last by year.

See [`content-rewrite-plan.md` §2.6](content-rewrite-plan.md) for the options. The copy
below rewrites the five that exist today; it does not invent the cases that do not.

### Azion Website & Brand Expansion — 2022 — PROPOSED

> A brand stretch, not a rebuild. The site needed more range — richer layouts, stronger
> colour, a way to show what the product actually does — without throwing away the front-end
> already running in production.

**Impact**
> New illustration patterns that explain features visually. Richer page blocks across every
> page. The existing architecture survived intact.

### Azion Console Kit — 2023 — PROPOSED

> The screen engineers use to deploy and watch their applications, rebuilt from scratch. Vue
> 3, a shared component library, and an architecture that separates how a screen looks from
> what it does.

**Impact**
> Open source: 6,000+ commits, 34+ contributors, 93+ releases. In production at Itaú,
> Magazine Luiza and Netshoes. New screens went from days to hours. Caio led it; the team he
> built wrote it.

That last sentence is deliberate. The base document sets the ceiling — *he led it, the team
built it* — and the site should say so rather than leave the reader to assume.

### Azion Design System — 2021 — PROPOSED

> A shared kit of parts for the product, put in place a piece at a time so customers never
> woke up to a different-looking product.

**Impact**
> 40+ documented components on one foundation. Parallel teams could finally build the same
> way. Published publicly at azion.design.

### Azion Brand System — 2020 — PROPOSED

> A full identity for a company selling infrastructure: visual language, voice, illustration
> and iconography, applied across product, marketing and engineering.

**Impact**
> One brand across 100+ locations and 20,000+ hosted applications. The foundations held
> through investment rounds from Monashees and Qualcomm Ventures.

### Huia, Creativity & Innovation — 2013 — PROPOSED

> Eight years at a creative technology studio in Porto Alegre — two running squads, six as
> partner. The work ran on WebGL, facial recognition and language models, years before any of
> it was common.

**Impact**
> The studio went from an internal nucleus to forty people, and was acquired by Stefanini.
> 40+ projects led for Petrobras, O Boticário, Tramontina, Sicredi and Mondelez brands.

### Housekeeping

Two disabled entries carry slugs that do not match their titles: `brand-oboticario` is
titled *"Azion CLI (coming soon)"*, `product-petrobras` is titled *"Labs (coming soon)"*.
Leftovers from an earlier plan. Either restore the O Boticário and Petrobras cases under
their real slugs — which the composition problem argues for anyway — or delete both.

---

## 5. Philosophy

Kept, converted to third person. The base document deliberately keeps this out of the bio —
*"it reads as philosophy, and the bio has to sell"* — and says it belongs somewhere on the
site. It already has a page; that page has no entry in the menu.

### Title — no change

> Fall, learn, evolve

### Body — PROPOSED

> Good design comes from the same place as good athleticism: a willingness to fail, learn,
> and go again.
>
> Caio learned it on a judo mat. As he wrote in 2018:
>
> > In Judo, the first lessons are all focused on teaching how to fall. From the beginning,
> > it's understood that you will fall, lose, err. So suffer less, lose the fear, preserve
> > your body and, most importantly, prepare your mind for the obstacles ahead.
>
> Skateboarding taught him the same thing. Skaters are the most persistent people he has
> met. They fall hundreds of times learning one trick, and do it without fear, because
> falling is the process rather than a failure of it.
>
> It translates directly. The best work comes from teams that are not afraid to test, fail
> and change. Ship early, get it in front of people, keep going. Nothing good arrives
> finished.
>
> Running a team, he tries to build places where people can fall safely. Where iterating is
> the point, not a setback. Where "I don't know yet" is a fine answer, as long as curiosity
> and action follow it.

The 2018 quote stays in first person — it is a quotation, and changing it would be
falsifying it.

---

## 6. Contact

The offer changed. Caio decided on 2026-09-12 that the site sells freelance work, not a
candidacy. The current text reads as a job hunt.

### Heading — PROPOSED

Current: *Get in touch*

> Work together

### Description — PROPOSED

Current: *"I'm currently exploring opportunities in design leadership, product development,
and innovation… Open to remote, hybrid, or relocation for the right role. If you're building
something interesting, or just want to talk design systems, developer experience, or the
intersection of sports and UX, reach out."*

> Caio takes on brand, interface and front-end work — on his own, or alongside a team you
> already have. He is booking from October 2026.
>
> If you have something in mind, write. One sentence about the project is enough to start.

### Form subjects — PROPOSED

Drop `Job Opportunity`. Keep `Freelance Project`, `Feedback`, `Other`.

### The email does not match itself

`contact.email` is `caioogata.labs@gmail.com`. The footer renders
`contato@caioogata.com`, taken from the Figma. Two addresses on one site. Needs a call on
which is real.

---

## 7. Menu descriptions — PROPOSED

Shown under each item when the command menu is open. Currently unrendered — the menu is
disabled — but the strings live in `en.json` and feed the machine-facing files.

| Item | Current | New |
|---|---|---|
| about | Bio, expertise, and background. | Who he is and how he works. |
| projects | Selected design and product work. | Selected work, and what it took. |
| experience | Roles, companies, and key achievements. | Twenty years, role by role. |
| philosophy | Design principles and how I approach product and teams. | Falling, learning, and shipping anyway. |
| contact | How to get in touch and connect. | How to reach him. |

The philosophy line is the only one written in first person anywhere in the menu — a leftover
from the V1 voice.

---

## What this document does not cover

- **Machine-facing text** — `/llms.txt`, `/llms-full.txt`, `/llms-pt.txt`, page metadata,
  OpenGraph, the Person JSON-LD. Separate document, written next. It is the larger body of
  off-brand text and it carries the birth-date leak described in the plan's §0.
- **The PT translation.** The base is written English-first; `pt-br.json` lags and needs the
  whole of this document translated once it is approved.
- **New case studies.** The portfolio composition problem needs material that does not exist
  yet — the Huia-era creative work as its own cases.
