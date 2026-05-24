'use client'

import Image from 'next/image'
import { useLanguage } from '@/components/providers/LanguageProvider'
import SectionHeading from '@/components/ui/SectionHeading'

type LogoEntry = { src: string; imgClass?: string }

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

export default function Clients() {
  const { content } = useLanguage()

  return (
    <section id="clients" aria-labelledby="clients-heading">
      <SectionHeading id="clients-heading">
        {content.clients.heading}
      </SectionHeading>

      <p className="text-sm text-neutral-300 font-mono leading-relaxed mb-6">
        {content.clients.description}
      </p>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2 sm:gap-3">
        {content.clients.list.map((client) => {
          const logo = CLIENT_LOGOS[client]
          return (
            <div
              key={client}
              className="border border-dotted border-secondary/30 rounded-base p-4 min-h-[90px] flex items-center justify-center bg-[var(--bg-neutral)]"
            >
              {logo ? (
                <Image
                  src={logo.src}
                  alt={client}
                  width={120}
                  height={48}
                  className={`w-full object-contain max-w-[108px] max-h-[44px]${logo.imgClass ? ` ${logo.imgClass}` : ''}`}
                  unoptimized
                />
              ) : (
                <span className="text-sm font-mono text-secondary/70 text-center">
                  {client}
                </span>
              )}
            </div>
          )
        })}
      </div>
    </section>
  )
}
