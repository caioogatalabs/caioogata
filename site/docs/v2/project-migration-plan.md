# Project Pages — Migration Plan

Status of each project page for V2 migration.

## Projects Overview

| # | Slug | Title | Sections | Assets | Status |
|---|------|-------|----------|--------|--------|
| 1 | `azion-website` | Azion Website & Brand Expansion | hero, challenge, impact, gallery-staggered, gallery-feature-list | 11 images + Figma embeds | **Done** — typography, grid, info block aligned to Figma |
| 2 | `azion-console-kit` | Azion Console Kit | hero, challenge, impact, gallery-staggered, gallery-feature-list | Images + 2 Figma embeds | **Ready** — has sections + assets, needs review pass |
| 3 | `azion-design-system` | Azion Design System | hero, challenge, impact, gallery-staggered | Images + 2 Figma embeds | **Ready** — has sections + assets, needs review pass |
| 4 | `azion-brand-system` | Azion Brand System | hero, challenge, impact, gallery-staggered, gallery-full-detail | Images | **Ready** — has sections + assets, needs review pass |
| 5 | `huia` | Huia Design | hero, challenge, impact, gallery-staggered | Images | **Ready** — has sections + assets, needs review pass |
| 6 | `brand-oboticario` | O Boticário Brand | — | — | **Disabled** — no sections/assets yet |
| 7 | `product-petrobras` | Petrobras Product | — | — | **Disabled** — no sections/assets yet |

## Migration per project

Each project needs:

1. **Content review** — verify en.json sections match the intended Figma layout
2. **Asset check** — confirm all image paths in sections exist in `public/projects/{slug}/`
3. **Figma embeds** — add `figmaEmbed` URLs to feature list items where applicable
4. **Visual QA** — load page in browser, verify typography/grid/animations match patterns doc
5. **pt-br sync** — update pt-br.json with translated content if needed

## Migration order

1. **azion-console-kit** — most complete, same team/structure as azion-website
2. **azion-design-system** — similar structure, Figma embeds already in images array
3. **azion-brand-system** — uses `gallery-full-detail` (unique section type, needs verification)
4. **huia** — different project context, smaller scope
5. **brand-oboticario** / **product-petrobras** — disabled, create sections + assets when ready

## Shared components (done)

All section components are production-ready:
- `ProjectHero` + `ProjectHeroImage`
- `ProjectChallenge`
- `ProjectImpact`
- `ProjectGalleryStaggered`
- `ProjectGalleryFeatureList` (with Figma embed support)
- `ProjectGalleryFullDetail`
- `ProjectInfoBlock` (unified 3-3-3-3 grid)
- `ProjectNavigation` (keyboard nav + prev/next)
- `FooterSection` (global via layout.tsx)

## Typography/layout reference

See [project-page-patterns.md](project-page-patterns.md) for the definitive style guide.
