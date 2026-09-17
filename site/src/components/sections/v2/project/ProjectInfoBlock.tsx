'use client'

import { useInView } from '@/hooks/useInView'
import { useLanguage } from '@/components/providers/LanguageProvider'
import { Grid, GridItem } from '@/components/layout/Grid'
import { ExternalLink } from '@/components/ui/ExternalLink'
import type { ProjectItem } from '@/content/types'
import { LABEL } from '@/components/ui/label'

interface ProjectInfoBlockProps {
  project: ProjectItem
}

function Label({ children }: { children: React.ReactNode }) {
  return (
    <p className={`${LABEL} mb-2`}>
      {children}
    </p>
  )
}

function Value({ children }: { children: React.ReactNode }) {
  return (
    <p
      className="text-[14px] leading-[1.6] md:text-[18px] text-text-secondary"
      style={{ fontFamily: 'var(--font-sans)' }}
    >
      {children}
    </p>
  )
}

export function ProjectInfoBlock({ project }: ProjectInfoBlockProps) {
  const sectionRef = useInView()
  const t = useLanguage().content.ui.project

  return (
    <section
      ref={sectionRef as React.RefObject<HTMLElement>}
      className="pt-24 pb-8 border-t border-border-primary"
    >
      <Grid>
        {/* Col 1: Project + Role + Year */}
        <GridItem span={3} tabletSpan={4} mobileSpan={4} className="-entrance -fade -a-0">
          <div className="space-y-6">
            <div>
              <Label>{t.project}</Label>
              <Value>{project.title}</Value>
            </div>
            <div>
              <Label>{t.clientRole}</Label>
              <Value>{project.role || '\u2014'}</Value>
            </div>
            <div>
              <Label>{t.year}</Label>
              <Value>{project.year || '\u2014'}</Value>
            </div>
          </div>
        </GridItem>

        {/* Col 2: Technologies */}
        <GridItem span={3} tabletSpan={4} mobileSpan={4} className="-entrance -fade -a-1">
          <Label>{t.technologies}</Label>
          <Value>{project.technologies || '\u2014'}</Value>
        </GridItem>

        {/* Col 3: Credits */}
        <GridItem span={3} tabletSpan={4} mobileSpan={4} className="-entrance -fade -a-2">
          <Label>{t.credits}</Label>
          {project.credits && project.credits.length > 0 ? (
            <div className="space-y-1">
              {project.credits.map((credit, i) => (
                <p
                  key={i}
                  className="text-[14px] leading-[1.6] md:text-[18px]"
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
                  {/* Names only. `credit.role` stays in the content, unshown:
                      a title per person turned the list into an org chart. */}
                </p>
              ))}
            </div>
          ) : (
            <Value>{'\u2014'}</Value>
          )}
        </GridItem>

        {/* Col 4: Links */}
        <GridItem span={3} tabletSpan={4} mobileSpan={4} className="-entrance -fade -a-3">
          <Label>{t.links}</Label>
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
