'use client'

import { StatsCard } from './StatsCard'

interface StatsCardsProps {
  progress: number
  stats: { value: string; label: string }[]
  isMobile: boolean
}

// Per-card initial Y in vh from sticky-container top
const INITIAL_Y_VH = [30, 50, 70]
// All cards converge to this Y at progress = 0.7
const ALIGNMENT_Y_VH = 15
// Exit translate target
const EXIT_Y_VH = -30

// Phase boundaries (must mirror spec table)
const ENTRY_END = 0.6
const CONVERGE_END = 0.7
const HOLD_END = 0.85
const EXIT_END = 1.0

// Static class maps — NEVER dynamic Tailwind template literals.
// Mobile branch (col-span-4) is unused; mobile renders via the isMobile
// early-return path below.
const COL_CLASSES = [
  'col-span-4 md:col-start-3 md:col-span-2 lg:col-start-4 lg:col-span-3',
  'col-span-4 md:col-start-5 md:col-span-2 lg:col-start-7 lg:col-span-3',
  'col-span-4 md:col-start-7 md:col-span-2 lg:col-start-10 lg:col-span-3',
] as const

const STAGGER_CLASSES = ['-a-0', '-a-1', '-a-2'] as const

const ARIA_LABELS = [
  '15 plus years of design engineering practice',
  '6 companies across the career',
  '2 executive roles',
] as const

/**
 * Cubic ease-out approximation for cubic-bezier(0.16, 1, 0.3, 1).
 *
 * The spec calls for that fiddle/Pexel curve over the convergence segment
 * (last 1/7 of the trip). Over such a short range a closed-form cubic
 * ease-out is visually indistinguishable: `1 - (1 - t)^3`.
 */
function easeOutCubic(t: number): number {
  return 1 - Math.pow(1 - t, 3)
}

/**
 * Computes a single card's translateY (vh) and opacity from progress.
 *
 * Phases:
 *   Entry        (0     → 0.6)  : linear, covers 6/7 of trip toward 15vh.
 *   Convergence  (0.6   → 0.7)  : eased final 1/7 — locks at 15vh.
 *   Hold         (0.7   → 0.85) : stays at 15vh, opacity 1.
 *   Exit         (0.85  → 1.0)  : translates to -30vh, opacity 1 → 0
 *                                  (all three cards together).
 */
function computeCardState(
  progress: number,
  initialY: number
): { y: number; opacity: number } {
  const totalDistance = ALIGNMENT_Y_VH - initialY
  const entryFraction = 6 / 7
  const entryDistance = totalDistance * entryFraction

  if (progress <= 0) {
    return { y: initialY, opacity: 1 }
  }

  if (progress < ENTRY_END) {
    // Entry: linear, covers 6/7 of distance
    const t = progress / ENTRY_END
    return { y: initialY + entryDistance * t, opacity: 1 }
  }

  if (progress < CONVERGE_END) {
    // Convergence: eased remaining 1/7
    const t = (progress - ENTRY_END) / (CONVERGE_END - ENTRY_END)
    const eased = easeOutCubic(t)
    const startY = initialY + entryDistance
    return { y: startY + (ALIGNMENT_Y_VH - startY) * eased, opacity: 1 }
  }

  if (progress < HOLD_END) {
    // Hold: locked at alignment
    return { y: ALIGNMENT_Y_VH, opacity: 1 }
  }

  if (progress < EXIT_END) {
    // Exit: 15vh → -30vh, opacity 1 → 0
    const t = (progress - HOLD_END) / (EXIT_END - HOLD_END)
    return {
      y: ALIGNMENT_Y_VH + (EXIT_Y_VH - ALIGNMENT_Y_VH) * t,
      opacity: 1 - t,
    }
  }

  // Past exit
  return { y: EXIT_Y_VH, opacity: 0 }
}

/**
 * Trio of progress-driven StatsCards. Renders inside the parent
 * ExperienceHero 12-col grid; each card occupies one of three column
 * slots (cols 4-6 / 7-9 / 10-12 on desktop).
 *
 * On mobile (`isMobile`) the cards render full-width with the standard
 * `-entrance -slide-up -a-{i}` stagger system — no scroll-driven motion.
 */
export function StatsCards({ progress, stats, isMobile }: StatsCardsProps) {
  if (isMobile) {
    return (
      <>
        {stats.map((stat, i) => (
          <div
            key={i}
            className={`${COL_CLASSES[i]} z-10 -entrance -slide-up ${STAGGER_CLASSES[i]}`}
          >
            <StatsCard
              value={stat.value}
              label={stat.label}
              ariaLabel={ARIA_LABELS[i] ?? `${stat.value} ${stat.label}`}
            />
          </div>
        ))}
      </>
    )
  }

  return (
    <>
      {stats.map((stat, i) => {
        const { y, opacity } = computeCardState(
          progress,
          INITIAL_Y_VH[i] ?? 30
        )
        return (
          <div
            key={i}
            className={`${COL_CLASSES[i]} lg:row-start-1 z-10`}
            style={{
              transform: `translateY(${y}vh)`,
              opacity,
            }}
          >
            <StatsCard
              value={stat.value}
              label={stat.label}
              ariaLabel={ARIA_LABELS[i] ?? `${stat.value} ${stat.label}`}
            />
          </div>
        )
      })}
    </>
  )
}
