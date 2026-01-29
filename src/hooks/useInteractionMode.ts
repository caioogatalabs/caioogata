'use client'

import { useState, useEffect, useCallback } from 'react'

/**
 * Interaction modes for adaptive UI
 * - keyboard: User is actively using keyboard (default/fallback)
 * - mouse: User is using mouse (clicks or movement detected)
 * - touch: User is on touch device (mobile/tablet)
 */
export type InteractionMode = 'keyboard' | 'mouse' | 'touch'

/**
 * Device types for responsive content
 * - desktop: Desktop/laptop computer
 * - tablet: iPad or Android tablet
 * - mobile: Smartphone
 */
export type DeviceType = 'desktop' | 'tablet' | 'mobile'

interface InteractionState {
  mode: InteractionMode
  device: DeviceType
  isTouchDevice: boolean
  isTablet: boolean
  isMobile: boolean
  isKeyboardActive: boolean
  isMouseActive: boolean
}

// Debounce timeout for mode switching (ms)
const MODE_SWITCH_DELAY = 150

/**
 * Hook to detect device type and interaction mode
 *
 * Detection Rules:
 * 1. Device detection runs once on mount (SSR-safe)
 * 2. Interaction mode updates in real-time based on user input
 * 3. Keyboard is the fallback mode when detection is inconclusive
 *
 * Adding new rules:
 * - Add new InteractionMode or DeviceType to the types above
 * - Add detection logic in the appropriate useEffect
 * - Update the return object with new state
 */
export function useInteractionMode(): InteractionState {
  const [mode, setMode] = useState<InteractionMode>('keyboard')
  const [device, setDevice] = useState<DeviceType>('desktop')
  const [isTouchDevice, setIsTouchDevice] = useState(false)

  // Detect device type on mount
  useEffect(() => {
    if (typeof window === 'undefined') return

    const detectDevice = () => {
      const ua = navigator.userAgent.toLowerCase()
      const hasTouchScreen = 'ontouchstart' in window || navigator.maxTouchPoints > 0

      // Detect tablet (iPad or Android tablet)
      const isIPad = /ipad/.test(ua) || (navigator.platform === 'MacIntel' && hasTouchScreen)
      const isAndroidTablet = /android/.test(ua) && !/mobile/.test(ua)
      const isTablet = isIPad || isAndroidTablet

      // Detect mobile (smartphone)
      const isMobileDevice = /iphone|ipod|android.*mobile|windows phone|blackberry/.test(ua)

      setIsTouchDevice(hasTouchScreen)

      if (isMobileDevice) {
        setDevice('mobile')
        setMode('touch')
      } else if (isTablet) {
        setDevice('tablet')
        setMode('touch')
      } else {
        setDevice('desktop')
        // Desktop defaults to keyboard, will switch to mouse if detected
      }
    }

    detectDevice()
  }, [])

  // Track interaction mode changes
  useEffect(() => {
    if (typeof window === 'undefined') return

    let modeTimeout: NodeJS.Timeout | null = null

    const setModeDebounced = (newMode: InteractionMode) => {
      if (modeTimeout) clearTimeout(modeTimeout)
      modeTimeout = setTimeout(() => setMode(newMode), MODE_SWITCH_DELAY)
    }

    // Keyboard detection
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ignore modifier keys alone
      if (['Shift', 'Control', 'Alt', 'Meta'].includes(e.key)) return
      setMode('keyboard')
    }

    // Mouse detection
    const handleMouseMove = () => {
      // Only switch to mouse if not on touch device
      if (!isTouchDevice) {
        setModeDebounced('mouse')
      }
    }

    const handleMouseDown = () => {
      if (!isTouchDevice) {
        setMode('mouse')
      }
    }

    // Touch detection
    const handleTouchStart = () => {
      setMode('touch')
    }

    // Add listeners
    window.addEventListener('keydown', handleKeyDown)
    window.addEventListener('mousemove', handleMouseMove)
    window.addEventListener('mousedown', handleMouseDown)
    window.addEventListener('touchstart', handleTouchStart)

    return () => {
      if (modeTimeout) clearTimeout(modeTimeout)
      window.removeEventListener('keydown', handleKeyDown)
      window.removeEventListener('mousemove', handleMouseMove)
      window.removeEventListener('mousedown', handleMouseDown)
      window.removeEventListener('touchstart', handleTouchStart)
    }
  }, [isTouchDevice])

  return {
    mode,
    device,
    isTouchDevice,
    isTablet: device === 'tablet',
    isMobile: device === 'mobile',
    isKeyboardActive: mode === 'keyboard',
    isMouseActive: mode === 'mouse',
  }
}
