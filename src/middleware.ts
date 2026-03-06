import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { track } from '@vercel/analytics/server'

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

export async function middleware(request: NextRequest) {
  const userAgent = request.headers.get('user-agent') ?? ''
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
  ],
}
