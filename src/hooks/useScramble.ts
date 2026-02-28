'use client'

import { useState, useEffect } from 'react'

const SCRAMBLE_CHARS = '█▓▒░▄▀■□'
const SCANNER_SEQUENCE = ['█', '▓', '▒', '░'] as const

export interface ScrambleChar {
  char: string
  /** True once this position has resolved to its final character */
  locked: boolean
}

interface UseScrambleOptions {
  enabled?: boolean
  /** Milliseconds between each frame tick. Default: 16 (~60fps) */
  frameInterval?: number
  /** Number of characters to advance per frame tick. Default: 5 */
  charsPerFrame?: number
  /** [scramble mode] How many ticks before unlocked chars cycle. Default: 3 */
  scrambleCycleEvery?: number
  /** Animation mode. 'scramble' = random chars (default), 'scanner' = left-to-right sweep with █▓▒░ */
  mode?: 'scramble' | 'scanner'
  /** [scanner mode] How many frames each phase (█▓▒░) lasts. Default: 2 */
  scannerPhaseDuration?: number
  /** Increment this value to re-trigger the animation without changing the text */
  trigger?: number
}

interface UseScrambleResult {
  chars: ScrambleChar[]
  isComplete: boolean
  /** Flat text string — convenience for simple renderers */
  text: string
}

/**
 * Character animation hook with two modes:
 *
 * 'scramble': positions start dimmed with random block chars, then lock left-to-right.
 * 'scanner': a bright scan head sweeps left-to-right, each position cycling through
 *            █▓▒░ as the head passes before locking to the final char.
 *
 * Spaces and newlines are always treated as locked (never animated).
 * Respects prefers-reduced-motion by resolving immediately.
 */
export function useScramble(
  finalText: string,
  options: UseScrambleOptions = {}
): UseScrambleResult {
  const {
    enabled = true,
    frameInterval = 16,
    charsPerFrame = 5,
    scrambleCycleEvery = 3,
    mode = 'scramble',
    scannerPhaseDuration = 2,
    trigger = 0,
  } = options

  const resolved: UseScrambleResult = {
    chars: finalText.split('').map((c) => ({ char: c, locked: true })),
    isComplete: true,
    text: finalText,
  }

  const [result, setResult] = useState<UseScrambleResult>(() =>
    !enabled || !finalText ? resolved : { chars: [], isComplete: false, text: '' }
  )

  useEffect(() => {
    if (!enabled || !finalText) {
      setResult(resolved)
      return
    }

    const prefersReduced =
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches

    if (prefersReduced) {
      setResult(resolved)
      return
    }

    const finalChars = finalText.split('')

    // Build lockable index map: string position → lockable index (-1 for spaces/newlines)
    const lockableIndexMap: number[] = new Array(finalChars.length).fill(-1)
    let lockableCount = 0
    finalChars.forEach((c, i) => {
      if (c !== ' ' && c !== '\n') {
        lockableIndexMap[i] = lockableCount++
      }
    })

    // ── Scanner mode ─────────────────────────────────────────────────────────
    if (mode === 'scanner') {
      // Start with all chars dim (unreached)
      setResult({
        chars: finalChars.map((c) => ({
          char: c,
          locked: c === ' ' || c === '\n',
        })),
        isComplete: false,
        text: finalText,
      })

      let frame = 0
      const lastTouchFrame = Math.floor((lockableCount - 1) / charsPerFrame) + 1
      const lastDoneFrame = lastTouchFrame + SCANNER_SEQUENCE.length * scannerPhaseDuration

      const id = setInterval(() => {
        frame++

        const chars: ScrambleChar[] = finalChars.map((c, i) => {
          if (c === ' ' || c === '\n') return { char: c, locked: true }

          const k = lockableIndexMap[i]
          // touchFrame: the frame at which the scan head first reaches position k
          const touchFrame = Math.floor(k / charsPerFrame) + 1
          const framesSinceTouched = frame - touchFrame

          if (framesSinceTouched < 0) {
            // Not yet reached — show final char dimly
            return { char: c, locked: false }
          }

          const phase = Math.floor(framesSinceTouched / scannerPhaseDuration)

          if (phase < SCANNER_SEQUENCE.length) {
            // In scan — show scanner char brightly
            return { char: SCANNER_SEQUENCE[phase], locked: true }
          }

          // Past scan — locked to final char
          return { char: c, locked: true }
        })

        if (frame >= lastDoneFrame) {
          setResult(resolved)
          clearInterval(id)
          return
        }

        setResult({ chars, isComplete: false, text: chars.map((c) => c.char).join('') })
      }, frameInterval)

      return () => clearInterval(id)
    }

    // ── Scramble mode (original) ──────────────────────────────────────────────
    const scrambleBuffer = finalChars.map((c) =>
      c === ' ' || c === '\n'
        ? c
        : SCRAMBLE_CHARS[Math.floor(Math.random() * SCRAMBLE_CHARS.length)]
    )

    // Show initial fully-scrambled state immediately
    setResult({
      chars: finalChars.map((c, i) => ({
        char: c === ' ' || c === '\n' ? c : scrambleBuffer[i],
        locked: c === ' ' || c === '\n',
      })),
      isComplete: false,
      text: scrambleBuffer.join(''),
    })

    let frame = 0

    const id = setInterval(() => {
      frame++
      const lockedSoFar = frame * charsPerFrame

      if (lockedSoFar >= lockableCount) {
        setResult(resolved)
        clearInterval(id)
        return
      }

      if (frame % scrambleCycleEvery === 0) {
        let seen = 0
        for (let i = 0; i < finalChars.length; i++) {
          if (finalChars[i] === ' ' || finalChars[i] === '\n') continue
          if (seen >= lockedSoFar) {
            scrambleBuffer[i] = SCRAMBLE_CHARS[Math.floor(Math.random() * SCRAMBLE_CHARS.length)]
          }
          seen++
        }
      }

      let locked = 0
      const chars: ScrambleChar[] = finalChars.map((c, i) => {
        if (c === ' ' || c === '\n') return { char: c, locked: true }
        if (locked < lockedSoFar) {
          locked++
          return { char: c, locked: true }
        }
        return { char: scrambleBuffer[i], locked: false }
      })

      setResult({ chars, isComplete: false, text: chars.map((c) => c.char).join('') })
    }, frameInterval)

    return () => clearInterval(id)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [finalText, enabled, frameInterval, charsPerFrame, scrambleCycleEvery, mode, scannerPhaseDuration, trigger])

  return result
}
