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
