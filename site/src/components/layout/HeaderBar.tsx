'use client'

import { useEffect, useRef, useState } from 'react'
import { usePathname } from 'next/navigation'
import { Grid, GridItem } from '@/components/layout/Grid'
import { MobileMenu } from '@/components/layout/MobileMenu'
import { COMMIT_COUNT } from '@/lib/build-info'

/**
 * The four labels the Figma header carries. `contact` targets the footer,
 * which is mounted globally in `app/layout.tsx` and carries `id="contact"` —
 * so the link resolves on every page, including this one.
 */
const MENU = [
  { label: 'intro', href: '/' },
  { label: 'about', href: '/about' },
  { label: 'experience', href: '/experience' },
  { label: 'contact', href: '#contact' },
] as const

/** Caio's local time. Rendered only after mount — the server has no timezone. */
function LocalClock() {
  const [time, setTime] = useState<string | null>(null)

  useEffect(() => {
    const tick = () =>
      setTime(
        new Intl.DateTimeFormat('en-GB', {
          hour: '2-digit',
          minute: '2-digit',
          timeZone: 'America/Sao_Paulo',
        }).format(new Date())
      )
    tick()
    const id = setInterval(tick, 30_000)
    return () => clearInterval(id)
  }, [])

  return (
    <span suppressHydrationWarning>{time ? `${time} (UTC-3)` : '(UTC-3)'}</span>
  )
}

/**
 * Publishes the bar's own height to `--header-h` so the home hero can size its
 * frame to "the viewport minus the header".
 *
 * Measured rather than assumed: from `md` up the slots rewrap with width, so
 * the bar is 144px at 1440 but 185px at 800 — no constant covers the range.
 * globals.css keeps constants for the pre-hydration paint; this supersedes
 * them as soon as the bar is in the DOM.
 */
function usePublishHeight() {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const apply = () =>
      document.documentElement.style.setProperty('--header-h', `${el.offsetHeight}px`)
    const ro = new ResizeObserver(apply)
    ro.observe(el)
    apply()
    return () => ro.disconnect()
  }, [])

  return ref
}

/**
 * HeaderBar — the site's header / navigation bar, per Figma `Home — V2 (DS)`
 * (node 1126:4609). One bar for every page, and now literally one: it is
 * mounted once in `app/layout.tsx`, not by each page.
 *
 * `sticky` rather than `fixed` on purpose. Fixed would leave the flow, and
 * every hero that used to host the bar would need to reserve its height back
 * — six places, each with its own spacing. Sticky keeps the space it always
 * occupied, and its containing block is the whole page wrapper, so it holds
 * from the top of any route to the point the footer takes over.
 *
 * Six slots on the 12-column grid — 3 / 1 / 2 / 2 / 1 / 3 — which puts the menu
 * on column 7 as the design marks it. Transparent by design: the surface behind
 * it supplies the background.
 *
 * `pointer-events-auto` sits on the nav rather than the bar, so a transparent
 * bar laid over scrolling content still lets clicks through everywhere except
 * the links themselves.
 */
export function HeaderBar() {
  const pathname = usePathname()
  const ref = usePublishHeight()

  return (
    <Grid
      ref={ref}
      role="banner"
      className="pointer-events-none sticky top-0 z-50 pt-8 md:pt-10 lg:pt-12 font-mono text-[12px] font-semibold leading-[1.2] tracking-[1.2px] text-text-secondary"
    >
      {/* ── Mobile form — two lines and a button ──
           Six slots on a 4-column grid stacked into four rows and 262px of
           header, a third of a phone screen. Below `md` only the welcome and
           the availability stay on the bar; the menu, the location and the
           freelancer label move into the panel, and the version stamp is
           dropped. From `md` up the six slots fit one row (3/1/2/2/1/3) and
           nothing here applies. */}
      <GridItem mobileSpan={4} className="md:hidden">
        <div className="flex items-start justify-between gap-4">
          <div className="opacity-50">
            <p>Welcome to caioogata portfolio</p>
            <p className="mt-1">{'<> Available October 2026'}</p>
          </div>
          <MobileMenu menu={MENU} pathname={pathname} clock={<LocalClock />} />
        </div>
      </GridItem>

      <GridItem mobileSpan={4} tabletSpan={3} span={3} className="hidden opacity-50 md:block">
        Welcome to caioogata portfolio
      </GridItem>

      <GridItem mobileSpan={2} tabletSpan={1} span={1} className="hidden opacity-50 whitespace-nowrap md:block">
        V2.0.{COMMIT_COUNT}
      </GridItem>

      <GridItem mobileSpan={2} tabletSpan={2} span={2} className="hidden opacity-50 md:block">
        <p>Porto Alegre, Brazil</p>
        <p>
          <LocalClock />
        </p>
      </GridItem>

      {/* Column 7 — the menu, per the design */}
      <GridItem mobileSpan={4} tabletSpan={2} span={2} className="hidden md:block">
        <nav aria-label="Sections" className="pointer-events-auto">
          <ul className="flex flex-col gap-1 font-sans text-[14px] leading-[1.5] tracking-normal">
            {MENU.map(({ label, href }) => {
              const current = href.startsWith('/') && pathname === href
              return (
                <li key={label}>
                  <a
                    href={href}
                    aria-current={current ? 'page' : undefined}
                    className={`transition-opacity duration-300 hover:opacity-100 ${current ? 'opacity-100' : 'opacity-70'}`}
                  >
                    {label}
                  </a>
                </li>
              )
            })}
          </ul>
        </nav>
      </GridItem>

      <GridItem mobileSpan={2} tabletSpan={1} span={1} className="hidden opacity-50 md:block">
        <p>Worldwide</p>
        <p>Freelancer</p>
      </GridItem>

      <GridItem
        mobileSpan={2}
        tabletSpan={3}
        span={3}
        className="hidden opacity-50 text-right md:block md:whitespace-nowrap"
      >
        {'<> Available October 2026'}
      </GridItem>
    </Grid>
  )
}
