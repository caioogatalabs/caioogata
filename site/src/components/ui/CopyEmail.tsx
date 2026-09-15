'use client'

import { useEffect, useRef, useState, type CSSProperties, type ReactNode } from 'react'
import { createPortal } from 'react-dom'
import { LABEL_TYPE } from '@/components/ui/label'

const LERP_FACTOR = 0.2
const HINT_OFFSET = { x: 14, y: 18 }
const COPIED_MS = 2000

/**
 * The public address. The header availability and the footer contact both copy
 * it. Gmail for now, until contato@caioogata.com is set up.
 */
export const CONTACT_EMAIL = 'caioogata.labs@gmail.com'

/** Clipboard fallback for browsers without the async Clipboard API. */
function copyWithSelection(text: string) {
  const area = document.createElement('textarea')
  area.value = text
  area.setAttribute('readonly', '')
  area.style.position = 'fixed'
  area.style.opacity = '0'
  document.body.appendChild(area)
  area.select()
  document.execCommand('copy')
  area.remove()
}

interface CopyEmailProps {
  email?: string
  copyLabel: string
  copiedLabel: string
  /** The yellow blinking square before the label. Off on the inverse footer, where it would vanish. */
  square?: boolean
  /** What reads on the button; the address itself by default. */
  children?: ReactNode
  className?: string
  labelClassName?: string
  style?: CSSProperties
}

/**
 * The email as a copy action. On hover a small hint trails the cursor
 * ("copy email?"), and a click copies the address and swaps the hint to the
 * confirmation. An optional yellow square blinks before the label. Keyboard focus shows the
 * hint under the address instead of at the cursor. If the clipboard is
 * unavailable (older browsers, insecure contexts), it copies through a
 * selected textarea instead. It never opens a mail app.
 */
export function CopyEmail({
  email = CONTACT_EMAIL,
  copyLabel,
  copiedLabel,
  square = false,
  children,
  className = '',
  labelClassName = '',
  style,
}: CopyEmailProps) {
  const buttonRef = useRef<HTMLButtonElement>(null)
  const hintRef = useRef<HTMLSpanElement>(null)
  const target = useRef({ x: 0, y: 0 })
  const current = useRef({ x: 0, y: 0 })
  const frame = useRef(0)
  const hovering = useRef(false)
  const resetTimer = useRef<ReturnType<typeof setTimeout>>(undefined)
  const [visible, setVisible] = useState(false)
  const [copied, setCopied] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => setMounted(true), [])

  useEffect(() => {
    if (!visible) return
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    const tick = () => {
      const factor = reduced ? 1 : LERP_FACTOR
      current.current.x += (target.current.x - current.current.x) * factor
      current.current.y += (target.current.y - current.current.y) * factor
      if (hintRef.current) {
        hintRef.current.style.transform = `translate3d(${current.current.x}px, ${current.current.y}px, 0)`
      }
      frame.current = requestAnimationFrame(tick)
    }
    frame.current = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(frame.current)
  }, [visible])

  useEffect(() => () => clearTimeout(resetTimer.current), [])

  const moveTo = (x: number, y: number, snap = false) => {
    // Near the right edge the hint flips to the cursor's left, so it never clips.
    const width = hintRef.current?.offsetWidth ?? 0
    const flip = x + HINT_OFFSET.x + width > window.innerWidth - 8
    target.current = { x: flip ? x - HINT_OFFSET.x - width : x + HINT_OFFSET.x, y: y + HINT_OFFSET.y }
    if (snap) current.current = { ...target.current }
  }

  const anchorToButton = () => {
    const rect = buttonRef.current?.getBoundingClientRect()
    if (rect) moveTo(rect.left, rect.bottom - HINT_OFFSET.y + 8, true)
  }

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(email)
    } catch {
      copyWithSelection(email)
    }
    setCopied(true)
    setVisible(true)
    clearTimeout(resetTimer.current)
    resetTimer.current = setTimeout(() => {
      setCopied(false)
      // Touch and keyboard have no leave event to close the hint.
      if (!hovering.current && document.activeElement !== buttonRef.current) setVisible(false)
    }, COPIED_MS)
  }

  return (
    <>
      <button
        ref={buttonRef}
        type="button"
        onClick={copy}
        onPointerEnter={e => {
          if (e.pointerType !== 'mouse') return
          hovering.current = true
          moveTo(e.clientX, e.clientY, true)
          setVisible(true)
        }}
        onPointerMove={e => {
          if (e.pointerType === 'mouse') moveTo(e.clientX, e.clientY)
        }}
        onPointerLeave={() => {
          hovering.current = false
          setVisible(false)
        }}
        onPointerDown={e => {
          if (e.pointerType !== 'mouse') moveTo(e.clientX, e.clientY, true)
        }}
        onFocus={e => {
          if (!e.currentTarget.matches(':focus-visible')) return
          anchorToButton()
          setVisible(true)
        }}
        onBlur={() => setVisible(false)}
        style={style}
        className={`pointer-events-auto inline-flex cursor-pointer items-center gap-2 text-left ${className}`}
      >
        {square && <span aria-hidden className="size-2 shrink-0 bg-bg-fill-primary animate-blink-square" />}
        <span className={labelClassName}>{children ?? email}</span>
      </button>

      {mounted && createPortal(
      <span
        ref={hintRef}
        aria-hidden
        className={`pointer-events-none fixed left-0 top-0 z-[100] whitespace-nowrap rounded-[4px] bg-bg-surface-secondary px-2 py-1 transition-opacity duration-200 ${LABEL_TYPE} ${
          visible ? 'opacity-100' : 'opacity-0'
        }`}
      >
        {copied ? copiedLabel : copyLabel}
      </span>,
      document.body,
      )}

      <span className="sr-only" aria-live="polite">
        {copied ? copiedLabel : ''}
      </span>
    </>
  )
}
