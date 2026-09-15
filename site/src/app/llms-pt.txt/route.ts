import { NextResponse } from 'next/server'
import { generateMarkdown } from '@/lib/markdown-generator'

export const dynamic = 'force-static'

export async function GET() {
  const markdown = generateMarkdown('pt-br')

  return new NextResponse(markdown, {
    status: 200,
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
    },
  })
}
