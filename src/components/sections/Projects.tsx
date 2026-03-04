'use client'

import { useRef, useEffect } from 'react'
import { useLanguage } from '@/components/providers/LanguageProvider'
import { useNavigation } from '@/components/providers/NavigationProvider'
import { useInteractionMode } from '@/hooks/useInteractionMode'
import SectionHeading from '@/components/ui/SectionHeading'
import ExpandableSection from '@/components/ui/ExpandableSection'
import ProjectCanvas from '@/components/ui/ProjectCanvas'
import ArrowRightIcon from '@/components/ui/ArrowRightIcon'

export default function Projects() {
  const { content } = useLanguage()
  const { subItemIndex, setSubItemIndex, setSubItemsCount, expandedSubItems, toggleSubItemExpanded } = useNavigation()
  const { mode } = useInteractionMode()
  const sectionRefs = useRef<(HTMLButtonElement | null)[]>([])

  // Set the number of sub-items for keyboard navigation
  useEffect(() => {
    setSubItemsCount(content.projects.items.length)
  }, [content.projects.items.length, setSubItemsCount])

  // When subItemIndex changes via Arrow keys, move focus to the selected section (keeps Tab and Arrow in sync)
  // In keyboard mode, scroll item into view only when it approaches the top/bottom 30% of the viewport
  useEffect(() => {
    const currentFocusedIsSection = sectionRefs.current.some(ref => ref === document.activeElement)
    if (!currentFocusedIsSection && sectionRefs.current[subItemIndex]) {
      sectionRefs.current[subItemIndex]?.focus({ preventScroll: true })
    }
    if (mode === 'keyboard') {
      const el = sectionRefs.current[subItemIndex]
      if (el) {
        const rect = el.getBoundingClientRect()
        const vh = window.innerHeight
        if (rect.bottom > vh * 0.70 || rect.top < vh * 0.30) {
          el.scrollIntoView({ behavior: 'smooth', block: 'center' })
        }
      }
    }
  }, [subItemIndex, mode])

  return (
    <section id="projects" aria-labelledby="projects-heading">
      <SectionHeading id="projects-heading">
        {content.projects.heading}
      </SectionHeading>

      <div className="space-y-0">
        {content.projects.items.map((project, index) => {
          const isSelected = subItemIndex === index
          const isExpanded = expandedSubItems.has(index)

          return (
            <ExpandableSection
              key={index}
              ref={el => { sectionRefs.current[index] = el }}
              title={project.title}
              isSelected={isSelected}
              isExpanded={isExpanded}
              onToggle={() => toggleSubItemExpanded(index)}
              onFocus={() => setSubItemIndex(index)}
              disabled={project.disabled}
            >
              <div className="space-y-6">
                <p className="text-sm text-neutral-300 font-mono leading-relaxed">
                  {project.description}
                </p>

                {/* Project Images Canvas */}
                {project.images && project.images.length > 0 ? (
                  <div className="relative xl:-mr-48 2xl:-mr-96 overflow-hidden">
                    <ProjectCanvas
                      images={project.images}
                      viewModeLabels={content.projects.viewModes}
                      onExit={() => toggleSubItemExpanded(index)}
                    />
                  </div>
                ) : (
                  <div className="aspect-video bg-neutral border border-primary/30 rounded-base flex items-center justify-center">
                    <span className="text-sm text-neutral-300 font-mono">
                      No images available
                    </span>
                  </div>
                )}

                {/* Project Details */}
                <div className="space-y-8">
                  {project.role && (
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <span className="w-4 shrink-0 flex items-center justify-center text-primary" aria-hidden>
                          <ArrowRightIcon />
                        </span>
                        <h3 className="text-base font-bold text-secondary font-mono">Role</h3>
                      </div>
                      <p className="text-sm text-neutral-300 font-mono ml-6">
                        {project.role}
                      </p>
                    </div>
                  )}

                  {project.technologies && (
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <span className="w-4 shrink-0 flex items-center justify-center text-primary" aria-hidden>
                          <ArrowRightIcon />
                        </span>
                        <h3 className="text-base font-bold text-secondary font-mono">Technologies</h3>
                      </div>
                      <p className="text-sm text-neutral-300 font-mono ml-6">
                        {project.technologies}
                      </p>
                    </div>
                  )}

                  {project.impact && (
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <span className="w-4 shrink-0 flex items-center justify-center text-primary" aria-hidden>
                          <ArrowRightIcon />
                        </span>
                        <h3 className="text-base font-bold text-secondary font-mono">Impact</h3>
                      </div>
                      <p className="text-sm text-neutral-300 font-mono ml-6">
                        {project.impact}
                      </p>
                    </div>
                  )}

                  {project.credits && project.credits.length > 0 && (
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <span className="w-4 shrink-0 flex items-center justify-center text-primary" aria-hidden>
                          <ArrowRightIcon />
                        </span>
                        <h3 className="text-base font-bold text-secondary font-mono">Credits</h3>
                      </div>
                      <div className="ml-6 space-y-1">
                        {project.credits.map((credit, i) => (
                          <p key={i} className="text-sm text-neutral-300 font-mono">
                            {credit.url ? (
                              <a
                                href={credit.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-secondary hover:text-primary transition-colors"
                              >
                                {credit.name}
                              </a>
                            ) : (
                              <span className="text-secondary">{credit.name}</span>
                            )}
                            {credit.role && (
                              <span className="text-neutral-500"> — {credit.role}</span>
                            )}
                          </p>
                        ))}
                      </div>
                    </div>
                  )}

                  {project.downloads && project.downloads.length > 0 && (
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <span className="w-4 shrink-0 flex items-center justify-center text-primary" aria-hidden>
                          <ArrowRightIcon />
                        </span>
                        <h3 className="text-base font-bold text-secondary font-mono">Downloads</h3>
                      </div>
                      <div className="ml-6 space-y-1">
                        {project.downloads.map((download, i) => (
                          <a
                            key={i}
                            href={download.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="block text-sm text-secondary font-mono hover:text-primary transition-colors"
                          >
                            &gt; {download.label}
                          </a>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* caseStudyUrl kept in data for LLM routes — not rendered in UI */}
                </div>
              </div>
            </ExpandableSection>
          )
        })}
      </div>
    </section>
  )
}
