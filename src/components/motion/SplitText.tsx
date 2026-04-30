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
 * Split a paragraph into masked elements that reveal as the container scrolls into view.
 *
 * - `type="word"`: each word translates from below a per-word mask. Use for body text.
 * - `type="line"`: detects line breaks after layout (Range API on a clone) and translates each
 *   line from below a per-line mask. Use for hero text and large display copy.
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
  durationMs = 900,
  baseDelayMs = 100,
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
      <span
        key={i}
        style={{
          display: 'inline-block',
          overflow: 'hidden',
          verticalAlign: 'bottom',
        }}
      >
        <motion.span
          style={{ display: 'inline-block', willChange: 'transform' }}
          initial={{ y: '110%' }}
          animate={isInView ? { y: '0%' } : { y: '110%' }}
          transition={{
            delay: (baseDelayMs + idx * staggerMs) / 1000,
            duration: durationMs / 1000,
            ease: FIDDLE_EASE,
          }}
        >
          {tok}
        </motion.span>
      </span>
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

      // Measurement clone: same width + typography, hidden from layout.
      const measurer = document.createElement('p')
      const cs = window.getComputedStyle(el)
      measurer.style.cssText = `
        position: absolute;
        visibility: hidden;
        pointer-events: none;
        top: 0; left: 0;
        width: ${el.offsetWidth}px;
        font: ${cs.font};
        font-family: ${cs.fontFamily};
        font-size: ${cs.fontSize};
        font-weight: ${cs.fontWeight};
        line-height: ${cs.lineHeight};
        letter-spacing: ${cs.letterSpacing};
        text-indent: ${cs.textIndent};
        white-space: ${cs.whiteSpace};
        word-spacing: ${cs.wordSpacing};
      `

      const words = text.split(/\s+/).filter(Boolean)
      const wordSpans: HTMLSpanElement[] = []
      words.forEach((word, i) => {
        const span = document.createElement('span')
        span.textContent = word
        span.style.display = 'inline-block'
        measurer.appendChild(span)
        wordSpans.push(span)
        if (i < words.length - 1) {
          measurer.appendChild(document.createTextNode(' '))
        }
      })

      el.parentElement.appendChild(measurer)

      const lineMap = new Map<number, string[]>()
      wordSpans.forEach((span) => {
        const top = span.offsetTop
        if (!lineMap.has(top)) lineMap.set(top, [])
        lineMap.get(top)!.push(span.textContent || '')
      })

      const detected = Array.from(lineMap.entries())
        .sort(([a], [b]) => a - b)
        .map(([_, ws]) => ws.join(' '))

      el.parentElement.removeChild(measurer)
      setLines(detected)
    }

    measure()

    const ro = new ResizeObserver(measure)
    if (ref.current?.parentElement) ro.observe(ref.current.parentElement)
    return () => ro.disconnect()
  }, [text])

  if (lines === null) {
    // Pre-measurement render — keeps layout space, hidden from sight.
    return createElement(
      as,
      { ref, className, style: { ...style, opacity: 0 } },
      text
    )
  }

  const children = lines.map((line, i) => (
    <span key={i} style={{ display: 'block', overflow: 'hidden' }}>
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

  return createElement(as, { ref, className, style }, children)
}
