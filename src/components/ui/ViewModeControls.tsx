'use client'

import type { ViewMode } from '@/hooks/useWindowManager'

interface ViewModeControlsProps {
  currentMode: ViewMode
  onModeChange: (mode: ViewMode) => void
  onResetWindows: () => void
  labels: {
    free: string
    grid: string
    list: string
    carousel: string
    cascade: string
  }
}

function IconFree({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect x="1" y="1" width="5" height="4" rx="0.5" stroke="currentColor" strokeWidth="1.5" />
      <rect x="8" y="3" width="5" height="4" rx="0.5" stroke="currentColor" strokeWidth="1.5" />
      <rect x="3" y="9" width="5" height="4" rx="0.5" stroke="currentColor" strokeWidth="1.5" />
      <rect x="10" y="10" width="5" height="4" rx="0.5" stroke="currentColor" strokeWidth="1.5" />
    </svg>
  )
}

function IconGrid({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect x="1" y="1" width="6" height="6" rx="0.5" stroke="currentColor" strokeWidth="1.5" />
      <rect x="9" y="1" width="6" height="6" rx="0.5" stroke="currentColor" strokeWidth="1.5" />
      <rect x="1" y="9" width="6" height="6" rx="0.5" stroke="currentColor" strokeWidth="1.5" />
      <rect x="9" y="9" width="6" height="6" rx="0.5" stroke="currentColor" strokeWidth="1.5" />
    </svg>
  )
}

function IconList({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect x="1" y="1" width="14" height="4" rx="0.5" stroke="currentColor" strokeWidth="1.5" />
      <rect x="1" y="6" width="14" height="4" rx="0.5" stroke="currentColor" strokeWidth="1.5" />
      <rect x="1" y="11" width="14" height="4" rx="0.5" stroke="currentColor" strokeWidth="1.5" />
    </svg>
  )
}

function IconCarousel({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect x="4" y="2" width="8" height="12" rx="0.5" stroke="currentColor" strokeWidth="1.5" />
      <path d="M1 5v6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M15 5v6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  )
}

function IconCascade({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect x="1" y="1" width="8" height="6" rx="0.5" stroke="currentColor" strokeWidth="1.5" />
      <rect x="4" y="4" width="8" height="6" rx="0.5" stroke="currentColor" strokeWidth="1.5" fill="#0a0a0a" />
      <rect x="7" y="7" width="8" height="6" rx="0.5" stroke="currentColor" strokeWidth="1.5" fill="#0a0a0a" />
    </svg>
  )
}

function IconReset({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M2 8a6 6 0 1 1 1.5 4"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      <path
        d="M2 12V8h4"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

const modes: { mode: ViewMode; icon: typeof IconFree; labelKey: keyof ViewModeControlsProps['labels'] }[] = [
  { mode: 'cascade', icon: IconCascade, labelKey: 'cascade' },
  { mode: 'grid', icon: IconGrid, labelKey: 'grid' },
  { mode: 'free', icon: IconFree, labelKey: 'free' },
  { mode: 'list', icon: IconList, labelKey: 'list' },
  { mode: 'carousel', icon: IconCarousel, labelKey: 'carousel' }
]

export default function ViewModeControls({
  currentMode,
  onModeChange,
  onResetWindows,
  labels
}: ViewModeControlsProps) {
  return (
    <div className="flex items-center gap-1 bg-neutral-800/80 backdrop-blur-sm border border-primary/20 rounded-base p-1">
      {modes.map(({ mode, icon: Icon, labelKey }) => (
        <button
          key={mode}
          onClick={() => onModeChange(mode)}
          className={`
            p-2 rounded transition-colors
            ${currentMode === mode
              ? 'bg-primary/20 text-primary'
              : 'text-secondary/60 hover:text-secondary hover:bg-neutral-700/50'
            }
            focus:outline-none focus-visible:ring-2 focus-visible:ring-primary
          `}
          title={labels[labelKey]}
          aria-label={labels[labelKey]}
          aria-pressed={currentMode === mode}
        >
          <Icon className="w-4 h-4" />
        </button>
      ))}

      <div className="w-px h-4 bg-primary/20 mx-1" />

      <button
        onClick={onResetWindows}
        className="p-2 rounded text-secondary/60 hover:text-secondary hover:bg-neutral-700/50 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
        title="Reset windows"
        aria-label="Reset all windows"
      >
        <IconReset className="w-4 h-4" />
      </button>
    </div>
  )
}
