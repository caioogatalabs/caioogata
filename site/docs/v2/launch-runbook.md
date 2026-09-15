# Launch runbook — V2 on caioogata.com, V1 on v1.caioogata.com

One Vercel project, `caioogata` (team `caio-ogata-labs-projects`), Root Directory `site`.
Every branch keeps the app in `site/`. DNS is on Vercel.

| Branch | Version | Address | Vercel role |
|---|---|---|---|
| `main` | V2 | www.caioogata.com (apex 308 → www) | Production |
| `v1` | V1, frozen at 1.1.91 | v1.caioogata.com | Preview, pinned by branch domain |
| `v2` | working branch | `caioogata-git-v2-…vercel.app` | Preview |

`caioogata-v2` is the old separate V2 project. It is deleted after launch.

## Before (done 2026-09-15)

- [x] `caioogata` git link repaired (was `git_info_fail`).
- [x] `v1` moved into `site/` (`36faca9`) and carries `X-Robots-Tag: noindex, nofollow`.
- [x] `caioogata` Root Directory set to `site`. www still serves the `main` @ `fa7a140` deployment.
- [x] `v1.caioogata.com` on `caioogata`, Git branch `v1`, build READY. Answers 302 (preview protection) until launch step 2.
- [x] Contact form, `/api/contact` and Resend removed; `/dev/*` 404s in production; `*.vercel.app` noindexed.

## Launch

1. Production: `git checkout main && git merge --ff-only v2 && git push origin main`.
   The push builds `main` from `site/` and promotes it to www.
2. `caioogata` → Settings → Deployment Protection → Vercel Authentication: off.
   v1.caioogata.com goes public (previews are noindexed by their headers).
3. `caioogata` → Settings → Security → Deployment Retention: keep preview and production deployments indefinitely, so the V1 preview is never pruned.
4. Check:
   - `curl -sI https://caioogata.com` → 308 to www
   - `curl -sI https://www.caioogata.com` → 200, no `X-Robots-Tag`
   - `/about`, `/experience`, `/philosophy`, `/projects`, one `/projects/<slug>`, `/llms-full.txt`, `/sitemap.xml` → 200
   - `/dev/buttons` → 404
   - header availability and footer copy the email
   - footer V1 link → v1.caioogata.com, 200 with `X-Robots-Tag: noindex, nofollow`
   - OG preview (paste the URL in a LinkedIn/WhatsApp draft)
5. Delete the `caioogata-v2` project. Remove its `RESEND_*` env vars first if keeping it for a while.

## Rollback

`caioogata` → Deployments → the `main` @ `fa7a140` production deployment → Instant Rollback.
It was built with the app at the repo root and needs no rebuild. Then fix forward on `main`.

## Later

- `v2` stays the working branch; ship by fast-forwarding `main`.
- Rewrite of the `/llms*.txt` corpus (`launch-copy.md`) and Search Console/indexing, after launch.
