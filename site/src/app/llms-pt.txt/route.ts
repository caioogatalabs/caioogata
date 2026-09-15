import { NextResponse } from 'next/server'
import { readFileSync } from 'fs'
import { join } from 'path'
import { generateMarkdown } from '@/lib/markdown-generator'

export const dynamic = 'force-static'

export async function GET() {
  let faqContent: string | undefined
  try {
    faqContent = readFileSync(join(process.cwd(), 'RECRUITER-FAQ.md'), 'utf-8')
  } catch {
    faqContent = undefined
  }

  const markdown = generateMarkdown('pt-br', faqContent)

  return new NextResponse(markdown, {
    status: 200,
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
    },
  })
}
