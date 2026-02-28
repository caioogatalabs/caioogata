'use client'

import { useLanguage } from '@/components/providers/LanguageProvider'
import { useNavigation } from '@/components/providers/NavigationProvider'
import CopyDropdown from '@/components/hero/CopyDropdown'
import { AsciiScrambleLogo } from '@/components/ui/AsciiScrambleLogo'

export default function IntroCompact() {
  const { content } = useLanguage()
  const { setActiveSection } = useNavigation()

  return (
    <section className="border-2 border-primary rounded-base px-4 md:px-6 py-4 md:py-5 w-full">
      <div className="flex flex-wrap items-center justify-between gap-4">
        {/* Logo - compacto, clicável para voltar à intro */}
        <button
          type="button"
          onClick={() => setActiveSection(null)}
          className="flex-shrink-0 focus:outline-none p-0 border-0 bg-transparent cursor-pointer"
          aria-label="Voltar ao início"
        >
          <AsciiScrambleLogo />
        </button>

        {/* Botão Ask about Caio */}
        <div className="flex-shrink-0">
          <CopyDropdown variant="filled" buttonLabel={content.firstVisit.optionMeetAI} />
        </div>
      </div>
    </section>
  )
}
