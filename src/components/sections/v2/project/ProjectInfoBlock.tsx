'use client'

import { useInView } from '@/hooks/useInView'
import { Grid, GridItem } from '@/components/layout/Grid'
import { ExternalLink } from '@/components/ui/ExternalLink'
import type { ProjectItem } from '@/content/types'

interface ProjectInfoBlockProps {
  project: ProjectItem
}

function Label({ children }: { children: React.ReactNode }) {
  return (
    <p className="font-mono text-xs uppercase tracking-[0.88px] text-text-tertiary mb-2">
      {children}
    </p>
  )
}

function Value({ children }: { children: React.ReactNode }) {
  return (
    <p
      className="text-[18px] leading-[1.6] text-text-secondary"
      style={{ fontFamily: 'var(--font-sans)' }}
    >
      {children}
    </p>
  )
}

export function ProjectInfoBlock({ project }: ProjectInfoBlockProps) {
  const sectionRef = useInView()

  return (
    <section
      ref={sectionRef as React.RefObject<HTMLElement>}
      className="py-16 border-t border-border-primary"
    >
      <Grid>
        {/* Col 1: Project + Role + Year */}
        <GridItem span={3} tabletSpan={4} mobileSpan={4} className="-entrance -fade -a-0">
          <div className="space-y-6">
            <div>
              <Label>Project</Label>
              <Value>{project.title}</Value>
            </div>
            <div>
              <Label>Client & Role</Label>
              <Value>{project.role || '\u2014'}</Value>
            </div>
            <div>
              <Label>Year</Label>
              <Value>{project.year || '\u2014'}</Value>
            </div>
          </div>
        </GridItem>

        {/* Col 2: Technologies */}
        <GridItem span={3} tabletSpan={4} mobileSpan={4} className="-entrance -fade -a-1">
          <Label>Technologies</Label>
          <Value>{project.technologies || '\u2014'}</Value>
        </GridItem>

        {/* Col 3: Credits */}
        <GridItem span={3} tabletSpan={4} mobileSpan={4} className="-entrance -fade -a-2">
          <Label>Credits</Label>
          {project.credits && project.credits.length > 0 ? (
            <div className="space-y-1">
              {project.credits.map((credit, i) => (
                <p
                  key={i}
                  className="text-[18px] leading-[1.6]"
                  style={{ fontFamily: 'var(--font-sans)' }}
                >
                  {credit.url ? (
                    <a
                      href={credit.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-text-secondary hover:text-text-primary transition-colors"
                    >
                      {credit.name}
                    </a>
                  ) : (
                    <span className="text-text-secondary">{credit.name}</span>
                  )}
                  {credit.role && (
                    <span className="text-text-tertiary text-[14px]"> — {credit.role}</span>
                  )}
                </p>
              ))}
            </div>
          ) : (
            <Value>{'\u2014'}</Value>
          )}
        </GridItem>

        {/* Col 4: Links */}
        <GridItem span={3} tabletSpan={4} mobileSpan={4} className="-entrance -fade -a-3">
          <Label>Links</Label>
          {project.links && project.links.length > 0 ? (
            <div className="flex flex-col gap-2">
              {project.links.map((link, i) => (
                <ExternalLink key={i} href={link.url}>
                  {link.label}
                </ExternalLink>
              ))}
            </div>
          ) : (
            <Value>{'\u2014'}</Value>
          )}
        </GridItem>
      </Grid>
    </section>
  )
}
