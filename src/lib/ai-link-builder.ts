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
  return language === 'en' ? `${base}/llms.txt` : `${base}/llms-pt.txt`
}

/**
 * Prompts for each language
 */
const PROMPTS = {
  en: (url: string) =>
    `Read this portfolio page and be ready to answer questions about Caio Ogata's professional experience, skills, and career: ${url}`,
  'pt-br': (url: string) =>
    `Leia esta página do portfólio e esteja pronto para responder perguntas sobre a experiência profissional, habilidades e carreira de Caio Ogata: ${url}`,
}

/**
 * AI Platforms configuration with link builders
 */
export const AI_PLATFORMS: AIPlatform[] = [
  {
    id: 'perplexity',
    name: 'Perplexity',
    icon: '?',
    canFetchUrls: true,
    buildUrl: (markdownUrl, language) => {
      const prompt = PROMPTS[language](markdownUrl)
      return `https://www.perplexity.ai/search?q=${encodeURIComponent(prompt)}`
    },
  },
  {
    id: 'google-ai',
    name: 'Google AI',
    icon: 'G',
    canFetchUrls: true,
    buildUrl: (markdownUrl, language) => {
      const prompt = PROMPTS[language](markdownUrl)
      // udm=50 is AI Overview mode, aep=11 enables enhanced AI
      return `https://www.google.com/search?udm=50&aep=11&q=${encodeURIComponent(prompt)}`
    },
  },
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
 * Build URL for a specific platform
 */
export function buildAIUrl(platformId: string, language: 'en' | 'pt-br'): string | null {
  const platform = AI_PLATFORMS.find(p => p.id === platformId)
  if (!platform) return null

  const markdownUrl = getMarkdownUrl(language)
  return platform.buildUrl(markdownUrl, language)
}
