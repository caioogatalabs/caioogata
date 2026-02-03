import ArrowRightIcon from '@/components/ui/ArrowRightIcon'

interface SectionHeadingProps {
  children: React.ReactNode
  id?: string
  level?: 'h2' | 'h3'
}

export default function SectionHeading({
  children,
  id,
  level = 'h2'
}: SectionHeadingProps) {
  const Tag = level

  return (
    <div className="flex items-center gap-2 mb-6">
      <span className="w-4 shrink-0 flex items-center justify-center text-primary" aria-hidden>
        <ArrowRightIcon />
      </span>
      <Tag id={id} className="text-base font-bold text-primary font-mono">
        {children}
      </Tag>
    </div>
  )
}
