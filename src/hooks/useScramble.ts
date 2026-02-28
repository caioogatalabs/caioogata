'use client'

import { useState, useEffect } from 'react'

const SCRAMBLE_CHARS = '█▓▒░▄▀■□'

export interface ScrambleChar {
  char: string
  /** True once this position has resolved to its final character */
  locked: boolean
}

interface UseScrambleOptions {
  enabled?: boolean
  /** Milliseconds between each frame tick. Default: 16 (~60fps) */
  frameInterval?: number
  /** Number of characters to lock per frame tick. Default: 5 */
  charsPerFrame?: number
  /** How many ticks before unlocked chars cycle to a new random char. Default: 3 (slower = more regular look) */
  scrambleCycleEvery?: number
}

interface UseScrambleResult {
  chars: ScrambleChar[]
  isComplete: boolean
  /** Flat text string — convenience for simple renderers */
  text: string
}

/**
 * Character scramble effect: all positions start dimmed with random block chars,
 * then progressively lock left-to-right, lighting up to reveal the final text.
 *
 * Spaces and newlines are always treated as locked (never scrambled).
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
    const lockableCount = finalChars.filter((c) => c !== ' ' && c !== '\n').length

    // Per-position scramble buffer — only updated every scrambleCycleEvery ticks
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

      // Refresh scramble buffer every N ticks for a slower, more deliberate cycle
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
  }, [finalText, enabled, frameInterval, charsPerFrame, scrambleCycleEvery])

  return result
}
