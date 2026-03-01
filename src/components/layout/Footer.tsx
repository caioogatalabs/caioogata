'use client'

import { useLanguage } from '@/components/providers/LanguageProvider'

function NextJsIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M18.665 21.978C16.758 23.255 14.465 24 12 24 5.377 24 0 18.623 0 12S5.377 0 12 0s12 5.377 12 12c0 3.583-1.574 6.801-4.067 9.001L9.219 7.2H7.2v9.596h1.615V9.251l9.85 12.727Zm-3.332-8.533 1.6 2.061V7.2h-1.6v6.245Z" />
    </svg>
  )
}

function TailwindIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M12.001 4.8c-3.2 0-5.2 1.6-6 4.8 1.2-1.6 2.6-2.2 4.2-1.8.913.228 1.565.89 2.288 1.624C13.666 10.618 15.027 12 18.001 12c3.2 0 5.2-1.6 6-4.8-1.2 1.6-2.6 2.2-4.2 1.8-.913-.228-1.565-.89-2.288-1.624C16.337 6.182 14.976 4.8 12.001 4.8zM6.001 12c-3.2 0-5.2 1.6-6 4.8 1.2-1.6 2.6-2.2 4.2-1.8.913.228 1.565.89 2.288 1.624C7.666 18.018 9.027 19.4 12.001 19.4c3.2 0 5.2-1.6 6-4.8-1.2 1.6-2.6 2.2-4.2 1.8-.913-.228-1.565-.89-2.288-1.624C10.337 13.382 8.976 12 6.001 12z" />
    </svg>
  )
}

function CursorIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M11.503.131 1.891 5.678a.84.84 0 0 0-.42.726v11.188c0 .3.162.575.42.724l9.609 5.55a1 1 0 0 0 .998 0l9.61-5.55a.84.84 0 0 0 .42-.724V6.404a.84.84 0 0 0-.42-.726L12.497.131a1.01 1.01 0 0 0-.996 0M2.657 6.338h18.55c.263 0 .43.287.297.515L12.23 22.918c-.062.107-.229.064-.229-.06V12.335a.59.59 0 0 0-.295-.51l-9.11-5.257c-.109-.063-.064-.23.061-.23" />
    </svg>
  )
}

function AnthropicIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M17.304 3.541h-3.672l6.696 16.918H24Zm-10.608 0L0 20.459h3.744l1.37-3.553h7.005l1.37 3.553h3.744L10.536 3.541Zm-.371 10.223 2.291-5.946 2.291 5.946Z" />
    </svg>
  )
}

export default function Footer() {
  const { content, language } = useLanguage()
  const iconClass = 'w-3.5 h-3.5 inline-block align-middle shrink-0'
  const builtWith = language === 'en' ? 'Built with' : 'Desenvolvido com'
  const and = language === 'en' ? 'and' : 'e'

  return (
    <footer className="bg-neutral">
      <div className="max-w-content mx-0 px-6 md:px-12 lg:px-16 py-12 md:py-16 w-full">
        <div className="pl-6">
          <div
            className="font-mono text-neutral-300 text-sm mb-6 w-full overflow-hidden whitespace-nowrap"
            aria-hidden="true"
          >
            {'//'.repeat(200)}
          </div>
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-8">
            <div>
              <p className="text-sm text-neutral-400">
                &copy; {content.footer.copyright}
              </p>
              <p className="text-sm text-neutral-300 font-mono mt-2 flex flex-wrap items-center gap-x-1.5 gap-y-1">
                <span>{builtWith}</span>
                <NextJsIcon className={iconClass} />
                <span>Next.js,</span>
                <TailwindIcon className={iconClass} />
                <span>Tailwind CSS,</span>
                <CursorIcon className={iconClass} />
                <span>Cursor {and}</span>
                <AnthropicIcon className={iconClass} />
                <span>Claude Code.</span>
              </p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
