'use client'

interface SectionDividerProps {
  /** Section code, e.g. "1.1" */
  code: string
  /** Section label, e.g. "Bio" */
  label: string
}

/**
 * Horizontal rule divider with left-aligned section code + label.
 * Used to introduce numbered subsections inside /about (1.1 / Bio, 1.2 / Skills, etc).
 * Typography mirrors the IntroSection Welcome Bar (mono, small, uppercase, text-text-tertiary).
 */
export function SectionDivider({ code, label }: SectionDividerProps) {
  return (
    <div className="px-5 md:px-8 lg:px-16">
      <div className="border-t border-border-secondary pt-4 pb-2">
        <span className="font-mono text-xs uppercase tracking-[0.88px] text-text-tertiary">
          {code} / {label}
        </span>
      </div>
    </div>
  )
}
