'use client'

interface StatsCardProps {
  value: string
  label: string
  ariaLabel?: string
}

/**
 * Single big-number card for the /experience hero.
 *
 * 72px display value (Fabio XM, regular) over a 1px divider over a
 * 36px bold label (Fabio XM, bold). Width auto — fills its column span
 * via the parent grid.
 *
 * Tokens only: `border-border-secondary`, `text-text-primary`,
 * `text-text-secondary`. Sharp corners are not appropriate here per the
 * spec (`rounded-[8px]`).
 */
export function StatsCard({ value, label, ariaLabel }: StatsCardProps) {
  return (
    <div
      role="group"
      aria-label={ariaLabel}
      className="border border-border-secondary rounded-[8px] p-5"
    >
      <p
        className="text-text-primary"
        style={{
          fontFamily: 'var(--font-sans)',
          fontSize: '72px',
          lineHeight: 1.15,
          letterSpacing: '-1.44px',
          fontWeight: 400,
        }}
      >
        {value}
      </p>
      <div className="h-px w-full bg-border-secondary my-2" />
      <p
        className="text-text-secondary"
        style={{
          fontFamily: 'var(--font-sans)',
          fontSize: '36px',
          fontWeight: 700,
          lineHeight: 1.25,
          letterSpacing: '-0.36px',
        }}
      >
        {label}
      </p>
    </div>
  )
}
