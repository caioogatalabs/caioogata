import { Resend } from 'resend'
import { NextResponse } from 'next/server'

const resend = new Resend(process.env.RESEND_API_KEY)

const FROM = process.env.RESEND_FROM ?? 'contato@caioogata.com'
const TO = process.env.RESEND_TO ?? ''

const SUBJECT_LABELS: Record<string, string> = {
  job: 'Job opportunity',
  freelance: 'Freelance project',
  feedback: 'Feedback',
  other: 'Other',
}

export async function POST(request: Request) {
  const body = await request.json()
  const { name, email, subject, message } = body

  if (!name || !email || !message) {
    return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
  }

  const subjectLabel = SUBJECT_LABELS[subject] ?? subject ?? 'No subject'

  const { error } = await resend.emails.send({
    from: FROM,
    to: TO,
    replyTo: email,
    subject: `[Portfolio] ${subjectLabel} — ${name}`,
    text: `Name: ${name}\nEmail: ${email}\nSubject: ${subjectLabel}\n\n${message}`,
  })

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ success: true })
}
