'use client'

import { useState, useRef, useEffect, useCallback } from 'react'
import { toast } from 'react-hot-toast'
import { useLanguage } from '@/components/providers/LanguageProvider'
import { PixelRevealLogo } from '@/components/ui/PixelRevealLogo'
import ArrowRightIcon from '@/components/ui/ArrowRightIcon'
import { LOGO_PATHS } from '@/lib/logo-paths'
import { copyToClipboard } from '@/lib/clipboard'
import { generateMarkdown } from '@/lib/markdown-generator'
import { AI_PLATFORMS, getMarkdownUrl, type AIPlatform } from '@/lib/ai-link-builder'
import packageJson from '../../../package.json'

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
  const { content, language } = useLanguage()
  const version = packageJson.version

  const headerTagline = useTypewriter(content.footer.tagline)
  const headerVersion = useTypewriter(` v${version}`)
  const heroTagline = useTypewriter(content.hero.tagline)
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
            ? `Opening ${platform.name}... It will read my portfolio automatically.`
            : `Abrindo ${platform.name}... Ele vai ler meu portfólio automaticamente.`,
          { duration: 4000, ariaProps: { role: 'status', 'aria-live': 'polite' } }
        )
      } else {
        toast(
          language === 'en'
            ? `Opening ${platform.name}... Ask it to read the URL in the prompt.`
            : `Abrindo ${platform.name}... Peça para ele ler a URL no prompt.`,
          { duration: 5000, icon: 'ℹ️', ariaProps: { role: 'status', 'aria-live': 'polite' } }
        )
      }
    },
    [language]
  )

  const handleCopyMarkdown = useCallback(async () => {
    try {
      const markdown = generateMarkdown(language)
      await copyToClipboard(markdown)
      toast.success(content.notifications.copySuccess, {
        duration: 4000,
        ariaProps: { role: 'status', 'aria-live': 'polite' },
      })
    } catch (error) {
      console.error('Failed to copy:', error)
      toast.error(content.notifications.copyError, { duration: 5000 })
    }
  }, [language, content.notifications.copySuccess, content.notifications.copyError])

  const handleCopyUrl = useCallback(async () => {
    try {
      const markdownUrl = getMarkdownUrl(language)
      await copyToClipboard(markdownUrl)
      toast.success(
        language === 'en' ? 'URL copied! Paste it in any AI assistant.' : 'URL copiada! Cole em qualquer assistente de IA.',
        { duration: 4000, ariaProps: { role: 'status', 'aria-live': 'polite' } }
      )
    } catch (error) {
      console.error('Failed to copy URL:', error)
      toast.error(content.notifications.copyError, { duration: 5000 })
    }
  }, [language, content.notifications.copyError])

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
      {/* Header: alinhado ao box, estilo P 16px */}
      <div className="mb-2 flex items-baseline gap-2 min-h-[1.5rem] pl-6">
        <span className="text-base font-mono text-primary">
          {headerTagline.text}
          {!headerTagline.isComplete && <span className="inline-block w-2 h-4 bg-secondary animate-blink align-middle ml-0.5" aria-hidden />}
        </span>
        <span className="text-base font-mono text-secondary">{headerVersion.text}</span>
      </div>

      {/* Box: logo (fixo) | Design Director 60% | Built for humans 40% — mesma linha */}
      <section className="border-2 border-primary/30 rounded-base p-6 w-full mb-6">
        <div className="grid grid-cols-1 md:grid-cols-[120px_3fr_2fr] gap-4 md:gap-6 items-start">
          <div className="w-[120px] h-[55px] flex-shrink-0">
            <PixelRevealLogo
              paths={LOGO_PATHS}
              width={440}
              height={200}
              displayWidth={120}
              displayHeight={55}
              pixelSize={20}
              color="var(--color-primary)"
              animationDuration={1.5}
            />
          </div>
          <p className="text-base font-mono text-neutral-300 min-h-[1.5rem]">
            {heroTagline.text}
            {!heroTagline.isComplete && <span className="inline-block w-2 h-4 bg-secondary animate-blink align-middle ml-0.5" aria-hidden />}
          </p>
          <p className="text-base font-mono text-secondary min-h-[1.5rem]">
            {introTips.text}
            {!introTips.isComplete && <span className="inline-block w-2 h-4 bg-secondary animate-blink align-middle ml-0.5" aria-hidden />}
          </p>
        </div>
      </section>

      {/* Fora do box: Select an option (cor secundária) + menu — alinhamento à esquerda padronizado */}
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
                  setSubExpanded(true)
                  setSubSelectedIndex(0)
                }}
                onFocus={() => setSelectedIndex(0)}
                onMouseEnter={() => setSelectedIndex(0)}
                className={`w-full text-left py-0.5 font-mono text-sm transition-all focus:outline-none focus:ring-0 grid grid-cols-[1rem_1fr] md:grid-cols-[1rem_180px_100px_1fr] items-center gap-0 lowercase ${
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
                    const label =
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
                          <span className="min-w-0 truncate">{label}</span>
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
                className={`w-full text-left py-0.5 font-mono text-sm transition-all focus:outline-none focus:ring-0 grid grid-cols-[1rem_1fr] md:grid-cols-[1rem_180px_100px_1fr] items-center gap-0 lowercase ${
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
