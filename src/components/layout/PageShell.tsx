'use client'
import { useEffect } from 'react'
import Lenis from 'lenis'
import { useFontReady } from '@/hooks/useFontReady'
import { IntroSection } from '@/components/sections/v2/IntroSection'
import { MenuSection } from '@/components/sections/v2/MenuSection'
import { ProjectsGrid } from '@/components/sections/v2/ProjectsGrid'
import content from '@/content/en.json'
import type { Content } from '@/content/types'

const typedContent = content as unknown as Content

export function PageShell() {
  useEffect(() => {
    // SSR guard — useEffect already only runs on client, but matchMedia needs window.
    if (typeof window === 'undefined') return

    // Reduced-motion: skip Lenis entirely (one-time check at mount; static export, no need to subscribe).
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    const lenis = new Lenis({ lerp: 0.1, smoothWheel: true })
    let rafId = 0
    const raf = (time: number) => {
      lenis.raf(time)
      rafId = requestAnimationFrame(raf)
    }
    rafId = requestAnimationFrame(raf)

    return () => {
      cancelAnimationFrame(rafId)
      lenis.destroy()
    }
  }, [])

  useFontReady()
  return (
    <>
      <IntroSection />
      <MenuSection content={typedContent.menu} />
      <ProjectsGrid />
    </>
  )
}
