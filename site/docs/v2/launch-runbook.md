# Launch runbook — V2 on caioogata.com, V1 on v1.caioogata.com

Two Vercel projects stay separate (V1 builds from the repo root, V2 from `site/`).
Team `caio-ogata-labs-projects`, DNS on Vercel.

| Project | Today | After launch |
|---|---|---|
| `caioogata` | `main` → www.caioogata.com | `v1` → v1.caioogata.com |
| `caioogata-v2` | `v2` → caioogata-v2.vercel.app | `main` → www.caioogata.com |

## Before

- [x] `caioogata` git link repaired (2026-09-15, was `git_info_fail`).
- [x] `v1.caioogata.com` added to `caioogata`, Git branch `v1`, deployment READY. It still
      answers 302 to Vercel login: a branch-mapped domain is a preview, and previews are
      protected. It goes public in step 3 of the cutover. Do not switch the production
      branch to `v1` before step 1: `v1` carries the noindex header and would push it to www.
- [ ] `launch` merged into `v2`, deployed, checked on caioogata-v2.vercel.app.
- [ ] Remove the `RESEND_*` env vars from `caioogata-v2` (form is gone).

## Cutover

1. `caioogata` → Domains: remove `caioogata.com` and `www.caioogata.com`.
2. `caioogata-v2` → Domains: add `www.caioogata.com`, then `caioogata.com` redirecting (308) to www.
3. `caioogata` → Settings → Environments → Production: branch `v1`; redeploy `v1` to
   production; in Domains, clear the Git branch on `v1.caioogata.com`. It now serves the
   production deployment and is public.
4. Check:
   - `curl -sI https://caioogata.com` → 308 to www
   - `curl -sI https://www.caioogata.com` → 200, no `X-Robots-Tag`
   - `/about`, `/experience`, `/philosophy`, `/projects`, one `/projects/<slug>`, `/llms-full.txt`, `/sitemap.xml` → 200
   - `/dev/buttons` → 404
   - OG preview (paste the URL in a LinkedIn/WhatsApp draft)
   - footer V1 link opens v1.caioogata.com (200, `X-Robots-Tag: noindex, nofollow`)
5. Search Console: resubmit `https://www.caioogata.com/sitemap.xml`.

## Rollback

Move both domains back to `caioogata` and promote the `main` @ `fa7a140` deployment (Deployments → Promote), so www does not serve the noindex build.

## After

- Fast-forward `main` to `v2`; set `caioogata-v2` production branch to `main`.
