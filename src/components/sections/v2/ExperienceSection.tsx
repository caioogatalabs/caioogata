'use client'

import { useState, useCallback, useRef, useEffect } from 'react'
import { StickyLogoBar } from '@/components/sections/v2/StickyLogoBar'
import { PageNavigation } from '@/components/sections/v2/PageNavigation'
import { MAIN_NAVIGATION } from '@/content/main-navigation'
import { useExperienceNavigation } from '@/hooks/useExperienceNavigation'
import { useInView } from '@/hooks/useInView'
import content from '@/content/en.json'
import type { Content } from '@/content/types'

const typedContent = content as unknown as Content
const jobs = typedContent.experience.jobs

export function ExperienceSection() {
  const heroRef = useInView({ threshold: 0.1, once: true })
  const rowsRef = useInView({ threshold: 0.05, once: true })
  const containerRef = useRef<HTMLDivElement>(null)

  const [expandedIndex, setExpandedIndex] = useState<number | null>(null)
  const [reducedMotion, setReducedMotion] = useState(false)

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
    setReducedMotion(mq.matches)
    const handler = (e: MediaQueryListEvent) => setReducedMotion(e.matches)
    mq.addEventListener('change', handler)
    return () => mq.removeEventListener('change', handler)
  }, [])

  const toggle = useCallback((index: number) => {
    setExpandedIndex((prev) => (prev === index ? null : index))
  }, [])

  const handleExpand = useCallback((index: number) => {
    setExpandedIndex(index)
  }, [])

  const handleCollapse = useCallback((index: number) => {
    if (index === -1) {
      setExpandedIndex(null)
    } else {
      setExpandedIndex((prev) => (prev === index ? null : prev))
    }
  }, [])

  const {
    activeIndex,
    hoveredIndex,
    highlightedIndex,
    setHoveredIndex,
    handleKeyDown,
    isDimmed,
  } = useExperienceNavigation({
    itemCount: jobs.length,
    onExpand: handleExpand,
    onCollapse: handleCollapse,
    containerRef,
  })

  const instantStyle = reducedMotion
    ? { transitionDuration: '0s' }
    : undefined

  return (
    <div className="min-h-screen bg-bg" data-theme="light">
      {/* Hero zone */}
      <div className="bg-bg-surface-secondary pt-8 md:pt-10 lg:pt-12">
        <StickyLogoBar />

        <div
          ref={heroRef as React.RefObject<HTMLDivElement>}
          className="px-5 md:px-8 lg:px-16 pb-16 md:pb-24"
        >
          <h1
            className="-entrance -slide-up -a-0 text-5xl md:text-7xl lg:text-8xl text-text-primary font-semibold"
            style={{ fontFamily: 'var(--font-sans)' }}
          >
            Experience
          </h1>
          <div className="-entrance -slide-up -a-1 flex items-center gap-3 mt-4 font-mono text-sm text-text-secondary">
            <span>12+ years</span>
            <span className="text-text-tertiary">·</span>
            <span>6 companies</span>
            <span className="text-text-tertiary">·</span>
            <span>3 director roles</span>
          </div>
        </div>
      </div>

      {/* Unified page navigation — categories circuit */}
      <PageNavigation
        lateral={{ items: MAIN_NAVIGATION, currentIndex: 2, scope: 'categories' }}
      />

      {/* Experience rows */}
      <div
        ref={rowsRef as React.RefObject<HTMLDivElement>}
        className="px-5 md:px-8 lg:px-16 py-8 md:py-12"
        onKeyDown={handleKeyDown}
        onMouseLeave={() => setHoveredIndex(-1)}
        role="list"
        aria-label="Experience roles"
      >
        <div ref={containerRef}>
          {jobs.map((job, index) => {
            const isHighlighted =
              highlightedIndex === index
            const isExpanded = expandedIndex === index
            const dimmed = isDimmed(index)
            const isKeyboardFocused =
              activeIndex === index && hoveredIndex < 0
            const staggerClass = `-a-${Math.min(index, 20)}`

            return (
              <div
                key={index}
                data-experience-row
                role="listitem"
                className={`-entrance -slide-up ${staggerClass}`}
              >
                {/* Row button */}
                <div
                  className="relative cursor-pointer"
                  style={{
                    zIndex: isHighlighted || isExpanded ? 10 : 1,
                  }}
                  onClick={() => toggle(index)}
                  onMouseEnter={() => setHoveredIndex(index)}
                  tabIndex={0}
                  role="button"
                  aria-expanded={isExpanded}
                  aria-label={`${job.company} — ${job.title}, ${job.dateRange}`}
                >
                  {/* Yellow background bar */}
                  <div
                    className="absolute bg-bg-fill-primary pointer-events-none"
                    style={{
                      left: '-12px',
                      right: '-12px',
                      top: '-5px',
                      bottom: '-5px',
                      transform:
                        isHighlighted || isExpanded
                          ? 'scaleX(1) scaleY(1)'
                          : 'scaleX(0.92) scaleY(0.6)',
                      opacity: isHighlighted || isExpanded ? 1 : 0,
                      transition:
                        isHighlighted || isExpanded
                          ? 'transform 0.6s cubic-bezier(0.22,0.31,0,1) 0.04s, opacity 0.2s cubic-bezier(0.22,0.31,0,1) 0.04s'
                          : 'transform 0.5s cubic-bezier(0.22,0.31,0,1) 0.06s, opacity 0.3s cubic-bezier(0.22,0.31,0,1) 0.06s',
                      transformOrigin: 'left center',
                      borderRadius: '12px',
                      ...instantStyle,
                    }}
                  />

                  {/* Row content — 12-col grid: 3-3-3-3 */}
                  <div className="relative z-10 grid grid-cols-12 items-center py-3 gap-x-4">
                    {/* Arrow — display size, expands before label */}
                    <div className="col-span-12 md:col-span-1 flex items-center">
                      <span
                        className="shrink-0"
                        style={{
                          fontFamily: "'Pexel Grotesk', var(--font-sans)",
                          color:
                            isHighlighted || isExpanded
                              ? 'var(--color-text-on-primary)'
                              : 'transparent',
                          fontSize: '3.5rem',
                          fontWeight: 400,
                          lineHeight: 1,
                          letterSpacing: '-0.02em',
                          width:
                            isHighlighted || isExpanded ? '3rem' : '0px',
                          opacity: isHighlighted || isExpanded ? 1 : 0,
                          overflow: 'hidden',
                          transition:
                            isHighlighted || isExpanded
                              ? 'width 0.5s cubic-bezier(0.16,1,0.3,1) 0.04s, opacity 0.3s cubic-bezier(0.16,1,0.3,1) 0.04s'
                              : 'width 0.3s cubic-bezier(0.16,1,0.3,1), opacity 0.2s cubic-bezier(0.16,1,0.3,1)',
                          ...instantStyle,
                        }}
                        aria-hidden="true"
                      >
                        →
                      </span>
                    </div>

                    {/* Date range */}
                    <div className="hidden md:flex col-span-2 items-center">
                      <span
                        className="font-mono text-sm"
                        style={{
                          color:
                            isHighlighted || isExpanded
                              ? 'var(--color-text-on-primary)'
                              : dimmed
                                ? 'var(--color-text-tertiary)'
                                : 'var(--color-text-secondary)',
                          opacity: dimmed ? 0.3 : 1,
                          transition: 'color 0.3s, opacity 0.3s',
                          ...instantStyle,
                        }}
                      >
                        {job.dateRange}
                      </span>
                    </div>

                    {/* Company — masked text swap */}
                    <div className="col-span-8 md:col-span-4">
                      <span
                        className="relative block overflow-hidden"
                        style={{
                          height: '2.8rem',
                          marginTop: '-0.4rem',
                          marginBottom: '-0.4rem',
                        }}
                      >
                        {/* Default text */}
                        <span
                          className="absolute inset-0 flex items-center"
                          style={{
                            transform:
                              isHighlighted || isExpanded
                                ? 'translateY(-100%)'
                                : 'translateY(0)',
                            color: dimmed
                              ? 'var(--color-text-tertiary)'
                              : isHighlighted || isExpanded
                                ? 'var(--color-text-on-primary)'
                                : 'var(--color-text-primary)',
                            fontFamily: 'var(--font-sans)',
                            fontWeight: 600,
                            transition:
                              isHighlighted || isExpanded
                                ? 'transform 1s cubic-bezier(0.16,1,0.3,1) 0.04s, color 0.3s cubic-bezier(0.22,0.31,0,1)'
                                : 'transform 1s cubic-bezier(0.16,1,0.3,1) 0.06s, color 0.3s cubic-bezier(0.22,0.31,0,1)',
                            opacity: dimmed ? 0.3 : 1,
                            ...instantStyle,
                          }}
                        >
                          <span className="block truncate">{job.company}</span>
                        </span>
                        {/* Hover text */}
                        <span
                          className="absolute inset-0 flex items-center"
                          style={{
                            transform:
                              isHighlighted || isExpanded
                                ? 'translateY(0)'
                                : 'translateY(100%)',
                            transition:
                              isHighlighted || isExpanded
                                ? 'transform 1s cubic-bezier(0.16,1,0.3,1) 0.04s'
                                : 'transform 1s cubic-bezier(0.16,1,0.3,1) 0.06s',
                            color: 'var(--color-text-on-primary)',
                            fontFamily:
                              "'Pexel Grotesk', var(--font-sans)",
                            fontSize: '1.5rem',
                            fontWeight: 700,
                            ...instantStyle,
                          }}
                        >
                          <span className="block truncate">{job.company}</span>
                        </span>
                      </span>
                    </div>

                    {/* Title — masked text swap */}
                    <div className="col-span-4 md:col-span-4 hidden md:block">
                      <span
                        className="relative block overflow-hidden"
                        style={{
                          height: '2.8rem',
                          marginTop: '-0.4rem',
                          marginBottom: '-0.4rem',
                        }}
                      >
                        {/* Default text */}
                        <span
                          className="absolute inset-0 flex items-center"
                          style={{
                            transform:
                              isHighlighted || isExpanded
                                ? 'translateY(-100%)'
                                : 'translateY(0)',
                            color: dimmed
                              ? 'var(--color-text-tertiary)'
                              : 'var(--color-text-secondary)',
                            fontFamily: 'var(--font-sans)',
                            transition:
                              isHighlighted || isExpanded
                                ? 'transform 1s cubic-bezier(0.16,1,0.3,1) 0.04s, color 0.3s cubic-bezier(0.22,0.31,0,1)'
                                : 'transform 1s cubic-bezier(0.16,1,0.3,1) 0.06s, color 0.3s cubic-bezier(0.22,0.31,0,1)',
                            opacity: dimmed ? 0.3 : 1,
                            ...instantStyle,
                          }}
                        >
                          <span className="block truncate">{job.title}</span>
                        </span>
                        {/* Hover text */}
                        <span
                          className="absolute inset-0 flex items-center"
                          style={{
                            transform:
                              isHighlighted || isExpanded
                                ? 'translateY(0)'
                                : 'translateY(100%)',
                            transition:
                              isHighlighted || isExpanded
                                ? 'transform 1s cubic-bezier(0.16,1,0.3,1) 0.04s'
                                : 'transform 1s cubic-bezier(0.16,1,0.3,1) 0.06s',
                            color: 'var(--color-text-on-primary)',
                            fontFamily:
                              "'Pexel Grotesk', var(--font-sans)",
                            fontSize: '1.5rem',
                            fontWeight: 700,
                            ...instantStyle,
                          }}
                        >
                          <span className="block truncate">{job.title}</span>
                        </span>
                      </span>
                    </div>

                    {/* Mobile: title below company */}
                    <div className="col-span-12 md:hidden mt-0.5">
                      <span
                        className="text-sm"
                        style={{
                          fontFamily: 'var(--font-sans)',
                          color:
                            isHighlighted || isExpanded
                              ? 'var(--color-text-on-primary)'
                              : 'var(--color-text-secondary)',
                          opacity: dimmed ? 0.3 : 1,
                          transition: 'color 0.3s, opacity 0.3s',
                          ...instantStyle,
                        }}
                      >
                        {job.title}
                      </span>
                      <span
                        className="font-mono text-xs mt-1 block"
                        style={{
                          color:
                            isHighlighted || isExpanded
                              ? 'var(--color-text-on-primary)'
                              : 'var(--color-text-tertiary)',
                          opacity: dimmed ? 0.3 : 1,
                          transition: 'color 0.3s, opacity 0.3s',
                          ...instantStyle,
                        }}
                      >
                        {job.dateRange}
                      </span>
                    </div>

                    {/* Keyboard focus indicator */}
                    {isKeyboardFocused && (
                      <div
                        className="absolute inset-0 rounded-[12px] pointer-events-none"
                        style={{
                          outline: '2px solid var(--color-text-primary)',
                          outlineOffset: '2px',
                        }}
                      />
                    )}
                  </div>
                </div>

                {/* Accordion expand — CSS grid-template-rows transition */}
                <div
                  style={{
                    display: 'grid',
                    gridTemplateRows: isExpanded ? '1fr' : '0fr',
                    transition: reducedMotion
                      ? 'none'
                      : 'grid-template-rows 0.4s var(--ease-smooth)',
                    position: 'relative',
                    zIndex: isExpanded ? 10 : 1,
                  }}
                >
                  <div className="overflow-hidden min-h-0">
                    <div
                      className="py-4 md:py-6"
                      style={{
                        backgroundColor: isExpanded
                          ? 'var(--color-bg-fill-primary)'
                          : 'transparent',
                        borderRadius: '0 0 12px 12px',
                        marginLeft: '-12px',
                        marginRight: '-12px',
                        paddingLeft: '12px',
                        paddingRight: '12px',
                      }}
                    >
                      {/* 6-6 grid: description left, achievements right */}
                      <div className="grid grid-cols-12 gap-x-4 gap-y-4">
                        {/* Description + location */}
                        <div className="col-span-12 md:col-span-6">
                          {job.location && (
                            <p
                              className="text-xs font-mono mb-2"
                              style={{
                                color: 'var(--color-text-on-primary)',
                                opacity: 0.7,
                              }}
                            >
                              {job.location}
                            </p>
                          )}
                          {job.description && (
                            <p
                              className="text-base leading-relaxed"
                              style={{
                                color: 'var(--color-text-on-primary)',
                                fontFamily: 'var(--font-sans)',
                              }}
                            >
                              {job.description}
                            </p>
                          )}
                        </div>

                        {/* Achievements */}
                        {job.achievements &&
                          job.achievements.length > 0 && (
                            <div className="col-span-12 md:col-span-6">
                              <ul className="space-y-2">
                                {job.achievements.map((a, i) => (
                                  <li
                                    key={i}
                                    className="text-base leading-relaxed flex gap-2"
                                    style={{
                                      color:
                                        'var(--color-text-on-primary)',
                                      fontFamily: 'var(--font-sans)',
                                    }}
                                  >
                                    <span
                                      className="shrink-0 mt-1"
                                      style={{ opacity: 0.6 }}
                                    >
                                      -
                                    </span>
                                    <span>{a.text}</span>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Row divider */}
                <div
                  className="h-px w-full bg-border-primary"
                  style={{
                    opacity:
                      isHighlighted || isExpanded ? 0 : 0.1,
                    transition: 'opacity 0.3s',
                    ...instantStyle,
                  }}
                />
              </div>
            )
          })}
        </div>

        {/* Keyboard hints */}
        <div className="-entrance -fade -a-13 items-center gap-3 py-4 hidden lg:flex">
          <div className="flex items-center gap-1">
            <KeyBadge>↑</KeyBadge>
            <KeyBadge>↓</KeyBadge>
            <span className="text-xs text-text-tertiary ml-0.5">
              to navigate
            </span>
          </div>
          <span className="text-xs text-text-tertiary opacity-40">·</span>
          <div className="flex items-center gap-1.5">
            <KeyBadge>Enter</KeyBadge>
            <span className="text-xs text-text-tertiary">to expand</span>
          </div>
          <span className="text-xs text-text-tertiary opacity-40">·</span>
          <div className="flex items-center gap-1.5">
            <KeyBadge>Esc</KeyBadge>
            <span className="text-xs text-text-tertiary">
              to collapse all
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}

function KeyBadge({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center justify-center bg-bg-surface-primary text-text-primary text-[11px] font-medium font-mono px-[5px] py-[2px] rounded-[3px] leading-none">
      {children}
    </span>
  )
}
