'use client'

import { useMemo } from 'react'
import { useInView } from '@/hooks/useInView'
import { useScrollVideo } from '@/hooks/useScrollVideo'
import { Grid, GridItem } from '@/components/layout/Grid'
import { StickyLogoBar } from '@/components/sections/v2/StickyLogoBar'
import content from '@/content/en.json'
import type { Content } from '@/content/types'

const typedContent = content as unknown as Content
const about = typedContent.about

/**
 * Scroll-driven transitions synced to video progress.
 * Headline exits at 45–55%. Core Expertise enters at 50–60% (overlaps with headline exit).
 */
function useScrollTransitions(progress: number) {
  return useMemo(() => {
    const headlineT = Math.max(0, Math.min(1, (progress - 0.45) / 0.10))

    // Tags: fade in 50–60%, visible 60–85%, fade out 85–95%
    const tagsIn = Math.max(0, Math.min(1, (progress - 0.50) / 0.10))
    const tagsOut = Math.max(0, Math.min(1, (progress - 0.85) / 0.10))
    const tagsOpacity = tagsIn - tagsOut

    return {
      headline: {
        opacity: 1 - headlineT,
        transform: `translateY(${-headlineT * 40}px)`,
        pointerEvents: (headlineT === 1 ? 'none' : 'auto') as React.CSSProperties['pointerEvents'],
      },
      tags: {
        opacity: tagsOpacity,
        transform: `translateY(${(1 - tagsIn) * 20}px)`,
        pointerEvents: (tagsOpacity === 0 ? 'none' : 'auto') as React.CSSProperties['pointerEvents'],
      },
    }
  }, [progress])
}

export function AboutSection() {
  const { containerRef, canvasRef, progress } = useScrollVideo()
  const contentRef = useInView({ threshold: 0.1, once: true })
  const { headline: headlineStyle, tags: tagsStyle } = useScrollTransitions(progress)

  const paragraphs = about.bio.split('\n\n')

  return (
    <div className="min-h-screen bg-bg">
      {/* Hero block — video bg + sticky overlay content */}
      <div
        ref={containerRef}
        style={{ height: '200vh' }}
      >
        <div className="sticky top-0 w-full overflow-hidden relative">
          {/* Video canvas — absolute, fills entire sticky hero */}
          <canvas
            ref={canvasRef}
            className="absolute inset-0 w-full h-full"
            style={{ objectFit: 'cover', objectPosition: 'center bottom' }}
          />

          {/* BG overlay — 70% opacity for text readability */}
          <div
            className="absolute inset-0 bg-bg"
            style={{ opacity: 0.7 }}
          />

          {/* Hero content — same structure as ProjectPageShell + ProjectHero */}
          <div className="relative z-10">
            {/* StickyLogoBar — transparent, same position as projects */}
            <div className="pt-8 md:pt-10 lg:pt-12">
              <StickyLogoBar />
            </div>

            {/* Hero text — same padding as ProjectHero text section */}
            <div className="flex flex-col justify-end pt-32 pb-8 md:pt-40 md:pb-10 lg:pt-48 lg:pb-12">
              <Grid>
                <GridItem span={12} tabletSpan={8} mobileSpan={4}>
                  <span className="block font-mono text-xs uppercase tracking-[0.88px] text-text-tertiary mb-6 -entrance -fade -a-0">
                    ABT_2026 // ABOUT
                  </span>
                </GridItem>

                <GridItem span={4} tabletSpan={8} mobileSpan={4} />

                <GridItem span={8} tabletSpan={8} mobileSpan={4}>
                  {/* Headline — slides up and out synced to video scroll */}
                  <div style={headlineStyle}>
                    <h1
                      className="text-[48px] leading-[1.15] tracking-[-0.96px] text-text-primary"
                      style={{ fontFamily: 'var(--font-sans)' }}
                    >
                      Bridging brand strategy, product craft, and technical implementation
                    </h1>
                  </div>
                </GridItem>
              </Grid>
            </div>
          </div>
        </div>
      </div>

      {/* Core Expertise — fixed in dark area below hero, synced to video scroll */}
      <div
        className="fixed bottom-0 left-0 right-0 z-30 px-5 md:px-8 lg:px-16 pb-8 md:pb-12 lg:pb-16"
        style={tagsStyle}
      >
        <Grid className="!px-0">
          <GridItem span={6} tabletSpan={2} mobileSpan={4} />
          <GridItem span={6} tabletSpan={6} mobileSpan={4}>
            <div className="flex flex-col w-full">
              <span
                className="text-sm font-medium uppercase tracking-[1.12px] text-text-tertiary py-3"
                style={{ fontFamily: 'var(--font-sans)' }}
              >
                Core Expertise
              </span>
              {about.expertise.map((item) => (
                <p
                  key={item}
                  className="text-base text-text-primary py-3 border-t border-border-secondary"
                  style={{ fontFamily: 'var(--font-sans)' }}
                >
                  {item}
                </p>
              ))}
            </div>
          </GridItem>
        </Grid>
      </div>

      {/* Editorial content zone */}
      <div className="px-5 md:px-8 lg:px-16 py-16 md:py-24 lg:py-32">
        <Grid className="!px-0">
          {/* Left column: empty for asymmetric editorial feel */}
          <GridItem
            span={6}
            tabletSpan={2}
            mobileSpan={4}
          />

          {/* Right column: bio */}
          <GridItem
            span={6}
            tabletSpan={6}
            mobileSpan={4}
            ref={contentRef as React.RefObject<HTMLDivElement>}
          >
            {paragraphs.map((paragraph, i) => (
              <p
                key={i}
                className={`-entrance -slide-up -a-${i} text-base md:text-lg text-text-primary leading-relaxed mb-6`}
                style={{ fontFamily: 'var(--font-sans)' }}
              >
                {paragraph}
              </p>
            ))}
          </GridItem>
        </Grid>
      </div>
    </div>
  )
}
