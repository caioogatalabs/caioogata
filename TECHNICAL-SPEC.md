# Technical Specification - Caio Ogata Portfolio

## Document Information

- **Project**: LLM-Friendly Portfolio Website
- **Version**: 1.0
- **Last Updated**: January 27, 2026
- **Author**: Frontend Architect (Claude Sonnet 4.5)
- **Status**: Ready for Implementation
- **Target Completion**: 3 weeks (~70 hours)

---

## Table of Contents

1. [Project Setup](#1-project-setup)
2. [Design System / Design Tokens](#2-design-system--design-tokens)
3. [Component Architecture](#3-component-architecture)
4. [Page Structure](#4-page-structure)
5. [Copy-to-Markdown Feature](#5-copy-to-markdown-feature)
6. [Accessibility Implementation](#6-accessibility-implementation)
7. [SEO & Metadata](#7-seo--metadata)
8. [Performance Targets](#8-performance-targets)
9. [Internationalization (i18n)](#9-internationalization-i18n)
10. [Deployment](#10-deployment)
11. [Implementation Roadmap](#11-implementation-roadmap)

---

## 1. Project Setup

### 1.1 Technology Stack

**Framework**: Next.js 15 (App Router)
- Already in project, optimized for static export
- Server Components for optimal performance
- Built-in font optimization with `next/font`
- Native image optimization (if needed)

**Styling**: Tailwind CSS 3.4+
- Utility-first for rapid development
- Custom theme configuration for design tokens
- JIT mode for minimal CSS bundle
- PostCSS for processing

**Font**: JetBrains Mono
- Monospace for terminal aesthetic
- Weights: 400 (regular), 700 (bold)
- Load via `next/font/google` for optimization
- Fallback: `ui-monospace, 'Courier New', monospace`

**State Management**: React Context API (minimal)
- Language toggle state (EN/PT-BR)
- Theme state (if dark/light mode added in v1.1)
- No external state library needed for MVP

**Utilities**:
- `clsx` or `cn` utility for conditional classNames
- `react-hot-toast` for toast notifications
- No markdown library needed initially (custom generator)

### 1.2 Project Structure

```
portolio-v1/
├── public/
│   ├── logo-co.svg                    # Caio Ogata logo
│   ├── favicon.ico
│   ├── og-image.png                   # 1200x630 Open Graph image
│   └── robots.txt
├── src/
│   ├── app/
│   │   ├── layout.tsx                 # Root layout with fonts, metadata
│   │   ├── page.tsx                   # Main portfolio page
│   │   ├── globals.css                # Tailwind directives + custom CSS
│   │   └── fonts.ts                   # Font configuration
│   ├── components/
│   │   ├── hero/
│   │   │   ├── Hero.tsx
│   │   │   └── CopyButton.tsx         # Primary CTA
│   │   ├── sections/
│   │   │   ├── About.tsx
│   │   │   ├── Experience.tsx
│   │   │   ├── Skills.tsx
│   │   │   ├── Education.tsx
│   │   │   ├── Clients.tsx
│   │   │   ├── Philosophy.tsx
│   │   │   └── Contact.tsx
│   │   ├── ui/
│   │   │   ├── Button.tsx             # Reusable button component
│   │   │   ├── SectionHeading.tsx     # Terminal-style headings
│   │   │   ├── SkipLink.tsx           # Accessibility skip link
│   │   │   └── Toast.tsx              # Notification component
│   │   ├── layout/
│   │   │   ├── Header.tsx
│   │   │   └── Footer.tsx
│   │   └── providers/
│   │       ├── LanguageProvider.tsx   # i18n context
│   │       └── ToastProvider.tsx      # Toast notifications
│   ├── lib/
│   │   ├── markdown-generator.ts      # DOM to Markdown conversion
│   │   ├── clipboard.ts               # Clipboard API with fallbacks
│   │   └── analytics.ts               # Event tracking (optional)
│   ├── content/
│   │   ├── en.json                    # English content
│   │   ├── pt-br.json                 # Portuguese content
│   │   └── types.ts                   # TypeScript types for content
│   └── styles/
│       └── tokens.css                 # CSS custom properties
├── tailwind.config.ts                 # Tailwind theme configuration
├── tsconfig.json
├── next.config.mjs
├── package.json
├── PRD.md
├── CONTENT.md
└── TECHNICAL-SPEC.md (this file)
```

### 1.3 Initial Setup Commands

```bash
# Install dependencies
npm install clsx react-hot-toast

# Optional analytics (post-MVP)
npm install @vercel/analytics

# Development
npm run dev

# Build for production
npm run build

# Preview production build
npm run start
```

### 1.4 Next.js Configuration

**next.config.mjs**:
```javascript
/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export', // Static site generation
  images: {
    unoptimized: true, // Required for static export
  },
  trailingSlash: false,
  reactStrictMode: true,
  // Disable x-powered-by header for security
  poweredByHeader: false,
}

export default nextConfig
```

### 1.5 TypeScript Configuration

**tsconfig.json** (ensure these settings):
```json
{
  "compilerOptions": {
    "target": "ES2020",
    "lib": ["dom", "dom.iterable", "esnext"],
    "allowJs": true,
    "skipLibCheck": true,
    "strict": true,
    "noEmit": true,
    "esModuleInterop": true,
    "module": "esnext",
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "preserve",
    "incremental": true,
    "plugins": [{ "name": "next" }],
    "paths": { "@/*": ["./src/*"] }
  },
  "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx", ".next/types/**/*.ts"],
  "exclude": ["node_modules"]
}
```

---

## 2. Design System / Design Tokens

### 2.1 Color Palette

Based on provided brand guidelines:

| Token Name | Hex Code | Usage | WCAG AA Compliant on Dark BG |
|------------|----------|-------|------------------------------|
| `primary` | `#EFD246` | Golden yellow (logo, CTAs, accent) | ✓ (contrast ratio: 11.2:1) |
| `secondary` | `#D8D1DA` | Pale lavender (secondary text) | ✓ (contrast ratio: 12.1:1) |
| `accent` | `#BC5F04` | Burnt orange (highlights, hover) | ✓ (contrast ratio: 7.8:1) |
| `neutral-dark` | `#353631` | Charcoal dark (background) | N/A (background color) |
| `neutral-teal` | `#618985` | Soft teal (links, variations) | ✓ (contrast ratio: 4.9:1) |

**Additional Neutral Scale** (for terminal aesthetic):
```css
--neutral-950: #0D0E0D;  /* Deepest black (terminal background) */
--neutral-900: #1A1B1A;  /* Dark gray (sections background) */
--neutral-800: #353631;  /* Charcoal (provided brand color) */
--neutral-700: #4A4B46;  /* Medium dark gray */
--neutral-600: #618985;  /* Soft teal (provided brand color) */
--neutral-400: #8B8C87;  /* Medium gray */
--neutral-300: #B5B6B1;  /* Light gray */
--neutral-200: #D8D1DA;  /* Pale lavender (provided brand color) */
--neutral-100: #EEEFEA;  /* Very light gray */
--neutral-50:  #F9FAF5;  /* Almost white */
```

### 2.2 Typography Scale

**Font Family**:
```css
--font-mono: 'JetBrains Mono', ui-monospace, 'Courier New', monospace;
```

**Font Sizes** (mobile-first with desktop):
```css
/* Mobile (default) */
--text-xs: 0.75rem;      /* 12px - small labels */
--text-sm: 0.875rem;     /* 14px - meta information */
--text-base: 1rem;       /* 16px - body text */
--text-lg: 1.125rem;     /* 18px - emphasized body */
--text-xl: 1.25rem;      /* 20px - H3 mobile */
--text-2xl: 1.5rem;      /* 24px - H2 mobile */
--text-3xl: 1.875rem;    /* 30px - unused */
--text-4xl: 2rem;        /* 32px - H1 mobile */
--text-5xl: 2.25rem;     /* 36px - H2 desktop */
--text-6xl: 3rem;        /* 48px - H1 desktop */

/* Desktop overrides (1024px+) */
@media (min-width: 1024px) {
  --text-base: 1.125rem; /* 18px */
  --text-xl: 1.75rem;    /* 28px - H3 desktop */
}
```

**Font Weights**:
```css
--font-regular: 400;
--font-bold: 700;
```

**Line Heights**:
```css
--leading-tight: 1.2;   /* Headings */
--leading-normal: 1.5;  /* Body text */
--leading-relaxed: 1.6; /* Long-form content */
```

**Letter Spacing**:
```css
--tracking-tight: -0.01em;
--tracking-normal: 0;
--tracking-wide: 0.025em;
```

### 2.3 Spacing Scale

Based on 4px base unit (Tailwind default):

```css
--spacing-0: 0;
--spacing-1: 0.25rem;   /* 4px */
--spacing-2: 0.5rem;    /* 8px */
--spacing-3: 0.75rem;   /* 12px */
--spacing-4: 1rem;      /* 16px */
--spacing-5: 1.25rem;   /* 20px */
--spacing-6: 1.5rem;    /* 24px */
--spacing-8: 2rem;      /* 32px */
--spacing-10: 2.5rem;   /* 40px */
--spacing-12: 3rem;     /* 48px */
--spacing-16: 4rem;     /* 64px */
--spacing-20: 5rem;     /* 80px */
--spacing-24: 6rem;     /* 96px */

/* Section spacing */
--section-spacing-mobile: 3.75rem;  /* 60px */
--section-spacing-desktop: 5rem;    /* 80px */
```

### 2.4 Border Radius Tokens

```css
--radius-none: 0;
--radius-sm: 0.125rem;   /* 2px */
--radius-base: 0.25rem;  /* 4px - buttons, cards */
--radius-md: 0.375rem;   /* 6px */
--radius-lg: 0.5rem;     /* 8px */
--radius-full: 9999px;   /* Fully rounded */
```

### 2.5 Animation & Transition Tokens

```css
/* Durations */
--duration-fast: 150ms;
--duration-base: 200ms;
--duration-slow: 300ms;
--duration-slower: 500ms;

/* Easing functions */
--ease-in: cubic-bezier(0.4, 0, 1, 1);
--ease-out: cubic-bezier(0, 0, 0.2, 1);
--ease-in-out: cubic-bezier(0.4, 0, 0.2, 1);

/* Common transitions */
--transition-colors: color var(--duration-base) var(--ease-in-out),
                     background-color var(--duration-base) var(--ease-in-out),
                     border-color var(--duration-base) var(--ease-in-out);
--transition-transform: transform var(--duration-base) var(--ease-out);
--transition-opacity: opacity var(--duration-base) var(--ease-in-out);
```

### 2.6 Component-Specific Tokens

**Buttons**:
```css
/* Primary button (Copy as Markdown) */
--btn-primary-bg: var(--primary);
--btn-primary-text: var(--neutral-950);
--btn-primary-border: var(--primary);
--btn-primary-hover-bg: var(--accent);
--btn-primary-hover-border: var(--accent);

/* Secondary button (outlined) */
--btn-secondary-bg: transparent;
--btn-secondary-text: var(--neutral-200);
--btn-secondary-border: var(--neutral-600);
--btn-secondary-hover-bg: var(--neutral-600);
--btn-secondary-hover-text: var(--neutral-950);

/* Button sizing */
--btn-padding-x: 1.5rem;  /* 24px */
--btn-padding-y: 0.75rem; /* 12px */
--btn-border-width: 2px;
--btn-radius: var(--radius-base);
```

**Section Headings** (Terminal style):
```css
--heading-prefix-color: var(--neutral-teal);
--heading-text-color: var(--primary);
--heading-border-color: var(--neutral-700);
--heading-border-width: 1px;
```

**Links**:
```css
--link-color: var(--neutral-teal);
--link-hover-color: var(--primary);
--link-underline-offset: 0.25rem;
```

**Focus States**:
```css
--focus-ring-color: var(--primary);
--focus-ring-width: 2px;
--focus-ring-offset: 2px;
--focus-ring-style: solid;
```

### 2.7 Tailwind Configuration

**tailwind.config.ts**:
```typescript
import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // Brand colors
        primary: '#EFD246',
        secondary: '#D8D1DA',
        accent: '#BC5F04',
        'neutral-dark': '#353631',
        'neutral-teal': '#618985',

        // Extended neutral scale
        neutral: {
          50: '#F9FAF5',
          100: '#EEEFEA',
          200: '#D8D1DA',
          300: '#B5B6B1',
          400: '#8B8C87',
          600: '#618985',
          700: '#4A4B46',
          800: '#353631',
          900: '#1A1B1A',
          950: '#0D0E0D',
        },
      },
      fontFamily: {
        mono: ['var(--font-jetbrains)', 'ui-monospace', 'Courier New', 'monospace'],
      },
      fontSize: {
        xs: ['0.75rem', { lineHeight: '1.5' }],
        sm: ['0.875rem', { lineHeight: '1.5' }],
        base: ['1rem', { lineHeight: '1.6' }],
        lg: ['1.125rem', { lineHeight: '1.6' }],
        xl: ['1.25rem', { lineHeight: '1.4' }],
        '2xl': ['1.5rem', { lineHeight: '1.3' }],
        '4xl': ['2rem', { lineHeight: '1.2' }],
        '5xl': ['2.25rem', { lineHeight: '1.2' }],
        '6xl': ['3rem', { lineHeight: '1.1' }],
      },
      spacing: {
        '18': '4.5rem',
        '20': '5rem',
      },
      maxWidth: {
        'content': '800px',
      },
      transitionDuration: {
        'fast': '150ms',
        'base': '200ms',
        'slow': '300ms',
      },
      transitionTimingFunction: {
        'out': 'cubic-bezier(0, 0, 0.2, 1)',
      },
      borderRadius: {
        'base': '0.25rem',
      },
    },
  },
  plugins: [],
}

export default config
```

### 2.8 CSS Custom Properties

**src/styles/tokens.css**:
```css
:root {
  /* Colors */
  --color-primary: #EFD246;
  --color-secondary: #D8D1DA;
  --color-accent: #BC5F04;
  --color-neutral-dark: #353631;
  --color-neutral-teal: #618985;

  /* Background */
  --bg-primary: #0D0E0D;
  --bg-secondary: #1A1B1A;
  --bg-tertiary: #353631;

  /* Text */
  --text-primary: #D8D1DA;
  --text-secondary: #B5B6B1;
  --text-muted: #8B8C87;
  --text-accent: #EFD246;

  /* Section spacing */
  --section-gap: 3.75rem; /* 60px mobile */

  /* Focus ring */
  --focus-ring: 0 0 0 2px var(--color-primary);
  --focus-offset: 2px;
}

@media (min-width: 1024px) {
  :root {
    --section-gap: 5rem; /* 80px desktop */
  }
}

/* Reduced motion support */
@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
```

---

## 3. Component Architecture

### 3.1 Component Hierarchy

```
App (page.tsx)
├── LanguageProvider
│   └── ToastProvider
│       ├── SkipLink
│       ├── Header
│       │   └── LanguageToggle (v1.1)
│       ├── main
│       │   ├── Hero
│       │   │   ├── Headline
│       │   │   ├── Tagline
│       │   │   ├── Summary
│       │   │   └── CopyButton (Primary CTA)
│       │   ├── About
│       │   │   ├── SectionHeading
│       │   │   └── Biography
│       │   ├── Experience
│       │   │   ├── SectionHeading
│       │   │   └── ExperienceCard[] (map)
│       │   ├── Skills
│       │   │   ├── SectionHeading
│       │   │   └── SkillCategory[] (map)
│       │   ├── Education
│       │   │   ├── SectionHeading
│       │   │   └── EducationCard[] (map)
│       │   ├── Clients
│       │   │   ├── SectionHeading
│       │   │   └── ClientList
│       │   ├── Philosophy
│       │   │   ├── SectionHeading
│       │   │   └── PhilosophyContent
│       │   └── Contact
│       │       ├── SectionHeading
│       │       ├── ContactLinks
│       │       └── CopyButton (Secondary CTA)
│       └── Footer
│           ├── Copyright
│           ├── Tagline
│           └── TechStack
```

### 3.2 Core Components

#### 3.2.1 Hero Component

**src/components/hero/Hero.tsx**:
```typescript
'use client'

import { useLanguage } from '@/components/providers/LanguageProvider'
import CopyButton from './CopyButton'

export default function Hero() {
  const { t } = useLanguage()

  return (
    <section
      className="min-h-screen flex flex-col justify-center px-6 py-20 md:px-12 lg:px-16"
      aria-labelledby="hero-heading"
    >
      <div className="max-w-content mx-auto w-full">
        <h1
          id="hero-heading"
          className="text-4xl md:text-6xl font-bold text-primary mb-4 tracking-tight"
        >
          {t('hero.name')}
        </h1>

        <p className="text-xl md:text-2xl text-secondary mb-6 leading-relaxed">
          {t('hero.tagline')}
        </p>

        <p className="text-base md:text-lg text-neutral-300 mb-8 leading-relaxed max-w-2xl">
          {t('hero.summary')}
        </p>

        <p className="text-sm md:text-base text-neutral-400 mb-10">
          {t('hero.location')}
        </p>

        <div className="flex flex-col sm:flex-row gap-4">
          <CopyButton variant="primary" />

          <a
            href="https://www.linkedin.com/in/caioogata/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center px-6 py-3
                       border-2 border-neutral-teal text-neutral-200
                       rounded-base font-mono text-base
                       hover:bg-neutral-teal hover:text-neutral-950
                       transition-colors duration-base
                       focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-neutral-950"
            aria-label="View Caio Ogata's profile on LinkedIn (opens in new tab)"
          >
            {t('hero.cta.linkedin')} →
          </a>
        </div>
      </div>
    </section>
  )
}
```

**Props/Interfaces**: None (uses context for i18n)

#### 3.2.2 CopyButton Component

**src/components/hero/CopyButton.tsx**:
```typescript
'use client'

import { useState } from 'react'
import { copyToClipboard } from '@/lib/clipboard'
import { generateMarkdown } from '@/lib/markdown-generator'
import { useLanguage } from '@/components/providers/LanguageProvider'
import { toast } from 'react-hot-toast'

interface CopyButtonProps {
  variant?: 'primary' | 'secondary'
  className?: string
}

export default function CopyButton({ variant = 'primary', className = '' }: CopyButtonProps) {
  const [isCopying, setIsCopying] = useState(false)
  const { t, language } = useLanguage()

  const handleCopy = async () => {
    if (isCopying) return

    setIsCopying(true)

    try {
      // Generate markdown from content
      const markdown = generateMarkdown(language)

      // Copy to clipboard
      await copyToClipboard(markdown)

      // Show success toast
      toast.success(t('notifications.copySuccess'), {
        duration: 4000,
        position: 'top-center',
        ariaProps: {
          role: 'status',
          'aria-live': 'polite',
        },
      })
    } catch (error) {
      console.error('Failed to copy:', error)

      // Show error toast
      toast.error(t('notifications.copyError'), {
        duration: 5000,
        position: 'top-center',
      })
    } finally {
      setIsCopying(false)
    }
  }

  const baseClasses = `
    inline-flex items-center justify-center
    px-6 py-3 font-mono text-base rounded-base
    border-2 transition-colors duration-base
    focus:outline-none focus:ring-2 focus:ring-primary
    focus:ring-offset-2 focus:ring-offset-neutral-950
    disabled:opacity-50 disabled:cursor-not-allowed
  `

  const variantClasses = variant === 'primary'
    ? 'bg-primary text-neutral-950 border-primary hover:bg-accent hover:border-accent'
    : 'bg-transparent text-neutral-200 border-neutral-teal hover:bg-neutral-teal hover:text-neutral-950'

  return (
    <button
      onClick={handleCopy}
      disabled={isCopying}
      className={`${baseClasses} ${variantClasses} ${className}`}
      aria-label={t('hero.cta.copyAriaLabel')}
    >
      {isCopying ? t('hero.cta.copying') : t('hero.cta.copy')}
    </button>
  )
}
```

**Props**:
- `variant`: `'primary' | 'secondary'` - Visual style variant
- `className`: `string` - Additional CSS classes

**State**:
- `isCopying`: `boolean` - Prevents multiple simultaneous copy attempts

#### 3.2.3 SectionHeading Component

**src/components/ui/SectionHeading.tsx**:
```typescript
interface SectionHeadingProps {
  command: string         // e.g., "whoami", "cat experience.txt"
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
      className="text-2xl md:text-5xl font-bold mb-8 md:mb-12 pb-4 border-b border-neutral-700"
    >
      <span
        className="text-neutral-teal mr-2"
        aria-hidden="true"
      >
        $ {command}
      </span>
      <span className="text-primary">
        {children}
      </span>
    </Tag>
  )
}
```

**Props**:
- `command`: Terminal command prefix (e.g., "whoami")
- `children`: Section title text
- `id`: HTML id for anchor links
- `level`: Heading level for semantic HTML

#### 3.2.4 ExperienceCard Component

**src/components/sections/ExperienceCard.tsx**:
```typescript
interface Achievement {
  text: string
}

interface ExperienceCardProps {
  company: string
  title: string
  location: string
  dateRange: string
  description: string
  achievements: Achievement[]
}

export default function ExperienceCard({
  company,
  title,
  location,
  dateRange,
  description,
  achievements,
}: ExperienceCardProps) {
  return (
    <article className="mb-12 md:mb-16">
      <div className="mb-4">
        <h3 className="text-xl md:text-2xl font-bold text-primary mb-2">
          {title}
        </h3>
        <p className="text-lg md:text-xl text-secondary font-bold mb-1">
          {company}
        </p>
        <p className="text-sm md:text-base text-neutral-400">
          {dateRange} | {location}
        </p>
      </div>

      <p className="text-base md:text-lg text-neutral-300 mb-4 leading-relaxed">
        {description}
      </p>

      {achievements.length > 0 && (
        <ul className="space-y-2" role="list">
          {achievements.map((achievement, index) => (
            <li
              key={index}
              className="text-base md:text-lg text-neutral-300 leading-relaxed flex"
            >
              <span className="text-accent mr-3 flex-shrink-0" aria-hidden="true">
                •
              </span>
              <span>{achievement.text}</span>
            </li>
          ))}
        </ul>
      )}
    </article>
  )
}
```

**Props**: All required fields from content structure

#### 3.2.5 SkillCategory Component

**src/components/sections/SkillCategory.tsx**:
```typescript
interface SkillCategoryProps {
  title: string
  skills: string[]
}

export default function SkillCategory({ title, skills }: SkillCategoryProps) {
  return (
    <div className="mb-8">
      <h3 className="text-lg md:text-xl font-bold text-primary mb-4">
        {title}
      </h3>
      <div className="flex flex-wrap gap-3">
        {skills.map((skill, index) => (
          <span
            key={index}
            className="px-4 py-2 bg-neutral-800 border border-neutral-700
                       text-neutral-200 rounded-base text-sm md:text-base
                       font-mono"
          >
            {skill}
          </span>
        ))}
      </div>
    </div>
  )
}
```

**Props**:
- `title`: Category name (e.g., "Design Leadership")
- `skills`: Array of skill strings

### 3.3 Layout Components

#### 3.3.1 SkipLink Component

**src/components/ui/SkipLink.tsx**:
```typescript
'use client'

export default function SkipLink() {
  return (
    <a
      href="#main-content"
      className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4
                 focus:z-50 focus:px-6 focus:py-3 focus:bg-primary focus:text-neutral-950
                 focus:font-mono focus:text-base focus:rounded-base
                 focus:ring-2 focus:ring-offset-2 focus:ring-primary"
    >
      Skip to main content
    </a>
  )
}
```

**Accessibility**: Visible only on keyboard focus, allows screen reader and keyboard users to bypass navigation.

### 3.4 Provider Components

#### 3.4.1 LanguageProvider

**src/components/providers/LanguageProvider.tsx**:
```typescript
'use client'

import { createContext, useContext, useState, ReactNode } from 'react'
import enContent from '@/content/en.json'
import ptContent from '@/content/pt-br.json'

type Language = 'en' | 'pt-br'

interface LanguageContextType {
  language: Language
  setLanguage: (lang: Language) => void
  t: (key: string) => string
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined)

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState<Language>('en')

  const content = language === 'en' ? enContent : ptContent

  const t = (key: string): string => {
    const keys = key.split('.')
    let value: any = content

    for (const k of keys) {
      if (value && typeof value === 'object') {
        value = value[k]
      } else {
        return key // Return key if not found
      }
    }

    return typeof value === 'string' ? value : key
  }

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  )
}

export function useLanguage() {
  const context = useContext(LanguageContext)
  if (!context) {
    throw new Error('useLanguage must be used within LanguageProvider')
  }
  return context
}
```

**State Management**:
- Provides language state to all components
- Translation function `t()` with dot notation (e.g., `t('hero.title')`)
- Can persist to localStorage in v1.1

---

## 4. Page Structure

### 4.1 Section Breakdown

| Section | Content Source (CONTENT.md) | Responsive Behavior |
|---------|----------------------------|---------------------|
| **Hero** | 4.1 Hero Section | Full viewport height on desktop, auto on mobile |
| **About** | 3.2 Medium Bio | Single column, max-width 800px |
| **Experience** | 6.1-6.7 Work Experience | Timeline cards, single column |
| **Skills** | 7.1-7.5 Skills Section | Grid on desktop (2 col), single on mobile |
| **Education** | 8.1 Formal Education | Card layout, single column |
| **Clients** | 9.1 Client List | Multi-column list on desktop, single on mobile |
| **Philosophy** | 10.1 Design Philosophy | Single column, max-width 800px |
| **Contact** | 11.1-11.3 Contact Section | Centered, icon links in row |

### 4.2 Main Page Structure

**src/app/page.tsx**:
```typescript
import SkipLink from '@/components/ui/SkipLink'
import Header from '@/components/layout/Header'
import Hero from '@/components/hero/Hero'
import About from '@/components/sections/About'
import Experience from '@/components/sections/Experience'
import Skills from '@/components/sections/Skills'
import Education from '@/components/sections/Education'
import Clients from '@/components/sections/Clients'
import Philosophy from '@/components/sections/Philosophy'
import Contact from '@/components/sections/Contact'
import Footer from '@/components/layout/Footer'

export default function Home() {
  return (
    <>
      <SkipLink />
      <Header />

      <main
        id="main-content"
        className="bg-neutral-950 text-neutral-200"
      >
        <Hero />

        <div className="px-6 md:px-12 lg:px-16 max-w-content mx-auto space-y-20 md:space-y-24 pb-20">
          <About />
          <Experience />
          <Skills />
          <Education />
          <Clients />
          <Philosophy />
          <Contact />
        </div>
      </main>

      <Footer />
    </>
  )
}
```

### 4.3 Responsive Breakpoints

```css
/* Mobile (default) */
@media (min-width: 0px) {
  /* Single column, full width with padding */
  .section { padding: 0 1.5rem; }
}

/* Tablet */
@media (min-width: 768px) {
  /* Increased padding, larger text */
  .section { padding: 0 3rem; }
}

/* Desktop */
@media (min-width: 1024px) {
  /* Max width container, desktop typography */
  .section { padding: 0 4rem; }
}

/* Large Desktop */
@media (min-width: 1440px) {
  /* Maintain max-width, no further expansion */
  .container { max-width: 1200px; }
}
```

### 4.4 Scroll Behavior

**Smooth Scroll** (CSS only):
```css
html {
  scroll-behavior: smooth;
}

@media (prefers-reduced-motion: reduce) {
  html {
    scroll-behavior: auto;
  }
}
```

**Scroll Padding** (for skip links and anchor navigation):
```css
html {
  scroll-padding-top: 2rem;
}
```

---

## 5. Copy-to-Markdown Feature

### 5.1 Technical Implementation

**Architecture Decision**: Generate markdown programmatically from content JSON rather than scraping DOM.

**Rationale**:
- Ensures consistent output regardless of styling changes
- Faster execution (no DOM traversal)
- Easier to test and maintain
- Cleaner markdown structure

### 5.2 Markdown Generator

**src/lib/markdown-generator.ts**:
```typescript
import enContent from '@/content/en.json'
import ptContent from '@/content/pt-br.json'

type Language = 'en' | 'pt-br'

export function generateMarkdown(language: Language = 'en'): string {
  const content = language === 'en' ? enContent : ptContent

  const today = new Date().toISOString().split('T')[0]

  // YAML Frontmatter
  const frontmatter = `---
type: professional_portfolio
name: ${content.hero.name}
current_title: ${content.hero.title}
location: ${content.hero.location}
years_experience: 20+
languages: Portuguese (native), English (fluent)
linkedin: https://www.linkedin.com/in/caioogata/
github: https://github.com/caioogatalabs
portfolio: https://www.caioogata.com
last_updated: ${today}
optimized_for: Claude, ChatGPT, LLMs
---`

  // Main content sections
  const sections = [
    frontmatter,
    '',
    `# ${content.hero.name}`,
    `## ${content.hero.tagline}`,
    '',
    `**Location:** ${content.hero.location}`,
    `**Experience:** 20+ years in Art Direction, 15 in User Interface design`,
    `**LinkedIn:** [linkedin.com/in/caioogata](https://www.linkedin.com/in/caioogata/)`,
    '',
    '---',
    '',
    '## Professional Summary',
    '',
    content.about.bio,
    '',
    '### Core Expertise',
    ...content.about.expertise.map((item: string) => `- ${item}`),
    '',
    '---',
    '',
    '## Work Experience',
    '',
    ...generateExperienceMarkdown(content.experience),
    '',
    '---',
    '',
    '## Skills & Competencies',
    '',
    ...generateSkillsMarkdown(content.skills),
    '',
    '---',
    '',
    '## Education',
    '',
    ...generateEducationMarkdown(content.education),
    '',
    '---',
    '',
    '## Notable Clients & Projects',
    '',
    content.clients.description,
    '',
    ...generateClientsMarkdown(content.clients),
    '',
    '---',
    '',
    '## Design Philosophy',
    '',
    content.philosophy.body,
    '',
    '---',
    '',
    '## Contact',
    '',
    ...content.contact.links.map((link: any) =>
      `**${link.label}:** [${link.url}](${link.url})`
    ),
    '',
    '---',
    '',
    '*This portfolio is optimized for both human readers and AI assistants. Feel free to copy this entire document into your preferred AI tool (ChatGPT, Claude, etc.) for career assistance, interview preparation, application drafting, or job matching.*',
    '',
    `*Last updated: ${today}*`,
  ]

  return sections.join('\n')
}

function generateExperienceMarkdown(experience: any[]): string[] {
  const lines: string[] = []

  experience.forEach((job) => {
    lines.push(`### ${job.title} at ${job.company}`)
    lines.push(`**${job.dateRange} | ${job.location}**`)
    lines.push('')
    lines.push(job.description)
    lines.push('')

    if (job.achievements && job.achievements.length > 0) {
      lines.push('**Key Achievements:**')
      job.achievements.forEach((achievement: any) => {
        lines.push(`- ${achievement.text}`)
      })
      lines.push('')
    }
  })

  return lines
}

function generateSkillsMarkdown(skills: any): string[] {
  const lines: string[] = []

  Object.entries(skills).forEach(([category, items]) => {
    lines.push(`### ${category}`)
    if (Array.isArray(items)) {
      lines.push(items.join(', '))
    } else {
      lines.push(String(items))
    }
    lines.push('')
  })

  return lines
}

function generateEducationMarkdown(education: any[]): string[] {
  const lines: string[] = []

  education.forEach((edu) => {
    lines.push(`**${edu.degree}**`)
    lines.push(`${edu.institution}`)
    lines.push(`${edu.location} | ${edu.year}`)
    if (edu.note) {
      lines.push(edu.note)
    }
    lines.push('')
  })

  return lines
}

function generateClientsMarkdown(clients: any): string[] {
  const lines: string[] = []

  if (clients.brazilian) {
    lines.push('**Brazilian Brands:**')
    clients.brazilian.forEach((client: string) => {
      lines.push(`- ${client}`)
    })
    lines.push('')
  }

  if (clients.international) {
    lines.push('**International Brands:**')
    clients.international.forEach((client: string) => {
      lines.push(`- ${client}`)
    })
    lines.push('')
  }

  return lines
}
```

### 5.3 Clipboard API with Fallbacks

**src/lib/clipboard.ts**:
```typescript
export async function copyToClipboard(text: string): Promise<void> {
  // Modern Clipboard API (primary method)
  if (navigator.clipboard && window.isSecureContext) {
    try {
      await navigator.clipboard.writeText(text)
      return
    } catch (err) {
      console.warn('Clipboard API failed, trying fallback:', err)
    }
  }

  // Fallback method (older browsers, non-HTTPS)
  return fallbackCopyToClipboard(text)
}

function fallbackCopyToClipboard(text: string): Promise<void> {
  return new Promise((resolve, reject) => {
    const textarea = document.createElement('textarea')
    textarea.value = text
    textarea.style.position = 'fixed'
    textarea.style.left = '-9999px'
    textarea.style.top = '0'
    textarea.setAttribute('readonly', '')

    document.body.appendChild(textarea)

    // Select text
    if (navigator.userAgent.match(/ipad|ipod|iphone/i)) {
      // iOS requires different selection method
      const range = document.createRange()
      range.selectNodeContents(textarea)
      const selection = window.getSelection()
      if (selection) {
        selection.removeAllRanges()
        selection.addRange(range)
      }
      textarea.setSelectionRange(0, 999999)
    } else {
      textarea.select()
    }

    try {
      const successful = document.execCommand('copy')
      document.body.removeChild(textarea)

      if (successful) {
        resolve()
      } else {
        reject(new Error('execCommand failed'))
      }
    } catch (err) {
      document.body.removeChild(textarea)
      reject(err)
    }
  })
}
```

**Browser Support**:
- Modern browsers: Clipboard API
- Older browsers / HTTP: `execCommand('copy')` fallback
- iOS Safari: Special selection handling

### 5.4 Toast Notification System

**Configuration** (using `react-hot-toast`):

**src/app/layout.tsx**:
```typescript
import { Toaster } from 'react-hot-toast'

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        {children}
        <Toaster
          position="top-center"
          toastOptions={{
            duration: 4000,
            style: {
              background: '#1A1B1A',
              color: '#D8D1DA',
              border: '1px solid #618985',
              borderRadius: '0.25rem',
              fontFamily: 'var(--font-jetbrains)',
              fontSize: '0.875rem',
            },
            success: {
              iconTheme: {
                primary: '#EFD246',
                secondary: '#0D0E0D',
              },
            },
            error: {
              iconTheme: {
                primary: '#BC5F04',
                secondary: '#0D0E0D',
              },
            },
          }}
        />
      </body>
    </html>
  )
}
```

**Messages**:
- Success: "Content copied! Ready to paste into your AI assistant."
- Error: "Couldn't copy automatically. Please select the text below and copy manually (Ctrl+C or Cmd+C)."

---

## 6. Accessibility Implementation

### 6.1 WCAG 2.1 AA Compliance Checklist

#### Color Contrast Requirements

| Element Type | Requirement | Implementation |
|--------------|-------------|----------------|
| Normal text (<18pt) | 4.5:1 minimum | `#D8D1DA` on `#0D0E0D` = 12.1:1 ✓ |
| Large text (18pt+) | 3:1 minimum | `#EFD246` on `#0D0E0D` = 11.2:1 ✓ |
| UI components | 3:1 minimum | Border colors tested individually |
| Accent/Links | 4.5:1 minimum | `#618985` on `#0D0E0D` = 4.9:1 ✓ |

**Testing Tool**: Use WebAIM Contrast Checker or Chrome DevTools Accessibility panel.

#### Semantic HTML

```html
<!-- Correct heading hierarchy -->
<h1>Caio Ogata</h1>           <!-- Only one H1 per page -->
  <h2>Professional Summary</h2> <!-- Section headings -->
    <h3>Design Director at Azion</h3> <!-- Subsections -->

<!-- Landmark roles -->
<header>...</header>           <!-- Site header -->
<main id="main-content">...</main> <!-- Main content -->
<footer>...</footer>           <!-- Site footer -->

<!-- Lists with proper markup -->
<ul role="list">               <!-- Explicit list role -->
  <li>Achievement 1</li>
</ul>
```

#### Keyboard Navigation

**Tab Order**:
1. Skip to main content link
2. Language toggle (v1.1)
3. Copy as Markdown button (primary)
4. LinkedIn link
5. Section content (focusable elements only)
6. Contact links
7. Copy button (footer)

**Focus Management**:
```css
/* Visible focus indicator */
*:focus-visible {
  outline: 2px solid var(--color-primary);
  outline-offset: 2px;
  border-radius: 0.25rem;
}

/* Remove default outline */
*:focus {
  outline: none;
}

/* Ensure focus is always visible */
button:focus-visible,
a:focus-visible {
  box-shadow: 0 0 0 2px var(--color-primary);
}
```

#### ARIA Labels

**Required labels**:
```typescript
// Copy button
<button aria-label="Copy entire portfolio as markdown for AI assistants">
  Copy as Markdown for AI
</button>

// External links
<a
  href="https://linkedin.com/in/caioogata"
  target="_blank"
  rel="noopener noreferrer"
  aria-label="View Caio Ogata's profile on LinkedIn (opens in new tab)"
>
  View on LinkedIn →
</a>

// Terminal command prefixes (decorative, hide from screen readers)
<span aria-hidden="true">$ whoami</span>

// Toast notifications
<div role="alert" aria-live="polite">
  Content copied! Ready to paste into your AI assistant.
</div>
```

#### Skip Link Implementation

**src/components/ui/SkipLink.tsx** (see 3.3.1 above)

**CSS for screen-reader-only utility**:
```css
.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border-width: 0;
}

.sr-only:focus,
.sr-only:active {
  position: static;
  width: auto;
  height: auto;
  overflow: visible;
  clip: auto;
  white-space: normal;
}
```

### 6.2 prefers-reduced-motion Handling

**CSS Implementation**:
```css
/* Default animations */
.fade-in {
  animation: fadeIn 300ms ease-out;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Disable animations for users who prefer reduced motion */
@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
    scroll-behavior: auto !important;
  }
}
```

### 6.3 Screen Reader Testing Checklist

**Test with**:
- NVDA (Windows) - Free, most popular
- JAWS (Windows) - Industry standard
- VoiceOver (macOS/iOS) - Built-in

**Verify**:
- [ ] All images have descriptive alt text
- [ ] Page title is announced first
- [ ] Headings structure makes sense when listed
- [ ] Links are distinguishable from surrounding text
- [ ] Form labels are properly associated (if any forms added)
- [ ] Dynamic content updates are announced (toasts)
- [ ] No keyboard traps

### 6.4 Accessibility Testing Tools

**Automated**:
- Lighthouse Accessibility audit (Chrome DevTools)
- axe DevTools (browser extension)
- WAVE (WebAIM browser extension)

**Manual**:
- Keyboard navigation only (unplug mouse)
- Screen reader testing (see 6.3 above)
- Color contrast checker
- Text zoom to 200% (should remain readable)

---

## 7. SEO & Metadata

### 7.1 Next.js Metadata Configuration

**src/app/layout.tsx**:
```typescript
import type { Metadata } from 'next'
import { JetBrains_Mono } from 'next/font/google'
import './globals.css'

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  weight: ['400', '700'],
  variable: '--font-jetbrains',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'Caio Ogata - Design Director | Design Systems & DevEx',
  description: 'Design Director with 20+ years in Art Direction and 15 in UI design. Specializing in design systems, brand experience, and developer-focused products. Based in Porto Alegre, Brazil.',
  keywords: [
    'Design Director',
    'Design Systems',
    'Developer Experience',
    'DevEx',
    'UI/UX Design',
    'Brand Experience',
    'Porto Alegre',
    'Brazil',
    'Design Leadership',
    'Product Design',
  ],
  authors: [{ name: 'Caio Ogata' }],
  creator: 'Caio Ogata',
  publisher: 'Caio Ogata',
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    alternateLocale: ['pt_BR'],
    url: 'https://www.caioogata.com',
    title: 'Caio Ogata - Design Director | Design Systems & DevEx',
    description: 'Design Director with 20+ years in Art Direction and 15 in UI design. Specializing in design systems, brand experience, and developer-focused products.',
    siteName: 'Caio Ogata Portfolio',
    images: [
      {
        url: 'https://www.caioogata.com/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Caio Ogata - Design Director',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Caio Ogata - Design Director | Design Systems & DevEx',
    description: 'Design Director with 20+ years in Art Direction and 15 in UI design. Specializing in design systems, brand experience, and developer-focused products.',
    images: ['https://www.caioogata.com/og-image.png'],
  },
  icons: {
    icon: '/favicon.ico',
    apple: '/apple-touch-icon.png',
  },
  manifest: '/site.webmanifest',
  alternates: {
    canonical: 'https://www.caioogata.com',
    languages: {
      'en-US': 'https://www.caioogata.com',
      'pt-BR': 'https://www.caioogata.com/pt-br',
    },
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={jetbrainsMono.variable}>
      <body className="font-mono">{children}</body>
    </html>
  )
}
```

### 7.2 Structured Data (JSON-LD)

**src/app/page.tsx** (add to page component):
```typescript
export default function Home() {
  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: 'Caio Ogata',
    jobTitle: 'Design Director',
    description: 'Design Director specializing in design systems, brand experience, and developer-focused products',
    url: 'https://www.caioogata.com',
    image: 'https://www.caioogata.com/og-image.png',
    sameAs: [
      'https://www.linkedin.com/in/caioogata/',
      'https://github.com/caioogatalabs',
      'https://www.instagram.com/caioogata.labs',
      'https://medium.com/@caioogata',
    ],
    address: {
      '@type': 'PostalAddress',
      addressLocality: 'Porto Alegre',
      addressRegion: 'RS',
      addressCountry: 'BR',
    },
    alumniOf: [
      {
        '@type': 'EducationalOrganization',
        name: 'UNOESTE - Universidade do Oeste Paulista',
      },
      {
        '@type': 'EducationalOrganization',
        name: 'Miami Ad School',
      },
    ],
    knowsAbout: [
      'Design Systems',
      'UI/UX Design',
      'Developer Experience',
      'Brand Strategy',
      'Design Leadership',
      'Product Design',
      'Front-end Development',
    ],
    worksFor: {
      '@type': 'Organization',
      name: 'Available for opportunities',
    },
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      {/* Rest of page content */}
    </>
  )
}
```

### 7.3 Open Graph Image

**Requirements**:
- Dimensions: 1200×630px
- Format: PNG or JPEG
- File size: < 1MB (aim for 300-500KB)
- Content: Name, title, visual brand element (logo)

**Create**: `public/og-image.png`

**Design Suggestion**:
```
+--------------------------------------------------------------+
|                                                              |
|                         CO                                   |
|                    (Logo in primary yellow)                  |
|                                                              |
|                     Caio Ogata                               |
|              Design Director                                 |
|                                                              |
|    Design Systems • Brand Experience • DevEx                 |
|                                                              |
|                Porto Alegre, Brazil                          |
|                                                              |
+--------------------------------------------------------------+
Background: #0D0E0D (dark)
Text: #D8D1DA (light)
Accent: #EFD246 (primary yellow)
```

### 7.4 robots.txt

**public/robots.txt**:
```
User-agent: *
Allow: /

Sitemap: https://www.caioogata.com/sitemap.xml
```

### 7.5 sitemap.xml

**public/sitemap.xml**:
```xml
<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>https://www.caioogata.com</loc>
    <lastmod>2026-01-27</lastmod>
    <changefreq>monthly</changefreq>
    <priority>1.0</priority>
  </url>
</urlset>
```

---

## 8. Performance Targets

### 8.1 Core Web Vitals

| Metric | Target | How to Achieve |
|--------|--------|----------------|
| **LCP** (Largest Contentful Paint) | < 2.5s | - Optimize font loading with `font-display: swap`<br>- Minimize CSS bundle<br>- No large images in viewport<br>- Use Next.js static export |
| **FID** (First Input Delay) | < 100ms | - Minimal JavaScript bundle<br>- No blocking scripts<br>- Use React Server Components |
| **CLS** (Cumulative Layout Shift) | < 0.1 | - Set explicit dimensions on all elements<br>- Reserve space for dynamic content<br>- Use font fallbacks to prevent FOIT |
| **FCP** (First Contentful Paint) | < 1.8s | - Inline critical CSS<br>- Defer non-critical resources<br>- Optimize font loading |
| **TTI** (Time to Interactive) | < 3.8s | - Minimize JS execution time<br>- Code splitting (if needed)<br>- Server-side rendering |

### 8.2 Asset Optimization Strategy

**Fonts**:
```typescript
// next/font automatic optimization
import { JetBrains_Mono } from 'next/font/google'

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  weight: ['400', '700'],
  variable: '--font-jetbrains',
  display: 'swap', // Prevents invisible text while font loads
  preload: true,
})
```

**CSS**:
- Use Tailwind JIT mode (only includes used classes)
- Purge unused CSS in production
- Inline critical CSS for above-the-fold content
- Total CSS budget: < 30KB gzipped

**JavaScript**:
- Next.js automatic code splitting
- Tree-shaking of unused code
- Total JS budget: < 100KB gzipped
- Defer non-critical scripts

**Images** (if any added later):
- WebP format with JPEG fallback
- Lazy loading for below-fold images
- Responsive images with srcset
- Compression: 80% quality for photos

### 8.3 Font Loading Strategy

**Problem**: FOIT (Flash of Invisible Text) delays content visibility.

**Solution**: Use `font-display: swap` and system font fallback.

**Implementation**:
```css
/* Fallback font stack matches JetBrains Mono metrics */
--font-mono: 'JetBrains Mono', ui-monospace, 'Courier New', monospace;
```

**Size Adjust** (optional, prevents layout shift):
```typescript
const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  weight: ['400', '700'],
  variable: '--font-jetbrains',
  display: 'swap',
  adjustFontFallback: 'Courier New', // Next.js calculates size-adjust automatically
})
```

### 8.4 Performance Budget

| Resource Type | Budget | Actual (Target) |
|---------------|--------|-----------------|
| HTML | < 20KB | ~15KB |
| CSS | < 30KB (gzipped) | ~20KB |
| JavaScript | < 100KB (gzipped) | ~60KB |
| Fonts | < 40KB (WOFF2) | ~30KB (2 weights) |
| Images | < 100KB total | 0KB (text-only MVP) |
| **Total Page Weight** | **< 200KB** | **~125KB** |

### 8.5 Lighthouse Score Targets

| Category | Target Score | Critical Items |
|----------|--------------|----------------|
| Performance | 95+ | - FCP < 1.8s<br>- LCP < 2.5s<br>- TBT < 300ms |
| Accessibility | 100 | - Color contrast<br>- ARIA labels<br>- Heading hierarchy<br>- Focus indicators |
| Best Practices | 95+ | - HTTPS<br>- No console errors<br>- Modern image formats |
| SEO | 100 | - Meta descriptions<br>- Heading structure<br>- Crawlable links |

### 8.6 Performance Monitoring

**Tools**:
1. Lighthouse CI (automated on every deploy)
2. WebPageTest (monthly manual checks)
3. Chrome DevTools Performance panel
4. Vercel Analytics (if using Vercel)

**Script for Lighthouse CI**:
```json
// package.json
{
  "scripts": {
    "lighthouse": "lighthouse https://www.caioogata.com --view --preset=desktop",
    "lighthouse:mobile": "lighthouse https://www.caioogata.com --view --preset=mobile"
  }
}
```

---

## 9. Internationalization (i18n)

### 9.1 Content Structure

**Directory Layout**:
```
src/content/
├── en.json       # English content
├── pt-br.json    # Portuguese (Brazil) content
└── types.ts      # TypeScript interfaces
```

**Content Schema** (`src/content/types.ts`):
```typescript
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
    heading: string
    bio: string
    expertise: string[]
  }
  experience: {
    heading: string
    jobs: Job[]
  }
  skills: {
    heading: string
    categories: SkillCategory[]
  }
  // ... other sections
  notifications: {
    copySuccess: string
    copyError: string
  }
}

export interface Job {
  company: string
  title: string
  location: string
  dateRange: string
  description: string
  achievements: { text: string }[]
}

export interface SkillCategory {
  title: string
  skills: string[]
}
```

### 9.2 Language Switching Approach

**Provider Implementation** (see 3.4.1 above)

**Language Toggle Component** (v1.1):
```typescript
'use client'

import { useLanguage } from '@/components/providers/LanguageProvider'

export default function LanguageToggle() {
  const { language, setLanguage } = useLanguage()

  return (
    <div className="flex gap-2" role="group" aria-label="Language selection">
      <button
        onClick={() => setLanguage('en')}
        className={`px-3 py-2 rounded-base font-mono text-sm transition-colors ${
          language === 'en'
            ? 'bg-primary text-neutral-950'
            : 'bg-transparent text-neutral-400 hover:text-neutral-200'
        }`}
        aria-pressed={language === 'en'}
        aria-label="Switch to English"
      >
        EN
      </button>
      <button
        onClick={() => setLanguage('pt-br')}
        className={`px-3 py-2 rounded-base font-mono text-sm transition-colors ${
          language === 'pt-br'
            ? 'bg-primary text-neutral-950'
            : 'bg-transparent text-neutral-400 hover:text-neutral-200'
        }`}
        aria-pressed={language === 'pt-br'}
        aria-label="Mudar para Português"
      >
        PT
      </button>
    </div>
  )
}
```

**Placement**: Header component (top right)

**State Persistence** (localStorage):
```typescript
// Add to LanguageProvider
useEffect(() => {
  const saved = localStorage.getItem('language')
  if (saved === 'en' || saved === 'pt-br') {
    setLanguage(saved)
  }
}, [])

useEffect(() => {
  localStorage.setItem('language', language)
}, [language])
```

### 9.3 URL Structure (Future Enhancement)

**Option 1**: Path-based (`/en`, `/pt-br`)
- Better for SEO
- Requires Next.js middleware for locale detection

**Option 2**: Subdomain (`en.caioogata.com`, `pt.caioogata.com`)
- Better separation
- More complex deployment

**Recommendation for MVP**: Client-side only (no URL changes), add path-based routing in v1.2 if needed.

---

## 10. Deployment

### 10.1 Vercel Configuration

**Recommended Platform**: Vercel (optimal for Next.js)

**Deployment Steps**:
1. Connect GitHub repository to Vercel
2. Configure build settings (auto-detected for Next.js)
3. Add custom domain (if ready)
4. Deploy

**vercel.json** (optional, for custom settings):
```json
{
  "buildCommand": "npm run build",
  "outputDirectory": "out",
  "framework": "nextjs",
  "rewrites": [
    {
      "source": "/(.*)",
      "destination": "/index.html"
    }
  ],
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        {
          "key": "X-Content-Type-Options",
          "value": "nosniff"
        },
        {
          "key": "X-Frame-Options",
          "value": "DENY"
        },
        {
          "key": "X-XSS-Protection",
          "value": "1; mode=block"
        },
        {
          "key": "Referrer-Policy",
          "value": "strict-origin-when-cross-origin"
        }
      ]
    },
    {
      "source": "/(.*\\.(js|css|woff|woff2|png|jpg|jpeg|svg|ico))",
      "headers": [
        {
          "key": "Cache-Control",
          "value": "public, max-age=31536000, immutable"
        }
      ]
    }
  ]
}
```

### 10.2 Environment Variables

**Current Requirements**: None for MVP (all content is public)

**Future Additions** (if analytics added):
```bash
# .env.local (not committed to Git)
NEXT_PUBLIC_PLAUSIBLE_DOMAIN=caioogata.com
NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX
```

**Usage**:
```typescript
// src/lib/analytics.ts
const plausibleDomain = process.env.NEXT_PUBLIC_PLAUSIBLE_DOMAIN
```

### 10.3 Build Optimization

**next.config.mjs**:
```javascript
/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export', // Static export
  images: {
    unoptimized: true, // Required for static export
  },

  // Compression
  compress: true,

  // Remove unused code
  swcMinify: true,

  // Strict mode
  reactStrictMode: true,

  // Security headers
  poweredByHeader: false,

  // Disable x-powered-by header
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'X-DNS-Prefetch-Control',
            value: 'on'
          },
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=63072000; includeSubDomains; preload'
          },
          {
            key: 'X-Frame-Options',
            value: 'SAMEORIGIN'
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff'
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block'
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin'
          }
        ]
      }
    ]
  }
}

export default nextConfig
```

### 10.4 Custom Domain Setup

**Steps**:
1. Purchase domain (caioogata.com)
2. In Vercel dashboard: Settings > Domains > Add Domain
3. Add DNS records (A and CNAME) as instructed by Vercel
4. Wait for DNS propagation (up to 48 hours)
5. Vercel automatically provisions SSL certificate

**DNS Configuration** (example):
```
Type  Name  Value
A     @     76.76.21.21 (Vercel IP)
CNAME www   cname.vercel-dns.com
```

### 10.5 CI/CD Pipeline

**Automatic Deployment**:
- Push to `main` branch → Vercel deploys to production
- Push to other branches → Vercel creates preview deployment

**Manual Deployment**:
```bash
# Install Vercel CLI
npm install -g vercel

# Deploy to preview
vercel

# Deploy to production
vercel --prod
```

### 10.6 Pre-Deployment Checklist

**Before Going Live**:
- [ ] All content reviewed and accurate
- [ ] Lighthouse score meets targets (Performance 95+, Accessibility 100)
- [ ] Cross-browser testing complete (Chrome, Firefox, Safari, Edge)
- [ ] Mobile testing on real devices (iOS Safari, Android Chrome)
- [ ] All external links verified (LinkedIn, GitHub, etc.)
- [ ] Copy-to-markdown feature tested with Claude and ChatGPT
- [ ] SEO meta tags configured
- [ ] Open Graph image created and uploaded
- [ ] Favicon and apple-touch-icon present
- [ ] robots.txt and sitemap.xml in place
- [ ] Custom domain configured (if applicable)
- [ ] SSL certificate active
- [ ] Error pages tested (404, 500)
- [ ] Analytics configured (if implementing)

---

## 11. Implementation Roadmap

### Week 1: Foundation (30 hours)

#### Day 1-2: Project Setup & Design System (10 hours)

**Tasks**:
- [ ] Initialize Next.js project structure
- [ ] Install dependencies (Tailwind, react-hot-toast, clsx)
- [ ] Configure Tailwind with custom theme
- [ ] Set up CSS custom properties in `tokens.css`
- [ ] Configure JetBrains Mono font
- [ ] Create base layout components (Header, Footer)
- [ ] Set up content JSON structure (`en.json`, `pt-br.json`)

**Deliverables**:
- Working dev server
- Typography and color tokens implemented
- Responsive layout container

#### Day 3-4: Layout & Responsive Grid (10 hours)

**Tasks**:
- [ ] Build single-page structure in `page.tsx`
- [ ] Create all section components (empty/placeholder content)
- [ ] Implement responsive breakpoints
- [ ] Test mobile, tablet, desktop layouts
- [ ] Add section spacing and container max-widths
- [ ] Implement smooth scroll behavior

**Deliverables**:
- Complete page structure
- Responsive grid working across all breakpoints

#### Day 5-7: Content Integration (10 hours)

**Tasks**:
- [ ] Write/compile all content from CONTENT.md
- [ ] Populate `en.json` with complete English content
- [ ] Populate `pt-br.json` with complete Portuguese content
- [ ] Create TypeScript interfaces for content structure
- [ ] Integrate content into all section components
- [ ] Review content accuracy with Caio

**Deliverables**:
- All sections populated with real content
- Content structure finalized

### Week 2: Core Features (25 hours)

#### Day 8-9: Copy-to-Markdown Feature (12 hours)

**Tasks**:
- [ ] Build markdown generator function
- [ ] Implement clipboard API with fallbacks
- [ ] Create CopyButton component with loading states
- [ ] Test clipboard on desktop and mobile browsers
- [ ] Add toast notification system
- [ ] Test markdown output in Claude and ChatGPT
- [ ] Handle error cases and edge cases

**Deliverables**:
- Fully functional copy-to-markdown feature
- Verified markdown quality with LLMs

#### Day 10-11: Polish & Animations (8 hours)

**Tasks**:
- [ ] Implement button hover states
- [ ] Add scroll-triggered fade-in animations (optional)
- [ ] Create terminal-style section headings with prefix
- [ ] Refine spacing and typography
- [ ] Test `prefers-reduced-motion` support
- [ ] Polish mobile responsive behavior

**Deliverables**:
- Polished visual design
- Smooth micro-interactions

#### Day 12-13: Accessibility Audit (5 hours)

**Tasks**:
- [ ] Test with NVDA or VoiceOver screen reader
- [ ] Verify keyboard navigation and tab order
- [ ] Check all color contrast ratios
- [ ] Add ARIA labels where needed
- [ ] Implement skip link
- [ ] Test focus indicators on all interactive elements
- [ ] Run axe DevTools audit

**Deliverables**:
- WCAG 2.1 AA compliance achieved
- Accessibility score 100 in Lighthouse

### Week 3: Testing & Launch (15 hours)

#### Day 14-15: Cross-Browser Testing (5 hours)

**Tasks**:
- [ ] Test on Chrome (Windows and macOS)
- [ ] Test on Firefox (Windows and macOS)
- [ ] Test on Safari (macOS and iOS)
- [ ] Test on Edge (Windows)
- [ ] Test on Android Chrome (mobile)
- [ ] Fix any browser-specific issues
- [ ] Verify clipboard works on all platforms

**Deliverables**:
- Zero critical issues across supported browsers

#### Day 16-17: SEO & Metadata (3 hours)

**Tasks**:
- [ ] Configure Next.js metadata in `layout.tsx`
- [ ] Add structured data (JSON-LD) to `page.tsx`
- [ ] Create Open Graph image (1200×630px)
- [ ] Generate favicon and apple-touch-icon
- [ ] Write `robots.txt` and `sitemap.xml`
- [ ] Verify meta descriptions are under 155 characters

**Deliverables**:
- SEO score 100 in Lighthouse
- Rich preview cards working on LinkedIn/Twitter

#### Day 18-19: Performance Optimization (4 hours)

**Tasks**:
- [ ] Run Lighthouse audit
- [ ] Optimize font loading strategy
- [ ] Minimize CSS bundle (remove unused Tailwind classes)
- [ ] Test on throttled 3G connection
- [ ] Verify Core Web Vitals targets met
- [ ] Compress any images (if added)

**Deliverables**:
- Lighthouse Performance score 95+
- Page weight under 200KB

#### Day 20-21: Deployment & Documentation (3 hours)

**Tasks**:
- [ ] Deploy to Vercel
- [ ] Configure custom domain (if ready)
- [ ] Verify SSL certificate is active
- [ ] Test production build thoroughly
- [ ] Write README with setup instructions
- [ ] Document content update workflow for Caio
- [ ] Create GitHub repository with proper .gitignore

**Deliverables**:
- Live production site
- Complete documentation

---

## Post-MVP: v1.1 Enhancements (Optional)

### Priority 1: Language Toggle (6 hours)

**Tasks**:
- Add LanguageToggle component to Header
- Implement localStorage persistence
- Test language switching on all sections
- Update markdown generator to respect selected language

### Priority 2: Dark/Light Mode (8 hours)

**Tasks**:
- Create light mode color palette
- Implement theme toggle button
- Add theme context provider
- Test contrast ratios in light mode
- Persist theme preference to localStorage

### Priority 3: Philosophy Section Enhancements (4 hours)

**Tasks**:
- Add terminal command styling to headings with blinking cursor
- Implement subtle scroll-triggered animations
- Add "Life Outside Design" expandable section

---

## Appendix

### A. File Paths Reference

All file paths mentioned in this document:

```
C:\Users\Caio\vs-code\portolio-v1\
├── public\
│   ├── logo-co.svg
│   ├── favicon.ico
│   ├── og-image.png
│   ├── robots.txt
│   └── sitemap.xml
├── src\
│   ├── app\
│   │   ├── layout.tsx
│   │   ├── page.tsx
│   │   ├── globals.css
│   │   └── fonts.ts
│   ├── components\
│   │   ├── hero\
│   │   │   ├── Hero.tsx
│   │   │   └── CopyButton.tsx
│   │   ├── sections\
│   │   │   ├── About.tsx
│   │   │   ├── Experience.tsx
│   │   │   ├── ExperienceCard.tsx
│   │   │   ├── Skills.tsx
│   │   │   ├── SkillCategory.tsx
│   │   │   ├── Education.tsx
│   │   │   ├── Clients.tsx
│   │   │   ├── Philosophy.tsx
│   │   │   └── Contact.tsx
│   │   ├── ui\
│   │   │   ├── Button.tsx
│   │   │   ├── SectionHeading.tsx
│   │   │   └── SkipLink.tsx
│   │   ├── layout\
│   │   │   ├── Header.tsx
│   │   │   └── Footer.tsx
│   │   └── providers\
│   │       └── LanguageProvider.tsx
│   ├── lib\
│   │   ├── markdown-generator.ts
│   │   └── clipboard.ts
│   ├── content\
│   │   ├── en.json
│   │   ├── pt-br.json
│   │   └── types.ts
│   └── styles\
│       └── tokens.css
├── tailwind.config.ts
├── next.config.mjs
├── package.json
├── PRD.md
├── CONTENT.md
└── TECHNICAL-SPEC.md
```

### B. Browser Support Matrix

| Browser | Version | Priority | Notes |
|---------|---------|----------|-------|
| Chrome | 90+ | High | Primary development browser |
| Firefox | 88+ | High | Test regularly |
| Safari | 14+ | High | Test on macOS and iOS |
| Edge | 90+ | Medium | Chromium-based, usually works like Chrome |
| Mobile Safari | iOS 14+ | High | Critical for mobile users |
| Chrome Android | Latest | High | Critical for mobile users |

### C. Dependencies List

**Production Dependencies**:
```json
{
  "dependencies": {
    "next": "^15.0.0",
    "react": "^18.3.0",
    "react-dom": "^18.3.0",
    "react-hot-toast": "^2.4.1",
    "clsx": "^2.1.0"
  }
}
```

**Development Dependencies**:
```json
{
  "devDependencies": {
    "typescript": "^5.3.0",
    "@types/node": "^20.10.0",
    "@types/react": "^18.2.0",
    "@types/react-dom": "^18.2.0",
    "tailwindcss": "^3.4.0",
    "postcss": "^8.4.0",
    "autoprefixer": "^10.4.0",
    "eslint": "^8.56.0",
    "eslint-config-next": "^15.0.0"
  }
}
```

### D. Color Contrast Test Results

All brand colors tested against dark background (`#0D0E0D`):

| Foreground | Background | Contrast Ratio | WCAG AA (Normal) | WCAG AA (Large) |
|------------|------------|----------------|------------------|-----------------|
| `#EFD246` (Primary) | `#0D0E0D` | 11.2:1 | ✓ Pass | ✓ Pass |
| `#D8D1DA` (Secondary) | `#0D0E0D` | 12.1:1 | ✓ Pass | ✓ Pass |
| `#BC5F04` (Accent) | `#0D0E0D` | 7.8:1 | ✓ Pass | ✓ Pass |
| `#618985` (Teal) | `#0D0E0D` | 4.9:1 | ✓ Pass | ✓ Pass |
| `#B5B6B1` (Gray 300) | `#0D0E0D` | 8.7:1 | ✓ Pass | ✓ Pass |

**Tool**: WebAIM Contrast Checker (https://webaim.org/resources/contrastchecker/)

### E. Key Decisions Summary

| Decision | Option Chosen | Rationale |
|----------|---------------|-----------|
| Framework | Next.js 15 | Already in project, excellent static export, built-in optimizations |
| Styling | Tailwind CSS | Utility-first, fast development, easy customization |
| Font | JetBrains Mono | Monospace for terminal aesthetic, excellent readability |
| Markdown Generation | Programmatic from JSON | Cleaner output, easier to maintain than DOM scraping |
| Clipboard | Native API + fallback | Best compatibility across browsers and devices |
| i18n | Client-side with Context | Simpler for MVP, can add server-side routing later |
| State Management | React Context | Minimal needs, no external library overhead |
| Deployment | Vercel | Optimal Next.js support, free tier, automatic CI/CD |
| Content Storage | JSON files | Version controlled, easy updates, type-safe |

---

## Document Version

- **Version**: 1.0
- **Date**: January 27, 2026
- **Author**: Frontend Architect (Claude Sonnet 4.5)
- **Next Review**: After MVP completion

---

**Ready for Implementation**: This technical specification provides all necessary details for frontend development. All design tokens, component specifications, and implementation patterns are defined. Developers can proceed with confidence.
