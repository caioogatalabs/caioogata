'use client'

import { useEffect, useCallback } from 'react'
import { useNavigation, SectionKey, SECTIONS_WITH_SUBITEMS } from '@/components/providers/NavigationProvider'
import { useLanguage } from '@/components/providers/LanguageProvider'

export function useKeyboardNavigation() {
  const {
    activeSection,
    setActiveSection,
    selectedIndex,
    setSelectedIndex,
    menuItemsCount,
    isMenuOpen,
    setIsMenuOpen,
    // Sub-item navigation
    subItemIndex,
    setSubItemIndex,
    subItemsCount,
    expandedSubItems,
    toggleSubItemExpanded,
    collapseSubItem,
    hasExpandedItems,
  } = useNavigation()
  const { content } = useLanguage()

  const menuItems = content.menu.items

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
    // Navigate in menu
    setSelectedIndex((selectedIndex - 1 + menuItemsCount) % menuItemsCount)
  }, [sectionHasSubItems, subItemsCount, subItemIndex, setSubItemIndex, isMenuOpen, setIsMenuOpen, selectedIndex, setSelectedIndex, menuItemsCount])

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
    // Navigate in menu
    setSelectedIndex((selectedIndex + 1) % menuItemsCount)
  }, [sectionHasSubItems, subItemsCount, subItemIndex, setSubItemIndex, isMenuOpen, setIsMenuOpen, selectedIndex, setSelectedIndex, menuItemsCount])

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
    // If menu is open and no section active, select the item
    if (!activeSection) {
      const item = menuItems[selectedIndex]
      if (item) {
        setActiveSection(item.key as SectionKey)
      }
    }
  }, [isMenuOpen, setIsMenuOpen, sectionHasSubItems, subItemsCount, subItemIndex, toggleSubItemExpanded, activeSection, menuItems, selectedIndex, setActiveSection])

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
    const handleKeyDown = (event: KeyboardEvent) => {
      // Ignore if user is typing in an input
      if (
        event.target instanceof HTMLInputElement ||
        event.target instanceof HTMLTextAreaElement ||
        (event.target as HTMLElement).isContentEditable
      ) {
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
          goBack()
          break
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [navigateUp, navigateDown, selectItem, goBack])

  return {
    navigateUp,
    navigateDown,
    selectItem,
    goBack,
  }
}
