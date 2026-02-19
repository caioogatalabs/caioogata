'use client'

import { useState, useEffect, useRef, useCallback, useMemo } from 'react'
import type { FormStatus, FocusedField } from '@/hooks/useContactForm'

const LOG_LINES = 10
const EMPTY_CHAR = '—'
const IDLE_INTERVAL = 10000
const TYPEWRITER_MS = 7

interface LogEntry {
  text: string
  type: 'info' | 'error' | 'success' | 'system'
}

interface FormLogProps {
  status: FormStatus
  focusedField: FocusedField
  values: { name: string; email: string; subject: string; message: string }
  errors: { name?: string; email?: string; message?: string }
  hasInteracted: boolean
  idleMessages: string[]
  waitingMessage: string
  errorMessage?: string
  errorRetry?: string
  contactEmail?: string
}

function getTimestamp(): string {
  const now = new Date()
  const h = String(now.getHours()).padStart(2, '0')
  const m = String(now.getMinutes()).padStart(2, '0')
  const s = String(now.getSeconds()).padStart(2, '0')
  return `${h}:${m}:${s}`
}

export default function FormLog({
  status,
  focusedField,
  values,
  errors,
  hasInteracted,
  idleMessages,
  waitingMessage,
  errorMessage,
  errorRetry,
  contactEmail,
}: FormLogProps) {
  const [entries, setEntries] = useState<LogEntry[]>([])

  // Idle typewriter state
  const allIdleMessages = useMemo(() => [...idleMessages, waitingMessage], [idleMessages, waitingMessage])
  const [completedIdle, setCompletedIdle] = useState<string[]>([])
  const [currentIdleIndex, setCurrentIdleIndex] = useState(0)
  const [typedLength, setTypedLength] = useState(0)
  const [idleStarted, setIdleStarted] = useState(false)
  const [waitingForNext, setWaitingForNext] = useState(false)

  const prevFocusRef = useRef<FocusedField>(null)
  const prevStatusRef = useRef<FormStatus>('idle')
  const prevErrorsRef = useRef<string[]>([])
  const snapshotRef = useRef({ name: '', email: '', subject: '', message: '' })
  const scrollRef = useRef<HTMLDivElement>(null)

  const isIdle = !hasInteracted && entries.length === 0

  const pushLog = useCallback((text: string, type: LogEntry['type'] = 'info') => {
    setEntries((prev) => {
      const next = [...prev, { text, type }]
      if (next.length > 50) return next.slice(-50)
      return next
    })
  }, [])

  // Start idle on mount
  useEffect(() => {
    if (isIdle && !idleStarted) {
      setIdleStarted(true)
    }
  }, [isIdle, idleStarted])

  // Typewriter: reveal one character at a time
  useEffect(() => {
    if (!isIdle || !idleStarted || waitingForNext) return
    if (currentIdleIndex >= allIdleMessages.length) return

    const fullText = allIdleMessages[currentIdleIndex]
    if (typedLength >= fullText.length) {
      // Typing complete — wait before next message
      setWaitingForNext(true)
      return
    }

    const timer = setTimeout(() => {
      setTypedLength((l) => l + 1)
    }, TYPEWRITER_MS)

    return () => clearTimeout(timer)
  }, [isIdle, idleStarted, waitingForNext, currentIdleIndex, typedLength, allIdleMessages])

  // After typing completes, wait IDLE_INTERVAL then advance
  useEffect(() => {
    if (!isIdle || !waitingForNext) return
    if (currentIdleIndex >= allIdleMessages.length) return

    const isLast = currentIdleIndex === allIdleMessages.length - 1
    if (isLast) return // Last message stays, no advance

    const timer = setTimeout(() => {
      setCompletedIdle((prev) => [...prev, allIdleMessages[currentIdleIndex]])
      setCurrentIdleIndex((i) => i + 1)
      setTypedLength(0)
      setWaitingForNext(false)
    }, IDLE_INTERVAL)

    return () => clearTimeout(timer)
  }, [isIdle, waitingForNext, currentIdleIndex, allIdleMessages])

  // Log on focus change (blur = commit values from previous field)
  useEffect(() => {
    const prevField = prevFocusRef.current

    if (prevField && prevField !== focusedField) {
      const currentVal = values[prevField]
      const prevVal = snapshotRef.current[prevField]

      if (currentVal && currentVal !== prevVal) {
        if (prevField === 'message') {
          const preview = currentVal.length > 40
            ? currentVal.slice(0, 40) + '...'
            : currentVal
          pushLog(`[${getTimestamp()}] ${prevField}: "${preview}"`)
        } else {
          pushLog(`[${getTimestamp()}] ${prevField}: "${currentVal}"`)
        }
        snapshotRef.current = { ...snapshotRef.current, [prevField]: currentVal }
      }
    }

    if (focusedField && focusedField !== prevFocusRef.current) {
      pushLog(`[${getTimestamp()}] focus → ${focusedField}`)
    }

    prevFocusRef.current = focusedField
  }, [focusedField, values, pushLog])

  // Track errors
  useEffect(() => {
    const currentErrors = Object.entries(errors)
      .filter(([, v]) => !!v)
      .map(([k, v]) => `${k}: ${v}`)

    const prev = prevErrorsRef.current

    for (const err of currentErrors) {
      if (!prev.includes(err)) {
        pushLog(`[${getTimestamp()}] ✗ ${err}`, 'error')
      }
    }

    for (const err of prev) {
      if (!currentErrors.includes(err)) {
        const field = err.split(':')[0]
        pushLog(`[${getTimestamp()}] ✓ ${field} ok`, 'success')
      }
    }

    prevErrorsRef.current = currentErrors
  }, [errors.name, errors.email, errors.message, pushLog])

  // Track status changes
  useEffect(() => {
    if (status === prevStatusRef.current) return

    switch (status) {
      case 'submitting':
        pushLog(`[${getTimestamp()}] submitting...`, 'system')
        break
      case 'success':
        pushLog(`[${getTimestamp()}] ✓ message sent`, 'success')
        break
      case 'error':
        pushLog(`[${getTimestamp()}] ✗ ${errorMessage ?? 'send failed'}`, 'error')
        if (errorRetry) {
          pushLog(`[${getTimestamp()}] ${errorRetry}`, 'error')
        }
        if (contactEmail) {
          pushLog(`[${getTimestamp()}] → ${contactEmail}`, 'info')
        }
        break
      case 'idle':
        if (prevStatusRef.current === 'success') {
          pushLog(`[${getTimestamp()}] form reset`, 'system')
        }
        break
    }

    prevStatusRef.current = status
  }, [status, pushLog, errorMessage, errorRetry, contactEmail])

  // Auto-scroll to bottom
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [entries])

  const colorMap: Record<string, string> = {
    info: 'text-secondary/70',
    error: 'text-accent',
    success: 'text-primary',
    system: 'text-neutral-teal',
    empty: 'text-secondary/20',
    idle: 'text-secondary/40',
  }

  // Idle state: typewriter animation, messages accumulate from bottom
  if (isIdle) {
    // Build lines: completed messages + currently typing message
    const currentFullText = currentIdleIndex < allIdleMessages.length
      ? allIdleMessages[currentIdleIndex]
      : null
    const typingText = currentFullText ? currentFullText.slice(0, typedLength) : null
    const isTyping = currentFullText ? typedLength < currentFullText.length : false

    const allVisibleMessages = [...completedIdle]
    if (typingText !== null) {
      allVisibleMessages.push(typingText)
    }

    const visibleIdle = allVisibleMessages.slice(-LOG_LINES)
    const emptyCount = LOG_LINES - visibleIdle.length
    const lines: { text: string; type: string; isCurrent: boolean }[] = []

    for (let i = 0; i < emptyCount; i++) {
      lines.push({ text: EMPTY_CHAR, type: 'empty', isCurrent: false })
    }
    for (let i = 0; i < visibleIdle.length; i++) {
      const isLast = i === visibleIdle.length - 1
      lines.push({
        text: `> ${visibleIdle[i]}`,
        type: 'idle',
        isCurrent: isLast,
      })
    }

    return (
      <div
        className="font-mono text-xs leading-relaxed overflow-hidden"
        style={{ height: `${LOG_LINES * 1.625}em` }}
        aria-label="Form activity log"
      >
        {lines.map((line, i) => (
          <div
            key={i}
            className={colorMap[line.type]}
          >
            {line.text}
            {line.isCurrent && (
              <span
                className={`inline-block w-1.5 h-3 bg-secondary align-middle ml-0.5 ${isTyping ? 'opacity-100' : 'animate-blink'}`}
                aria-hidden
              />
            )}
          </div>
        ))}
      </div>
    )
  }

  // Active state: real log entries padded with empty lines on top
  const visibleEntries = entries.slice(-LOG_LINES)
  const emptyCount = LOG_LINES - visibleEntries.length
  const paddedLines: { text: string; type: string }[] = []

  for (let i = 0; i < emptyCount; i++) {
    paddedLines.push({ text: EMPTY_CHAR, type: 'empty' })
  }
  for (const entry of visibleEntries) {
    paddedLines.push(entry)
  }

  return (
    <div
      ref={scrollRef}
      className="font-mono text-xs leading-relaxed overflow-hidden"
      style={{ height: `${LOG_LINES * 1.625}em` }}
      aria-live="polite"
      aria-label="Form activity log"
    >
      {paddedLines.map((line, i) => (
        <div key={i} className={`${colorMap[line.type] ?? colorMap.info} truncate`}>
          {line.text}
        </div>
      ))}
    </div>
  )
}
