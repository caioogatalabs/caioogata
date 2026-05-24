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
