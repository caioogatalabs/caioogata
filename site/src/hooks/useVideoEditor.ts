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

const ANIMATION_INTERVAL = 180

export function useVideoEditor(
  canvasRef: React.RefObject<HTMLCanvasElement | null>,
  videoRef: React.RefObject<HTMLVideoElement | null>
) {
  const [filters, dispatch] = useReducer(filterReducer, DEFAULT_FILTERS)
  const rafRef = useRef<number | null>(null)
  const filtersRef = useRef(filters)
  const animationRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const activePresetRef = useRef<string | null>(null)

  filtersRef.current = filters

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

    dispatch({ type: 'SET_ALL', filters: resolvePreset(preset) })

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

  // Continuous render loop for video frames
  useEffect(() => {
    const canvas = canvasRef.current
    const video = videoRef.current
    if (!canvas || !video) return

    let running = true

    function renderLoop() {
      if (!running || !canvas || !video) return

      if (!video.paused && !video.ended && video.readyState >= 2) {
        renderToCanvas(canvas, video, filtersRef.current)
      }

      rafRef.current = requestAnimationFrame(renderLoop)
    }

    rafRef.current = requestAnimationFrame(renderLoop)

    return () => {
      running = false
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current)
      }
    }
  }, [canvasRef, videoRef])

  // Cleanup animation on unmount
  useEffect(() => {
    return () => stopAnimation()
  }, [stopAnimation])

  return { filters, setFilter, applyPreset, reset, isDefault, activePresetName }
}
