'use client'

import { useLanguage } from '@/components/providers/LanguageProvider'
import CopyDropdown from '@/components/hero/CopyDropdown'
import { PixelRevealLogo } from '@/components/ui/PixelRevealLogo'
import { LOGO_PATHS } from '@/lib/logo-paths'
import packageJson from '../../../package.json'

export default function Intro() {
  const { language, setLanguage, content } = useLanguage()
  const commitCount = process.env.NEXT_PUBLIC_GIT_COMMIT_COUNT
  const version = commitCount ? `${packageJson.version}.${commitCount}` : packageJson.version

  return (
    <div className="relative">
      {/* Welcome + version à esquerda; seletor de idiomas à direita */}
      <div className="mb-2 flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1 min-h-[1.5rem] px-6">
        <div className="flex items-baseline gap-2">
          <span className="text-sm font-mono text-primary">{content.footer.tagline}</span>
          <span className="text-sm font-mono text-secondary">v{version}</span>
        </div>
        <div className="flex items-center gap-3" role="group" aria-label="Language selection">
          <button
            onClick={() => setLanguage('en')}
            className="font-mono text-sm transition-colors focus:outline-none text-neutral-300 hover:text-primary"
            aria-pressed={language === 'en'}
            aria-label="Switch to English"
          >
            {language === 'en' && <span className="mr-1">&gt;</span>}EN
          </button>
          <button
            onClick={() => setLanguage('pt-br')}
            className="font-mono text-sm transition-colors focus:outline-none text-neutral-300 hover:text-primary"
            aria-pressed={language === 'pt-br'}
            aria-label="Mudar para Portugues"
          >
            {language === 'pt-br' && <span className="mr-1">&gt;</span>}PT
          </button>
        </div>
      </div>

      {/* Box: logo | Design Director | botão */}
      <section className="border-2 border-primary rounded-base p-6 w-full">
        <div className="grid grid-cols-1 md:grid-cols-[120px_3fr_2fr] gap-6 items-center">
          <div className="w-[120px] h-[55px] flex-shrink-0">
            <PixelRevealLogo
              paths={LOGO_PATHS}
              width={440}
              height={200}
              displayWidth={120}
              displayHeight={55}
              pixelSize={20}
              color="var(--color-primary)"
              animationDuration={1.5}
            />
          </div>
          <p className="text-base font-mono text-neutral-300">
            {content.hero.tagline}
          </p>
          <div className="flex flex-col items-start md:items-end justify-center">
            <CopyDropdown variant="filled" buttonLabel={content.firstVisit.optionMeetAI} />
          </div>
        </div>
      </section>
    </div>
  )
}
