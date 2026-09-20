/**
 * The site's label type: JetBrains Mono, -4% tracking, 1.4 line height,
 * secondary text at half strength. Two sizes and no others — 12px for kickers,
 * data stamps, metadata and footer rows, 14px where a label carries a block of
 * its own (hero technologies, stat captions, skill categories). Never
 * uppercase: the Figma sets these in sentence case.
 *
 * `LABEL_TYPE` / `LABEL_TYPE_LG` are the same styles without the opacity, for
 * elements that animate their own (`-entrance -fade`, motion) — there the 50%
 * goes on an inner span, or the animation's end value would override it.
 */
const LABEL_BASE = 'font-mono font-semibold leading-[1.4] tracking-[-0.04em] text-text-secondary'

export const LABEL_TYPE = `${LABEL_BASE} text-[12px]`
export const LABEL = `${LABEL_TYPE} opacity-50`

const LABEL_TYPE_LG = `${LABEL_BASE} text-[14px]`
export const LABEL_LG = `${LABEL_TYPE_LG} opacity-50`
