'use client'

import { useState, useRef, useEffect } from 'react'
import { toast } from 'react-hot-toast'
import { clsx } from 'clsx'
import { copyToClipboard } from '@/lib/clipboard'
import { generateMarkdown } from '@/lib/markdown-generator'
import { useLanguage } from '@/components/providers/LanguageProvider'

interface AIPlatform {
  name: string
  url: string
  icon: string
}

const AI_PLATFORMS: AIPlatform[] = [
  { name: 'Claude', url: 'https://claude.ai', icon: '>' },
  { name: 'ChatGPT', url: 'https://chat.openai.com', icon: '*' },
  { name: 'Google AI', url: 'https://gemini.google.com', icon: '&' },
  { name: 'Grok', url: 'https://x.com/i/grok', icon: '<' },
]

interface CopyDropdownProps {
  variant?: 'primary' | 'secondary' | 'inverted'
  className?: string
}

export default function CopyDropdown({ variant = 'primary', className = '' }: CopyDropdownProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [isCopying, setIsCopying] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)
  const { content, language } = useLanguage()

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isOpen])

  const handleCopy = async () => {
    if (isCopying) return

    setIsCopying(true)
    setIsOpen(false)

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

  const handleOpenAI = async (platform: AIPlatform) => {
    setIsCopying(true)
    setIsOpen(false)

    try {
      const markdown = generateMarkdown(language)
      await copyToClipboard(markdown)

      // Open AI platform in new tab
      window.open(platform.url, '_blank', 'noopener,noreferrer')

      toast.success(`Copied! Opening ${platform.name}...`, {
        duration: 3000,
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
    <div className="relative inline-block" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        disabled={isCopying}
        className={clsx(
          'inline-flex items-center justify-center',
          'px-3 py-1.5 font-mono text-sm rounded-base',
          'transition-colors duration-200',
          'focus:outline-none',
          'disabled:opacity-50 disabled:cursor-not-allowed',
          variant === 'inverted'
            ? 'border border-neutral-800/50 text-neutral-800 hover:border-neutral-800 hover:text-neutral-950 hover:bg-neutral-800/10 focus-visible:border-neutral-800 focus-visible:text-neutral-950 focus-visible:bg-neutral-800/10'
            : 'border border-primary/30 text-secondary hover:border-primary hover:text-primary hover:bg-primary/10 focus-visible:border-primary focus-visible:text-primary focus-visible:bg-primary/10',
          className
        )}
        aria-label={content.hero.cta.copyAriaLabel}
        aria-expanded={isOpen}
        aria-haspopup="true"
      >
        <span className="mr-1">&gt;</span>
        {isCopying ? content.hero.cta.copying : content.hero.cta.copy}
        <span className="ml-2" aria-hidden="true">
          {isOpen ? '▲' : '▼'}
        </span>
      </button>

      {isOpen && (
        <div
          className="absolute top-full left-0 mt-2 min-w-[200px] bg-neutral border-2 border-primary rounded-base shadow-lg z-50"
          role="menu"
          aria-orientation="vertical"
        >
          <button
            onClick={handleCopy}
            className="w-full text-left px-4 py-3 font-mono text-sm text-neutral-200 hover:bg-primary hover:text-neutral-950 focus:outline-none focus-visible:bg-primary focus-visible:text-neutral-950 transition-colors duration-150 flex items-center gap-2"
            role="menuitem"
          >
            <span aria-hidden="true">$</span>
            <span>Copy Markdown</span>
          </button>

          <div className="border-t border-primary/30" />

          {AI_PLATFORMS.map((platform) => (
            <button
              key={platform.name}
              onClick={() => handleOpenAI(platform)}
              className="w-full text-left px-4 py-3 font-mono text-sm text-neutral-200 hover:bg-primary hover:text-neutral-950 focus:outline-none focus-visible:bg-primary focus-visible:text-neutral-950 transition-colors duration-150 flex items-center gap-2"
              role="menuitem"
            >
              <span aria-hidden="true">{platform.icon}</span>
              <span>Open in {platform.name}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
