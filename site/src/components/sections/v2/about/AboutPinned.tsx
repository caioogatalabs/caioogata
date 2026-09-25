'use client'

import { useEffect, useRef, useState } from 'react'
import { useInView } from '@/hooks/useInView'
import { useSectionExitProgress, slice } from '@/hooks/useScrollExitProgress'
import { SplitText } from '@/components/motion/SplitText'
import { useLanguage } from '@/components/providers/LanguageProvider'
import type { DistortedImageCanvasProps } from '@/components/three/DistortedImageCanvas'

/** Lazy-loaded client-only wrapper — same shape as the home's. */
function ClientDistortedImage(props: DistortedImageCanvasProps) {
  const [Component, setComponent] = useState<React.ComponentType<DistortedImageCanvasProps> | null>(null)

  useEffect(() => {
    import('@/components/three/DistortedImageCanvas').then(mod => {
      setComponent(() => mod.DistortedImageCanvas)
    })
  }, [])

  if (!Component) return null
  return <Component {...props} />
}

/** True while the reader asks for reduced motion. */
function useReducedMotion() {
  const [reduced, setReduced] = useState(false)
  useEffect(() => {
    const query = window.matchMedia('(prefers-reduced-motion: reduce)')
    const update = () => setReduced(query.matches)
    update()
    query.addEventListener('change', update)
    return () => query.removeEventListener('change', update)
  }, [])
  return reduced
}

/** `lg` and up, where portrait and paragraph sit side by side on one row. */
function useIsWide() {
  const [wide, setWide] = useState(false)
  useEffect(() => {
    const query = window.matchMedia('(min-width: 64rem)')
    const update = () => setWide(query.matches)
    update()
    query.addEventListener('change', update)
    return () => query.removeEventListener('change', update)
  }, [])
  return wide
}

/**
 * The portrait plays at full strength. The still it replaced was a lit colour
 * photograph and was held at 0.7 so the paragraph laid over it stayed readable;
 * this clip is a black-and-white study that is already mostly black (mean luma
 * 22%), and the same 0.7 over `bg-surface-secondary` lifted its blacks and read
 * as washed out. The darkness does the muting now.
 */
const IMAGE_OPACITY = 1

/**
 * The portrait. WebM first — VP9 is ~40% of the H.264 file at the same read —
 * with MP4 behind it for Safari.
 *
 * The arrival only: the first second of `07-video-corpo-b.mp4` — frames 0-26,
 * where he is already at the camera and turns away from it — played backwards,
 * so he turns toward the camera and stops on frame 0. That last frame is the
 * portrait, and the clip ends on it without a loop or a hold.
 *
 * It ran the turn and its way back before, the same 27 frames reversed and then
 * forward again. A round trip returns to where it started, so it could only be
 * a hover; half of it is the half that was wanted.
 *
 * Encoded at CRF 36 (VP9) and 26 (H.264) rather than the 32 and 20 it carried
 * as a round trip. The grain survives both — this is a black-and-white study
 * and the grain is the picture, so it was checked frame against frame at 1:1
 * before the numbers moved, and the next step down, 40 and 29, is where the
 * skin starts going waxy.
 */
const PORTRAIT = {
  webm: '/about/portrait-reverse.webm',
  mp4: '/about/portrait-reverse.mp4',
  poster: '/about/portrait-reverse-poster.webp',
} as const

/**
 * Played back slower than it was shot. The clip is 27 frames at 24fps; at 0.6
 * each frame is held ~69ms, so the turn takes 1.9s instead of 1.1s.
 * Done on the element rather than in the encode on purpose — there are no
 * frames to invent, so stretching it here or stretching it in ffmpeg look
 * identical, and this one is a number you can change without re-encoding.
 */
const PLAYBACK_RATE = 0.6


/**
 * AboutPinned — the opening block of /about: one portrait with the first
 * paragraph of the bio laid across it.
 *
 * No longer pinned, despite the name. It used to be a 400vh container whose
 * sticky inner scrubbed 241 preloaded JPEGs — 9.8MB, once in `public/about-frames/`
 * — as you scrolled. The frames now live in `.archive/site-public/about-frames/`
 * and `useScrollVideo` is gone, recoverable from git history if this comes back.
 *
 * The portrait here is a clip rather than the still the home hero uses: he
 * turns to the camera once as the page opens and stays there. The same element
 * feeds the distortion as a texture, so it decodes once and stays the fallback
 * wherever the canvas does not mount.
 *
 * The clip is the source's own frame, untouched: 1248x1656 is already 3:4 and
 * already sets his torso on the lower edge, so it scales straight to 960x1280.
 * An earlier pass scaled it to 85% inside the frame and mirrored the margin
 * outward to match the still's head size; that padding is what left the figure
 * floating, and cropping it back off shortened the frame by a third — which is
 * what pulled the whole block up against the version in production.
 *
 * On the way out the image leaves before the text, so the portrait clears and
 * the paragraph is left alone for a moment before it goes.
 */
export function AboutPinned() {
  // The whole traverse, from the block's top entering at the bottom edge to it
  // leaving through the top — not just the exit. The portrait has to outrun the
  // paragraph from the first pixel of scroll, and a window that only opens near
  // the end would leave them locked together until then.
  const { ref, progress } = useSectionExitProgress({ endFraction: -0.85 })

  // Opposite directions rather than merely different distances: the portrait
  // climbs while the paragraph drifts down against the scroll, so the gap they
  // open is the sum of both. That is what buys the separation without pinning
  // anything — pinning would be needed only to hold the sentence still, and it
  // is not still, it is just slower. The reference on alphamark.design runs its
  // three images the same way, one down and two up.
  //
  // Below `lg` the two share a column and the paragraph overlaps the portrait's
  // lower half, so the portrait holds still: rising, it would slide up under
  // the header and pull away from the text laid on it.
  // The portrait opens the way the home's does — the box masking down rather
  // than simply being there. `-entrance` needs an ancestor carrying `-inview`,
  // and the container's ref is already taken by the exit progress, so the
  // observer sits on the column instead.
  const portraitReveal = useInView({ threshold: 0.1, once: true })

  const isWide = useIsWide()
  const imageRise = isWide ? progress * 320 : 0
  const textDrift = progress * 40

  // The fades stay staggered: the portrait clears first and leaves the
  // paragraph alone for a moment before it goes too.
  const outImage = slice(progress, 0.55, 0.85)
  const outText = slice(progress, 0.75, 1)

  /**
   * The screen this block gets: a viewport less whatever stands above it.
   *
   * It is meant to load whole — the portrait's base on the page's bottom
   * margin, the paragraph's last line with it, nothing of either below the
   * fold. Sitting it there takes the height of the sticky header, which is not
   * a constant: it wraps to a different number of lines at each breakpoint, and
   * to another one whenever something is added to or taken out of it.
   *
   * So it is read rather than written down. This block is the first thing in
   * `main`, so its own distance from the top of the document is exactly what
   * sits above it, and nothing here feeds back into that: the measurement is a
   * position, and what it sets is a height.
   *
   * `svh` rather than `vh` because on a phone browser `vh` is the tallest the
   * viewport ever gets, with the toolbars retracted, which is not the screen
   * the page loads into. It is only applied from `lg` anyway, where the
   * portrait and the paragraph share a row and settle on the same base line.
   */
  const [aboveTop, setAboveTop] = useState<number | null>(null)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const measure = () => {
      setAboveTop(Math.round(el.getBoundingClientRect().top + window.scrollY))
    }
    measure()

    // What moves this block is the header changing height — it wraps to more
    // lines on a narrow window, and settles again once the fonts land. A
    // `resize` listener misses the second one, so watch the document instead:
    // it resizes for both, and `100svh` handles the viewport on its own.
    const observer = new ResizeObserver(measure)
    observer.observe(document.body)
    return () => observer.disconnect()
  }, [ref])

  /**
   * The screen left for the block: a floor, not a ceiling.
   *
   * On a window tall enough it holds the whole composition and the portrait's
   * base lands on the bottom margin. On a short one the block grows past it and
   * the base goes under the fold.
   *
   * It stays a floor on purpose. A ceiling was tried — the portrait giving up
   * width to fit the screen, its proportion intact — and the width it gives up
   * is the four columns: the picture is laid out at the column width on the
   * first paint and retracts off it once the header has been measured, which
   * reads as the page correcting itself. The portrait's left edge is on column
   * 9 and that is worth more than the fold.
   */
  const screenBelowHeader = aboveTop === null ? undefined : `calc(100svh - ${aboveTop}px)`

  const [portrait, setPortrait] = useState<HTMLVideoElement | null>(null)
  const reducedMotion = useReducedMotion()

  /**
   * The turn runs once, on load. It is the arrival: he is facing away when the
   * page opens and comes round to meet the reader, and there is nothing to
   * trigger because the block is the first thing on /about — it is already on
   * screen. No `loop`: an arrival that repeats stops being one, and the clip
   * ends on the frame it is meant to rest on anyway.
   *
   * Where it cannot run — a reader who asked for reduced motion, or a browser
   * that refused to play — the element is parked on the last frame rather than
   * left on the first, so the portrait is the portrait and not the back of his
   * head. `duration` is only known once metadata is in, so the seek waits for
   * it; `fastSeek` where it exists, since the target is a frame the decoder can
   * pick, not a timestamp that has to be exact.
   *
   * One starter, and only one. It played the turn twice before: the element
   * carried `autoplay`, which starts as soon as the data is there — often
   * before this effect runs at all — and then the effect rewound to 0 and
   * played it again, which read as the page loading the portrait twice. The
   * attribute is gone and this owns it, behind a ref so that a re-run — React
   * in development, or the reduced-motion query answering later — cannot start
   * a second one.
   */
  const turnRan = useRef(false)
  useEffect(() => {
    if (!portrait) return

    const rest = () => {
      const end = portrait.duration
      if (!Number.isFinite(end)) return
      portrait.pause()
      if (typeof portrait.fastSeek === 'function') portrait.fastSeek(end)
      else portrait.currentTime = end
    }

    // `playbackRate` is a property, not an attribute — React cannot set it from
    // JSX, and it resets whenever the element loads a new source.
    const start = () => {
      if (turnRan.current) return
      turnRan.current = true
      portrait.playbackRate = PLAYBACK_RATE
      if (reducedMotion) {
        rest()
        return
      }
      void portrait.play().catch(rest)
    }

    if (portrait.readyState >= HTMLMediaElement.HAVE_METADATA) start()
    else portrait.addEventListener('loadedmetadata', start, { once: true })
    return () => portrait.removeEventListener('loadedmetadata', start)
  }, [portrait, reducedMotion])

  const { content } = useLanguage()
  const firstParagraph = content.about.bio.split('\n\n')[0]

  return (
    <div
      ref={ref}
      className="relative py-24 md:py-32 lg:flex lg:flex-col lg:justify-end lg:py-8"
      style={{ minHeight: isWide ? screenBelowHeader : undefined }}
    >
      <div className="w-full px-5 md:px-8 lg:px-8">
        <div className="grid grid-cols-4 md:grid-cols-8 lg:grid-cols-12 gap-4 md:gap-5 items-center">
          {/* Image — the right-hand half below `lg` (cols 3-4 of four, 5-8 of
              eight) and the four right-hand columns, 9-12, from `lg` up. Full
              width on a phone or a portrait tablet, a 3:4 portrait ran taller
              than the screen. z-10 so the paragraph layers on top. */}
          <div
            ref={portraitReveal as React.RefObject<HTMLDivElement>}
            className="col-span-2 col-start-3 md:col-span-4 md:col-start-5 lg:col-span-4 lg:col-start-9 lg:row-start-1 z-10"
          >
            {/* `-mask-down` is the box opening, the same reveal the home hero
                uses, on the same 900ms curve. `-a-0` is 150ms, which is the
                paragraph's own `baseDelayMs`, so the picture and the sentence
                start on one beat.

                Only the clip-path half of `-mask-down` runs here: the variant
                also lifts 6px, and this box already carries an inline
                `transform` for the scroll exit, which wins over a stylesheet.
                The wipe is the reveal; the 6px was never the part you saw. */}
            <div
              className="-entrance -mask-down -a-0 relative w-full aspect-[3/4] overflow-hidden bg-bg-surface-secondary"
              style={{
                opacity: IMAGE_OPACITY * (1 - outImage),
                transform: `translateY(${-imageRise}px)`,
              }}
            >
              {/* A callback ref rather than useRef: the canvas has to re-render
                  once the element exists, and a ref object never triggers that. */}
              {/* The poster is the clip's own first frame — his back — so the
                  picture that stands here before the video decodes is the one
                  playback starts from, and there is no jump when it does. What
                  it comes to rest on is the last frame, which the effect above
                  parks it on wherever the turn cannot run. `muted` and
                  `playsInline` are what make playing it without a gesture
                  allowed at all; there is no `autoplay` attribute, because the
                  effect is the one thing that starts it. */}
              <video
                ref={setPortrait}
                poster={PORTRAIT.poster}
                aria-label="Caio Ogata"
                muted
                playsInline
                preload="auto"
                className="absolute inset-0 h-full w-full object-cover"
              >
                <source src={PORTRAIT.webm} type="video/webm" />
                <source src={PORTRAIT.mp4} type="video/mp4" />
              </video>
              <ClientDistortedImage
                video={portrait}
                revealOnMount
                revealDelayMs={150}
                idleGlitchMs={progress < 0.5 ? 5000 : 0}
              />
            </div>
          </div>

          {/* Paragraph — full 12 cols, z-20, so it reads over the portrait.
              `pointer-events-none` because it covers the image completely: the
              distortion is driven by pointermove, and without this the text
              layer would swallow every one of them. It is plain copy with no
              links, so nothing is lost. */}
          {/* Below `lg` the paragraph is pulled up over the portrait. The
              portrait is 3:4 on half the track, so its height is 2/3 of the
              track width; a negative margin of 22% of that width, less the row
              gap, starts the text just under the chin and covers roughly the
              portrait's lower 30%. It was 34% — the portrait's lower 45% —
              while the portrait was the still, which framed him small enough
              that 45% still cleared his face. The clip is framed tighter, and
              the same 45% ran the text across his eyes. */}
          {/* From `lg` the paragraph is a row of its own, and `items-center`
              would centre it on the portrait — which is where the face is.
              `self-end` sets its last line on the portrait's base instead, so
              it covers the lower 46% by the layout's own measure rather than
              by a number chosen for one viewport. In production the same band
              was an accident: the exit progress started at 0.43 at rest, so
              the portrait was drawn 145px above where it was laid out, and the
              paragraph read as low only because the picture had ridden up. */}
          {/* The first line starts on a column boundary of whichever grid is
              in force, derived rather than eyeballed. For a track of width W
              with gap g, column n begins at (n-1)(W + g)/12 on the 12-col grid.
              Desktop starts on column 5, the 4-4-4 split: W/3 + g/3, with the
              20px gap. The 8-col grid starts on column 4, 3W/8 + 3g/8. It was a flat
              `8em` before — 384px at this size, which on a 350px phone pushed
              the whole paragraph off screen. Mobile starts on column 2 of its
              four, W/4 + g/4 with the 16px gap. SplitText reads this off the
              parent and moves it onto the first line only. */}
          <div
            className="pointer-events-none col-span-4 md:col-span-8 md:col-start-1 lg:col-span-12 lg:col-start-1 lg:row-start-1 lg:self-end z-20 -mt-[22%] lg:mt-0 [--line1-indent:calc(25%_+_4px)] md:[--line1-indent:calc(37.5%_+_7.5px)] lg:[--line1-indent:calc(33.3333%_+_6.667px)]"
            style={{ opacity: 1 - outText, transform: `translateY(${textDrift}px)` }}
          >
            <SplitText
              type="line"
              text={firstParagraph}
              className="type-display text-text-primary"
              style={{ textIndent: 'var(--line1-indent)' }}
              staggerMs={120}
              durationMs={1100}
              baseDelayMs={150}
            />
          </div>
        </div>
      </div>
    </div>
  )
}
