'use client'

import { useState, useRef, useEffect, useCallback } from 'react'
import { useLanguage } from '@/components/providers/LanguageProvider'
import { AsciiScrambleLogo } from '@/components/ui/AsciiScrambleLogo'
import { useScramble } from '@/hooks/useScramble'
import ArrowRightIcon from '@/components/ui/ArrowRightIcon'
import InlineToast from '@/components/ui/InlineToast'
import { copyToClipboard } from '@/lib/clipboard'
import { generateMarkdown } from '@/lib/markdown-generator'
import { AI_PLATFORMS, getMarkdownUrl, type AIPlatform } from '@/lib/ai-link-builder'
import { useToast } from '@/components/providers/ToastProvider'
import packageJson from '../../../package.json'
import { COMMIT_COUNT } from '@/lib/build-info'

const ARROW_WIDTH_CLASS = 'w-4'

type SubItemType = { type: 'ai'; platform: AIPlatform } | { type: 'copy-markdown' } | { type: 'copy-url' }

function buildSubItems(): SubItemType[] {
  const items: SubItemType[] = AI_PLATFORMS.map((platform) => ({ type: 'ai', platform }))
  items.push({ type: 'copy-markdown' })
  items.push({ type: 'copy-url' })
  return items
}

const SUB_ITEMS = buildSubItems()

interface FirstVisitIntroProps {
  onContinue: () => void
}

const TYPEWRITER_MS_PER_CHAR = 7

function useTypewriter(fullText: string, enabled = true) {
  const [length, setLength] = useState(0)

  useEffect(() => {
    if (!enabled || fullText === '') return
    if (length >= fullText.length) return
    const t = setTimeout(() => setLength((l) => Math.min(l + 1, fullText.length)), TYPEWRITER_MS_PER_CHAR)
    return () => clearTimeout(t)
  }, [fullText, length, enabled])

  useEffect(() => {
    setLength(0)
  }, [fullText])

  return { text: fullText.slice(0, length), isComplete: length >= fullText.length }
}

export default function FirstVisitIntro({ onContinue }: FirstVisitIntroProps) {
  const { content, language, setLanguage } = useLanguage()
  const toast = useToast()
  const version = `${packageJson.version}.${COMMIT_COUNT}`

  const headerTagline = useTypewriter(content.footer.tagline)
  const headerVersion = useTypewriter(` v${version}`)
  const [taglineIndex, setTaglineIndex] = useState(0)
  const taglines = [content.hero.tagline, content.hero.tagline2]
  const heroTagline = useScramble(taglines[taglineIndex])
  const handleLogoTrigger = useCallback(() => {
    setTaglineIndex((i) => (i + 1) % taglines.length)
  }, [taglines.length])
  const introTips = useTypewriter(content.intro.tips)

  const [selectedIndex, setSelectedIndex] = useState(0)
  const [subExpanded, setSubExpanded] = useState(false)
  const [subSelectedIndex, setSubSelectedIndex] = useState(0)
  const itemRefs = useRef<(HTMLButtonElement | null)[]>([])
  const subItemRefs = useRef<(HTMLButtonElement | null)[]>([])

  const mainOptionCount = 2

  const handleOpenAI = useCallback(
    (platform: AIPlatform) => {
      const markdownUrl = getMarkdownUrl(language)
      const aiUrl = platform.buildUrl(markdownUrl, language)
      window.open(aiUrl, '_blank', 'noopener,noreferrer')
      if (platform.canFetchUrls) {
        toast.success(
          language === 'en'
            ? `Opening ${platform.name}... Results may vary — always verify at caioogata.com`
            : `Abrindo ${platform.name}... Resultados podem variar — sempre verifique em caioogata.com`,
          { duration: 5000 }
        )
      } else {
        toast.info(
          language === 'en'
            ? `Opening ${platform.name}... Ask it to read the URL. Always verify at caioogata.com`
            : `Abrindo ${platform.name}... Peça para ler a URL. Sempre verifique em caioogata.com`,
          { duration: 5000 }
        )
      }
    },
    [language, toast]
  )

  const handleCopyMarkdown = useCallback(async () => {
    try {
      const markdown = generateMarkdown(language)
      await copyToClipboard(markdown)
      toast.success(
        language === 'en'
          ? 'Copied! Paste it in any AI assistant. Always verify at caioogata.com'
          : 'Copiado! Cole em qualquer assistente de IA. Sempre verifique em caioogata.com',
        { duration: 5000 }
      )
    } catch (error) {
      console.error('Failed to copy:', error)
      toast.error(content.notifications.copyError, { duration: 5000 })
    }
  }, [language, content.notifications.copyError, toast])

  const handleCopyUrl = useCallback(async () => {
    try {
      const markdownUrl = getMarkdownUrl(language)
      await copyToClipboard(markdownUrl)
      toast.success(
        language === 'en'
          ? 'Copied! Paste it in any AI assistant. Always verify at caioogata.com'
          : 'Copiado! Cole em qualquer assistente de IA. Sempre verifique em caioogata.com',
        { duration: 5000 }
      )
    } catch (error) {
      console.error('Failed to copy URL:', error)
      toast.error(content.notifications.copyError, { duration: 5000 })
    }
  }, [language, content.notifications.copyError, toast])

  const runSubItemAction = useCallback(
    (sub: SubItemType) => {
      if (sub.type === 'ai') handleOpenAI(sub.platform)
      else if (sub.type === 'copy-markdown') handleCopyMarkdown()
      else if (sub.type === 'copy-url') handleCopyUrl()
    },
    [handleOpenAI, handleCopyMarkdown, handleCopyUrl]
  )

  useEffect(() => {
    itemRefs.current = itemRefs.current.slice(0, mainOptionCount)
  }, [])

  useEffect(() => {
    subItemRefs.current = subItemRefs.current.slice(0, SUB_ITEMS.length)
  }, [])

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const captureKeys = ['ArrowUp', 'ArrowDown', 'Enter', 'Escape']
      if (!captureKeys.includes(e.key)) return

      e.preventDefault()
      e.stopImmediatePropagation()

      if (subExpanded) {
        if (e.key === 'Escape') {
          setSubExpanded(false)
          return
        }
        if (e.key === 'ArrowUp') {
          setSubSelectedIndex((i) => (i - 1 + SUB_ITEMS.length) % SUB_ITEMS.length)
          return
        }
        if (e.key === 'ArrowDown') {
          setSubSelectedIndex((i) => (i + 1) % SUB_ITEMS.length)
          return
        }
        if (e.key === 'Enter') {
          runSubItemAction(SUB_ITEMS[subSelectedIndex])
          return
        }
        return
      }

      if (e.key === 'ArrowUp') {
        setSelectedIndex((i) => (i - 1 + mainOptionCount) % mainOptionCount)
        return
      }
      if (e.key === 'ArrowDown') {
        setSelectedIndex((i) => (i + 1) % mainOptionCount)
        return
      }
      if (e.key === 'Enter') {
        if (selectedIndex === 0) {
          setSubExpanded(true)
          setSubSelectedIndex(0)
        } else {
          onContinue()
        }
        return
      }
    }
    window.addEventListener('keydown', handleKeyDown, true)
    return () => window.removeEventListener('keydown', handleKeyDown, true)
  }, [subExpanded, subSelectedIndex, selectedIndex, onContinue, runSubItemAction])

  useEffect(() => {
    if (subExpanded && subItemRefs.current[subSelectedIndex]) {
      subItemRefs.current[subSelectedIndex]?.focus()
    }
  }, [subExpanded, subSelectedIndex])

  return (
    <div className="relative animate-fade-in">
      <InlineToast />

      {/* Header: tagline + version à esquerda; seletor de idiomas à direita */}
      <div className="mb-2 flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1 min-h-[1.5rem] pl-6">
        <div className="flex items-baseline gap-2">
          <span className="text-sm font-mono text-primary">
            {headerTagline.text}
            {!headerTagline.isComplete && <span className="inline-block w-2 h-4 bg-secondary animate-blink align-middle ml-0.5" aria-hidden />}
          </span>
          <span className="text-sm font-mono text-secondary">{headerVersion.text}</span>
        </div>
        <div className="flex items-center gap-3" role="group" aria-label="Language selection">
          <button
            onClick={() => setLanguage('en')}
            className="font-mono text-sm transition-colors focus:outline-none text-neutral-300 hover:text-primary"
            aria-pressed={language === 'en'}
            aria-label="Switch to English"
          >
            {language === 'en' && <span className="mr-1">&gt;</span>}EN
          </button>
          <button
            onClick={() => setLanguage('pt-br')}
            className="font-mono text-sm transition-colors focus:outline-none text-neutral-300 hover:text-primary"
            aria-pressed={language === 'pt-br'}
            aria-label="Mudar para Portugues"
          >
            {language === 'pt-br' && <span className="mr-1">&gt;</span>}PT
          </button>
        </div>
      </div>

      {/* Box: logo (fixo) | Design Director — mesma linha */}
      <section className="border-2 border-primary rounded-base p-6 w-full mb-6">
        <div className="grid grid-cols-1 md:grid-cols-[auto_3fr_2fr] gap-4 md:gap-6 items-center">
          <AsciiScrambleLogo onAnimationTrigger={handleLogoTrigger} />
          <p className="text-base font-mono min-h-[1.5rem]">
            {heroTagline.chars.map((c, i) => (
              <span key={i} className={c.locked ? 'text-neutral-300' : 'text-neutral-300/25'}>
                {c.char}
              </span>
            ))}
            {!heroTagline.isComplete && <span className="inline-block w-2 h-4 bg-secondary animate-blink align-middle ml-0.5" aria-hidden />}
          </p>
          <div />
        </div>
      </section>

      {/* Fora do box: texto intro (humanos + IA) e depois Select an option + menu */}
      <div className="pl-6 mb-4">
        <p className="text-base font-mono text-secondary min-h-[1.5rem]">
          {introTips.text}
          {!introTips.isComplete && <span className="inline-block w-2 h-4 bg-secondary animate-blink align-middle ml-0.5" aria-hidden />}
        </p>
      </div>
      <div className="pl-6">
        <p className="text-secondary text-sm font-mono mb-2">
          {language === 'en' ? 'Select an option' : 'Selecione uma opção'}
        </p>
        <nav aria-label="First visit options">
          <ul className="space-y-0.5 pl-0">
            {/* Option 1 */}
            <li>
              <button
                ref={(el) => { itemRefs.current[0] = el }}
                type="button"
                onClick={() => {
                  setSelectedIndex(0)
                  if (subExpanded) {
                    setSubExpanded(false)
                  } else {
                    setSubExpanded(true)
                    setSubSelectedIndex(0)
                  }
                }}
                onFocus={() => setSelectedIndex(0)}
                onMouseEnter={() => setSelectedIndex(0)}
                className={`w-full text-left py-0.5 font-mono text-sm transition-all focus:outline-none focus:ring-0 grid grid-cols-[1rem_1fr] md:grid-cols-[1rem_180px_100px_1fr] items-center gap-0 ${
                  selectedIndex === 0 && !subExpanded
                    ? 'text-primary opacity-100'
                    : 'text-secondary hover:text-primary opacity-60 hover:opacity-100'
                }`}
                aria-expanded={subExpanded}
                aria-current={selectedIndex === 0 && !subExpanded ? 'true' : undefined}
              >
                <span className={`${ARROW_WIDTH_CLASS} shrink-0 flex items-center justify-center text-primary`}>
                  {selectedIndex === 0 && !subExpanded ? <ArrowRightIcon /> : null}
                </span>
                <span className="min-w-0 truncate">{content.firstVisit.optionMeetAI.toLowerCase()}</span>
                <span className="hidden md:block" aria-hidden />
                <span className={`hidden md:inline min-w-0 truncate text-sm font-mono ${subExpanded ? 'text-secondary opacity-60' : 'text-secondary'}`}>
                  {content.firstVisit.optionMeetAIDescription}
                </span>
              </button>
              {subExpanded && (
                <ul
                  className="mt-1 pl-4 space-y-0 border-l border-secondary/30 font-mono text-sm text-left"
                  aria-label={language === 'en' ? 'Share with AI' : 'Compartilhar com IA'}
                >
                  {SUB_ITEMS.map((sub, index) => {
                    const isSubSelected = subSelectedIndex === index
                    const isLast = index === SUB_ITEMS.length - 1
                    const branch = isLast ? '└── ' : '├── '
                    const labelText =
                      sub.type === 'ai'
                        ? sub.platform.name
                        : sub.type === 'copy-markdown'
                          ? (language === 'en' ? 'Copy Markdown' : 'Copiar Markdown')
                          : (language === 'en' ? 'Copy URL' : 'Copiar URL')
                    return (
                      <li key={sub.type === 'ai' ? sub.platform.id : sub.type} className="flex">
                        <button
                          ref={(el) => { subItemRefs.current[index] = el }}
                          type="button"
                          onClick={() => runSubItemAction(sub)}
                          onFocus={() => setSubSelectedIndex(index)}
                          onMouseEnter={() => setSubSelectedIndex(index)}
                          className={`w-full text-left py-0.5 transition-all focus:outline-none focus:ring-0 flex items-center gap-2 min-w-0 ${
                            isSubSelected ? 'text-primary opacity-100' : 'text-secondary hover:text-primary opacity-60 hover:opacity-100'
                          }`}
                          aria-current={isSubSelected ? 'true' : undefined}
                        >
                          <span className={`${ARROW_WIDTH_CLASS} shrink-0 flex items-center justify-center text-primary`}>
                            {isSubSelected ? <ArrowRightIcon /> : null}
                          </span>
                          <span className="shrink-0 text-secondary/80 select-none" aria-hidden>
                            {branch}
                          </span>
                          {sub.type === 'ai' && <span className="w-4 text-center shrink-0" aria-hidden>{sub.platform.icon}</span>}
                          {sub.type === 'copy-markdown' && <span className="w-4 text-center shrink-0" aria-hidden>$</span>}
                          {sub.type === 'copy-url' && <span className="w-4 text-center shrink-0" aria-hidden>#</span>}
                          <span className="min-w-0 truncate">
                            {labelText}
                            {sub.type === 'ai' && sub.platform.recommended && (
                              <span className="ml-1 text-xs">
                                ({language === 'en' ? 'recommended' : 'recomendado'})
                              </span>
                            )}
                          </span>
                        </button>
                      </li>
                    )
                  })}
                </ul>
              )}
            </li>

            {/* Option 2 */}
            <li>
              <button
                ref={(el) => { itemRefs.current[1] = el }}
                type="button"
                onClick={() => onContinue()}
                onFocus={() => setSelectedIndex(1)}
                onMouseEnter={() => setSelectedIndex(1)}
                className={`w-full text-left py-0.5 font-mono text-sm transition-all focus:outline-none focus:ring-0 grid grid-cols-[1rem_1fr] md:grid-cols-[1rem_180px_100px_1fr] items-center gap-0 ${
                  selectedIndex === 1 ? 'text-primary opacity-100' : 'text-secondary hover:text-primary opacity-60 hover:opacity-100'
                }`}
                aria-current={selectedIndex === 1 ? 'true' : undefined}
              >
                <span className={`${ARROW_WIDTH_CLASS} shrink-0 flex items-center justify-center text-primary`}>
                  {selectedIndex === 1 ? <ArrowRightIcon /> : null}
                </span>
                <span className="min-w-0 truncate">{content.firstVisit.optionLoadWebsite.toLowerCase()}</span>
                <span className="hidden md:block" aria-hidden />
                <span className="hidden md:inline min-w-0 truncate text-sm font-mono text-secondary">
                  {content.firstVisit.optionLoadWebsiteDescription}
                </span>
              </button>
            </li>
          </ul>
        </nav>
      </div>
    </div>
  )
}
