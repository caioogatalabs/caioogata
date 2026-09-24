import { notFound } from 'next/navigation'

/**
 * Anything under a language that no route claims. Without this, an unmatched
 * URL would skip this language's `not-found.tsx` and get Next's bare default 404.
 */
export default function CatchAll() {
  notFound()
}
