'use client'

import { useReducer, useEffect, useRef, useCallback, useMemo } from 'react'
import {
  DEFAULT_FILTERS,
  EDITOR_PRESETS,
  resolvePreset,
  resolvePresetValue,
  getAnimatedKeys,
} from '@/lib/editor-presets'
import { renderToCanvas } from '@/lib/canvas-effects'
import type { FilterState } from '@/lib/editor-presets'

type FilterAction =
  | { type: 'SET_FILTER'; filter: keyof FilterState; value: number }
  | { type: 'SET_ALL'; filters: FilterState }
  | { type: 'RESET' }

function filterReducer(state: FilterState, action: FilterAction): FilterState {
  switch (action.type) {
    case 'SET_FILTER':
      return { ...state, [action.filter]: action.value }
    case 'SET_ALL':
      return action.filters
    case 'RESET':
      return DEFAULT_FILTERS
    default:
      return state
  }
}

const ANIMATION_INTERVAL = 180 // ms between range value changes

export function useImageEditor(
  canvasRef: React.RefObject<HTMLCanvasElement | null>,
  sourceImage: HTMLImageElement | null,
  crop?: { top: number; bottom: number }
) {
  const [filters, dispatch] = useReducer(filterReducer, DEFAULT_FILTERS)
  const rafRef = useRef<number | null>(null)
  const animationRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const activePresetRef = useRef<string | null>(null)

  const setFilter = useCallback((filter: keyof FilterState, value: number) => {
    dispatch({ type: 'SET_FILTER', filter, value })
  }, [])

  const stopAnimation = useCallback(() => {
    if (animationRef.current) {
      clearInterval(animationRef.current)
      animationRef.current = null
    }
  }, [])

  const applyPreset = useCallback((presetName: string) => {
    const preset = EDITOR_PRESETS.find((p) => p.name === presetName)
    if (!preset) return

    stopAnimation()
    activePresetRef.current = presetName

    // Resolve initial values
    dispatch({ type: 'SET_ALL', filters: resolvePreset(preset) })

    // Start animation for ranged values
    const animatedKeys = getAnimatedKeys(preset)
    if (animatedKeys.length > 0) {
      animationRef.current = setInterval(() => {
        for (const key of animatedKeys) {
          const val = preset.filters[key]
          if (val !== undefined) {
            dispatch({
              type: 'SET_FILTER',
              filter: key,
              value: resolvePresetValue(val),
            })
          }
        }
      }, ANIMATION_INTERVAL)
    }
  }, [stopAnimation])

  const reset = useCallback(() => {
    stopAnimation()
    activePresetRef.current = null
    dispatch({ type: 'RESET' })
  }, [stopAnimation])

  const isDefault = useMemo(() => {
    return (Object.keys(DEFAULT_FILTERS) as (keyof FilterState)[]).every(
      (key) => filters[key] === DEFAULT_FILTERS[key]
    )
  }, [filters])

  const activePresetName = activePresetRef.current

  // Render to canvas via requestAnimationFrame
  useEffect(() => {
    if (!canvasRef.current || !sourceImage) return

    if (rafRef.current) {
      cancelAnimationFrame(rafRef.current)
    }

    rafRef.current = requestAnimationFrame(() => {
      if (canvasRef.current && sourceImage) {
        renderToCanvas(canvasRef.current, sourceImage, filters, crop)
      }
    })

    return () => {
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current)
      }
    }
  }, [filters, sourceImage, canvasRef, crop])

  // Cleanup animation on unmount
  useEffect(() => {
    return () => stopAnimation()
  }, [stopAnimation])

  return { filters, setFilter, applyPreset, reset, isDefault, activePresetName }
}
