// Frame-by-frame video capture for project covers. The page's clock is frozen
// and advanced exactly 1/FPS per frame (timers, rAF, Date, performance.now,
// CSS/WAAPI animations, on-screen <video>), and each frame is captured after
// its step, so the video is an even 60fps at true speed however slow capture is.
// Frames come back at 1680x1050 and ffmpeg scales them to 1920x1200.
//
//   OUT_DIR=<dir> nice -n 15 node vcap.cjs <url> <name> <seconds> [plan.json]
//
// plan.json — scripted interaction, times in seconds, positions in CSS px:
//   [{ "start": [x, y] },                              pointer at frame 0
//    { "at": 1, "dur": 0.6, "mouse": [x, y] },          eased move (hover follows)
//    { "at": 2, "dur": 1.2, "scroll": 1050 }]           eased scroll to y
//
// Env: CURSOR=1 draws a pointer · BLOCK=host,host drops requests (off-screen
// embeds) · HOLD_MS real-time wait for hydration before the clock starts (4000).
//
// Works on light sites (azion.com). Unreliable on heavy WebGL sites (lukso.com.br
// stalled about half the runs) — see PROJECTS-GUIDE.md, Home Cover › Video.
const { chromium } = require('playwright')
const fs = require('fs')
const path = require('path')
const { execFileSync } = require('child_process')

const [url, name, seconds, planFile] = process.argv.slice(2)
const FPS = Number(process.env.FPS || 60)
const VW = Number(process.env.VW || 1680)
const VH = Number(process.env.VH || 1050)
const OUT = process.env.OUT_DIR
const plan = planFile ? JSON.parse(fs.readFileSync(planFile, 'utf8')) : []

const VIRTUAL_TIME = `(() => {
  if (window.__vt) return
  let now = 0
  const dateStart = Date.now()
  const OD = Date
  function VDate(...a) {
    if (!(this instanceof VDate)) return new OD(dateStart + now).toString()
    return a.length ? new OD(...a) : new OD(dateStart + now)
  }
  VDate.prototype = OD.prototype
  VDate.now = () => dateStart + now
  VDate.UTC = OD.UTC
  VDate.parse = OD.parse
  window.Date = VDate
  performance.now = () => now

  let seq = 0
  const rafs = new Map()
  window.requestAnimationFrame = (cb) => { const id = ++seq; rafs.set(id, cb); return id }
  window.cancelAnimationFrame = (id) => { rafs.delete(id) }

  const timers = new Map()
  window.setTimeout = (cb, ms = 0, ...args) => { const id = ++seq; timers.set(id, { at: now + Math.max(0, +ms || 0), cb, args }); return id }
  window.setInterval = (cb, ms = 0, ...args) => { const every = Math.max(1, +ms || 0); const id = ++seq; timers.set(id, { at: now + every, every, cb, args }); return id }
  window.clearTimeout = window.clearInterval = (id) => { timers.delete(id) }

  const run = (fn, args) => { try { typeof fn === 'function' ? fn(...(args || [])) : 0 } catch (e) { console.error(e) } }

  window.__vt = {
    step(ms) {
      const target = now + ms
      // Timers created during this step wait for the next one: a setTimeout(0)
      // that re-arms itself would otherwise spin inside a single step forever.
      const lastSeq = seq
      for (let guard = 0; guard < 10000; guard++) {
        let pick = null
        for (const [id, t] of timers) if (id <= lastSeq && t.at <= target && (!pick || t.at < pick[1].at)) pick = [id, t]
        if (!pick) break
        const [id, t] = pick
        now = Math.max(now, t.at)
        if (t.every) { t.at += t.every; if (t.at <= target) t.at = target + t.every } else timers.delete(id)
        run(t.cb, t.args)
      }
      now = target
      if (document.getAnimations) {
        for (const a of document.getAnimations()) {
          if (!a.__vtOwned) { a.__vtOwned = true; a.pause(); continue }
          const end = a.effect && a.effect.getComputedTiming().endTime
          const next = (a.currentTime || 0) + ms
          if (Number.isFinite(end) && next >= end) a.finish(); else a.currentTime = next
        }
      }
      // Only on-screen videos that have already loaded: seeking the rest would
      // force every lazy <video> on the page to spin up a media player.
      for (const v of document.querySelectorAll('video')) {
        const r = v.getBoundingClientRect()
        if (r.bottom < 0 || r.top > innerHeight || r.width === 0 || v.readyState < 2) continue
        if (!v.__vtOwned) { v.__vtOwned = true; v.pause() }
        const t = v.currentTime + ms / 1000
        v.currentTime = v.duration && v.loop ? t % v.duration : t
      }
      const cbs = [...rafs.values()]
      rafs.clear()
      for (const cb of cbs) run(cb, [now])
      return now
    },
  }
})()`

const ease = (t) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2)

// Render at 1x. Raw CDP captures come back at CSS size whatever the ratio, so 2x
// only doubles GPU work; a fractional ratio breaks the site's WebGL icons; and a
// scaled clip resizes the page mid-capture. The home window shows the video at
// ~1580px at most, so 1680 source pixels are enough — ffmpeg scales to 1920x1200.
const DSF = Number(process.env.DSF || 1)
// Requests to drop, e.g. BLOCK=player.vimeo.com,vimeocdn.com — for captures where
// a heavy embed is off-screen and only costs CPU (video decode) and memory.
const BLOCK = (process.env.BLOCK || '').split(',').filter(Boolean)
const FRAME_TIMEOUT_MS = 40000

let browser = null
const shutdown = async (code, why) => {
  if (why) console.log(why)
  if (browser) await browser.close().catch(() => {})
  process.exit(code)
}
process.on('SIGINT', () => shutdown(130, 'interrupted'))
process.on('SIGTERM', () => shutdown(143, 'terminated'))

const withTimeout = (p, ms, what) => Promise.race([p, new Promise((_, rej) => setTimeout(() => rej(new Error(`${what} timeout`)), ms))])

;(async () => {
  const dir = path.join(__dirname, 'vframes', `${name}-${Date.now()}`)
  fs.mkdirSync(dir, { recursive: true })
  fs.mkdirSync(OUT, { recursive: true })
  browser = await chromium.launch({
    channel: 'chromium',
    headless: true,
    args: ['--autoplay-policy=no-user-gesture-required', '--disable-extensions', '--renderer-process-limit=2', '--disable-background-networking'],
  })
  const ctx = await browser.newContext({ viewport: { width: VW, height: VH }, deviceScaleFactor: DSF })
  if (BLOCK.length) await ctx.route((u) => BLOCK.some((b) => u.href.includes(b)), (r) => r.abort())
  await ctx.addInitScript(VIRTUAL_TIME)
  // No scrollbar in the frame. It is an overlay on this platform, so it fades
  // in while a plan scrolls and out again after — which is why it is in some
  // recordings and not others, and why it was missed until four of them were
  // measured. The capture is a picture of the site, not of the browser, and
  // the bar is the browser. `shots.cjs` hides its own furniture (cookie
  // banners, chat widgets) for the same reason; this is that, for video.
  //
  // An init script rather than `addStyleTag`: the style has to be there for
  // the very first painted frame, and a tag added after `goto` is not.
  await ctx.addInitScript(`addEventListener('DOMContentLoaded', () => {
    const s = document.createElement('style')
    s.textContent = '::-webkit-scrollbar { display: none !important } html { scrollbar-width: none !important }'
    document.documentElement.appendChild(s)
  })`)
  // CURSOR=1 draws a pointer that follows the mouse; screenshots have none.
  if (process.env.CURSOR) await ctx.addInitScript(`addEventListener('DOMContentLoaded', () => {
    const c = document.createElement('div')
    c.style.cssText = 'position:fixed;left:0;top:0;width:24px;height:24px;z-index:2147483647;pointer-events:none;transform:translate(-100px,-100px)'
    c.innerHTML = '<svg width="24" height="24" viewBox="0 0 22 22"><path d="M3 2 L3 18 L7.5 13.8 L10.6 20.5 L13.4 19.2 L10.4 12.6 L16.5 12.6 Z" fill="#fff" stroke="#000" stroke-width="1.2" stroke-linejoin="round"/></svg>'
    document.documentElement.appendChild(c)
    addEventListener('mousemove', (e) => { c.style.transform = 'translate(' + e.clientX + 'px,' + e.clientY + 'px)' }, { passive: true, capture: true })
  })`)
  const page = await ctx.newPage()
  // Raw CDP capture: page.screenshot() waits for the page to settle, which a
  // frozen clock never does.
  const cdp = await ctx.newCDPSession(page)
  page.on('crash', () => shutdown(1, 'RENDERER CRASH'))
  // The clock stays at 0 while the page loads and hydrates. In real time that
  // takes a few hundred ms; with a clock advanced per screenshot it would span
  // many frames, and a remount mid-animation replays the loader. `load` itself
  // never fires under a frozen clock, so hold for a fixed real-time window.
  await page.goto(url, { waitUntil: 'domcontentloaded' })
  await new Promise((r) => setTimeout(r, Number(process.env.HOLD_MS || 4000)))

  const total = Math.round(Number(seconds) * FPS)
  const dt = 1000 / FPS
  const t0 = Date.now()
  // A frame still loading (a Vimeo embed, say) never resolves evaluate, so each
  // step is capped; the main frame must succeed, iframes may be skipped.
  // The main frame gets longer: a step can run a first WebGL render, and shader
  // compilation alone can take over a second.
  const stepIn = (f, ms = 1000) => withTimeout(f.evaluate((d) => window.__vt && window.__vt.step(d), dt), ms, 'step')

  let phase = ''
  let mouse = plan.find((s) => s.start)?.start || [VW / 2, VH / 2]
  await page.mouse.move(mouse[0], mouse[1])
  for (let i = 0; i < total; i++) {
    const t = i / FPS
    await withTimeout((async () => {
      // Scripted mouse moves, eased; hover states follow the real pointer.
      for (const s of plan) {
        if (!s.mouse || t < s.at || t > s.at + s.dur + 1 / FPS) continue
        if (s.__from === undefined) s.__from = [...mouse]
        const p = ease(Math.min(1, (t - s.at) / s.dur))
        mouse = [s.__from[0] + (s.mouse[0] - s.__from[0]) * p, s.__from[1] + (s.mouse[1] - s.__from[1]) * p]
        await page.mouse.move(mouse[0], mouse[1])
      }
      // Scripted scroll, eased, applied before the frame's clock step.
      for (const s of plan) {
        if (s.scroll === undefined || t < s.at || t > s.at + s.dur + 1 / FPS) continue
        if (s.__from === undefined) s.__from = await page.evaluate(() => scrollY)
        const p = Math.min(1, (t - s.at) / s.dur)
        const y = s.__from + (s.scroll - s.__from) * ease(p)
        await page.evaluate((y) => window.scrollTo({ top: y, behavior: 'instant' }), y)
      }
      phase = 'step'
      await stepIn(page.mainFrame(), 15000)
      phase = 'iframes'
      await Promise.all(page.frames().filter((f) => f !== page.mainFrame()).map((f) => stepIn(f).catch(() => {})))
      phase = 'screenshot'
      const { data } = await cdp.send('Page.captureScreenshot', { format: 'jpeg', quality: 92, optimizeForSpeed: true })
      phase = 'write'
      fs.writeFileSync(path.join(dir, `${String(i).padStart(6, '0')}.jpg`), Buffer.from(data, 'base64'))
    })(), FRAME_TIMEOUT_MS, `frame ${i}`).catch((e) => shutdown(1, `ABORT: ${e.message} during ${phase} — browser closed`))
    if (i % 60 === 0) console.log(`frame ${i}/${total} (${((Date.now() - t0) / 1000).toFixed(0)}s)`)
  }
  await browser.close()
  browser = null

  // Encode gently: capped threads so the machine stays usable.
  const mp4 = path.join(OUT, `${name}.mp4`)
  const webm = path.join(OUT, `${name}.webm`)
  const ff = (args) => execFileSync('nice', ['-n', '15', 'ffmpeg', '-y', '-loglevel', 'error', '-threads', '4', ...args])
  // `veryslow` spends encode time, not quality: at the same CRF the picture is
  // the same and the file comes out 10-20% smaller. The frames are deleted
  // below, so this is the only encode that ever sees a lossless source.
  ff(['-framerate', String(FPS), '-i', path.join(dir, '%06d.jpg'), '-vf', 'scale=1920:1200:flags=lanczos,format=yuv420p', '-c:v', 'libx264', '-preset', 'veryslow', '-crf', '18', '-movflags', '+faststart', mp4])
  ff(['-i', mp4, '-c:v', 'libvpx-vp9', '-crf', '32', '-b:v', '0', '-row-mt', '1', '-cpu-used', '4', webm])
  fs.rmSync(dir, { recursive: true, force: true })
  console.log(`done ${mp4} (${total} frames in ${((Date.now() - t0) / 1000).toFixed(0)}s)`)
})().catch((e) => shutdown(1, `ERROR: ${e.message} — browser closed`))
