'use client'

import { AnimatePresence, motion } from 'motion/react'
import CheckIcon from '@/components/ui/CheckIcon'
import { useToastContext, type ToastState } from '@/components/providers/ToastProvider'
import { useScramble } from '@/hooks/useScramble'

function ToastContent({ message, type }: Pick<ToastState, 'message' | 'type'>) {
  const { chars, isComplete } = useScramble(message, {
    mode: 'scanner',
    charsPerFrame: 4,
    scannerPhaseDuration: 1,
  })

  const textColor = type === 'error' ? 'text-accent' : 'text-secondary'

  return (
    <div className={`flex items-center gap-2 font-mono text-sm min-w-0 ${textColor}`}>
      <CheckIcon className="w-4 h-4 shrink-0" />
      <span className="truncate">
        {chars.map((c, i) => (
          <span key={i} className={c.locked ? '' : 'opacity-25'}>
            {c.char}
          </span>
        ))}
        {!isComplete && (
          <span className="inline-block w-1.5 h-3.5 bg-secondary animate-blink align-middle ml-0.5" aria-hidden />
        )}
      </span>
    </div>
  )
}

export default function InlineToast() {
  const { toast } = useToastContext()

  return (
    <div
      className="absolute bottom-[calc(100%+10px)] left-0 right-0"
      role="status"
      aria-live="polite"
    >
      <AnimatePresence>
        {toast && (
          <motion.div
            key={toast.id}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
          >
            <ToastContent message={toast.message} type={toast.type} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
