import Image from 'next/image'

/**
 * The frame every project cover sits in.
 *
 * The covers are not a consistent shape — 2.11 on the Azion site, 1.00 on the
 * Console Kit, 1.51 on Huia, and the Design System has no image at all. Dropped
 * straight into a fixed box under `object-cover`, the square one was gutted,
 * the panoramic one lost its top and bottom, and the one without an image was
 * an empty rectangle. So the frame is constant and the image sits inside it:
 * a neutral panel, and a window at screen proportion floating on it.
 *
 * The window is 16:10 at 86% of the panel width. The panel is taller than the
 * window, after bymonolog.com's Success Stories: 3:2 from tablet up, which
 * leaves a near-even margin (47px sides, 44px top and bottom at 1440 — a 16:10
 * panel gave only 30px vertically and the box read squat), and square on
 * mobile, where a 16:10 panel was a thin strip. The image fills the window
 * rather than fitting inside it — the window is already a screen shape, so
 * cropping to it is what makes every project read the same. Assets are 16:10
 * 1920x1200 (PROJECTS-GUIDE.md › Home Cover).
 *
 * No browser chrome. The margin and the corner do the work; drawing a title bar
 * with three dots is a portfolio cliché and fights the rest of the page.
 *
 * The panel is `surface-primary` and not `secondary`: secondary sits at L 0.15
 * against the page's 0.17, so it read as a hole rather than as ground. Primary
 * is 0.22 and lifts away from the page, which is what a ground has to do.
 *
 * With no image the panel stands on its own, which is the whole point of having
 * a panel rather than a bare box.
 */
export function ProjectCover({ src, alt = '' }: { src?: string; alt?: string }) {
  return (
    <div className="relative flex aspect-square w-full items-center md:aspect-[3/2] justify-center overflow-hidden bg-bg-surface-primary">
      {src && (
        <div className="relative aspect-[16/10] w-[86%] overflow-hidden rounded-[3px] bg-bg-surface-secondary">
          <Image
            src={src}
            alt={alt}
            fill
            sizes="(min-width: 1024px) 50vw, 90vw"
            className="object-cover"
          />
        </div>
      )}
    </div>
  )
}
