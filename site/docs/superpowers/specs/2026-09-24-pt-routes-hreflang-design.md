# Portuguese routes, hreflang and sitemap — design

Date: 2026-09-24. Status: approved in conversation, awaiting spec review.

## Why

The site only exists in English as far as a crawler can tell. Language is a
client-side preference: the HTML is always English, and a saved `pt-br` choice
in `localStorage` hides the page until Portuguese is fetched and the whole tree
remounts. There is no Portuguese URL to index and no hreflang. This is the
prerequisite for requesting indexing in Search Console.

## Outcome

- Every page exists at two URLs: unprefixed English (`/about`) and Portuguese
  under `/pt` (`/pt/about`), both rendered on the server in their language.
- Each page declares `<html lang>`, title, description, canonical, `og:locale`
  and hreflang alternates (`en`, `pt-BR`, `x-default` → English) for its own
  language.
- The sitemap lists both languages with their alternates.
- The URL is the only source of the language (decision A): no redirect based
  on a saved preference, the browser language or `Accept-Language`.

## Non-goals

- No change to the `llms*` files, their routes or the middleware.
- No new content: the Portuguese strings already live in `pt-br.json`, except
  the five fixed pages' metadata (see Metadata).
- No automatic language detection of any kind.

## URLs

| Request | Result |
|---|---|
| `/`, `/about`, `/projects/lukso` … | English, rewritten internally to `/en/...` |
| `/pt`, `/pt/about`, `/pt/projects/lukso` … | Portuguese |
| `/en`, `/en/:path*` | 308 to the unprefixed path |
| anything unmatched | 404 in the language of its prefix |
| `/llms*.txt`, `/llms/...`, `/sitemap.xml`, `public/` files, `/_next/*` | unchanged |
| `/dev/*` | unchanged (404 in production, as today) |

## Structure

- Pages move from `app/` to `app/[lang]/`: `page.tsx`, `about`, `experience`,
  `projects`, `projects/[slug]`, `philosophy`. `generateStaticParams` returns
  `en` and `pt`; `dynamicParams = false`, so any other first segment is a 404.
  Project pages generate `lang × slug`.
- `app/[lang]/layout.tsx` becomes the root layout (today's `app/layout.tsx`),
  and sets `<html lang>` to `en` or `pt-BR` from the param.
- `app/[lang]/not-found.tsx` replaces `app/not-found.tsx`;
  `app/[lang]/[...rest]/page.tsx` calls `notFound()` so unmatched URLs get the
  site's 404 in the right language instead of Next's default one.
- `app/dev/layout.tsx` gains its own `<html>`/`<body>` (it is a second root
  layout now) and keeps the production 404.
- `llms*` route handlers and `sitemap.ts` stay at `app/`.
- The route segment is `pt`; the content language stays `pt-br` (the existing
  `Language` type). `lib/i18n.ts` holds the mapping and the helpers below.

## Routing (`next.config.mjs`)

- `redirects()`: `/en` → `/`, `/en/:path*` → `/:path*`, permanent.
- `rewrites().afterFiles`: `/` → `/en`, and every path not starting with `pt`
  (`/:path((?!pt(?:/|$)).*)`) → `/en/:path`. `afterFiles` runs after `public/`
  files and static routes (`/llms.txt`, `/sitemap.xml`, `/dev/*`) and before
  dynamic routes, so those are never rewritten. No middleware involvement.
- The exclusion regex and `/_next/image` are checked in the local build before
  anything ships.

## Content and language state

- `LanguageProvider` takes the language as a prop from the root layout and no
  longer reads or writes `localStorage`, no longer holds the page, no longer
  remounts the tree with `key={language}`.
- The `-lang-pending` inline script in the layout and its CSS go.
- Each language's JSON is imported by its own small client module
  (`EnContent`, `PtContent`), and the layout renders the one for the route, so
  a page only ships its own language (keeps the ~37 KB gzip saved on
  2026-09-24).
- `useLanguage()` keeps its shape (`language`, `content`), so the ~27 consumers
  do not change. `setLanguage` is removed.

## Links

- `localePath(path, lang)` in `lib/i18n.ts`: identity for English, `/pt` prefix
  for Portuguese (`/` → `/pt`, `/#projects` → `/pt#projects`).
- Applied at every internal link: `main-navigation.ts` consumers
  (`PageNavigation`), `HeaderBar`, `ProjectRow`, `ProjectCard`,
  `ProjectPageShell` (back), the 404.
- `LanguageSwitch` becomes two links to the same page in each language, built
  from `usePathname()` (strip or add `/pt`, keep the hash-less path). The
  active one carries `aria-current="page"` instead of `aria-pressed`; the visual treatment does not change.

## Metadata (`lib/seo.ts`)

One builder, `pageMetadata({ lang, path, title, description, image?, type? })`,
returns the Next `Metadata` with:

- `title`, `description`, OpenGraph and Twitter in the page's language;
- `alternates.canonical` = the page's own URL in its language;
- `alternates.languages` = `{ en, 'pt-BR', 'x-default' }` (x-default = English);
- `openGraph.locale` = `en_US` / `pt_BR`, `alternateLocale` the other one.

Sources:

- Project pages: `title` and `description` from the language's JSON.
- Home, about, experience, projects, philosophy: English strings as they are
  today; Portuguese titles and descriptions drafted by Claude and approved by
  Caio before shipping, kept in a `seo` block in each JSON.
- The Person JSON-LD keeps its shape; `description` follows the page language.

## Sitemap

Every page appears twice (English and `/pt`), each entry carrying
`alternates.languages` with both URLs. Disabled projects stay out. The `llms*`
entries are unchanged.

## Verification

Local production build (`next build && next start -p 3100`), by curl:

- every page in both languages answers 200 with the right `<html lang>`,
  title, canonical, three hreflang links and `og:locale`;
- `/en`, `/en/about` → 308 to the unprefixed path;
- `/xyz`, `/pt/xyz`, `/projects/nope`, `/pt/projects/nope`, `/de/about` → 404
  with the site's 404 in the right language;
- `/llms.txt`, `/llms-pt.txt`, `/llms/projects/...`, `/sitemap.xml`,
  `/robots.txt`, `/og-img.png`, a cover through `/_next/image` → unchanged;
- the sitemap has both languages with alternates;
- no Portuguese JSON in an English page's chunks and vice versa.

Playwright on :3100: the switch lands on the same page in the other language,
header/nav/project links stay in the current language, no page hold or flash.

Production after the push: one request at a time, announced first (firewall
rule from 2026-09-23).

## Risks

- A shared link to a Portuguese page used to rely on the saved preference;
  it now needs the `/pt` URL. Visitors with a saved `pt-br` preference see
  English at unprefixed URLs until they use the switch (accepted with decision A).
- Moving the root layout under `[lang]` touches every route; the verification
  list above is the gate.
