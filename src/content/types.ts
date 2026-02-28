export interface Achievement {
  text: string
}

export interface Job {
  company: string
  title: string
  location: string
  dateRange: string
  description?: string
  achievements?: Achievement[]
}

export interface Skill {
  name: string
  level: string
}

export interface SkillCategory {
  title: string
  skills: Skill[]
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

export interface ContactFormValidation {
  nameRequired: string
  emailRequired: string
  emailInvalid: string
  messageRequired: string
}

export interface ContactFormSubjectOptions {
  job: string
  freelance: string
  feedback: string
  other: string
}

export interface ContactForm {
  nameLabel: string
  namePlaceholder: string
  emailLabel: string
  emailPlaceholder: string
  subjectLabel: string
  subjectPlaceholder: string
  subjectOptions: ContactFormSubjectOptions
  messageLabel: string
  messagePlaceholder: string
  submitButton: string
  submitting: string
  validation: ContactFormValidation
  success: string
  successDetail: string
  error: string
  errorRetry: string
}

export interface ContactLog {
  idleMessages: string[]
  waitingMessage: string
}

export interface ProjectImage {
  src: string
  title: string
  type?: 'image' | 'video'
  platform?: 'youtube' | 'vimeo'
  videoId?: string
}

export interface ProjectCredit {
  name: string
  role?: string
  url?: string
}

export interface ProjectDownload {
  label: string
  url: string
}

export interface ProjectItem {
  title: string
  slug: string
  description: string
  role?: string
  technologies?: string
  impact?: string
  caseStudyUrl?: string
  credits?: ProjectCredit[]
  downloads?: ProjectDownload[]
  images: ProjectImage[]
  disabled?: boolean
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

export interface WorkingStyleTrait {
  label: string
  description: string
}

export interface WorkingStyleSection {
  heading: string
  traits: WorkingStyleTrait[]
}

export interface CollaborationContextSection {
  heading: string
  description: string
  contexts: string[]
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
    additionalHeading: string
    additional: EducationItem[]
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
  workingStyle?: WorkingStyleSection
  collaborationContext?: CollaborationContextSection
  contact: {
    command: string
    heading: string
    description: string
    email: string
    links: ContactLink[]
    form: ContactForm
    log: ContactLog
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
  firstVisit: {
    optionMeetAI: string
    optionMeetAIDescription: string
    optionLoadWebsite: string
    optionLoadWebsiteDescription: string
  }
  projects: {
    command: string
    heading: string
    viewModes: {
      grid: string
      free: string
      showcase: string
    }
    items: ProjectItem[]
  }
  notifications: {
    copySuccess: string
    copyError: string
  }
}

export type Language = 'en' | 'pt-br'
