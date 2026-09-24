import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { track } from '@vercel/analytics/server'
import { LANG_COOKIE, localePath } from '@/lib/i18n'

function identifyLLMService(userAgent: string): string {
  const ua = userAgent.toLowerCase()
  if (ua.includes('chatgpt-user')) return 'ChatGPT (user)'
  if (ua.includes('gptbot')) return 'ChatGPT (crawler)'
  if (ua.includes('oai-searchbot')) return 'OpenAI Search'
  if (ua.includes('claudebot')) return 'Claude (crawler)'
  if (ua.includes('anthropic-ai')) return 'Anthropic'
  if (ua.includes('google-extended')) return 'Google AI'
  if (ua.includes('perplexitybot')) return 'Perplexity'
  if (ua.includes('meta-externalagent')) return 'Meta AI'
  if (ua.includes('youbot')) return 'You.com'
  if (ua.includes('duckassistbot')) return 'DuckDuckGo AI'
  if (ua.includes('applebot-extended')) return 'Apple AI'
  if (ua.includes('ccbot')) return 'Common Crawl'
  return 'Unknown'
}

/** Countries whose first visit lands on the Portuguese site. */
const PORTUGUESE_COUNTRIES = new Set(['BR', 'PT'])

/**
 * Crawlers are never redirected: each language has its own URL and hreflang,
 * and that is what search engines should read, not a guess about where they
 * crawl from.
 */
const CRAWLER = /bot|crawl|spider|slurp|facebookexternalhit|preview|google-extended|anthropic-ai|meta-externalagent|ccbot/i

function isLlmFile(pathname: string) {
  return pathname.startsWith('/llms')
}

/**
 * The first visit from a Portuguese-speaking country goes to the same page
 * under `/pt`. The country is the header Vercel adds to every request (absent
 * locally, so nothing redirects in development). Any explicit choice, written
 * by the language switch as the `lang` cookie, wins; a `/pt` URL is never sent
 * back to English.
 */
function geoRedirect(request: NextRequest, userAgent: string) {
  const { pathname } = request.nextUrl
  if (pathname === '/pt' || pathname.startsWith('/pt/')) return null
  if (request.cookies.has(LANG_COOKIE)) return null
  if (CRAWLER.test(userAgent)) return null

  const country = request.headers.get('x-vercel-ip-country')
  if (!country || !PORTUGUESE_COUNTRIES.has(country)) return null

  const url = request.nextUrl.clone()
  url.pathname = localePath(pathname, 'pt-br')
  return NextResponse.redirect(url, 307)
}

export async function middleware(request: NextRequest) {
  const userAgent = request.headers.get('user-agent') ?? ''

  if (!isLlmFile(request.nextUrl.pathname)) {
    return geoRedirect(request, userAgent) ?? NextResponse.next()
  }

  const service = identifyLLMService(userAgent)

  await track('llm_access', {
    path: request.nextUrl.pathname,
    service,
    userAgent: userAgent.slice(0, 150),
  })

  return NextResponse.next()
}

export const config = {
  matcher: [
    '/llms.txt',
    '/llms-full.txt',
    '/llms-pt.txt',
    '/llms/projects/:path*',
    // Page paths: everything that is not a Next asset, the image optimiser,
    // the sitemap, the dev playgrounds or a file with an extension.
    '/((?!_next/|api/|dev/|sitemap\\.xml|.*\\..*).*)',
  ],
}
