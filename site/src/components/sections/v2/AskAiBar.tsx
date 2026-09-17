'use client'

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

/**
 * AskAiBar — five assistant tiles, each opening a chat pre-loaded with a
 * question about Caio pointed at the site's `llms-full.txt`.
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
    </div>
  )
}
