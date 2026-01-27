'use client'

import { useLanguage } from '@/components/providers/LanguageProvider'

export default function Footer() {
  const { content } = useLanguage()

  return (
    <footer className="border-t border-neutral bg-neutral">
      <div className="max-w-content mx-0 px-6 md:px-12 lg:px-16 py-12 md:py-16 w-full">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-8">
          <div>
            <p className="text-sm text-neutral-400">
              &copy; {content.footer.copyright}
            </p>
          </div>
        </div>
      </div>
    </footer>
  )
}
