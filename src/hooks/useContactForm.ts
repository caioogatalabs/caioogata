'use client'

import { useState, useCallback, useRef } from 'react'
import emailjs from '@emailjs/browser'
import type { ContactFormValidation } from '@/content/types'

export type FormStatus = 'idle' | 'submitting' | 'success' | 'error'
export type FocusedField = 'name' | 'email' | 'subject' | 'message' | null

interface FormValues {
  name: string
  email: string
  subject: string
  message: string
}

interface FormTouched {
  name: boolean
  email: boolean
  message: boolean
}

interface FormErrors {
  name?: string
  email?: string
  message?: string
}

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

const SERVICE_ID = process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID ?? ''
const TEMPLATE_ID = process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID ?? ''
const PUBLIC_KEY = process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY ?? ''

export function useContactForm(validationMessages: ContactFormValidation) {
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
  const [focusedField, setFocusedField] = useState<FocusedField>(null)
  const resetTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const validate = useCallback(
    (vals: FormValues): FormErrors => {
      const errors: FormErrors = {}
      if (!vals.name.trim()) errors.name = validationMessages.nameRequired
      if (!vals.email.trim()) {
        errors.email = validationMessages.emailRequired
      } else if (!EMAIL_REGEX.test(vals.email.trim())) {
        errors.email = validationMessages.emailInvalid
      }
      if (!vals.message.trim()) errors.message = validationMessages.messageRequired
      return errors
    },
    [validationMessages]
  )

  const errors = validate(values)
  const isValid = Object.keys(errors).length === 0
  const hasInteracted = touched.name || touched.email || touched.message

  // Only show errors for touched fields
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

  const handleFocus = useCallback((field: FocusedField) => {
    setFocusedField(field)
  }, [])

  const resetForm = useCallback(() => {
    setValues({ name: '', email: '', subject: '', message: '' })
    setTouched({ name: false, email: false, message: false })
    setStatus('idle')
    setFocusedField(null)
  }, [])

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault()

      // Touch all fields to show errors
      setTouched({ name: true, email: true, message: true })

      const submitErrors = validate(values)
      if (Object.keys(submitErrors).length > 0) return

      setStatus('submitting')

      try {
        await emailjs.send(
          SERVICE_ID,
          TEMPLATE_ID,
          {
            from_name: values.name.trim(),
            from_email: values.email.trim(),
            subject: values.subject || 'No subject',
            message: values.message.trim(),
          },
          PUBLIC_KEY
        )

        setStatus('success')

        // Auto-reset after 5 seconds
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

  return {
    values,
    errors: visibleErrors,
    touched,
    status,
    focusedField,
    isValid,
    hasInteracted,
    hasErrors: Object.keys(visibleErrors).length > 0,
    handleChange,
    handleBlur,
    handleFocus,
    handleSubmit,
    resetForm,
  }
}
