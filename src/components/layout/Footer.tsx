'use client'

import { useLanguage } from '@/components/providers/LanguageProvider'

function TailwindIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 54 33"
      fill="currentColor"
      aria-hidden
    >
      <path d="M27 0c-5.4 0-9.9 2.2-13.5 6.6 2.7-3.4 5.9-4.7 8.6-4.7 1.9 0 3.4.6 4.5 1.8 2.3-2.3 5.1-3.5 8.4-3.5 4.3 0 7.8 2.2 10.5 6.6-3.6-4.4-8.1-6.6-13.5-6.6-5.4 0-9.9 2.2-13.5 6.6 2.7-3.4 5.9-4.7 8.6-4.7 1.9 0 3.4.6 4.5 1.8 2.3-2.3 5.1-3.5 8.4-3.5 4.3 0 7.8 2.2 10.5 6.6-3.6-4.4-8.1-6.6-13.5-6.6zM13.5 16.5c2.7-3.4 5.9-4.7 8.6-4.7 1.9 0 3.4.6 4.5 1.8 2.3-2.3 5.1-3.5 8.4-3.5 4.3 0 7.8 2.2 10.5 6.6-3.6-4.4-8.1-6.6-13.5-6.6-5.4 0-9.9 2.2-13.5 6.6 2.7-3.4 5.9-4.7 8.6-4.7 1.9 0 3.4.6 4.5 1.8 2.3-2.3 5.1-3.5 8.4-3.5 4.3 0 7.8 2.2 10.5 6.6-3.6-4.4-8.1-6.6-13.5-6.6zM40.5 16.5c2.7-3.4 5.9-4.7 8.6-4.7 1.9 0 3.4.6 4.5 1.8 2.3-2.3 5.1-3.5 8.4-3.5 4.3 0 7.8 2.2 10.5 6.6-3.6-4.4-8.1-6.6-13.5-6.6-5.4 0-9.9 2.2-13.5 6.6 2.7-3.4 5.9-4.7 8.6-4.7 1.9 0 3.4.6 4.5 1.8 2.3-2.3 5.1-3.5 8.4-3.5 4.3 0 7.8 2.2 10.5 6.6-3.6-4.4-8.1-6.6-13.5-6.6z" />
    </svg>
  )
}

function CursorIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden
    >
      <path d="M12 2L10.59 3.41 16.17 9H3v2h13.17l-5.58 5.59L12 18l8-8-8-8z" />
    </svg>
  )
}

function AntiGravityIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z" />
      <line x1="4" y1="22" x2="4" y2="15" />
    </svg>
  )
}

export default function Footer() {
  const { content } = useLanguage()
  const iconClass = 'w-4 h-4 inline-block align-middle text-neutral-500'

  return (
    <footer className="border-t border-neutral bg-neutral">
      <div className="max-w-content mx-0 px-6 md:px-12 lg:px-16 py-12 md:py-16 w-full">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-8">
          <div>
            <p className="text-sm text-neutral-400">
              &copy; {content.footer.copyright}
            </p>
            <p className="text-sm text-neutral-500 font-mono mt-2 flex flex-wrap items-center gap-x-1 gap-y-1">
              <span>{content.footer.poweredByPrefix}</span>
              <TailwindIcon className={iconClass} />
              <span> {content.footer.poweredByTailwindLabel}</span>
              <span>{content.footer.poweredBySuffix}</span>
              <CursorIcon className={iconClass} />
              <AntiGravityIcon className={iconClass} />
            </p>
          </div>
        </div>
      </div>
    </footer>
  )
}
