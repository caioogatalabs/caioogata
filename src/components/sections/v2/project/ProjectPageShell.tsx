'use client'

import type { ProjectItem, ProjectSection } from '@/content/types'

interface ProjectPageShellProps {
  project: ProjectItem
}

function SectionBlock({ section, index }: { section: ProjectSection; index: number }) {
  switch (section.type) {
    case 'hero':
      return (
        <section key={index} className="py-16" data-block="hero">
          <div className="px-5 md:px-8 lg:px-16">
            <p className="font-mono text-xs text-text-tertiary uppercase tracking-[0.88px]">
              {section.type}
            </p>
            <p className="text-text-secondary mt-2">{section.body || 'Hero block'}</p>
          </div>
        </section>
      )
    case 'challenge':
      return (
        <section key={index} className="py-16" data-block="challenge">
          <div className="px-5 md:px-8 lg:px-16">
            <p className="font-mono text-xs text-text-tertiary uppercase tracking-[0.88px]">
              {section.type}
            </p>
            <p className="text-text-secondary mt-2">{section.challenge || ''}</p>
          </div>
        </section>
      )
    case 'impact':
      return (
        <section key={index} className="py-16" data-block="impact">
          <div className="px-5 md:px-8 lg:px-16">
            <p className="font-mono text-xs text-text-tertiary uppercase tracking-[0.88px]">
              {section.type}
            </p>
          </div>
        </section>
      )
    case 'gallery-staggered':
      return (
        <section key={index} className="py-16" data-block="gallery-staggered">
          <div className="px-5 md:px-8 lg:px-16">
            <p className="font-mono text-xs text-text-tertiary uppercase tracking-[0.88px]">
              Gallery: Staggered ({section.rows?.length || 0} rows)
            </p>
          </div>
        </section>
      )
    case 'gallery-feature-list':
      return (
        <section key={index} className="py-16" data-block="gallery-feature-list">
          <div className="px-5 md:px-8 lg:px-16">
            <p className="font-mono text-xs text-text-tertiary uppercase tracking-[0.88px]">
              Gallery: Feature List ({section.features?.length || 0} features)
            </p>
          </div>
        </section>
      )
    case 'gallery-full-detail':
      return (
        <section key={index} className="py-16" data-block="gallery-full-detail">
          <div className="px-5 md:px-8 lg:px-16">
            <p className="font-mono text-xs text-text-tertiary uppercase tracking-[0.88px]">
              Gallery: Full Detail
            </p>
          </div>
        </section>
      )
    default:
      return null
  }
}

export function ProjectPageShell({ project }: ProjectPageShellProps) {
  const sections = project.sections || []

  return (
    <div className="min-h-screen bg-bg">
      {/* Project title for immediate feedback */}
      <div className="px-5 md:px-8 lg:px-16 pt-20 pb-8">
        <h1
          className="text-4xl md:text-5xl lg:text-[3.5rem] font-bold text-text-primary leading-[1.15]"
          style={{ fontFamily: 'var(--font-sans)' }}
        >
          {project.title}
        </h1>
      </div>

      {/* Composed sections from data model (per D-01) */}
      {sections.map((section, i) => (
        <SectionBlock key={i} section={section} index={i} />
      ))}

      {/* Info block, credits, and navigation are always present (not configurable per project) */}
      <section className="py-16 bg-bg-surface-secondary" data-block="info">
        <div className="px-5 md:px-8 lg:px-16">
          <p className="font-mono text-xs text-text-tertiary uppercase tracking-[0.88px]">
            Info Block (Plan 02)
          </p>
        </div>
      </section>

      <section className="py-12" data-block="credits">
        <div className="px-5 md:px-8 lg:px-16">
          <p className="font-mono text-xs text-text-tertiary uppercase tracking-[0.88px]">
            Credits (Plan 02)
          </p>
        </div>
      </section>

      <nav className="border-t border-border-primary py-6 px-5 md:px-8 lg:px-16" data-block="navigation" aria-label="Project navigation">
        <p className="font-mono text-xs text-text-tertiary uppercase tracking-[0.88px]">
          Navigation (Plan 03)
        </p>
      </nav>
    </div>
  )
}
