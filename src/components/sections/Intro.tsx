'use client'

import { useLanguage } from '@/components/providers/LanguageProvider'
import CopyDropdown from '@/components/hero/CopyDropdown'
import { PixelRevealLogo } from '@/components/ui/PixelRevealLogo'
import { LOGO_PATHS } from '@/lib/logo-paths'
import packageJson from '../../../package.json'

export default function Intro() {
  const { language, setLanguage, content } = useLanguage()
  const version = packageJson.version

  return (
    <div className="relative">
      {/* Version above outline */}
      <div className="mb-2">
        <span className="text-xs font-mono text-neutral-400">v{version}</span>
      </div>

      <section className="border-2 border-primary/30 rounded-base px-6 md:px-12 lg:px-16 py-8 md:py-12 w-full">
        <div className="grid md:grid-cols-[2fr_1fr] gap-8 md:gap-12">
            {/* Left Column - Logo and Text */}
            <div className="space-y-6">
              {/* Logo — pixel-reveal animation, fixed 120×55 */}
              <div className="flex justify-start w-[120px] h-[55px] flex-shrink-0">
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

              {/* Text Content */}
              <div className="space-y-3">
                <p className="text-base text-secondary leading-relaxed">
                  {content.footer.tagline}
                </p>
                <p className="text-base text-neutral-400 font-mono">
                  {content.hero.tagline}
                </p>
              </div>
            </div>

            {/* Right Column - Tips and Buttons */}
            <div className="flex flex-col gap-4">
              {/* Tips Text */}
              <p className="text-sm font-mono text-neutral-400">
                {content.intro.tips}
              </p>

              {/* CTA Button - Dropdown */}
              <div>
                <CopyDropdown />
              </div>

              {/* Language Buttons */}
              <div className="flex items-center gap-2" role="group" aria-label="Language selection">
                <button
                  onClick={() => setLanguage('en')}
                  className={`px-3 py-1.5 rounded-base font-mono text-sm transition-colors border border-primary/30 ${
                    language === 'en'
                      ? 'border-primary text-primary bg-primary/10'
                      : 'text-secondary hover:border-primary hover:text-primary hover:bg-primary/10'
                  }`}
                  aria-pressed={language === 'en'}
                  aria-label="Switch to English"
                >
                  EN
                </button>
                <button
                  onClick={() => setLanguage('pt-br')}
                  className={`px-3 py-1.5 rounded-base font-mono text-sm transition-colors border border-primary/30 ${
                    language === 'pt-br'
                      ? 'border-primary text-primary bg-primary/10'
                      : 'text-secondary hover:border-primary hover:text-primary hover:bg-primary/10'
                  }`}
                  aria-pressed={language === 'pt-br'}
                  aria-label="Mudar para Portugues"
                >
                  PT
                </button>
              </div>
            </div>
          </div>
      </section>
    </div>
  )
}
