'use client'

import { useInView } from '@/hooks/useInView'
import { Grid, GridItem } from '@/components/layout/Grid'
import type { ProjectItem } from '@/content/types'

interface ProjectInfoBlockProps {
  project: ProjectItem
}

function InfoColumn({ header, children }: { header: string; children: React.ReactNode }) {
  return (
    <div>
      <p className="font-mono text-xs uppercase tracking-wider text-text-tertiary mb-2">
        {header}
      </p>
      <div className="text-base text-text-primary" style={{ fontFamily: 'var(--font-sans)' }}>
        {children}
      </div>
    </div>
  )
}

export function ProjectInfoBlock({ project }: ProjectInfoBlockProps) {
  const sectionRef = useInView()

  return (
    <section
      ref={sectionRef as React.RefObject<HTMLElement>}
      className="py-8 bg-bg-surface-secondary"
    >
      <div className="px-5 md:px-8 lg:px-16 mb-6">
        <h2
          className="text-[1.875rem] font-bold leading-[1.2] text-text-primary -entrance -fade -a-0"
          style={{ fontFamily: 'var(--font-sans)' }}
        >
          Project Details
        </h2>
      </div>

      <Grid>
        <GridItem span={3} tabletSpan={4} mobileSpan={4} className="-entrance -fade -a-1">
          <InfoColumn header="Project">
            {project.title}
          </InfoColumn>
        </GridItem>

        <GridItem span={2} tabletSpan={4} mobileSpan={4} className="-entrance -fade -a-2">
          <InfoColumn header="Client & Role">
            {project.role || '\u2014'}
          </InfoColumn>
        </GridItem>

        <GridItem span={3} tabletSpan={4} mobileSpan={4} className="-entrance -fade -a-3">
          <InfoColumn header="Technologies">
            {project.technologies || '\u2014'}
          </InfoColumn>
        </GridItem>

        <GridItem span={2} tabletSpan={4} mobileSpan={4} className="-entrance -fade -a-4">
          <InfoColumn header="Year">
            {project.year || '\u2014'}
          </InfoColumn>
        </GridItem>

        <GridItem span={2} tabletSpan={4} mobileSpan={4} className="-entrance -fade -a-5">
          <InfoColumn header="Links">
            {project.links && project.links.length > 0 ? (
              <div className="space-y-1">
                {project.links.map((link, i) => (
                  <a
                    key={i}
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block text-text-brand hover:underline transition-colors"
                  >
                    {link.label}
                  </a>
                ))}
              </div>
            ) : (
              <span>{'\u2014'}</span>
            )}
          </InfoColumn>
        </GridItem>
      </Grid>
    </section>
  )
}
