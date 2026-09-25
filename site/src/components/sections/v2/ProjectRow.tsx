'use client'

import { ProjectCover } from '@/components/sections/v2/ProjectCover'
import { useInView } from '@/hooks/useInView'
import { LABEL } from '@/components/ui/label'
import { useLanguage } from '@/components/providers/LanguageProvider'

interface ProjectRowProps {
  title: string
  slug: string
  year?: string
  index: number
  /** Two-line summary of the project. Not the full description — that is 300+ chars. */
  summary: string
  cover?: string
  /** The cover element, handed to `ProjectsGrid`, which watches it against the centre line. */
  rowRef?: (el: HTMLElement | null) => void
}

/**
 * One project in the middle column of the home list: the cover, and the copy
 * that belongs to it.
 *
 * The copy is only painted here below lg. From lg up the list carries one text
 * at a time, held at the centre of the screen by `ProjectsGrid`, so the copy in
 * the row goes `sr-only` — still in the document and still attached to its own
 * project for anyone reading with assistive tech, just not drawn twice.
 *
 * Square corners. The cover enters as the row touches the viewport; below lg
 * the copy follows once the row reaches the middle of the screen.
 */
export function ProjectRow({
  title,
  slug,
  year,
  index,
  summary,
  cover,
  rowRef,
}: ProjectRowProps) {
  const { localize } = useLanguage()

  // The image announces the row as soon as it touches the viewport.
  const imageRef = useInView({ threshold: 0.1, once: true })

  // The copy waits until the row reaches the middle of the screen. Shrinking the
  // observation box to a thin band turns "is it visible" into "has it reached
  // this line", with no extra hook and no scroll listener. The band's BOTTOM
  // edge is what the column's top crosses, so `-50%` at the bottom puts the
  // trigger exactly on the vertical centre rather than just below it.
  const textRef = useInView({ threshold: 0, rootMargin: '-45% 0px -50% 0px', once: true })

  // `imageRef` fires the cover's own entrance; `rowRef` is how the grid finds
  // the cover's top edge to know when the copy is due. One element, two
  // readers, so the callback feeds both.
  const setImageRef = (el: HTMLDivElement | null) => {
    ;(imageRef as React.MutableRefObject<HTMLElement | null>).current = el
    rowRef?.(el)
  }

  return (
    <article className="flex flex-col gap-4">
      <div
        ref={textRef as React.RefObject<HTMLDivElement>}
        className="flex flex-col gap-2 lg:sr-only"
      >
        <span className={`-entrance -mask-down -a-0 ${LABEL}`}>
          {['prj', year].filter(Boolean).join('_')} // {String(index).padStart(3, '0')}
        </span>
        <h3 className="-entrance -mask-down -a-1 text-balance text-2xl font-semibold text-text-primary">
          {title}
        </h3>
      </div>

      {/* The observer goes on the wrapper and the entrance on the <a> inside:
          `-mask-down` hides its own element with `clip-path`, and
          IntersectionObserver measures the target through that clip, so an
          observed element wearing it reports ratio 0 and never fires. */}
      <div ref={setImageRef}>
        <a
          href={localize(`/projects/${slug}`)}
          className="-entrance -mask-down block w-full"
          aria-label={`View ${title} project`}
        >
          <ProjectCover src={cover} priority={index === 1} />
        </a>
      </div>

      <p className="-entrance -mask-down -a-1 text-balance text-body-md leading-[1.5] text-text-secondary lg:sr-only">
        {summary}
      </p>
    </article>
  )
}
