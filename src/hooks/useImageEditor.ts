'use client'

import { useReducer, useEffect, useRef, useCallback, useMemo } from 'react'
import { DEFAULT_FILTERS, EDITOR_PRESETS } from '@/lib/editor-presets'
import { renderToCanvas } from '@/lib/canvas-effects'
import type { FilterState } from '@/lib/editor-presets'

type FilterAction =
  | { type: 'SET_FILTER'; filter: keyof FilterState; value: number }
  | { type: 'APPLY_PRESET'; preset: Partial<FilterState> }
  | { type: 'RESET' }

function filterReducer(state: FilterState, action: FilterAction): FilterState {
  switch (action.type) {
    case 'SET_FILTER':
      return { ...state, [action.filter]: action.value }
    case 'APPLY_PRESET':
      return { ...DEFAULT_FILTERS, ...action.preset }
    case 'RESET':
      return DEFAULT_FILTERS
    default:
      return state
  }
}

export function useImageEditor(
  canvasRef: React.RefObject<HTMLCanvasElement | null>,
  sourceImage: HTMLImageElement | null
) {
  const [filters, dispatch] = useReducer(filterReducer, DEFAULT_FILTERS)
  const rafRef = useRef<number | null>(null)

  const setFilter = useCallback((filter: keyof FilterState, value: number) => {
    dispatch({ type: 'SET_FILTER', filter, value })
  }, [])

  const applyPreset = useCallback((presetName: string) => {
    const preset = EDITOR_PRESETS.find((p) => p.name === presetName)
    if (preset) {
      dispatch({ type: 'APPLY_PRESET', preset: preset.filters })
    }
  }, [])

  const reset = useCallback(() => {
    dispatch({ type: 'RESET' })
  }, [])

  const isDefault = useMemo(() => {
    return (Object.keys(DEFAULT_FILTERS) as (keyof FilterState)[]).every(
      (key) => filters[key] === DEFAULT_FILTERS[key]
    )
  }, [filters])

  // Render to canvas via requestAnimationFrame
  useEffect(() => {
    if (!canvasRef.current || !sourceImage) return

    if (rafRef.current) {
      cancelAnimationFrame(rafRef.current)
    }

    rafRef.current = requestAnimationFrame(() => {
      if (canvasRef.current && sourceImage) {
        renderToCanvas(canvasRef.current, sourceImage, filters)
      }
    })

    return () => {
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current)
      }
    }
  }, [filters, sourceImage, canvasRef])

  return { filters, setFilter, applyPreset, reset, isDefault }
}
