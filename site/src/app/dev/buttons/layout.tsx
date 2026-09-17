import type { Metadata } from 'next'

/** A scratch route for checking button states — never indexed. */
export const metadata: Metadata = {
  title: 'Buttons — dev',
  robots: { index: false, follow: false },
}

export default function DevButtonsLayout({ children }: { children: React.ReactNode }) {
  return children
}
