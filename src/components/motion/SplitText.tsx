'use client'

import { motion, useInView } from 'motion/react'
import {
  createElement,
  useLayoutEffect,
  useRef,
  useState,
  type CSSProperties,
} from 'react'

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
 * Split text reveal that fires when the container scrolls into view.
 *
 * - `type="word"`: each word fades in with a small lift (no mask). Matches motion.dev's
 *   React Split Text reference. Use for body text and inline copy.
 * - `type="line"`: detects line breaks after layout, then translates each line from below
 *   a per-line mask. Use for hero text and large display copy where the mask reveal reads
 *   as a deliberate editorial gesture.
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
  staggerMs = 100,
  durationMs = 900,
  baseDelayMs = 100,
  once = true,
  amount = 0.1,
  as = 'p',
}: SharedProps) {
  const ref = useRef<HTMLElement>(null)
  const [lines, setLines] = useState<string[] | null>(null)
  const isInView = useInView(ref, { once, amount })

  useLayoutEffect(() => {
    const measure = () => {
      const el = ref.current
      if (!el || !el.parentElement) return

      // Clone the rendered element shallow — inherits class + inline style, so all
      // CSS rules (font-feature-settings, font-variation-settings, etc) match exactly.
      // Re-apply the ORIGINAL `textIndent` from the prop, since the rendered element
      // may have had it stripped (we move first-line indent to padding-left below).
      const measurer = el.cloneNode(false) as HTMLElement
      measurer.style.position = 'absolute'
      measurer.style.visibility = 'hidden'
      measurer.style.pointerEvents = 'none'
      measurer.style.top = '0'
      measurer.style.left = '0'
      measurer.style.width = `${el.offsetWidth}px`
      measurer.style.opacity = '1'
      if (style?.textIndent !== undefined) {
        measurer.style.textIndent = String(style.textIndent)
      }

      const words = text.split(/\s+/).filter(Boolean)
      const wordSpans: HTMLSpanElement[] = []
      words.forEach((word, i) => {
        const span = document.createElement('span')
        span.textContent = word
        // Use natural inline (no inline-block) so wrap behaviour matches the
        // original `<p>` flow exactly — no inline-block whitespace quirks.
        measurer.appendChild(span)
        wordSpans.push(span)
        if (i < words.length - 1) {
          measurer.appendChild(document.createTextNode(' '))
        }
      })

      el.parentElement.appendChild(measurer)

      // Group consecutive words by offsetTop, tolerating sub-pixel rounding.
      // Using DOM order (not sorted by top) preserves natural reading order
      // even if a word crosses a line and the layout engine rounds differently.
      const detected: string[] = []
      let currentLine: string[] = []
      let currentTop = Number.NEGATIVE_INFINITY
      const TOLERANCE_PX = 4
      wordSpans.forEach((span) => {
        const top = span.offsetTop
        if (Math.abs(top - currentTop) > TOLERANCE_PX) {
          if (currentLine.length > 0) detected.push(currentLine.join(' '))
          currentLine = []
          currentTop = top
        }
        currentLine.push(span.textContent || '')
      })
      if (currentLine.length > 0) detected.push(currentLine.join(' '))

      el.parentElement.removeChild(measurer)
      setLines(detected)
    }

    measure()

    const ro = new ResizeObserver(measure)
    if (ref.current?.parentElement) ro.observe(ref.current.parentElement)
    return () => ro.disconnect()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [text, style?.textIndent])

  if (lines === null) {
    // Pre-measurement render — keeps layout space, hidden from sight.
    return createElement(
      as,
      { ref, className, style: { ...style, opacity: 0 } },
      text
    )
  }

  // Lines render as `display: block` spans, so a parent `text-indent` would inherit
  // and apply to EVERY line (because each line span has its own first-line). Extract
  // `text-indent` from the parent style and apply it only to the first line span as
  // padding-left, matching the original `<p>` behaviour where only line 1 was indented.
  const firstLineIndent = style?.textIndent
  const parentStyle = style ? { ...style } : undefined
  if (parentStyle && 'textIndent' in parentStyle) {
    delete (parentStyle as Record<string, unknown>).textIndent
  }

  const children = lines.map((line, i) => (
    <span
      key={i}
      style={{
        display: 'block',
        overflow: 'hidden',
        textIndent: 0,
        paddingLeft: i === 0 ? firstLineIndent : undefined,
      }}
    >
      <motion.span
        style={{ display: 'block', willChange: 'transform' }}
        initial={{ y: '110%' }}
        animate={isInView ? { y: '0%' } : { y: '110%' }}
        transition={{
          delay: (baseDelayMs + i * staggerMs) / 1000,
          duration: durationMs / 1000,
          ease: FIDDLE_EASE,
        }}
      >
        {line}
      </motion.span>
    </span>
  ))

  return createElement(as, { ref, className, style: parentStyle }, children)
}
