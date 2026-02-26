'use client'

import { useState, useRef, useEffect } from 'react'
import { toast } from 'react-hot-toast'
import { clsx } from 'clsx'
import { copyToClipboard } from '@/lib/clipboard'
import { generateMarkdown } from '@/lib/markdown-generator'
import { useLanguage } from '@/components/providers/LanguageProvider'
import { AI_PLATFORMS, getMarkdownUrl, buildPromptText, type AIPlatform } from '@/lib/ai-link-builder'

interface CopyDropdownProps {
  variant?: 'primary' | 'secondary' | 'inverted' | 'filled'
  className?: string
  /** Override button label (e.g. "Ask about Caio." for Intro) */
  buttonLabel?: string
}

export default function CopyDropdown({ variant = 'primary', className = '', buttonLabel }: CopyDropdownProps) {
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
    setIsOpen(false)

    // Clipboard fallback: copy prompt text and open plain URL (e.g. Gemini)
    if (platform.useClipboardFallback) {
      try {
        const promptText = buildPromptText(language)
        await copyToClipboard(promptText)
      } catch {
        // Silently continue even if clipboard fails
      }
      window.open(platform.buildUrl('', language), '_blank', 'noopener,noreferrer')
      toast(
        language === 'en'
          ? `Prompt copied! Paste it in ${platform.name} to start.`
          : `Prompt copiado! Cole no ${platform.name} para começar.`,
        {
          duration: 5000,
          icon: 'ℹ️',
          ariaProps: {
            role: 'status',
            'aria-live': 'polite',
          },
        }
      )
      return
    }

    // Build the URL with the markdown URL embedded in the prompt
    const markdownUrl = getMarkdownUrl(language)
    const aiUrl = platform.buildUrl(markdownUrl, language)

    // Open AI platform in new tab with the prompt
    window.open(aiUrl, '_blank', 'noopener,noreferrer')

    // Show appropriate toast based on platform capability
    if (platform.canFetchUrls) {
      toast.success(
        language === 'en'
          ? `Opening ${platform.name}... It will read my portfolio automatically.`
          : `Abrindo ${platform.name}... Ele vai ler meu portfólio automaticamente.`,
        {
          duration: 4000,
          ariaProps: {
            role: 'status',
            'aria-live': 'polite',
          },
        }
      )
    } else {
      toast(
        language === 'en'
          ? `Opening ${platform.name}... Ask it to read the URL in the prompt.`
          : `Abrindo ${platform.name}... Peça para ele ler a URL no prompt.`,
        {
          duration: 5000,
          icon: 'ℹ️',
          ariaProps: {
            role: 'status',
            'aria-live': 'polite',
          },
        }
      )
    }
  }

  const handleCopyPrompt = async () => {
    setIsOpen(false)

    try {
      const promptText = buildPromptText(language)
      await copyToClipboard(promptText)

      toast.success(
        language === 'en'
          ? 'Prompt copied! Paste it in any AI assistant.'
          : 'Prompt copiado! Cole em qualquer assistente de IA.',
        {
          duration: 4000,
          ariaProps: {
            role: 'status',
            'aria-live': 'polite',
          },
        }
      )
    } catch (error) {
      console.error('Failed to copy prompt:', error)
      toast.error(content.notifications.copyError, {
        duration: 5000,
      })
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
          variant === 'filled'
            ? 'bg-primary text-neutral-900 hover:bg-primary/90 focus-visible:bg-primary/90'
            : variant === 'inverted'
              ? 'border border-neutral-800/50 text-neutral-800 hover:border-neutral-800 hover:text-neutral-950 hover:bg-neutral-800/10 focus-visible:border-neutral-800 focus-visible:text-neutral-950 focus-visible:bg-neutral-800/10'
              : 'border border-primary/30 text-secondary hover:border-primary hover:text-primary hover:bg-primary/10 focus-visible:border-primary focus-visible:text-primary focus-visible:bg-primary/10',
          className
        )}
        aria-label={buttonLabel ?? content.hero.cta.copyAriaLabel}
        aria-expanded={isOpen}
        aria-haspopup="true"
      >
        <span className="mr-1">&gt;</span>
        {isCopying ? content.hero.cta.copying : (buttonLabel ?? content.hero.cta.copy)}
        <span className="ml-2" aria-hidden="true">
          {isOpen ? '▲' : '▼'}
        </span>
      </button>

      {isOpen && (
        <div
          className="absolute top-full right-0 sm:right-auto sm:left-0 mt-2 min-w-[240px] max-w-[calc(100vw-2rem)] bg-neutral border-2 border-primary rounded-base shadow-lg z-50"
          role="menu"
          aria-orientation="vertical"
        >
          {/* AI Platforms first */}
          <div className="px-3 py-2 text-xs text-neutral-400 font-mono">
            {language === 'en' ? 'Interact with AI' : 'Interagir com IA'}
          </div>

          {AI_PLATFORMS.map((platform) => (
            <button
              key={platform.id}
              onClick={() => handleOpenAI(platform)}
              className="w-full text-left px-4 py-3 font-mono text-sm text-neutral-200 hover:bg-primary hover:text-neutral-950 focus:outline-none focus-visible:bg-primary focus-visible:text-neutral-950 transition-colors duration-150 flex items-center gap-2"
              role="menuitem"
            >
              <span aria-hidden="true" className="w-4 text-center">{platform.icon}</span>
              <span>{platform.name}</span>
            </button>
          ))}

          <div className="border-t border-primary/30 my-1" />

          {/* Copy options */}
          <button
            onClick={handleCopyPrompt}
            className="w-full text-left px-4 py-3 font-mono text-sm text-neutral-200 hover:bg-primary hover:text-neutral-950 focus:outline-none focus-visible:bg-primary focus-visible:text-neutral-950 transition-colors duration-150 flex items-center gap-2"
            role="menuitem"
          >
            <span aria-hidden="true" className="w-4 text-center">#</span>
            <span>{language === 'en' ? 'Copy to your AI' : 'Copiar para sua IA'}</span>
          </button>

          <button
            onClick={handleCopy}
            className="w-full text-left px-4 py-3 font-mono text-sm text-neutral-200 hover:bg-primary hover:text-neutral-950 focus:outline-none focus-visible:bg-primary focus-visible:text-neutral-950 transition-colors duration-150 flex items-center gap-2"
            role="menuitem"
          >
            <span aria-hidden="true" className="w-4 text-center">$</span>
            <span>{language === 'en' ? 'Copy Markdown' : 'Copiar Markdown'}</span>
          </button>
        </div>
      )}
    </div>
  )
}
