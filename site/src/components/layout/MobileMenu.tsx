'use client'

import { useEffect, useRef, useState } from 'react'
import { getLenis } from '@/components/layout/SmoothScroll'
import { LanguageSwitch } from '@/components/layout/LanguageSwitch'
import { useLanguage } from '@/components/providers/LanguageProvider'

interface MobileMenuProps {
  menu: readonly { label: string; href: string }[]
  pathname: string
  /** The header's clock, passed in so this component owns no data of its own. */
  clock: React.ReactNode
}

/**
 * The header's mobile form: a button, and a full-screen panel holding what the
 * bar cannot fit under `md`.
 *
 * Only the welcome line and the availability line stay on the bar itself. The
 * menu, the location and the freelancer label move in here; the version stamp
 * is dropped outright on mobile.
 */
export function MobileMenu({ menu, pathname, clock }: MobileMenuProps) {
  const [open, setOpen] = useState(false)
  const t = useLanguage().content.ui.header
  const buttonRef = useRef<HTMLButtonElement>(null)
  const panelRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!open) return

    // Lenis drives the scroll itself, so `overflow: hidden` on the body would
    // not hold it — the page would keep moving behind the panel.
    const lenis = getLenis()
    lenis?.stop()

    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false)
    }
    document.addEventListener('keydown', onKey)

    panelRef.current?.focus()

    return () => {
      document.removeEventListener('keydown', onKey)
      lenis?.start()
    }
  }, [open])

  const close = () => {
    setOpen(false)
    buttonRef.current?.focus()
  }

  return (
    <>
      <button
        ref={buttonRef}
        type="button"
        onClick={() => (open ? close() : setOpen(true))}
        aria-expanded={open}
        aria-controls="mobile-menu"
        aria-label={open ? t.closeMenu : t.openMenu}
        // 44px of hit area for a 20px mark: the negative margins pull the box
        // back so the bars still sit optically on the welcome line rather than
        // pushing the header taller.
        className="pointer-events-auto relative z-[60] -mr-3 -mt-3 flex h-11 w-11 shrink-0 flex-col items-center justify-center gap-[5px]"
      >
        <span
          aria-hidden
          className={`block h-px w-5 bg-text-primary transition-transform duration-300 ${
            open ? 'translate-y-[3px] rotate-45' : ''
          }`}
        />
        <span
          aria-hidden
          className={`block h-px w-5 bg-text-primary transition-transform duration-300 ${
            open ? '-translate-y-[3px] -rotate-45' : ''
          }`}
        />
      </button>

      <div
        id="mobile-menu"
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-label={t.menu}
        tabIndex={-1}
        hidden={!open}
        className="pointer-events-auto fixed inset-0 z-50 flex flex-col justify-between bg-bg px-5 pb-10 pt-8 outline-none"
      >
        <nav aria-label={t.sections} className="mt-16">
          <ul
            className="flex flex-col gap-4 text-[28px] leading-[1.2] text-text-primary"
            style={{ fontFamily: 'var(--font-sans)' }}
          >
            {menu.map(({ label, href }) => {
              const current = href.startsWith('/') && pathname === href
              return (
                <li key={label}>
                  <a
                    href={href}
                    onClick={close}
                    aria-current={current ? 'page' : undefined}
                    className={current ? 'opacity-100' : 'opacity-70'}
                  >
                    {label}
                  </a>
                </li>
              )
            })}
          </ul>
        </nav>

        <div className="flex flex-col gap-4 font-mono text-[12px] font-semibold leading-[1.2] tracking-[1.2px] text-text-secondary">
          <div>
            <p className="opacity-50">{t.location}</p>
            <p className="opacity-50">{clock}</p>
            <LanguageSwitch className="mt-1" />
          </div>
          <div className="opacity-50">
            <p>{t.worldwide}</p>
            <p>{t.freelancer}</p>
          </div>
        </div>
      </div>
    </>
  )
}
