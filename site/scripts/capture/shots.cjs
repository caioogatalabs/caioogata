// Still captures for project covers. One headless page at 1680x1050 @2x; each
// entry is screenshotted to <name>.png (3360x2100) and <name>.webp (1920x1200).
// Cookie banners and floating chat launchers are hidden, never clicked.
//
//   OUT_DIR=<dir> nice -n 15 node shots.cjs list.json
//
// list.json entries:
//   name, url             required
//   scroll                y in CSS px
//   text, section, offset scroll to the first element containing `text` (or its
//                         <section> when `section` is true), `offset` px from top
//   wait                  ms to settle before the shot (2500)
//   css                   extra stylesheet, e.g. centering an isolated story
//   scale                 magnify: renders a 1680/scale viewport at 2*scale DPR,
//                         same output size. Never CSS zoom — it breaks measured
//                         layouts (flows, carousels).
const { chromium } = require('playwright')
const fs = require('fs')
const path = require('path')
const { execFileSync } = require('child_process')

const OUT = process.env.OUT_DIR
const list = JSON.parse(fs.readFileSync(process.argv[2], 'utf8'))

// Consent banners are hidden, never clicked.
const HIDE_BANNERS = `
  [id*="cookie" i], [class*="cookie" i], [id*="consent" i], [class*="consent" i],
  #onetrust-banner-sdk, #onetrust-consent-sdk, .cky-consent-container, #CybotCookiebotDialog,
  [aria-label*="cookie" i],
  [id*="chat" i]:not(html):not(body), [class*="chat-widget" i], [class*="chatbot" i], #hubspot-messages-iframe-container,
  #intercom-container, .intercom-lightweight-app, iframe[title*="chat" i] { display: none !important; }
`

let browser = null
const shutdown = async (code, why) => {
  if (why) console.log(why)
  if (browser) await browser.close().catch(() => {})
  process.exit(code)
}
process.on('SIGINT', () => shutdown(130, 'interrupted'))
process.on('SIGTERM', () => shutdown(143, 'terminated'))

;(async () => {
  fs.mkdirSync(OUT, { recursive: true })
  browser = await chromium.launch({ channel: 'chromium', headless: true, args: ['--disable-extensions', '--renderer-process-limit=2'] })
  const ctx = await browser.newContext({ viewport: { width: 1680, height: 1050 }, deviceScaleFactor: 2, locale: 'en-US' })
  const basePage = await ctx.newPage()
  for (const item of list) {
    // `scale`: magnify without CSS zoom (which breaks measured layouts) by
    // rendering a smaller viewport at a higher pixel ratio — same 3360x2100 out.
    let page = basePage
    let tmp = null
    if (item.scale) {
      tmp = await browser.newContext({ viewport: { width: Math.round(1680 / item.scale), height: Math.round(1050 / item.scale) }, deviceScaleFactor: 2 * item.scale, locale: 'en-US' })
      page = await tmp.newPage()
    }
    try {
      await page.goto(item.url, { waitUntil: 'load', timeout: 45000 })
      await page.waitForLoadState('networkidle', { timeout: 10000 }).catch(() => {})
      await page.addStyleTag({ content: HIDE_BANNERS }).catch(() => {})
      // `css`: per-shot styling, e.g. centering and enlarging an isolated story.
      if (item.css) await page.addStyleTag({ content: item.css })
      // `text`: scroll so the first element containing it sits near the top.
      if (item.text) {
        await page.evaluate(({ text, offset, section }) => {
          const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT)
          while (walker.nextNode()) {
            if (walker.currentNode.textContent.toLowerCase().includes(text.toLowerCase())) {
              const el = walker.currentNode.parentElement
              const anchor = (section && el.closest('section')) || el
              const top = anchor.getBoundingClientRect().top + scrollY
              window.scrollTo({ top: Math.max(0, top - offset), behavior: 'instant' })
              return
            }
          }
        }, { text: item.text, offset: item.offset ?? 160, section: !!item.section })
        await page.waitForTimeout(800)
        await page.waitForLoadState('networkidle', { timeout: 5000 }).catch(() => {})
      }
      if (item.scroll) {
        await page.evaluate((y) => window.scrollTo({ top: y, behavior: 'instant' }), item.scroll)
      }
      await page.waitForTimeout(item.wait ?? 2500)
      // Chat launchers mount late and under arbitrary names: hide any small
      // fixed element parked in the bottom corners.
      await page.evaluate(() => {
        for (const el of document.querySelectorAll('body *')) {
          const cs = getComputedStyle(el)
          if (cs.position !== 'fixed') continue
          const r = el.getBoundingClientRect()
          if (r.width > 0 && r.width < 520 && r.height < 720 && r.bottom > innerHeight * 0.6 && (r.left > innerWidth * 0.6 || r.right < innerWidth * 0.4)) {
            el.style.setProperty('display', 'none', 'important')
          }
        }
      })
      const png = path.join(OUT, `${item.name}.png`)
      const webp = path.join(OUT, `${item.name}.webp`)
      await page.screenshot({ path: png, timeout: 30000 })
      execFileSync('nice', ['-n', '15', 'cwebp', '-quiet', '-q', '90', '-resize', '1920', '1200', png, '-o', webp])
      console.log(`ok   ${item.name}  ${page.url()}`)
    } catch (e) {
      console.log(`FAIL ${item.name}  ${e.message.split('\n')[0]}`)
    } finally {
      if (tmp) await tmp.close().catch(() => {})
    }
  }
  await shutdown(0)
})().catch((e) => shutdown(1, `ERROR: ${e.message} — browser closed`))
