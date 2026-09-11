'use client'

import { useEffect, useState } from 'react'
import { useInView } from '@/hooks/useInView'
import { Grid, GridItem } from '@/components/layout/Grid'
import { COMMIT_COUNT } from '@/lib/build-info'

const MENU = ['intro', 'about', 'experience', 'contact'] as const

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

export function IntroSection() {
  const welcomeRef = useInView({ threshold: 0.1, once: true })
  const headlineRef = useInView({ threshold: 0.1, once: true })

  // Fixed and transparent so the project list scrolls behind it.
  // pointer-events-none lets clicks reach the cards underneath; the menu
  // re-enables them on itself.
  return (
    <div className="pointer-events-none fixed inset-x-0 top-0 z-20 flex h-[var(--height-hero)] flex-col">
      {/* ── Header bar — 3 / 1 / 4 / 2 / 2 across the 12-col grid ── */}
      <Grid
        ref={welcomeRef as React.RefObject<HTMLDivElement>}
        role="banner"
        className="-entrance -fade -a-0 pt-8 md:pt-10 lg:pt-12 font-mono text-[12px] font-semibold leading-[1.2] tracking-[1.2px] text-text-secondary"
      >
        <GridItem mobileSpan={4} tabletSpan={4} span={3} className="opacity-50">
          Welcome to caioogata portfolio
        </GridItem>

        <GridItem mobileSpan={2} tabletSpan={1} span={1} className="opacity-50 whitespace-nowrap">
          V2.0.{COMMIT_COUNT}
        </GridItem>

        <GridItem mobileSpan={2} tabletSpan={3} span={4} className="opacity-50">
          <p>Porto Alegre, Brazil</p>
          <p>
            <LocalClock />
          </p>
        </GridItem>

        {/* Column 9 — the menu, per the design */}
        <GridItem mobileSpan={4} tabletSpan={4} span={2} start={9}>
          <nav aria-label="Sections" className="pointer-events-auto">
            <ul className="flex flex-col gap-1 font-sans text-[14px] leading-[1.5] tracking-normal">
              {MENU.map((item) => (
                <li key={item}>
                  <a
                    href={`#${item}`}
                    className="opacity-70 transition-opacity duration-300 hover:opacity-100"
                  >
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        </GridItem>

        <GridItem mobileSpan={4} tabletSpan={4} span={2} className="opacity-50 whitespace-nowrap">
          {'<> Available October 2026'}
        </GridItem>
      </Grid>

      {/* ── Variable spacer — absorbs hero min-height ── */}
      <div className="flex-1" aria-hidden />

      {/* ── Headline — 8 columns ── */}
      <Grid
        ref={headlineRef as React.RefObject<HTMLDivElement>}
        className="-entrance -slide-up -a-2 pb-8 md:pb-10 lg:pb-12"
      >
        <GridItem mobileSpan={4} tabletSpan={8} span={8}>
          <h1
            className="text-text-primary"
            style={{
              fontFamily: 'var(--font-sans)',
              fontSize: 'clamp(2.25rem, 5vw, 4.5rem)',
              fontWeight: 400,
              lineHeight: 1.15,
              letterSpacing: '-0.02em',
            }}
          >
            <span className="block">Creative Designer</span>
            <span className="block">who learned to build.</span>
          </h1>
        </GridItem>
      </Grid>
    </div>
  )
}
