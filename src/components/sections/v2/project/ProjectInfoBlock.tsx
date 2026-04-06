'use client'

import { useInView } from '@/hooks/useInView'
import { Grid, GridItem } from '@/components/layout/Grid'
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

function ExternalLinkIcon() {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 14 14"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="shrink-0 translate-y-[1px]"
    >
      <path
        d="M4 1.5H12.5V10M12 2L1.5 12.5"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
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
            <div className="space-y-2">
              {project.links.map((link, i) => (
                <a
                  key={i}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-[18px] leading-[1.6] text-text-secondary hover:text-text-primary transition-colors group"
                  style={{ fontFamily: 'var(--font-sans)' }}
                >
                  <span>{link.label}</span>
                  <span className="opacity-50 group-hover:opacity-100 transition-opacity">
                    <ExternalLinkIcon />
                  </span>
                </a>
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
