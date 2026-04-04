'use client'

import { useState, useCallback, useRef } from 'react'
import content from '@/content/en.json'

type FormStatus = 'idle' | 'submitting' | 'success' | 'error'

interface FormValues {
  name: string
  email: string
  subject: string
  message: string
}

interface FormErrors {
  name?: string
  email?: string
  message?: string
}

interface FormTouched {
  name: boolean
  email: boolean
  message: boolean
}

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const form = content.contact.form
const subjectOptions = Object.entries(form.subjectOptions) as [string, string][]

export function ContactForm() {
  const [values, setValues] = useState<FormValues>({
    name: '',
    email: '',
    subject: '',
    message: '',
  })
  const [touched, setTouched] = useState<FormTouched>({
    name: false,
    email: false,
    message: false,
  })
  const [status, setStatus] = useState<FormStatus>('idle')
  const resetTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const validate = useCallback((vals: FormValues): FormErrors => {
    const errors: FormErrors = {}
    if (!vals.name.trim()) errors.name = form.validation.nameRequired
    if (!vals.email.trim()) {
      errors.email = form.validation.emailRequired
    } else if (!EMAIL_REGEX.test(vals.email.trim())) {
      errors.email = form.validation.emailInvalid
    }
    if (!vals.message.trim()) errors.message = form.validation.messageRequired
    return errors
  }, [])

  const errors = validate(values)

  const visibleErrors: FormErrors = {}
  if (touched.name && errors.name) visibleErrors.name = errors.name
  if (touched.email && errors.email) visibleErrors.email = errors.email
  if (touched.message && errors.message) visibleErrors.message = errors.message

  const handleChange = useCallback((field: keyof FormValues, value: string) => {
    setValues((prev) => ({ ...prev, [field]: value }))
  }, [])

  const handleBlur = useCallback((field: keyof FormTouched) => {
    setTouched((prev) => ({ ...prev, [field]: true }))
  }, [])

  const resetForm = useCallback(() => {
    setValues({ name: '', email: '', subject: '', message: '' })
    setTouched({ name: false, email: false, message: false })
    setStatus('idle')
  }, [])

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault()
      setTouched({ name: true, email: true, message: true })

      const submitErrors = validate(values)
      if (Object.keys(submitErrors).length > 0) return

      setStatus('submitting')

      try {
        const res = await fetch('/api/contact', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            name: values.name.trim(),
            email: values.email.trim(),
            subject: values.subject.trim(),
            message: values.message.trim(),
          }),
        })

        if (!res.ok) throw new Error('Send failed')

        setStatus('success')

        if (resetTimerRef.current) clearTimeout(resetTimerRef.current)
        resetTimerRef.current = setTimeout(() => {
          resetForm()
        }, 5000)
      } catch {
        setStatus('error')
      }
    },
    [values, validate, resetForm]
  )

  if (status === 'success') {
    return (
      <div className="flex flex-col gap-2 py-6">
        <p className="text-text-success text-lg font-medium" style={{ fontFamily: 'var(--font-sans)' }}>
          {form.success}
        </p>
        <p className="text-text-secondary text-base" style={{ fontFamily: 'var(--font-sans)' }}>
          {form.successDetail}
        </p>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="flex flex-col">
      {/* Name + Email grouped block */}
      <div className="flex flex-col">
        {/* Name row */}
        <div className="flex">
          <div className="shrink-0 w-[100px] border border-border-primary rounded-tl-[12px] flex items-center justify-center p-4">
            <label
              htmlFor="contact-name"
              className="text-lg text-text-primary whitespace-nowrap"
              style={{ fontFamily: 'var(--font-sans)' }}
            >
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
              onBlur={() => handleBlur('name')}
              placeholder={form.namePlaceholder}
              className="w-full bg-transparent text-lg text-text-primary placeholder:text-text-placeholder outline-none"
              style={{ fontFamily: 'var(--font-sans)' }}
            />
            {visibleErrors.name && (
              <span className="text-sm text-text-danger mt-1 block">{visibleErrors.name}</span>
            )}
          </div>
        </div>

        {/* Email row */}
        <div className="flex">
          <div className="shrink-0 w-[100px] border border-border-primary border-t-0 rounded-bl-[12px] flex items-center justify-center p-4">
            <label
              htmlFor="contact-email"
              className="text-lg text-text-primary whitespace-nowrap"
              style={{ fontFamily: 'var(--font-sans)' }}
            >
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
              onBlur={() => handleBlur('email')}
              placeholder={form.emailPlaceholder}
              className="w-full bg-transparent text-lg text-text-primary placeholder:text-text-placeholder outline-none"
              style={{ fontFamily: 'var(--font-sans)' }}
            />
            {visibleErrors.email && (
              <span className="text-sm text-text-danger mt-1 block">{visibleErrors.email}</span>
            )}
          </div>
        </div>
      </div>

      {/* Subject row — pill radius, dropdown */}
      <div className="flex">
        <div className="shrink-0 w-[100px] border border-border-primary rounded-l-full flex items-center justify-center p-4">
          <label
            htmlFor="contact-subject"
            className="text-lg text-text-primary whitespace-nowrap"
            style={{ fontFamily: 'var(--font-sans)' }}
          >
            {form.subjectLabel.toLowerCase()}
          </label>
        </div>
        <div className="flex-1 border border-border-primary border-l-0 rounded-r-full p-4">
          <select
            id="contact-subject"
            value={values.subject}
            onChange={(e) => handleChange('subject', e.target.value)}
            className="w-full bg-transparent text-lg text-text-primary outline-none appearance-none cursor-pointer"
            style={{ fontFamily: 'var(--font-sans)' }}
          >
            <option value="" disabled className="bg-bg text-text-placeholder">
              {form.subjectPlaceholder}
            </option>
            {subjectOptions.map(([key, label]) => (
              <option key={key} value={key} className="bg-bg text-text-primary">
                {label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Message — full width textarea */}
      <div className="border border-border-primary rounded-[12px] p-4">
        <textarea
          id="contact-message"
          aria-required="true"
          value={values.message}
          onChange={(e) => handleChange('message', e.target.value)}
          onBlur={() => handleBlur('message')}
          placeholder={form.messagePlaceholder}
          rows={6}
          className="w-full bg-transparent text-lg text-text-primary placeholder:text-text-placeholder outline-none resize-y min-h-[200px]"
          style={{ fontFamily: 'var(--font-sans)' }}
        />
        {visibleErrors.message && (
          <span className="text-sm text-text-danger mt-1 block">{visibleErrors.message}</span>
        )}
      </div>

      {/* Error state */}
      {status === 'error' && (
        <div className="text-sm text-text-danger mt-4" style={{ fontFamily: 'var(--font-sans)' }}>
          {form.error}{' '}
          <a
            href={`mailto:${content.contact.email}`}
            className="underline hover:text-text-brand"
          >
            {content.contact.email}
          </a>
        </div>
      )}

      {/* Buttons row — aligned right */}
      <div className="flex items-center justify-end">
        <button
          type="button"
          onClick={resetForm}
          className="h-12 px-8 border border-border-primary rounded-[12px] text-text-secondary text-base font-medium transition-colors duration-300 hover:text-text-primary hover:border-border-focus"
          style={{ fontFamily: 'var(--font-sans)', width: 208 }}
        >
          Clear
        </button>
        <button
          type="submit"
          disabled={status === 'submitting'}
          className="h-12 px-8 border border-border-primary rounded-full text-text-secondary text-base font-medium transition-colors duration-300 hover:bg-bg-fill-primary hover:text-text-on-primary hover:border-bg-fill-primary disabled:opacity-60 disabled:cursor-not-allowed"
          style={{ fontFamily: 'var(--font-sans)', width: 208 }}
        >
          {status === 'submitting' ? form.submitting : form.submitButton}
        </button>
      </div>
    </form>
  )
}
