'use client'

import type { ProjectSection } from '@/content/types'
import { useScrollReveal } from '@/hooks/useScrollReveal'

interface ProjectGalleryFullBleedProps {
  section: ProjectSection
}

/** Foreground image with scroll-reveal entrance (sub-component for hooks rule) */
function RevealForeground({ src, alt }: { src: string; alt: string }) {
  const { ref, clipPath } = useScrollReveal()
  return (
    <div
      ref={ref as React.RefObject<HTMLDivElement>}
      style={{ clipPath }}
    >
      <img
        src={src}
        alt={alt}
        loading="lazy"
        className="w-full rounded-[12px] block"
      />
    </div>
  )
}

export function ProjectGalleryFullBleed({ section }: ProjectGalleryFullBleedProps) {
  if (!section.bgImage || !section.fgImage) return null

  return (
    <section className="relative py-24">
      {/* Background: 100vw bleed, breaks padded parent */}
      <div
        className="relative w-screen"
        style={{ left: '50%', transform: 'translateX(-50%)' }}
      >
        <img
          src={section.bgImage}
          alt={section.bgAlt || ''}
          loading="lazy"
          className="w-full object-cover block"
        />
        {/* Overlay: bg-bg at 60% opacity */}
        <div
          className="absolute inset-0 bg-bg"
          style={{ opacity: 0.6 }}
        />
      </div>

      {/* Foreground: centered with responsive width + scroll-reveal */}
      <div
        className="relative z-10 mx-auto max-w-[90%] md:max-w-[75%] lg:max-w-[66.666%]"
        style={{ marginTop: '-12%' }}
      >
        <RevealForeground src={section.fgImage} alt={section.fgAlt || ''} />
      </div>
    </section>
  )
}
