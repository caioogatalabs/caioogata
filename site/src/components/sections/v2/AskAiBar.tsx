'use client'

import { useCallback, useState } from 'react'
import {
  ChatGPTIcon,
  ClaudeIcon,
  GeminiIcon,
  GrokIcon,
  PerplexityIcon,
} from '@/components/icons/ai'
import { fill, useLanguage } from '@/components/providers/LanguageProvider'

/**
 * Deep links that accept a pre-filled question.
 *
 * Endpoints matched against bymonolog.com's own Ask AI block, which is the
 * reference for this bar: ChatGPT through `chat.openai.com`, Grok through
 * `x.com/i/grok` (grok.com puts a sign-in wall in front of a prefilled
 * question), Perplexity through `/search/new`. Gemini has no documented
 * prefill parameter on gemini.google.com, so it routes through Google's AI
 * Mode (`udm=50&aep=11`), which is the same model and does accept one.
 */
const ASSISTANTS = [
  { name: 'Claude', href: (q: string) => `https://claude.ai/new?q=${q}`, Icon: ClaudeIcon },
  { name: 'Gemini', href: (q: string) => `https://www.google.com/search?udm=50&aep=11&q=${q}`, Icon: GeminiIcon },
  { name: 'ChatGPT', href: (q: string) => `https://chat.openai.com/?q=${q}`, Icon: ChatGPTIcon },
  { name: 'Grok', href: (q: string) => `https://x.com/i/grok?text=${q}`, Icon: GrokIcon },
  { name: 'Perplexity', href: (q: string) => `https://www.perplexity.ai/search/new?q=${q}`, Icon: PerplexityIcon },
] as const

const COPIED_MS = 2000

/** The tile that copies the prompt instead of opening an assistant. */
function CopyIcon({ className = '' }: { className?: string }) {
  return (
    <svg viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="1.4" className={className} aria-hidden>
      <rect x="6.2" y="6.2" width="9" height="9" rx="1.4" />
      <path d="M12.2 3.4H4.2a1.4 1.4 0 0 0-1.4 1.4v8" />
    </svg>
  )
}

/**
 * AskAiBar — five assistant tiles, each opening a chat pre-loaded with a
 * question about Caio pointed at the site's `llms-full.txt`, plus a tile that
 * copies the prompt. Every assistant asks a visitor without an account to sign
 * in before it will answer, so the copy tile is the path that always works:
 * paste it into whatever the visitor already uses.
 *
 * The icons paint with `currentColor`, so the bar reads correctly both on the
 * dark hero and inside the footer's `data-theme="inverse"` yellow.
 */
export function AskAiBar({ className = '' }: { className?: string }) {
  // The prompt is written in the visitor's voice, the way bymonolog.com writes
  // theirs: it states who is asking, what to evaluate, and by which criteria —
  // including where Caio would be the wrong choice. It names the site and the
  // machine-readable profile (see `src/lib/markdown-generator.ts`), the
  // Portuguese one at `llms-pt.txt`, the English one at `llms-full.txt`.
  const t = useLanguage().content.ui.askAi
  const q = encodeURIComponent(t.prompt)
  const [copied, setCopied] = useState(false)

  const copy = useCallback(() => {
    const done = () => {
      setCopied(true)
      setTimeout(() => setCopied(false), COPIED_MS)
    }
    // Older browsers and insecure contexts have no async clipboard; a selected
    // textarea still copies there, the same fallback `CopyEmail` uses.
    navigator.clipboard?.writeText(t.prompt).then(done).catch(() => {
      const area = document.createElement('textarea')
      area.value = t.prompt
      area.setAttribute('readonly', '')
      area.style.position = 'fixed'
      area.style.opacity = '0'
      document.body.appendChild(area)
      area.select()
      document.execCommand('copy')
      area.remove()
      done()
    })
  }, [t.prompt])

  return (
    <div className={`flex gap-px ${className}`.trim()}>
      {ASSISTANTS.map(({ name, href, Icon }) => (
        <a
          key={name}
          href={href(q)}
          target="_blank"
          rel="noopener noreferrer"
          title={fill(t.tileLabel, { name })}
          aria-label={fill(t.tileLabel, { name })}
          className="flex size-10 items-center justify-center bg-bg-surface-primary text-icon-primary opacity-70 transition-opacity duration-300 hover:opacity-100"
        >
          <Icon className="size-[18px]" />
        </a>
      ))}
      <button
        type="button"
        onClick={copy}
        title={copied ? t.copiedLabel : t.copyLabel}
        aria-label={copied ? t.copiedLabel : t.copyLabel}
        className="flex size-10 items-center justify-center bg-bg-surface-primary text-icon-primary opacity-70 transition-opacity duration-300 hover:opacity-100"
      >
        <CopyIcon className={`size-[18px] ${copied ? 'text-text-brand' : ''}`.trim()} />
      </button>
    </div>
  )
}
