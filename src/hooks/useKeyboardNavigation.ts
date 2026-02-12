'use client'

import { useEffect, useCallback } from 'react'
import { useNavigation, SectionKey, SECTIONS_WITH_SUBITEMS } from '@/components/providers/NavigationProvider'
import { useInteractionMode } from '@/hooks/useInteractionMode'

export function useKeyboardNavigation() {
  const {
    activeSection,
    setActiveSection,
    selectedIndex,
    setSelectedIndex,
    isMenuOpen,
    setIsMenuOpen,
    setMenuFilter,
    filteredMenuCount,
    filteredMenuKeys,
    // Sub-item navigation
    subItemIndex,
    setSubItemIndex,
    subItemsCount,
    expandedSubItems,
    toggleSubItemExpanded,
    collapseSubItem,
    hasExpandedItems,
    // Canvas mode
    isCanvasActive,
  } = useNavigation()
  const { isTouchDevice } = useInteractionMode()

  // Check if current section has sub-items
  const sectionHasSubItems = activeSection && SECTIONS_WITH_SUBITEMS.includes(activeSection)

  const navigateUp = useCallback(() => {
    // If a section with sub-items is open, navigate within sub-items
    if (sectionHasSubItems && subItemsCount > 0) {
      setSubItemIndex((subItemIndex - 1 + subItemsCount) % subItemsCount)
      return
    }
    // If menu is closed, open it first
    if (!isMenuOpen) {
      setIsMenuOpen(true)
      return
    }
    // Navigate in filtered menu
    if (filteredMenuCount > 0) {
      setSelectedIndex((selectedIndex - 1 + filteredMenuCount) % filteredMenuCount)
    }
  }, [sectionHasSubItems, subItemsCount, subItemIndex, setSubItemIndex, isMenuOpen, setIsMenuOpen, selectedIndex, setSelectedIndex, filteredMenuCount])

  const navigateDown = useCallback(() => {
    // If a section with sub-items is open, navigate within sub-items
    if (sectionHasSubItems && subItemsCount > 0) {
      setSubItemIndex((subItemIndex + 1) % subItemsCount)
      return
    }
    // If menu is closed, open it first
    if (!isMenuOpen) {
      setIsMenuOpen(true)
      return
    }
    // Navigate in filtered menu
    if (filteredMenuCount > 0) {
      setSelectedIndex((selectedIndex + 1) % filteredMenuCount)
    }
  }, [sectionHasSubItems, subItemsCount, subItemIndex, setSubItemIndex, isMenuOpen, setIsMenuOpen, selectedIndex, setSelectedIndex, filteredMenuCount])

  const selectItem = useCallback(() => {
    // If menu is closed, open it
    if (!isMenuOpen) {
      setIsMenuOpen(true)
      return
    }
    // If a section with sub-items is open, toggle the selected sub-item
    if (sectionHasSubItems && subItemsCount > 0) {
      toggleSubItemExpanded(subItemIndex)
      return
    }
    // If menu is open and no section active, select the item from filtered list
    if (!activeSection && filteredMenuKeys.length > 0) {
      const key = filteredMenuKeys[selectedIndex]
      if (key) {
        setActiveSection(key as SectionKey)
        setMenuFilter('')
      }
    }
  }, [isMenuOpen, setIsMenuOpen, sectionHasSubItems, subItemsCount, subItemIndex, toggleSubItemExpanded, activeSection, filteredMenuKeys, selectedIndex, setActiveSection, setMenuFilter])

  const goBack = useCallback(() => {
    // If in a section with sub-items and there are expanded items
    if (activeSection && sectionHasSubItems && hasExpandedItems) {
      // Close one expanded item at a time (prioritize selected, then first found)
      if (expandedSubItems.has(subItemIndex)) {
        collapseSubItem(subItemIndex)
      } else {
        // Close the first expanded item found
        const firstExpanded = Array.from(expandedSubItems)[0]
        collapseSubItem(firstExpanded)
      }
      return
    }
    // If a section is open (no expanded items), close it (go back to menu)
    if (activeSection) {
      setActiveSection(null)
      return
    }
    // If menu is open but no section, close the menu
    if (isMenuOpen) {
      setIsMenuOpen(false)
    }
  }, [activeSection, sectionHasSubItems, expandedSubItems, subItemIndex, collapseSubItem, hasExpandedItems, setActiveSection, isMenuOpen, setIsMenuOpen])

  useEffect(() => {
    // Skip keyboard navigation setup on touch devices (mobile/tablet)
    if (isTouchDevice) {
      return
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      const target = event.target as HTMLElement
      const isMenuInput = target.getAttribute('data-menu-input') === 'true'
      const isOtherInput = (
        target instanceof HTMLInputElement ||
        target instanceof HTMLTextAreaElement ||
        target.isContentEditable
      ) && !isMenuInput

      // For menu input, only handle navigation keys (arrows, escape)
      // For other inputs, ignore all navigation
      if (isOtherInput) {
        return
      }

      // When canvas is active, let it handle its own navigation
      if (isCanvasActive) {
        return
      }

      // In menu input, don't handle Enter here (let the input handle it)
      if (isMenuInput && event.key === 'Enter') {
        return
      }

      switch (event.key) {
        case 'ArrowUp':
          event.preventDefault()
          navigateUp()
          break
        case 'ArrowDown':
          event.preventDefault()
          navigateDown()
          break
        case 'Enter':
          event.preventDefault()
          selectItem()
          break
        case 'Escape':
          event.preventDefault()
          // In menu input, also clear the filter
          if (isMenuInput) {
            setMenuFilter('')
          }
          goBack()
          break
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [navigateUp, navigateDown, selectItem, goBack, setMenuFilter, isCanvasActive, isTouchDevice])

  return {
    navigateUp,
    navigateDown,
    selectItem,
    goBack,
  }
}
