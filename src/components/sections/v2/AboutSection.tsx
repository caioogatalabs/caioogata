'use client'

import { useInView } from '@/hooks/useInView'
import { useScrollVideo } from '@/hooks/useScrollVideo'
import { Grid, GridItem } from '@/components/layout/Grid'
import { StickyLogoBar } from '@/components/sections/v2/StickyLogoBar'
import content from '@/content/en.json'
import type { Content } from '@/content/types'

const typedContent = content as unknown as Content
const about = typedContent.about

const PULL_QUOTES = [
  'My work bridges brand strategy, product craft, and technical implementation — designing and building at the intersection of design systems, developer experience, and product engineering.',
  'Engineering rigor and design craft aren\u2019t opposites. The products I\u2019m proudest of happened when both disciplines were solving the same problem.',
]

export function AboutSection() {
  const { containerRef, canvasRef, progress } = useScrollVideo()
  const contentRef = useInView({ threshold: 0.1, once: true })

  const paragraphs = about.bio.split('\n\n')

  return (
    <div className="min-h-screen bg-bg">
      {/* Hero zone */}
      <div className="bg-bg-surface-secondary pt-8 md:pt-10 lg:pt-12">
        <StickyLogoBar />

        {/* Scroll-driven video hero */}
        <div
          ref={containerRef}
          style={{ height: '400vh' }}
        >
          <div className="sticky top-0 h-screen w-full overflow-hidden">
            {/* Canvas — fills viewport */}
            <canvas
              ref={canvasRef}
              className="absolute inset-0 w-full h-full object-cover"
              style={{ objectFit: 'cover' }}
            />

            {/* Overlaid headline + expertise tags */}
            <div className="absolute inset-0 flex flex-col justify-end px-5 pb-12 md:px-8 md:pb-16 lg:px-16 lg:pb-20">
              <h1
                className="text-4xl md:text-6xl lg:text-7xl font-light text-text-primary mb-6 max-w-4xl leading-tight"
                style={{ fontFamily: 'var(--font-sans)' }}
              >
                Bridging brand strategy, product craft, and technical implementation
              </h1>
              <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
                {about.expertise.map((item, i) => (
                  <span
                    key={item}
                    className="font-mono text-sm text-text-secondary"
                  >
                    {item}
                    {i < about.expertise.length - 1 && (
                      <span className="ml-2 text-text-tertiary">/</span>
                    )}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
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

          {/* Right column: bio + pull quotes */}
          <GridItem
            span={6}
            tabletSpan={6}
            mobileSpan={4}
            ref={contentRef as React.RefObject<HTMLDivElement>}
          >
            {paragraphs.map((paragraph, i) => (
              <div key={i}>
                <p
                  className={`-entrance -slide-up -a-${i} text-base md:text-lg text-text-primary leading-relaxed mb-6`}
                  style={{ fontFamily: 'var(--font-sans)' }}
                >
                  {paragraph}
                </p>

                {/* Pull quote after first paragraph */}
                {i === 0 && (
                  <blockquote
                    className="-entrance -scale-in -a-1 bg-bg-surface-secondary rounded-xl p-6 md:p-8 my-8 md:my-12"
                  >
                    <p
                      className="text-xl md:text-2xl lg:text-3xl font-light text-text-primary leading-snug"
                      style={{ fontFamily: 'var(--font-sans)', fontWeight: 300 }}
                    >
                      {PULL_QUOTES[0]}
                    </p>
                  </blockquote>
                )}

                {/* Pull quote before last paragraph */}
                {i === paragraphs.length - 2 && PULL_QUOTES[1] && (
                  <blockquote
                    className="-entrance -scale-in -a-3 bg-bg-surface-secondary rounded-xl p-6 md:p-8 my-8 md:my-12"
                  >
                    <p
                      className="text-xl md:text-2xl lg:text-3xl font-light text-text-primary leading-snug"
                      style={{ fontFamily: 'var(--font-sans)', fontWeight: 300 }}
                    >
                      {PULL_QUOTES[1]}
                    </p>
                  </blockquote>
                )}
              </div>
            ))}
          </GridItem>
        </Grid>
      </div>
    </div>
  )
}
