'use client'

import { useState } from 'react'
import Image from 'next/image'

export function StickyLogoBar() {
  const [groupHovered, setGroupHovered] = useState(false)

  return (
    <div className="sticky top-0 z-50 px-5 py-4 md:px-8 lg:px-16">
      <div className="flex items-center justify-between w-full">
        <a href="/">
          <Image
            src="/logo-co.svg"
            alt="Caio Ogata — CO"
            width={105}
            height={48}
            priority
            className="h-10 w-auto md:h-12"
          />
        </a>

        <div
          className="flex items-center gap-0.5"
          onMouseEnter={() => setGroupHovered(true)}
          onMouseLeave={() => setGroupHovered(false)}
        >
          <a
            href="/llms.txt"
            className="relative inline-flex items-center justify-center h-12 rounded-full bg-bg-fill-primary text-text-on-primary px-8 overflow-hidden transition-colors duration-300 hover:bg-bg-fill-primary-hover"
          >
            <span
              className="block text-base font-medium"
              style={{
                fontFamily: 'var(--font-sans)',
                transform: groupHovered ? 'translateY(-100%)' : 'translateY(0)',
                opacity: groupHovered ? 0 : 1,
                transition: groupHovered
                  ? 'transform 1s cubic-bezier(0.16,1,0.3,1), opacity 0.3s cubic-bezier(0.16,1,0.3,1)'
                  : 'transform 1s cubic-bezier(0.16,1,0.3,1) 0.06s, opacity 0.3s cubic-bezier(0.16,1,0.3,1) 0.06s',
              }}
            >
              ask about
            </span>
            <span
              className="absolute inset-0 flex items-center justify-center font-normal"
              style={{
                fontFamily: "'Pexel Grotesk', var(--font-sans)",
                fontSize: '1.5rem',
                transform: groupHovered ? 'translateY(0)' : 'translateY(100%)',
                opacity: groupHovered ? 1 : 0,
                transition: groupHovered
                  ? 'transform 1s cubic-bezier(0.16,1,0.3,1), opacity 0.3s cubic-bezier(0.16,1,0.3,1)'
                  : 'transform 1s cubic-bezier(0.16,1,0.3,1) 0.06s, opacity 0.3s cubic-bezier(0.16,1,0.3,1) 0.06s',
              }}
            >
              ask about
            </span>
          </a>
          <button
            type="button"
            className="relative flex items-center justify-center size-12 rounded-[12px] bg-bg-fill-primary text-text-on-primary overflow-hidden transition-colors duration-300 hover:bg-bg-fill-primary-hover"
            aria-label="Close"
          >
            <span
              className="block text-lg"
              style={{
                fontFamily: 'var(--font-sans)',
                transform: groupHovered ? 'translateY(-100%)' : 'translateY(0)',
                opacity: groupHovered ? 0 : 1,
                transition: groupHovered
                  ? 'transform 1s cubic-bezier(0.16,1,0.3,1) 0.1s, opacity 0.3s cubic-bezier(0.16,1,0.3,1) 0.1s'
                  : 'transform 1s cubic-bezier(0.16,1,0.3,1), opacity 0.3s cubic-bezier(0.16,1,0.3,1)',
              }}
            >
              ×
            </span>
            <span
              className="absolute inset-0 flex items-center justify-center"
              style={{
                fontFamily: "'Pexel Grotesk', var(--font-sans)",
                fontSize: '1.5rem',
                transform: groupHovered ? 'translateY(0)' : 'translateY(100%)',
                opacity: groupHovered ? 1 : 0,
                transition: groupHovered
                  ? 'transform 1s cubic-bezier(0.16,1,0.3,1) 0.1s, opacity 0.3s cubic-bezier(0.16,1,0.3,1) 0.1s'
                  : 'transform 1s cubic-bezier(0.16,1,0.3,1), opacity 0.3s cubic-bezier(0.16,1,0.3,1)',
              }}
            >
              ×
            </span>
          </button>
        </div>
      </div>
    </div>
  )
}
