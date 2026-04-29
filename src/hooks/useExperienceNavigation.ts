'use client'

import { useState, useEffect, useCallback } from 'react'

interface UseExperienceNavigationOptions {
  itemCount: number
  onExpand: (index: number) => void
  onCollapse: (index: number) => void
  containerRef: React.RefObject<HTMLElement | null>
}

interface UseExperienceNavigationReturn {
  activeIndex: number
  hoveredIndex: number
  highlightedIndex: number
  setHoveredIndex: (index: number) => void
  isDimmed: (index: number) => boolean
}

/**
 * Keyboard navigation for the Experience listing.
 *
 * Handlers register on `window` (not the container) so the page is keyboard-
 * navigable from anywhere — mirrors the Menu behaviour on the home page.
 *
 * Conflict notes:
 * - ArrowLeft / ArrowRight are owned by <PageNavigation> (categories switch).
 *   This hook ignores them.
 * - Escape is also owned by <PageNavigation> (back to home). This hook leaves
 *   it alone too — there's no "collapse all" command in the new navbar; users
 *   collapse a row by pressing Enter again.
 *
 * Editable inputs (input/textarea/contentEditable) are skipped so typing in
 * the contact form doesn't move the experience selection.
 */
export function useExperienceNavigation({
  itemCount,
  onExpand,
  onCollapse,
  containerRef,
}: UseExperienceNavigationOptions): UseExperienceNavigationReturn {
  const [activeIndex, setActiveIndex] = useState<number>(-1)
  const [hoveredIndex, setHoveredIndex] = useState<number>(-1)
  // expandedSet is kept in sync with the parent's expandedIndex via onExpand/
  // onCollapse callbacks; this hook owns the keyboard semantics, the parent
  // owns the truth of which row is open.
  const [expandedSet, setExpandedSet] = useState<Set<number>>(new Set())

  // Hover takes precedence over keyboard
  const highlightedIndex = hoveredIndex >= 0 ? hoveredIndex : activeIndex

  const isDimmed = useCallback(
    (index: number): boolean => {
      return highlightedIndex >= 0 && highlightedIndex !== index
    },
    [highlightedIndex]
  )

  // Scroll active row into view on keyboard navigation
  useEffect(() => {
    if (activeIndex < 0 || !containerRef.current) return
    const rows = containerRef.current.querySelectorAll('[data-experience-row]')
    const row = rows[activeIndex]
    if (row) {
      row.scrollIntoView({ block: 'nearest', behavior: 'smooth' })
    }
  }, [activeIndex, containerRef])

  // Global keyboard listener — fires regardless of which element has focus,
  // so the page is keyboard-navigable from page load (no need to focus the
  // rows container first).
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      const target = e.target as HTMLElement | null
      if (!target) return
      const tag = target.tagName
      if (tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT') return
      if (target.isContentEditable) return

      switch (e.key) {
        case 'ArrowDown': {
          e.preventDefault()
          setActiveIndex((prev) => {
            if (prev < 0) return 0
            return (prev + 1) % itemCount
          })
          break
        }
        case 'ArrowUp': {
          e.preventDefault()
          setActiveIndex((prev) => {
            if (prev < 0) return itemCount - 1
            return (prev - 1 + itemCount) % itemCount
          })
          break
        }
        case 'Enter': {
          // Don't hijack Enter on form controls or links — only when a row is
          // active and the focus target is a non-interactive element.
          if (activeIndex < 0) return
          if (
            tag === 'BUTTON' ||
            tag === 'A' ||
            target.getAttribute('role') === 'button'
          ) {
            return
          }
          e.preventDefault()
          setExpandedSet((prev) => {
            const next = new Set(prev)
            if (next.has(activeIndex)) {
              next.delete(activeIndex)
              onCollapse(activeIndex)
            } else {
              next.add(activeIndex)
              onExpand(activeIndex)
            }
            return next
          })
          break
        }
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [activeIndex, itemCount, onExpand, onCollapse])

  return {
    activeIndex,
    hoveredIndex,
    highlightedIndex,
    setHoveredIndex,
    isDimmed,
  }
}
