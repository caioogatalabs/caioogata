'use client'

import { useInView } from '@/hooks/useInView'

const TECH_TAGS = ['Next.js', 'React', 'Tailwind', 'Vercel']

/**
 * FooterSection — bottom-of-page bar:
 * - Tech tag pills + © stamp (left)
 *
 * The Contact trigger is now the FloatingContactButton (mounted at app/layout
 * root). This footer no longer owns any contact-form CTA — that surface is
 * handled exclusively by the FAB so the open/close button stays in the same
 * spatial position on the screen.
 */
export function FooterSection() {
  const sectionRef = useInView({ threshold: 0.1 })

  return (
    <footer
      ref={sectionRef as React.RefObject<HTMLElement>}
      aria-label="Footer"
      data-section-id="footer"
      className="-entrance -slide-up -a-0 px-5 md:px-8 lg:px-16 pt-32 md:pt-40 pb-8"
    >
      <div className="flex items-center gap-3 flex-wrap">
        {TECH_TAGS.map((tag) => (
          <span
            key={tag}
            className="inline-flex items-center justify-center border border-border-primary text-xs text-text-secondary font-mono px-3 py-1.5 rounded-[12px]"
          >
            {tag}
          </span>
        ))}
        <span className="text-xs text-text-tertiary font-mono">
          &copy; 2026 Caio Ogata
        </span>
      </div>
    </footer>
  )
}
