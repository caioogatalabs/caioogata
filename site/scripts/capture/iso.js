// Injected into every page by session.cjs. `window.__iso(el)` hides everything
// but `el` with visibility (layout and behaviour stay live) and keeps overlays
// that frameworks append to <body> visible, e.g. dropdown panels.
;(() => {
  if (window.__iso) return
  const keepOverlays = new MutationObserver((ms) => ms.forEach((m) => m.addedNodes.forEach((n) => {
    if (n.nodeType === 1 && n.parentElement === document.body) n.classList.add('__cap-overlay')
  })))
  window.__iso = (el) => {
    if (!el) throw new Error('iso: no element')
    document.querySelectorAll('.__cap-keep').forEach((n) => n.classList.remove('__cap-keep'))
    el.classList.add('__cap-keep')
    if (!document.getElementById('__cap-iso')) {
      const s = document.createElement('style')
      s.id = '__cap-iso'
      s.textContent = `
        html.__cap body * { visibility: hidden !important }
        html.__cap .__cap-keep, html.__cap .__cap-keep *,
        html.__cap .__cap-overlay, html.__cap .__cap-overlay *,
        html.__cap #__cap_cursor, html.__cap #__cap_cursor * { visibility: visible !important }`
      document.head.appendChild(s)
      keepOverlays.observe(document.body, { childList: true })
    }
    document.documentElement.classList.add('__cap')
    const r = el.getBoundingClientRect()
    return [Math.round(r.x), Math.round(r.y), Math.round(r.width), Math.round(r.height)]
  }
  window.__unIso = () => document.documentElement.classList.remove('__cap')
})()
