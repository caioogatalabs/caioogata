'use client'

import Image from 'next/image'
import { useLanguage } from '@/components/providers/LanguageProvider'

export default function Header() {
  const { language, setLanguage } = useLanguage()

  return (
    <header className="fixed top-0 left-0 right-0 z-40 bg-neutral/90 backdrop-blur-sm border-b border-neutral">
      <div className="max-w-content px-6 md:px-12 lg:px-16 py-4 flex items-center justify-between">
        <a
          href="#"
          className="text-primary hover:text-accent transition-colors"
          aria-label="Caio Ogata - Back to top"
        >
          <svg
            width="88"
            height="40"
            viewBox="0 0 440 200"
            fill="currentColor"
            className="h-8 w-auto"
            aria-hidden="true"
          >
            <path d="M0 8C0 3.58173 3.58172 0 8 0H192C196.418 0 200 3.55615 200 7.97443C200 22.2 200 52.3057 200 72.0094C200 76.4277 196.422 80 192.004 80C183.594 80 173.1 80 165.998 80C161.58 80 158 83.5811 158 87.9994C158 93.5931 158 100 158 100C158 100 158 106.427 158 112.002C158 116.42 161.572 120 165.99 120C173.459 120 184.541 120 192.01 120C196.428 120 200 123.577 200 127.995C200 148.066 200 177.896 200 192.026C200 196.444 196.418 200 192 200H8C3.58173 200 0 196.418 0 192V8Z" />
            <path d="M431 0C435.971 1.80392e-06 440 4.02944 440 9V191C440 195.971 435.971 200 431 200H249C244.029 200 240 195.971 240 191V9C240 4.02944 244.029 1.93277e-07 249 0H431ZM328 80C323.582 80 320 83.5817 320 88V112C320 116.418 323.582 120 328 120H352C356.418 120 360 116.418 360 112V88C360 83.5817 356.418 80 352 80H328Z" />
          </svg>
        </a>

        <div className="flex items-center gap-2" role="group" aria-label="Language selection">
          <button
            onClick={() => setLanguage('en')}
            className={`px-3 py-1.5 rounded-base font-mono text-sm transition-colors ${
              language === 'en'
                ? 'bg-primary text-neutral-950'
                : 'bg-transparent text-neutral-400 hover:text-neutral-200'
            }`}
            aria-pressed={language === 'en'}
            aria-label="Switch to English"
          >
            EN
          </button>
          <button
            onClick={() => setLanguage('pt-br')}
            className={`px-3 py-1.5 rounded-base font-mono text-sm transition-colors ${
              language === 'pt-br'
                ? 'bg-primary text-neutral-950'
                : 'bg-transparent text-neutral-400 hover:text-neutral-200'
            }`}
            aria-pressed={language === 'pt-br'}
            aria-label="Mudar para Portugues"
          >
            PT
          </button>
        </div>
      </div>
    </header>
  )
}
