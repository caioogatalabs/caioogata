import enContent from '@/content/en.json'
import ptContent from '@/content/pt-br.json'
import type { Content, Language, Job, SkillCategory, EducationItem, QuickFact, LookingForItem } from '@/content/types'

export function generateMarkdown(language: Language = 'en'): string {
  const content = (language === 'en' ? enContent : ptContent) as Content
  const today = new Date().toISOString().split('T')[0]
  const isEnglish = language === 'en'

  const sections = [
    generateFrontmatter(content, today),
    '',
    `# ${content.hero.name}`,
    `## ${content.hero.tagline}`,
    '',
    `**${isEnglish ? 'Location' : 'Localização'}:** Porto Alegre, Brazil`,
    `**${isEnglish ? 'Experience' : 'Experiência'}:** 20+ ${isEnglish ? 'years in Art Direction, 15 in User Interface design' : 'anos em Direção de Arte, 15 em design de Interface de Usuário'}`,
    `**LinkedIn:** [linkedin.com/in/caioogata](https://www.linkedin.com/in/caioogata/)`,
    `**${isEnglish ? 'Languages' : 'Idiomas'}:** ${isEnglish ? 'Portuguese (native), English (fluent - worked with Silicon Valley team)' : 'Português (nativo), Inglês (fluente - trabalhou com time do Silicon Valley)'}`,
    '',
    '---',
    '',
    `## ${isEnglish ? 'Professional Summary' : 'Resumo Profissional'}`,
    '',
    content.hero.summary,
    '',
    content.about.bio,
    '',
    `### ${isEnglish ? 'Core Expertise' : 'Principais Competências'}`,
    ...content.about.expertise.map(item => `- ${item}`),
    '',
    '---',
    '',
    `## ${content.experience.heading}`,
    '',
    ...generateExperienceMarkdown(content.experience.jobs, isEnglish),
    '---',
    '',
    `## ${isEnglish ? 'Skills & Competencies' : 'Habilidades & Competências'}`,
    '',
    ...generateSkillsMarkdown(content.skills.categories),
    '---',
    '',
    `## ${content.education.heading}`,
    '',
    ...generateEducationMarkdown(content.education.items, content.education.additional, isEnglish),
    '---',
    '',
    `## ${content.clients.heading}`,
    '',
    content.clients.description,
    '',
    `**${isEnglish ? 'Brazilian Brands' : 'Marcas Brasileiras'}:**`,
    ...content.clients.brazilian.map(client => `- ${client}`),
    '',
    `**${isEnglish ? 'International Brands (via Mondelez)' : 'Marcas Internacionais (via Mondelez)'}:**`,
    `- ${content.clients.international.join(', ')}`,
    '',
    `**${isEnglish ? 'Other' : 'Outras'}:**`,
    `- ${content.clients.other.join(', ')}`,
    '',
    '---',
    '',
    `## ${isEnglish ? 'Design Philosophy' : 'Filosofia de Design'}`,
    '',
    content.philosophy.body,
    '',
    '---',
    '',
    `## ${content.lifestyle.heading}`,
    '',
    content.lifestyle.body,
    '',
    `**${content.quickFacts.heading}:**`,
    ...generateQuickFactsMarkdown(content.quickFacts.facts),
    '',
    '---',
    '',
    `## ${content.lookingFor.heading}`,
    '',
    content.lookingFor.description,
    '',
    `**${isEnglish ? 'Ideal role characteristics' : 'Características da função ideal'}:**`,
    ...generateLookingForMarkdown(content.lookingFor.idealRole),
    '',
    `**${content.lookingFor.focusAreas}**`,
    '',
    '---',
    '',
    `## ${isEnglish ? 'Contact' : 'Contato'}`,
    '',
    ...content.contact.links.map(link => `**${link.label}:** [${link.url}](${link.url})`),
    `**Portfolio:** [https://www.caioogata.com](https://www.caioogata.com)`,
    `**Azion Design System:** [https://www.azion.design](https://www.azion.design)`,
    '',
    '---',
    '',
    generateFooterNote(isEnglish, today),
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

function generateExperienceMarkdown(jobs: Job[], isEnglish: boolean): string[] {
  const lines: string[] = []

  jobs.forEach((job, index) => {
    lines.push(`### ${job.title} ${isEnglish ? 'at' : 'na'} ${job.company}`)
    lines.push(`**${job.dateRange} | ${job.location}**`)
    lines.push('')
    lines.push(job.description)
    lines.push('')

    if (job.achievements && job.achievements.length > 0) {
      lines.push(`**${isEnglish ? 'Key Achievements' : 'Principais Conquistas'}:**`)
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

function generateEducationMarkdown(items: EducationItem[], additional: string[], isEnglish: boolean): string[] {
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
    lines.push(`**${isEnglish ? 'Additional Training' : 'Formação Adicional'}:**`)
    additional.forEach((item) => {
      lines.push(`- ${item}`)
    })
    lines.push('')
  }

  return lines
}

function generateQuickFactsMarkdown(facts: QuickFact[]): string[] {
  return facts.map(fact => `- ${fact.label}: ${fact.value}`)
}

function generateLookingForMarkdown(items: LookingForItem[]): string[] {
  return items.map(item => `- ${item.text}`)
}

function generateFooterNote(isEnglish: boolean, today: string): string {
  if (isEnglish) {
    return `*This portfolio is optimized for both human readers and AI assistants. Feel free to copy this entire document into your preferred AI tool (ChatGPT, Claude, etc.) for career assistance, interview preparation, application drafting, or job matching. The structured format helps LLMs understand context and provide better analysis.*

*Last updated: ${today}*`
  }

  return `*Este portfólio é otimizado tanto para leitores humanos quanto para assistentes de IA. Sinta-se à vontade para copiar este documento inteiro para sua ferramenta de IA preferida (ChatGPT, Claude, etc.) para assistência de carreira, preparação de entrevistas, redação de candidaturas ou matching de vagas. O formato estruturado ajuda LLMs a entender o contexto e fornecer análises melhores.*

*Última atualização: ${today}*`
}
