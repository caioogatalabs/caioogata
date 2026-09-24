'use client'

import Link from 'next/link'
import { useLanguage } from '@/components/providers/LanguageProvider'

export default function NotFound() {
  const { content, localize } = useLanguage()
  const t = content.ui.notFound

  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-4 p-6 font-mono text-neutral-200">
      <p className="text-lg">{t.message}</p>
      <Link
        href={localize('/')}
        className="text-[var(--color-primary)] underline focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:ring-offset-2 focus:ring-offset-[var(--bg-neutral)] rounded"
      >
        {t.back}
      </Link>
    </div>
  )
}
