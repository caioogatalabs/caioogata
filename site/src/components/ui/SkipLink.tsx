'use client'

export default function SkipLink() {
  return (
    <a
      href="#main-content"
      className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4
                 focus:z-50 focus:px-6 focus:py-3 focus:bg-primary focus:text-neutral-950
                 focus:font-mono focus:text-base focus:rounded-base
                 focus:outline-none"
    >
      Skip to main content
    </a>
  )
}
