import { notFound } from 'next/navigation'

/** Playgrounds under /dev are for local work only; production answers 404. */
export default function DevLayout({ children }: { children: React.ReactNode }) {
  if (process.env.NODE_ENV === 'production') notFound()
  return children
}
