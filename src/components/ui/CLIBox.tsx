interface CLIBoxProps {
  children: React.ReactNode
  className?: string
  title?: string
}

export default function CLIBox({ children, className = '', title }: CLIBoxProps) {
  return (
    <div
      className={`border-2 border-primary/30 rounded-base p-4 ${className}`}
    >
      {title && (
        <div className="mb-3 pb-2 border-b border-primary/20">
          <span className="text-primary font-mono text-sm">{title}</span>
        </div>
      )}
      {children}
    </div>
  )
}
