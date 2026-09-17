'use client'

import { useCallback, useEffect, useState } from 'react'
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
 * The frame is the clip's own proportion, near square: the source had a band of
 * empty dark below the shoulders, which left the figure floating above the
 * frame's lower edge. Cropping it at 964 of 1274 rows — where the picture
 * returns to its background — sets the figure's base on the frame's base
 * without touching the width, so the side margins and the columns are the ones
 * it always had.
 *
 * The portrait. WebM first — VP9 is ~40% of the H.264 file at the same read —
 * with MP4 behind it for Safari.
 *
 * The clip is the turn and its way back: the original 27 frames reversed and
 * then played forward, so frame 0 and the last frame are both the portrait
 * looking back — the same frame as the poster. Autoplaying the one-way clip
 * loaded on the poster (its last frame) and then jumped to its first, and the
 * head visibly dropped the moment playback started. Now nothing moves until
 * the reader asks for it, and it comes to rest where it began.
 */
const PORTRAIT = {
  webm: '/about/portrait-reverse.webm',
  mp4: '/about/portrait-reverse.mp4',
  poster: '/about/portrait-reverse-poster.webp',
} as const

/**
 * Played back slower than it was shot. The clip is 54 frames at 24fps; at 0.6
 * each frame is held ~69ms, so the round trip takes 3.7s instead of 2.25s.
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
 * sticky inner scrubbed 241 preloaded JPEGs — 9.8MB in `public/about-frames/`
 * — as you scrolled. The frames and `useScrollVideo` are still on disk in case
 * that comes back, but nothing loads them now: the block is normal height.
 *
 * The portrait here is a short loop rather than the still the home hero uses:
 * the first 1.1s of `branding/photography/estudos-pb/07-video-corpo-b.mp4`
 * reversed, which is the tail of the rotation — he arrives at the camera
 * instead of turning away from it, and it ends on the blink. The same element
 * feeds the distortion as a texture, so it decodes once and stays the fallback
 * wherever the canvas does not mount.
 *
 * The clip is padded rather than cropped: the source frames him tighter than
 * the still did, and at that magnification the same rotation sweeps more pixels
 * and reads faster than it is. It is scaled to 85% inside the frame, which puts
 * his head at the size and height the still had.
 *
 * The margin is filled by mirroring the frame's own edges outward
 * (`fillborders`), not with a flat colour. A flat near-black was the right
 * *value* — the source's corners measure #101010 — but it was dead smooth
 * against film grain, and the eye read that boundary as a box drawn over the
 * portrait. Mirroring carries the grain out with it and the edge disappears.
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
  const isWide = useIsWide()
  const imageRise = isWide ? progress * 320 : 0
  const textDrift = progress * 40

  // The fades stay staggered: the portrait clears first and leaves the
  // paragraph alone for a moment before it goes too.
  const outImage = slice(progress, 0.55, 0.85)
  const outText = slice(progress, 0.75, 1)

  const [portrait, setPortrait] = useState<HTMLVideoElement | null>(null)
  const reducedMotion = useReducedMotion()

  /**
   * The turn runs on the pointer, not on load. This block is the first thing on
   * /about, so an in-view trigger would fire at the same moment autoplay did.
   * A second hover while it runs is ignored — restarting mid-turn reads as a
   * stutter, not as a second arrival.
   */
  const playTurn = useCallback(() => {
    if (!portrait || reducedMotion) return
    if (!portrait.paused && portrait.currentTime > 0) return
    portrait.currentTime = 0
    void portrait.play()
  }, [portrait, reducedMotion])

  // `playbackRate` is a property, not an attribute — React cannot set it from
  // JSX, and it resets whenever the element loads a new source.
  useEffect(() => {
    if (!portrait) return
    const apply = () => {
      portrait.playbackRate = PLAYBACK_RATE
    }
    apply()
    portrait.addEventListener('loadedmetadata', apply)
    return () => portrait.removeEventListener('loadedmetadata', apply)
  }, [portrait])

  const { content } = useLanguage()
  const firstParagraph = content.about.bio.split('\n\n')[0]

  return (
    <div ref={ref} className="relative py-24 md:py-32 lg:py-40">
      <div className="w-full px-5 md:px-8 lg:px-8">
        <div className="grid grid-cols-4 md:grid-cols-8 lg:grid-cols-12 gap-4 md:gap-5 items-center">
          {/* Image — the right-hand half below `lg` (cols 3-4 of four, 5-8 of
              eight) and the four right-hand columns, 9-12, from `lg` up. Full
              width on a phone or a portrait tablet, a 3:4 portrait ran taller
              than the screen. z-10 so the paragraph layers on top. */}
          <div className="col-span-2 col-start-3 md:col-span-4 md:col-start-5 lg:col-span-4 lg:col-start-9 lg:row-start-1 z-10">
            {/* The trigger sits on the frame, not on the <video>: the
                distortion canvas covers the element, so a pointer entering the
                portrait never reaches the video itself. */}
            <div
              onPointerEnter={playTurn}
              className="relative w-full aspect-[960/964] overflow-hidden bg-bg-surface-secondary"
              style={{
                opacity: IMAGE_OPACITY * (1 - outImage),
                transform: `translateY(${-imageRise}px)`,
              }}
            >
              {/* A callback ref rather than useRef: the canvas has to re-render
                  once the element exists, and a ref object never triggers that. */}
              {/* Rests on the portrait looking back and runs the turn once
                  per hover, coming back to the same frame. No `loop`: the turn
                  is an arrival, and an arrival that repeats stops being one.
                  Reduced motion never starts it — the same contract
                  `LoopVideo` holds elsewhere. The element still mounts, so the
                  distortion can take its first frame. */}
              <video
                ref={setPortrait}
                poster={PORTRAIT.poster}
                aria-label="Caio Ogata"
                muted
                playsInline
                preload={reducedMotion ? 'metadata' : 'auto'}
                className="absolute inset-0 h-full w-full object-cover"
              >
                <source src={PORTRAIT.webm} type="video/webm" />
                <source src={PORTRAIT.mp4} type="video/mp4" />
              </video>
              <ClientDistortedImage
                video={portrait}
                revealOnMount
                revealDelayMs={200}
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
              portrait is near square on half the track, so its height is about
              half the track width; a negative margin of 22% of that width,
              less the row gap and the scroll drift, covers roughly the
              portrait's lower 45%. It was 34% while the portrait was 3:4 and a
              third taller — at the cropped proportion that reached 60% and put
              the text across the face. */}
          {/* The first line starts on column 4 of whichever grid is in force,
              derived rather than eyeballed. For a track of width W with gap g,
              column 4 begins at 3 columns + 3 gaps, which reduces to W/4 + g/4
              on the 12-col grid and 3W/8 + 3g/8 on the 8-col one. It was a flat
              `8em` before — 384px at this size, which on a 350px phone pushed
              the whole paragraph off screen. Mobile starts on column 2 of its
              four, W/4 + g/4 with the 16px gap. SplitText reads this off the
              parent and moves it onto the first line only. */}
          <div
            className="pointer-events-none col-span-4 md:col-span-8 md:col-start-1 lg:col-span-12 lg:col-start-1 lg:row-start-1 z-20 -mt-[22%] lg:mt-0 [--line1-indent:calc(25%_+_4px)] md:[--line1-indent:calc(37.5%_+_7.5px)] lg:[--line1-indent:calc(25%_+_5px)]"
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
