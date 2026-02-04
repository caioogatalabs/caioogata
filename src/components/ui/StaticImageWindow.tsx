'use client'

import { motion } from 'motion/react'
import Image from 'next/image'

interface StaticImageWindowProps {
  src: string
  alt: string
  title: string
  className?: string
}

const HEADER_HEIGHT = 28

export default function StaticImageWindow({ src, alt, title, className = '' }: StaticImageWindowProps) {
  return (
    <motion.div
      className={`flex flex-col bg-neutral-100 border border-neutral-400 shadow-[2px_2px_0px_0px_rgba(0,0,0,0.15)] overflow-hidden ${className}`}
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: 'easeOut' }}
    >
      {/* Header — same as ImageWindow */}
      <div className="relative h-7 bg-neutral-700 flex items-center px-1 shrink-0 border-b border-neutral-400">
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none pr-14" aria-hidden>
          <span className="text-xs text-neutral-100 font-mono truncate max-w-[calc(100%-3.5rem)] text-center">
            {title}
          </span>
        </div>

        <div className="relative z-10 flex items-center gap-0.5 shrink-0 ml-auto">
          <span className="inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-sm border border-neutral-400 bg-neutral-800 text-neutral-100 font-mono text-xs">
            _
          </span>
          <span className="inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-sm border border-neutral-400 bg-neutral-800 text-neutral-100 font-mono">
            <span className="text-[10px] leading-none border border-current w-2.5 h-2.5 block" />
          </span>
          <span className="inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-sm border border-neutral-400 bg-neutral-800 text-neutral-100 font-mono text-xs">
            ×
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="relative bg-neutral overflow-hidden aspect-[3/4] min-h-[200px]">
        <Image
          src={src}
          alt={alt}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, 35vw"
        />
      </div>
    </motion.div>
  )
}
