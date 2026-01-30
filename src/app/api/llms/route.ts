import { NextResponse } from 'next/server'
import { generateMarkdown } from '@/lib/markdown-generator'

export const dynamic = 'force-static'

export async function GET() {
  const markdown = generateMarkdown('en')

  return new NextResponse(markdown, {
    status: 200,
    headers: {
      'Content-Type': 'text/markdown; charset=utf-8',
    },
  })
}
