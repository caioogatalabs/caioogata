'use client'

import { useLanguage } from '@/components/providers/LanguageProvider'
import CopyDropdown from '@/components/hero/CopyDropdown'
import { AsciiScrambleLogo } from '@/components/ui/AsciiScrambleLogo'
import { useScramble } from '@/hooks/useScramble'
import InlineToast from '@/components/ui/InlineToast'
import packageJson from '../../../package.json'
import { COMMIT_COUNT } from '@/lib/build-info'

export default function Intro() {
  const { language, setLanguage, content } = useLanguage()
  const version = `${packageJson.version}.${COMMIT_COUNT}`
  const tagline = useScramble(content.hero.tagline)

  return (
    <div className="relative">
      <InlineToast />

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
        <div className="grid grid-cols-1 md:grid-cols-[auto_3fr_2fr] gap-6 items-center">
          <AsciiScrambleLogo />
          <p className="text-base font-mono min-h-[1.5rem]">
            {tagline.chars.map((c, i) => (
              <span key={i} className={c.locked ? 'text-neutral-300' : 'text-neutral-300/25'}>
                {c.char}
              </span>
            ))}
            {!tagline.isComplete && <span className="inline-block w-2 h-4 bg-secondary animate-blink align-middle ml-0.5" aria-hidden />}
          </p>
          <div className="flex flex-col items-start md:items-end justify-center">
            <CopyDropdown variant="filled" buttonLabel={content.firstVisit.optionMeetAI} />
          </div>
        </div>
      </section>
    </div>
  )
}
