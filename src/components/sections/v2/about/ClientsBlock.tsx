'use client'

import Image from 'next/image'
import type { RefObject } from 'react'
import { useInView } from '@/hooks/useInView'
import { Grid, GridItem } from '@/components/layout/Grid'
import { SplitText } from '@/components/motion/SplitText'
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

export function ClientsBlock() {
  const blockRef = useInView({ threshold: 0.1, once: true })
  const items = clientsData.list
  // Wave 1 unconditionally extended Content.clients with shortDescription?: string
  // and both en.json + pt-br.json now contain it. No fallback needed.
  const shortDescription = clientsData.shortDescription as string

  return (
    <div>
      <div
        ref={blockRef as RefObject<HTMLDivElement>}
        className="px-5 md:px-8 lg:px-16 py-16 md:py-24 lg:py-32"
      >
        {/* Description in cols 5-12 — matches BioBlock/SkillsBlock alignment. Logo grid below spans full width. */}
        <Grid className="!px-0 mb-12 md:mb-16">
          {/* Spacer cols 1-4 — hosts the section label */}
          <GridItem span={4} tabletSpan={2} mobileSpan={4}>
            <SplitText
              type="line"
              as="span"
              text="1.3 / Notable Clients"
              className="inline-block font-mono text-xs uppercase tracking-[0.88px] text-text-tertiary"
              durationMs={700}
              baseDelayMs={100}
            />
          </GridItem>
          <GridItem
            span={8}
            tabletSpan={6}
            mobileSpan={4}
            className="lg:col-start-5"
          >
            <SplitText
              type="line"
              text={shortDescription}
              className="text-text-secondary"
              style={{
                fontFamily: 'var(--font-sans)',
                fontSize: '2.25rem',
                lineHeight: 1.25,
                letterSpacing: '-0.36px',
                fontWeight: 700,
              }}
              staggerMs={100}
              durationMs={1000}
              baseDelayMs={150}
            />
          </GridItem>
        </Grid>

        {/* Logo grid: 2 cols mobile, 4 cols desktop. Full content width — NOT nested in a Grid wrapper. */}
        <div className="grid grid-cols-2 lg:grid-cols-4">
          {items.map((client, index) => {
            const logo = CLIENT_LOGOS[client]
            const stagger = Math.min(index, 19)

            return (
              <div
                key={client}
                className={`-entrance -fade -a-${stagger} min-h-[120px] flex items-center justify-center`}
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
