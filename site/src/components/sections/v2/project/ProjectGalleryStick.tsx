'use client'

import { useEffect, useState } from 'react'
import type { ProjectImage, ProjectSection } from '@/content/types'
import { useScrollStick } from '@/hooks/useScrollStick'

interface ProjectGalleryStickProps {
  section: ProjectSection
}

/** Frame proportion before the images report their own — the home cover's. */
const FALLBACK_RATIO = 16 / 10

export function ProjectGalleryStick({ section }: ProjectGalleryStickProps) {
  const rows = section.rows || []

  // One slide per row: its first image, or a local muted loop
  const slidesMedia: ProjectImage[] = rows
    .map(row => row.images[0])
    .filter(Boolean)
    .map(img => (typeof img === 'string' ? { src: img, title: '' } : img))
    .filter(m => m.src)
  const slidesSrc = slidesMedia.map(m => m.src)

  const [reduced, setReduced] = useState(false)
  useEffect(() => {
    setReduced(window.matchMedia('(prefers-reduced-motion: reduce)').matches)
  }, [])

  const { containerRef, slides } = useScrollStick(slidesSrc.length || 1)

  // The tallest proportion among the slides (lowest width/height). On a screen
  // held upright the frame takes this shape, so the tallest image fills it
  // edge to edge and the wider ones sit centred inside it. Loading them here
  // also preloads every slide: an image translated below an overflow-hidden
  // frame never intersects the viewport, so `loading="lazy"` would only fetch
  // it at the moment it had to be on screen.
  const [frameRatio, setFrameRatio] = useState(FALLBACK_RATIO)
  const srcKey = slidesSrc.join('|')
  useEffect(() => {
    let cancelled = false
    Promise.all(
      slidesSrc.map(
        src =>
          new Promise<number>(resolve => {
            // A video reports its proportion from its metadata, which is also
            // what starts it loading ahead of its turn in the stack.
            if (slidesMedia.find(m => m.src === src)?.type === 'video') {
              const probe = document.createElement('video')
              probe.preload = 'metadata'
              probe.muted = true
              probe.onloadedmetadata = () => resolve(probe.videoWidth / probe.videoHeight)
              probe.onerror = () => resolve(Infinity)
              probe.src = src
              return
            }
            const probe = new Image()
            probe.onload = () => resolve(probe.naturalWidth / probe.naturalHeight)
            probe.onerror = () => resolve(Infinity)
            probe.src = src
          })
      )
    ).then(ratios => {
      const tallest = Math.min(...ratios)
      if (!cancelled && Number.isFinite(tallest)) setFrameRatio(tallest)
    })
    return () => {
      cancelled = true
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [srcKey])

  if (slidesSrc.length === 0) return null

  // One behaviour at every width: the slides pin and stack. There used to be a
  // plain vertical list below a breakpoint, which turned the gallery into an
  // ordinary column of images on the screens most people read the site on.
  return (
    <section>
      <div
        ref={containerRef}
        className="relative"
        style={{ height: `${slidesSrc.length * 100}vh` }}
      >
        {/* The gutter is the page's own — px-5 / px-8, the same values the
            Grid uses — so a pinned slide lines up with every other block
            instead of bleeding to the screen edge. */}
        <div className="sticky top-0 h-screen flex items-center justify-center px-5 md:px-8 lg:px-8">
          {/* Landscape: a frame of 80vh, which the images meet by height, so
              a slide rising by 100% of the frame rises by exactly its own
              height. Portrait: that frame is far taller than a landscape
              image drawn at the screen's width, and a slide entering from the
              frame's bottom started hundreds of pixels under the one it was
              meant to cover. There the frame takes the images' own
              proportion instead, and the clip edge is the image edge again. */}
          <div
            className="relative w-full h-[min(800px,80vh)] overflow-hidden portrait:h-auto portrait:aspect-(--stick-ratio)"
            style={{ '--stick-ratio': frameRatio } as React.CSSProperties}
          >
            {/* Static bg sheet — catches any gap behind released slides */}
            <div className="absolute inset-0 bg-bg" aria-hidden />
            {slidesMedia.map((media, i) => {
              const state = slides[i]
              if (!state) return null

              // Upright, the slide carries no fill of its own: the image that
              // rises is what covers the one below. A full-frame `bg-bg` rose
              // ahead of the picture and read as a black band wiping across
              // it. Landscape keeps the fill, where the image meets the frame
              // by height and the fill only covers the frame's sides.
              return (
                <div
                  key={i}
                  className="absolute inset-0 bg-bg flex items-center justify-center portrait:bg-transparent"
                  style={{
                    transform: `translateY(${state.translateY}%) scale(${state.scale})`,
                    opacity: state.opacity,
                    zIndex: i,
                    willChange: 'transform, opacity',
                  }}
                >
                  {media.type === 'video' && !(reduced && media.poster) ? (
                    <video
                      src={media.src}
                      poster={media.poster}
                      aria-label={media.title}
                      autoPlay
                      muted
                      loop
                      playsInline
                      preload="auto"
                      className="max-w-full max-h-full object-contain block"
                    />
                  ) : (
                    <img
                      src={media.type === 'video' ? media.poster : media.src}
                      alt=""
                      loading="eager"
                      className="max-w-full max-h-full object-contain block"
                    />
                  )}
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </section>
  )
}
