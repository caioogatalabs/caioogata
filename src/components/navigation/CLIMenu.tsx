'use client'

import { useLanguage } from '@/components/providers/LanguageProvider'
import { useNavigation, SectionKey } from '@/components/providers/NavigationProvider'

export default function CLIMenu() {
  const { content } = useLanguage()
  const { selectedIndex, setSelectedIndex, setActiveSection, isMenuOpen, setIsMenuOpen } = useNavigation()

  const handleMenuClick = () => {
    if (!isMenuOpen) {
      setIsMenuOpen(true)
    }
  }

  const handleItemClick = (key: string, index: number) => {
    setSelectedIndex(index)
    setActiveSection(key as SectionKey)
  }

  const handleItemHover = (index: number) => {
    setSelectedIndex(index)
  }

  // Closed state - just show the command
  if (!isMenuOpen) {
    return (
      <div className="border-2 border-primary/30 rounded-base p-4 md:p-6">
        <button
          onClick={handleMenuClick}
          className="text-primary font-mono hover:text-primary/80 transition-colors cursor-pointer flex items-center gap-2"
        >
          <span>&gt;</span>
          <span>{content.menu.command}</span>
        </button>
        <div className="mt-4 pt-4 border-t border-primary/10">
          <p className="text-xs font-mono text-neutral-500">
            {content.menu.legend}
          </p>
        </div>
      </div>
    )
  }

  // Open state - show full menu
  return (
    <div className="border-2 border-primary/30 rounded-base p-4 md:p-6">
      {/* Menu Header */}
      <div className="mb-4">
        <span className="text-primary font-mono">&gt; {content.menu.command}</span>
      </div>

      {/* Menu Items */}
      <nav aria-label="Section navigation">
        <ul className="space-y-1">
          {content.menu.items.map((item, index) => {
            const isSelected = selectedIndex === index

            return (
              <li key={item.key}>
                <button
                  onClick={() => handleItemClick(item.key, index)}
                  onMouseEnter={() => handleItemHover(index)}
                  className={`w-full text-left px-3 py-1.5 rounded-base font-mono text-sm transition-colors flex items-center gap-2 ${
                    isSelected
                      ? 'bg-primary/20 text-primary'
                      : 'text-secondary hover:bg-primary/10 hover:text-primary'
                  }`}
                  aria-current={isSelected ? 'true' : undefined}
                >
                  <span className={`w-4 ${isSelected ? 'text-primary' : 'text-transparent'}`}>
                    &gt;
                  </span>
                  <span>{item.label}</span>
                </button>
              </li>
            )
          })}
        </ul>
      </nav>

      {/* Keyboard Legend */}
      <div className="mt-6 pt-4 border-t border-primary/10">
        <p className="text-xs font-mono text-neutral-500">
          {content.menu.legend}
        </p>
      </div>
    </div>
  )
}
