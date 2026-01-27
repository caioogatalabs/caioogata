'use client'

import { useState } from 'react'
import { toast } from 'react-hot-toast'
import { clsx } from 'clsx'
import { copyToClipboard } from '@/lib/clipboard'
import { generateMarkdown } from '@/lib/markdown-generator'
import { useLanguage } from '@/components/providers/LanguageProvider'

interface CopyButtonProps {
  variant?: 'primary' | 'secondary'
  size?: 'default' | 'small'
  className?: string
}

export default function CopyButton({ 
  variant = 'primary', 
  size = 'default',
  className = '' 
}: CopyButtonProps) {
  const [isCopying, setIsCopying] = useState(false)
  const { content, language } = useLanguage()

  const handleCopy = async () => {
    if (isCopying) return

    setIsCopying(true)

    try {
      const markdown = generateMarkdown(language)
      await copyToClipboard(markdown)

      toast.success(content.notifications.copySuccess, {
        duration: 4000,
        ariaProps: {
          role: 'status',
          'aria-live': 'polite',
        },
      })
    } catch (error) {
      console.error('Failed to copy:', error)
      toast.error(content.notifications.copyError, {
        duration: 5000,
      })
    } finally {
      setIsCopying(false)
    }
  }

  return (
    <button
      onClick={handleCopy}
      disabled={isCopying}
      className={clsx(
        'inline-flex items-center',
        'px-3 py-1.5 font-mono text-sm rounded-base',
        'border border-primary/30 text-secondary transition-colors duration-200',
        'hover:border-primary hover:text-primary hover:bg-primary/10',
        'focus:outline-none focus:ring-2 focus:ring-primary',
        'focus:ring-offset-2 focus:ring-offset-neutral-950',
        'disabled:opacity-50 disabled:cursor-not-allowed',
        className
      )}
      aria-label={content.hero.cta.copyAriaLabel}
    >
      <span className="mr-1">&gt;</span>
      {isCopying ? content.hero.cta.copying : content.hero.cta.copy}
    </button>
  )
}
