/**
 * AI Platform Link Builder
 * Builds URLs with prompts for different AI platforms
 */

export interface AIPlatform {
  id: string
  name: string
  icon: string
  buildUrl: (markdownUrl: string, language: 'en' | 'pt-br') => string
  /** Whether this platform can fetch URLs automatically */
  canFetchUrls: boolean
  /** Whether to use clipboard fallback (copy prompt text, open plain URL) */
  useClipboardFallback?: boolean
}

/**
 * Get the base URL for the portfolio
 * In production, this would be the actual domain
 */
export function getBaseUrl(): string {
  if (typeof window !== 'undefined') {
    return window.location.origin
  }
  // Fallback for SSR
  return process.env.NEXT_PUBLIC_BASE_URL || 'https://www.caioogata.com'
}

/**
 * Get the markdown URL based on language
 */
export function getMarkdownUrl(language: 'en' | 'pt-br'): string {
  const base = getBaseUrl()
  return language === 'en' ? `${base}/llms-full.txt` : `${base}/llms-pt.txt`
}

/**
 * Prompts for each language
 */
const PROMPTS = {
  en: (url: string) =>
    `Read this full professional profile and be ready to answer questions about Caio Ogata's career, skills, projects, and background: ${url}`,
  'pt-br': (url: string) =>
    `Leia este perfil profissional completo e esteja pronto para responder perguntas sobre a carreira, habilidades, projetos e histórico de Caio Ogata: ${url}`,
}

/**
 * AI Platforms configuration with link builders
 */
export const AI_PLATFORMS: AIPlatform[] = [
  {
    id: 'chatgpt',
    name: 'ChatGPT',
    icon: '*',
    canFetchUrls: false, // Requires GPT-4 + browse
    buildUrl: (markdownUrl, language) => {
      const prompt = PROMPTS[language](markdownUrl)
      return `https://chat.openai.com/?q=${encodeURIComponent(prompt)}`
    },
  },
  {
    id: 'claude',
    name: 'Claude',
    icon: '>',
    canFetchUrls: false, // Claude cannot fetch URLs
    buildUrl: (markdownUrl, language) => {
      const prompt = PROMPTS[language](markdownUrl)
      return `https://claude.ai/new?q=${encodeURIComponent(prompt)}`
    },
  },
  {
    id: 'grok',
    name: 'Grok',
    icon: 'X',
    canFetchUrls: true, // Grok can search
    buildUrl: (markdownUrl, language) => {
      const prompt = PROMPTS[language](markdownUrl)
      return `https://x.com/i/grok?text=${encodeURIComponent(prompt)}`
    },
  },
]

/**
 * Build only the prompt text (for clipboard fallback platforms)
 */
export function buildPromptText(language: 'en' | 'pt-br'): string {
  const markdownUrl = getMarkdownUrl(language)
  return PROMPTS[language](markdownUrl)
}

/**
 * Build URL for a specific platform
 */
export function buildAIUrl(platformId: string, language: 'en' | 'pt-br'): string | null {
  const platform = AI_PLATFORMS.find(p => p.id === platformId)
  if (!platform) return null

  const markdownUrl = getMarkdownUrl(language)
  return platform.buildUrl(markdownUrl, language)
}
