import { useEffect, useRef, useState } from 'react'

const DEFAULT_POOL = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ!@#$%'
const DEFAULT_STEP_MS = 26

/**
 * useScramble — hand-rolled, zero-deps character scramble reveal.
 *
 * When `active` is true, returns a string that progressively reveals `text`
 * left → right; characters not yet revealed are random picks from `charPool`
 * (re-rolled every step). Whitespace is preserved (never randomised).
 *
 * When `active` flips to false, returns `text` immediately and clears any
 * running interval — no in-flight residue.
 *
 * On unmount, the interval is cleared. React 19 strict-mode double-invoke is
 * safe: cleanup runs between effect invocations, so no two intervals coexist.
 *
 * V2-scoped reveal primitive. The legacy V1 ASCII block-scramble lives at
 * `useAsciiScramble` (different signature: returns `{ chars, isComplete }`).
 *
 * @param text     The final string to settle on.
 * @param active   When true, run the scramble cycle. When false, snap to text.
 * @param opts.stepMs   Interval between scramble ticks (default 26ms).
 * @param opts.charPool Pool of random characters for unrevealed positions.
 */
export function useScramble(
  text: string,
  active: boolean,
  opts?: { stepMs?: number; charPool?: string }
): string {
  const stepMs = opts?.stepMs ?? DEFAULT_STEP_MS
  const charPool = opts?.charPool ?? DEFAULT_POOL
  const [display, setDisplay] = useState(text)
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)

  useEffect(() => {
    // Always clear any existing interval before deciding what to do.
    if (intervalRef.current) {
      clearInterval(intervalRef.current)
      intervalRef.current = null
    }

    if (!active) {
      setDisplay(text)
      return
    }

    // active=true → run the scramble cycle.
    let step = 0
    const total = text.length
    // Reveal one character per N steps. With stepMs=26 and revealEvery=2,
    // a 10-char label settles in ~520ms.
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
      setDisplay(out)
      step++
      if (revealed >= total) {
        // Settle on final text and stop.
        setDisplay(text)
        if (intervalRef.current) {
          clearInterval(intervalRef.current)
          intervalRef.current = null
        }
      }
    }

    // Fire one tick immediately so the user sees scramble on the first frame,
    // not after stepMs delay.
    tick()
    intervalRef.current = setInterval(tick, stepMs)

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
        intervalRef.current = null
      }
    }
  }, [text, active, stepMs, charPool])

  return display
}
