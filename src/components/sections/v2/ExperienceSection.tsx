'use client'

import { useState } from 'react'
import { useInView } from '@/hooks/useInView'
import { Grid, GridItem } from '@/components/layout/Grid'
import content from '@/content/en.json'
import type { Job } from '@/content/types'

const jobs = content.experience.jobs as Job[]
const DETAILED_JOBS = jobs.slice(0, 7)
const MINOR_JOBS = jobs.slice(7)

const AZION_COMPANY = 'Azion Technologies'

function isAzionJob(job: Job): boolean {
  return job.company === AZION_COMPANY
}

export function ExperienceSection() {
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null)
  const headingRef = useInView({ threshold: 0.1, once: true })
  const rolesRef = useInView({ threshold: 0.05, once: true })
  const minorRef = useInView({ threshold: 0.1, once: true })

  const toggle = (index: number) =>
    setExpandedIndex((prev) => (prev === index ? null : index))

  // Group Azion jobs (indices 0-2)
  const azionJobs = DETAILED_JOBS.filter((_j, i) => i <= 2)
  const otherDetailedJobs = DETAILED_JOBS.filter((_j, i) => i > 2)

  return (
    <section
      id="experience"
      aria-label="Experience"
      data-theme="light"
      className="py-20 md:py-28 lg:py-36"
    >
      {/* Section heading */}
      <div ref={headingRef as React.RefObject<HTMLDivElement>}>
        <Grid>
          <GridItem span={12} tabletSpan={8} mobileSpan={4}>
            <h2
              className="-entrance -slide-up -a-0 text-lg font-semibold uppercase tracking-[1.2px] text-text-primary mb-12 md:mb-16"
              style={{ fontFamily: 'var(--font-sans)' }}
            >
              Experience
            </h2>
          </GridItem>
        </Grid>
      </div>

      {/* Roles list */}
      <div ref={rolesRef as React.RefObject<HTMLDivElement>}>
        {/* Azion career progression group */}
        <Grid className="mb-2">
          <GridItem span={12} tabletSpan={8} mobileSpan={4}>
            <div className="border-l-2 border-border-primary pl-4 md:pl-6">
              <span
                className="-entrance -slide-up -a-0 block text-xs uppercase tracking-[1px] text-text-tertiary font-medium mb-4"
                style={{ fontFamily: 'var(--font-sans)' }}
              >
                Azion Technologies — Career Progression
              </span>

              {azionJobs.map((job, i) => (
                <ExpandableRole
                  key={i}
                  job={job}
                  index={i}
                  isExpanded={expandedIndex === i}
                  onToggle={toggle}
                  staggerIndex={i}
                  isLast={i === azionJobs.length - 1}
                />
              ))}
            </div>
          </GridItem>
        </Grid>

        {/* Other detailed roles */}
        {otherDetailedJobs.map((job, i) => {
          const globalIndex = i + 3 // offset by Azion count
          return (
            <ExpandableRole
              key={globalIndex}
              job={job}
              index={globalIndex}
              isExpanded={expandedIndex === globalIndex}
              onToggle={toggle}
              staggerIndex={globalIndex}
              isLast={i === otherDetailedJobs.length - 1}
              useGrid
            />
          )
        })}
      </div>

      {/* Minor roles */}
      <div ref={minorRef as React.RefObject<HTMLDivElement>}>
        <Grid className="mt-8 md:mt-12">
          <GridItem span={12} tabletSpan={8} mobileSpan={4}>
            <span
              className="-entrance -slide-up -a-0 block text-xs uppercase tracking-[1px] text-text-tertiary font-medium mb-4"
              style={{ fontFamily: 'var(--font-sans)' }}
            >
              Earlier roles
            </span>
          </GridItem>
        </Grid>

        {MINOR_JOBS.map((job, i) => (
          <MinorRole
            key={i}
            job={job}
            staggerIndex={i}
            isLast={i === MINOR_JOBS.length - 1}
          />
        ))}
      </div>
    </section>
  )
}

/* ── Expandable role row (indices 0-6) ── */

interface ExpandableRoleProps {
  job: Job
  index: number
  isExpanded: boolean
  onToggle: (index: number) => void
  staggerIndex: number
  isLast: boolean
  useGrid?: boolean
}

function ExpandableRole({
  job,
  index,
  isExpanded,
  onToggle,
  staggerIndex,
  isLast,
  useGrid = false,
}: ExpandableRoleProps) {
  const detailId = `exp-detail-${index}`
  const staggerClass = `-a-${Math.min(staggerIndex, 20)}`

  const rowContent = (
    <div className={`${!isLast ? 'border-b border-border-primary' : ''}`}>
      <button
        onClick={() => onToggle(index)}
        aria-expanded={isExpanded}
        aria-controls={detailId}
        className={`-entrance -slide-up ${staggerClass} w-full text-left py-3`}
      >
        <Grid className="!px-0">
          <GridItem span={3} tabletSpan={2} mobileSpan={4}>
            <span
              className="text-xs uppercase tracking-[1px] text-text-tertiary font-medium"
              style={{ fontFamily: 'var(--font-sans)' }}
            >
              {job.dateRange}
            </span>
          </GridItem>
          <GridItem span={6} tabletSpan={4} mobileSpan={4}>
            <span
              className="text-base font-semibold text-text-primary"
              style={{ fontFamily: 'var(--font-sans)' }}
            >
              {job.company}
            </span>
            <span
              className="text-base text-text-secondary ml-2 hidden md:inline"
              style={{ fontFamily: 'var(--font-sans)' }}
            >
              {job.title}
            </span>
            <span
              className="text-sm text-text-secondary block md:hidden mt-0.5"
              style={{ fontFamily: 'var(--font-sans)' }}
            >
              {job.title}
            </span>
          </GridItem>
          <GridItem
            span={3}
            tabletSpan={2}
            mobileSpan={4}
            className="flex justify-end items-center"
          >
            <span
              className={`transition-transform duration-300 text-text-tertiary text-xs ${
                isExpanded ? 'rotate-180' : ''
              }`}
              style={{
                transitionTimingFunction: 'cubic-bezier(0.5,0,0.3,1)',
              }}
            >
              &#x25BC;
            </span>
          </GridItem>
        </Grid>
      </button>

      {/* Expandable detail — CSS grid-template-rows transition */}
      <div
        id={detailId}
        aria-hidden={!isExpanded}
        className="overflow-hidden"
        style={{
          display: 'grid',
          gridTemplateRows: isExpanded ? '1fr' : '0fr',
          transition: 'grid-template-rows 0.4s cubic-bezier(0.5,0,0.3,1)',
        }}
      >
        <div className="min-h-0">
          <Grid className="!px-0 pt-4 pb-6">
            <GridItem span={3} tabletSpan={2} mobileSpan={0}>
              {/* spacer */}
            </GridItem>
            <GridItem span={9} tabletSpan={6} mobileSpan={4}>
              {job.description && (
                <p
                  className="text-sm text-text-secondary mb-4 leading-relaxed"
                  style={{
                    fontFamily: 'var(--font-sans)',
                    fontWeight: 300,
                  }}
                >
                  {job.description}
                </p>
              )}
              {job.achievements && job.achievements.length > 0 && (
                <ul className="space-y-2">
                  {job.achievements.map((a, i) => (
                    <li
                      key={i}
                      className="text-sm text-text-secondary leading-relaxed flex gap-2"
                      style={{
                        fontFamily: 'var(--font-sans)',
                        fontWeight: 300,
                      }}
                    >
                      <span className="text-text-tertiary mt-1 shrink-0">
                        -
                      </span>
                      <span>{a.text}</span>
                    </li>
                  ))}
                </ul>
              )}
            </GridItem>
          </Grid>
        </div>
      </div>
    </div>
  )

  if (useGrid) {
    return (
      <Grid>
        <GridItem span={12} tabletSpan={8} mobileSpan={4}>
          {rowContent}
        </GridItem>
      </Grid>
    )
  }

  return rowContent
}

/* ── Minor role row (indices 7-11) ── */

interface MinorRoleProps {
  job: Job
  staggerIndex: number
  isLast: boolean
}

function MinorRole({ job, staggerIndex, isLast }: MinorRoleProps) {
  const staggerClass = `-a-${Math.min(staggerIndex, 20)}`

  return (
    <div
      className={`-entrance -slide-up ${staggerClass} ${
        !isLast ? 'border-b border-border-primary' : ''
      }`}
    >
      <Grid className="py-2">
        <GridItem span={3} tabletSpan={2} mobileSpan={4}>
          <span
            className="text-xs uppercase tracking-[1px] text-text-tertiary font-medium"
            style={{ fontFamily: 'var(--font-sans)' }}
          >
            {job.dateRange}
          </span>
        </GridItem>
        <GridItem span={6} tabletSpan={4} mobileSpan={4}>
          <span
            className="text-xs text-text-secondary"
            style={{ fontFamily: 'var(--font-sans)' }}
          >
            {job.company}
          </span>
          <span
            className="text-xs text-text-tertiary ml-2"
            style={{ fontFamily: 'var(--font-sans)' }}
          >
            {job.title}
          </span>
        </GridItem>
        <GridItem span={3} tabletSpan={2} mobileSpan={4}>
          <span
            className="text-xs text-text-tertiary"
            style={{ fontFamily: 'var(--font-sans)' }}
          >
            {job.location}
          </span>
        </GridItem>
      </Grid>
    </div>
  )
}
