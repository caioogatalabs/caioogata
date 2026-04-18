'use client'

import { useState, useRef, useEffect, useCallback, useMemo } from 'react'
import { useInView } from '@/hooks/useInView'
import { Grid, GridItem } from '@/components/layout/Grid'
import { StickyLogoBar } from '@/components/sections/v2/StickyLogoBar'
import content from '@/content/en.json'
import type { Content, Skill } from '@/content/types'

const typedContent = content as unknown as Content
const skillsData = typedContent.skills
const projectItems = typedContent.projects.items.filter(p => !p.disabled)

const LEVEL_WIDTH: Record<string, string> = {
  Expert: '95%',
  Advanced: '75%',
  Proficient: '55%',
  Familiar: '35%',
}

/* ── Collect all skills with projectSlugs for SVG mapping ── */
function getSkillsWithProjects(): Array<Skill & { category: string }> {
  const result: Array<Skill & { category: string }> = []
  for (const cat of skillsData.categories) {
    for (const skill of cat.skills) {
      if (skill.projectSlugs && skill.projectSlugs.length > 0) {
        result.push({ ...skill, category: cat.title })
      }
    }
  }
  return result
}

/* ── Reverse map: project slug -> skill names ── */
function getProjectToSkills(): Record<string, string[]> {
  const map: Record<string, string[]> = {}
  for (const cat of skillsData.categories) {
    for (const skill of cat.skills) {
      if (skill.projectSlugs) {
        for (const slug of skill.projectSlugs) {
          if (!map[slug]) map[slug] = []
          map[slug].push(skill.name)
        }
      }
    }
  }
  return map
}

/* ── SVG line data ── */
interface LineData {
  skillId: string
  projectSlug: string
  x1: number
  y1: number
  x2: number
  y2: number
}

export function SkillsSection() {
  const heroRef = useInView({ threshold: 0.1, once: true })
  const mapRef = useInView({ threshold: 0.05, once: true })
  const containerRef = useRef<HTMLDivElement>(null)

  const [highlightedSkill, setHighlightedSkill] = useState<string | null>(null)
  const [highlightedProject, setHighlightedProject] = useState<string | null>(null)
  const [lines, setLines] = useState<LineData[]>([])
  const [mapInView, setMapInView] = useState(false)
  const [reducedMotion, setReducedMotion] = useState(false)
  const [pathLengths, setPathLengths] = useState<Record<string, number>>({})

  const skillsWithProjects = useMemo(getSkillsWithProjects, [])
  const projectToSkills = useMemo(getProjectToSkills, [])
  const svgRef = useRef<SVGSVGElement>(null)

  const totalSkills = skillsData.categories.reduce((acc, cat) => acc + cat.skills.length, 0)

  /* ── Reduced motion detection ── */
  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
    setReducedMotion(mq.matches)
    const handler = (e: MediaQueryListEvent) => setReducedMotion(e.matches)
    mq.addEventListener('change', handler)
    return () => mq.removeEventListener('change', handler)
  }, [])

  /* ── Detect map in view for line draw animation ── */
  useEffect(() => {
    const el = containerRef.current
    if (!el) return
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setMapInView(true)
          observer.unobserve(el)
        }
      },
      { threshold: 0.05 }
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  /* ── Calculate SVG line positions ── */
  const calculateLines = useCallback(() => {
    const container = containerRef.current
    if (!container) return

    const containerRect = container.getBoundingClientRect()
    const newLines: LineData[] = []

    for (const skill of skillsWithProjects) {
      const skillEl = container.querySelector(`[data-skill-id="${CSS.escape(skill.name)}"]`)
      if (!skillEl || !skill.projectSlugs) continue

      const skillRect = skillEl.getBoundingClientRect()
      const x1 = skillRect.right - containerRect.left
      const y1 = skillRect.top + skillRect.height / 2 - containerRect.top

      for (const slug of skill.projectSlugs) {
        const projectEl = container.querySelector(`[data-project-slug="${slug}"]`)
        if (!projectEl) continue

        const projectRect = projectEl.getBoundingClientRect()
        const x2 = projectRect.left - containerRect.left
        const y2 = projectRect.top + projectRect.height / 2 - containerRect.top

        newLines.push({ skillId: skill.name, projectSlug: slug, x1, y1, x2, y2 })
      }
    }

    setLines(newLines)
  }, [skillsWithProjects])

  /* ── Recalculate on resize ── */
  useEffect(() => {
    calculateLines()
    let timeout: ReturnType<typeof setTimeout>
    const handleResize = () => {
      clearTimeout(timeout)
      timeout = setTimeout(calculateLines, 200)
    }
    window.addEventListener('resize', handleResize)
    return () => {
      window.removeEventListener('resize', handleResize)
      clearTimeout(timeout)
    }
  }, [calculateLines])

  /* ── Measure path lengths for stroke-dash animation ── */
  useEffect(() => {
    if (!svgRef.current || lines.length === 0) return
    const paths = svgRef.current.querySelectorAll('path[data-line-key]')
    const lengths: Record<string, number> = {}
    paths.forEach(path => {
      const key = path.getAttribute('data-line-key')
      if (key) {
        lengths[key] = (path as SVGPathElement).getTotalLength()
      }
    })
    setPathLengths(lengths)
  }, [lines])

  /* ── Helper: generate bezier path ── */
  function makePath(line: LineData): string {
    const dx = (line.x2 - line.x1) * 0.5
    return `M ${line.x1} ${line.y1} C ${line.x1 + dx} ${line.y1}, ${line.x2 - dx} ${line.y2}, ${line.x2} ${line.y2}`
  }

  /* ── Helper: is a line highlighted? ── */
  function isLineHighlighted(line: LineData): boolean {
    if (highlightedSkill) return line.skillId === highlightedSkill
    if (highlightedProject) return line.projectSlug === highlightedProject
    return false
  }

  /* ── Helper: is anything highlighted? ── */
  const hasHighlight = highlightedSkill !== null || highlightedProject !== null

  /* ── Helper: is a skill highlighted? ── */
  function isSkillHighlighted(skillName: string): boolean {
    if (!hasHighlight) return true
    if (highlightedSkill === skillName) return true
    if (highlightedProject) {
      const connected = projectToSkills[highlightedProject]
      return connected?.includes(skillName) ?? false
    }
    return false
  }

  /* ── Helper: is a project highlighted? ── */
  function isProjectHighlighted(slug: string): boolean {
    if (!hasHighlight) return true
    if (highlightedProject === slug) return true
    if (highlightedSkill) {
      const skill = skillsWithProjects.find(s => s.name === highlightedSkill)
      return skill?.projectSlugs?.includes(slug) ?? false
    }
    return false
  }

  const transitionStyle = reducedMotion
    ? { transition: 'none' }
    : { transition: 'opacity 0.3s ease' }

  return (
    <div className="min-h-screen bg-bg">
      {/* ── Hero zone ── */}
      <div className="bg-bg-surface-secondary pt-8 md:pt-10 lg:pt-12">
        <StickyLogoBar />

        <div
          ref={heroRef as React.RefObject<HTMLDivElement>}
          className="px-5 md:px-8 lg:px-16 pb-16 md:pb-24"
        >
          <h1
            className="-entrance -slide-up -a-0 text-5xl md:text-7xl lg:text-8xl text-text-primary mt-12 md:mt-16 lg:mt-20"
            style={{ fontFamily: 'var(--font-sans)', fontWeight: 700 }}
          >
            Skills
          </h1>

          <div className="-entrance -fade -a-2 flex gap-6 mt-6 font-mono text-sm text-text-secondary">
            <span>{skillsData.categories.length} categories</span>
            <span>{totalSkills} skills</span>
            <span>{projectItems.length} case studies</span>
          </div>
        </div>
      </div>

      {/* ── Relationship map zone ── */}
      <div
        ref={(el) => {
          containerRef.current = el
          // Also assign to mapRef for entrance animations
          if (mapRef && typeof mapRef === 'object' && 'current' in mapRef) {
            (mapRef as React.MutableRefObject<HTMLElement | null>).current = el
          }
        }}
        className="relative px-5 md:px-8 lg:px-16 py-16 md:py-24"
      >
        <Grid className="relative">
          {/* ── Left column: Skills list ── */}
          <GridItem span={6} tabletSpan={8} mobileSpan={4}>
            <div className="space-y-10">
              {skillsData.categories.map((category, catIndex) => (
                <div key={category.title} className={`-entrance -slide-up -a-${catIndex}`}>
                  <h3
                    className="font-mono text-xs text-text-secondary uppercase tracking-wider mb-4"
                  >
                    {category.title}
                  </h3>

                  <div className="space-y-0">
                    {category.skills.map((skill) => {
                      const hasProjects = skill.projectSlugs && skill.projectSlugs.length > 0
                      const highlighted = isSkillHighlighted(skill.name)

                      return (
                        <div
                          key={skill.name}
                          data-skill-id={skill.name}
                          className="py-2.5 cursor-default"
                          style={{
                            opacity: hasHighlight && !highlighted ? 0.2 : 1,
                            ...transitionStyle,
                          }}
                          onMouseEnter={() => hasProjects && setHighlightedSkill(skill.name)}
                          onMouseLeave={() => setHighlightedSkill(null)}
                          onFocus={() => hasProjects && setHighlightedSkill(skill.name)}
                          onBlur={() => setHighlightedSkill(null)}
                          tabIndex={hasProjects ? 0 : undefined}
                          role={hasProjects ? 'button' : undefined}
                          aria-label={hasProjects ? `${skill.name} - connected to projects` : undefined}
                        >
                          <div className="flex items-center gap-2 mb-1.5">
                            {hasProjects && (
                              <span
                                className="w-1.5 h-1.5 rounded-full shrink-0"
                                style={{ backgroundColor: 'var(--color-bg-fill-primary)' }}
                              />
                            )}
                            <span
                              className="text-base text-text-primary"
                              style={{ fontFamily: 'var(--font-sans)', fontWeight: 400 }}
                            >
                              {skill.name}
                            </span>
                          </div>

                          {/* Progress bar */}
                          <div className="relative">
                            <div
                              className="h-px w-full"
                              style={{ backgroundColor: 'var(--color-border-primary)' }}
                            />
                            <div
                              className="absolute top-0 left-0 h-0.5"
                              style={{
                                width: LEVEL_WIDTH[skill.level] || '50%',
                                backgroundColor: 'var(--color-text-primary)',
                                transform: 'translateY(-0.5px)',
                              }}
                            />
                          </div>

                          <span className="font-mono text-xs text-text-secondary mt-1 block">
                            {skill.level}
                          </span>
                        </div>
                      )
                    })}
                  </div>
                </div>
              ))}
            </div>
          </GridItem>

          {/* ── Right column: Projects list ── */}
          <GridItem span={6} tabletSpan={8} mobileSpan={4}>
            <div className="md:pl-8 lg:pl-12 mt-10 md:mt-0">
              <h3
                className="font-mono text-xs text-text-secondary uppercase tracking-wider mb-4 -entrance -fade -a-1"
              >
                Case Studies
              </h3>

              <div className="space-y-6">
                {projectItems.map((project, index) => {
                  const highlighted = isProjectHighlighted(project.slug)
                  const connectedSkills = projectToSkills[project.slug] || []

                  return (
                    <div
                      key={project.slug}
                      data-project-slug={project.slug}
                      className={`-entrance -slide-up -a-${index + 1} py-3 cursor-default`}
                      style={{
                        opacity: hasHighlight && !highlighted ? 0.2 : 1,
                        ...transitionStyle,
                      }}
                      onMouseEnter={() => setHighlightedProject(project.slug)}
                      onMouseLeave={() => setHighlightedProject(null)}
                      onFocus={() => setHighlightedProject(project.slug)}
                      onBlur={() => setHighlightedProject(null)}
                      tabIndex={0}
                      role="button"
                      aria-label={`${project.title} - connected to ${connectedSkills.length} skills`}
                    >
                      <a
                        href={`/projects/${project.slug}`}
                        className="block"
                        tabIndex={-1}
                      >
                        <span
                          className="text-lg text-text-primary block"
                          style={{ fontFamily: 'var(--font-sans)', fontWeight: 500 }}
                        >
                          {project.title}
                        </span>
                        <span className="font-mono text-xs text-text-secondary mt-1 block">
                          {project.role}{project.year ? ` / ${project.year}` : ''}
                        </span>
                      </a>

                      {/* Mobile: show connected skills as tags */}
                      {connectedSkills.length > 0 && (
                        <div className="flex flex-wrap gap-1.5 mt-2 md:hidden">
                          {connectedSkills.map(skillName => (
                            <span
                              key={skillName}
                              className="font-mono text-xs text-text-secondary px-2 py-0.5 rounded-full"
                              style={{ border: '1px solid var(--color-border-primary)' }}
                            >
                              {skillName}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  )
                })}
              </div>
            </div>
          </GridItem>
        </Grid>

        {/* ── SVG connecting lines (desktop only) ── */}
        <svg
          ref={svgRef}
          className="hidden md:block absolute inset-0 pointer-events-none"
          style={{ width: '100%', height: '100%', overflow: 'visible' }}
          aria-hidden="true"
        >
          {lines.map((line, index) => {
            const key = `${line.skillId}-${line.projectSlug}`
            const highlighted = isLineHighlighted(line)
            const length = pathLengths[key] || 0
            const drawn = mapInView

            return (
              <path
                key={key}
                data-line-key={key}
                d={makePath(line)}
                fill="none"
                stroke={
                  hasHighlight
                    ? highlighted
                      ? 'var(--color-bg-fill-primary)'
                      : 'var(--color-border-primary)'
                    : 'var(--color-border-primary)'
                }
                strokeWidth={highlighted && hasHighlight ? 2 : 1}
                style={{
                  opacity: hasHighlight && !highlighted ? 0.1 : 0.6,
                  strokeDasharray: reducedMotion ? 'none' : length || 'none',
                  strokeDashoffset: reducedMotion
                    ? 0
                    : drawn
                      ? 0
                      : length || 0,
                  transition: reducedMotion
                    ? 'none'
                    : `stroke-dashoffset 1s ease ${index * 0.05}s, stroke 0.3s ease, stroke-width 0.3s ease, opacity 0.3s ease`,
                }}
              />
            )
          })}
        </svg>
      </div>
    </div>
  )
}
