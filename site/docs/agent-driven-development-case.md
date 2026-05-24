# Agent-Driven Development: Building a Portfolio with Claude Code

## Overview

Portfolio project built entirely through human-agent collaboration using **Claude Code** (Anthropic's CLI agent). From planning to production in ~7 weeks, with specialized agents handling different phases of the work.

**Stack:** Next.js 15 · React 19 · Tailwind CSS · TypeScript · Vercel
**Live:** caioogata.com
**Differentiator:** Dual-purpose — optimized for both humans and LLM agents (`/llms.txt` routes)

---

## The Pipeline

```
 Idea → PRD → Technical Spec → Content Spec → Code → Case Studies → Deploy
   ↑       ↑         ↑              ↑            ↑          ↑
  Human   Agent     Agent         Agent        Agent      Agent + Human
```

Every stage used Claude Code, but with different levels of human input. Planning was conversational (human-led direction, agent-generated docs). Implementation was mostly agent-autonomous. Content and visual work was the most collaborative.

---

## Documentation Structure

The project is driven by a hierarchy of documents that feed into each other. Each one was generated through agent conversations and refined by the human.

```
docs/
├── PRD.md                          ← Product requirements (problem, personas, features)
├── TECHNICAL-SPEC.md               ← Full implementation spec (architecture, components, roadmap)
├── CONTENT.md                      ← Brand voice, bios, microcopy, tone guidelines
├── PROJECTS-GUIDE.md               ← Visual spec for case studies (image composition, workflow)
├── RECRUITER-FAQ.md                ← Interview prep with structured answers
├── docs/
│   ├── llm-content-strategy.md     ← LLM discoverability patterns and route definitions
│   └── job-search-content-brief.md ← Market research for job search
└── .claude/projects/.../memory/
    ├── MEMORY.md                   ← Index (loaded every conversation)
    ├── case-study-pattern.md       ← Reusable case study workflow
    ├── job-search.md               ← Job search context & tracking
    ├── project_composition_redesign.md ← Image system redesign decisions
    └── feedback_playwright_chromium.md ← "Use Chromium, never Chrome"
```

| Document | Size | Agent | Purpose |
|----------|------|-------|---------|
| [PRD.md](../PRD.md) | 62KB | Product Manager | Problem definition, personas, features, success metrics |
| [TECHNICAL-SPEC.md](../TECHNICAL-SPEC.md) | 81KB | Product Manager | Architecture, 67 components, implementation roadmap |
| [CONTENT.md](../CONTENT.md) | ~8KB | Content Strategist | Brand voice workshop → bios, microcopy, tone checklist |
| [PROJECTS-GUIDE.md](../PROJECTS-GUIDE.md) | ~20KB | Frontend Architect + Human | Image composition rules, alignment models, workflow |
| [RECRUITER-FAQ.md](../RECRUITER-FAQ.md) | ~6KB | Content Strategist | Structured answers for design process, trade-offs, culture |
| [llm-content-strategy.md](llm-content-strategy.md) | ~8KB | Brainstorming + Human | Route architecture, grounding instructions, crawler config |

**Flow:** PRD → Technical Spec → Code. Content Spec runs in parallel. PROJECTS-GUIDE and LLM Strategy were created on-demand as new phases started.

---

## Phases

### Phase 1 — Planning

| Document | What it does | How it was made |
|----------|-------------|-----------------|
| [PRD.md](../PRD.md) | Problem, personas, features, success metrics | Product Manager agent — structured rough ideas into formal PRD |
| [TECHNICAL-SPEC.md](../TECHNICAL-SPEC.md) | Architecture, component list, implementation roadmap | Product Manager → refined through conversation into full spec |
| [CONTENT.md](../CONTENT.md) | Brand voice, bios, microcopy, tone guidelines | Content Strategist agent — brand voice workshop format |

**Skills used:** `product-manager`, `content-strategist`, `brainstorming`

### Phase 2 — Core Build

Built the full application: 67 components, 13 sections, CLI-style navigation, i18n (EN/PT-BR), contact form, keyboard navigation.

| What | Details |
|------|---------|
| Architecture | App Router, LanguageProvider context, static export |
| Components | 4 hero + 3 layout + 13 sections + 20+ UI + 6 hooks |
| Navigation | CLI-inspired menu with keyboard/mouse/touch modes |
| Content model | TypeScript interfaces → JSON content files → components |

**Skills used:** `frontend-design`, `vercel-react-best-practices`, `design-system`, `test-driven-development`

### Phase 3 — LLM Strategy

Created the dual-consumption architecture — the portfolio serves both humans (visual UI) and LLM agents (structured markdown).

| Route | Purpose |
|-------|---------|
| `/llms.txt` | Lean index (llmstxt.org spec) |
| `/llms-full.txt` | Full EN profile (canonical for AI) |
| `/llms-pt.txt` | Full PT-BR (human readers) |
| `/llms/projects/{slug}.txt` | Individual case studies (EN + PT) |
| `/api/llms` | JSON/markdown API |

Also added: Schema.org JSON-LD, `robots.txt` with LLM crawler allowlist, dynamic sitemap, "Ask about me on Claude" link builder.

**Key document produced:** [llm-content-strategy.md](llm-content-strategy.md)
**Skills used:** `brainstorming`, `frontend-design`, `extractor` (for llmstxt.org spec research)

### Phase 4 — Job Search Integration

Optimized the portfolio for a real job search: 70 positions mapped, skills reformatted (percentages → qualitative descriptors), cover letters generated, application tracking.

**Skills used:** `product-manager` (market research), `content-strategist` (cover letters), `enhance-prompt`

### Phase 5 — Case Studies & Visual Work

The most collaborative phase. Built a complete image composition system with Python scripts + Playwright for automated screenshot capture.

| Deliverable | Details |
|------------|---------|
| [PROJECTS-GUIDE.md](../PROJECTS-GUIDE.md) (500 lines) | Full visual specification for case studies |
| `scripts/compose-images.py` | Python image composer (3 alignment modes, fixed 120px margins) |
| 5 case study generators | EN + PT markdown for each project |
| 10 LLM routes | Static `.txt` routes for each case study |
| 7+ composed images | 1600×1000 WebP outputs |

**Composition redesign (Mar 14-15):** Rewrote the entire image system from position-first to content-first model after discovering the 12% margin approach created visual inconsistency. This was a real-time architectural decision made collaboratively.

**Skills used:** `brainstorming`, `frontend-design`, `systematic-debugging` (composition issues), `figma:implement-design`

---

## Agent Architecture

### Specialized Agents Used

| Agent | When | What it does |
|-------|------|-------------|
| **Product Manager** | Phase 1 | PRD, personas, requirements, market research |
| **Content Strategist** | Phase 1, 4 | Brand voice, bios, microcopy, cover letters |
| **Frontend Architect** | Phase 2, 3, 5 | Component implementation, design system, UI code |
| **Explore** | All phases | Codebase navigation, file discovery, architecture mapping |
| **Code Reviewer** | Phase 2, 5 | Post-implementation quality checks |

### Skills (Reusable Workflows)

| Skill | Used in | Purpose |
|-------|---------|---------|
| `brainstorming` | Every major feature | Explore intent before implementing |
| `frontend-design` | Phase 2, 3, 5 | UI implementation with design quality |
| `product-manager` | Phase 1, 4 | Strategy and requirements |
| `content-strategist` | Phase 1, 4 | Copy and brand voice |
| `design-system` | Phase 2 | Token architecture, component variants |
| `vercel-react-best-practices` | Phase 2 | React/Next.js performance patterns |
| `systematic-debugging` | Phase 5 | Image composition issues |
| `extractor` | Phase 3 | Analyzing llmstxt.org spec |
| `enhance-prompt` | Phase 4 | Refining vague requests into actionable prompts |
| `verification-before-completion` | All phases | Build verification before claiming done |

### Memory System

Claude Code's persistent memory kept context across dozens of conversations:

```
.claude/projects/.../memory/
├── MEMORY.md                      ← Index (loaded every conversation)
├── case-study-pattern.md          ← Reusable case study workflow
├── job-search.md                  ← Job search context & tracking
├── project_composition_redesign.md ← Image system redesign decisions
└── feedback_playwright_chromium.md ← "Use Chromium, never Chrome"
```

Memory prevents the agent from re-asking solved questions or repeating mistakes. The feedback file exists because the agent once tried to use Chrome for screenshots and had to be corrected — it never made that mistake again.

---

## What Worked

1. **Spec-first approach** — The 81KB technical spec meant the agent could implement autonomously for long stretches without needing constant guidance
2. **Persistent memory** — Context carried across 50+ conversations without losing project conventions
3. **Specialized agents** — Product Manager writes better PRDs than a general-purpose agent. Content Strategist understands brand voice. Using the right agent for the right task matters.
4. **Brainstorming before building** — The `brainstorming` skill forced exploration of intent before jumping to code, preventing rework
5. **Human-agent division of labor** — Human: vision, strategy, visual direction, final decisions. Agent: generation, implementation, iteration speed

## What Required Human Judgment

- Visual composition rules (the agent can't "see" if 120px vs 12% looks better)
- Brand voice calibration (the agent generates options, human picks the right tone)
- LLM strategy decisions (which routes to expose, what format to use)
- When to stop iterating (the agent will keep refining forever if you let it)

---

## By the Numbers

| Metric | Value |
|--------|-------|
| Planning docs generated | ~145KB of structured specs |
| Components built | 67 |
| LLM routes | 13 static + 1 API |
| Git commits | 60+ |
| Case studies | 5 projects × 2 languages |
| Composed images | 7+ at 1600×1000 |
| Time to production | ~7 weeks |
| Conversations with agent | 50+ |
| Memory files maintained | 5 |
