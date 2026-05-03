'use client'

import { useScramble } from '@/hooks/useScramble'

interface ScrambledLabelProps {
  text: string
  active: boolean
}

/**
 * ScrambledLabel — character scramble reveal with typography swap.
 *
 * When `active` is true and the scramble has not yet settled, renders the
 * resolved (left) chars in font-mono and the still-scrambling (right) tail
 * in font-sans. When `active` is false OR the scramble has fully resolved,
 * renders the plain `text` string.
 *
 * Pattern locked by pilot commit c7514bd. Default useScramble opts (stepMs
 * 35, charPool ABC...!@#$%) — no per-surface variants.
 */
export function ScrambledLabel({ text, active }: ScrambledLabelProps) {
  const { display, revealed } = useScramble(text, active)
  const scrambling = active && revealed < display.length
  if (!scrambling) return <>{text}</>
  return (
    <>
      <span className="font-mono">{display.slice(0, revealed)}</span>
      <span className="font-sans">{display.slice(revealed)}</span>
    </>
  )
}
