'use client'

import { useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { Grid, GridItem } from '@/components/layout/Grid'
import { useMenuNavigation } from '@/hooks/useMenuNavigation'
import { useInView } from '@/hooks/useInView'
import type { MenuItem, Menu } from '@/content/types'

interface MenuSectionProps {
  content: Menu
}

export function MenuSection({ content }: MenuSectionProps) {
  const router = useRouter()
  const sectionRef = useInView({ threshold: 0.1, once: true })

  const handleSelect = useCallback(
    (item: MenuItem) => {
      if (item.key === 'contact') {
        window.dispatchEvent(new CustomEvent('open-contact'))
        document
          .querySelector('[data-section-id="footer"]')
          ?.scrollIntoView({ behavior: 'smooth' })
      } else if (item.key === 'projects') {
        document
          .querySelector('[data-section-id="projects"]')
          ?.scrollIntoView({ behavior: 'smooth' })
      } else {
        router.push(`/${item.key}`)
      }
    },
    [router]
  )

  const handleEscape = useCallback(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }, [])

  const {
    activeIndex,
    filterText,
    setFilterText,
    filteredItems,
    inputRef,
    hoveredIndex,
    setHoveredIndex,
  } = useMenuNavigation({
    items: content.items,
    onSelect: handleSelect,
    onEscape: handleEscape,
  })

  return (
    <section
      ref={sectionRef as React.RefObject<HTMLElement>}
      aria-label="Navigation menu"
      data-section-id="menu"
      className="py-16 lg:py-24"
    >
      <Grid>
        <GridItem span={8} tabletSpan={8} mobileSpan={4} className="lg:col-start-3">
          {/* CLI Input */}
          <div className="-entrance -fade -a-0 flex items-center gap-2 pb-6 border-b border-[var(--color-border-primary)]">
            <span
              className="font-mono text-[var(--color-text-brand)] text-base select-none"
              aria-hidden="true"
            >
              &gt;
            </span>
            <input
              ref={inputRef}
              type="text"
              value={filterText}
              onChange={(e) => setFilterText(e.target.value)}
              placeholder={content.inputHint.keyboard}
              className="flex-1 bg-transparent font-mono text-base text-[var(--color-text-primary)] placeholder:text-[var(--color-text-tertiary)] caret-[var(--color-text-brand)] focus:outline-none"
              autoComplete="off"
              spellCheck={false}
              data-menu-input="true"
            />
          </div>

          {/* Menu Rows */}
          <ul
            role="listbox"
            className="mt-4"
            onMouseLeave={() => setHoveredIndex(null)}
          >
            {filteredItems.map((item, index) => {
              const isActive = activeIndex === index && hoveredIndex === null
              return (
                <li
                  key={item.key}
                  role="option"
                  aria-selected={activeIndex === index}
                  className={`-entrance -slide-up -a-${index + 1} min-h-[64px] flex items-center justify-between cursor-pointer px-2 transition-colors duration-300 ${
                    isActive
                      ? 'border-l-2 border-[var(--color-text-brand)] pl-4'
                      : 'border-l-2 border-transparent pl-4'
                  }`}
                  onClick={() => handleSelect(item)}
                  onMouseEnter={() => setHoveredIndex(index)}
                >
                  <span
                    className="text-[30px] font-medium tracking-[-0.01em] leading-[1.15]"
                    style={{ fontFamily: 'var(--font-sans)' }}
                  >
                    {item.label}
                  </span>
                  {item.description && (
                    <span className="text-base text-[var(--color-text-secondary)] hidden md:block">
                      {item.description}
                    </span>
                  )}
                </li>
              )
            })}
          </ul>

          {/* Navigation Hints */}
          <div
            className={`-entrance -fade -a-${filteredItems.length + 1} mt-6 pt-2 pb-2 border-t border-[var(--color-border-primary)] font-mono text-sm uppercase tracking-[0.08em] text-[var(--color-text-tertiary)] hidden lg:block`}
          >
            <span>Esc {content.navigation.keyboard.back}</span>
            <span className="mx-3">/</span>
            <span>Arrows {content.navigation.keyboard.navigate}</span>
            <span className="mx-3">/</span>
            <span>Enter {content.navigation.keyboard.select}</span>
          </div>

          {/* FloatingPreview and interaction layer added in Task 3b */}
        </GridItem>
      </Grid>
    </section>
  )
}
