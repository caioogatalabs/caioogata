import { MetadataRoute } from 'next'

export default function sitemap(): MetadataRoute.Sitemap {
  const today = new Date()

  return [
    {
      url: 'https://www.caioogata.com',
      lastModified: today,
      changeFrequency: 'monthly',
      priority: 1.0,
    },
    {
      url: 'https://www.caioogata.com/llms.txt',
      lastModified: today,
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: 'https://www.caioogata.com/llms-full.txt',
      lastModified: today,
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: 'https://www.caioogata.com/llms-pt.txt',
      lastModified: today,
      changeFrequency: 'monthly',
      priority: 0.6,
    },
    {
      url: 'https://www.caioogata.com/llms/projects/azion-brand-system.txt',
      lastModified: today,
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: 'https://www.caioogata.com/llms/projects/azion-console-kit.txt',
      lastModified: today,
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: 'https://www.caioogata.com/llms/projects/huia.txt',
      lastModified: today,
      changeFrequency: 'monthly',
      priority: 0.7,
    },
  ]
}
