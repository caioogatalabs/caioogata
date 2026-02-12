'use client'

import { motion } from 'motion/react'
import type { Variants } from 'motion'
import { useMemo, useId, useState } from 'react'

export interface PixelRevealLogoProps {
  /** Width of the SVG viewBox */
  width?: number
  /** Height of the SVG viewBox */
  height?: number
  /** Optional display width (defaults to width). Use to render smaller than viewBox. */
  displayWidth?: number
  /** Optional display height (defaults to height). Use to render smaller than viewBox. */
  displayHeight?: number
  /** Size of each pixel block in user units */
  pixelSize?: number
  /** Color of the logo (hex, rgb, or CSS var) */
  color?: string
  /** Array of SVG path strings to render */
  paths: string[]
  /** Optional classname for the container */
  className?: string
  /** Duration of the initial build animation in seconds */
  animationDuration?: number
}

export function PixelRevealLogo({
  width = 440,
  height = 200,
  displayWidth,
  displayHeight,
  pixelSize = 20,
  color = '#FAEA4D',
  paths,
  className = '',
  animationDuration = 1.5,
}: PixelRevealLogoProps) {
  const uniqueId = useId()
  const maskId = `pixel-mask-${uniqueId}`

  const cols = Math.ceil(width / pixelSize)
  const rows = Math.ceil(height / pixelSize)

  const pixels = useMemo(() => {
    const grid: {
      r: number
      c: number
      x: number
      y: number
      shouldFlicker: boolean
      flickerDuration?: number
      flickerRepeatDelay?: number
    }[] = []
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        const shouldFlicker = Math.random() > 0.8
        const pixel: (typeof grid)[number] = {
          r,
          c,
          x: c * pixelSize,
          y: r * pixelSize,
          shouldFlicker,
        }
        if (shouldFlicker) {
          pixel.flickerDuration = 0.1 + Math.random() * 0.2
          pixel.flickerRepeatDelay = Math.random() * 0.5
        }
        grid.push(pixel)
      }
    }
    return grid
  }, [rows, cols, pixelSize])

  const getVariants = (p: (typeof pixels)[number]): Variants => {
    const inverseRow = rows - 1 - p.r
    const totalSteps = rows + cols * 0.2
    const currentStep = inverseRow + p.c * 0.02
    const delay = (currentStep / totalSteps) * animationDuration

    const variants: Variants = {
      hidden: { opacity: 0 },
      visible: {
        opacity: 1,
        transition: { delay, duration: 0 },
      },
    }

    if (p.shouldFlicker && p.flickerDuration != null && p.flickerRepeatDelay != null) {
      variants.hover = {
        opacity: [1, 0, 1],
        transition: {
          duration: p.flickerDuration,
          repeat: Infinity,
          repeatType: 'reverse',
          repeatDelay: p.flickerRepeatDelay,
          ease: 'linear',
        },
      }
    }

    return variants
  }

  const styleWidth = displayWidth ?? width
  const styleHeight = displayHeight ?? height
  const [isHovered, setIsHovered] = useState(false)

  return (
    <motion.div
      className={`relative overflow-hidden flex-shrink-0 ${className}`.trim()}
      style={{ width: styleWidth, height: styleHeight, minWidth: styleWidth, minHeight: styleHeight }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <svg
        className="block"
        width="100%"
        height="100%"
        viewBox={`0 0 ${width} ${height}`}
        preserveAspectRatio="xMidYMid meet"
        aria-label="Caio Ogata Logo"
      >
        <defs>
          <mask id={maskId}>
            {pixels.map((p) => (
              <motion.rect
                key={`${p.r}-${p.c}`}
                x={p.x}
                y={p.y}
                width={pixelSize + 4}
                height={pixelSize + 4}
                fill="white"
                shapeRendering="crispEdges"
                initial="hidden"
                animate={isHovered && p.shouldFlicker ? 'hover' : 'visible'}
                variants={getVariants(p)}
              />
            ))}
          </mask>
        </defs>

        <g mask={`url(#${maskId})`}>
          {paths.map((d, i) => (
            <path key={i} d={d} fill={color} />
          ))}
        </g>
      </svg>
    </motion.div>
  )
}
