import { NextResponse } from 'next/server'
import { generateHuiaCaseStudy } from '@/lib/case-study-generator'

export const dynamic = 'force-static'

export async function GET() {
  const markdown = generateHuiaCaseStudy('pt-br')

  return new NextResponse(markdown, {
    status: 200,
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
    },
  })
}
