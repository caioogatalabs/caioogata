'use client'
import { forwardRef, type ReactNode, type HTMLAttributes } from 'react'

interface GridProps extends HTMLAttributes<HTMLDivElement> {
  children?: ReactNode
}

interface GridItemProps extends HTMLAttributes<HTMLDivElement> {
  span?: number       // desktop span (out of 12)
  tabletSpan?: number // tablet span (out of 8)
  mobileSpan?: number // mobile span (out of 4)
  children?: ReactNode
}

// Static class maps — Tailwind needs literal strings at build time
const MOBILE_SPAN: Record<number, string> = {
  1: 'col-span-1', 2: 'col-span-2', 3: 'col-span-3', 4: 'col-span-4',
}
const TABLET_SPAN: Record<number, string> = {
  1: 'md:col-span-1', 2: 'md:col-span-2', 3: 'md:col-span-3', 4: 'md:col-span-4',
  5: 'md:col-span-5', 6: 'md:col-span-6', 7: 'md:col-span-7', 8: 'md:col-span-8',
}
const DESKTOP_SPAN: Record<number, string> = {
  1: 'lg:col-span-1', 2: 'lg:col-span-2', 3: 'lg:col-span-3', 4: 'lg:col-span-4',
  5: 'lg:col-span-5', 6: 'lg:col-span-6', 7: 'lg:col-span-7', 8: 'lg:col-span-8',
  9: 'lg:col-span-9', 10: 'lg:col-span-10', 11: 'lg:col-span-11', 12: 'lg:col-span-12',
}

export const Grid = forwardRef<HTMLDivElement, GridProps>(function Grid(
  { className = '', children, ...props },
  ref
) {
  return (
    <div
      ref={ref}
      className={`grid grid-cols-4 gap-4 px-5 md:grid-cols-8 md:gap-5 md:px-8 lg:grid-cols-12 lg:px-16 ${className}`.trim()}
      {...props}
    >
      {children}
    </div>
  )
})

export const GridItem = forwardRef<HTMLDivElement, GridItemProps>(function GridItem(
  { span, tabletSpan, mobileSpan, className = '', style, children, ...props },
  ref
) {
  const classes: string[] = []
  if (mobileSpan) classes.push(MOBILE_SPAN[mobileSpan] ?? '')
  if (tabletSpan) classes.push(TABLET_SPAN[tabletSpan] ?? '')
  if (span) classes.push(DESKTOP_SPAN[span] ?? '')
  if (className) classes.push(className)

  return (
    <div
      ref={ref}
      className={classes.filter(Boolean).join(' ') || undefined}
      style={style}
      {...props}
    >
      {children}
    </div>
  )
})
