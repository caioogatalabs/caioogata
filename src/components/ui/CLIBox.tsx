import { clsx } from 'clsx'

interface CLIBoxProps {
  children: React.ReactNode
  className?: string
  title?: string
  isSelected?: boolean
}

export default function CLIBox({ children, className = '', title, isSelected }: CLIBoxProps) {
  return (
    <div
      className={clsx(
        'border-2 rounded-base p-4 transition-colors duration-150',
        isSelected ? 'border-primary bg-primary/5' : 'border-primary/30',
        className
      )}
    >
      {isSelected && (
        <div className="mb-2">
          <span className="text-primary font-mono text-xs">&gt; selected</span>
        </div>
      )}
      {title && (
        <div className="mb-3 pb-2 border-b border-primary/20">
          <span className="text-primary font-mono text-sm">{title}</span>
        </div>
      )}
      {children}
    </div>
  )
}
