/**
 * The site's mono label, as the home header sets it: JetBrains Mono 12px,
 * semibold, 1.2 line height, 1.2px tracking, secondary text at half strength.
 * Kickers, data stamps, metadata and the footer rows all use it.
 *
 * `LABEL_TYPE` is the same style without the opacity, for elements that
 * animate their own opacity (`-entrance -fade`, motion) — there the 50% goes
 * on an inner span, or the animation's end value would override it.
 */
export const LABEL_TYPE =
  'font-mono text-[12px] font-semibold leading-[1.2] tracking-[1.2px] text-text-secondary'

export const LABEL = `${LABEL_TYPE} opacity-50`
