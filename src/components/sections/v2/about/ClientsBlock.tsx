'use client'

import Image from 'next/image'
import type { RefObject } from 'react'
import { useInView } from '@/hooks/useInView'
import { Grid, GridItem } from '@/components/layout/Grid'
import { SectionDivider } from './SectionDivider'
import content from '@/content/en.json'
import type { Content } from '@/content/types'

const typedContent = content as unknown as Content
const clientsData = typedContent.clients

type LogoEntry = { src: string; imgClass?: string }

/**
 * Client logo SVG map. Copied verbatim from V1 src/components/sections/Clients.tsx.
 * Do NOT import from V1 — V1 must remain self-contained for the v1.caioogata.com deploy.
 */
const CLIENT_LOGOS: Record<string, LogoEntry> = {
  'Petrobras':   { src: '/clients/petrobras.svg' },
  'O Boticário': { src: '/clients/o-boticario.svg', imgClass: 'max-w-[130px]' },
  'Tramontina':  { src: '/clients/tramontina.svg' },
  'Sicredi':     { src: '/clients/sicredi.svg' },
  'Aché Group':  { src: '/clients/ache-group.svg' },
  'Itaú':        { src: '/clients/itau.svg' },
  'Caixa':       { src: '/clients/caixa.svg' },
  'Lacta':       { src: '/clients/lacta.svg' },
  'LG':          { src: '/clients/lg.svg', imgClass: 'max-h-[32px] max-w-[72px]' },
  'Novartis':    { src: '/clients/novartis.svg' },
  'Fila':        { src: '/clients/fila.svg' },
  'Netshoes':    { src: '/clients/netshoes.svg' },
  'Magalu':      { src: '/clients/magalu.svg' },
  'Exame':       { src: '/clients/exame.svg' },
  'Dafiti':      { src: '/clients/dafiti.svg' },
  'RocketChat':  { src: '/clients/rocketchat.svg' },
}

/**
 * Static border-class lookup, one entry per cell in the 16-cell logo grid.
 * Encodes responsive table dividers:
 *   Mobile (2 cols, 8 rows): `border-r` on col 0; `border-t` on rows >= 1 (index >= 2).
 *   Desktop (4 cols, 4 rows): `lg:border-r` on cols 0/1/2; `lg:border-t` on rows >= 1 (index >= 4).
 *   Mobile decisions are overridden at `lg:` for cells where desktop disagrees.
 * The color token `border-border-secondary` is on every cell so any active border picks it up.
 *
 * No dynamic class concatenation: every entry is a literal string so Tailwind's JIT
 * picks all utility classes up at build time.
 */
const CELL_BORDERS: string[] = [
  // Desktop row 0 / Mobile rows 0-1
  'border-border-secondary border-r lg:border-r',                                          // 0  m: c0 r0 → r;        d: c0 r0 → r
  'border-border-secondary lg:border-r',                                                   // 1  m: c1 r0 → -;        d: c1 r0 → r
  'border-border-secondary border-r border-t lg:border-r lg:border-t-0',                   // 2  m: c0 r1 → r,t;      d: c2 r0 → r, no t
  'border-border-secondary border-t lg:border-r-0 lg:border-t-0',                          // 3  m: c1 r1 → t;        d: c3 r0 → no r, no t
  // Desktop row 1 / Mobile rows 2-3
  'border-border-secondary border-r border-t lg:border-r lg:border-t',                    // 4  m: c0 r2 → r,t;      d: c0 r1 → r,t
  'border-border-secondary border-t lg:border-r lg:border-t',                             // 5  m: c1 r2 → t;        d: c1 r1 → r,t
  'border-border-secondary border-r border-t lg:border-r lg:border-t',                    // 6  m: c0 r3 → r,t;      d: c2 r1 → r,t
  'border-border-secondary border-t lg:border-r-0 lg:border-t',                           // 7  m: c1 r3 → t;        d: c3 r1 → no r, t
  // Desktop row 2 / Mobile rows 4-5
  'border-border-secondary border-r border-t lg:border-r lg:border-t',                    // 8  m: c0 r4 → r,t;      d: c0 r2 → r,t
  'border-border-secondary border-t lg:border-r lg:border-t',                             // 9  m: c1 r4 → t;        d: c1 r2 → r,t
  'border-border-secondary border-r border-t lg:border-r lg:border-t',                    // 10 m: c0 r5 → r,t;      d: c2 r2 → r,t
  'border-border-secondary border-t lg:border-r-0 lg:border-t',                           // 11 m: c1 r5 → t;        d: c3 r2 → no r, t
  // Desktop row 3 / Mobile rows 6-7
  'border-border-secondary border-r border-t lg:border-r lg:border-t',                    // 12 m: c0 r6 → r,t;      d: c0 r3 → r,t
  'border-border-secondary border-t lg:border-r lg:border-t',                             // 13 m: c1 r6 → t;        d: c1 r3 → r,t
  'border-border-secondary border-r border-t lg:border-r lg:border-t',                    // 14 m: c0 r7 → r,t;      d: c2 r3 → r,t
  'border-border-secondary border-t lg:border-r-0 lg:border-t',                           // 15 m: c1 r7 → t;        d: c3 r3 → no r, t
]

export function ClientsBlock() {
  const blockRef = useInView({ threshold: 0.1, once: true })
  const items = clientsData.list
  // Wave 1 unconditionally extended Content.clients with shortDescription?: string
  // and both en.json + pt-br.json now contain it. No fallback needed.
  const shortDescription = clientsData.shortDescription as string

  return (
    <div>
      <SectionDivider code="1.3" label="Notable Clients" />

      <div
        ref={blockRef as RefObject<HTMLDivElement>}
        className="px-5 md:px-8 lg:px-16 py-16 md:py-24 lg:py-32"
      >
        {/* Description in right 6-col only (W5: deliberate — the logo grid below spans full width) */}
        <Grid className="!px-0 mb-12 md:mb-16">
          <GridItem span={6} tabletSpan={2} mobileSpan={4} />
          <GridItem span={6} tabletSpan={6} mobileSpan={4}>
            <p
              className="-entrance -slide-up -a-0 text-[20px] md:text-[24px] leading-[1.4] text-text-secondary"
              style={{ fontFamily: 'var(--font-sans)' }}
            >
              {shortDescription}
            </p>
          </GridItem>
        </Grid>

        {/* Logo grid: 2 cols mobile, 4 cols desktop. Full content width — NOT nested in a Grid wrapper. */}
        <div className="grid grid-cols-2 lg:grid-cols-4">
          {items.map((client, index) => {
            const logo = CLIENT_LOGOS[client]
            const stagger = Math.min(index, 19)
            const borderClass = CELL_BORDERS[index] ?? ''

            return (
              <div
                key={client}
                className={`-entrance -fade -a-${stagger} min-h-[120px] flex items-center justify-center ${borderClass}`}
              >
                {logo ? (
                  <Image
                    src={logo.src}
                    alt={client}
                    width={120}
                    height={48}
                    className={`object-contain max-h-[44px] max-w-[108px]${logo.imgClass ? ` ${logo.imgClass}` : ''}`}
                    unoptimized
                  />
                ) : (
                  <span
                    className="font-mono text-xs text-text-tertiary text-center"
                    style={{ fontFamily: 'var(--font-mono)' }}
                  >
                    {client}
                  </span>
                )}
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
