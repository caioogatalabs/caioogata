'use client'

import { useState, useCallback, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { useMenuNavigation } from '@/hooks/useMenuNavigation'
import { useInView } from '@/hooks/useInView'
import { useInteractionMode } from '@/hooks/useInteractionMode'
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
    filteredItems,
    hoveredIndex,
    setHoveredIndex,
  } = useMenuNavigation({
    items: content.items,
    onSelect: handleSelect,
    onEscape: handleEscape,
  })

  // When the user is keyboard-navigating (mode === 'keyboard' AND activeIndex
  // is set), ignore hover so a stationary mouse doesn't lock the highlight.
  // The mouse must physically move to flip mode back to 'mouse'. Same logic
  // mirrored on /experience via useExperienceNavigation.
  const { mode: interactionMode } = useInteractionMode()
  const keyboardSticky = interactionMode === 'keyboard' && activeIndex !== null

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
      {/* Menu Rows */}
      <ul
        role="listbox"
        onMouseLeave={() => setHoveredIndex(null)}
      >
        {filteredItems.map((item, index) => {
          // Highlight resolution:
          // - keyboardSticky=true → activeIndex wins (ignore stationary mouse)
          // - keyboardSticky=false → hover wins, fall through to activeIndex
          const isHighlighted = keyboardSticky
            ? activeIndex === index
            : hoveredIndex === index || (hoveredIndex === null && activeIndex === index)
          const isDimmed = (hoveredIndex !== null || activeIndex !== null) && !isHighlighted

          return (
            <li
              key={item.key}
              role="option"
              aria-selected={activeIndex === index}
            >
              <div
                className={`-entrance -slide-up -a-${index + 1} menu-row relative flex items-center px-5 md:px-8 lg:px-16 py-3 text-lg cursor-pointer`}
                style={{
                  fontFamily: 'var(--font-sans)',
                  lineHeight: 1.6,
                  zIndex: isHighlighted ? 10 : 1,
                }}
                onClick={() => handleSelect(item)}
                onMouseEnter={() => setHoveredIndex(index)}
              >
                {/* Background bar — V bleed matches Experience (-5px) so row expansion is unified
                    across both lists. Horizontal stays inset (hugs text width) — that's the menu's
                    own thing, distinct from Experience's outward bleed. */}
                <div
                  className="absolute bg-bg-fill-primary pointer-events-none"
                  style={{
                    left: '12px',
                    right: '12px',
                    top: '-5px',
                    bottom: '-5px',
                    transform: isHighlighted ? 'scaleX(1) scaleY(1)' : 'scaleX(0.92) scaleY(0.6)',
                    opacity: isHighlighted ? 1 : 0,
                    transition: isHighlighted
                      ? 'transform 0.6s cubic-bezier(0.22,0.31,0,1) 0.04s, opacity 0.2s cubic-bezier(0.22,0.31,0,1) 0.04s'
                      : 'transform 0.5s cubic-bezier(0.22,0.31,0,1) 0.06s, opacity 0.3s cubic-bezier(0.22,0.31,0,1) 0.06s',
                    transformOrigin: 'left center',
                    borderRadius: '12px',
                  }}
                />

                {/* Arrow — appears before label on highlight.
                    Uses the SAME masked vertical text-swap as the label/description (mono 1.5rem,
                    cubic-bezier(0.16,1,0.3,1)) — so the arrow enters in unison with the typography.
                    Outer span animates `width` (column shift) + `overflow-hidden`; inner span
                    translateY(100%→0) on highlight. */}
                <span
                  className="relative z-10 shrink-0 overflow-hidden block"
                  style={{
                    width: isHighlighted ? '2rem' : '0px',
                    height: '2.8rem',
                    transition: isHighlighted
                      ? 'width 1s cubic-bezier(0.16,1,0.3,1) 0.04s'
                      : 'width 1s cubic-bezier(0.16,1,0.3,1) 0.06s',
                  }}
                  aria-hidden="true"
                >
                  <span
                    className="block flex items-center type-overlay-hover"
                    style={{
                      color: 'var(--color-text-on-primary)',
                      height: '2.8rem',
                      transform: isHighlighted ? 'translateY(0)' : 'translateY(100%)',
                      transition: isHighlighted
                        ? 'transform 1s cubic-bezier(0.16,1,0.3,1) 0.04s'
                        : 'transform 1s cubic-bezier(0.16,1,0.3,1) 0.06s',
                    }}
                  >
                    →
                  </span>
                </span>

                {/* Label — masked vertical text swap */}
                <span
                  className="shrink-0 w-[120px] md:w-1/3 relative z-10 overflow-hidden"
                  style={{ height: '2.8rem', marginTop: '-0.4rem', marginBottom: '-0.4rem' }}
                >
                  <span
                    className="absolute inset-0 flex items-center"
                    style={{
                      transform: isHighlighted ? 'translateY(-100%)' : 'translateY(0)',
                      color: isDimmed
                        ? 'var(--color-text-tertiary)'
                        : isHighlighted
                          ? 'var(--color-text-on-primary)'
                          : 'var(--color-text-primary)',
                      transition: isHighlighted
                        ? 'transform 1s cubic-bezier(0.16,1,0.3,1) 0.04s, color 0.3s cubic-bezier(0.22,0.31,0,1)'
                        : 'transform 1s cubic-bezier(0.16,1,0.3,1) 0.06s, color 0.3s cubic-bezier(0.22,0.31,0,1)',
                    }}
                  >
                    <span className="block truncate">/{item.label}</span>
                  </span>
                  <span
                    className="absolute inset-0 flex items-center type-overlay-hover"
                    style={{
                      transform: isHighlighted ? 'translateY(0)' : 'translateY(100%)',
                      transition: isHighlighted
                        ? 'transform 1s cubic-bezier(0.16,1,0.3,1) 0.04s'
                        : 'transform 1s cubic-bezier(0.16,1,0.3,1) 0.06s',
                      color: 'var(--color-text-on-primary)',
                    }}
                  >
                    <span className="block truncate">/{item.label}</span>
                  </span>
                </span>

                {/* Description — same masked vertical text swap */}
                {item.description && (
                  <span
                    className="flex-1 min-w-0 relative z-10 overflow-hidden"
                    style={{ height: '2.8rem', marginTop: '-0.4rem', marginBottom: '-0.4rem' }}
                  >
                    <span
                      className="absolute inset-0 flex items-center"
                      style={{
                        transform: isHighlighted ? 'translateY(-100%)' : 'translateY(0)',
                        color: isDimmed
                          ? 'var(--color-text-tertiary)'
                          : 'var(--color-text-secondary)',
                        opacity: isDimmed ? 1 : 0.7,
                        transition: isHighlighted
                          ? 'transform 1s cubic-bezier(0.16,1,0.3,1) 0.04s, color 0.3s cubic-bezier(0.22,0.31,0,1)'
                          : 'transform 1s cubic-bezier(0.16,1,0.3,1) 0.06s, color 0.3s cubic-bezier(0.22,0.31,0,1)',
                      }}
                    >
                      <span className="block truncate">{item.description}</span>
                    </span>
                    <span
                      className="absolute inset-0 flex items-center type-overlay-hover"
                      style={{
                        transform: isHighlighted ? 'translateY(0)' : 'translateY(100%)',
                        transition: isHighlighted
                          ? 'transform 1s cubic-bezier(0.16,1,0.3,1) 0.04s'
                          : 'transform 1s cubic-bezier(0.16,1,0.3,1) 0.06s',
                        color: 'var(--color-text-on-primary)',
                      }}
                    >
                      <span className="block truncate">{item.description}</span>
                    </span>
                  </span>
                )}

              </div>
              {/* Row divider — hide when highlighted */}
              <div
                className="h-px w-full bg-border-primary"
                style={{
                  opacity: isHighlighted ? 0 : 0.1,
                  transition: 'opacity 0.3s',
                }}
              />
            </li>
          )
        })}
      </ul>

      {/* Bottom divider */}
      <div className="h-px w-full bg-border-primary opacity-10" />

      {/* Navigation keyboard hints */}
      <div
        className={`-entrance -fade -a-${filteredItems.length + 1} items-center gap-3 px-5 md:px-8 lg:px-16 py-3 hidden lg:flex`}
      >
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
