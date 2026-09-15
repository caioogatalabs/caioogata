export interface MainNavItem {
  href: string
  /** Key into `ui.pageNav.titles` — the rendered title is language-dependent. */
  key: 'home' | 'about' | 'experience' | 'projects' | 'philosophy'
}

// /contact intentionally excluded — opens via overlay from MenuSection /
// FloatingContactButton, not as a standalone routed page.
export const MAIN_NAVIGATION: MainNavItem[] = [
  { href: '/', key: 'home' },
  { href: '/about', key: 'about' },
  { href: '/experience', key: 'experience' },
  { href: '/projects', key: 'projects' },
  { href: '/philosophy', key: 'philosophy' },
]
