'use client'

import { useEffect, useState } from 'react'
import { usePathname } from 'next/navigation'
import { Grid, GridItem } from '@/components/layout/Grid'
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

interface HeaderBarProps {
  /**
   * Stick to the top of the scroll container. Internal pages set this; the home
   * page leaves it off because its hero is already fixed and positions the bar
   * itself.
   */
  sticky?: boolean
  className?: string
  ref?: React.Ref<HTMLDivElement>
}

/**
 * HeaderBar — the site's header / navigation bar, per Figma `Home — V2 (DS)`
 * (node 1126:4609). One bar for every page: it replaced the per-page logo +
 * `ask about` pill (`StickyLogoBar`) so the home and the internal pages share
 * a single header.
 *
 * Six slots on the 12-column grid — 3 / 1 / 2 / 2 / 1 / 3 — which puts the menu
 * on column 7 as the design marks it. Transparent by design: the surface behind
 * it supplies the background.
 *
 * `pointer-events-auto` sits on the nav rather than the bar, so a transparent
 * bar laid over scrolling content still lets clicks through everywhere except
 * the links themselves.
 */
export function HeaderBar({ sticky = false, className = '', ref }: HeaderBarProps) {
  const pathname = usePathname()

  return (
    <Grid
      ref={ref}
      role="banner"
      className={`${sticky ? 'pointer-events-none sticky top-0 z-50' : ''} pt-8 md:pt-10 lg:pt-12 font-mono text-[12px] font-semibold leading-[1.2] tracking-[1.2px] text-text-secondary ${className}`.trim()}
    >
      <GridItem mobileSpan={4} tabletSpan={3} span={3} className="opacity-50">
        Welcome to caioogata portfolio
      </GridItem>

      <GridItem mobileSpan={2} tabletSpan={1} span={1} className="opacity-50 whitespace-nowrap">
        V2.0.{COMMIT_COUNT}
      </GridItem>

      <GridItem mobileSpan={2} tabletSpan={2} span={2} className="opacity-50">
        <p>Porto Alegre, Brazil</p>
        <p>
          <LocalClock />
        </p>
      </GridItem>

      {/* Column 7 — the menu, per the design */}
      <GridItem mobileSpan={4} tabletSpan={2} span={2}>
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

      <GridItem mobileSpan={2} tabletSpan={1} span={1} className="opacity-50">
        <p>Worldwide</p>
        <p>Freelancer</p>
      </GridItem>

      <GridItem
        mobileSpan={2}
        tabletSpan={3}
        span={3}
        className="opacity-50 text-right md:whitespace-nowrap"
      >
        {'<> Available October 2026'}
      </GridItem>
    </Grid>
  )
}
