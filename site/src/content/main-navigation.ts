export interface MainNavItem {
  href: string
  /** Key into `ui.pageNav.titles` — the rendered title is language-dependent. */
  key: 'home' | 'about' | 'experience' | 'projects' | 'philosophy'
}

// No /contact route — the footer carries the email with a copy action.
export const MAIN_NAVIGATION: MainNavItem[] = [
  { href: '/', key: 'home' },
  { href: '/about', key: 'about' },
  { href: '/experience', key: 'experience' },
  { href: '/projects', key: 'projects' },
  { href: '/philosophy', key: 'philosophy' },
]
