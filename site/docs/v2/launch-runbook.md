# Launch runbook — V2 on caioogata.com, V1 on v1.caioogata.com

Two Vercel projects stay separate (V1 builds from the repo root, V2 from `site/`).
Team `caio-ogata-labs-projects`, DNS on Vercel.

| Project | Today | After launch |
|---|---|---|
| `caioogata` | `main` → www.caioogata.com | `v1` → v1.caioogata.com |
| `caioogata-v2` | `v2` → caioogata-v2.vercel.app | `main` → www.caioogata.com |

## Before

- [ ] `caioogata` git link repaired (it fails with `git_info_fail`, same defect V2 had on 2026-09-09):
      from a folder linked to `caioogata`, `vercel git disconnect` then `vercel git connect`.
      Production branch stays `main` for now (Settings → Environments → Production).
- [ ] `v1.caioogata.com` added to `caioogata`, Git branch `v1`. Check it answers 200 with
      `X-Robots-Tag: noindex, nofollow`.
- [ ] `launch` merged into `v2`, deployed, checked on caioogata-v2.vercel.app.
- [ ] Remove the `RESEND_*` env vars from `caioogata-v2` (form is gone).

## Cutover

1. `caioogata` → Domains: remove `caioogata.com` and `www.caioogata.com`.
2. `caioogata-v2` → Domains: add `www.caioogata.com`, then `caioogata.com` redirecting (308) to www.
3. Check:
   - `curl -sI https://caioogata.com` → 308 to www
   - `curl -sI https://www.caioogata.com` → 200, no `X-Robots-Tag`
   - `/about`, `/experience`, `/philosophy`, `/projects`, one `/projects/<slug>`, `/llms-full.txt`, `/sitemap.xml` → 200
   - `/dev/buttons` → 404
   - OG preview (paste the URL in a LinkedIn/WhatsApp draft)
   - footer V1 link opens v1.caioogata.com
4. Search Console: resubmit `https://www.caioogata.com/sitemap.xml`.

## Rollback

Move both domains back to `caioogata`. The V1 production deployment is still there; no rebuild.

## After

- Fast-forward `main` to `v2`; set `caioogata-v2` production branch to `main`.
- Set `caioogata` production branch to `v1`; move `v1.caioogata.com` off the branch mapping.
