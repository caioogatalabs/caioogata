import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import content from '@/content/en.json'
import type { Content } from '@/content/types'
import { ProjectPageShell } from '@/components/sections/v2/project/ProjectPageShell'

const typedContent = content as unknown as Content

export function generateStaticParams() {
  return typedContent.projects.items
    .filter((p) => !p.disabled)
    .map((p) => ({ slug: p.slug }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const project = typedContent.projects.items.find((p) => p.slug === slug)
  if (!project) return {}

  const firstImage = project.images.find((img) => img.src)
  return {
    title: `${project.title} - Caio Ogata`,
    description: project.description.slice(0, 160),
    openGraph: {
      title: `${project.title} - Caio Ogata`,
      description: project.description.slice(0, 160),
      images: firstImage?.src
        ? [{ url: `https://www.caioogata.com${firstImage.src}`, width: 1200, height: 630 }]
        : [],
      type: 'article',
    },
    twitter: {
      card: 'summary_large_image',
      title: `${project.title} - Caio Ogata`,
      images: firstImage?.src ? [`https://www.caioogata.com${firstImage.src}`] : [],
    },
  }
}

export default async function ProjectPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const project = typedContent.projects.items.find((p) => p.slug === slug)
  if (!project || project.disabled) notFound()

  return (
    <main id="main-content">
      <ProjectPageShell project={project} />
    </main>
  )
}
