'use client'

import { useRef, useEffect, useMemo } from 'react'
import { useLanguage } from '@/components/providers/LanguageProvider'
import { useNavigation, SectionKey } from '@/components/providers/NavigationProvider'
import NavigationBar from '@/components/navigation/NavigationBar'

const ARROW_WIDTH_CLASS = 'w-4'

function ArrowRightIcon({ className }: { className?: string }) {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
      className={className}
      aria-hidden
    >
      <path
        d="M6 4l4 4-4 4"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

export default function CLIMenu() {
  const { content } = useLanguage()
  const {
    selectedIndex,
    setSelectedIndex,
    setActiveSection,
    isMenuOpen,
    setIsMenuOpen,
    menuFilter,
    setMenuFilter,
    setFilteredMenuCount,
    setFilteredMenuKeys
  } = useNavigation()
  const inputRef = useRef<HTMLInputElement>(null)

  // Filter items based on input (works with or without "/" prefix)
  const filteredItems = useMemo(() => {
    if (!menuFilter) return content.menu.items
    const searchTerm = menuFilter.replace(/^\//, '').toLowerCase()
    return content.menu.items.filter(item =>
      item.label.toLowerCase().includes(searchTerm) ||
      item.key.toLowerCase().includes(searchTerm)
    )
  }, [menuFilter, content.menu.items])

  // Update filtered count and keys in provider for keyboard navigation
  useEffect(() => {
    setFilteredMenuCount(filteredItems.length)
    setFilteredMenuKeys(filteredItems.map(item => item.key))
  }, [filteredItems, setFilteredMenuCount, setFilteredMenuKeys])

  // Reset selected index when filter changes
  useEffect(() => {
    if (filteredItems.length > 0 && selectedIndex >= filteredItems.length) {
      setSelectedIndex(0)
    }
  }, [filteredItems.length, selectedIndex, setSelectedIndex])

  // Focus input on mount and when menu opens
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus()
    }
  }, [isMenuOpen])

  // On home, refocus input on any click so keyboard/mouse always target it
  useEffect(() => {
    const focusInput = () => {
      inputRef.current?.focus()
    }
    document.addEventListener('click', focusInput)
    return () => document.removeEventListener('click', focusInput)
  }, [])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setMenuFilter(value)
    // Open menu when user starts typing
    if (value && !isMenuOpen) {
      setIsMenuOpen(true)
    }
  }

  const handleInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    // Let the global keyboard handler manage navigation keys
    if (['ArrowUp', 'ArrowDown', 'Escape'].includes(e.key)) {
      return
    }
    // Handle Enter to open menu or select item
    if (e.key === 'Enter') {
      e.preventDefault()
      if (!isMenuOpen) {
        setIsMenuOpen(true)
      } else if (filteredItems.length > 0 && selectedIndex < filteredItems.length) {
        const item = filteredItems[selectedIndex]
        if (item) {
          handleItemClick(item.key)
        }
      }
    }
  }

  const handleItemClick = (key: string) => {
    setActiveSection(key as SectionKey)
    setMenuFilter('')
    setSelectedIndex(0)
  }

  const handleItemHover = (index: number) => {
    setSelectedIndex(index)
  }

  const truncateDescription = (text: string, max = 100) => {
    if (!text) return ''
    return text.length <= max ? text : `${text.slice(0, max)} (...)`
  }

  return (
    <div className="p-4 md:p-6">
      {/* Input line: bordas cor secundária, opacidade/espessura como outras linhas; ícone e label dentro */}
      <div className="flex items-center gap-2 border-t border-b border-secondary/10 py-2 -mx-4 md:-mx-6 px-4 md:px-6 mb-2">
        <span className={`${ARROW_WIDTH_CLASS} shrink-0 flex items-center justify-center text-primary`}>
          <ArrowRightIcon />
        </span>
        <div className="relative flex-1 min-w-0 flex items-center">
          <input
            ref={inputRef}
            type="text"
            value={menuFilter}
            onChange={handleInputChange}
            onKeyDown={handleInputKeyDown}
            onClick={() => setIsMenuOpen(true)}
            className={`bg-transparent border-none outline-none focus:outline-none focus:ring-0 focus-visible:outline-none focus-visible:ring-0 text-primary font-mono text-sm w-full ${
              menuFilter ? 'caret-primary' : 'caret-transparent'
            }`}
            placeholder=""
            aria-label="Menu command input"
            data-menu-input="true"
          />
          {/* Cursor + label no local de digitação; label secundária ~40% opacidade; mesmo tamanho que categoria; some com interação */}
          {!menuFilter && (
            <span className="absolute left-0 top-1/2 -translate-y-1/2 flex items-center gap-1.5 pointer-events-none">
              <span className="inline-block w-1 h-4 bg-primary animate-blink shrink-0" aria-hidden />
              <span className="text-secondary opacity-40 text-sm font-mono whitespace-nowrap">
                {content.menu.inputHint}
              </span>
            </span>
          )}
        </div>
      </div>

      {/* Menu items – / antes do nome; 100px até descrição; descrições alinhadas; opacidade 60% não selecionados */}
      {isMenuOpen && (
        <>
          <nav aria-label="Section navigation" className="mt-2">
            <ul className="space-y-0.5 pl-6">
              {filteredItems.map((item, index) => {
                const isSelected = selectedIndex === index
                const desc = item.description ? truncateDescription(item.description) : ''

                return (
                  <li key={item.key}>
                    <button
                      type="button"
                      onClick={() => handleItemClick(item.key)}
                      onMouseEnter={() => handleItemHover(index)}
                      className={`w-full text-left py-0.5 font-mono text-sm transition-all grid grid-cols-[180px_100px_1fr] items-baseline gap-0 ${
                        isSelected
                          ? 'text-primary opacity-100'
                          : 'text-secondary hover:text-primary opacity-60 hover:opacity-100'
                      }`}
                      aria-current={isSelected ? 'true' : undefined}
                    >
                      <span className="min-w-0 truncate">/{item.label}</span>
                      <span aria-hidden />
                      {desc ? (
                        <span className="min-w-0 truncate text-sm font-mono text-secondary">
                          {desc}
                        </span>
                      ) : (
                        <span />
                      )}
                    </button>
                  </li>
                )
              })}
              {filteredItems.length === 0 && (
                <li className="py-0.5 text-sm font-mono text-neutral-500">
                  No commands found
                </li>
              )}
            </ul>
          </nav>
          {/* Interactive navigation bar */}
          <NavigationBar variant="secondary" />
        </>
      )}
    </div>
  )
}
