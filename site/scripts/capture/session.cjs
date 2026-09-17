// Interactive capture session: a visible Chromium at 1680x1050 (16:10) @2x that
// stays open for manual use (log in, navigate) and takes commands from files
// dropped in ./queue. Results are appended to ./session.log.
//
//   OUT_DIR=<dir> START_URL=<url> node session.cjs      (run in background)
//   echo "shot hero" > queue/001                         then read session.log
//
//   goto <url>            navigate
//   shot <name>           viewport screenshot -> png at 2x + webp 1920x1200
//   rec <name>            start real-time recording (CDP screencast)
//   stop                  stop recording -> mp4 + webm 1920x1200
//   cursor on|off         draw a cursor overlay that follows the mouse
//   eval <js>             run JS in the page, log the result
//   move <x> <y>          move the real mouse (CSS px) — hover states
//   click <x> <y>         real click
//   type <text>           real keystrokes into the focused field
//   press <key>           one key, e.g. Escape, Enter, ArrowDown
//
// Real-time recording is uneven (frame timing jitters, frames arrive at 1x) —
// use it for rough takes; vcap.cjs or native screen recording for finals.
// The visible window costs ~2 GB RAM and constant CPU on animated sites: close
// it (kill the process) as soon as the capture is done.
const { chromium } = require('playwright')
const fs = require('fs')
const path = require('path')
const { execFileSync } = require('child_process')

const HERE = __dirname
const QUEUE = path.join(HERE, 'queue')
const LOG = path.join(HERE, 'session.log')
const OUT = process.env.OUT_DIR
const START_URL = process.env.START_URL
const VW = Number(process.env.VW || 1680)
const VH = Number(process.env.VH || 1050)

fs.mkdirSync(QUEUE, { recursive: true })
fs.mkdirSync(OUT, { recursive: true })
const log = (msg) => fs.appendFileSync(LOG, `[${new Date().toISOString().slice(11, 19)}] ${msg}\n`)

const CURSOR_SCRIPT = `
  (() => {
    if (window.__capCursorInstalled) return
    window.__capCursorInstalled = true
    const mount = () => {
      const c = document.createElement('div')
      c.id = '__cap_cursor'
      c.style.cssText = 'position:fixed;left:0;top:0;width:22px;height:22px;z-index:2147483647;pointer-events:none;display:none;transform:translate(-100px,-100px);'
      c.innerHTML = '<svg width="22" height="22" viewBox="0 0 22 22"><path d="M3 2 L3 18 L7.5 13.8 L10.6 20.5 L13.4 19.2 L10.4 12.6 L16.5 12.6 Z" fill="#000" stroke="#fff" stroke-width="1.4" stroke-linejoin="round"/></svg>'
      document.documentElement.appendChild(c)
      addEventListener('mousemove', (e) => { c.style.transform = 'translate(' + e.clientX + 'px,' + e.clientY + 'px)' }, { passive: true })
      const sync = () => { c.style.display = sessionStorage.getItem('__capCursor') === '1' ? 'block' : 'none' }
      window.__capCursorSync = sync
      sync()
    }
    if (document.documentElement) mount(); else addEventListener('DOMContentLoaded', mount)
  })()
`

;(async () => {
  const ctx = await chromium.launchPersistentContext(path.join(HERE, 'profile'), {
        headless: false,
    viewport: { width: VW, height: VH },
    deviceScaleFactor: 2,
    args: ['--window-position=80,60'],
  })
  await ctx.addInitScript(CURSOR_SCRIPT)
  let page = ctx.pages()[0] || (await ctx.newPage())
  ctx.on('page', (p) => { page = p; log(`new tab is now active: ${p.url()}`) })
  if (START_URL) await page.goto(START_URL).catch((e) => log(`goto failed: ${e.message}`))
  log(`ready (${page.url()})`)

  let rec = null

  const commands = {
    async goto(url) { await page.goto(url); return page.url() },

    async shot(name) {
      const png = path.join(OUT, `${name}.png`)
      const webp = path.join(OUT, `${name}.webp`)
      await page.screenshot({ path: png })
      execFileSync('cwebp', ['-quiet', '-q', '90', '-resize', '1920', '1200', png, '-o', webp])
      return `${webp}`
    },

    async rec(name) {
      if (rec) throw new Error(`already recording "${rec.name}"`)
      const dir = path.join(HERE, 'frames', `${name}-${Date.now()}`)
      fs.mkdirSync(dir, { recursive: true })
      const cdp = await ctx.newCDPSession(page)
      const frames = []
      cdp.on('Page.screencastFrame', async ({ data, metadata, sessionId }) => {
        const file = path.join(dir, `${String(frames.length).padStart(6, '0')}.jpg`)
        fs.writeFileSync(file, Buffer.from(data, 'base64'))
        frames.push({ file, t: metadata.timestamp })
        cdp.send('Page.screencastFrameAck', { sessionId }).catch(() => {})
      })
      await cdp.send('Page.startScreencast', { format: 'jpeg', quality: 95, maxWidth: VW * 2, maxHeight: VH * 2, everyNthFrame: 1 })
      rec = { name, dir, cdp, frames, started: Date.now() / 1000 }
      return `recording "${name}"`
    },

    async stop() {
      if (!rec) throw new Error('not recording')
      const { name, dir, cdp, frames, started } = rec
      rec = null
      await cdp.send('Page.stopScreencast').catch(() => {})
      await cdp.detach().catch(() => {})
      const ended = Date.now() / 1000
      if (!frames.length) throw new Error('no frames captured')
      // Screencast only emits a frame when the page repaints, so each frame is
      // held until the next one arrives; the concat list carries those durations.
      const lines = frames.map((f, i) => {
        const next = i + 1 < frames.length ? frames[i + 1].t : ended
        return `file '${f.file}'\nduration ${Math.max(0.001, next - f.t).toFixed(4)}`
      })
      lines.push(`file '${frames[frames.length - 1].file}'`)
      const list = path.join(dir, 'list.txt')
      fs.writeFileSync(list, lines.join('\n'))
      const vf = 'scale=1920:1200:flags=lanczos,fps=60,format=yuv420p'
      const mp4 = path.join(OUT, `${name}.mp4`)
      const webm = path.join(OUT, `${name}.webm`)
      execFileSync('ffmpeg', ['-y', '-loglevel', 'error', '-f', 'concat', '-safe', '0', '-i', list, '-vf', vf, '-c:v', 'libx264', '-preset', 'slow', '-crf', '16', '-movflags', '+faststart', mp4])
      execFileSync('ffmpeg', ['-y', '-loglevel', 'error', '-i', mp4, '-c:v', 'libvpx-vp9', '-crf', '30', '-b:v', '0', '-row-mt', '1', webm])
      return `${mp4} (${frames.length} frames, ${(ended - started).toFixed(1)}s)`
    },

    async cursor(state) {
      const on = state === 'on'
      await page.evaluate((v) => { sessionStorage.setItem('__capCursor', v ? '1' : '0'); window.__capCursorSync && window.__capCursorSync() }, on)
      return `cursor ${on ? 'on' : 'off'}`
    },

    async eval(js) { return JSON.stringify(await page.evaluate(js)) },

    // Real input, for states page scripts can't fake: chart hover tooltips,
    // autocomplete that listens to keystrokes, overlays that close on a real click.
    async move(args) { const [x, y] = args.split(' ').map(Number); await page.mouse.move(x, y, { steps: 8 }); return `mouse ${x},${y}` },
    async click(args) { const [x, y] = args.split(' ').map(Number); await page.mouse.click(x, y); return `click ${x},${y}` },
    async type(text) { await page.keyboard.type(text, { delay: 60 }); return `typed "${text}"` },
    async press(key) { await page.keyboard.press(key); return `pressed ${key}` },
  }

  // One command at a time, in order — `stop` must never overlap `rec`.
  let running = false
  setInterval(async () => {
    if (running) return
    running = true
    for (const f of fs.readdirSync(QUEUE).sort()) {
      const full = path.join(QUEUE, f)
      const line = fs.readFileSync(full, 'utf8').trim()
      fs.unlinkSync(full)
      const [cmd, ...rest] = line.split(' ')
      try {
        if (!commands[cmd]) throw new Error(`unknown command "${cmd}"`)
        log(`${line} -> ${await commands[cmd](rest.join(' '))}`)
      } catch (e) {
        log(`${line} -> ERROR ${e.message}`)
      }
    }
    running = false
  }, 250)

  ctx.on('close', () => { log('browser closed'); process.exit(0) })
})()
