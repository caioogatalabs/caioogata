import enContent from '@/content/en.json'
import ptContent from '@/content/pt-br.json'
import type { Content, Language, Job, SkillCategory, EducationItem } from '@/content/types'

export function generateMarkdown(language: Language = 'en'): string {
  const content = (language === 'en' ? enContent : ptContent) as Content
  const today = new Date().toISOString().split('T')[0]

  const sections = [
    generateFrontmatter(content, today),
    '',
    `# ${content.hero.name}`,
    `## ${content.hero.tagline}`,
    '',
    `**Location:** ${content.hero.location.split('|')[0].trim()}`,
    `**Experience:** 20+ years in Art Direction, 15 in User Interface design`,
    `**LinkedIn:** [linkedin.com/in/caioogata](https://www.linkedin.com/in/caioogata/)`,
    `**Languages:** Portuguese (native), English (fluent)`,
    '',
    '---',
    '',
    `## ${content.about.heading}`,
    '',
    content.about.bio,
    '',
    '### Core Expertise',
    ...content.about.expertise.map(item => `- ${item}`),
    '',
    '---',
    '',
    `## ${content.experience.heading}`,
    '',
    ...generateExperienceMarkdown(content.experience.jobs),
    '---',
    '',
    `## ${content.skills.heading}`,
    '',
    ...generateSkillsMarkdown(content.skills.categories),
    '---',
    '',
    `## ${content.education.heading}`,
    '',
    ...generateEducationMarkdown(content.education.items, content.education.additional),
    '---',
    '',
    `## ${content.clients.heading}`,
    '',
    content.clients.description,
    '',
    '**Brazilian Brands:**',
    ...content.clients.brazilian.map(client => `- ${client}`),
    '',
    '**International Brands (via Mondelez):**',
    ...content.clients.international.map(client => `- ${client}`),
    '',
    '---',
    '',
    `## ${content.philosophy.heading}`,
    '',
    `### ${content.philosophy.title}`,
    '',
    content.philosophy.body,
    '',
    '---',
    '',
    `## ${content.contact.heading}`,
    '',
    content.contact.description,
    '',
    ...content.contact.links.map(link => `**${link.label}:** [${link.url}](${link.url})`),
    '',
    '---',
    '',
    '*This portfolio is optimized for both human readers and AI assistants. Feel free to copy this entire document into your preferred AI tool (ChatGPT, Claude, etc.) for career assistance, interview preparation, application drafting, or job matching.*',
    '',
    `*Last updated: ${today}*`,
  ]

  return sections.join('\n')
}

function generateFrontmatter(content: Content, today: string): string {
  return `---
type: professional_portfolio
name: ${content.hero.name}
current_title: Design Director
location: Porto Alegre, Brazil
years_experience: 20+
languages: Portuguese (native), English (fluent)
linkedin: https://www.linkedin.com/in/caioogata/
github: https://github.com/caioogatalabs
portfolio: https://www.caioogata.com
last_updated: ${today}
optimized_for: Claude, ChatGPT, LLMs
---`
}

function generateExperienceMarkdown(jobs: Job[]): string[] {
  const lines: string[] = []

  jobs.forEach((job) => {
    lines.push(`### ${job.title} at ${job.company}`)
    lines.push(`**${job.dateRange} | ${job.location}**`)
    lines.push('')
    lines.push(job.description)
    lines.push('')

    if (job.achievements && job.achievements.length > 0) {
      lines.push('**Key Achievements:**')
      job.achievements.forEach((achievement) => {
        lines.push(`- ${achievement.text}`)
      })
      lines.push('')
    }
  })

  return lines
}

function generateSkillsMarkdown(categories: SkillCategory[]): string[] {
  const lines: string[] = []

  categories.forEach((category) => {
    lines.push(`### ${category.title}`)
    lines.push(category.skills.join(', '))
    lines.push('')
  })

  return lines
}

function generateEducationMarkdown(items: EducationItem[], additional: string[]): string[] {
  const lines: string[] = []

  items.forEach((edu) => {
    lines.push(`**${edu.degree}**`)
    lines.push(`${edu.institution}`)
    lines.push(`${edu.location} | ${edu.year}`)
    if (edu.note) {
      lines.push(edu.note)
    }
    lines.push('')
  })

  if (additional.length > 0) {
    lines.push('**Additional Training:**')
    additional.forEach((item) => {
      lines.push(`- ${item}`)
    })
    lines.push('')
  }

  return lines
}
