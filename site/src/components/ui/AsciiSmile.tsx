'use client'

import { useState, useEffect, useRef, useMemo } from 'react'
import type { FormStatus, FocusedField } from '@/hooks/useContactForm'

interface AsciiSmileProps {
  status: FormStatus
  focusedField: FocusedField
  hasInteracted: boolean
  hasErrors: boolean
  message: string
}

// Characters used to build the face (dense ASCII, like the reference image)
const CHARS = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz@#$%&*+=<>/?!~^'
const SPARKLE_CHARS = '*+.~*+.~'

function randomChar() {
  return CHARS[Math.floor(Math.random() * CHARS.length)]
}

function randomSparkle() {
  return SPARKLE_CHARS[Math.floor(Math.random() * SPARKLE_CHARS.length)]
}

// Generate a string of random chars of given length
function randomFill(len: number): string {
  return Array.from({ length: len }, randomChar).join('')
}

// The face is defined as a mask: 1 = fill with random char, 0 = space
// Each state has a different eye/mouth pattern
// Grid: 21 wide x 13 tall (compact, readable in monospace)

type FaceMask = number[][]

const FACE_OUTLINE: FaceMask = [
  //  0 1 2 3 4 5 6 7 8 9 0 1 2 3 4 5 6 7 8 9 0
  [0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0], // row 0
  [0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0], // row 1
  [0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0], // row 2
  [0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0], // row 3
  [0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0], // row 4  (eyes row)
  [0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0], // row 5
  [0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0], // row 6
  [0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0], // row 7  (mouth row)
  [0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0], // row 8
  [0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0], // row 9
  [0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0], // row 10
  [0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0], // row 11
]

const COLS = FACE_OUTLINE[0].length
const ROWS = FACE_OUTLINE.length

// Eye patterns (placed at rows 4-5, cols 5-7 and 13-15)
type EyePattern = string[][]

const EYES_OPEN: EyePattern = [
  // Left eye (row4 col5-7), Right eye (row4 col13-15)
  [' ', 'O', ' '],
  ['/', ' ', '\\'],
]

const EYES_CLOSED: EyePattern = [
  ['-', '-', '-'],
  [' ', ' ', ' '],
]

const EYES_LOOK_LEFT: EyePattern = [
  ['O', ' ', ' '],
  ['\\', ' ', ' '],
]

const EYES_LOOK_RIGHT: EyePattern = [
  [' ', ' ', 'O'],
  [' ', ' ', '/'],
]

const EYES_WORRIED: EyePattern = [
  ['~', 'o', '~'],
  [' ', ' ', ' '],
]

const EYES_HAPPY: EyePattern = [
  ['^', ' ', '^'],
  [' ', ' ', ' '],
]

// Mouth patterns (placed at rows 7-8, cols 6-14)
type MouthPattern = string[][]

const MOUTH_SMILE: MouthPattern = [
  ['\\', ' ', '_', '_', '_', '_', '_', ' ', '/'],
  [' ', '\\', '_', '_', '_', '_', '/', ' ', ' '],
]

const MOUTH_FLAT: MouthPattern = [
  [' ', '_', '_', '_', '_', '_', '_', '_', ' '],
  [' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],
]

const MOUTH_WORRIED: MouthPattern = [
  [' ', '/', '_', '_', '_', '_', '_', '\\', ' '],
  ['/', ' ', ' ', ' ', ' ', ' ', ' ', ' ', '\\'],
]

const MOUTH_BIG_SMILE: MouthPattern = [
  ['\\', ' ', ' ', ' ', ' ', ' ', ' ', ' ', '/'],
  [' ', '\\', '_', '_', '_', '_', '/', ' ', ' '],
]

const MOUTH_SENDING: MouthPattern = [
  [' ', ' ', '.', '.', '.', '.', '.', ' ', ' '],
  [' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],
]

type FaceState = 'idle' | 'idle-blink' | 'typing-left' | 'typing-right' | 'error' | 'sending' | 'success'

function getEyesAndMouth(state: FaceState): { eyes: EyePattern; mouth: MouthPattern } {
  switch (state) {
    case 'idle':
      return { eyes: EYES_OPEN, mouth: MOUTH_SMILE }
    case 'idle-blink':
      return { eyes: EYES_CLOSED, mouth: MOUTH_SMILE }
    case 'typing-left':
      return { eyes: EYES_LOOK_LEFT, mouth: MOUTH_FLAT }
    case 'typing-right':
      return { eyes: EYES_LOOK_RIGHT, mouth: MOUTH_FLAT }
    case 'error':
      return { eyes: EYES_WORRIED, mouth: MOUTH_WORRIED }
    case 'sending':
      return { eyes: EYES_CLOSED, mouth: MOUTH_SENDING }
    case 'success':
      return { eyes: EYES_HAPPY, mouth: MOUTH_BIG_SMILE }
  }
}

// Build frame: fill outline with random chars, overlay eyes and mouth
function buildFrame(state: FaceState, addSparkles: boolean): string {
  const { eyes, mouth } = getEyesAndMouth(state)

  const grid: string[][] = []
  for (let r = 0; r < ROWS; r++) {
    const row: string[] = []
    for (let c = 0; c < COLS; c++) {
      row.push(FACE_OUTLINE[r][c] ? randomChar() : ' ')
    }
    grid.push(row)
  }

  // Place left eye at row 4-5, col 5-7
  for (let r = 0; r < 2; r++) {
    for (let c = 0; c < 3; c++) {
      const ch = eyes[r][c]
      if (ch !== ' ') grid[4 + r][5 + c] = ch
    }
  }

  // Place right eye at row 4-5, col 13-15
  for (let r = 0; r < 2; r++) {
    for (let c = 0; c < 3; c++) {
      const ch = eyes[r][c]
      if (ch !== ' ') grid[4 + r][13 + c] = ch
    }
  }

  // Place mouth at row 7-8, col 6-14
  for (let r = 0; r < 2; r++) {
    for (let c = 0; c < 9; c++) {
      const ch = mouth[r][c]
      if (ch !== ' ') grid[7 + r][6 + c] = ch
    }
  }

  // Sparkles around face for success state
  if (addSparkles) {
    const sparklePositions = [
      [0, 3], [0, 17], [1, 1], [1, 19],
      [3, 0], [3, 20], [5, 0], [5, 20],
      [8, 0], [8, 20], [10, 2], [10, 18],
      [11, 4], [11, 16],
    ]
    for (const [r, c] of sparklePositions) {
      if (r < ROWS) grid[r][c] = randomSparkle()
    }
  }

  return grid.map((row) => row.join('')).join('\n')
}

export default function AsciiSmile({
  status,
  focusedField,
  hasInteracted,
  hasErrors,
  message,
}: AsciiSmileProps) {
  const [frame, setFrame] = useState('')
  const [sparkleToggle, setSparkleToggle] = useState(false)
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const blinkRef = useRef(false)

  // Check for reduced motion preference
  const prefersReducedMotion = useMemo(() => {
    if (typeof window === 'undefined') return false
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches
  }, [])

  // Determine face state from props
  const faceState: FaceState = useMemo(() => {
    if (status === 'success') return 'success'
    if (status === 'submitting') return 'sending'
    if (status === 'error' || hasErrors) return 'error'
    if (hasInteracted && focusedField) {
      // Look toward the focused field (left fields = left, right fields = right)
      if (focusedField === 'name' || focusedField === 'email') return 'typing-left'
      return 'typing-right'
    }
    return 'idle'
  }, [status, focusedField, hasInteracted, hasErrors])

  useEffect(() => {
    if (intervalRef.current) clearInterval(intervalRef.current)

    const updateFrame = () => {
      if (faceState === 'idle') {
        // Blink every other tick at slow rate
        blinkRef.current = !blinkRef.current
        const state = blinkRef.current ? 'idle-blink' : 'idle'
        setFrame(buildFrame(state, false))
      } else if (faceState === 'success') {
        setSparkleToggle((prev) => !prev)
        setFrame(buildFrame('success', true))
      } else {
        setFrame(buildFrame(faceState, false))
      }
    }

    // Initial frame
    setFrame(buildFrame(faceState, faceState === 'success'))

    if (prefersReducedMotion) return

    // Different intervals per state
    let interval: number
    switch (faceState) {
      case 'idle':
        interval = 3000 // Slow blink
        break
      case 'typing-left':
      case 'typing-right':
        interval = 800 // Randomize chars while typing
        break
      case 'sending':
        interval = 400 // Faster for loading feel
        break
      case 'success':
        interval = 500 // Sparkle animation
        break
      case 'error':
        interval = 1200 // Slow wobble
        break
      default:
        interval = 2000
    }

    intervalRef.current = setInterval(updateFrame, interval)

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current)
    }
  }, [faceState, prefersReducedMotion])

  return (
    <div
      className="border-2 border-secondary/10 rounded-base p-4 flex flex-col items-center gap-3"
      aria-hidden="true"
    >
      <pre
        className="text-primary font-mono text-xs leading-tight select-none"
        style={{ fontSize: '10px', lineHeight: '12px' }}
      >
        {frame}
      </pre>
      <span className="text-xs font-mono text-secondary/70 text-center">
        {message}
      </span>
    </div>
  )
}
