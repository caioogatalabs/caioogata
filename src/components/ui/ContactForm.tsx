'use client'

import { useMemo, useRef, useCallback } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import { useLanguage } from '@/components/providers/LanguageProvider'
import { useContactForm } from '@/hooks/useContactForm'
import FormLog from '@/components/ui/FormLog'
import ArrowRightIcon from '@/components/ui/ArrowRightIcon'

// CLI Menu input style
const baseInputClasses =
  'bg-transparent border-none outline-none focus:outline-none focus:ring-0 focus:ring-offset-0 focus-visible:outline-none focus-visible:ring-0 font-mono text-sm w-full caret-primary placeholder:text-secondary/40'

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/


export default function ContactForm() {
  const { content } = useLanguage()
  const { form: formContent, log: logContent } = content.contact

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
  } = useContactForm(formContent.validation)

  // Field validity for icon colors and email text color
  const isNameValid = values.name.trim().length > 0
  const isEmailValid = EMAIL_REGEX.test(values.email.trim())
  const isSubjectValid = values.subject !== ''
  const isMessageValid = values.message.trim().length > 0

  const textareaRef = useRef<HTMLTextAreaElement>(null)

  const handleMessageChange = useCallback(
    (value: string) => {
      handleChange('message', value)
      requestAnimationFrame(() => {
        const el = textareaRef.current
        if (el) {
          el.style.height = 'auto'
          el.style.height = `${el.scrollHeight}px`
        }
      })
    },
    [handleChange]
  )

  const subjectOptions = useMemo(
    () => [
      { value: 'job', label: formContent.subjectOptions.job },
      { value: 'freelance', label: formContent.subjectOptions.freelance },
      { value: 'feedback', label: formContent.subjectOptions.feedback },
      { value: 'other', label: formContent.subjectOptions.other },
    ],
    [formContent.subjectOptions]
  )

  return (
    <AnimatePresence mode="wait">
      {status === 'success' ? (
        <motion.div
          key="success"
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.2 }}
          className="border border-dotted border-secondary/30 rounded-base"
        >
          <div className="border-b border-dotted border-secondary/30 px-4 py-2">
            <span className="text-primary font-mono text-xs uppercase tracking-wider">
              {formContent.submitButton}
            </span>
          </div>
          <div className="p-6 space-y-2 text-center">
            <p className="text-primary font-mono text-sm font-bold">
              {formContent.success}
            </p>
            <p className="text-secondary/70 font-mono text-xs">
              {formContent.successDetail}
            </p>
          </div>
        </motion.div>
      ) : (
        <motion.form
          key="form"
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.2 }}
          onSubmit={handleSubmit}
          noValidate
        >
          {/* Terminal box */}
          <div className="border border-dotted border-secondary/30 rounded-base">
            {/* Title bar */}
            <div className="border-b border-dotted border-secondary/30 px-4 py-2">
              <span className="text-primary font-mono text-xs uppercase tracking-wider">
                {formContent.submitButton}
              </span>
            </div>

            {/* Two-column: fields (60%) | log (40%) */}
            <div className="grid grid-cols-1 md:grid-cols-[3fr_2fr]">
              {/* Left: form fields */}
              <div>
                {/* Name */}
                <div className="flex items-center gap-2 border-b border-dotted border-secondary/30 py-2 px-4">
                  <span className={`w-4 shrink-0 flex items-center justify-center ${isNameValid ? 'text-primary' : 'text-secondary/40'}`}>
                    <ArrowRightIcon />
                  </span>
                  <label htmlFor="contact-name" className="sr-only">{formContent.nameLabel}</label>
                  <input
                    id="contact-name"
                    type="text"
                    value={values.name}
                    onChange={(e) => handleChange('name', e.target.value)}
                    onBlur={() => handleBlur('name')}
                    onFocus={() => handleFocus('name')}
                    placeholder={formContent.nameLabel}
                    aria-invalid={!!errors.name}
                    className={`${baseInputClasses} text-primary`}
                    autoComplete="name"
                  />
                </div>

                {/* Email */}
                <div className="flex items-center gap-2 border-b border-dotted border-secondary/30 py-2 px-4">
                  <span className={`w-4 shrink-0 flex items-center justify-center ${isEmailValid ? 'text-primary' : 'text-secondary/40'}`}>
                    <ArrowRightIcon />
                  </span>
                  <label htmlFor="contact-email" className="sr-only">{formContent.emailLabel}</label>
                  <input
                    id="contact-email"
                    type="email"
                    value={values.email}
                    onChange={(e) => handleChange('email', e.target.value)}
                    onBlur={() => handleBlur('email')}
                    onFocus={() => handleFocus('email')}
                    placeholder="email@example.com"
                    aria-invalid={!!errors.email}
                    className={`${baseInputClasses} ${isEmailValid ? 'text-primary' : 'text-secondary'}`}
                    autoComplete="email"
                  />
                </div>

                {/* Subject */}
                <div className="flex items-center gap-2 border-b border-dotted border-secondary/30 py-2 px-4">
                  <span className={`w-4 shrink-0 flex items-center justify-center ${isSubjectValid ? 'text-primary' : 'text-secondary/40'}`}>
                    <ArrowRightIcon />
                  </span>
                  <label htmlFor="contact-subject" className="sr-only">{formContent.subjectLabel}</label>
                  <div className="relative flex-1 min-w-0">
                    <select
                      id="contact-subject"
                      value={values.subject}
                      onChange={(e) => handleChange('subject', e.target.value)}
                      onFocus={() => handleFocus('subject')}
                      onBlur={() => handleFocus(null)}
                      className={`${baseInputClasses} ${isSubjectValid ? 'text-primary' : 'text-secondary'} appearance-none cursor-pointer pr-6`}
                    >
                      <option value="" disabled>
                        {formContent.subjectLabel}
                      </option>
                      {subjectOptions.map((opt) => (
                        <option key={opt.value} value={opt.value} className="bg-neutral text-neutral-300">
                          {opt.label}
                        </option>
                      ))}
                    </select>
                    <span className="absolute right-0 top-1/2 -translate-y-1/2 text-secondary/30 pointer-events-none font-mono text-xs">
                      ▼
                    </span>
                  </div>
                </div>

                {/* Message — textarea with wrapping */}
                <div className="flex items-start gap-2 py-2 px-4">
                  <span className={`w-4 shrink-0 flex items-center justify-center leading-relaxed ${isMessageValid ? 'text-primary' : 'text-secondary/40'}`}>
                    <ArrowRightIcon />
                  </span>
                  <label htmlFor="contact-message" className="sr-only">{formContent.messageLabel}</label>
                  <textarea
                    ref={textareaRef}
                    id="contact-message"
                    value={values.message}
                    onChange={(e) => handleMessageChange(e.target.value)}
                    onBlur={() => handleBlur('message')}
                    onFocus={() => handleFocus('message')}
                    placeholder={formContent.messageLabel}
                    aria-invalid={!!errors.message}
                    rows={4}
                    className={`${baseInputClasses} text-primary resize-none overflow-hidden`}
                  />
                </div>
              </div>

              {/* Right: log monitor */}
              <div className="border-t md:border-t-0 md:border-l border-dotted border-secondary/30 px-4 py-3">
                <FormLog
                  status={status}
                  focusedField={focusedField}
                  values={values}
                  errors={errors}
                  hasInteracted={hasInteracted}
                  submitCount={submitCount}
                  idleMessages={logContent.idleMessages}
                  waitingMessage={logContent.waitingMessage}
                  errorMessage={formContent.error}
                  errorRetry={formContent.errorRetry}
                  contactEmail={content.contact.email}
                />
              </div>
            </div>
          </div>

          {/* Submit button — below the box, right-aligned */}
          <div className="pt-4 flex justify-end">
            <button
              type="submit"
              disabled={status === 'submitting'}
              aria-busy={status === 'submitting'}
              className="inline-flex items-center justify-center px-3 py-1.5 font-mono text-sm rounded-base bg-primary text-neutral-900 hover:bg-primary/90 focus-visible:bg-primary/90 focus:outline-none transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <span className="mr-1">&gt;</span>
              {status === 'submitting' ? formContent.submitting : formContent.submitButton}
            </button>
          </div>

        </motion.form>
      )}
    </AnimatePresence>
  )
}
