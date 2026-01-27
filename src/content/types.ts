export interface Achievement {
  text: string
}

export interface Job {
  company: string
  title: string
  location: string
  dateRange: string
  description: string
  achievements: Achievement[]
}

export interface SkillCategory {
  title: string
  skills: string[]
}

export interface EducationItem {
  degree: string
  institution: string
  location: string
  year: string
  note?: string
}

export interface ContactLink {
  label: string
  url: string
}

export interface Content {
  hero: {
    name: string
    tagline: string
    summary: string
    location: string
    cta: {
      copy: string
      copying: string
      copyAriaLabel: string
      linkedin: string
    }
  }
  about: {
    command: string
    heading: string
    bio: string
    expertise: string[]
  }
  experience: {
    command: string
    heading: string
    jobs: Job[]
  }
  skills: {
    command: string
    heading: string
    categories: SkillCategory[]
  }
  education: {
    command: string
    heading: string
    items: EducationItem[]
    additional: string[]
  }
  clients: {
    command: string
    heading: string
    description: string
    brazilian: string[]
    international: string[]
    other: string[]
  }
  philosophy: {
    command: string
    heading: string
    title: string
    body: string
  }
  contact: {
    command: string
    heading: string
    description: string
    links: ContactLink[]
  }
  footer: {
    copyright: string
    tagline: string
    tech: string
  }
  notifications: {
    copySuccess: string
    copyError: string
  }
}

export type Language = 'en' | 'pt-br'
