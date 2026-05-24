import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-4 p-6 font-mono text-neutral-200">
      <p className="text-lg">404 — página não encontrada</p>
      <Link
        href="/"
        className="text-[var(--color-primary)] underline focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:ring-offset-2 focus:ring-offset-[var(--bg-neutral)] rounded"
      >
        Voltar ao início
      </Link>
    </div>
  )
}
