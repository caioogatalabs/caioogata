'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { useContactForm } from '@/hooks/useContactForm'
import { ExternalLink } from '@/components/ui/ExternalLink'
import content from '@/content/en.json'

const form = content.contact.form
const subjectOptions = Object.entries(form.subjectOptions) as [string, string][]
const EASE = 'cubic-bezier(0.16,1,0.3,1)'
const EASE_OUT = 'cubic-bezier(0.22,0.31,0,1)'

const SOCIAL_ORDER = ['LinkedIn', 'GitHub', 'Instagram', 'YouTube'] as const

function SubjectChip({ label, selected, onClick }: { label: string; selected: boolean; onClick: () => void }) {
  const [h, setH] = useState(false)

  return (
    <button
      type="button"
      role="radio"
      aria-checked={selected}
      onClick={onClick}
      onMouseEnter={() => setH(true)}
      onMouseLeave={() => setH(false)}
      onFocus={() => setH(true)}
      onBlur={() => setH(false)}
      className={`relative h-10 px-5 rounded-full border text-sm overflow-hidden inline-flex items-center gap-2 ${
        selected
          ? 'border-text-primary bg-text-primary text-bg-fill-primary'
          : 'border-border-primary'
      }`}
      style={{
        color: selected
          ? undefined
          : h ? 'var(--color-text-on-outline-hover)' : 'var(--color-text-primary)',
        transition: 'color 0.15s',
      }}
    >
      {!selected && (
        <div
          className="absolute inset-0 bg-bg-fill-outline-hover pointer-events-none"
          style={{
            borderRadius: '999px',
            transform: h ? 'translateY(0)' : 'translateY(100%)',
            transition: h
              ? `transform 0.2s ${EASE}`
              : `transform 0.2s ${EASE} 0.04s`,
          }}
        />
      )}
      <span
        className={`relative z-10 size-2 rounded-full shrink-0 transition-colors duration-200 ${
          selected ? 'bg-bg-fill-primary' : h ? 'bg-current' : 'bg-border-primary'
        }`}
      />
      <span
        className="relative z-10 block font-medium"
        style={{
          fontFamily: 'var(--font-sans)',
          transform: !selected && h ? 'translateY(-100%)' : 'translateY(0)',
          opacity: !selected && h ? 0 : 1,
          transition: !selected && h
            ? `transform 0.4s ${EASE} 0.05s, opacity 0.2s ${EASE} 0.05s`
            : `transform 1s ${EASE} 0.06s, opacity 0.3s ${EASE} 0.06s`,
        }}
      >
        {label}
      </span>
      {!selected && (
        <span
          className="absolute inset-0 z-10 flex items-center justify-center type-overlay-hover"
          style={{
            fontSize: '1rem',
            transform: h ? 'translateY(0)' : 'translateY(100%)',
            opacity: h ? 1 : 0,
            transition: h
              ? `transform 1s ${EASE} 0.1s, opacity 0.3s ${EASE} 0.1s`
              : `transform 1s ${EASE} 0.06s, opacity 0.3s ${EASE} 0.06s`,
          }}
        >
          {label}
        </span>
      )}
    </button>
  )
}

export function ContactOverlay() {
  const [isOpen, setIsOpen] = useState(false)
  const [groupHovered, setGroupHovered] = useState(false)
  const overlayRef = useRef<HTMLDivElement>(null)
  const prefersReducedMotion = useRef(false)

  useEffect(() => {
    prefersReducedMotion.current = window.matchMedia(
      '(prefers-reduced-motion: reduce)'
    ).matches
  }, [])

  const reduced = prefersReducedMotion.current

  const {
    values,
    errors,
    status,
    handleChange,
    handleBlur,
    handleFocus,
    handleSubmit,
    resetForm,
  } = useContactForm(form.validation)

  const close = useCallback(() => {
    setIsOpen(false)
    // After exit transition, reset the form (unless mid-submit)
    const delay = prefersReducedMotion.current ? 10 : 600
    window.setTimeout(() => {
      if (status !== 'submitting') resetForm()
    }, delay)
  }, [resetForm, status])

  // Open / close via window events (reuses MenuSection 'open-contact')
  useEffect(() => {
    const onOpen = () => setIsOpen(true)
    const onClose = () => close()
    window.addEventListener('open-contact', onOpen)
    window.addEventListener('close-contact', onClose)
    return () => {
      window.removeEventListener('open-contact', onOpen)
      window.removeEventListener('close-contact', onClose)
    }
  }, [close])

  // Broadcast state so the FAB can stay in sync (Escape, success-state close,
  // any future programmatic close path)
  useEffect(() => {
    window.dispatchEvent(new CustomEvent('contact-state', { detail: { isOpen } }))
  }, [isOpen])

  // Escape closes
  useEffect(() => {
    if (!isOpen) return
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') close()
    }
    document.addEventListener('keydown', handleKey)
    return () => document.removeEventListener('keydown', handleKey)
  }, [isOpen, close])

  const t = `1s ${EASE}`
  const tFast = `0.3s ${EASE}`

  // Close pill + × group (always shows Close / × — no toggle since overlay close-only)
  const closeGroup = (
    <div
      className="flex items-center gap-0.5"
      onMouseEnter={() => setGroupHovered(true)}
      onMouseLeave={() => setGroupHovered(false)}
    >
      <button
        type="button"
        onClick={close}
        aria-label="Close contact form"
        className="relative inline-flex items-center justify-center h-12 rounded-full bg-text-primary text-bg-fill-primary px-8 overflow-hidden"
      >
        <span className="invisible text-base font-medium" style={{ fontFamily: 'var(--font-sans)' }} aria-hidden="true">
          Close
        </span>
        <span
          className="absolute inset-0 flex items-center justify-center text-base font-medium"
          style={{
            fontFamily: 'var(--font-sans)',
            transform: groupHovered ? 'translateY(-100%)' : 'translateY(0)',
            opacity: groupHovered ? 0 : 1,
            transition: `transform ${t}, opacity ${tFast}`,
          }}
        >
          Close
        </span>
        <span
          className="absolute inset-0 flex items-center justify-center type-overlay-hover"
          style={{
            transform: groupHovered ? 'translateY(0)' : 'translateY(100%)',
            opacity: groupHovered ? 1 : 0,
            transition: `transform ${t}, opacity ${tFast}`,
          }}
        >
          Close
        </span>
      </button>
      <button
        type="button"
        onClick={close}
        aria-label="Close contact form"
        className="relative flex items-center justify-center size-12 rounded-[12px] bg-text-primary text-bg-fill-primary overflow-hidden"
      >
        <span className="invisible text-lg" style={{ fontFamily: 'var(--font-sans)' }} aria-hidden="true">×</span>
        <span
          className="absolute inset-0 flex items-center justify-center text-lg"
          style={{
            fontFamily: 'var(--font-sans)',
            transform: groupHovered ? 'translateY(-100%)' : 'translateY(0)',
            opacity: groupHovered ? 0 : 1,
            transition: `transform ${t} 0.1s, opacity ${tFast} 0.1s`,
          }}
        >
          ×
        </span>
        <span
          className="absolute inset-0 flex items-center justify-center type-overlay-hover"
          style={{
            transform: groupHovered ? 'translateY(0)' : 'translateY(100%)',
            opacity: groupHovered ? 1 : 0,
            transition: `transform ${t} 0.1s, opacity ${tFast} 0.1s`,
          }}
        >
          ×
        </span>
      </button>
    </div>
  )

  return (
    <div
      ref={overlayRef}
      data-theme="inverse"
      role="dialog"
      aria-modal="false"
      aria-label="Contact form"
      className="fixed z-[80] bg-bg text-text-primary rounded-[12px]
                 bottom-5 right-5 left-5 h-[calc(100vh-40px)]
                 md:bottom-8 md:right-8 md:left-8 md:h-[calc(100vh-64px)]
                 lg:bottom-16 lg:right-16 lg:left-auto lg:w-[50vw] lg:h-[80vh]
                 flex flex-col
                 overflow-hidden"
      style={{
        transform: isOpen ? 'translateY(0) scale(1)' : 'translateY(20px) scale(0.98)',
        opacity: isOpen ? 1 : 0,
        pointerEvents: isOpen ? 'auto' : 'none',
        transformOrigin: 'bottom right',
        transition: reduced
          ? 'none'
          : `transform 0.5s ${EASE_OUT}, opacity 0.3s ${EASE}`,
      }}
    >
      {status === 'success' ? (
        <div className="flex-1 flex flex-col items-center justify-center gap-4 p-6 md:p-8 text-center">
          <h2
            className="text-text-primary"
            style={{ fontFamily: 'var(--font-sans)', fontSize: 'clamp(1.5rem, 3vw, 2.5rem)', lineHeight: 1.1 }}
          >
            {form.success}
          </h2>
          <p className="text-text-secondary text-base max-w-md" style={{ fontFamily: 'var(--font-sans)' }}>
            {form.successDetail}
          </p>
          <div className="mt-4">{closeGroup}</div>
        </div>
      ) : (
        <>
          {/* Header */}
          <div className="px-6 md:px-8 pt-6 md:pt-8 pb-4 shrink-0">
            <h2
              className="text-text-primary"
              style={{
                fontFamily: 'var(--font-sans)',
                fontSize: 'clamp(1.5rem, 3vw, 2.5rem)',
                lineHeight: 1.1,
                fontWeight: 400,
                letterSpacing: '-0.02em',
              }}
            >
              {content.contact.heading}
            </h2>
          </div>

          {/* Body — scroll region */}
          <div className="flex-1 overflow-y-auto px-6 md:px-8 pb-24 md:pb-28">
            <div className="flex flex-col">
              {/* Form — full width */}
              <form
                onSubmit={handleSubmit}
                noValidate
                className="flex flex-col gap-3"
              >
                {/* Name + Email stacked */}
                <div className="flex flex-col">
                  <div className="flex">
                    <div className="shrink-0 w-[100px] border border-border-primary rounded-tl-[12px] flex items-center justify-center p-4">
                      <label htmlFor="overlay-name" className="text-base text-text-primary whitespace-nowrap" style={{ fontFamily: 'var(--font-sans)' }}>
                        {form.nameLabel.toLowerCase()}
                      </label>
                    </div>
                    <div className="flex-1 border border-border-primary border-l-0 rounded-tr-[12px] p-4">
                      <input
                        id="overlay-name"
                        type="text"
                        aria-required="true"
                        value={values.name}
                        onChange={(e) => handleChange('name', e.target.value)}
                        onFocus={() => handleFocus('name')}
                        onBlur={() => { handleBlur('name'); handleFocus(null) }}
                        placeholder={form.namePlaceholder}
                        className="w-full bg-transparent text-base text-text-primary placeholder:text-text-secondary outline-none"
                        style={{ fontFamily: 'var(--font-sans)' }}
                      />
                    </div>
                  </div>
                  <div className="flex">
                    <div className="shrink-0 w-[100px] border border-border-primary border-t-0 rounded-bl-[12px] flex items-center justify-center p-4">
                      <label htmlFor="overlay-email" className="text-base text-text-primary whitespace-nowrap" style={{ fontFamily: 'var(--font-sans)' }}>
                        {form.emailLabel.toLowerCase()}
                      </label>
                    </div>
                    <div className="flex-1 border border-border-primary border-l-0 border-t-0 rounded-br-[12px] p-4">
                      <input
                        id="overlay-email"
                        type="email"
                        aria-required="true"
                        value={values.email}
                        onChange={(e) => handleChange('email', e.target.value)}
                        onFocus={() => handleFocus('email')}
                        onBlur={() => { handleBlur('email'); handleFocus(null) }}
                        placeholder={form.emailPlaceholder}
                        className="w-full bg-transparent text-base text-text-primary placeholder:text-text-secondary outline-none"
                        style={{ fontFamily: 'var(--font-sans)' }}
                      />
                    </div>
                  </div>
                </div>

                {/* Subject chips */}
                <fieldset className="flex flex-wrap gap-1 py-2" role="radiogroup" aria-label={form.subjectLabel}>
                  {subjectOptions.map(([key, label]) => {
                    const selected = values.subject === key
                    return (
                      <SubjectChip
                        key={key}
                        label={label}
                        selected={selected}
                        onClick={() => handleChange('subject', selected ? '' : key)}
                      />
                    )
                  })}
                </fieldset>

                {/* Message — full width, no FormLog */}
                <div className="border border-border-primary rounded-[12px] p-4">
                  <textarea
                    id="overlay-message"
                    aria-required="true"
                    value={values.message}
                    onChange={(e) => handleChange('message', e.target.value)}
                    onFocus={() => handleFocus('message')}
                    onBlur={() => { handleBlur('message'); handleFocus(null) }}
                    placeholder={form.messagePlaceholder}
                    rows={5}
                    className="w-full bg-transparent text-base text-text-primary placeholder:text-text-secondary outline-none resize-none min-h-[140px]"
                    style={{ fontFamily: 'var(--font-sans)' }}
                  />
                </div>

                {/* Errors / status */}
                {(errors.name || errors.email || errors.message) && (
                  <div className="text-sm text-text-primary font-mono" aria-live="polite">
                    {errors.name || errors.email || errors.message}
                  </div>
                )}
                {status === 'error' && (
                  <div className="text-sm text-text-primary font-mono" aria-live="polite">
                    {form.error} {form.errorRetry}
                  </div>
                )}

                {/* Footer-of-form: Socials column (left) + Submit/Clear buttons (right) */}
                <div className="flex items-start justify-between gap-6 pt-2">
                  {/* Social column — vertical list, label + ExternalLink rows */}
                  <div className="flex flex-col gap-2 min-w-0">
                    <p className="font-mono text-xs uppercase tracking-[0.88px] text-text-tertiary">
                      Social
                    </p>
                    <div className="flex flex-col gap-2">
                      {SOCIAL_ORDER.map((label) => {
                        const link = content.contact.links.find((l) => l.label === label)
                        if (!link) return null
                        return (
                          <ExternalLink key={label} href={link.url} size="sm">
                            {link.label}
                          </ExternalLink>
                        )
                      })}
                    </div>
                  </div>

                  {/* Buttons — top-aligned with the Social label */}
                  <div className="flex items-center gap-2 flex-wrap shrink-0">
                    <SubmitButton submitting={status === 'submitting'} label={status === 'submitting' ? form.submitting : form.submitButton} />
                    <ClearButton onClick={resetForm} />
                  </div>
                </div>
              </form>
            </div>
          </div>
        </>
      )}
    </div>
  )
}

function SubmitButton({ submitting, label }: { submitting: boolean; label: string }) {
  const [h, setH] = useState(false)
  // Mirrors ClearButton's outline-hover token pair so the label stays legible
  // in every theme — including data-theme="inverse" where text-primary and
  // bg-fill-primary both resolve to brand-950 (same dark), which would make
  // "dark-on-dark" the visual result of the previous bg-text-primary scheme.
  return (
    <button
      type="submit"
      disabled={submitting}
      onMouseEnter={() => setH(true)}
      onMouseLeave={() => setH(false)}
      onFocus={() => setH(true)}
      onBlur={() => setH(false)}
      className="relative inline-flex items-center justify-center h-12 px-8 border border-border-primary rounded-full overflow-hidden disabled:opacity-60 disabled:cursor-not-allowed"
      style={{
        color: h ? 'var(--color-text-on-outline-hover)' : 'var(--color-text-primary)',
        transition: 'color 0.15s',
      }}
    >
      <div
        className="absolute inset-0 bg-bg-fill-outline-hover pointer-events-none"
        style={{
          borderRadius: '999px',
          transform: h ? 'translateY(0)' : 'translateY(100%)',
          transition: h
            ? `transform 0.2s ${EASE}`
            : `transform 0.2s ${EASE} 0.04s`,
        }}
      />
      <span
        className="relative z-10 block text-base font-medium overflow-hidden"
        style={{
          fontFamily: 'var(--font-sans)',
          transform: h ? 'translateY(-100%)' : 'translateY(0)',
          opacity: h ? 0 : 1,
          transition: h
            ? `transform 0.4s ${EASE} 0.05s, opacity 0.2s ${EASE} 0.05s`
            : `transform 1s ${EASE} 0.06s, opacity 0.3s ${EASE} 0.06s`,
        }}
      >
        {label}
      </span>
      <span
        className="absolute inset-0 z-10 flex items-center justify-center overflow-hidden type-overlay-hover"
        style={{
          transform: h ? 'translateY(0)' : 'translateY(100%)',
          opacity: h ? 1 : 0,
          transition: h
            ? `transform 1s ${EASE} 0.1s, opacity 0.3s ${EASE} 0.1s`
            : `transform 1s ${EASE} 0.06s, opacity 0.3s ${EASE} 0.06s`,
        }}
      >
        {label}
      </span>
    </button>
  )
}

function ClearButton({ onClick }: { onClick: () => void }) {
  const [h, setH] = useState(false)
  return (
    <button
      type="button"
      onClick={onClick}
      onMouseEnter={() => setH(true)}
      onMouseLeave={() => setH(false)}
      onFocus={() => setH(true)}
      onBlur={() => setH(false)}
      className="relative inline-flex items-center justify-center h-12 px-8 border border-border-primary rounded-[12px] overflow-hidden"
      style={{
        color: h ? 'var(--color-text-on-outline-hover)' : 'var(--color-text-primary)',
        transition: 'color 0.15s',
      }}
    >
      <div
        className="absolute inset-0 bg-bg-fill-outline-hover pointer-events-none"
        style={{
          borderRadius: '12px',
          transform: h ? 'translateY(0)' : 'translateY(100%)',
          transition: h
            ? `transform 0.2s ${EASE}`
            : `transform 0.2s ${EASE} 0.04s`,
        }}
      />
      <span
        className="relative z-10 block text-base font-medium overflow-hidden"
        style={{
          fontFamily: 'var(--font-sans)',
          transform: h ? 'translateY(-100%)' : 'translateY(0)',
          opacity: h ? 0 : 1,
          transition: h
            ? `transform 0.4s ${EASE} 0.05s, opacity 0.2s ${EASE} 0.05s`
            : `transform 1s ${EASE} 0.06s, opacity 0.3s ${EASE} 0.06s`,
        }}
      >
        Clear
      </span>
      <span
        className="absolute inset-0 z-10 flex items-center justify-center overflow-hidden type-overlay-hover"
        style={{
          transform: h ? 'translateY(0)' : 'translateY(100%)',
          opacity: h ? 1 : 0,
          transition: h
            ? `transform 1s ${EASE} 0.1s, opacity 0.3s ${EASE} 0.1s`
            : `transform 1s ${EASE} 0.06s, opacity 0.3s ${EASE} 0.06s`,
        }}
      >
        Clear
      </span>
    </button>
  )
}
