'use client'

import { useState, useCallback, useRef } from 'react'

type FormStatus = 'idle' | 'submitting' | 'success' | 'error'

interface FormValues {
  name: string
  email: string
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

export function ContactForm() {
  const [values, setValues] = useState<FormValues>({
    name: '',
    email: '',
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
    if (!vals.name.trim()) errors.name = 'Name is required'
    if (!vals.email.trim()) {
      errors.email = 'Email is required'
    } else if (!EMAIL_REGEX.test(vals.email.trim())) {
      errors.email = 'Please enter a valid email'
    }
    if (!vals.message.trim()) errors.message = 'Message is required'
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
    setValues({ name: '', email: '', message: '' })
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
        <p className="text-text-success text-base font-medium">
          Message sent. I&apos;ll get back to you soon.
        </p>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-6">
      {/* Name */}
      <div className="flex flex-col gap-1">
        <label htmlFor="contact-name" className="text-base text-text-secondary font-sans">
          Name
        </label>
        <input
          id="contact-name"
          type="text"
          aria-required="true"
          value={values.name}
          onChange={(e) => handleChange('name', e.target.value)}
          onBlur={() => handleBlur('name')}
          placeholder="Your name"
          className="bg-transparent border-b border-border-secondary text-text-primary placeholder:text-text-placeholder py-2 text-base outline-none transition-colors duration-300 focus:border-border-focus focus:bg-bg-fill-primary/10"
        />
        {visibleErrors.name && (
          <span className="text-sm text-text-danger">{visibleErrors.name}</span>
        )}
      </div>

      {/* Email */}
      <div className="flex flex-col gap-1">
        <label htmlFor="contact-email" className="text-base text-text-secondary font-sans">
          Email
        </label>
        <input
          id="contact-email"
          type="email"
          aria-required="true"
          value={values.email}
          onChange={(e) => handleChange('email', e.target.value)}
          onBlur={() => handleBlur('email')}
          placeholder="your@email.com"
          className="bg-transparent border-b border-border-secondary text-text-primary placeholder:text-text-placeholder py-2 text-base outline-none transition-colors duration-300 focus:border-border-focus focus:bg-bg-fill-primary/10"
        />
        {visibleErrors.email && (
          <span className="text-sm text-text-danger">{visibleErrors.email}</span>
        )}
      </div>

      {/* Message */}
      <div className="flex flex-col gap-1">
        <label htmlFor="contact-message" className="text-base text-text-secondary font-sans">
          Message
        </label>
        <textarea
          id="contact-message"
          aria-required="true"
          value={values.message}
          onChange={(e) => handleChange('message', e.target.value)}
          onBlur={() => handleBlur('message')}
          placeholder="Write your message here..."
          rows={4}
          className="bg-transparent border-b border-border-secondary text-text-primary placeholder:text-text-placeholder py-2 text-base outline-none transition-colors duration-300 resize-y min-h-[120px] focus:border-border-focus focus:bg-bg-fill-primary/10"
        />
        {visibleErrors.message && (
          <span className="text-sm text-text-danger">{visibleErrors.message}</span>
        )}
      </div>

      {/* Error state */}
      {status === 'error' && (
        <div className="text-sm text-text-danger">
          Failed to send. Please try emailing me at{' '}
          <a
            href="mailto:caioogata.labs@gmail.com"
            className="underline hover:text-text-brand"
          >
            caioogata.labs@gmail.com
          </a>
        </div>
      )}

      {/* Submit */}
      <button
        type="submit"
        disabled={status === 'submitting'}
        className="self-start rounded-full bg-bg-fill-primary text-text-on-primary px-8 py-3 text-base font-medium transition-colors duration-300 hover:bg-bg-fill-primary-hover disabled:opacity-60 disabled:cursor-not-allowed"
      >
        {status === 'submitting' ? 'Sending...' : 'Send message'}
      </button>
    </form>
  )
}
