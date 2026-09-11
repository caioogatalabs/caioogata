import {
  ChatGPTIcon,
  ClaudeIcon,
  GeminiIcon,
  GrokIcon,
  PerplexityIcon,
} from '@/components/icons/ai'

/**
 * The prompt each assistant opens with. `llms-full.txt` is the canonical
 * machine-readable profile (see `src/lib/markdown-generator.ts`), so the
 * question points there rather than at the rendered site.
 */
const PROMPT =
  'Read https://www.caioogata.com/llms-full.txt and tell me about Caio Ogata — his background, how he works, and the projects in his portfolio.'

const Q = encodeURIComponent(PROMPT)

/**
 * Deep links that accept a pre-filled question.
 *
 * Gemini has no documented prefill parameter on gemini.google.com, so it routes
 * through Google's AI Mode (`udm=50`), which is the same model and does accept
 * one. Everything else takes `?q=` directly.
 */
const ASSISTANTS = [
  { name: 'Claude', href: `https://claude.ai/new?q=${Q}`, Icon: ClaudeIcon },
  { name: 'Gemini', href: `https://www.google.com/search?udm=50&q=${Q}`, Icon: GeminiIcon },
  { name: 'ChatGPT', href: `https://chatgpt.com/?q=${Q}`, Icon: ChatGPTIcon },
  { name: 'Grok', href: `https://grok.com/?q=${Q}`, Icon: GrokIcon },
  { name: 'Perplexity', href: `https://www.perplexity.ai/search?q=${Q}`, Icon: PerplexityIcon },
] as const

/**
 * AskAiBar — five assistant tiles, each opening a chat pre-loaded with a
 * question about Caio pointed at the site's `llms-full.txt`.
 *
 * The icons paint with `currentColor`, so the bar reads correctly both on the
 * dark hero and inside the footer's `data-theme="inverse"` yellow.
 */
export function AskAiBar({ className = '' }: { className?: string }) {
  return (
    <div className={`flex gap-px ${className}`.trim()}>
      {ASSISTANTS.map(({ name, href, Icon }) => (
        <a
          key={name}
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          title={`Ask ${name} about Caio`}
          aria-label={`Ask ${name} about Caio`}
          className="flex size-10 items-center justify-center bg-bg-surface-primary text-icon-primary opacity-70 transition-opacity duration-300 hover:opacity-100"
        >
          <Icon className="size-[18px]" />
        </a>
      ))}
    </div>
  )
}
