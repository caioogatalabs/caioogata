import { notFound } from 'next/navigation'
import { EnglishProvider } from '@/components/providers/EnglishProvider'
import '../globals.css'

/**
 * Playgrounds under /dev are for local work only; production answers 404.
 *
 * A root layout of its own: the site's two root layouts belong to the
 * languages (`app/(en)`, `app/pt`), and `/dev` is neither.
 */
export default function DevLayout({ children }: { children: React.ReactNode }) {
  if (process.env.NODE_ENV === 'production') notFound()
  return (
    <html lang="en">
      <body className="antialiased">
        <EnglishProvider>{children}</EnglishProvider>
      </body>
    </html>
  )
}
