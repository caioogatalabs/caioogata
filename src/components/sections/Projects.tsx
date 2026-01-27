'use client'

import { useLanguage } from '@/components/providers/LanguageProvider'
import SectionHeading from '@/components/ui/SectionHeading'
import CLIBox from '@/components/ui/CLIBox'

export default function Projects() {
  const { content } = useLanguage()

  return (
    <section id="projects" aria-labelledby="projects-heading">
      <SectionHeading command={content.projects.command} id="projects-heading">
        {content.projects.heading}
      </SectionHeading>

      <div className="grid gap-4 md:grid-cols-2">
        {content.projects.items.map((project, index) => (
          <CLIBox key={index}>
            <div className="aspect-video bg-neutral border border-primary/30 rounded-base mb-4 flex items-center justify-center relative overflow-hidden">
              {/* Placeholder image */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-neutral-400 font-mono text-xs">
                  {project.imagePlaceholder}
                </div>
              </div>
              {/* Fire icon overlay */}
              <div className="absolute top-2 right-2">
                <span className="text-accent text-xl" aria-label="Featured project" title="Projeto em destaque">
                  🔥
                </span>
              </div>
            </div>
            <div>
              <h3 className="text-base font-bold text-primary mb-2 font-mono">
                {project.title}
              </h3>
              <p className="text-sm text-secondary leading-relaxed">
                {project.description}
              </p>
            </div>
          </CLIBox>
        ))}
      </div>
    </section>
  )
}
