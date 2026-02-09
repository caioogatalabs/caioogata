'use client'

import { useRef, useEffect } from 'react'
import { useLanguage } from '@/components/providers/LanguageProvider'
import { useNavigation } from '@/components/providers/NavigationProvider'
import SectionHeading from '@/components/ui/SectionHeading'
import ExpandableSection from '@/components/ui/ExpandableSection'
import ProjectCanvas from '@/components/ui/ProjectCanvas'
import ArrowRightIcon from '@/components/ui/ArrowRightIcon'

export default function Projects() {
  const { content } = useLanguage()
  const { subItemIndex, setSubItemIndex, setSubItemsCount, expandedSubItems, toggleSubItemExpanded } = useNavigation()
  const sectionRefs = useRef<(HTMLButtonElement | null)[]>([])

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
            >
              <div className="space-y-6">
                <p className="text-sm text-neutral-300 font-mono leading-relaxed">
                  {project.description}
                </p>

                {/* Project Images Canvas */}
                {project.images && project.images.length > 0 ? (
                  <div className="relative -mr-6 md:-mr-12 lg:-mr-24 xl:-mr-48 2xl:-mr-96">
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

                {/* Project Details - Template sections for future content */}
                <div className="space-y-4">
                  {/* Role */}
                  <div>
                    <div className="flex items-center gap-2 mb-6">
                      <span className="w-4 shrink-0 flex items-center justify-center text-primary" aria-hidden>
                        <ArrowRightIcon />
                      </span>
                      <h3 className="text-base font-bold text-secondary font-mono">Role</h3>
                    </div>
                    <p className="text-sm text-neutral-300 font-mono ml-6">
                      [To be defined]
                    </p>
                  </div>

                  {/* Technologies */}
                  <div>
                    <div className="flex items-center gap-2 mb-6">
                      <span className="w-4 shrink-0 flex items-center justify-center text-primary" aria-hidden>
                        <ArrowRightIcon />
                      </span>
                      <h3 className="text-base font-bold text-secondary font-mono">Technologies</h3>
                    </div>
                    <p className="text-sm text-neutral-300 font-mono ml-6">
                      [To be defined]
                    </p>
                  </div>

                  {/* Impact */}
                  <div>
                    <div className="flex items-center gap-2 mb-6">
                      <span className="w-4 shrink-0 flex items-center justify-center text-primary" aria-hidden>
                        <ArrowRightIcon />
                      </span>
                      <h3 className="text-base font-bold text-secondary font-mono">Impact</h3>
                    </div>
                    <p className="text-sm text-neutral-300 font-mono ml-6">
                      [To be defined]
                    </p>
                  </div>

                  {/* Links placeholder */}
                  <div className="pt-2 border-t border-primary/10">
                    <div className="flex items-center gap-4">
                      <span className="text-sm text-neutral-300 font-mono">
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
