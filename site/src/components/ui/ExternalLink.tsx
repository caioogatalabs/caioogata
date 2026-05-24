/**
 * ExternalLink — V2 design-system primitive for outbound links.
 *
 * Pattern: text + diagonal arrow icon. Token-driven colors only:
 * - default: text-text-secondary, arrow at 50% opacity
 * - hover/focus: text-text-primary, arrow at 100% opacity
 *
 * Use this for any external/outbound link surface (project links, contact
 * socials, footer links, etc.) so size, hovers and arrow stay consistent.
 *
 * Sizes:
 * - "md" (default) — 18px / line-height 1.6 — used in dense listings (project info)
 * - "sm" — 16px / line-height 1.5 — used inside compact UI (overlays, footers)
 */

import { forwardRef, type ReactNode } from 'react'

function ExternalLinkIcon({ className }: { className?: string }) {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 14 14"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`shrink-0 translate-y-[1px] ${className ?? ''}`}
      aria-hidden
    >
      <path
        d="M4 1.5H12.5V10M12 2L1.5 12.5"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

export interface ExternalLinkProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  href: string
  children: ReactNode
  size?: 'sm' | 'md'
}

const SIZE_CLASS: Record<NonNullable<ExternalLinkProps['size']>, string> = {
  md: 'text-[18px] leading-[1.6]',
  sm: 'text-base leading-[1.5]',
}

export const ExternalLink = forwardRef<HTMLAnchorElement, ExternalLinkProps>(
  function ExternalLink({ href, children, size = 'md', className = '', ...rest }, ref) {
    return (
      <a
        ref={ref}
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className={`inline-flex items-center gap-2 text-text-secondary hover:text-text-primary focus-visible:text-text-primary transition-colors group ${SIZE_CLASS[size]} ${className}`}
        style={{ fontFamily: 'var(--font-sans)' }}
        {...rest}
      >
        <span>{children}</span>
        <span className="opacity-50 group-hover:opacity-100 group-focus-visible:opacity-100 transition-opacity">
          <ExternalLinkIcon />
        </span>
      </a>
    )
  }
)
