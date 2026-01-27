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
        'neutral-dark': '#22221F',
        'neutral-teal': '#618985',

        // Extended neutral scale
        neutral: {
          DEFAULT: '#22221F',
          50: '#F9FAF5',
          100: '#EEEFEA',
          200: '#D8D1DA',
          300: '#B5B6B1',
          400: '#8B8C87',
          600: '#618985',
          700: '#4A4B46',
          800: '#22221F',
          900: '#22221F',
          950: '#22221F',
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
        '3xl': ['1.875rem', { lineHeight: '1.25' }],
        '4xl': ['2rem', { lineHeight: '1.2' }],
        '5xl': ['2.25rem', { lineHeight: '1.2' }],
        '6xl': ['3rem', { lineHeight: '1.1' }],
      },
      spacing: {
        '18': '4.5rem',
        '22': '5.5rem',
        // Standardized spacing tokens
        'section': '3rem',      // 48px - spacing between sections
        'section-lg': '5rem',   // 80px - larger section spacing
        'content': '1.5rem',    // 24px - spacing within content blocks
        'content-sm': '1rem',   // 16px - smaller content spacing
        'element': '0.75rem',   // 12px - spacing between related elements
        'element-sm': '0.5rem', // 8px - tight element spacing
        'list': '0.375rem',     // 6px - spacing in lists
      },
      maxWidth: {
        'content': '1200px',
        'content-inner': 'calc(1200px - 3rem)',
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
