import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { ProjectPageShell } from '@/components/sections/v2/project/ProjectPageShell'
import { SITE_URL, type Locale } from '@/lib/i18n'
import { contentFor, pageMetadata } from '@/lib/seo'

/**
 * The project route, shared by `(en)/projects/[slug]` and
 * `pt/projects/[slug]`. English is the list of record for which slugs exist.
 */
type Params = Promise<{ slug: string }>

export function projectStaticParams() {
  return contentFor('en')
    .projects.items.filter((p) => !p.disabled)
    .map((p) => ({ slug: p.slug }))
}

export async function projectMetadata(locale: Locale, params: Params): Promise<Metadata> {
  const { slug } = await params
  const project = contentFor(locale).projects.items.find((p) => p.slug === slug)
  if (!project) return {}

  // A local video can't be an OG image; its poster can.
  const firstImage = project.images
    .map((img) => (img.type === 'video' ? { ...img, src: img.poster ?? '' } : img))
    .find((img) => img.src)

  return pageMetadata({
    locale,
    path: `/projects/${slug}`,
    title: `${project.title} - Caio Ogata`,
    description: project.description.slice(0, 160),
    image: firstImage?.src
      ? { url: `${SITE_URL}${firstImage.src}`, width: 1200, height: 630 }
      : undefined,
    type: 'article',
  })
}

export async function ProjectRoute({ locale, params }: { locale: Locale; params: Params }) {
  const { slug } = await params
  const project = contentFor(locale).projects.items.find((p) => p.slug === slug)
  if (!project || project.disabled) notFound()

  return (
    <main id="main-content">
      <ProjectPageShell project={project} />
    </main>
  )
}
