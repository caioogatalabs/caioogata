# Phase 2: Home Page - Discussion Log

> **Audit trail only.** Do not use as input to planning, research, or execution agents.
> Decisions are captured in CONTEXT.md — this log preserves the alternatives considered.

**Date:** 2026-04-03
**Phase:** 02-home-page
**Areas discussed:** Intro visual treatment, Menu hover previews, V1 component reuse, Footer expand & contact

---

## Intro Visual Treatment

| Option | Description | Selected |
|--------|-------------|----------|
| Yellow full-bg (Recommended) | Brand bg fills entire Intro. Text/logo use inverse colors. | |
| Dark bg + yellow type | Dark canvas with yellow on headline text and accents. | |
| Hybrid — yellow fading to dark | Starts yellow, transitions to dark on scroll. | |

**User's choice:** Dark bg + yellow type (free text). Provided Figma references: node `500:210` (dark, primary) and `513:873` (yellow, deferred).
**Notes:** "A primeira versão vai ser em Dark Bg... Mas podemos testar a inversão como neste exemplo aqui a qualquer momento."

### "Ask about" CTA

| Option | Description | Selected |
|--------|-------------|----------|
| Link to /llms.txt | Simple external link. | ✓ |
| Open chat/prompt UI | Inline or modal chat interface. | |
| You decide | Claude picks simplest approach. | |

**User's choice:** Link to /llms.txt

### Compact Intro on Scroll

| Option | Description | Selected |
|--------|-------------|----------|
| Shrink to header bar | Logo + top bar elements as sticky header. | |
| Collapse completely | Intro disappears when section is active. | |
| Keep as-is from V1 | Preserve IntroCompact, restyle with V2 tokens. | |

**User's choice:** Shrink to header bar (free text). "Quando der o scroll nós vamos compactar ela com a logo, version, built for human and AI e Call to action, ask about caio."

---

## Menu Hover Previews

### Hover Depth

| Option | Description | Selected |
|--------|-------------|----------|
| Full previews (Recommended) | Each menu item shows contextual previews on hover. | ✓ |
| Highlight only, no previews | Hover just highlights the row. | |
| Simple image peek | Only visual sections show thumbnails. | |

**User's choice:** Full previews. Referenced fiddle.digital/work as primary motion reference: "a principal referência de motion, carregamento, hovers é esse site"

### Navigation Model

| Option | Description | Selected |
|--------|-------------|----------|
| Same-page scroll | All sections on home page, menu scrolls to them. | |
| Separate routes | Each section gets its own route. | ✓ |
| Keep V1 behavior | Preserve SPA navigation pattern. | |

**User's choice:** Separate routes

### Preview Style

| Option | Description | Selected |
|--------|-------------|----------|
| Inline row expansion | Row expands to show preview below text. | |
| Floating overlay (Recommended) | Preview follows cursor, like fiddle.digital. | ✓ |
| Side panel | Preview in fixed area to the right. | |

**User's choice:** Floating overlay

### Keyboard Previews

| Option | Description | Selected |
|--------|-------------|----------|
| Both keyboard + mouse | Arrow keys show preview for focused item too. | ✓ |
| Mouse only (Recommended) | Previews only on mouse hover. | |
| You decide | Claude picks. | |

**User's choice:** Both keyboard + mouse

### Content Map

| Option | Description | Selected |
|--------|-------------|----------|
| Images for all that have them | Different content per section type. | |
| Images only for visual sections | Only Projects and Clients show previews. | |
| Uniform treatment | Every item gets the same type of preview. | ✓ |

**User's choice:** Uniform component for all categories — "a preview from page, or a video in the future."

### Mobile Menu

| Option | Description | Selected |
|--------|-------------|----------|
| No previews on mobile | Clean list only, tap navigates directly. | ✓ |
| Tap-to-preview, tap again to navigate | Two-step interaction. | |
| You decide | Claude picks. | |

**User's choice:** No previews on mobile

### Active State

| Option | Description | Selected |
|--------|-------------|----------|
| Yes, highlight current | Menu row highlights for active section. | |
| No active state needed | Menu only on home page. | ✓ |

**User's choice:** No active state needed

### Navigation Speed (free-text discussion)
**User's concern:** Maintaining the fast back-and-forth navigation feel from V1 despite switching to real routes.
**Resolution:** Next.js prefetching + static export makes route navigation near-instant. Navbar with Esc persists across routes. Navigation always returns to menu, no cross-section nav. Adjustable after testing.

---

## V1 Component Reuse

### Reuse Strategy

| Option | Description | Selected |
|--------|-------------|----------|
| Rebuild from scratch (Recommended) | New V2 components, clean break from V1. | ✓ |
| Evolve existing components | Refactor V1 in-place. | |
| Hybrid — reuse hooks, rebuild UI | Keep hooks, rebuild visual components. | |

**User's choice:** Rebuild from scratch

### File Strategy

| Option | Description | Selected |
|--------|-------------|----------|
| Replace in-place | V2 overwrites V1 files. V1 preserved on branch. | ✓ |
| New v2/ namespace | V2 in src/components/v2/ during dev. | |

**User's choice:** Replace in-place

### Content Model

| Option | Description | Selected |
|--------|-------------|----------|
| Keep same en.json structure | Same data, new presentation. | |
| Evolve the model | Adjust for V2 needs. | |
| You decide | Claude assesses and proposes changes. | ✓ |

**User's choice:** You decide. "O conteúdo em texto, copy será o mesmo. Mas como vai organizar para usar as imagens/videos você decide. Vamos precisar manter as rotas de llm também."

---

## Footer Expand & Contact

### Expand Style

| Option | Description | Selected |
|--------|-------------|----------|
| Upward slide panel | Footer expands upward as a drawer. | |
| Full-screen overlay | Contact form takes over viewport. | |
| Inline expand (Recommended) | Footer grows in height to reveal form. | ✓ |

**User's choice:** Inline expand. Added: "Ele também vai expandir quando o usuário scrollar até o footer... esse comportamento e o click no botão serão o mesmo."

### /contact Route

| Option | Description | Selected |
|--------|-------------|----------|
| Footer trigger only | /contact scrolls to footer and expands it. | ✓ |
| Dedicated /contact route | Separate page with the form. | |
| You decide | Claude picks. | |

**User's choice:** Footer trigger only

### Form Submission

| Option | Description | Selected |
|--------|-------------|----------|
| Resend client-side SDK | Call API from browser. | |
| External serverless function | Keep single Vercel function. | |
| You decide | Claude picks most practical approach. | ✓ |

**User's choice:** You decide

### Tech Tags

| Option | Description | Selected |
|--------|-------------|----------|
| Static list | Hardcoded tags. | ✓ |
| Dynamic from package.json | Auto-generated from dependencies. | |
| You decide | Claude picks. | |

**User's choice:** Static list

---

## Claude's Discretion

- Form submission mechanism for static export
- Content model adjustments for V2 (preview images, etc.)
- Animation implementation details (CSS-only vs Motion library for page transitions)
- Responsive breakpoint exact values

## Deferred Ideas

- Yellow inverted Intro variant — future A/B test
- Video previews in menu hover — start with images
- Cross-section navigation — evaluate after user tests
- Custom cursor with velocity skew — implement if time allows
