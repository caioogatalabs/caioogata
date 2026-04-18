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
  handleKeyDown: (e: React.KeyboardEvent) => void
  isDimmed: (index: number) => boolean
}

export function useExperienceNavigation({
  itemCount,
  onExpand,
  onCollapse,
  containerRef,
}: UseExperienceNavigationOptions): UseExperienceNavigationReturn {
  const [activeIndex, setActiveIndex] = useState<number>(-1)
  const [hoveredIndex, setHoveredIndex] = useState<number>(-1)
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

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
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
          e.preventDefault()
          if (activeIndex >= 0) {
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
          }
          break
        }
        case 'Escape': {
          e.preventDefault()
          setExpandedSet(new Set())
          onCollapse(-1)
          break
        }
      }
    },
    [activeIndex, itemCount, onExpand, onCollapse]
  )

  return {
    activeIndex,
    hoveredIndex,
    highlightedIndex,
    setHoveredIndex,
    handleKeyDown,
    isDimmed,
  }
}
