'use client'

import { motion, useInView } from 'motion/react'
import { createElement, useRef, type CSSProperties } from 'react'

const FIDDLE_EASE = [0.16, 1, 0.3, 1] as const

type SupportedTag = 'p' | 'span' | 'div' | 'h1' | 'h2' | 'h3' | 'h4'

interface SharedProps {
  text: string
  className?: string
  style?: CSSProperties
  staggerMs?: number
  durationMs?: number
  baseDelayMs?: number
  once?: boolean
  amount?: number
  /** Wrapper element. Default `p`. Use `span` for inline contexts, `h3` for headings, etc. */
  as?: SupportedTag
}

interface SplitTextProps extends SharedProps {
  type?: 'word' | 'line'
}

/**
 * Text reveal that fires when the container scrolls into view.
 *
 * - `type="word"`: each word fades in with a small lift, staggered. Matches motion.dev's
 *   React Split Text reference. Use for body text and inline copy.
 * - `type="line"`: the whole text block fades in with a small lift, all at once (no
 *   per-line stagger). Use for hero / display copy where a single deliberate beat reads
 *   better than a multi-line "assembly" cadence.
 *
 * Reveal trigger: Motion's `useInView` with `amount` controlling how much of the element
 * must be in viewport. Default 0.1 means animation fires as the text enters the viewport
 * (visible to the user, not after it has fully settled in view).
 */
export function SplitText({ type = 'word', ...rest }: SplitTextProps) {
  return type === 'line' ? <SplitLines {...rest} /> : <SplitWords {...rest} />
}

function SplitWords({
  text,
  className,
  style,
  staggerMs = 30,
  durationMs = 600,
  baseDelayMs = 80,
  once = true,
  amount = 0.1,
  as = 'p',
}: SharedProps) {
  const ref = useRef<HTMLElement>(null)
  const isInView = useInView(ref, { once, amount })
  const tokens = text.split(/(\s+)/)

  let visibleIndex = 0
  const children = tokens.map((tok, i) => {
    if (tok.length === 0) return null
    if (/^\s+$/.test(tok)) return <span key={i}>{tok}</span>
    const idx = visibleIndex++
    return (
      // Fade + small lift — matches motion.dev's React Split Text reference.
      // No mask: avoids the "rises from below" feel and keeps baseline natural.
      <motion.span
        key={i}
        style={{ display: 'inline-block', willChange: 'transform, opacity' }}
        initial={{ opacity: 0, y: '0.3em' }}
        animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: '0.3em' }}
        transition={{
          delay: (baseDelayMs + idx * staggerMs) / 1000,
          duration: durationMs / 1000,
          ease: FIDDLE_EASE,
        }}
      >
        {tok}
      </motion.span>
    )
  })

  return createElement(as, { ref, className, style }, children)
}

function SplitLines({
  text,
  className,
  style,
  durationMs = 800,
  baseDelayMs = 120,
  once = true,
  amount = 0.1,
  as = 'p',
}: SharedProps) {
  const ref = useRef<HTMLElement>(null)
  const isInView = useInView(ref, { once, amount })

  // Whole-block fade + small lift — no per-line splitting, no mask.
  // Long lines no longer feel "assembled" left-to-right; the whole paragraph
  // settles in one beat. Natural text wrap and `text-indent` behave normally.
  return createElement(
    as,
    { ref, className, style },
    <motion.span
      style={{ display: 'block', willChange: 'transform, opacity' }}
      initial={{ opacity: 0, y: '0.4em' }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: '0.4em' }}
      transition={{
        delay: baseDelayMs / 1000,
        duration: durationMs / 1000,
        ease: FIDDLE_EASE,
      }}
    >
      {text}
    </motion.span>
  )
}
