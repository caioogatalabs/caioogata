'use client'

import { createContext, useContext, useState, useCallback, ReactNode } from 'react'

export type SectionKey = 'about' | 'projects' | 'experience' | 'skills' | 'education' | 'clients' | 'philosophy' | 'contact'

// Sections that have sub-items for internal navigation
export const SECTIONS_WITH_SUBITEMS: SectionKey[] = ['projects', 'experience', 'education', 'philosophy']

interface NavigationContextType {
  // Menu navigation
  activeSection: SectionKey | null
  setActiveSection: (section: SectionKey | null) => void
  selectedIndex: number
  setSelectedIndex: (index: number) => void
  menuItemsCount: number
  isMenuOpen: boolean
  setIsMenuOpen: (open: boolean) => void
  // Menu filter
  menuFilter: string
  setMenuFilter: (filter: string) => void
  filteredMenuCount: number
  setFilteredMenuCount: (count: number) => void
  filteredMenuKeys: string[]
  setFilteredMenuKeys: (keys: string[]) => void
  // Sub-item navigation (within sections)
  subItemIndex: number
  setSubItemIndex: (index: number) => void
  subItemsCount: number
  setSubItemsCount: (count: number) => void
  expandedSubItems: Set<number>
  toggleSubItemExpanded: (index: number) => void
  collapseSubItem: (index: number) => void
  collapseAllSubItems: () => void
  hasExpandedItems: boolean
  resetSubNavigation: () => void
  // Canvas mode (when active, global navigation is disabled)
  isCanvasActive: boolean
  setIsCanvasActive: (active: boolean) => void
}

const MENU_ITEMS_COUNT = 8

const NavigationContext = createContext<NavigationContextType | undefined>(undefined)

export function NavigationProvider({ children }: { children: ReactNode }) {
  const [activeSection, setActiveSectionState] = useState<SectionKey | null>(null)
  const [selectedIndex, setSelectedIndex] = useState(0)
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [menuFilter, setMenuFilter] = useState('')
  const [filteredMenuCount, setFilteredMenuCount] = useState(MENU_ITEMS_COUNT)
  const [filteredMenuKeys, setFilteredMenuKeys] = useState<string[]>([])

  // Sub-item navigation state
  const [subItemIndex, setSubItemIndex] = useState(0)
  const [subItemsCount, setSubItemsCount] = useState(0)
  const [expandedSubItems, setExpandedSubItems] = useState<Set<number>>(new Set())

  // Canvas mode state
  const [isCanvasActive, setIsCanvasActive] = useState(false)

  const resetSubNavigation = useCallback(() => {
    setSubItemIndex(0)
    setSubItemsCount(0)
    setExpandedSubItems(new Set())
  }, [])

  const setActiveSection = useCallback((section: SectionKey | null) => {
    setActiveSectionState(section)
    // Reset sub-navigation when changing sections
    resetSubNavigation()
  }, [resetSubNavigation])

  const toggleSubItemExpanded = useCallback((index: number) => {
    setExpandedSubItems(prev => {
      const newSet = new Set(prev)
      if (newSet.has(index)) {
        newSet.delete(index)
      } else {
        newSet.add(index)
      }
      return newSet
    })
  }, [])

  const collapseSubItem = useCallback((index: number) => {
    setExpandedSubItems(prev => {
      const newSet = new Set(prev)
      newSet.delete(index)
      return newSet
    })
  }, [])

  const collapseAllSubItems = useCallback(() => {
    setExpandedSubItems(new Set())
  }, [])

  const hasExpandedItems = expandedSubItems.size > 0

  return (
    <NavigationContext.Provider
      value={{
        activeSection,
        setActiveSection,
        selectedIndex,
        setSelectedIndex,
        menuItemsCount: MENU_ITEMS_COUNT,
        isMenuOpen,
        setIsMenuOpen,
        menuFilter,
        setMenuFilter,
        filteredMenuCount,
        setFilteredMenuCount,
        filteredMenuKeys,
        setFilteredMenuKeys,
        subItemIndex,
        setSubItemIndex,
        subItemsCount,
        setSubItemsCount,
        expandedSubItems,
        toggleSubItemExpanded,
        collapseSubItem,
        collapseAllSubItems,
        hasExpandedItems,
        resetSubNavigation,
        isCanvasActive,
        setIsCanvasActive,
      }}
    >
      {children}
    </NavigationContext.Provider>
  )
}

export function useNavigation() {
  const context = useContext(NavigationContext)
  if (!context) {
    throw new Error('useNavigation must be used within NavigationProvider')
  }
  return context
}
