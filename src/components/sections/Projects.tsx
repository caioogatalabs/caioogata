'use client'

import { useRef, useEffect } from 'react'
import { useLanguage } from '@/components/providers/LanguageProvider'
import { useNavigation } from '@/components/providers/NavigationProvider'
import SectionHeading from '@/components/ui/SectionHeading'
import ExpandableSection from '@/components/ui/ExpandableSection'

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
              onToggle={() => toggleSubItemExpanded(index)}
              onFocus={() => setSubItemIndex(index)}
            >
              <div className="space-y-6">
                <p className="text-base text-secondary leading-relaxed">
                  {project.description}
                </p>

                {/* Project Image Placeholder */}
                <div className="aspect-video bg-neutral border border-primary/30 rounded-base flex items-center justify-center relative overflow-hidden">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-neutral-400 font-mono text-sm">
                      {project.imagePlaceholder}
                    </div>
                  </div>
                </div>

                {/* Project Details - Template sections for future content */}
                <div className="space-y-4">
                  {/* Role */}
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-primary font-mono text-sm">@</span>
                      <span className="text-primary font-mono text-sm">Role</span>
                    </div>
                    <p className="text-sm text-neutral-400 ml-6">
                      [To be defined]
                    </p>
                  </div>

                  {/* Technologies */}
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-primary font-mono text-sm">#</span>
                      <span className="text-primary font-mono text-sm">Technologies</span>
                    </div>
                    <p className="text-sm text-neutral-400 ml-6">
                      [To be defined]
                    </p>
                  </div>

                  {/* Impact */}
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-primary font-mono text-sm">*</span>
                      <span className="text-primary font-mono text-sm">Impact</span>
                    </div>
                    <p className="text-sm text-neutral-400 ml-6">
                      [To be defined]
                    </p>
                  </div>

                  {/* Links placeholder */}
                  <div className="pt-2 border-t border-primary/10">
                    <div className="flex items-center gap-4">
                      <span className="text-xs text-neutral-500 font-mono">
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
