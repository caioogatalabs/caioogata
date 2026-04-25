'use client'

import { useEffect, useRef, useState } from 'react'
import { useInView } from '@/hooks/useInView'
import { useScrollVideo } from '@/hooks/useScrollVideo'
import { StickyLogoBar } from '@/components/sections/v2/StickyLogoBar'
import { BioBlock } from '@/components/sections/v2/about/BioBlock'
import { SkillsBlock } from '@/components/sections/v2/about/SkillsBlock'
import { ClientsBlock } from '@/components/sections/v2/about/ClientsBlock'
import { EducationBlock } from '@/components/sections/v2/about/EducationBlock'

export function AboutSection() {
  const { containerRef, canvasRef } = useScrollVideo()
  const headlineRef = useInView({ threshold: 0.1, once: true })
  const [entered, setEntered] = useState(false)
  const reducedMotionRef = useRef(false)

  // Trigger slide-up entry once the hero container enters the viewport.
  // We watch the container itself so the entry plays as soon as the section starts entering.
  useEffect(() => {
    const node = containerRef.current
    if (!node) return
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    reducedMotionRef.current = prefersReduced
    if (prefersReduced) {
      setEntered(true)
      return
    }
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setEntered(true)
          obs.disconnect()
        }
      },
      { threshold: 0.05 }
    )
    obs.observe(node)
    return () => obs.disconnect()
  }, [containerRef])

  // After the entry slide-up completes, video is in its sticky anchor and scrub takes over via progress.
  // Slide transform: hidden = translateY(100%), visible = translateY(0).
  const slideStyle: React.CSSProperties = {
    transform: entered ? 'translateY(0)' : 'translateY(100%)',
    transition: reducedMotionRef.current
      ? 'none'
      : 'transform 1s cubic-bezier(0.16, 1, 0.3, 1)',
  }

  return (
    <div className="min-h-screen bg-bg">
      {/* Hero pin zone — the entire Hero composition (logo + spacer + headline) is sticky
          while the user scrolls through the 400vh zone. The video slides up from below
          and scrubs frames within this same pinned viewport. */}
      <div ref={containerRef} style={{ height: '400vh' }} className="relative">
        <div className="bg-bg-surface-secondary sticky top-0 h-screen overflow-hidden">
          <div className="relative flex flex-col h-full">
            {/* Logo at top */}
            <StickyLogoBar />

            {/* Spacer absorbs middle (with the video positioned inside, behind the headline) */}
            <div className="flex-1" aria-hidden />

            {/* Video container — absolute, cols 9-12, slide-up entry. z-10 (behind headline). */}
            <div className="absolute inset-0 z-10 pointer-events-none px-5 md:px-8 lg:px-16">
              <div className="grid grid-cols-4 md:grid-cols-8 lg:grid-cols-12 gap-4 md:gap-5 h-full">
                <div className="col-span-4 md:col-span-8 lg:col-span-4 lg:col-start-9 h-full flex items-end pb-8 md:pb-10 lg:pb-12">
                  <div
                    className="w-full aspect-[3/4] overflow-hidden bg-bg-surface-secondary"
                    style={slideStyle}
                  >
                    <canvas
                      ref={canvasRef}
                      className="block w-full h-full"
                      style={{ objectFit: 'cover' }}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Headline at bottom — full-width, home typography 1:1. z-20 (above video). */}
            <div
              ref={headlineRef as React.RefObject<HTMLDivElement>}
              className="-entrance -slide-up -a-2 relative z-20 px-5 pb-8 md:px-8 md:pb-10 lg:px-16 lg:pb-12"
            >
              <h1
                className="text-text-primary"
                style={{
                  fontFamily: 'var(--font-sans)',
                  fontSize: 'clamp(2.25rem, 5vw, 4.5rem)',
                  fontWeight: 400,
                  lineHeight: 1.15,
                  letterSpacing: '-0.02em',
                }}
              >
                Bridging brand strategy, product craft and technical workflow
              </h1>
            </div>
          </div>
        </div>
      </div>

      {/* About subsections — UNCHANGED. */}
      <BioBlock />
      <SkillsBlock />
      <ClientsBlock />
      <EducationBlock />
    </div>
  )
}
