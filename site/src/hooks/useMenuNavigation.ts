'use client'

import { useState, useMemo, useEffect, useRef, useCallback } from 'react'
import type { MenuItem } from '@/content/types'

interface UseMenuNavigationOptions {
  items: MenuItem[]
  onSelect: (item: MenuItem) => void
  onEscape?: () => void
}

interface UseMenuNavigationReturn {
  activeIndex: number | null
  setActiveIndex: (index: number | null) => void
  filterText: string
  setFilterText: (text: string) => void
  filteredItems: MenuItem[]
  inputRef: React.RefObject<HTMLInputElement | null>
  hoveredIndex: number | null
  setHoveredIndex: (index: number | null) => void
}

export function useMenuNavigation({
  items,
  onSelect,
  onEscape,
}: UseMenuNavigationOptions): UseMenuNavigationReturn {
  const [activeIndex, setActiveIndex] = useState<number | null>(null)
  const [filterText, setFilterText] = useState('')
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null)
  const inputRef = useRef<HTMLInputElement | null>(null)

  // Filter items by label or description (case-insensitive)
  const filteredItems = useMemo(() => {
    if (!filterText.trim()) return items
    const query = filterText.toLowerCase()
    return items.filter(
      (item) =>
        item.label.toLowerCase().includes(query) ||
        (item.description && item.description.toLowerCase().includes(query))
    )
  }, [items, filterText])

  // Reset activeIndex when filter changes
  useEffect(() => {
    setActiveIndex(filterText ? 0 : null)
  }, [filterText])

  // Stable onSelect callback
  const handleSelect = useCallback(
    (item: MenuItem) => {
      onSelect(item)
    },
    [onSelect]
  )

  // Document-level keydown for keyboard navigation and type-to-filter
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement
      const isInput =
        target instanceof HTMLInputElement ||
        target instanceof HTMLTextAreaElement ||
        target.isContentEditable

      // If the user is in the menu input, handle navigation keys
      const isMenuInput = target === inputRef.current

      switch (e.key) {
        case 'ArrowDown': {
          e.preventDefault()
          if (filteredItems.length > 0) {
            setActiveIndex((prev) => prev === null ? 0 : (prev + 1) % filteredItems.length)
          }
          break
        }
        case 'ArrowUp': {
          e.preventDefault()
          if (filteredItems.length > 0) {
            setActiveIndex((prev) => prev === null ? filteredItems.length - 1 : (prev - 1 + filteredItems.length) % filteredItems.length)
          }
          break
        }
        case 'Enter': {
          e.preventDefault()
          if (filteredItems.length > 0 && activeIndex !== null && filteredItems[activeIndex]) {
            handleSelect(filteredItems[activeIndex])
          }
          break
        }
        case 'Escape': {
          e.preventDefault()
          setActiveIndex(null)
          if (filterText) {
            setFilterText('')
          }
          onEscape?.()
          break
        }
        default: {
          // Type-to-filter: if not in another input, focus the menu input
          // and let the character through
          if (
            !isInput &&
            e.key.length === 1 &&
            !e.ctrlKey &&
            !e.metaKey &&
            !e.altKey
          ) {
            inputRef.current?.focus()
          }
          break
        }
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [filteredItems, activeIndex, handleSelect, onEscape, filterText])

  return {
    activeIndex,
    setActiveIndex,
    filterText,
    setFilterText,
    filteredItems,
    inputRef,
    hoveredIndex,
    setHoveredIndex,
  }
}
