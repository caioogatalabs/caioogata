import { useEffect, useRef, useState } from 'react'

const DEFAULT_POOL = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ!@#$%'
const DEFAULT_STEP_MS = 17

export interface ScrambleResult {
  /** Current display string — mix of revealed chars (left) and random (right). */
  display: string
  /** Number of chars from the left that have settled on `text`. Use to slice
   *  `display` for typography contrast (resolved vs scrambling tail). */
  revealed: number
}

/**
 * useScramble — hand-rolled, zero-deps character scramble reveal.
 *
 * Progressively reveals `text` left → right when `active` is true. Returns
 * both the live display string and the revealed-char boundary so consumers
 * can render the resolved/unresolved halves with different typography.
 *
 * When `active` flips to false, snaps to `text` (revealed = text.length).
 *
 * V2-scoped reveal primitive. Legacy V1 ASCII block-scramble lives at
 * `useAsciiScramble` (different signature).
 */
export function useScramble(
  text: string,
  active: boolean,
  opts?: { stepMs?: number; charPool?: string }
): ScrambleResult {
  const stepMs = opts?.stepMs ?? DEFAULT_STEP_MS
  const charPool = opts?.charPool ?? DEFAULT_POOL
  const [state, setState] = useState<ScrambleResult>(() => ({
    display: text,
    revealed: text.length,
  }))
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)

  useEffect(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current)
      intervalRef.current = null
    }

    if (!active) {
      setState({ display: text, revealed: text.length })
      return
    }

    let step = 0
    const total = text.length
    // Reveal cadence: ~2x stepMs per character. With stepMs=17 and
    // revealEvery=2 → 34ms per char → "about" (5) ≈ 170ms; "experience" (10) ≈ 340ms.
    const revealEvery = 2

    const tick = () => {
      const revealed = Math.min(total, Math.floor(step / revealEvery))
      let out = ''
      for (let i = 0; i < total; i++) {
        const ch = text[i]
        if (i < revealed || ch === ' ') {
          out += ch
        } else {
          out += charPool[Math.floor(Math.random() * charPool.length)]
        }
      }
      setState({ display: out, revealed })
      step++
      if (revealed >= total) {
        setState({ display: text, revealed: total })
        if (intervalRef.current) {
          clearInterval(intervalRef.current)
          intervalRef.current = null
        }
      }
    }

    tick()
    intervalRef.current = setInterval(tick, stepMs)

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
        intervalRef.current = null
      }
    }
  }, [text, active, stepMs, charPool])

  return state
}
