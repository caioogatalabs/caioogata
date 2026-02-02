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

export interface ProjectImage {
  src: string
  title: string
}

export interface ProjectItem {
  title: string
  slug: string
  description: string
  images: ProjectImage[]
}

export interface MenuItem {
  key: string
  label: string
  description?: string
}

export interface NavigationModeLabels {
  back: string
  navigate: string
  select: string
}

export interface NavigationLabels {
  // Aria labels for buttons
  arrowUp: string
  arrowDown: string
  // Labels by interaction mode
  keyboard: NavigationModeLabels
  mouse: NavigationModeLabels
  touch: NavigationModeLabels
}

export interface InputHintLabels {
  keyboard: string
  mouse: string
  touch: string
}

export interface Menu {
  command: string
  legend: string
  inputHint: InputHintLabels
  navigation: NavigationLabels
  items: MenuItem[]
}

export interface QuickFact {
  label: string
  value: string
}

export interface LookingForItem {
  text: string
}

export interface Content {
  menu: Menu
  hero: {
    name: string
    welcomeTitle: string
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
  lifestyle: {
    heading: string
    body: string
  }
  quickFacts: {
    heading: string
    facts: QuickFact[]
  }
  lookingFor: {
    heading: string
    description: string
    idealRole: LookingForItem[]
    focusAreas: string
  }
  contact: {
    command: string
    heading: string
    description: string
    email: string
    links: ContactLink[]
  }
  footer: {
    copyright: string
    tagline: string
    tech: string
    poweredByPrefix: string
    poweredByTailwindLabel: string
    poweredBySuffix: string
  }
  intro: {
    tips: string
  }
  projects: {
    command: string
    heading: string
    viewModes: {
      free: string
      grid: string
      list: string
      carousel: string
    }
    items: ProjectItem[]
  }
  notifications: {
    copySuccess: string
    copyError: string
  }
}

export type Language = 'en' | 'pt-br'
