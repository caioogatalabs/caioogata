'use client'
import { useEffect } from 'react'

export function useFontReady() {
  useEffect(() => {
    const html = document.documentElement

    document.fonts.ready.then(() => {
      html.classList.add('-loaded')
      // Small delay to ensure layout is stable before animations fire
      requestAnimationFrame(() => {
        html.classList.add('-ready')
      })
    })
  }, [])
}
