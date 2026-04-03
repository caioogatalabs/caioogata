'use client'

import { useState, useCallback, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { Grid, GridItem } from '@/components/layout/Grid'
import { useMenuNavigation } from '@/hooks/useMenuNavigation'
import { useInView } from '@/hooks/useInView'
import { FloatingPreview } from '@/components/sections/v2/FloatingPreview'
import type { MenuItem, Menu } from '@/content/types'

interface MenuSectionProps {
  content: Menu
}

export function MenuSection({ content }: MenuSectionProps) {
  const router = useRouter()
  const sectionRef = useInView({ threshold: 0.1, once: true })

  // Mouse tracking state
  const [mouseX, setMouseX] = useState(0)
  const [mouseY, setMouseY] = useState(0)
  const [velocityX, setVelocityX] = useState(0)
  const prevMouseXRef = useRef(0)

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

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    const newX = e.clientX
    const newY = e.clientY
    setVelocityX(newX - prevMouseXRef.current)
    prevMouseXRef.current = newX
    setMouseX(newX)
    setMouseY(newY)
  }, [])

  // Determine preview image for the hovered item
  const previewImageSrc =
    hoveredIndex !== null
      ? `/previews/${filteredItems[hoveredIndex]?.key}.webp`
      : null
  const previewAlt =
    hoveredIndex !== null ? filteredItems[hoveredIndex]?.label ?? '' : ''

  return (
    <section
      ref={sectionRef as React.RefObject<HTMLElement>}
      aria-label="Navigation menu"
      data-section-id="menu"
      className="py-16 lg:py-24"
      onMouseMove={handleMouseMove}
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
              const isDimmed = hoveredIndex !== null && hoveredIndex !== index

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
                  style={{
                    transitionTimingFunction: 'var(--ease-out)',
                  }}
                  onClick={() => handleSelect(item)}
                  onMouseEnter={() => setHoveredIndex(index)}
                >
                  <span
                    className={`text-[30px] font-medium tracking-[-0.01em] leading-[1.15] transition-colors duration-300 ${
                      isDimmed
                        ? 'text-[var(--color-text-tertiary)]'
                        : 'text-[var(--color-text-primary)]'
                    }`}
                    style={{ fontFamily: 'var(--font-sans)' }}
                  >
                    {item.label}
                  </span>
                  {item.description && (
                    <span
                      className={`text-base hidden md:block transition-colors duration-300 ${
                        isDimmed
                          ? 'text-[var(--color-text-tertiary)]'
                          : 'text-[var(--color-text-secondary)]'
                      }`}
                    >
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
        </GridItem>
      </Grid>

      {/* FloatingPreview -- cursor-following image preview (desktop only) */}
      <FloatingPreview
        imageSrc={previewImageSrc}
        alt={previewAlt}
        mouseX={mouseX}
        mouseY={mouseY}
        velocityX={velocityX}
      />
    </section>
  )
}
