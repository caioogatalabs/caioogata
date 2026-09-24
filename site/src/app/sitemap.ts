import { MetadataRoute } from 'next'
import content from '@/content/en.json'
import { SITE_URL as SITE } from '@/lib/i18n'
import { absoluteUrl, languageAlternates } from '@/lib/seo'

/**
 * Every page a crawler should know about, in both languages, plus the
 * machine-readable profile. Each page entry carries both language URLs as
 * alternates, which is the sitemap form of hreflang.
 * The pages come first and the project pages are read from the content, so a
 * new case study lands in the sitemap by being added to `en.json` rather than
 * here. `/dev/*` is a scratch route and stays out, as does the archived V1 at
 * v1.caioogata.com, which answers `noindex` and disallows crawlers.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const today = new Date()
  const projects = content.projects.items.filter(p => !p.disabled)

  const paths: { path: string; priority: number }[] = [
    { path: '/', priority: 1.0 },
    { path: '/projects', priority: 0.9 },
    { path: '/about', priority: 0.8 },
    { path: '/experience', priority: 0.8 },
    { path: '/philosophy', priority: 0.6 },
    ...projects.map(p => ({ path: `/projects/${p.slug}`, priority: 0.7 })),
  ]

  const pages: MetadataRoute.Sitemap = paths.flatMap(({ path, priority }) =>
    (['en', 'pt-br'] as const).map(language => ({
      url: absoluteUrl(path, language),
      priority,
      alternates: { languages: languageAlternates(path) },
      lastModified: today,
      changeFrequency: 'monthly' as const,
    }))
  )

  const machineReadable: MetadataRoute.Sitemap = [
    { url: `${SITE}/llms.txt`, priority: 0.8 },
    { url: `${SITE}/llms-full.txt`, priority: 0.8 },
    { url: `${SITE}/llms-pt.txt`, priority: 0.6 },
    // Each case study exists in both languages; `caseStudyUrl` only names the
    // English one, so the PT file is derived rather than listed by hand.
    ...projects
      .filter(p => p.caseStudyUrl)
      .flatMap(p => [
        { url: `${SITE}${p.caseStudyUrl}`, priority: 0.7 },
        { url: `${SITE}${p.caseStudyUrl!.replace(/\.txt$/, '-pt.txt')}`, priority: 0.5 },
      ]),
  ].map(entry => ({ ...entry, lastModified: today, changeFrequency: 'monthly' as const }))

  return [...pages, ...machineReadable]
}
