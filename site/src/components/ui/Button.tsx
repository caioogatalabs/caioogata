import { clsx } from 'clsx'

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary'
  children: React.ReactNode
}

export default function Button({
  variant = 'primary',
  children,
  className,
  ...props
}: ButtonProps) {
  return (
    <button
      className={clsx(
        'inline-flex items-center justify-center',
        'px-6 py-3 font-mono text-base rounded-base',
        'border-2 transition-colors duration-200',
        'focus:outline-none',
        'disabled:opacity-50 disabled:cursor-not-allowed',
        variant === 'primary' && [
          'bg-primary text-neutral-950 border-primary',
          'hover:bg-accent hover:border-accent',
          'focus-visible:bg-accent focus-visible:border-accent',
        ],
        variant === 'secondary' && [
          'bg-transparent text-neutral-200 border-neutral-teal',
          'hover:bg-neutral-teal hover:text-neutral-950',
          'focus-visible:bg-neutral-teal focus-visible:text-neutral-950',
        ],
        className
      )}
      {...props}
    >
      {children}
    </button>
  )
}
