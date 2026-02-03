'use client'

import { useRef, useEffect, useCallback } from 'react'
import { useLanguage } from '@/components/providers/LanguageProvider'
import { useNavigation } from '@/components/providers/NavigationProvider'
import SectionHeading from '@/components/ui/SectionHeading'
import ExpandableSection from '@/components/ui/ExpandableSection'
import ProjectCanvas from '@/components/ui/ProjectCanvas'

export default function Projects() {
  const { content } = useLanguage()
  const { subItemIndex, setSubItemIndex, setSubItemsCount, expandedSubItems, toggleSubItemExpanded, collapseSubItem } = useNavigation()
  const sectionRefs = useRef<(HTMLButtonElement | null)[]>([])

  // Flag to prevent double-toggle when clicking outside canvas on ExpandableSection
  const justExitedCanvasRef = useRef(false)

  // Handle canvas exit - only collapse, don't toggle
  const handleCanvasExit = useCallback((index: number) => {
    justExitedCanvasRef.current = true
    collapseSubItem(index)
    // Reset flag after 2 animation frames to ensure click event has been processed
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        justExitedCanvasRef.current = false
      })
    })
  }, [collapseSubItem])

  // Handle toggle - skip if we just exited the canvas (to avoid double-toggle)
  const handleToggle = useCallback((index: number) => {
    if (justExitedCanvasRef.current) {
      justExitedCanvasRef.current = false
      return
    }
    toggleSubItemExpanded(index)
  }, [toggleSubItemExpanded])

  // Set the number of sub-items for keyboard navigation
  useEffect(() => {
    setSubItemsCount(content.projects.items.length)
  }, [content.projects.items.length, setSubItemsCount])

  // When subItemIndex changes via Arrow keys, move focus to the selected section (keeps Tab and Arrow in sync)
  useEffect(() => {
    const currentFocusedIsSection = sectionRefs.current.some(ref => ref === document.activeElement)
    if (!currentFocusedIsSection && sectionRefs.current[subItemIndex]) {
      sectionRefs.current[subItemIndex]?.focus()
    }
  }, [subItemIndex])

  return (
    <section id="projects" aria-labelledby="projects-heading">
      <SectionHeading command={content.projects.command} id="projects-heading">
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
              onToggle={() => handleToggle(index)}
              onFocus={() => setSubItemIndex(index)}
            >
              <div className="space-y-6">
                <p className="text-sm text-neutral-400 font-mono leading-relaxed">
                  {project.description}
                </p>

                {/* Project Images Canvas */}
                {project.images && project.images.length > 0 ? (
                  <div className="relative -mr-6 md:-mr-12 lg:-mr-24 xl:-mr-48 2xl:-mr-96">
                    <ProjectCanvas
                      images={project.images}
                      viewModeLabels={content.projects.viewModes}
                      onExit={() => handleCanvasExit(index)}
                    />
                  </div>
                ) : (
                  <div className="aspect-video bg-neutral border border-primary/30 rounded-base flex items-center justify-center">
                    <span className="text-sm text-neutral-400 font-mono">
                      No images available
                    </span>
                  </div>
                )}

                {/* Project Details - Template sections for future content */}
                <div className="space-y-4">
                  {/* Role */}
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-primary font-mono text-sm">@</span>
                      <span className="text-primary font-mono text-sm">Role</span>
                    </div>
                    <p className="text-sm text-neutral-400 font-mono ml-6">
                      [To be defined]
                    </p>
                  </div>

                  {/* Technologies */}
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-primary font-mono text-sm">#</span>
                      <span className="text-primary font-mono text-sm">Technologies</span>
                    </div>
                    <p className="text-sm text-neutral-400 font-mono ml-6">
                      [To be defined]
                    </p>
                  </div>

                  {/* Impact */}
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-primary font-mono text-sm">*</span>
                      <span className="text-primary font-mono text-sm">Impact</span>
                    </div>
                    <p className="text-sm text-neutral-400 font-mono ml-6">
                      [To be defined]
                    </p>
                  </div>

                  {/* Links placeholder */}
                  <div className="pt-2 border-t border-primary/10">
                    <div className="flex items-center gap-4">
                      <span className="text-sm text-neutral-400 font-mono">
                        &gt; View case study [coming soon]
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </ExpandableSection>
          )
        })}
      </div>
    </section>
  )
}
