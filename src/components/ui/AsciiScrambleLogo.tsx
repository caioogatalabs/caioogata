'use client'

import { useState, useCallback } from 'react'
import { useScramble } from '@/hooks/useScramble'

/**
 * ASCII art representation of the "CO" logo, derived from the SVG paths (viewBox 0 0 440 200).
 *
 * C (0–200): full rectangle with a right-side notch at y=80–120 (79% width in the middle row)
 * Gap (200–240): ~2 chars, proportional to the 40px SVG gap
 * O (240–440): full rectangle with a centered 40×40 hole (40%–60% in both axes)
 */
const CO_ASCII = `███████████  ███████████
███████████  ███████████
█████████    ████   ████
███████████  ███████████
███████████  ███████████`

interface AsciiScrambleLogoProps {
  className?: string
  /** Whether to run the scanner animation on mount. Default: true */
  animateOnMount?: boolean
  /** Called every time the hover animation triggers */
  onAnimationTrigger?: () => void
}

export function AsciiScrambleLogo({ className = '', animateOnMount = true, onAnimationTrigger }: AsciiScrambleLogoProps) {
  const [trigger, setTrigger] = useState(0)
  const [charsPerFrame, setCharsPerFrame] = useState(animateOnMount ? 7 : 25)

  const { chars } = useScramble(CO_ASCII, {
    mode: 'scanner',
    charsPerFrame,
    scannerPhaseDuration: 1,
    trigger,
    // When animateOnMount=false, stay resolved until the first hover trigger
    enabled: animateOnMount || trigger > 0,
  })

  const handleMouseEnter = useCallback(() => {
    setCharsPerFrame(25) // hover: ~150ms
    setTrigger((t) => t + 1)
    onAnimationTrigger?.()
  }, [onAnimationTrigger])

  return (
    <span
      role="img"
      aria-label="Caio Ogata Logo"
      className={`flex-shrink-0 ${className}`.trim()}
      onMouseEnter={handleMouseEnter}
    >
      <span
        aria-hidden
        className="block whitespace-pre font-mono text-[10px] leading-[130%] tracking-[-0.5px] select-none"
      >
        {chars.map((c, i) => (
          <span key={i} className={c.locked ? 'text-primary' : 'text-primary/60'}>
            {c.char}
          </span>
        ))}
      </span>
    </span>
  )
}
