import { NextResponse } from 'next/server'
import { generateAzionDesignSystemCaseStudy } from '@/lib/case-study-generator'

export const dynamic = 'force-static'

export async function GET() {
  const markdown = generateAzionDesignSystemCaseStudy('en')

  return new NextResponse(markdown, {
    status: 200,
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
    },
  })
}
