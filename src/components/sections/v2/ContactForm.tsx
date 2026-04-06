'use client'

import { useState } from 'react'
import { useContactForm } from '@/hooks/useContactForm'
import { FormLog } from '@/components/sections/v2/FormLog'
import content from '@/content/en.json'

const form = content.contact.form
const log = content.contact.log
const subjectOptions = Object.entries(form.subjectOptions) as [string, string][]
const EASE = 'cubic-bezier(0.16,1,0.3,1)'

export function ContactForm() {
  const {
    values,
    errors,
    status,
    focusedField,
    hasInteracted,
    submitCount,
    handleChange,
    handleBlur,
    handleFocus,
    handleSubmit,
    resetForm,
  } = useContactForm(form.validation)

  const [clearHovered, setClearHovered] = useState(false)
  const [submitHovered, setSubmitHovered] = useState(false)

  return (
    <form onSubmit={handleSubmit} noValidate className="col-span-4 md:col-span-6 lg:col-span-9 flex flex-col gap-4 md:gap-5">
        {/* Name + Email grouped block */}
        <div className="flex flex-col">
          <div className="flex">
            <div className="shrink-0 w-[100px] border border-border-primary rounded-tl-[12px] flex items-center justify-center p-4">
              <label htmlFor="contact-name" className="text-lg text-text-primary whitespace-nowrap" style={{ fontFamily: 'var(--font-sans)' }}>
                {form.nameLabel.toLowerCase()}
              </label>
            </div>
            <div className="flex-1 border border-border-primary border-l-0 rounded-tr-[12px] p-4">
              <input
                id="contact-name"
                type="text"
                aria-required="true"
                value={values.name}
                onChange={(e) => handleChange('name', e.target.value)}
                onFocus={() => handleFocus('name')}
                onBlur={() => { handleBlur('name'); handleFocus(null) }}
                placeholder={form.namePlaceholder}
                className="w-full bg-transparent text-lg text-text-primary placeholder:text-text-placeholder outline-none"
                style={{ fontFamily: 'var(--font-sans)' }}
              />
            </div>
          </div>

          <div className="flex">
            <div className="shrink-0 w-[100px] border border-border-primary border-t-0 rounded-bl-[12px] flex items-center justify-center p-4">
              <label htmlFor="contact-email" className="text-lg text-text-primary whitespace-nowrap" style={{ fontFamily: 'var(--font-sans)' }}>
                {form.emailLabel.toLowerCase()}
              </label>
            </div>
            <div className="flex-1 border border-border-primary border-l-0 border-t-0 rounded-br-[12px] p-4">
              <input
                id="contact-email"
                type="email"
                aria-required="true"
                value={values.email}
                onChange={(e) => handleChange('email', e.target.value)}
                onFocus={() => handleFocus('email')}
                onBlur={() => { handleBlur('email'); handleFocus(null) }}
                placeholder={form.emailPlaceholder}
                className="w-full bg-transparent text-lg text-text-primary placeholder:text-text-placeholder outline-none"
                style={{ fontFamily: 'var(--font-sans)' }}
              />
            </div>
          </div>
        </div>

        {/* Subject — chip group */}
        <fieldset className="flex flex-wrap gap-1.5 py-2" role="radiogroup" aria-label={form.subjectLabel}>
          {subjectOptions.map(([key, label]) => {
            const selected = values.subject === key
            return (
              <button
                key={key}
                type="button"
                role="radio"
                aria-checked={selected}
                onClick={() => handleChange('subject', selected ? '' : key)}
                className={`relative h-10 px-5 rounded-full border text-sm font-medium overflow-hidden transition-colors duration-200 ${
                  selected
                    ? 'border-bg-fill-primary bg-bg-fill-primary text-text-on-primary'
                    : 'border-border-primary text-text-secondary hover:text-text-primary'
                }`}
                style={{ fontFamily: 'var(--font-sans)' }}
              >
                {label}
              </button>
            )
          })}
        </fieldset>

        {/* Message + Log — single outlined container */}
        <div className="border border-border-primary rounded-[12px] flex flex-col lg:flex-row">
          {/* Textarea */}
          <div className="flex-1 p-4">
            <textarea
              id="contact-message"
              aria-required="true"
              value={values.message}
              onChange={(e) => handleChange('message', e.target.value)}
              onFocus={() => handleFocus('message')}
              onBlur={() => { handleBlur('message'); handleFocus(null) }}
              placeholder={form.messagePlaceholder}
              rows={6}
              className="w-full bg-transparent text-lg text-text-primary placeholder:text-text-placeholder outline-none resize-none min-h-[200px]"
              style={{ fontFamily: 'var(--font-sans)' }}
            />
          </div>

          {/* Divider */}
          <div className="h-px lg:h-auto lg:w-px bg-border-primary" />

          {/* FormLog */}
          <div className="lg:w-[280px] shrink-0 p-4 flex flex-col justify-end">
            <FormLog
              status={status}
              focusedField={focusedField}
              values={values}
              errors={errors}
              hasInteracted={hasInteracted}
              submitCount={submitCount}
              idleMessages={log.idleMessages}
              waitingMessage={log.waitingMessage}
              errorMessage={form.error}
              errorRetry={form.errorRetry}
              contactEmail={content.contact.email}
            />
          </div>
        </div>

        {/* Buttons row */}
        <div className="flex items-center justify-end">
          <button
            type="button"
            onClick={resetForm}
            className="relative inline-flex items-center justify-center h-12 px-8 border border-border-primary rounded-[12px] overflow-hidden"
            style={{ width: 208, color: clearHovered ? 'var(--color-text-on-outline-hover)' : 'var(--color-text-secondary)', transition: 'color 0.15s' }}
            onMouseEnter={() => setClearHovered(true)}
            onMouseLeave={() => setClearHovered(false)}
          >
            <div className="absolute inset-0 bg-bg-fill-outline-hover pointer-events-none" style={{ borderRadius: '12px', transform: clearHovered ? 'translateY(0)' : 'translateY(100%)', transition: clearHovered ? `transform 0.2s ${EASE}` : `transform 0.2s ${EASE} 0.04s` }} />
            <span className="relative z-10 block text-base font-medium overflow-hidden" style={{ fontFamily: 'var(--font-sans)', transform: clearHovered ? 'translateY(-100%)' : 'translateY(0)', opacity: clearHovered ? 0 : 1, transition: clearHovered ? `transform 0.4s ${EASE} 0.05s, opacity 0.2s ${EASE} 0.05s` : `transform 1s ${EASE} 0.06s, opacity 0.3s ${EASE} 0.06s` }}>
              Clear
            </span>
            <span className="absolute inset-0 z-10 flex items-center justify-center font-normal overflow-hidden" style={{ fontFamily: "'Pexel Grotesk', var(--font-sans)", fontSize: '1.5rem', transform: clearHovered ? 'translateY(0)' : 'translateY(100%)', opacity: clearHovered ? 1 : 0, transition: clearHovered ? `transform 1s ${EASE} 0.1s, opacity 0.3s ${EASE} 0.1s` : `transform 1s ${EASE} 0.06s, opacity 0.3s ${EASE} 0.06s` }}>
              Clear
            </span>
          </button>
          <button
            type="submit"
            disabled={status === 'submitting'}
            className="relative inline-flex items-center justify-center h-12 px-8 border border-border-primary rounded-full overflow-hidden disabled:opacity-60 disabled:cursor-not-allowed"
            style={{ width: 208, color: submitHovered ? 'var(--color-text-on-outline-hover)' : 'var(--color-text-secondary)', transition: 'color 0.15s' }}
            onMouseEnter={() => setSubmitHovered(true)}
            onMouseLeave={() => setSubmitHovered(false)}
          >
            <div className="absolute inset-0 bg-bg-fill-outline-hover pointer-events-none" style={{ borderRadius: '999px', transform: submitHovered ? 'translateY(0)' : 'translateY(100%)', transition: submitHovered ? `transform 0.2s ${EASE}` : `transform 0.2s ${EASE} 0.04s` }} />
            <span className="relative z-10 block text-base font-medium overflow-hidden" style={{ fontFamily: 'var(--font-sans)', transform: submitHovered ? 'translateY(-100%)' : 'translateY(0)', opacity: submitHovered ? 0 : 1, transition: submitHovered ? `transform 0.4s ${EASE} 0.05s, opacity 0.2s ${EASE} 0.05s` : `transform 1s ${EASE} 0.06s, opacity 0.3s ${EASE} 0.06s` }}>
              {status === 'submitting' ? form.submitting : form.submitButton}
            </span>
            <span className="absolute inset-0 z-10 flex items-center justify-center font-normal overflow-hidden" style={{ fontFamily: "'Pexel Grotesk', var(--font-sans)", fontSize: '1.5rem', transform: submitHovered ? 'translateY(0)' : 'translateY(100%)', opacity: submitHovered ? 1 : 0, transition: submitHovered ? `transform 1s ${EASE} 0.1s, opacity 0.3s ${EASE} 0.1s` : `transform 1s ${EASE} 0.06s, opacity 0.3s ${EASE} 0.06s` }}>
              {status === 'submitting' ? form.submitting : form.submitButton}
            </span>
          </button>
        </div>
    </form>
  )
}
