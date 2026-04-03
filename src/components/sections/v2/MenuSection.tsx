'use client'

import { useState, useCallback, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { useMenuNavigation } from '@/hooks/useMenuNavigation'
import { useInView } from '@/hooks/useInView'
import { FloatingPreview } from '@/components/sections/v2/FloatingPreview'
import type { MenuItem, Menu } from '@/content/types'

interface MenuSectionProps {
  content: Menu
}

function KeyBadge({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center justify-center bg-bg-surface-primary text-text-primary text-[11px] font-medium font-mono px-[5px] py-[2px] rounded-[3px] leading-none">
      {children}
    </span>
  )
}

export function MenuSection({ content }: MenuSectionProps) {
  const router = useRouter()
  const sectionRef = useInView({ threshold: 0.1, once: true })

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
      onMouseMove={handleMouseMove}
    >
      {/* Top divider */}
      <div className="-entrance -fade -a-0 h-px w-full bg-border-primary opacity-30" />

      {/* CLI Input */}
      <div className="-entrance -fade -a-0 flex items-center gap-2 px-5 md:px-8 lg:px-16 py-3.5 text-sm overflow-hidden">
        <span className="font-mono font-bold text-text-brand shrink-0">
          &gt;
        </span>
        <input
          ref={inputRef}
          type="text"
          value={filterText}
          onChange={(e) => setFilterText(e.target.value)}
          placeholder='Press "Enter" to Navigate'
          className="flex-1 bg-transparent font-mono text-sm text-text-primary placeholder:text-text-tertiary placeholder:opacity-40 caret-text-brand focus:outline-none"
          autoComplete="off"
          spellCheck={false}
          data-menu-input="true"
        />
      </div>

      {/* Divider below input */}
      <div className="h-px w-full bg-border-primary opacity-15" />

      {/* Menu Rows */}
      <ul
        role="listbox"
        onMouseLeave={() => setHoveredIndex(null)}
      >
        {filteredItems.map((item, index) => {
          const isHovered = hoveredIndex === index
          const isDimmed = hoveredIndex !== null && hoveredIndex !== index

          return (
            <li
              key={item.key}
              role="option"
              aria-selected={activeIndex === index}
            >
              <div
                className={`-entrance -slide-up -a-${index + 1} menu-row relative flex items-center px-5 md:px-8 lg:px-16 py-3 text-lg cursor-pointer overflow-hidden`}
                style={{
                  fontFamily: 'var(--font-sans)',
                  lineHeight: 1.6,
                }}
                onClick={() => handleSelect(item)}
                onMouseEnter={() => setHoveredIndex(index)}
              >
                {/* Background bar — scales in on hover */}
                <div
                  className="absolute inset-0 bg-bg-fill-primary pointer-events-none"
                  style={{
                    transform: isHovered ? 'scaleX(1) scaleY(1)' : 'scaleX(0.92) scaleY(0.5)',
                    opacity: isHovered ? 1 : 0,
                    transition: 'transform 0.6s cubic-bezier(0.22,0.31,0,1), opacity 0.15s cubic-bezier(0.22,0.31,0,1)',
                    transformOrigin: 'left center',
                    borderRadius: '4px',
                  }}
                />

                {/* Label with text swap animation */}
                <span
                  className="shrink-0 w-[120px] md:w-[202px] relative z-10 overflow-hidden"
                  style={{ height: '1.6em' }}
                >
                  {/* Primary text — slides up on hover */}
                  <span
                    className="block transition-transform duration-500"
                    style={{
                      transform: isHovered ? 'translateY(-120%)' : 'translateY(0)',
                      transitionTimingFunction: 'cubic-bezier(0.22,0.31,0,1)',
                      color: isDimmed
                        ? 'var(--color-text-tertiary)'
                        : isHovered
                          ? 'var(--color-text-on-primary)'
                          : 'var(--color-text-primary)',
                      transition: 'transform 0.5s cubic-bezier(0.22,0.31,0,1), color 0.3s cubic-bezier(0.22,0.31,0,1)',
                    }}
                  >
                    /{item.label}
                  </span>
                  {/* Duplicate text — slides in from below */}
                  <span
                    className="block absolute top-0 left-0"
                    style={{
                      transform: isHovered ? 'translateY(0)' : 'translateY(120%)',
                      transitionTimingFunction: 'cubic-bezier(0.22,0.31,0,1)',
                      transition: 'transform 0.5s cubic-bezier(0.22,0.31,0,1)',
                      color: 'var(--color-text-on-primary)',
                    }}
                  >
                    /{item.label}
                  </span>
                </span>

                {/* Description */}
                {item.description && (
                  <span
                    className="flex-1 relative z-10 transition-colors duration-300"
                    style={{
                      color: isDimmed
                        ? 'var(--color-text-tertiary)'
                        : isHovered
                          ? 'var(--color-text-on-primary)'
                          : 'var(--color-text-secondary)',
                      opacity: isHovered ? 1 : 0.7,
                      transitionTimingFunction: 'cubic-bezier(0.22,0.31,0,1)',
                    }}
                  >
                    {item.description}
                  </span>
                )}
              </div>
              {/* Row divider — hide when this or adjacent row is hovered */}
              <div
                className="h-px w-full bg-border-primary"
                style={{
                  opacity: isHovered ? 0 : 0.1,
                  transition: 'opacity 0.3s',
                }}
              />
            </li>
          )
        })}
      </ul>

      {/* Bottom divider */}
      <div className="h-px w-full bg-border-primary opacity-30" />

      {/* Navigation keyboard hints */}
      <div
        className={`-entrance -fade -a-${filteredItems.length + 1} items-center gap-3 px-5 md:px-8 lg:px-16 py-3 hidden lg:flex`}
      >
        <div className="flex items-center gap-1.5">
          <KeyBadge>Esc</KeyBadge>
          <span className="text-xs text-text-tertiary">to go back</span>
        </div>
        <span className="text-xs text-text-tertiary opacity-40">·</span>
        <div className="flex items-center gap-1">
          <KeyBadge>↑</KeyBadge>
          <KeyBadge>↓</KeyBadge>
          <span className="text-xs text-text-tertiary ml-0.5">to navigate</span>
        </div>
        <span className="text-xs text-text-tertiary opacity-40">·</span>
        <div className="flex items-center gap-1.5">
          <KeyBadge>Enter</KeyBadge>
          <span className="text-xs text-text-tertiary">to select</span>
        </div>
      </div>

      {/* FloatingPreview — cursor-following image preview (desktop only) */}
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
