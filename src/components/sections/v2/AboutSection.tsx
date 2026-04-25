'use client'

import { useEffect, useRef, useState } from 'react'
import { useScrollVideo } from '@/hooks/useScrollVideo'
import { StickyLogoBar } from '@/components/sections/v2/StickyLogoBar'
import { BioBlock } from '@/components/sections/v2/about/BioBlock'
import { SkillsBlock } from '@/components/sections/v2/about/SkillsBlock'
import { ClientsBlock } from '@/components/sections/v2/about/ClientsBlock'
import { EducationBlock } from '@/components/sections/v2/about/EducationBlock'

export function AboutSection() {
  const { containerRef, canvasRef } = useScrollVideo()
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
      {/* Hero scroll zone — drives both the sticky headline and the scroll-scrubbed video. */}
      <div ref={containerRef} style={{ height: '400vh' }} className="relative">
        {/* StickyLogoBar lives at the top of the hero zone (matches projects/home). */}
        <div className="pt-8 md:pt-10 lg:pt-12">
          <StickyLogoBar />
        </div>

        {/* Sticky vertical video — cols 9-12 on desktop, full-width on mobile/tablet.
            z-10 (below headline). Sticks at top:0 once it reaches the viewport top. */}
        <div className="sticky top-0 h-screen w-full pointer-events-none z-10">
          <div className="grid grid-cols-4 md:grid-cols-8 lg:grid-cols-12 gap-4 md:gap-5 px-5 md:px-8 lg:px-16 h-full">
            <div className="col-span-4 md:col-span-8 lg:col-span-4 lg:col-start-9 h-full flex items-center">
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

        {/* Sticky headline — full-width, home IntroSection typography 1:1.
            z-20 (above video). Sticks at top:0; while in the sticky zone the video slides up behind it. */}
        <div className="sticky top-0 z-20 pointer-events-none">
          <div className="min-h-screen flex items-end px-5 pb-8 md:px-8 md:pb-10 lg:px-16 lg:pb-12">
            <h1
              className="text-text-primary"
              style={{
                fontFamily: 'var(--font-sans)',
                fontSize: 'clamp(2.25rem, 5vw, 4.5rem)',
                fontWeight: 400,
                lineHeight: 1.15,
                letterSpacing: '-0.02em',
                maxWidth: '66%',
              }}
            >
              Bridging brand strategy, product craft and technical workflow
            </h1>
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
