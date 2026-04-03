'use client'
import { forwardRef, type ElementType, type ReactNode, type HTMLAttributes } from 'react'

interface GridProps extends HTMLAttributes<HTMLElement> {
  as?: ElementType
  children: ReactNode
}

interface GridItemProps extends HTMLAttributes<HTMLElement> {
  as?: ElementType
  span?: number       // desktop span (out of 12)
  tabletSpan?: number // tablet span (out of 8)
  mobileSpan?: number // mobile span (out of 4)
  children: ReactNode
}

export const Grid = forwardRef<HTMLElement, GridProps>(function Grid(
  { as: Tag = 'div', className = '', children, ...props },
  ref
) {
  return (
    <Tag
      ref={ref}
      className={`mx-auto max-w-[1200px] grid grid-cols-4 gap-4 px-5 md:grid-cols-8 md:gap-5 md:px-8 lg:grid-cols-12 lg:px-16 ${className}`.trim()}
      {...props}
    >
      {children}
    </Tag>
  )
})

export const GridItem = forwardRef<HTMLElement, GridItemProps>(function GridItem(
  { as: Tag = 'div', span, tabletSpan, mobileSpan, className = '', style, children, ...props },
  ref
) {
  const gridStyle: React.CSSProperties = { ...style }

  // Build responsive grid-column via CSS custom properties
  // Desktop span applied directly; tablet/mobile handled via media queries in className
  if (span) {
    gridStyle.gridColumn = `span ${span}`
  }

  // For tablet and mobile spans, we use inline style with CSS that gets overridden
  // by the responsive Tailwind classes
  const responsiveClasses: string[] = []
  if (mobileSpan) {
    responsiveClasses.push(`col-span-${mobileSpan}`)
  }
  if (tabletSpan) {
    responsiveClasses.push(`md:col-span-${tabletSpan}`)
  }
  if (span) {
    responsiveClasses.push(`lg:col-span-${span}`)
    // Remove the inline style when using classes
    delete gridStyle.gridColumn
  }

  const allClasses = [...responsiveClasses, className].filter(Boolean).join(' ')

  return (
    <Tag
      ref={ref}
      className={allClasses || undefined}
      style={Object.keys(gridStyle).length > 0 ? gridStyle : style}
      {...props}
    >
      {children}
    </Tag>
  )
})
