interface SectionHeadingProps {
  command: string
  children: React.ReactNode
  id?: string
  level?: 'h2' | 'h3'
}

export default function SectionHeading({
  command,
  children,
  id,
  level = 'h2'
}: SectionHeadingProps) {
  const Tag = level

  return (
    <Tag
      id={id}
      className="text-xl font-bold mb-6"
    >
      <span
        className="text-primary mr-2"
        aria-hidden="true"
      >
        $ {command}
      </span>
      <span className="text-secondary">{children}</span>
    </Tag>
  )
}
