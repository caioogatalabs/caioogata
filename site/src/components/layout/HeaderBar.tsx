'use client'

import { useEffect, useRef, useState } from 'react'
import { usePathname } from 'next/navigation'
import { Grid, GridItem } from '@/components/layout/Grid'
import { MobileMenu } from '@/components/layout/MobileMenu'
import { LanguageSwitch } from '@/components/layout/LanguageSwitch'
import { ThemeSwitch } from '@/components/layout/ThemeSwitch'
import { useLanguage } from '@/components/providers/LanguageProvider'
import { COMMIT_COUNT } from '@/lib/build-info'
import { CopyEmail } from '@/components/ui/CopyEmail'

/**
 * The labels the header carries. `contact` targets the footer, which is
 * mounted globally in `app/layout.tsx` and carries `id="contact"` — so the
 * link resolves on every page, including this one.
 *
 * `work` points at the home project list for now (`ProjectsGrid` carries
 * `id="projects"`); the standalone `/projects` route exists but the list on
 * the home is the current front of the work. Swap the href when that changes.
 */
const MENU = [
  { key: 'menuIntro', href: '/' },
  { key: 'menuWork', href: '/#projects' },
  { key: 'menuAbout', href: '/about' },
  { key: 'menuExperience', href: '/experience' },
  { key: 'menuContact', href: '#contact' },
] as const

/** Caio's local time. Rendered only after mount — the server has no timezone. */
/** Availability, with the blinking square: hover hints and a click copies the email. */
function Availability({ className = '' }: { className?: string }) {
  const { ui } = useLanguage().content
  return (
    <CopyEmail
      square
      copyLabel={ui.footer.copyEmail}
      copiedLabel={ui.footer.emailCopied}
      className={className}
      labelClassName="opacity-50 transition-opacity duration-300 hover:opacity-100"
    >
      {ui.header.available}
    </CopyEmail>
  )
}

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
 * Publishes two numbers the rest of the page needs.
 *
 * `--header-h` is the bar's own height, so the home hero can size its frame to
 * "the viewport minus the header". Measured rather than assumed: from `md` up
 * the slots rewrap with width, so the bar is 144px at 1440 but 185px at 800 —
 * no constant covers the range. globals.css keeps constants for the
 * pre-hydration paint; this supersedes them once the bar is in the DOM.
 *
 * `--sticky-top` is where pinned content below has to start so the header does
 * not cover it — the same height while the bar is pinned, and 0 where it is
 * not. `PageNavigation` reads it. Without that, its `sticky top-0` put it at
 * exactly the coordinate the header occupies, and the z-50 bar hid the z-40
 * strip on every route that has one.
 */
function usePublishMetrics(stickyTop: boolean) {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const apply = () => {
      const root = document.documentElement.style
      root.setProperty('--header-h', `${el.offsetHeight}px`)
      root.setProperty('--sticky-top', stickyTop ? `${el.offsetHeight}px` : '0px')
    }
    const ro = new ResizeObserver(apply)
    ro.observe(el)
    apply()
    return () => ro.disconnect()
  }, [stickyTop])

  return ref
}

/**
 * True once the project navigation strip has climbed to the top of an open
 * project page — the moment the header hands it the place.
 *
 * The header watches the strip rather than the strip telling the header: the
 * rule ("the site bar yields here") belongs to the bar, and this keeps
 * PageNavigation a plain strip that five routes share without knowing why.
 */
function useYieldToProjectNav(active: boolean) {
  const [yielded, setYielded] = useState(false)

  useEffect(() => {
    if (!active) {
      setYielded(false)
      return
    }

    let ticking = false
    const check = () => {
      ticking = false
      const nav = document.querySelector('nav[aria-label="Page navigation"]')
      if (nav) setYielded(nav.getBoundingClientRect().top <= 1)
    }
    const onScroll = () => {
      if (!ticking) {
        ticking = true
        requestAnimationFrame(check)
      }
    }

    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll, { passive: true })
    check()

    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
    }
  }, [active])

  return yielded
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
 *
 * `-contrast-blend` (globals.css) is what keeps it readable over whatever
 * scrolls beneath: white type differenced against the backdrop, so it comes
 * out light on a dark cover and dark on a light one. It has to sit on the bar
 * and not on the slots — the bar is `sticky z-50`, which is a stacking
 * context, and a blend inside one can only see that context's own group, which
 * here is empty. On the bar it blends against the page wrapper instead, which
 * is where the content is. That is also why `MobileMenu` renders its panel in
 * a portal: an opaque full-screen surface under a blended ancestor would be
 * differenced along with the type.
 */
export function HeaderBar() {
  const pathname = usePathname()

  // `/projects` itself is an index, not a project, so only a slug counts.
  const isOpenProject = /^\/projects\/[^/]+$/.test(pathname)

  // On an open project the bar holds the top until the project navigation
  // reaches it, then steps aside and lets that strip have the place. Elsewhere
  // the strip pins below the bar instead, which is what `--sticky-top` carries.
  const ref = usePublishMetrics(!isOpenProject)
  const yielded = useYieldToProjectNav(isOpenProject)

  const t = useLanguage().content.ui.header
  const menu = MENU.map(({ key, href }) => ({ label: t[key], href }))

  return (
    <Grid
      ref={ref}
      role="banner"
      className={`-contrast-blend pointer-events-none sticky top-0 z-50 pt-8 md:pt-10 lg:pt-12 font-mono text-[12px] font-semibold leading-[1.2] tracking-[1.2px] text-text-secondary transition-[transform,opacity] duration-300 ${
        yielded ? '-translate-y-full opacity-0' : ''
      }`}
    >
      {/* ── Mobile form — two lines and a button ──
           Six slots on a 4-column grid stacked into four rows and 262px of
           header, a third of a phone screen. Below `lg` only the welcome and
           the availability stay on the bar; the menu, the location and the
           freelancer label move into the panel, and the version stamp is
           dropped. From `lg` up the six slots fit one row (3/1/2/2/1/3) and
           nothing here applies.
           The switch is at `lg`, not `md`: on a tablet held upright the six
           slots do fit, but the nav lands in two of eight columns and breaks
           its four links into four stacked lines. */}
      <GridItem mobileSpan={4} tabletSpan={8} className="lg:hidden">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="opacity-50">{t.welcome}</p>
            <Availability className="mt-1" />
          </div>
          <MobileMenu menu={menu} pathname={pathname} clock={<LocalClock />} />
        </div>
      </GridItem>

      <GridItem mobileSpan={4} tabletSpan={3} span={3} className="hidden opacity-50 lg:block">
        {t.welcome}
      </GridItem>

      <GridItem mobileSpan={2} tabletSpan={1} span={1} className="hidden opacity-50 whitespace-nowrap lg:block">
        V2.0.{COMMIT_COUNT}
      </GridItem>

      {/* Location, clock, and the language switch under them — the switch
          carries its own opacity so the active language can read at full. */}
      <GridItem mobileSpan={2} tabletSpan={2} span={2} className="hidden lg:block">
        <p className="opacity-50">{t.location}</p>
        <p className="opacity-50">
          <LocalClock />
        </p>
        <LanguageSwitch className="mt-1" />
        <ThemeSwitch />
      </GridItem>

      {/* Column 7 — the menu, per the design */}
      <GridItem mobileSpan={4} tabletSpan={2} span={2} className="hidden lg:block">
        <nav aria-label={t.sections} className="pointer-events-auto">
          <ul className="flex flex-col gap-1 font-sans text-[14px] leading-[1.5] tracking-normal">
            {menu.map(({ label, href }) => {
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

      <GridItem mobileSpan={2} tabletSpan={1} span={1} className="hidden opacity-50 lg:block">
        <p>{t.worldwide}</p>
        <p>{t.freelancer}</p>
      </GridItem>

      <GridItem
        mobileSpan={2}
        tabletSpan={3}
        span={3}
        className="hidden text-right lg:block lg:whitespace-nowrap"
      >
        <Availability />
      </GridItem>
    </Grid>
  )
}
